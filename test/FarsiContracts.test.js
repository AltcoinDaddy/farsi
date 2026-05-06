const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("Farsi contracts", function () {
    async function deployFixture() {
        const [owner, alice, bob] = await ethers.getSigners();

        const MockUSDC = await ethers.getContractFactory("MockUSDC");
        const usdc = await MockUSDC.deploy();
        await usdc.waitForDeployment();

        const YieldVault = await ethers.getContractFactory("YieldVault");
        const vault = await YieldVault.deploy(
            await usdc.getAddress(),
            "Farsi Yield Vault",
            "fYV"
        );
        await vault.waitForDeployment();

        const SharedPotFactory = await ethers.getContractFactory("SharedPotFactory");
        const factory = await SharedPotFactory.deploy(await usdc.getAddress());
        await factory.waitForDeployment();

        return { owner, alice, bob, usdc, vault, factory };
    }

    it("restricts minting to the token owner", async function () {
        const { owner, alice, usdc } = await deployFixture();
        const mintAmount = ethers.parseUnits("250", 18);

        await expect(
            usdc.connect(alice).mint(alice.address, mintAmount)
        ).to.be.revertedWithCustomError(usdc, "OwnableUnauthorizedAccount");

        await expect(usdc.connect(owner).mint(alice.address, mintAmount))
            .to.changeTokenBalance(usdc, alice, mintAmount);
    });

    it("lets users deposit and withdraw from the vault", async function () {
        const { owner, alice, usdc, vault } = await deployFixture();
        const depositAmount = ethers.parseUnits("100", 18);

        await usdc.connect(owner).mint(alice.address, depositAmount);
        await usdc.connect(alice).approve(await vault.getAddress(), depositAmount);

        await expect(
            vault.connect(alice).deposit(depositAmount, alice.address)
        ).to.changeTokenBalances(
            usdc,
            [alice, vault],
            [-depositAmount, depositAmount]
        );

        expect(await vault.balanceOf(alice.address)).to.equal(depositAmount);

        await expect(vault.connect(owner).injectYield(ethers.parseUnits("10", 18)))
            .to.emit(vault, "YieldInjected");

        await expect(
            vault.connect(alice).withdraw(depositAmount, alice.address, alice.address)
        ).to.changeTokenBalance(usdc, alice, depositAmount);
    });

    it("creates shared pots and enforces the target before withdrawal", async function () {
        const { owner, alice, bob, usdc, factory } = await deployFixture();
        const targetAmount = ethers.parseUnits("50", 18);
        const contributionAmount = ethers.parseUnits("25", 18);

        const createTx = await factory.connect(alice).createPot("Trip Fund", targetAmount);
        const receipt = await createTx.wait();
        const event = receipt.logs.find((log) => log.fragment?.name === "PotCreated");
        const potAddress = event.args.potAddress;

        const pot = await ethers.getContractAt("SharedPot", potAddress);

        expect(await pot.creator()).to.equal(alice.address);
        expect(await pot.name()).to.equal("Trip Fund");
        expect(await pot.targetAmount()).to.equal(targetAmount);

        await usdc.connect(owner).mint(alice.address, contributionAmount);
        await usdc.connect(owner).mint(bob.address, contributionAmount);

        await usdc.connect(alice).approve(potAddress, contributionAmount);
        await usdc.connect(bob).approve(potAddress, contributionAmount);

        await expect(pot.connect(alice).contribute(contributionAmount))
            .to.changeTokenBalance(usdc, pot, contributionAmount);

        await expect(pot.connect(bob).withdraw()).to.be.revertedWith("Only creator");
        await expect(pot.connect(alice).withdraw()).to.be.revertedWith("Target not met");

        await expect(pot.connect(bob).contribute(contributionAmount))
            .to.changeTokenBalance(usdc, pot, contributionAmount);

        await expect(pot.connect(alice).withdraw())
            .to.changeTokenBalance(usdc, alice, targetAmount);
    });
});
