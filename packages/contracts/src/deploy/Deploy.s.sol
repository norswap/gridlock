// SPDX-License-Identifier: BSD-3-Clause-Clear
pragma solidity ^0.8.0;

import {Script, console2} from "forge-std/Script.sol";
// import {Multicall3} from "multicall/Multicall3.sol";

import "../GridLand721.sol";
import "../GridResource1155.sol";

import "../GridCatanGame.sol";

contract Deploy is Script {
    GridLand721 public gridLand;
    GridResource1155 public gridResource;
    GridCatanGame public gridCatanGame;

    bool private doLog = true;

    function dontLog() external {
        doLog = false;
    }

    function log(string memory s, address a) private view {
        if (doLog) {
            console2.log(s, a); // solhint-disable-line
        }
    }

    function run() external {
        vm.startBroadcast();

        // deploy

        gridLand = new GridLand721("Gridland", "GL", 25);
        gridResource = new GridResource1155("gridResource://");

        log("GridLand721 address", address(gridLand));
        log("GridResource1155 address", address(gridResource));

        gridCatanGame = new GridCatanGame(address(gridLand), address(gridResource));

        log("GridCatanGame address", address(gridCatanGame));

        gridLand.setGridGameAddress(address(gridCatanGame));
        gridResource.setGridGameAddress(address(gridCatanGame));

        // Anvil first two test accounts.
        string memory mnemonic = "test test test test test test test test test test test junk";
        (address account0,) = deriveRememberKey(mnemonic, 0);

        // Testing: premint a bunch of land
        for (uint256 i = 0; i < 15; i++) {
            gridLand.mint(account0, i);
        }

        // Testing: premint a bunch of resources
        for (uint256 i = 0; i < 5; i++) {
            gridResource.mint(account0, i, 10, "");
        }

        vm.stopBroadcast();

        vm.broadcast(account0);
        // do something as account0 (one transaction only, or use start/stopBroadcast)

        // In case we need it.
        // Multicall3 multicall = new Multicall3();
        // console2.log("Multicall3 address", address(multicall));
    }
}
