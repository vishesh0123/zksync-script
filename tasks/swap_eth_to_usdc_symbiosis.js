const { task } = require("hardhat/config");
const { symbiosis } = require("../abi-data/symbiosis")
const fs = require('fs');
const { read, write } = require('../utils/jsonFileUtils');
const { default: axios } = require("axios");
const { erc20 } = require("../abi-data/erc20")


task("swap_eth_to_usdc_symbiosis", async (taskArgs, hre) => {
    const accounts = await hre.ethers.getSigners();
    const signer = accounts[0];
    const data = await read('txdata.json');
    const ethToUse = hre.ethers.parseEther(data.output_eth_syncswap);
    const fee = BigInt(300000000000000)
    const ROUTER = "0x56C343E7cE75e53e58Ed2f3743C6f137c13D2013"

    const oneInch = "https://api.1inch.dev/swap/v5.2/324/swap"

    console.log("Swapping ETH to USDC on symbiosis");

    const swapParams = {
        chain: 324,
        src: '0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee', // The address of the token you want to swap from (1INCH)
        dst: '0x3355df6d4c9c3035724fd0e3914de96a5a83aaf4', // The address of the token you want to swap to (DAI)
        amount: ethToUse, // The amount of the fromToken you want to swap (in wei)
        from: await signer.getAddress(), // Your wallet address from which the swap will be initiated
        slippage: 2, // The maximum acceptable slippage percentage for the swap (e.g., 1 for 1%)
        disableEstimate: false, // Whether to disable estimation of swap details (set to true to disable)
        allowPartialFill: false, // Whether to allow partial filling of the swap order (set to true to allow)
        receiver: await signer.getAddress()
    };

    const config = {
        headers: {
            "Authorization": "Bearer lut4TaUCkcNDfmLSMWoNwzppFh15wPJU"
        },
        params: swapParams
    }

    const swapCalldata = await axios.get(oneInch, config);
    const calldata = swapCalldata.data.tx.data;

    const USDC = "0x3355df6D4c9C3035724Fd0e3914dE96A5a83aaf4"
    const usdc = new hre.ethers.Contract(USDC, erc20, signer.provider);
    const usdcBefore = await usdc.balanceOf(await signer.getAddress());

    const onswap = new hre.ethers.Contract(ROUTER, symbiosis, signer.provider);
    const swapTx = await onswap.connect(signer).onswap("0x0000000000000000000000000000000000000000", ethToUse, "0x6e2B76966cbD9cF4cC2Fa0D76d24d5241E0ABC2F", "0x0000000000000000000000000000000000000000", calldata, {
        value: ethToUse + fee
    });
    await swapTx.wait(1);
    console.log("Tx Success");
    const usdcAfter = await usdc.balanceOf(await signer.getAddress());
    const newData = {
        ...data,
        "symbiosis_swap_txhash": swapTx.hash,
        "output_usdc_symbiosis": hre.ethers.formatUnits(usdcAfter - usdcBefore, 6)
    }
    await write('txdata.json', newData);
    console.log("Swapped", data.output_eth_syncswap, "ETH TO", hre.ethers.formatUnits(usdcAfter - usdcBefore, 6), "USDC");

})