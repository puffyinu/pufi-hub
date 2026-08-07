import { expect } from "chai";
import hre from "hardhat";
import { parseEther, parseUnits, keccak256, stringToBytes } from "viem";
import { describe, it } from "node:test";

async function deploySettlementFixture() {
  const runtime = await hre.network.create();
  console.log("Runtime:", !!runtime);
  console.log("Runtime.viem:", !!runtime.viem);
  
  const viem = runtime.viem;
  if (!viem) throw new Error("Viem is undefined");

  const walletClients = await viem.getWalletClients();
  console.log("Wallet count:", walletClients.length);
  console.log("Wallet addresses:", walletClients.map(w => w.account.address));

  const [owner, advertiser, platformWallet, rewardWallet] = walletClients;
  const token = await viem.deployContract("ERC20Mock", [parseEther("1000000")]);
  console.log("Token address:", token.address);
  
  const totalSupply = await token.read.totalSupply();
  console.log("Total supply:", totalSupply);
  
  const deployerBalanceBefore = await token.read.balanceOf([owner.account.address]);
  const advertiserBalanceBefore = await token.read.balanceOf([advertiser.account.address]);
  console.log("Deployer balance before:", deployerBalanceBefore);
  console.log("Advertiser balance before:", advertiserBalanceBefore);

  const amountToTransfer = parseEther("1000");
  await token.write.transfer([advertiser.account.address, amountToTransfer], { account: owner.account.address });
  
  const deployerBalanceAfter = await token.read.balanceOf([owner.account.address]);
  const advertiserBalanceAfter = await token.read.balanceOf([advertiser.account.address]);
  console.log("Deployer balance after:", deployerBalanceAfter);
  console.log("Advertiser balance after:", advertiserBalanceAfter);

  const settlement = await viem.deployContract("Settlement", [platformWallet.account.address, rewardWallet.account.address]);
  
  return { settlement, token, advertiser, platformWallet, rewardWallet };
}

describe("Settlement", function () {
  it("should store immutable wallets in constructor", async function () {
    const { settlement, platformWallet, rewardWallet } = await deploySettlementFixture();
    expect((await settlement.read.platformWallet()).toLowerCase()).to.equal(platformWallet.account.address.toLowerCase());
    expect((await settlement.read.rewardWallet()).toLowerCase()).to.equal(rewardWallet.account.address.toLowerCase());
  });

  it("should successfully settle a campaign", async function () {
    const { settlement, token, advertiser, platformWallet, rewardWallet } = await deploySettlementFixture();
    const budget = parseUnits("100", 18);
    
    await token.write.approve([settlement.address, budget], { account: advertiser.account.address });
    
    await settlement.write.settleCampaign(["camp1", token.address, budget, advertiser.account.address], { account: advertiser.account.address });
    
    const settled = await settlement.read.settledCampaigns([keccak256(stringToBytes("camp1"))]);
    expect(settled).to.be.true;
    
    const platformBalance = await token.read.balanceOf([platformWallet.account.address]);
    const rewardBalance = await token.read.balanceOf([rewardWallet.account.address]);
    
    expect(platformBalance).to.equal(budget * 30n / 100n);
    expect(rewardBalance).to.equal(budget - (budget * 30n / 100n));
  });

  it("should reject zero campaignBudget", async function () {
    const { settlement, token, advertiser } = await deploySettlementFixture();
    try {
        await settlement.write.settleCampaign(["camp1", token.address, 0n, advertiser.account.address], { account: advertiser.account.address });
        expect.fail("Should have rejected");
    } catch (error: any) {
        expect(error.message).to.contain("revert");
    }
  });

  it("should reject zero advertiser", async function () {
    const { settlement, token } = await deploySettlementFixture();
    try {
        await settlement.write.settleCampaign(["camp1", token.address, parseUnits("100", 18), "0x0000000000000000000000000000000000000000"]);
        expect.fail("Should have rejected");
    } catch (error: any) {
        expect(error.message).to.contain("revert");
    }
  });

  it("should reject duplicate campaign", async function () {
    const { settlement, token, advertiser } = await deploySettlementFixture();
    const budget = parseUnits("100", 18);
    await token.write.approve([settlement.address, budget * 2n], { account: advertiser.account.address });
    
    await settlement.write.settleCampaign(["camp1", token.address, budget, advertiser.account.address], { account: advertiser.account.address });
    try {
        await settlement.write.settleCampaign(["camp1", token.address, budget, advertiser.account.address], { account: advertiser.account.address });
        expect.fail("Should have rejected");
    } catch (error: any) {
        expect(error.message).to.contain("revert");
    }
  });
});
