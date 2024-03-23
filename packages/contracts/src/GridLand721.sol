// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.13;

import "solmate/tokens/ERC721.sol";
import "solmate/auth/Owned.sol";
import "openzeppelin/utils/Strings.sol";
import "./interfaces/IGridCatanGame.sol";

contract GridLand721 is ERC721, Owned {
    string private baseURI;
    uint256 public totalSupply;
    uint256 public maxSupply = 25; // Max Land 5x5 square grid of lands

    string[25] public landURI;
    address public gridCatangame;

    constructor(
        string memory name, 
        string memory symbol, 
        uint256 _max_supply
    ) 
        ERC721(name, symbol) Owned(msg.sender) 
    {
        //baseURI = _baseURI;
        maxSupply = _max_supply;
    }

    // ===== Internal Functions ===== 

    

    // ===== Setters =====

    // Function to set the base URI for metadata
    function setBaseURI(string memory _newBaseURI) public onlyOwner {
        baseURI = _newBaseURI;
    }

    // Example function to mint a new token
    function mint(address to, uint256 id) public {
        require(totalSupply < maxSupply, "Max supply reached");
        _mint(to, id);
        IGridCatanGame(gridCatangame).landInitialize(id, to);
        totalSupply += 1; // Increment the total supply
    }

    function setTokenURI(uint256 id, string memory _uri) public onlyOwner {
        require(ownerOf(id) != address(0), "Token does not exist.");
        require(id < maxSupply, "Token ID hit max-supply.");
        landURI[id] = _uri;
    }

    // ===== Getters =====

    // Override the tokenURI function to return the full URI for each token
    function tokenURI(uint256 id) public view override returns (string memory) {
        require(ownerOf(id) != address(0), "Token does not exist.");
        require(id < maxSupply, "Token ID hit max-supply.");
        //return string(abi.encodePacked(baseURI, Strings.toString(id)));
        return landURI[id];
    }

    // Custom view function to return the entire array.
    function getAllLandURIs() public view returns (string[25] memory) {
        return landURI;
    }

}