const hre = require("hardhat");
const { ethers } = hre;

const CELO_SEPOLIA_USDM = "0xEF4d55D6dE8e8d73232827Cd1e9b2F2dBb45bC80";

async function main() {
    console.log("Starting deployment to Celo Sepolia...");

    const [deployer] = await hre.ethers.getSigners();
    console.log("Deploying contracts with the account:", deployer.address);

    const stableToken = await ethers.getContractAt(
        [
            "function symbol() view returns (string)",
            "function decimals() view returns (uint8)"
        ],
        CELO_SEPOLIA_USDM
    );
    console.log("Using Celo Sepolia stable token:", CELO_SEPOLIA_USDM);
    console.log("Stable token symbol:", await stableToken.symbol());

    // 1. Deploy the savings vault using the official Celo Sepolia stable token.
    const YieldVault = await hre.ethers.getContractFactory("YieldVault");
    const yieldVault = await YieldVault.deploy(CELO_SEPOLIA_USDM, "Farsi Savings Vault", "fSAVE");
    await yieldVault.waitForDeployment();
    const yieldVaultAddress = await yieldVault.getAddress();
    console.log("SavingsVault deployed to:", yieldVaultAddress);

    // 2. Deploy the shared pot factory against the same stable token.
    const SharedPotFactory = await hre.ethers.getContractFactory("SharedPotFactory");
    const factory = await SharedPotFactory.deploy(CELO_SEPOLIA_USDM);
    await factory.waitForDeployment();
    const factoryAddress = await factory.getAddress();
    console.log("SharedPotFactory deployed to:", factoryAddress);

    console.log("\nDeployment completed successfully!");
    console.log("-----------------------------------");
    console.log("StableToken:", CELO_SEPOLIA_USDM);
    console.log("SavingsVault:", yieldVaultAddress);
    console.log("SharedPotFactory:", factoryAddress);
}

main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});
