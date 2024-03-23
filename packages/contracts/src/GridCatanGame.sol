// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.13;

import "./GridResource1155.sol";
import "solmate/auth/Owned.sol";

contract GridCatanGame is Owned {

    address public gridLand721;
    address public gridResource1155;
    uint256 public resourceEpoch =2;
    uint256 public travelTimePerDist=10;

    struct Location {
        uint8 x;
        uint8 y;
    }
    struct Land {
        Location location;
        address owner;
        LandType landType;
        uint256 workers;
        uint256 totalSoldiers;

        uint256 attackingSoldiers; //if 0 means not attacking
        uint256 destinationId;
        Location destination; // if x:99, y:99 means not attacking
        uint256 timeOfAttack; // if 0 means not attacking
        uint256 timeOfLastResourceCollect;
    }

    mapping(uint256 => Land) public landInfo;

    // id mapping for resources
    // 0 - sugar
    // 1 - milk
    // 2 - tapioca
    // 3 - sesame
    // 4 - wheat
    // 5 - boba
    // 6 - sesame bun

    enum LandType {
        SUGAR,
        MILK,
        TAPIOCA,
        SESAME,
        WHEAT,
        BOBA,
        SESAME_BUN
    }

    //modifiers
    modifier onlyGridLand721() {
        require(msg.sender == gridLand721, "Caller is not the gridLand721 address");
        _;
    }

    constructor(
        address _gridLand721,
        address _gridResource1155
    ) Owned(msg.sender) {
        gridLand721 = _gridLand721;
        gridResource1155 = _gridResource1155;
    }
    
    // ===== View funcs =====
    function getLocation(uint256 landId) public pure returns (uint8, uint8){
        return (
            uint8(landId % 5),
            uint8(landId / 5)
        );
    }

    function getManhattanDistance(uint256 fromLandId, uint256 toLandId) public pure returns (uint256) {
        (uint8 fromX, uint8 fromY) = getLocation(fromLandId);
        (uint8 toX, uint8 toY) = getLocation(toLandId);

        require(fromX < 5 && toX < 5, "X > width.");
        require(fromY < 5 && toY < 5, "Y > height.");

        // Calculate the absolute difference in x coordinates
        uint256 dx = (fromX > toX) ? fromX - toX : toX - fromX;

        // Calculate the absolute difference in y coordinates
        uint256 dy = (fromY > toY) ? fromY - toY : toY - fromY;

        // Return the sum of the absolute differences (Manhattan Distance)
        return dx + dy;
    }

    function getArrivalTimeToDestination(uint256 fromLandId, uint256 toLandId) public view returns (uint256) {

        // get attacking start time
        uint256 startTime = landInfo[fromLandId].timeOfAttack;
        require(startTime!=0, "Not attacking");

        uint256 distance = getManhattanDistance(fromLandId, toLandId);
        return (distance * travelTimePerDist) + startTime;
    }

    function getTimeToDestination(uint256 fromLandId, uint256 toLandId) public view returns (uint256){
        return getArrivalTimeToDestination(fromLandId, toLandId) > block.timestamp ? 
            getArrivalTimeToDestination(fromLandId, toLandId) - block.timestamp : 0;
    }

    function getLandIdFromXY(uint8 x, uint8 y) public pure returns (uint256) {
        return uint256(x) + uint256(y) * 5;
    }

    // ===== Setter funcs =====
    function landInitialize(uint256 landId, address _owner) public onlyGridLand721 {
        // initialize land type randomly with hash of block timestamp and id
        // max landtype id is 4
        uint8 landtype = uint8(
            keccak256(abi.encodePacked(landId, block.timestamp, _owner))[31]
        ) % 5;
        
        (uint8 locationX, uint8 locationY) = getLocation(landId);

        landInfo[landId]= Land(
            {
            location: Location({
                x: locationX,
                y: locationY
            }),
            owner: _owner,
            landType: LandType(landtype),
            workers: 1,
            totalSoldiers: 0,
            attackingSoldiers: 0,
            destinationId: 99, // 99 is an invalid location (not attacking)
            destination: Location({x: 99, y: 99}), // 99, 99 is an invalid location
            timeOfAttack: 0,
            timeOfLastResourceCollect: block.timestamp
        });
        
    }

    function setResourceEpoch(uint256 _resourceEpoch) public onlyOwner {
        resourceEpoch = _resourceEpoch;
    }

    function setTimePerDist(uint256 _travelTimePerDist) public onlyOwner {
        travelTimePerDist = _travelTimePerDist;
    }

    function craft(
        uint256 _sugar,
        uint256 _milk,
        uint256 _tapioca,
        uint256 _sesame,
        uint256 _wheat
    ) public {
        //check if msg.sender has enough resources
        require(
            GridResource1155(gridResource1155).balanceOf(msg.sender, 0) >= _sugar &&
            GridResource1155(gridResource1155).balanceOf(msg.sender, 1) >= _milk &&
            GridResource1155(gridResource1155).balanceOf(msg.sender, 2) >= _tapioca &&
            GridResource1155(gridResource1155).balanceOf(msg.sender, 3) >= _sesame &&
            GridResource1155(gridResource1155).balanceOf(msg.sender, 4) >= _wheat,
            "Not enough resources"
        );

        // craft
        // - sugar + milk + tapioca = boba
        // - sugar + wheat + sesame = sesame bun

        // get maximum boba amount to be crafted
        uint256 minOfSugarMilk = _sugar < _milk ? _sugar : _milk;
        uint256 minOfSugarMilkTapioca = minOfSugarMilk < _tapioca ? minOfSugarMilk : _tapioca;

        // mint boba
        if (minOfSugarMilkTapioca>0){
            
            GridResource1155(gridResource1155).mint(
                msg.sender, 
                uint256(LandType.BOBA), 
                minOfSugarMilkTapioca, 
                ""
            );
        }
        
        // get sugar left after mint
        _sugar -= minOfSugarMilkTapioca;

        // get maximum boba amount to be crafted
        uint256 minOfSugarWheat = _sugar < _wheat ? _sugar : _wheat;
        uint256 minOfSugarWheatSesame = minOfSugarWheat < _sesame ? minOfSugarWheat : _sesame;

        // mint sesame bun
        if (minOfSugarWheatSesame>0){
            
            GridResource1155(gridResource1155).mint(
                msg.sender, 
                uint256(LandType.SESAME_BUN), 
                minOfSugarWheatSesame, 
                ""
            );
        }
    }

    function purchase(uint256 landId, uint256 additionalWorkers, uint256 additionalSoldiers) public {
        // 1 worker costs 1 boba
        // 1 soldier costs 1 sesame bun

        //check if msg.sender is owner of landId
        require(msg.sender == landInfo[landId].owner, "Not Land Owner");
        
        //check if msg.sender has enough resources
        require(
            GridResource1155(gridResource1155).balanceOf(msg.sender, 5) >= additionalWorkers &&
            GridResource1155(gridResource1155).balanceOf(msg.sender, 6) >= additionalSoldiers,
            "Not enough resources"
        );

        // burn resources for workers and soldiers
        GridResource1155(gridResource1155).burn(
            msg.sender, 
            5, 
            additionalWorkers
        );
        GridResource1155(gridResource1155).burn(
            msg.sender, 
            6, 
            additionalSoldiers
        );

        // update workers and soldiers
        landInfo[landId].workers += additionalWorkers;
        landInfo[landId].totalSoldiers += additionalSoldiers;

    }

    function harvest(uint256 landId) public {
        require(msg.sender == landInfo[landId].owner, "Not Land Owner");
        // collect
        uint256 availableResources = landInfo[landId].workers * (
            (block.timestamp - landInfo[landId].timeOfLastResourceCollect)/resourceEpoch
            );
        // mint resources to msg.sender
        GridResource1155(gridResource1155).mint(
            msg.sender, 
            uint256(landInfo[landId].landType), 
            availableResources, 
            ""
        );
        // update time of last resource collection
        landInfo[landId].timeOfLastResourceCollect = block.timestamp;
    }

    function attack(uint256 fromLandId, uint256 toLandId, uint256 attackSize) public {
        // check if msg.sender is owner of fromLandId
        require(msg.sender == landInfo[fromLandId].owner, "Not Land Owner");

        // check if msg.sender has enough soldiers
        require(landInfo[fromLandId].totalSoldiers >= attackSize, "Not enough soldiers");

        // check if attacker has not already sent an attack
        require(
            landInfo[fromLandId].destination.x == 99 &&
            landInfo[fromLandId].destination.y == 99
        , "Already attacking");

        // update attacking soldiers
        landInfo[fromLandId].attackingSoldiers = attackSize;
        landInfo[fromLandId].destinationId = toLandId;
        landInfo[fromLandId].destination = landInfo[toLandId].location;
        landInfo[fromLandId].timeOfAttack = block.timestamp;
    }

    function resolveAttack(uint256 fromLandId) public {
        // check if attacker has sent an attack
        require(
            landInfo[fromLandId].destination.x != 99 &&
            landInfo[fromLandId].destination.y != 99
        , "Not attacking");

        // check if attacker has arrived at destination
        require(
            getTimeToDestination(fromLandId, landInfo[fromLandId].destinationId) == 0
        , "Not arrived");

        // get defender
        uint256 toLandId = landInfo[fromLandId].destinationId;

        // get attacking army size
        uint256 attackingAmrySize = landInfo[fromLandId].attackingSoldiers;
        // get attacker dice roll
        uint256 attackerDiceRoll = uint256(keccak256(abi.encodePacked(block.timestamp, fromLandId, msg.sender))) % 6 + 1;
        // get defending army size
        uint256 defendingArmySize = landInfo[toLandId].totalSoldiers - landInfo[toLandId].attackingSoldiers;
        // get defender dice roll
        uint256 defenderDiceRoll = uint256(keccak256(abi.encodePacked(block.timestamp, toLandId, landInfo[toLandId].owner))) % 6 + 1;

        // get winner landId
        uint256 winnerLandId = attackerDiceRoll+attackingAmrySize > defenderDiceRoll+defendingArmySize ? fromLandId : toLandId;
        //uint256 loserLandId = winnerLandId == fromLandId ? toLandId : fromLandId;

        // resolve winner/loser resource gains/losses

        // calculate how much resource winner gets
        uint256 resourceReward = 0;
        if (winnerLandId == fromLandId){
            resourceReward = (attackingAmrySize - defendingArmySize) > 0 ? (attackingAmrySize - defendingArmySize) : 3*(defendingArmySize-attackingAmrySize);
        } else {
            resourceReward = (defendingArmySize - attackingAmrySize) > 0 ? (defendingArmySize - attackingAmrySize) : 3*(attackingAmrySize-defendingArmySize);
        }

        // mint resources to winner
        GridResource1155(gridResource1155).mint(
            landInfo[winnerLandId].owner, 
            uint256(landInfo[toLandId].landType), 
            resourceReward, 
            ""
        );

        // reset attack stats
        landInfo[fromLandId].attackingSoldiers = 0;
        landInfo[fromLandId].destinationId = 99;
        landInfo[fromLandId].destination = Location({x: 99, y: 99});
        landInfo[fromLandId].timeOfAttack = 0;
    }


    // ===== Internal funcs =====
}