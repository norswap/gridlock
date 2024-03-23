// SPDX-License-Identifier: BSD-3-Clause-Clear
pragma solidity ^0.8.0;

import {Script, console2} from "forge-std/Script.sol";
// import {Multicall3} from "multicall/Multicall3.sol";

import "../GridLand721.sol";
import "../GridResource1155.sol";

contract Deploy is Script {
    GridLand721 public gridLand;
    GridResource1155 public gridResource;

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

        vm.stopBroadcast();

        // Anvil first two test accounts.
        string memory mnemonic = "test test test test test test test test test test test junk";
        (address account0,) = deriveRememberKey(mnemonic, 0);

        vm.broadcast(account0);
        // do something as account0 (one transaction only, or use start/stopBroadcast)

        // In case we need it.
        // Multicall3 multicall = new Multicall3();
        // console2.log("Multicall3 address", address(multicall));
    }
}
