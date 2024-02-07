const symbiosis = [
    {
        "inputs": [
            {
                "internalType": "address",
                "name": "token",
                "type": "address"
            },
            {
                "internalType": "uint256",
                "name": "amount",
                "type": "uint256"
            },
            {
                "internalType": "address",
                "name": "dex",
                "type": "address"
            },
            {
                "internalType": "address",
                "name": "dexgateway",
                "type": "address"
            },
            {
                "internalType": "bytes",
                "name": "calldata_",
                "type": "bytes"
            }
        ],
        "name": "onswap",
        "outputs": [],
        "stateMutability": "payable",
        "type": "function",
        "payable": true
    },
    {
        "inputs": [
            {
                "internalType": "address",
                "name": "executor",
                "type": "address"
            },
            {
                "components": [
                    {
                        "internalType": "address",
                        "name": "srcToken",
                        "type": "address"
                    },
                    {
                        "internalType": "address",
                        "name": "dstToken",
                        "type": "address"
                    },
                    {
                        "internalType": "address payable",
                        "name": "srcReceiver",
                        "type": "address"
                    },
                    {
                        "internalType": "address payable",
                        "name": "dstReceiver",
                        "type": "address"
                    },
                    {
                        "internalType": "uint256",
                        "name": "amount",
                        "type": "uint256"
                    },
                    {
                        "internalType": "uint256",
                        "name": "minReturnAmount",
                        "type": "uint256"
                    },
                    {
                        "internalType": "uint256",
                        "name": "flags",
                        "type": "uint256"
                    }
                ],
                "internalType": "struct SwapDescription",
                "name": "desc",
                "type": "tuple"
            },
            {
                "internalType": "bytes",
                "name": "permit",
                "type": "bytes"
            },
            {
                "internalType": "bytes",
                "name": "data",
                "type": "bytes"
            }
        ],
        "name": "swap",
        "outputs": [
            {
                "internalType": "uint256",
                "name": "returnAmount",
                "type": "uint256"
            },
            {
                "internalType": "uint256",
                "name": "spentAmount",
                "type": "uint256"
            }
        ],
        "stateMutability": "payable",
        "type": "function"
    }
]

module.exports = { symbiosis }
