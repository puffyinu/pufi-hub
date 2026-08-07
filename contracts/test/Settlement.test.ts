import { expect } from "chai";
import { describe, it } from "node:test";
import "@nomicfoundation/hardhat-toolbox-viem";
import hre from "hardhat";
import * as viemLib from "viem";
import { parseEther, parseUnits } from "viem";

describe("Settlement", function () {
  async function deploySettlementFixture() {
    const viem = (hre as any).viem;
    if (!viem) {
       throw new Error("hre.viem is undefined!");
    }
    const [owner, advertiser, platformWallet, rewardWallet] = await viem.getWalletClients();
    const token = await viem.deployContract("ERC20Mock", [parseEther("1000000")]);
    const settlement = await viem.deployContract("Settlement", [platformWallet.account.address, rewardWallet.account.address]);
    
    return { settlement, token, advertiser, platformWallet, rewardWallet };
  }

  it("should store immutable wallets in constructor", async function () {
    const { settlement, platformWallet, rewardWallet } = await deploySettlementFixture();
    expect(await settlement.read.platformWallet()).to.equal(platformWallet.account.address);
    expect(await settlement.read.rewardWallet()).to.equal(rewardWallet.account.address);
  });

  it("should successfully settle a campaign", async function () {
    const { settlement, token, advertiser, platformWallet, rewardWallet } = await deploySettlementFixture();
    const budget = parseUnits("100", 18);
    
    await token.write.approve([settlement.address, budget], { account: advertiser.account });
    
    const tx = await settlement.write.settleCampaign(["camp1", token.address, budget, advertiser.account.address], { account: advertiser.account });
    
    const settled = await settlement.read.settledCampaigns([viemLib.keccak256(viemLib.stringToBytes("camp1"))]);
    expect(settled).to.be.true;
    
    const platformBalance = await token.read.balanceOf([platformWallet.account.address]);
    const rewardBalance = await token.read.balanceOf([rewardWallet.account.address]);
    
    expect(platformBalance).to.equal(budget * 30n / 100n);
    expect(rewardBalance).to.equal(budget - (budget * 30n / 100n));
  });

  it("should reject zero campaignBudget", async function () {
    const { settlement, token, advertiser } = await deploySettlementFixture();
    await expect(settlement.write.settleCampaign(["camp1", token.address, 0n, advertiser.account.address], { account: advertiser.account }))
      .to.be.rejected;
  });

  it("should reject zero advertiser", async function () {
    const { settlement, token } = await deploySettlementFixture();
    await expect(settlement.write.settleCampaign(["camp1", token.address, parseUnits("100", 18), "0x0000000000000000000000000000000000000000"]))
      .to.be.rejected;
  });

  it("should reject duplicate campaign", async function () {
    const { settlement, token, advertiser } = await deploySettlementFixture();
    const budget = parseUnits("100", 18);
    await token.write.approve([settlement.address, budget * 2n], { account: advertiser.account });
    
    await settlement.write.settleCampaign(["camp1", token.address, budget, advertiser.account.address], { account: advertiser.account });
    await expect(settlement.write.settleCampaign(["camp1", token.address, budget, advertiser.account.address], { account: advertiser.account }))
      .to.be.rejected;
  });
});
