const { ethers, upgrades } = require("hardhat");
const {verifyContract } = require("./verifyUtils");

async function deployContracts() {
  const [operator] = await ethers.getSigners();
  const Lottery = await ethers.getContractFactory("LotteryUpgradeable");

  const lotteryProxy = await upgrades.deployProxy(Lottery, [operator.address]);
  await lotteryProxy.waitForDeployment();
  const lotteryProxyAddress = await lotteryProxy.getAddress();
  const lotteryImplementationAddress = await upgrades.erc1967.getImplementationAddress(lotteryProxyAddress);
  
  const contractInfo = {
    owner: operator.address,
    implementationAddress: lotteryImplementationAddress,
    proxyAddress: lotteryProxyAddress
  };
  console.table(contractInfo);
  
  
  for (let i = 0; i < 3; i++) {
    // verify for whitelist contract
    await verifyContract(lotteryProxy, []);
  }
}

deployContracts().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
