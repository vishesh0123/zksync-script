const { task } = require("hardhat/config");
const fs = require('fs');
const { read, write } = require('../../utils/jsonFileUtils');

task("mainnet", async (taskArgs, hre) => {
    console.log(`1.Bridged ETH from ${process.env.START_CHAIN} to zksync Era`);
    // await hre.run('bridge_to_zksync_era');

    console.log(`2.Swapping ETH to USDC on MUTE`);
    await hre.run('swap_eth_to_usdc_mute');

    console.log(`3.Swapping USDC to ETH on SYNCSWAP`);
    await hre.run('swap_usdc_to_eth_syncswap');

    console.log("4.Swapping ETH TO USDC SYMBIOSIS");
    await hre.run('swap_eth_to_usdc_symbiosis');

    console.log(`5.Swapping USDC to ETH MES/SYNCSWAP`);
    await hre.run('swap_usdc_to_eth_syncswap')

    console.log(`6.Bridging Out ETH from zksync Era to ${process.env.START_CHAIN} back`);
    await hre.run('bridge_out');

    const data = await read('txdata.json');
    const date = new Date();
    await write('txdata.json', {});
    await write(`${date}.json`, { ...data });

    console.log(`${date}.json file created for all tx info`);
    console.log("Done :)");
})