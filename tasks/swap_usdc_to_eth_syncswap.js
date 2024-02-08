const { task } = require("hardhat/config");
const { syncswap } = require("../abi-data/syncswap")
const { erc20 } = require("../abi-data/erc20")
const fs = require('fs');
const { read, write } = require('../utils/jsonFileUtils');

task("swap_usdc_to_eth_syncswap", async (taskArgs, hre) => {
    console.log("Swapping USDC to ETH on Syncswap");
    const accounts = await hre.ethers.getSigners();
    const signer = accounts[0];
    const ROUTER = "0x2da10A1e27bF85cEdD8FFb1AbBe97e53391C0295"
    const USDC_ETH_POOL = "0x80115c708E12eDd42E504c1cD52Aea96C547c05c"
    const USDC = "0x3355df6D4c9C3035724Fd0e3914dE96A5a83aaf4"
    const data = await read('txdata.json');
    const usdtToUse = data.output_usdc_symbiosis ? data.output_usdc_symbiosis : data.output_usdc_mute;

    const usdc = new hre.ethers.Contract(USDC, erc20, signer.provider);
    console.log("Approving USDC to SYNCSWAP ROUTER");
    await usdc.connect(signer).approve(ROUTER, hre.ethers.parseUnits(usdtToUse, 6) + hre.ethers.parseUnits("1", 6))



    const router = new hre.ethers.Contract(ROUTER, syncswap, signer.provider);
    const abiCoder = new hre.ethers.AbiCoder();
    const types = ["address", "address", "uint8"];

    const values = [
        USDC,
        await signer.getAddress(),
        1
    ];
    const SwapStep = {
        pool: USDC_ETH_POOL,
        data: abiCoder.encode(types, values),
        callback: "0x0000000000000000000000000000000000000000",
        callbackData: '0x'
    }
    const SwapPath = {
        steps: [SwapStep],
        tokenIn: USDC,
        amountIn: hre.ethers.parseUnits(usdtToUse, 6)
    }

    const ethBefore = await signer.provider.getBalance(await signer.getAddress());

    const deadline = (await signer.provider.getBlock('latest')).timestamp + 60;
    const swapTx = await router.connect(signer).swap([SwapPath], 0, deadline);
    await swapTx.wait(1);

    const ethAfter = await signer.provider.getBalance(await signer.getAddress());
    const newData = data.output_usdc_symbiosis ? {
        ...data,
        "output_eth": hre.ethers.formatEther(ethAfter - ethBefore),
        "syncswap_swap_txhash1": swapTx.hash


    } : {
        ...data,
        "syncswap_swap_txhash": swapTx.hash,
        "output_eth_syncswap": hre.ethers.formatEther(ethAfter - ethBefore)
    };
    console.log("Swapped", usdtToUse, "USDC TO", hre.ethers.formatEther(ethAfter - ethBefore), "ETH");
    await write('txdata.json', newData);

})