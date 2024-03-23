// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.13;

interface IGridCatanGame {
    // View functions to get data
    function totalOwnedWorkers(address owner) external view returns (uint256);
    function totalOwnedSoldiers(address owner) external view returns (uint256);
    function landToSoldierCount(uint256 landIndex, address owner) external view returns (uint256);
    function landInfo(uint256 landIndex) external view returns (
        uint8 x, 
        uint8 y, 
        address owner, 
        LandType landType, 
        uint256 workers, 
        uint256 totalSoldiers, 
        uint256 attackingSoldiers, 
        uint8 destinationX, 
        uint8 destinationY, 
        uint256 timeOfAttack, 
        uint256 timeOfLastResourceCollect
    );
    
    // The LandType enum is a part of the contract interface as well
    enum LandType {
        SUGAR,
        MILK,
        TAPIOCA,
        SESAME,
        WHEAT,
        BOBA,
        SESAME_BUN
    }

    // Setter functions
    function landInitialize(uint256 id, address _owner) external;

    // Placeholder for other functions that could be called by external contracts
    // As these functions don't have implementations or detailed arguments provided,
    // they are represented here as comments.
    function craft() external;
    function purchase() external;
    function collect() external;

    // Additional functions could be added here based on the detailed requirements
    // and implementations within the GridCatanGame contract.
}
