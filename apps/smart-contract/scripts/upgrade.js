const { ethers, upgrades } = require("hardhat");

const address = "0xc939EA0499145d93A99402BA2A410c9bA9df3c5d"; // proxy token address testnet

async function main() {
    const LotteryUpgradeable = await ethers.getContractFactory("LotteryUpgradeable");
    const [admin] = await ethers.getSigners()
    console.log("admin: ", admin.address)
    const vaultProxy = await upgrades.upgradeProxy(address, LotteryUpgradeable);
    const vaultProxyAddress = await vaultProxy.target;
    const vaultAddress = await upgrades.erc1967.getImplementationAddress(vaultProxyAddress);
    const contractAddress = {
        proxyAddress: vaultProxyAddress,
        implementationAddress: vaultAddress,
    };
    console.table(contractAddress);
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});
