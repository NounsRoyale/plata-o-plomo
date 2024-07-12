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
import { zeroAddress, http } from "viem";
import { useWalletClient } from "wagmi";

const ConnectButton = () => {
    const { isAuthenticated } = useDynamicContext();
    const { data: walletClient } = useWalletClient();

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
                                        chain, // or whatever chain you are using
                                        // transport: http(pimlicoUrl),
                                        middleware: {
                                            gasPrice: async () =>
                                                (
                                                    await bundler.getUserOperationGasPrice()
                                                ).fast,
                                            sponsorUserOperation:
                                                pimlicoPaymasterClient.sponsorUserOperation,
                                        },
                                    });

                                console.log(5);
                                const res =
                                    await smartAccountClient.sendTransaction({
                                        to: zeroAddress,
                                        data: "0x0",
                                        value: BigInt(0),
                                    });

                                console.log({ res });

                                // alert(hash);
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
