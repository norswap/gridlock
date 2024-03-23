// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.13;

import "./GridResource1155.sol";
import "solmate/auth/Owned.sol";

contract GridCatanGame is Owned {

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
    ) Owned(msg.sender) {
        gridLand721 = _gridLand721;
        gridResource1155 = _gridResource1155;
    }
    
    // ===== View funcs =====


    // ===== Setter funcs =====
    function landInitialize(uint256 landId, address _owner) public onlyGridLand721 {
        // initialize land type randomly with hash of block timestamp and id
        // max landtype id is 4
        uint8 landtype = uint8(
            keccak256(abi.encodePacked(landId, block.timestamp, _owner))[31]
        ) % 5;
        
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

    function setResourceEpoch(uint256 _resourceEpoch) public onlyOwner {
        resourceEpoch = _resourceEpoch;
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