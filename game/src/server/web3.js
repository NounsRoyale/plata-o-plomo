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
