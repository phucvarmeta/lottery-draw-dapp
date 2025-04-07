const { ethers, upgrades } = require("hardhat");
const { verifyImplementContract, verifyContract } = require("./verifyUtils");

async function deployContracts() {
    const vaultAddress = "0xf19f08B6146Fd656De76A965a5701a079a92d3A3"; //contract address for vault
    try {
        await hre.run("verify:verify", {
            address: vaultAddress,
            constructorArguments: [],
        });
        console.log(`Contract verified: ${vaultAddress}`);
    } catch (error) {
        console.error(`Error verifying contract ${vaultAddress}:`, error);
    }
}
deployContracts().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});
