const { default: axios } = require("axios");
const { task } = require("hardhat/config");
const { chainId, ethAddress } = require("../config/constants")
const fs = require('fs');
const { read, write } = require('../utils/jsonFileUtils');

task("bridge_to_zksync_era", async (taskArgs, hre) => {
    let srcChainOptions = ['ethereum', 'arbitrum', 'optimism', 'polygon']
    let srcChain = process.env.START_CHAIN
    if (!srcChain || !srcChainOptions.includes(srcChain)) {
        throw new Error('Invalid Chain Cofigured for `START_CHAIN`');
    }
    console.log("START CHAIN", srcChain);
    const accounts = await hre.ethers.getSigners();
    const signer = accounts[0];
    let balance = await hre.ethers.provider.getBalance(await signer.getAddress())
    if (srcChain === 'polygon') {
        // handle polygon case here
    }
    console.log("ETH balance on", srcChain, "chain: ", hre.ethers.formatEther(balance));
    let initialBridgeAmount = process.env.INITIAL_BRIDGE_AMOUNT;
    if (!initialBridgeAmount || parseFloat(initialBridgeAmount) > hre.ethers.formatEther(balance)) {
        throw new Error('Insufficiant Balance ETH');
    }
    const routers = await axios.get("http://api.orbiter.finance/sdk/routers");
    srcChain = chainId[srcChain]
    const tgtChain = 324
    const srcToken = ethAddress[srcChain]
    const tgtToken = ethAddress[tgtChain]
    let filtered = routers.data.result.filter((router) => {
        return router.srcChain == srcChain && router.tgtChain == tgtChain && router.srcToken == srcToken && router.tgtToken == tgtToken
    })
    filtered = filtered[0];
    const maker = filtered.endpoint;
    console.log("Maker Address:", maker);
    const minAmt = parseFloat(filtered.minAmt) + parseFloat(filtered.withholdingFee);
    const maxAmt = parseFloat(filtered.maxAmt);
    if (initialBridgeAmount > maxAmt) {
        throw new Error(`Max amount allowed to Bridge is ${maxAmt} ETH`);
    } // handle min amount case // state available
    const identificationCode = Number(filtered.vc);
    let amountToSend = hre.ethers.parseEther(initialBridgeAmount);
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
                        console.log("ETH Sent ", initialBridgeAmount);
                        console.log("ETH Received on zksync Era:", result.data.result.targetAmount);

                        const filePath = 'txdata.json';
                        const fileData = await read(filePath);
                        const newData = {
                            ...fileData,
                            "maker": maker,
                            "bridgeInitialTxHash": txHash,
                            "initialBridgeAmount": initialBridgeAmount,
                            "ethReceivedOnZksyncEra": result.data.result.targetAmount
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