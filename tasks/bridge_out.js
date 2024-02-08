const { default: axios } = require("axios");
const { task } = require("hardhat/config");
const { chainId, ethAddress } = require("../config/constants")
const fs = require('fs');
const { read, write } = require('../utils/jsonFileUtils');

task("bridge_out", async (taskArgs, hre) => {
    let tgtChain = process.env.START_CHAIN
    const accounts = await hre.ethers.getSigners();
    const signer = accounts[0];

    const data = await read('txdata.json');

    let initialBridgeAmount = hre.ethers.parseEther(data.output_eth);
    const routers = await axios.get("http://api.orbiter.finance/sdk/routers");

    tgtChain = chainId[tgtChain]
    let srcChain = 324

    const srcToken = ethAddress[srcChain]
    const tgtToken = ethAddress[tgtChain]

    let filtered = routers.data.result.filter((router) => {
        return router.srcChain == srcChain && router.tgtChain == tgtChain && router.srcToken == srcToken && router.tgtToken == tgtToken
    })
    filtered = filtered[0];
    const maker = filtered.endpoint;
    console.log("Maker Address:", maker);
    const identificationCode = Number(filtered.vc);

    let amountToSend = initialBridgeAmount;
    let vcDigits = identificationCode.toString().length;
    amountToSend = (amountToSend / BigInt(10 ** vcDigits) * BigInt(10 ** vcDigits))
    amountToSend = amountToSend + BigInt(identificationCode);

    const txData = {
        to: maker,
        value: amountToSend
    }
    const tx = await signer.sendTransaction(txData);

    async function waitForStatus(txHash, interval = 5000) {
        return new Promise((resolve, reject) => {
            const intervalId = setInterval(async () => {
                try {
                    let result = await axios.get(`http://api.orbiter.finance/sdk/transaction/cross-chain/${txHash}`);
                    if (result.data.result && result.data.result.status === 99) {
                        console.log("Status is SUCCESS, stopping checks.");
                        clearInterval(intervalId);
                        console.log("Bridge Successful");
                        console.log("ETH Sent from zksync Era ", initialBridgeAmount);
                        console.log(`ETH Received on ${process.env.START_CHAIN}:`, result.data.result.targetAmount);

                        const filePath = 'txdata.json';
                        const fileData = await read(filePath);
                        const newData = {
                            ...fileData,
                            "bridgeOutTxHash": txHash,
                            "output_eth_bridgeout": result.data.result.targetAmount
                        };
                        await write(filePath, newData);
                        resolve(newData);
                    } else {
                        console.log("Status not SUCCESS yet, checking again...");
                    }
                } catch (error) {
                    console.error("Error fetching status:", error.message);
                    clearInterval(intervalId);
                    reject(error);
                }
            }, interval);
        });
    }

    console.log("Bridging.......");
    await waitForStatus(tx.hash);




})