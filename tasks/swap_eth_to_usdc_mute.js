const { task } = require("hardhat/config");
const { mute_abi } = require("../abi-data/mute")
const { erc20 } = require("../abi-data/erc20")
const fs = require('fs');
const { read, write } = require('../utils/jsonFileUtils')

task("swap_eth_to_usdc_mute", async (taskArgs, hre) => {
    const accounts = await hre.ethers.getSigners();
    const signer = accounts[0];

    const WETH = "0x5AEa5775959fBC2557Cc8789bC1bf90A239D9a91"
    const ROUTER = "0x8B791913eB07C32779a16750e3868aA8495F5964"
    const weth = new hre.ethers.Contract(WETH, erc20, signer.provider);
    const data = await read('txdata.json');
    let ethToUse = data.ethReceivedOnZksyncEra;
    if (parseFloat(ethToUse) > 0.012) {
        ethToUse = (parseFloat(ethToUse) - 0.004).toFixed(18) // Ensuring precision suitable for Ethereum
    } else {
        ethToUse = (parseFloat(ethToUse) - 0.002).toFixed(18); // Adjusting and ensuring precision
    }

    console.log("Converting ETH to WETH");
    await weth.connect(signer).deposit({
        value: hre.ethers.parseEther(ethToUse)
    })
    console.log("Successfully Converted ETH to WETH");
    console.log("Approving WETH to MUTE pool for swap");
    await weth.connect(signer).approve(ROUTER, hre.ethers.parseEther(ethToUse.toString()) + hre.ethers.parseEther("1"));

    const USDC = "0x3355df6D4c9C3035724Fd0e3914dE96A5a83aaf4"
    const usdc = new hre.ethers.Contract(USDC, erc20, signer.provider);
    const usdcBefore = await usdc.balanceOf(await signer.getAddress());

    const router = new hre.ethers.Contract(ROUTER, mute_abi, signer.provider)
    const deadline = (await signer.provider.getBlock('latest')).timestamp + 60;
    const swapTx = await router.connect(signer).swapExactTokensForTokens(hre.ethers.parseEther(ethToUse.toString()), 0, [WETH, USDC], await signer.getAddress(), deadline, [false]);
    console.log("Swap on MUTE sucessfull..");
    await swapTx.wait(1);
    const usdcAfter = await usdc.balanceOf(await signer.getAddress());
    console.log("SWAPPED", ethToUse, "ETH for", hre.ethers.formatUnits(usdcAfter - usdcBefore, 6), "USDC");
    const newData = {
        ...data,
        "mute_swap_txhash": swapTx.hash,
        "output_usdc_mute": hre.ethers.formatUnits(usdcAfter - usdcBefore, 6)
    }
    await write('txdata.json', newData);


})