const { createWalletClient, createPublicClient, http } = require("viem");
const { sepolia } = require("viem/chains");
const { gameContract } = require(__dirname + "/../contract/game");
const { privateKeyToAccount } = require("viem/accounts");

const account = privateKeyToAccount(process.env.PRIVATE_KEY);
const clientWallet = createWalletClient({
    account,
    chain: sepolia,
    transport: http(),
});
const clientPublic = createPublicClient({
    chain: sepolia,
    transport: http(),
});

export async function useGameExit(address) {
    try {
        console.log("Exiting the game...", address);
        const { request } = await clientPublic.simulateContract({
            account,
            address: gameContract.address,
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
            address: gameContract.address,
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
