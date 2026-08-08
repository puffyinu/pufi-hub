import { expect } from "chai";
import hre from "hardhat";
import {
  parseEther,
  keccak256,
  stringToBytes,
  parseEventLogs,
} from "viem";
import { describe, it } from "node:test";

async function deployEscrowFixture() {
  const runtime = await hre.network.create();

  const viem = runtime.viem;
  if (!viem) throw new Error("Viem is undefined");

  const wallets = await viem.getWalletClients();

  const [
    owner,
    operator,
    advertiser,
    platformFeeWallet,
    user,
    alternateOperator,
  ] = wallets;

  const token = await viem.deployContract("ERC20Mock", [
    parseEther("1000000"),
  ]);

  const advertiserFunding = parseEther("2000");

  await token.write.transfer(
    [advertiser.account.address, advertiserFunding],
    { account: owner.account.address },
  );

  const escrow = await viem.deployContract("PufiCampaignEscrow", [
    owner.account.address,
    operator.account.address,
    platformFeeWallet.account.address,
  ]);

  return {
    escrow,
    token,
    owner,
    operator,
    advertiser,
    platformFeeWallet,
    user,
    alternateOperator,
    viem,
  };
}

function campaignId(value: string) {
  return keccak256(stringToBytes(value));
}

describe("PufiCampaignEscrow", function () {
  it("should initialize owner, operator and platform fee wallet", async function () {
    const {
      escrow,
      owner,
      operator,
      platformFeeWallet,
    } = await deployEscrowFixture();

    expect(
      (await escrow.read.owner()).toLowerCase(),
    ).to.equal(owner.account.address.toLowerCase());

    expect(
      (await escrow.read.operator()).toLowerCase(),
    ).to.equal(operator.account.address.toLowerCase());

    expect(
      (await escrow.read.platformFeeWallet()).toLowerCase(),
    ).to.equal(platformFeeWallet.account.address.toLowerCase());
  });

  it("should create a campaign and lock the pool while forwarding the fee", async function () {
    const {
      escrow,
      token,
      advertiser,
      platformFeeWallet,
    } = await deployEscrowFixture();

    const id = campaignId("campaign-1");
    const poolAmount = parseEther("700");
    const feeAmount = parseEther("300");

    await token.write.approve(
      [escrow.address, poolAmount + feeAmount],
      { account: advertiser.account.address },
    );

    const advertiserBefore = await token.read.balanceOf([
      advertiser.account.address,
    ]);

    const platformBefore = await token.read.balanceOf([
      platformFeeWallet.account.address,
    ]);

    await escrow.write.createCampaign(
      [id, token.address, poolAmount, feeAmount],
      { account: advertiser.account.address },
    );

    expect(
      await escrow.read.campaignExists([id]),
    ).to.equal(true);

    expect(
      await escrow.read.campaignBalance([id, token.address]),
    ).to.equal(poolAmount);

    expect(
      await token.read.balanceOf([escrow.address]),
    ).to.equal(poolAmount);

    expect(
      await token.read.balanceOf([
        platformFeeWallet.account.address,
      ]),
    ).to.equal(platformBefore + feeAmount);

    expect(
      await token.read.balanceOf([
        advertiser.account.address,
      ]),
    ).to.equal(advertiserBefore - poolAmount - feeAmount);
  });

  it("should reject duplicate campaign IDs", async function () {
    const {
      escrow,
      token,
      advertiser,
    } = await deployEscrowFixture();

    const id = campaignId("duplicate");
    const poolAmount = parseEther("700");
    const feeAmount = parseEther("300");

    await token.write.approve(
      [escrow.address, (poolAmount + feeAmount) * 2n],
      { account: advertiser.account.address },
    );

    await escrow.write.createCampaign(
      [id, token.address, poolAmount, feeAmount],
      { account: advertiser.account.address },
    );

    try {
      await escrow.write.createCampaign(
        [id, token.address, poolAmount, feeAmount],
        { account: advertiser.account.address },
      );

      expect.fail("Expected duplicate campaign to revert");
    } catch (error: any) {
      expect(error.message).to.contain("CampaignAlreadyExists");
    }
  });

  it("should reject zero token address", async function () {
    const {
      escrow,
      advertiser,
    } = await deployEscrowFixture();

    const id = campaignId("zero-token");

    try {
      await escrow.write.createCampaign(
        [
          id,
          "0x0000000000000000000000000000000000000000",
          parseEther("700"),
          parseEther("300"),
        ],
        { account: advertiser.account.address },
      );

      expect.fail("Expected zero token to revert");
    } catch (error: any) {
      expect(error.message).to.contain("ZeroAddress");
    }
  });

  it("should reject zero pool amount", async function () {
    const {
      escrow,
      token,
      advertiser,
    } = await deployEscrowFixture();

    const id = campaignId("zero-pool");

    try {
      await escrow.write.createCampaign(
        [
          id,
          token.address,
          0n,
          parseEther("300"),
        ],
        { account: advertiser.account.address },
      );

      expect.fail("Expected zero pool to revert");
    } catch (error: any) {
      expect(error.message).to.contain("ZeroAmount");
    }
  });

  it("should reject zero fee amount", async function () {
    const {
      escrow,
      token,
      advertiser,
    } = await deployEscrowFixture();

    const id = campaignId("zero-fee");

    try {
      await escrow.write.createCampaign(
        [
          id,
          token.address,
          parseEther("700"),
          0n,
        ],
        { account: advertiser.account.address },
      );

      expect.fail("Expected zero fee to revert");
    } catch (error: any) {
      expect(error.message).to.contain("ZeroAmount");
    }
  });

  it("should release rewards only through the operator", async function () {
    const {
      escrow,
      token,
      advertiser,
      operator,
      user,
    } = await deployEscrowFixture();

    const id = campaignId("reward");
    const poolAmount = parseEther("700");
    const feeAmount = parseEther("300");
    const reward = parseEther("2");

    await token.write.approve(
      [escrow.address, poolAmount + feeAmount],
      { account: advertiser.account.address },
    );

    await escrow.write.createCampaign(
      [id, token.address, poolAmount, feeAmount],
      { account: advertiser.account.address },
    );

    const userBefore = await token.read.balanceOf([
      user.account.address,
    ]);

    await escrow.write.releaseReward(
      [id, token.address, user.account.address, reward],
      { account: operator.account.address },
    );

    expect(
      await token.read.balanceOf([user.account.address]),
    ).to.equal(userBefore + reward);

    expect(
      await escrow.read.campaignBalance([id, token.address]),
    ).to.equal(poolAmount - reward);
  });

  it("should reject reward release from a non-operator", async function () {
    const {
      escrow,
      token,
      advertiser,
      user,
    } = await deployEscrowFixture();

    const id = campaignId("unauthorized");
    const poolAmount = parseEther("700");
    const feeAmount = parseEther("300");

    await token.write.approve(
      [escrow.address, poolAmount + feeAmount],
      { account: advertiser.account.address },
    );

    await escrow.write.createCampaign(
      [id, token.address, poolAmount, feeAmount],
      { account: advertiser.account.address },
    );

    try {
      await escrow.write.releaseReward(
        [id, token.address, user.account.address, parseEther("2")],
        { account: advertiser.account.address },
      );

      expect.fail("Expected non-operator release to revert");
    } catch (error: any) {
      expect(error.message).to.contain("NotOperator");
    }
  });

  it("should reject reward larger than remaining campaign balance", async function () {
    const {
      escrow,
      token,
      advertiser,
      operator,
      user,
    } = await deployEscrowFixture();

    const id = campaignId("over-payout");
    const poolAmount = parseEther("700");
    const feeAmount = parseEther("300");

    await token.write.approve(
      [escrow.address, poolAmount + feeAmount],
      { account: advertiser.account.address },
    );

    await escrow.write.createCampaign(
      [id, token.address, poolAmount, feeAmount],
      { account: advertiser.account.address },
    );

    try {
      await escrow.write.releaseReward(
        [
          id,
          token.address,
          user.account.address,
          poolAmount + 1n,
        ],
        { account: operator.account.address },
      );

      expect.fail("Expected over-payout to revert");
    } catch (error: any) {
      expect(error.message).to.contain(
        "InsufficientCampaignBalance",
      );
    }
  });

  it("should keep campaign balances isolated", async function () {
    const {
      escrow,
      token,
      advertiser,
      operator,
      user,
    } = await deployEscrowFixture();

    const id1 = campaignId("campaign-a");
    const id2 = campaignId("campaign-b");

    const pool1 = parseEther("700");
    const pool2 = parseEther("200");
    const fee1 = parseEther("300");
    const fee2 = parseEther("100");

    await token.write.approve(
      [escrow.address, pool1 + fee1 + pool2 + fee2],
      { account: advertiser.account.address },
    );

    await escrow.write.createCampaign(
      [id1, token.address, pool1, fee1],
      { account: advertiser.account.address },
    );

    await escrow.write.createCampaign(
      [id2, token.address, pool2, fee2],
      { account: advertiser.account.address },
    );

    const reward = parseEther("50");

    await escrow.write.releaseReward(
      [id1, token.address, user.account.address, reward],
      { account: operator.account.address },
    );

    expect(
      await escrow.read.campaignBalance([id1, token.address]),
    ).to.equal(pool1 - reward);

    expect(
      await escrow.read.campaignBalance([id2, token.address]),
    ).to.equal(pool2);
  });

  it("should allow owner to rotate the operator", async function () {
    const {
      escrow,
      owner,
      operator,
      alternateOperator,
    } = await deployEscrowFixture();

    await escrow.write.setOperator(
      [alternateOperator.account.address],
      { account: owner.account.address },
    );

    expect(
      (await escrow.read.operator()).toLowerCase(),
    ).to.equal(
      alternateOperator.account.address.toLowerCase(),
    );

    expect(
      (await escrow.read.operator()).toLowerCase(),
    ).not.to.equal(
      operator.account.address.toLowerCase(),
    );
  });

  it("should reject zero operator", async function () {
    const {
      escrow,
      owner,
    } = await deployEscrowFixture();

    try {
      await escrow.write.setOperator(
        ["0x0000000000000000000000000000000000000000"],
        { account: owner.account.address },
      );

      expect.fail("Expected zero operator to revert");
    } catch (error: any) {
      expect(error.message).to.contain("ZeroAddress");
    }
  });


  it("should reject operator rotation from non-owner", async function () {
    const {
      escrow,
      advertiser,
      alternateOperator,
    } = await deployEscrowFixture();

    try {
      await escrow.write.setOperator(
        [alternateOperator.account.address],
        { account: advertiser.account.address },
      );

      expect.fail("Expected non-owner operator rotation to revert");
    } catch (error: any) {
      expect(error.message).to.contain("OwnableUnauthorizedAccount");
    }
  });

  it("should reject platform fee wallet update from non-owner", async function () {
    const {
      escrow,
      advertiser,
      user,
    } = await deployEscrowFixture();

    try {
      await escrow.write.setPlatformFeeWallet(
        [user.account.address],
        { account: advertiser.account.address },
      );

      expect.fail("Expected non-owner platform wallet update to revert");
    } catch (error: any) {
      expect(error.message).to.contain("OwnableUnauthorizedAccount");
    }
  });

  it("should reject reward release for a nonexistent campaign", async function () {
    const {
      escrow,
      token,
      operator,
      user,
    } = await deployEscrowFixture();

    const id = campaignId("nonexistent");

    try {
      await escrow.write.releaseReward(
        [id, token.address, user.account.address, 1n],
        { account: operator.account.address },
      );

      expect.fail("Expected nonexistent campaign to revert");
    } catch (error: any) {
      expect(error.message).to.contain("CampaignDoesNotExist");
    }
  });

  it("should reject zero reward amount", async function () {
    const {
      escrow,
      token,
      advertiser,
      operator,
      user,
    } = await deployEscrowFixture();

    const id = campaignId("zero-reward");
    const poolAmount = parseEther("700");
    const feeAmount = parseEther("300");

    await token.write.approve(
      [escrow.address, poolAmount + feeAmount],
      { account: advertiser.account.address },
    );

    await escrow.write.createCampaign(
      [id, token.address, poolAmount, feeAmount],
      { account: advertiser.account.address },
    );

    try {
      await escrow.write.releaseReward(
        [id, token.address, user.account.address, 0n],
        { account: operator.account.address },
      );

      expect.fail("Expected zero reward to revert");
    } catch (error: any) {
      expect(error.message).to.contain("ZeroAmount");
    }
  });

  it("should fully deplete campaign balance and reject further release", async function () {
    const {
      escrow,
      token,
      advertiser,
      operator,
      user,
    } = await deployEscrowFixture();

    const id = campaignId("full-release");
    const poolAmount = parseEther("700");
    const feeAmount = parseEther("300");

    await token.write.approve(
      [escrow.address, poolAmount + feeAmount],
      { account: advertiser.account.address },
    );

    await escrow.write.createCampaign(
      [id, token.address, poolAmount, feeAmount],
      { account: advertiser.account.address },
    );

    await escrow.write.releaseReward(
      [id, token.address, user.account.address, poolAmount],
      { account: operator.account.address },
    );

    expect(
      await escrow.read.campaignBalance([id, token.address]),
    ).to.equal(0n);

    try {
      await escrow.write.releaseReward(
        [id, token.address, user.account.address, 1n],
        { account: operator.account.address },
      );

      expect.fail("Expected release after depletion to revert");
    } catch (error: any) {
      expect(error.message).to.contain("InsufficientCampaignBalance");
    }
  });

  it("should reject campaign creation with insufficient allowance", async function () {
    const {
      escrow,
      token,
      advertiser,
    } = await deployEscrowFixture();

    const id = campaignId("insufficient-allowance");
    const poolAmount = parseEther("700");
    const feeAmount = parseEther("300");

    await token.write.approve(
      [escrow.address, poolAmount],
      { account: advertiser.account.address },
    );

    try {
      await escrow.write.createCampaign(
        [id, token.address, poolAmount, feeAmount],
        { account: advertiser.account.address },
      );

      expect.fail("Expected insufficient allowance to revert");
    } catch (error: any) {
      expect(error.message).to.contain("ERC20InsufficientAllowance");
    }
  });

  it("should reject campaign creation with insufficient advertiser balance", async function () {
    const {
      escrow,
      token,
      advertiser,
    } = await deployEscrowFixture();

    const id = campaignId("insufficient-balance");
    const poolAmount = parseEther("1500");
    const feeAmount = parseEther("600");

    await token.write.approve(
      [escrow.address, poolAmount + feeAmount],
      { account: advertiser.account.address },
    );

    try {
      await escrow.write.createCampaign(
        [id, token.address, poolAmount, feeAmount],
        { account: advertiser.account.address },
      );

      expect.fail("Expected insufficient advertiser balance to revert");
    } catch (error: any) {
      expect(error.message).to.contain("ERC20InsufficientBalance");
    }
  });

  it("should reject zero platform fee wallet", async function () {
    const {
      escrow,
      owner,
    } = await deployEscrowFixture();

    try {
      await escrow.write.setPlatformFeeWallet(
        ["0x0000000000000000000000000000000000000000"],
        { account: owner.account.address },
      );

      expect.fail("Expected zero platform wallet to revert");
    } catch (error: any) {
      expect(error.message).to.contain("ZeroAddress");
    }
  });

  it("should emit CampaignCreated with exact accounting values", async function () {
    const {
      viem,
      escrow,
      token,
      advertiser,
      platformFeeWallet,
    } = await deployEscrowFixture();

    const id = campaignId("event-created");
    const poolAmount = parseEther("700");
    const feeAmount = parseEther("300");

    await token.write.approve(
      [escrow.address, poolAmount + feeAmount],
      { account: advertiser.account.address },
    );

    const txHash = await escrow.write.createCampaign(
      [id, token.address, poolAmount, feeAmount],
      { account: advertiser.account.address },
    );

    const publicClient = await viem.getPublicClient();
    const receipt = await publicClient.waitForTransactionReceipt({
      hash: txHash,
    });

    const logs = parseEventLogs({
      abi: escrow.abi,
      logs: receipt.logs,
      eventName: "CampaignCreated",
    });

    expect(logs).to.have.length(1);
    expect(logs[0].args.campaignId).to.equal(id);
    expect(logs[0].args.advertiser?.toLowerCase()).to.equal(
      advertiser.account.address.toLowerCase(),
    );
    expect(logs[0].args.token?.toLowerCase()).to.equal(
      token.address.toLowerCase(),
    );
    expect(logs[0].args.poolAmount).to.equal(poolAmount);
    expect(logs[0].args.feeAmount).to.equal(feeAmount);

    expect(
      await token.read.balanceOf([platformFeeWallet.account.address]),
    ).to.equal(feeAmount);
  });

  it("should emit RewardReleased with exact payout values", async function () {
    const {
      viem,
      escrow,
      token,
      advertiser,
      operator,
      user,
    } = await deployEscrowFixture();

    const id = campaignId("event-released");
    const poolAmount = parseEther("700");
    const feeAmount = parseEther("300");
    const reward = parseEther("25");

    await token.write.approve(
      [escrow.address, poolAmount + feeAmount],
      { account: advertiser.account.address },
    );

    await escrow.write.createCampaign(
      [id, token.address, poolAmount, feeAmount],
      { account: advertiser.account.address },
    );

    const txHash = await escrow.write.releaseReward(
      [id, token.address, user.account.address, reward],
      { account: operator.account.address },
    );

    const publicClient = await viem.getPublicClient();
    const receipt = await publicClient.waitForTransactionReceipt({
      hash: txHash,
    });

    const logs = parseEventLogs({
      abi: escrow.abi,
      logs: receipt.logs,
      eventName: "RewardReleased",
    });

    expect(logs).to.have.length(1);
    expect(logs[0].args.campaignId).to.equal(id);
    expect(logs[0].args.to?.toLowerCase()).to.equal(
      user.account.address.toLowerCase(),
    );
    expect(logs[0].args.token?.toLowerCase()).to.equal(
      token.address.toLowerCase(),
    );
    expect(logs[0].args.amount).to.equal(reward);
  });

  it("should emit admin update events with exact previous and new addresses", async function () {
    const {
      viem,
      escrow,
      owner,
      operator,
      alternateOperator,
      platformFeeWallet,
      user,
    } = await deployEscrowFixture();

    const publicClient = await viem.getPublicClient();

    const operatorTxHash = await escrow.write.setOperator(
      [alternateOperator.account.address],
      { account: owner.account.address },
    );

    const operatorReceipt = await publicClient.waitForTransactionReceipt({
      hash: operatorTxHash,
    });

    const operatorLogs = parseEventLogs({
      abi: escrow.abi,
      logs: operatorReceipt.logs,
      eventName: "OperatorUpdated",
    });

    expect(operatorLogs).to.have.length(1);
    expect(operatorLogs[0].args.previousOperator?.toLowerCase()).to.equal(
      operator.account.address.toLowerCase(),
    );
    expect(operatorLogs[0].args.newOperator?.toLowerCase()).to.equal(
      alternateOperator.account.address.toLowerCase(),
    );

    const feeWalletTxHash = await escrow.write.setPlatformFeeWallet(
      [user.account.address],
      { account: owner.account.address },
    );

    const feeWalletReceipt = await publicClient.waitForTransactionReceipt({
      hash: feeWalletTxHash,
    });

    const feeWalletLogs = parseEventLogs({
      abi: escrow.abi,
      logs: feeWalletReceipt.logs,
      eventName: "PlatformFeeWalletUpdated",
    });

    expect(feeWalletLogs).to.have.length(1);
    expect(feeWalletLogs[0].args.previousWallet?.toLowerCase()).to.equal(
      platformFeeWallet.account.address.toLowerCase(),
    );
    expect(feeWalletLogs[0].args.newWallet?.toLowerCase()).to.equal(
      user.account.address.toLowerCase(),
    );
  });

  it("should fully rollback campaign state when funding transfer fails", async function () {
    const {
      escrow,
      token,
      advertiser,
      platformFeeWallet,
    } = await deployEscrowFixture();

    const id = campaignId("rollback-funding");
    const poolAmount = parseEther("1500");
    const feeAmount = parseEther("600");
    const total = poolAmount + feeAmount;

    await token.write.approve(
      [escrow.address, total],
      { account: advertiser.account.address },
    );

    const platformBefore = await token.read.balanceOf([
      platformFeeWallet.account.address,
    ]);
    const advertiserBefore = await token.read.balanceOf([
      advertiser.account.address,
    ]);

    try {
      await escrow.write.createCampaign(
        [id, token.address, poolAmount, feeAmount],
        { account: advertiser.account.address },
      );

      expect.fail("Expected insufficient advertiser balance to revert");
    } catch (error: any) {
      expect(error.message).to.contain("ERC20InsufficientBalance");
    }

    expect(await escrow.read.campaignExists([id])).to.equal(false);

    expect(
      await escrow.read.campaignBalance([id, token.address]),
    ).to.equal(0n);

    expect(
      await token.read.balanceOf([escrow.address]),
    ).to.equal(0n);

    expect(
      await token.read.balanceOf([
        platformFeeWallet.account.address,
      ]),
    ).to.equal(platformBefore);

    expect(
      await token.read.balanceOf([
        advertiser.account.address,
      ]),
    ).to.equal(advertiserBefore);
  });

});
