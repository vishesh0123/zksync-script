# Instructions To run scripts

Setup local repo

```shell
git clone https://github.com/vishesh0123/zksync-script
```

Go to project root

```shell
cd zksync-script/
```

Install node modules (requires nodeJS)

```shell
npm install --force
```

Now checkout .env file
SET ```START_CHAIN``` to network from which you want to bridge eth it will be bridged to zksync

options currently available are ```arbitrum``` ```ethereum``` ```optimism```

SET ```INITIAL_BRIDGE_AMOUNT``` its the inital eth amount that will be bridged to ZKSYNC try to set it more than $50 in ETH 
also ensure you have good amount of eth on zksync for gas utilization purpose

```INITIAL_BRIDGE_AMOUNT``` what you set here will be bridged to zksync and
lets say we got $50 worth eth on zksync , that full $50 ETH will be used for swapping from eth to usdc , gas needed for this should be present already

```PRIVATE_KEY``` set your private key in .env

Now run 

```npm run start:arbitrum``` if your start chain is arbitrum
```npm run start:ethereum``` if your start chain is ethereum mainnet
```npm run start:optimism``` if your start chain is optimism

