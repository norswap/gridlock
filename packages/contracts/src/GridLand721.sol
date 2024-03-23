// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.13;

import "solmate/tokens/ERC721.sol";
import "solmate/auth/Owned.sol";
import "openzeppelin/utils/Strings.sol";

contract GridLand721 is ERC721, Owned {
    string private baseURI;
    constructor(
        string memory name, 
        string memory symbol, 
        string memory _baseURI
    ) 
        ERC721(name, symbol) Owned(msg.sender) 
    {
        baseURI = _baseURI;
    }

    // Function to set the base URI for metadata
    function setBaseURI(string memory _newBaseURI) public onlyOwner {
        baseURI = _newBaseURI;
    }

    // Override the _baseURI function to return the base URI
    function _baseURI() internal view override returns (string memory) {
        return baseURI;
    }

    // Override the tokenURI function to return the full URI for each token
    function tokenURI(uint256 id) public view override returns (string memory) {
        require(ownerOf(id) != address(0), "Token does not exist.");
        return string(abi.encodePacked(baseURI, Strings.toString(id)));
    }

    // Example function to mint a new token
    function mint(address to, uint256 id) public onlyOwner {
        _mint(to, id);
    }
}