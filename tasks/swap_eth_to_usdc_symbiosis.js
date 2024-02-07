const { task } = require("hardhat/config");
const { symbiosis } = require("../abi-data/symbiosis")
const fs = require('fs');
const { read, write } = require('../utils/jsonFileUtils')


task("swap_eth_to_usdc_symbiosis", async (taskArgs, hre) => {
    const accounts = await hre.ethers.getSigners();
    const signer = accounts[0];
    const data = await read('txdata.json');
    const ethToUse = data.output_eth;
    const fee = BigInt(300000000000000)
    const ROUTER = "0x56C343E7cE75e53e58Ed2f3743C6f137c13D2013"

    const contractInterface = new hre.ethers.Interface(symbiosis);
    const calldata = contractInterface.encodeFunctionData("swap", [
        "0xA9305c3c14757Bae2E73ef7f66FE241f5F6bf347",
        [
            "0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE",
            "0x3355df6D4c9C3035724Fd0e3914dE96A5a83aaf4",
            "0xA9305c3c14757Bae2E73ef7f66FE241f5F6bf347",
            "0x17621DdDCdDF4e713eFC1d8cAD0d79F8C8e0C9dc",
            hre.ethers.parseEther(ethToUse) - fee,
            0,
            0
        ],
        '0x',
        '0x'
    ]);

    const onswap = new hre.ethers.Contract(ROUTER, symbiosis, signer.provider);
    await onswap.connect(signer).onswap("0x0000000000000000000000000000000000000000", hre.ethers.parseEther(ethToUse), "0x6e2B76966cbD9cF4cC2Fa0D76d24d5241E0ABC2F", "0x0000000000000000000000000000000000000000", calldata, {
        value: hre.ethers.parseEther(ethToUse)
    });
    console.log("Tx Success");


})