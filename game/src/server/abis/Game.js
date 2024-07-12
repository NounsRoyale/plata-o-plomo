export const abi = [
    {
        anonymous: false,
        inputs: [
            {
                indexed: true,
                internalType: "address",
                name: "playerEating",
                type: "address",
            },
            {
                indexed: true,
                internalType: "address",
                name: "playerEaten",
                type: "address",
            },
            {
                indexed: false,
                internalType: "uint256",
                name: "percentageEaten",
                type: "uint256",
            },
        ],
        name: "Ate",
        type: "event",
    },
    {
        anonymous: false,
        inputs: [
            {
                indexed: true,
                internalType: "address",
                name: "player",
                type: "address",
            },
            {
                indexed: true,
                internalType: "address",
                name: "currency",
                type: "address",
            },
        ],
        name: "Entered",
        type: "event",
    },
    {
        anonymous: false,
        inputs: [
            {
                indexed: true,
                internalType: "address",
                name: "player",
                type: "address",
            },
        ],
        name: "Exited",
        type: "event",
    },
    {
        inputs: [
            {
                internalType: "address",
                name: "playerEating",
                type: "address",
            },
            {
                internalType: "address",
                name: "playerEaten",
                type: "address",
            },
            {
                internalType: "uint256",
                name: "percentageEaten",
                type: "uint256",
            },
        ],
        name: "eat",
        outputs: [],
        stateMutability: "nonpayable",
        type: "function",
    },
    {
        inputs: [
            {
                internalType: "address",
                name: "player",
                type: "address",
            },
            {
                internalType: "address",
                name: "currency",
                type: "address",
            },
        ],
        name: "enter",
        outputs: [],
        stateMutability: "payable",
        type: "function",
    },
    {
        inputs: [
            {
                internalType: "address",
                name: "player",
                type: "address",
            },
        ],
        name: "exit",
        outputs: [],
        stateMutability: "nonpayable",
        type: "function",
    },
];
