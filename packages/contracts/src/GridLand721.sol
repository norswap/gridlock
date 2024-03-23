// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.13;

import "solmate/tokens/ERC721.sol";
import "solmate/auth/Owned.sol";
import "openzeppelin/utils/Strings.sol";

contract GridLand721 is ERC721, Owned {
    string private baseURI;
    uint256 public totalSupply;
    uint256 public maxSupply = 25; // Max Land 5x5 square grid of lands

    string[maxSupply] public landURI;

    constructor(
        string memory name, 
        string memory symbol, 
        string memory _baseURI,
        string memory _max_supply
    ) 
        ERC721(name, symbol) Owned(msg.sender) 
    {
        baseURI = _baseURI;
        max_supply = _max_supply;
    }

    // ===== Internal Functions ===== 

    // Override the _baseURI function to return the base URI
    function _baseURI() internal view override returns (string memory) {
        return baseURI;
    }

    // ===== Setters =====

    // Function to set the base URI for metadata
    function setBaseURI(string memory _newBaseURI) public onlyOwner {
        baseURI = _newBaseURI;
    }

    // Example function to mint a new token
    function mint(address to, uint256 id) public onlyOwner {
        require(totalSupply < maxSupply, "Max supply reached");
        _mint(to, id);
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