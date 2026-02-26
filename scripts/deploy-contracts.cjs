const hre = require("hardhat");

async function main() {
    console.log("Starting deployment to Flow EVM Testnet...");

    const [deployer] = await hre.ethers.getSigners();
    console.log("Deploying contracts with the account:", deployer.address);

    // 1. Deploy Mock USDC
    const MockUSDC = await hre.ethers.getContractFactory("MockUSDC");
    const musdc = await MockUSDC.deploy();
    await musdc.waitForDeployment();
    const musdcAddress = await musdc.getAddress();
    console.log("Mock USDC deployed to:", musdcAddress);

    // 2. Deploy YieldVault
    const YieldVault = await hre.ethers.getContractFactory("YieldVault");
    const yieldVault = await YieldVault.deploy(musdcAddress, "Farsi Yield Vault", "fYV");
    await yieldVault.waitForDeployment();
    const yieldVaultAddress = await yieldVault.getAddress();
    console.log("YieldVault deployed to:", yieldVaultAddress);

    // 3. Deploy SharedPotFactory
    const SharedPotFactory = await hre.ethers.getContractFactory("SharedPotFactory");
    const factory = await SharedPotFactory.deploy(musdcAddress);
    await factory.waitForDeployment();
    const factoryAddress = await factory.getAddress();
    console.log("SharedPotFactory deployed to:", factoryAddress);

    console.log("\nDeployment completed successfully!");
    console.log("-----------------------------------");
    console.log("mUSDC:", musdcAddress);
    console.log("YieldVault:", yieldVaultAddress);
    console.log("SharedPotFactory:", factoryAddress);
}

main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});
