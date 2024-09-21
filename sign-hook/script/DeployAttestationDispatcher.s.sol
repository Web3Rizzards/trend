// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "forge-std/Script.sol";
import {AttestationDispatcher} from "../src/AttestationDispatcher.sol";
import {IMailbox} from "../lib/hyperlane-monorepo/solidity/contracts/interfaces/IMailbox.sol";

contract DeployAttestationDispatcherScript is Script {
    function run() external {
        // Retrieve configuration from environment variables
        address mailboxAddress = 0x438D749BfAD69a368d85811155d6BB0dEf5f7A11;
        uint32 destinationChainId = 84532;
        address crossChainAttestorAddress = 0x75B42620C4aa52DBD66757fe54A546Bb856C4104;

        // Retrieve the deployer's private key from environment variables
        uint256 deployerPrivateKey = vm.envUint("PRIVATE_KEY");

        // Start broadcasting transactions
        vm.startBroadcast(deployerPrivateKey);

        // Deploy the AttestationDispatcher contract
        AttestationDispatcher attestationDispatcher = new AttestationDispatcher(
            IMailbox(mailboxAddress),
            destinationChainId,
            crossChainAttestorAddress
        );

        console.log("AttestationDispatcher deployed at:", address(attestationDispatcher));

        // Stop broadcasting transactions
        vm.stopBroadcast();
    }
}
