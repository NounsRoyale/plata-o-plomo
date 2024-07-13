import { appAddresses } from "../contract/game";

const { createWalletClient, createPublicClient, http } = require("viem");
const { sepolia, base } = require("viem/chains");
const { gameContract } = require(__dirname + "/../contract/game");
const { privateKeyToAccount } = require("viem/accounts");

const account = privateKeyToAccount(process.env.PRIVATE_KEY);
const clientWallet = createWalletClient({
    account,
    chain: base,
    transport: http(
        "https://base-mainnet.g.alchemy.com/v2/q0X3u1T5baZyZ5xkanJwB5AyVhVmOQC0"
    ),
});
const clientPublic = createPublicClient({
    chain: base,
    transport: http(),
});

export async function useGameExit(address) {
    try {
        console.log("Exiting the game...", address);
        const { request } = await clientPublic.simulateContract({
            account,
            address: appAddresses.game[8453],
            abi: gameContract.abi,
            functionName: "exit",
            args: [address],
        });
        const res = await clientWallet.writeContract(request);
        console.log("Exited the game", address, res);
    } catch (ex) {
        console.log("Failed to exit the game", ex);
    }
}

// address playerEating,
// address playerEaten,
// Percentage of the flow rate to be eaten based on MAX_BPS
// uint256 percentageEaten
export async function useGameEat(playerEating, playerEaten, percentageEaten) {
    try {
        console.log("Eating...", playerEating, playerEaten, percentageEaten);
        const { request } = await clientPublic.simulateContract({
            account,
            address: appAddresses.game[8453],
            abi: gameContract.abi,
            functionName: "eat",
            args: [playerEating, playerEaten, percentageEaten],
        });
        const res = await clientWallet.writeContract(request);
        console.log("Eaten", playerEating, playerEaten, percentageEaten, res);
    } catch (ex) {
        console.log("Failed to eat", ex);
    }
}
