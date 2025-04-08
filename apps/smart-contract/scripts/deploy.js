const { ethers, upgrades } = require("hardhat");
const {verifyContract } = require("./verifyUtils");

async function deployContracts() {
  const [_, __, operator] = await ethers.getSigners();
  const Lottery = await ethers.getContractFactory("DLottery", [operator.address]);
  console.log("🚀 ~ deployContracts ~ Lottery:", Lottery)

  const lotteryProxy = await upgrades.deployProxy(Lottery, [operator.address]);
  console.log("🚀 ~ deployContracts ~ lotteryProxy:", lotteryProxy)
  await lotteryProxy.waitForDeployment();
  const lotteryProxyAddress = await lotteryProxy.getAddress();
  console.log("🚀 ~ deployContracts ~ lotteryProxyAddress:", lotteryProxyAddress)
  const lotteryImplementationAddress = await upgrades.erc1967.getImplementationAddress(lotteryProxyAddress);
  console.log("🚀 ~ deployContracts ~ lotteryImplementationAddress:", lotteryImplementationAddress)
  
  const contractInfo = {
    owner: operator.address,
    implementationAddress: lotteryImplementationAddress,
    proxyAddress: lotteryProxyAddress
  };
  console.log("🚀 ~ deployContracts ~ contractInfo:", contractInfo)
  console.table(contractInfo);
  
  
  for (let i = 0; i < 3; i++) {
    // verify for whitelist contract
    await verifyContract(lotteryProxy, [operator.address]);
  }
}

deployContracts().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
