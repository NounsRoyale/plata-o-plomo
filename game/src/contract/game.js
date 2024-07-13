export const gameContract = {
    address: "0xA130448E6cd24BbBedDe7Ba76a5290642924b13a",
    abi: [
        { type: "constructor", inputs: [], stateMutability: "nonpayable" },
        {
            type: "function",
            name: "BASE_FLOW_RATE",
            inputs: [],
            outputs: [{ name: "", type: "int96", internalType: "int96" }],
            stateMutability: "view",
        },
        {
            type: "function",
            name: "DEFAULT_ADMIN_ROLE",
            inputs: [],
            outputs: [{ name: "", type: "bytes32", internalType: "bytes32" }],
            stateMutability: "view",
        },
        {
            type: "function",
            name: "GAME_ADMIN_ROLE",
            inputs: [],
            outputs: [{ name: "", type: "bytes32", internalType: "bytes32" }],
            stateMutability: "view",
        },
        {
            type: "function",
            name: "eat",
            inputs: [
                {
                    name: "playerEating",
                    type: "address",
                    internalType: "address",
                },
                {
                    name: "playerEaten",
                    type: "address",
                    internalType: "address",
                },
                {
                    name: "percentageEaten",
                    type: "uint256",
                    internalType: "uint256",
                },
            ],
            outputs: [],
            stateMutability: "nonpayable",
        },
        {
            type: "function",
            name: "enter",
            inputs: [
                { name: "player", type: "address", internalType: "address" },
                { name: "currency", type: "address", internalType: "address" },
                { name: "userData", type: "bytes", internalType: "bytes" },
            ],
            outputs: [],
            stateMutability: "payable",
        },
        {
            type: "function",
            name: "exit",
            inputs: [
                { name: "player", type: "address", internalType: "address" },
            ],
            outputs: [],
            stateMutability: "nonpayable",
        },
        {
            type: "function",
            name: "gameCurrencies",
            inputs: [{ name: "", type: "address", internalType: "address" }],
            outputs: [
                { name: "enabled", type: "bool", internalType: "bool" },
                { name: "price", type: "uint256", internalType: "uint256" },
            ],
            stateMutability: "view",
        },
        {
            type: "function",
            name: "getRoleAdmin",
            inputs: [
                { name: "role", type: "bytes32", internalType: "bytes32" },
            ],
            outputs: [{ name: "", type: "bytes32", internalType: "bytes32" }],
            stateMutability: "view",
        },
        {
            type: "function",
            name: "grantRole",
            inputs: [
                { name: "role", type: "bytes32", internalType: "bytes32" },
                { name: "account", type: "address", internalType: "address" },
            ],
            outputs: [],
            stateMutability: "nonpayable",
        },
        {
            type: "function",
            name: "hasRole",
            inputs: [
                { name: "role", type: "bytes32", internalType: "bytes32" },
                { name: "account", type: "address", internalType: "address" },
            ],
            outputs: [{ name: "", type: "bool", internalType: "bool" }],
            stateMutability: "view",
        },
        {
            type: "function",
            name: "initialize",
            inputs: [
                { name: "_lifePool", type: "address", internalType: "address" },
                {
                    name: "_life",
                    type: "address",
                    internalType: "contract ISuperToken",
                },
                {
                    name: "nativePrice",
                    type: "uint256",
                    internalType: "uint256",
                },
            ],
            outputs: [],
            stateMutability: "nonpayable",
        },
        {
            type: "function",
            name: "life",
            inputs: [],
            outputs: [
                {
                    name: "",
                    type: "address",
                    internalType: "contract ISuperToken",
                },
            ],
            stateMutability: "view",
        },
        {
            type: "function",
            name: "proxiableUUID",
            inputs: [],
            outputs: [{ name: "", type: "bytes32", internalType: "bytes32" }],
            stateMutability: "view",
        },
        {
            type: "function",
            name: "renounceRole",
            inputs: [
                { name: "role", type: "bytes32", internalType: "bytes32" },
                { name: "account", type: "address", internalType: "address" },
            ],
            outputs: [],
            stateMutability: "nonpayable",
        },
        {
            type: "function",
            name: "revokeRole",
            inputs: [
                { name: "role", type: "bytes32", internalType: "bytes32" },
                { name: "account", type: "address", internalType: "address" },
            ],
            outputs: [],
            stateMutability: "nonpayable",
        },
        {
            type: "function",
            name: "supportsInterface",
            inputs: [
                { name: "interfaceId", type: "bytes4", internalType: "bytes4" },
            ],
            outputs: [{ name: "", type: "bool", internalType: "bool" }],
            stateMutability: "view",
        },
        {
            type: "function",
            name: "upgradeTo",
            inputs: [
                {
                    name: "newImplementation",
                    type: "address",
                    internalType: "address",
                },
            ],
            outputs: [],
            stateMutability: "nonpayable",
        },
        {
            type: "function",
            name: "upgradeToAndCall",
            inputs: [
                {
                    name: "newImplementation",
                    type: "address",
                    internalType: "address",
                },
                { name: "data", type: "bytes", internalType: "bytes" },
            ],
            outputs: [],
            stateMutability: "payable",
        },
        {
            type: "event",
            name: "AdminChanged",
            inputs: [
                {
                    name: "previousAdmin",
                    type: "address",
                    indexed: false,
                    internalType: "address",
                },
                {
                    name: "newAdmin",
                    type: "address",
                    indexed: false,
                    internalType: "address",
                },
            ],
            anonymous: false,
        },
        {
            type: "event",
            name: "Ate",
            inputs: [
                {
                    name: "playerEating",
                    type: "address",
                    indexed: true,
                    internalType: "address",
                },
                {
                    name: "playerEaten",
                    type: "address",
                    indexed: true,
                    internalType: "address",
                },
                {
                    name: "percentageEaten",
                    type: "uint256",
                    indexed: false,
                    internalType: "uint256",
                },
            ],
            anonymous: false,
        },
        {
            type: "event",
            name: "BeaconUpgraded",
            inputs: [
                {
                    name: "beacon",
                    type: "address",
                    indexed: true,
                    internalType: "address",
                },
            ],
            anonymous: false,
        },
        {
            type: "event",
            name: "Entered",
            inputs: [
                {
                    name: "player",
                    type: "address",
                    indexed: true,
                    internalType: "address",
                },
                {
                    name: "currency",
                    type: "address",
                    indexed: true,
                    internalType: "address",
                },
                {
                    name: "userData",
                    type: "bytes",
                    indexed: false,
                    internalType: "bytes",
                },
            ],
            anonymous: false,
        },
        {
            type: "event",
            name: "Exited",
            inputs: [
                {
                    name: "player",
                    type: "address",
                    indexed: true,
                    internalType: "address",
                },
            ],
            anonymous: false,
        },
        {
            type: "event",
            name: "Initialized",
            inputs: [
                {
                    name: "version",
                    type: "uint8",
                    indexed: false,
                    internalType: "uint8",
                },
            ],
            anonymous: false,
        },
        {
            type: "event",
            name: "RoleAdminChanged",
            inputs: [
                {
                    name: "role",
                    type: "bytes32",
                    indexed: true,
                    internalType: "bytes32",
                },
                {
                    name: "previousAdminRole",
                    type: "bytes32",
                    indexed: true,
                    internalType: "bytes32",
                },
                {
                    name: "newAdminRole",
                    type: "bytes32",
                    indexed: true,
                    internalType: "bytes32",
                },
            ],
            anonymous: false,
        },
        {
            type: "event",
            name: "RoleGranted",
            inputs: [
                {
                    name: "role",
                    type: "bytes32",
                    indexed: true,
                    internalType: "bytes32",
                },
                {
                    name: "account",
                    type: "address",
                    indexed: true,
                    internalType: "address",
                },
                {
                    name: "sender",
                    type: "address",
                    indexed: true,
                    internalType: "address",
                },
            ],
            anonymous: false,
        },
        {
            type: "event",
            name: "RoleRevoked",
            inputs: [
                {
                    name: "role",
                    type: "bytes32",
                    indexed: true,
                    internalType: "bytes32",
                },
                {
                    name: "account",
                    type: "address",
                    indexed: true,
                    internalType: "address",
                },
                {
                    name: "sender",
                    type: "address",
                    indexed: true,
                    internalType: "address",
                },
            ],
            anonymous: false,
        },
        {
            type: "event",
            name: "Upgraded",
            inputs: [
                {
                    name: "implementation",
                    type: "address",
                    indexed: true,
                    internalType: "address",
                },
            ],
            anonymous: false,
        },
    ],
};
