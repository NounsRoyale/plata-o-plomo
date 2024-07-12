import React from "react";
import {
    useDynamicContext,
    DynamicConnectButton,
    DynamicWidget,
    useUserWallets,
} from "@dynamic-labs/sdk-react-core";
import {
    createSmartAccountClient,
    walletClientToSmartAccountSigner,
} from "permissionless";
import { signerToSimpleSmartAccount } from "permissionless/accounts";
import { createPimlicoPaymasterClient } from "permissionless/clients/pimlico";
import { zeroAddress, http } from "viem";
import { useWalletClient } from "wagmi";

const ConnectButton = () => {
    const { isAuthenticated, primaryWallet } = useDynamicContext();
    const wallets = useUserWallets();
    const { data: walletClient } = useWalletClient();

    console.log({
        isAuthenticated,
        primaryWallet,
        wallets,
    });

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
                                const customSigner =
                                    walletClientToSmartAccountSigner(
                                        walletClient
                                    );

                                const pimlicoPaymasterClient =
                                    createPimlicoPaymasterClient({
                                        chain,
                                        transport: http(pimlicoUrl),
                                        entryPoint:
                                            "0x5FF137D4b0FDCD49DcA30c7CF57E578a026d2789",
                                    });

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

                                const smartAccountClient =
                                    createSmartAccountClient({
                                        account: simpleSmartAccountClient,
                                        chain, // or whatever chain you are using
                                        transport: http(pimlicoUrl),
                                        sponsorUserOperation:
                                            pimlicoPaymasterClient.sponsorUserOperation, // if using a paymaster
                                    });

                                await smartAccountClient.sendTransaction({
                                    to: zeroAddress,
                                    data: "0x0",
                                    value: BigInt(1),
                                });

                                // alert(hash);
                            } catch (error) {
                                console.log(error);
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
