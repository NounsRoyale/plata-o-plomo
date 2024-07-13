import React from "react";
import { useWalletClient } from "wagmi";
import { erc20Abi, http } from "viem";
import {
    createSmartAccountClient,
    walletClientToSmartAccountSigner,
} from "permissionless";
import { signerToSimpleSmartAccount } from "permissionless/accounts";
import {
    createPimlicoPaymasterClient,
    createPimlicoBundlerClient,
} from "permissionless/clients/pimlico";
import { lifeToken, gameContract } from "../../contract/game";

import { usePublicClient } from "wagmi";

export const SmartAccountContext = React.createContext({
    account: null,
    balance: null,
    initialFlowRate: BigInt(0),
    isInGame: null,
    isReady: false,
});

export const AccountProvider = ({ children }) => {
    const { data: walletClient } = useWalletClient();
    const pubClient = usePublicClient();

    const [client, setClient] = React.useState(null);
    const [balance, setBalance] = React.useState(null);
    const [isInGame, setIsInGame] = React.useState(null);
    const [isReady, setIsReady] = React.useState(false);
    const [initialFlowRate, setInitialFlowRate] = React.useState(0);

    const loadAccount = async () => {
        const pimlicoKey = "3fac7f38-a857-468a-a471-20f077048d26";

        const chain = walletClient.chain;

        const pimlicoUrl = `https://api.pimlico.io/v2/${chain.id}/rpc?apikey=${pimlicoKey}`;

        console.log(1);
        const customSigner = walletClientToSmartAccountSigner(walletClient);

        const bundler = createPimlicoBundlerClient({
            transport: http(pimlicoUrl),
            entryPoint: "0x5FF137D4b0FDCD49DcA30c7CF57E578a026d2789",
        });

        console.log(2);
        const pimlicoPaymasterClient = createPimlicoPaymasterClient({
            chain,
            transport: http(pimlicoUrl),
            entryPoint: "0x5FF137D4b0FDCD49DcA30c7CF57E578a026d2789",
        });

        console.log(3);
        const simpleSmartAccountClient = await signerToSimpleSmartAccount(
            walletClient,
            {
                entryPoint: "0x5FF137D4b0FDCD49DcA30c7CF57E578a026d2789",
                signer: customSigner,
                factoryAddress: "0x9406Cc6185a346906296840746125a0E44976454",
            }
        );

        const moreGas = (gas) => {
            const { maxFeePerGas, maxPriorityFeePerGas } = gas;
            return {
                maxFeePerGas: maxFeePerGas * BigInt(2),
                maxPriorityFeePerGas: maxPriorityFeePerGas * BigInt(2),
            };
        };

        console.log(4);
        const smartAccountClient = createSmartAccountClient({
            account: simpleSmartAccountClient,
            bundlerTransport: http(pimlicoUrl, {
                // 30 seconds
                timeout: 30000,
            }),
            chain,
            middleware: {
                gasPrice: async () =>
                    moreGas((await bundler.getUserOperationGasPrice()).fast),
                sponsorUserOperation:
                    pimlicoPaymasterClient.sponsorUserOperation,
            },
        });

        setClient(smartAccountClient);
        setIsReady(true);
    };

    const fetchData = async () => {
        if (!client) return;
        await pubClient
            .multicall({
                contracts: [
                    {
                        address: lifeToken.address,
                        abi: erc20Abi,
                        functionName: "balanceOf",
                        args: [client.account.address],
                    },
                    {
                        address: gameContract.address,
                        abi: gameContract.abi,
                        functionName: "isInGame",
                        args: [client.account.address],
                    },
                    {
                        address: gameContract.address,
                        abi: gameContract.abi,
                        functionName: "BASE_FLOW_RATE",
                        args: [],
                    },
                ],
            })
            .then((data) => {
                setBalance(data[0].result);
                setIsInGame(data[1].result);
                setInitialFlowRate(data[2].result);
            });
    };

    React.useEffect(() => {
        if (walletClient) {
            loadAccount();
        }
    }, [walletClient]);

    React.useEffect(() => {
        if (client) {
            fetchData();
        }
    }, [client]);

    return (
        <SmartAccountContext.Provider
            value={{
                account: client,
                balance,
                isInGame,
                isReady,
                initialFlowRate,
            }}
        >
            {children}
        </SmartAccountContext.Provider>
    );
};
