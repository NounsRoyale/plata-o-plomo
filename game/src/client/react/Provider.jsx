import React from "react";
import { DynamicContextProvider } from "@dynamic-labs/sdk-react-core";
import { EthereumWalletConnectors } from "@dynamic-labs/ethereum";
import { DynamicWagmiConnector } from "@dynamic-labs/wagmi-connector";
import { createConfig, WagmiProvider } from "wagmi";
import { AccountProvider } from "./SmartAccountContext";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { http } from "viem";
import { base, sepolia } from "viem/chains";

const config = createConfig({
    chains: [sepolia, base],
    multiInjectedProviderDiscovery: false,
    transports: {
        [sepolia.id]: http(),
        [base.id]: http(
            "https://base-mainnet.g.alchemy.com/v2/q0X3u1T5baZyZ5xkanJwB5AyVhVmOQC0"
        ),
    },
});

const queryClient = new QueryClient();

const Provider = ({ children }) => {
    return (
        <DynamicContextProvider
            settings={{
                environmentId: "3f256242-081e-4160-b7eb-8fb7e2c3b272",
                walletConnectors: [EthereumWalletConnectors],
            }}
        >
            <WagmiProvider config={config}>
                <QueryClientProvider client={queryClient}>
                    <DynamicWagmiConnector>
                        <AccountProvider>{children}</AccountProvider>
                    </DynamicWagmiConnector>
                </QueryClientProvider>
            </WagmiProvider>
        </DynamicContextProvider>
    );
};

export default Provider;
