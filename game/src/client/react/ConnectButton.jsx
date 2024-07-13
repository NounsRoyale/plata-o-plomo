import React from "react";
import {
    useDynamicContext,
    DynamicConnectButton,
    DynamicWidget,
} from "@dynamic-labs/sdk-react-core";
import { zeroAddress, encodeFunctionData, formatEther } from "viem";
import { usePublicClient } from "wagmi";
import { gameContract } from "../../contract/game";
import { SmartAccountContext } from "./SmartAccountContext";

const ConnectButton = () => {
    const { isAuthenticated } = useDynamicContext();
    const pubClient = usePublicClient();
    const [isLoading, setIsLoading] = React.useState(false);
    const { account, isInGame, balance, isReady, initialFlowRate } =
        React.useContext(SmartAccountContext);

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
                    <div className="flex flex-row justify-between items-center">
                        <DynamicWidget
                            buttonClassName="flex flex-row justify-center w-full"
                            buttonContainerClassName="flex flex-row justify-center w-full"
                        />
                        {balance && (
                            <p>{formatEther(balance ?? BigInt(0))} $LIFE</p>
                        )}
                    </div>
                    <button
                        id="playButton"
                        className={`relative mx-auto mt-2 w-full h-10 box-border text-lg text-white text-center shadow-inner bg-green-500 border-b-2 border-green-600 cursor-pointer rounded mb-2 hover:bg-green-400`}
                        disabled={isLoading}
                        onClick={async () => {
                            if (!window.nounIsPicked()) {
                                alert("Please pick a noun before playing");
                                return;
                            }
                            if (!account) return;
                            setIsLoading(true);

                            try {
                                const playerName = account.account.address;

                                if (!isInGame) {
                                    const hash = await account.sendTransaction({
                                        to: gameContract.address,
                                        data: encodeFunctionData({
                                            abi: gameContract.abi,
                                            functionName: "enter",
                                            args: [playerName, zeroAddress, ""],
                                        }),
                                        value: BigInt(0),
                                    });

                                    console.log({ hash });

                                    const rcpt =
                                        await pubClient.waitForTransactionReceipt(
                                            {
                                                hash,
                                                // 30 seconds
                                                timeout: 30000,
                                            }
                                        );

                                    console.log({ rcpt });
                                }

                                window.startGame({
                                    type: "player",
                                    playerName,
                                    initialFlowRate,
                                    balance,
                                });
                                setIsLoading(false);
                            } catch (error) {
                                setIsLoading(false);
                                console.log({ error });
                            }
                        }}
                    >
                        {!account ? (
                            <p>...</p>
                        ) : isLoading || !isReady ? (
                            <div className="flex justify-center">
                                <svg
                                    class="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                                    xmlns="http://www.w3.org/2000/svg"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    id="isLoading"
                                >
                                    <circle
                                        class="opacity-25"
                                        cx="12"
                                        cy="12"
                                        r="10"
                                        stroke="currentColor"
                                        stroke-width="4"
                                    ></circle>
                                    <path
                                        class="opacity-75"
                                        fill="currentColor"
                                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                                    ></path>
                                </svg>
                            </div>
                        ) : isInGame ? (
                            "Resume"
                        ) : (
                            "Play"
                        )}
                    </button>
                    <br />
                    <button
                        id="fakePlayer"
                        className="relative mx-auto mt-2 w-full h-10 box-border text-lg text-white text-center shadow-inner bg-green-500 border-b-2 border-green-600 cursor-pointer rounded mb-2 hover:bg-green-400"
                        onClick={() => {
                            const randomEthAddress =
                                "0x" + Math.random().toString(16).slice(2);
                            window.startGame("player", randomEthAddress);
                        }}
                    >
                        Play without rewards
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
