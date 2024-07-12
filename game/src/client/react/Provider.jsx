import React from "react";
import { DynamicContextProvider } from "@dynamic-labs/sdk-react-core";
import { EthereumWalletConnectors } from "@dynamic-labs/ethereum";

const Provider = ({ children }) => {
    return (
        <DynamicContextProvider
            settings={{
                environmentId: "c8ca5061-e827-44b4-a836-333ed59bd5a4",
                walletConnectors: [EthereumWalletConnectors],
            }}
        >
            {children}
        </DynamicContextProvider>
    );
};

export default Provider;
