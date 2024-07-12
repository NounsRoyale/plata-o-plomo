import React from "react";
import {
    useDynamicContext,
    DynamicConnectButton,
    useUserWallets,
} from "@dynamic-labs/sdk-react-core";
import { zeroAddress } from "viem";

const ConnectButton = () => {
    const { isAuthenticated, primaryWallet } = useDynamicContext();
    const wallets = useUserWallets();

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
                    <p>{primaryWallet?.address}</p>
                    <button
                        id="playButton"
                        className={`relative mx-auto mt-2 w-full h-10 box-border text-lg text-white text-center shadow-inner bg-green-500 border-b-2 border-green-600 cursor-pointer rounded mb-2 hover:bg-green-400`}
                        onClick={async () => {
                            try {
                                const client =
                                    await primaryWallet?.connector.getSigner();

                                console.log({ client });

                                const hash = await client?.sendTransaction({
                                    to: zeroAddress,
                                    data: "0x0",
                                    value: BigInt(1),
                                });

                                alert(hash);
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
