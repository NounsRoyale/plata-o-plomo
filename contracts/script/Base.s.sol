pragma solidity ^0.8.13;

import {Script, console} from "forge-std/Script.sol";

contract BaseScript is Script {
    /// @dev Included to enable compilation of the script without a $MNEMONIC environment variable.
    string internal constant TEST_MNEMONIC =
        "test test test test test test test test test test test junk";

    enum DeployementChain {
        Anvil,
        Sepolia,
        Base
    }

    mapping(DeployementChain => string forkId) public forks;

    uint256 internal deployerPrivateKey;

    DeployementChain internal currentChain;

    constructor() {
        forks[DeployementChain.Anvil] = "anvil";
        forks[DeployementChain.Sepolia] = "sepolia";
        forks[DeployementChain.Base] = "base";
    }

    modifier broadcastOn(DeployementChain chain) {
        vm.createSelectFork(forks[chain]);
        currentChain = chain;
        _loadSender();
        console.log("Broadcasting on chain: ", forks[chain]);
        vm.startBroadcast(deployerPrivateKey);
        _;
        vm.stopBroadcast();
    }

    function _loadSender() internal {
        if (currentChain == DeployementChain.Anvil) {
            (, deployerPrivateKey) = deriveRememberKey({
                mnemonic: TEST_MNEMONIC,
                index: 0
            });
        } else {
            deployerPrivateKey = vm.envUint("PK");
        }
    }

    function _saveDeployment(
        address contractAddress,
        string memory contractName
    ) internal {
        string memory objectName = "export";
        string memory json;

        string memory filePathWithEncodePacked = string(
            abi.encodePacked(
                "./deployments/",
                vm.toString(block.chainid),
                "/",
                contractName,
                ".json"
            )
        );

        json = vm.serializeAddress(objectName, "address", contractAddress);
        json = vm.serializeUint(objectName, "startBlock", block.number);

        vm.writeFile(filePathWithEncodePacked, json);
    }

    function _readDeployment(
        string memory contractName
    ) internal returns (address) {
        string memory filePathWithEncodePacked = string(
            abi.encodePacked(
                "./deployments/",
                vm.toString(block.chainid),
                "/",
                contractName,
                ".json"
            )
        );

        string memory json = vm.readFile(filePathWithEncodePacked);

        return vm.parseJsonAddress(json, ".address");
    }
}
