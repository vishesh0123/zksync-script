const syncswap = [
    {
        "inputs": [
            {
                "components": [
                    {
                        "components": [
                            {
                                "name": "pool",
                                "type": "address"
                            },
                            {
                                "name": "data",
                                "type": "bytes"
                            },
                            {
                                "name": "callback",
                                "type": "address"
                            },
                            {
                                "name": "callbackData",
                                "type": "bytes"
                            }
                        ],
                        "name": "steps",
                        "type": "tuple[]"
                    },
                    {
                        "name": "tokenIn",
                        "type": "address"
                    },
                    {
                        "name": "amountIn",
                        "type": "uint256"
                    }
                ],
                "name": "paths",
                "type": "tuple[]"
            },
            {
                "name": "amountOutMin",
                "type": "uint256"
            },
            {
                "name": "deadline",
                "type": "uint256"
            }
        ],
        "name": "swap",
        "outputs": [
            {
                "components": [
                    {
                        "name": "token",
                        "type": "address"
                    },
                    {
                        "name": "amount",
                        "type": "uint256"
                    }
                ],
                "name": "amountOut",
                "type": "tuple"
            }
        ],
        "stateMutability": "payable",
        "type": "function",
        "payable": true
    }
]

module.exports = { syncswap }