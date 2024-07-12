import React from "react";
import { DynamicContextProvider } from "@dynamic-labs/sdk-react-core";
import { EthereumWalletConnectors } from "@dynamic-labs/ethereum";
import { DynamicWagmiConnector } from "@dynamic-labs/wagmi-connector";
import { createConfig, WagmiProvider, useAccount } from "wagmi";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { http } from "viem";
import { base, sepolia } from "viem/chains";

const config = createConfig({
    chains: [sepolia, base],
    multiInjectedProviderDiscovery: false,
    transports: {
        [sepolia.id]: http(),
        [base.id]: http(),
    },
});

const queryClient = new QueryClient();

const Provider = ({ children }) => {
    return (
        <DynamicContextProvider
            settings={{
                environmentId: "c8ca5061-e827-44b4-a836-333ed59bd5a4",
                walletConnectors: [EthereumWalletConnectors],
                walletConnectors: [EthereumWalletConnectors],
            }}
        >
            <WagmiProvider config={config}>
                <QueryClientProvider client={queryClient}>
                    <DynamicWagmiConnector>{children}</DynamicWagmiConnector>
                </QueryClientProvider>
            </WagmiProvider>
        </DynamicContextProvider>
    );
};

export default Provider;
