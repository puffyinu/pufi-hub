import { expect } from "chai";
import hre from "hardhat";
import {
  parseEther,
  parseUnits,
  keccak256,
  stringToBytes,
  parseEventLogs,
} from "viem";
import { describe, it } from "node:test";

async function deploySettlementFixture() {
  const runtime = await hre.network.create();

  const viem = runtime.viem;
  if (!viem) throw new Error("Viem is undefined");

  const walletClients = await viem.getWalletClients();

  const [owner, advertiser, platformWallet, rewardWallet] = walletClients;

  const token = await viem.deployContract("ERC20Mock", [
    parseEther("1000000"),
  ]);

  const amountToTransfer = parseEther("1000");

  await token.write.transfer(
    [advertiser.account.address, amountToTransfer],
    { account: owner.account.address },
  );

  const settlement = await viem.deployContract("Settlement", [
    platformWallet.account.address,
    rewardWallet.account.address,
  ]);

  return {
    settlement,
    token,
    owner,
    advertiser,
    platformWallet,
    rewardWallet,
    viem,
  };
}

describe("Settlement", function () {
  it("should store immutable wallets in constructor", async function () {
    const { settlement, platformWallet, rewardWallet } =
      await deploySettlementFixture();

    expect((await settlement.read.platformWallet()).toLowerCase()).to.equal(
      platformWallet.account.address.toLowerCase(),
    );

    expect((await settlement.read.rewardWallet()).toLowerCase()).to.equal(
      rewardWallet.account.address.toLowerCase(),
    );
  });

  it("should successfully settle a campaign", async function () {
    const {
      settlement,
      token,
      advertiser,
      platformWallet,
      rewardWallet,
      viem,
    } = await deploySettlementFixture();

    const budget = parseUnits("100", 18);
    const platformFee = (budget * 30n) / 100n;
    const rewardPool = budget - platformFee;

    await token.write.approve(
      [settlement.address, budget],
      { account: advertiser.account.address },
    );

    const txHash = await settlement.write.settleCampaign(
      [
        "camp1",
        token.address,
        budget,
        advertiser.account.address,
      ],
      { account: advertiser.account.address },
    );

    const publicClient = await viem.getPublicClient();

    const receipt = await publicClient.waitForTransactionReceipt({
      hash: txHash,
    });

    const campaignSettledLogs = parseEventLogs({
      abi: settlement.abi,
      logs: receipt.logs,
      eventName: "CampaignSettled",
    });

    const platformFeeLogs = parseEventLogs({
      abi: settlement.abi,
      logs: receipt.logs,
      eventName: "PlatformFeeTransferred",
    });

    const rewardPoolLogs = parseEventLogs({
      abi: settlement.abi,
      logs: receipt.logs,
      eventName: "RewardPoolFunded",
    });

    expect(campaignSettledLogs).to.have.length(1);
    expect(platformFeeLogs).to.have.length(1);
    expect(rewardPoolLogs).to.have.length(1);

    expect(
      campaignSettledLogs[0].args.advertiser?.toLowerCase(),
    ).to.equal(advertiser.account.address.toLowerCase());

    expect(
      campaignSettledLogs[0].args.token?.toLowerCase(),
    ).to.equal(token.address.toLowerCase());

    expect(
      campaignSettledLogs[0].args.campaignBudget,
    ).to.equal(budget);

    expect(
      campaignSettledLogs[0].args.platformFee,
    ).to.equal(platformFee);

    expect(
      campaignSettledLogs[0].args.rewardPool,
    ).to.equal(rewardPool);

    expect(
      platformFeeLogs[0].args.platformWallet?.toLowerCase(),
    ).to.equal(platformWallet.account.address.toLowerCase());

    expect(
      platformFeeLogs[0].args.token?.toLowerCase(),
    ).to.equal(token.address.toLowerCase());

    expect(
      platformFeeLogs[0].args.amount,
    ).to.equal(platformFee);

    expect(
      rewardPoolLogs[0].args.rewardWallet?.toLowerCase(),
    ).to.equal(rewardWallet.account.address.toLowerCase());

    expect(
      rewardPoolLogs[0].args.token?.toLowerCase(),
    ).to.equal(token.address.toLowerCase());

    expect(
      rewardPoolLogs[0].args.amount,
    ).to.equal(rewardPool);

    const settled = await settlement.read.settledCampaigns([
      keccak256(stringToBytes("camp1")),
    ]);

    expect(settled).to.be.true;

    const platformBalance = await token.read.balanceOf([
      platformWallet.account.address,
    ]);

    const rewardBalance = await token.read.balanceOf([
      rewardWallet.account.address,
    ]);

    expect(platformBalance).to.equal(platformFee);
    expect(rewardBalance).to.equal(rewardPool);
  });

  it("should reject zero campaignBudget", async function () {
    const { settlement, token, advertiser } =
      await deploySettlementFixture();

    try {
      await settlement.write.settleCampaign(
        [
          "camp1",
          token.address,
          0n,
          advertiser.account.address,
        ],
        { account: advertiser.account.address },
      );

      expect.fail("Should have rejected");
    } catch (error: any) {
      expect(error.message).to.contain("InvalidBudget");
    }
  });

  it("should reject zero advertiser", async function () {
    const { settlement, token } =
      await deploySettlementFixture();

    try {
      await settlement.write.settleCampaign(
        [
          "camp1",
          token.address,
          parseUnits("100", 18),
          "0x0000000000000000000000000000000000000000",
        ],
      );

      expect.fail("Should have rejected");
    } catch (error: any) {
      expect(error.message).to.contain("InvalidAdvertiser");
    }
  });

  it("should reject zero token address", async function () {
    const { settlement, advertiser } =
      await deploySettlementFixture();

    try {
      await settlement.write.settleCampaign(
        [
          "camp1",
          "0x0000000000000000000000000000000000000000",
          parseUnits("100", 18),
          advertiser.account.address,
        ],
        { account: advertiser.account.address },
      );

      expect.fail("Should have rejected");
    } catch (error: any) {
      expect(error.message).to.contain("InvalidToken");
    }
  });

  it("should reject duplicate campaign", async function () {
    const { settlement, token, advertiser } =
      await deploySettlementFixture();

    const budget = parseUnits("100", 18);

    await token.write.approve(
      [settlement.address, budget * 2n],
      { account: advertiser.account.address },
    );

    await settlement.write.settleCampaign(
      [
        "camp1",
        token.address,
        budget,
        advertiser.account.address,
      ],
      { account: advertiser.account.address },
    );

    try {
      await settlement.write.settleCampaign(
        [
          "camp1",
          token.address,
          budget,
          advertiser.account.address,
        ],
        { account: advertiser.account.address },
      );

      expect.fail("Should have rejected");
    } catch (error: any) {
      expect(error.message).to.contain("CampaignAlreadySettled");
    }
  });

  it("should settle different campaign IDs independently", async function () {
    const { settlement, token, advertiser } =
      await deploySettlementFixture();

    const budget = parseUnits("100", 18);

    await token.write.approve(
      [settlement.address, budget * 2n],
      { account: advertiser.account.address },
    );

    await settlement.write.settleCampaign(
      [
        "camp1",
        token.address,
        budget,
        advertiser.account.address,
      ],
      { account: advertiser.account.address },
    );

    await settlement.write.settleCampaign(
      [
        "camp2",
        token.address,
        budget,
        advertiser.account.address,
      ],
      { account: advertiser.account.address },
    );

    expect(
      await settlement.read.settledCampaigns([
        keccak256(stringToBytes("camp1")),
      ]),
    ).to.be.true;

    expect(
      await settlement.read.settledCampaigns([
        keccak256(stringToBytes("camp2")),
      ]),
    ).to.be.true;
  });

  it("should correctly distribute 30 percent platform fee and 70 percent reward pool", async function () {
    const {
      settlement,
      token,
      advertiser,
      platformWallet,
      rewardWallet,
    } = await deploySettlementFixture();

    const budget = parseUnits("1000", 18);

    await token.write.approve(
      [settlement.address, budget],
      { account: advertiser.account.address },
    );

    await settlement.write.settleCampaign(
      [
        "distribution-test",
        token.address,
        budget,
        advertiser.account.address,
      ],
      { account: advertiser.account.address },
    );

    const platformFee = (budget * 30n) / 100n;
    const rewardPool = budget - platformFee;

    expect(
      await token.read.balanceOf([platformWallet.account.address]),
    ).to.equal(platformFee);

    expect(
      await token.read.balanceOf([rewardWallet.account.address]),
    ).to.equal(rewardPool);
  });

  it("should reject insufficient allowance", async function () {
    const { settlement, token, advertiser } =
      await deploySettlementFixture();

    const budget = parseUnits("100", 18);
    const allowance = parseUnits("99", 18);

    await token.write.approve(
      [settlement.address, allowance],
      { account: advertiser.account.address },
    );

    try {
      await settlement.write.settleCampaign(
        [
          "insufficient-allowance",
          token.address,
          budget,
          advertiser.account.address,
        ],
        { account: advertiser.account.address },
      );

      expect.fail("Should have rejected");
    } catch (error: any) {
      expect(error).to.exist;
    }
  });

  it("should reject insufficient advertiser balance", async function () {
    const { settlement, token, advertiser } =
      await deploySettlementFixture();

    const advertiserBalance = await token.read.balanceOf([
      advertiser.account.address,
    ]);

    const budget = advertiserBalance + 1n;

    await token.write.approve(
      [settlement.address, budget],
      { account: advertiser.account.address },
    );

    try {
      await settlement.write.settleCampaign(
        [
          "insufficient-balance",
          token.address,
          budget,
          advertiser.account.address,
        ],
        { account: advertiser.account.address },
      );

      expect.fail("Should have rejected");
    } catch (error: any) {
      expect(error).to.exist;
    }
  });

  it("should preserve exact budget conservation for a 1-unit campaign", async function () {
    const {
      settlement,
      token,
      advertiser,
      platformWallet,
      rewardWallet,
    } = await deploySettlementFixture();

    const budget = 1n;

    await token.write.approve(
      [settlement.address, budget],
      { account: advertiser.account.address },
    );

    await settlement.write.settleCampaign(
      [
        "rounding-1",
        token.address,
        budget,
        advertiser.account.address,
      ],
      { account: advertiser.account.address },
    );

    const platformBalance = await token.read.balanceOf([
      platformWallet.account.address,
    ]);

    const rewardBalance = await token.read.balanceOf([
      rewardWallet.account.address,
    ]);

    const platformFee = (budget * 30n) / 100n;
    const rewardPool = budget - platformFee;

    expect(platformFee + rewardPool).to.equal(budget);
    expect(platformBalance).to.equal(platformFee);
    expect(rewardBalance).to.equal(rewardPool);
  });

  for (const budget of [99n, 101n]) {
    it(`should conserve exact budget for boundary budget ${budget}`, async function () {
      const {
        settlement,
        token,
        advertiser,
        platformWallet,
        rewardWallet,
      } = await deploySettlementFixture();

      await token.write.approve(
        [settlement.address, budget],
        { account: advertiser.account.address },
      );

      await settlement.write.settleCampaign(
        [
          `boundary-${budget}`,
          token.address,
          budget,
          advertiser.account.address,
        ],
        { account: advertiser.account.address },
      );

      const platformFee = (budget * 30n) / 100n;
      const rewardPool = budget - platformFee;

      const platformBalance = await token.read.balanceOf([
        platformWallet.account.address,
      ]);

      const rewardBalance = await token.read.balanceOf([
        rewardWallet.account.address,
      ]);

      expect(platformFee + rewardPool).to.equal(budget);
      expect(platformBalance).to.equal(platformFee);
      expect(rewardBalance).to.equal(rewardPool);
    });
  }

  it("should reject zero platform wallet in constructor", async function () {
    const runtime = await hre.network.create();

    const viem = runtime.viem;
    if (!viem) throw new Error("Viem is undefined");

    const wallets = await viem.getWalletClients();

    try {
      await viem.deployContract("Settlement", [
        "0x0000000000000000000000000000000000000000",
        wallets[2].account.address,
      ]);

      expect.fail("Should have rejected");
    } catch (error: any) {
      expect(error.message).to.contain("ZeroAddress");
    }
  });

  it("should reject zero reward wallet in constructor", async function () {
    const runtime = await hre.network.create();

    const viem = runtime.viem;
    if (!viem) throw new Error("Viem is undefined");

    const wallets = await viem.getWalletClients();

    try {
      await viem.deployContract("Settlement", [
        wallets[2].account.address,
        "0x0000000000000000000000000000000000000000",
      ]);

      expect.fail("Should have rejected");
    } catch (error: any) {
      expect(error.message).to.contain("ZeroAddress");
    }
  });
});
