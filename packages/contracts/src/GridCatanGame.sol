// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.13;

import "./GridResource1155.sol";

contract GridCatanGame {

    mapping(address => uint256) public totalOwnedWorkers;
    mapping(address => uint256) public totalOwnedSoldiers;

    // land index to owner to soldier count
    mapping(uint256 => mapping(address => uint256)) public landToSoldierCount;

    address public gridLand721;
    address public gridResource1155;
    uint256 public resourceEpoch;

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

        uint256 attackingSoldiers;
        Location destinationX;
        uint256 timeOfAttack;
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
    ) {
        gridLand721 = _gridLand721;
        gridResource1155 = _gridResource1155;
    }
    
    // ===== View funcs =====


    // ===== Setter funcs =====
    function landInitialize(uint256 landId, address _owner) public onlyGridLand721 {
        // initialize land type randomly with hash of block timestamp and id
        uint8 landtype = uint8(
            keccak256(abi.encodePacked(landId, block.timestamp, _owner))[31]
        );
        
        landInfo[landId]= Land(
            {
            location: Location({
                x: uint8(landId % 5),
                y: uint8(landId / 5)
            }),
            owner: _owner,
            landType: LandType(landtype),
            workers: 1,
            totalSoldiers: 0,
            attackingSoldiers: 0,
            destinationX: Location({x: 99, y: 99}), // 99, 99 is an invalid location
            timeOfAttack: 0,
            timeOfLastResourceCollect: block.timestamp
        });
        
    }

    function craft() public {
        // craft
    }

    function purchase() public {
        // build
    }

    function collect(uint256 landId) public {
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
        // update time of last resource collect
        landInfo[landId].timeOfLastResourceCollect = block.timestamp;
    }


    // ===== Internal funcs =====
}