import React from "react";
import {
    useDynamicContext,
    DynamicConnectButton,
    DynamicWidget,
} from "@dynamic-labs/sdk-react-core";
import {
    createSmartAccountClient,
    walletClientToSmartAccountSigner,
} from "permissionless";
import { signerToSimpleSmartAccount } from "permissionless/accounts";
import {
    createPimlicoPaymasterClient,
    createPimlicoBundlerClient,
} from "permissionless/clients/pimlico";
import { zeroAddress, http, encodeFunctionData } from "viem";
import { usePublicClient, useWalletClient } from "wagmi";
import { cfaV1Forwarder, gameContract, lifeToken } from "../../contract/game";

const ConnectButton = () => {
    const { isAuthenticated, primaryWallet } = useDynamicContext();
    const { data: walletClient } = useWalletClient();
    const pubClient = usePublicClient();

    return (
        <>
            {!isAuthenticated ? (
                <DynamicConnectButton
                    buttonContainerClassName="w-full"
                    buttonClassName="w-full"
                >
                    <button
                        className={`relative mx-auto mt-2 w-full h-10 box-border text-lg text-white text-center shadow-inner bg-green-500 border-b-2 border-green-600 cursor-pointer rounded mb-2 hover:bg-green-400`}
                    >
                        Connect
                    </button>
                </DynamicConnectButton>
            ) : (
                <>
                    <DynamicWidget
                        buttonClassName="flex flex-row justify-center w-full"
                        buttonContainerClassName="flex flex-row justify-center w-full"
                    />
                    <button
                        id="playButton"
                        className={`relative mx-auto mt-2 w-full h-10 box-border text-lg text-white text-center shadow-inner bg-green-500 border-b-2 border-green-600 cursor-pointer rounded mb-2 hover:bg-green-400`}
                        onClick={async () => {
                            const pimlicoKey =
                                "3fac7f38-a857-468a-a471-20f077048d26";

                            const chain = walletClient.chain;

                            const pimlicoUrl = `https://api.pimlico.io/v2/${chain.id}/rpc?apikey=${pimlicoKey}`;

                            try {
                                console.log(1);
                                const customSigner =
                                    walletClientToSmartAccountSigner(
                                        walletClient
                                    );

                                const bundler = createPimlicoBundlerClient({
                                    transport: http(pimlicoUrl),
                                    entryPoint:
                                        "0x5FF137D4b0FDCD49DcA30c7CF57E578a026d2789",
                                });

                                console.log(2);
                                const pimlicoPaymasterClient =
                                    createPimlicoPaymasterClient({
                                        chain,
                                        transport: http(pimlicoUrl),
                                        entryPoint:
                                            "0x5FF137D4b0FDCD49DcA30c7CF57E578a026d2789",
                                    });

                                console.log(3);
                                const simpleSmartAccountClient =
                                    await signerToSimpleSmartAccount(
                                        walletClient,
                                        {
                                            entryPoint:
                                                "0x5FF137D4b0FDCD49DcA30c7CF57E578a026d2789",
                                            signer: customSigner,
                                            factoryAddress:
                                                "0x9406Cc6185a346906296840746125a0E44976454",
                                        }
                                    );

                                console.log(4);
                                const smartAccountClient =
                                    createSmartAccountClient({
                                        account: simpleSmartAccountClient,
                                        bundlerTransport: http(pimlicoUrl),
                                        chain,
                                        middleware: {
                                            gasPrice: async () =>
                                                (
                                                    await bundler.getUserOperationGasPrice()
                                                ).fast,
                                            sponsorUserOperation:
                                                pimlicoPaymasterClient.sponsorUserOperation,
                                        },
                                    });

                                const playerName = primaryWallet.address;

                                const isInGame = await pubClient.readContract({
                                    address: gameContract.address,
                                    abi: gameContract.abi,
                                    functionName: "isInGame",
                                    args: [playerName],
                                });

                                console.log({ isInGame });

                                if (!isInGame) {
                                    const txs = [];

                                    txs.concat([
                                        // {
                                        //     to: cfaV1Forwarder.address,
                                        //     data: encodeFunctionData({
                                        //         abi: cfaV1Forwarder.abi,
                                        //         functionName:
                                        //             "grantPermissions",
                                        //         args: [
                                        //             lifeToken.address,
                                        //             gameContract.address,
                                        //         ],
                                        //     }),
                                        //     value: BigInt(0),
                                        // },
                                        {
                                            to: gameContract.address,
                                            data: encodeFunctionData({
                                                abi: gameContract.abi,
                                                functionName: "enter",
                                                args: [
                                                    playerName,
                                                    zeroAddress,
                                                    "",
                                                ],
                                            }),
                                            value: BigInt(0),
                                        },
                                    ]);

                                    console.log(5);
                                    const res =
                                        await smartAccountClient.sendTransactions(
                                            {
                                                transactions: txs,
                                            }
                                        );

                                    console.log({ res });
                                }

                                window.startGame("player", playerName);
                            } catch (error) {
                                console.log({ error });
                            }
                        }}
                    >
                        Play
                    </button>
                    <br />
                    <button
                        id="spectateButton"
                        className="relative mx-auto mt-2 w-full h-10 box-border text-lg text-white text-center shadow-inner bg-green-500 border-b-2 border-green-600 cursor-pointer rounded mb-2 hover:bg-green-400"
                    >
                        Spectate
                    </button>
                    <button
                        id="settingsButton"
                        className="relative mx-auto mt-2 w-full h-10 box-border text-lg text-white text-center shadow-inner bg-green-500 border-b-2 border-green-600 cursor-pointer rounded mb-2 hover:bg-green-400"
                    >
                        Settings
                    </button>
                </>
            )}
        </>
    );
};

export default ConnectButton;
