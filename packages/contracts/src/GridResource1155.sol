// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.13;

import "solmate/tokens/ERC1155.sol";
import "solmate/auth/Owned.sol";

contract GridResource1155 is ERC1155, Owned
{
    string private baseURI;

    // id mapping
    // 0 - sugar
    // 1 - milk
    // 2 - tapioca
    // 3 - sesame
    // 4 - wheat
    // 5 - boba
    // 6 - sesame bun

    constructor(string memory _baseURI) Owned(msg.sender) {
        baseURI = _baseURI;
    }

    // Allows the contract owner to set a new base URI
    function setBaseURI(string memory _newBaseURI) public onlyOwner {
        baseURI = _newBaseURI;
    }

    // This function allows the contract owner to mint new tokens
    function mint(
        address to,
        uint256 id,
        uint256 amount,
        bytes memory data
    ) public onlyOwner {
        _mint(to, id, amount, data);
    }

    // This function allows the contract owner to mint batch tokens
    function mintBatch(
        address to,
        uint256[] memory ids,
        uint256[] memory amounts,
        bytes memory data
    ) public onlyOwner {
        _batchMint(to, ids, amounts, data);
    }

    // Override the uri function to define how token URIs are determined
    function uri(uint256 id) public view override returns (string memory) {
        // Implement your logic to return the URI for token id
        
        //return string(abi.encodePacked(baseURI, Strings.toString(id), ".json"));
        return string(abi.encodePacked(baseURI, Strings.toString(id)));
    }

}