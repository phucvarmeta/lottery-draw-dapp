const { expect } = require("chai");
const { ethers, upgrades } = require("hardhat");

describe("DLottery", function () {
  let dLottery;
  let owner;
  let addr1;
  let addr2;
  let addr3;
  let addr4;
  let addr5;
  let addrs;
  const TICKET_PRICE = ethers.parseEther("0.001");
  const MAX_TICKETS = 5;
  const MAX_TICKET_NUMBER = 10;

  beforeEach(async function () {
    // Get signers
    [owner, addr1, addr2, addr3, addr4, addr5, ...addrs] = await ethers.getSigners();

    // Deploy the contract
    const DLottery = await ethers.getContractFactory("DLottery");
    dLottery = await upgrades.deployProxy(DLottery, [owner.address], { initializer: 'initialize' });
    await dLottery.waitForDeployment();
  });

  describe("Initialization", function () {
    it("Should set the right owner", async function () {
      expect(await dLottery.owner()).to.equal(owner.address);
    });

    it("Should initialize with draw ID 1", async function () {
      const drawInfo = await dLottery.getCurrentDrawInfo();
      expect(drawInfo.drawId).to.equal(1);
    });

    it("Should initialize with empty participants list", async function () {
      const drawInfo = await dLottery.getCurrentDrawInfo();
      expect(drawInfo.participantsCount).to.equal(0);
    });

    it("Should initialize with draw not completed", async function () {
      const drawInfo = await dLottery.getCurrentDrawInfo();
      expect(drawInfo.isCompleted).to.equal(false);
    });

    it("Should initialize with zero prize", async function () {
      const drawInfo = await dLottery.getCurrentDrawInfo();
      expect(drawInfo.currentPrize).to.equal(0);
    });
  });

  describe("Ticket Purchase", function () {
    it("Should allow purchasing a ticket", async function () {
      await dLottery.connect(addr1).buyTicket({ value: TICKET_PRICE });
      
      const [hasBought, ticketNumber] = await dLottery.hasParticipantBoughtTicket(addr1.address);
      expect(hasBought).to.equal(true);
      expect(ticketNumber).to.be.gt(0);
      expect(ticketNumber).to.be.lte(MAX_TICKET_NUMBER);
    });

    it("Should increase the prize pool", async function () {
      await dLottery.connect(addr1).buyTicket({ value: TICKET_PRICE });
      
      const drawInfo = await dLottery.getCurrentDrawInfo();
      expect(drawInfo.currentPrize).to.equal(TICKET_PRICE);
    });

    it("Should not allow buying with incorrect amount", async function () {
      await expect(
        dLottery.connect(addr1).buyTicket({ value: ethers.parseEther("0.002") })
      ).to.be.revertedWith("Incorrect amount sent");
    });

    it("Should not allow buying multiple tickets by the same address", async function () {
      await dLottery.connect(addr1).buyTicket({ value: TICKET_PRICE });
      
      await expect(
        dLottery.connect(addr1).buyTicket({ value: TICKET_PRICE })
      ).to.be.revertedWith("You already purchased a ticket for this draw");
    });

    it("Should allow different participants to buy tickets", async function () {
      await dLottery.connect(addr1).buyTicket({ value: TICKET_PRICE });
      await dLottery.connect(addr2).buyTicket({ value: TICKET_PRICE });
      
      const drawInfo = await dLottery.getCurrentDrawInfo();
      expect(drawInfo.participantsCount).to.equal(2);
      
      const [hasBought1] = await dLottery.hasParticipantBoughtTicket(addr1.address);
      const [hasBought2] = await dLottery.hasParticipantBoughtTicket(addr2.address);
      
      expect(hasBought1).to.equal(true);
      expect(hasBought2).to.equal(true);
    });

    it("Should update contract balance when tickets are purchased", async function () {
      await dLottery.connect(addr1).buyTicket({ value: TICKET_PRICE });
      await dLottery.connect(addr2).buyTicket({ value: TICKET_PRICE });
      
      const balance = await dLottery.getContractBalance();
      expect(balance).to.equal(TICKET_PRICE * 2n);
    });
    
    it("Should properly track sold tickets", async function () {
      await dLottery.connect(addr1).buyTicket({ value: TICKET_PRICE });
      await dLottery.connect(addr2).buyTicket({ value: TICKET_PRICE });
      
      const [tickets, participants] = await dLottery.getCurrentDrawDetails();
      
      expect(tickets.length).to.equal(2);
      expect(participants.length).to.equal(2);
      expect(participants).to.include(addr1.address);
      expect(participants).to.include(addr2.address);
    });
  });

  describe("Draw Completion", function () {
    beforeEach(async function () {
      // Purchase 5 tickets to meet the requirement
      await dLottery.connect(addr1).buyTicket({ value: TICKET_PRICE });
      await dLottery.connect(addr2).buyTicket({ value: TICKET_PRICE });
      await dLottery.connect(addr3).buyTicket({ value: TICKET_PRICE });
      await dLottery.connect(addr4).buyTicket({ value: TICKET_PRICE });
      await dLottery.connect(addr5).buyTicket({ value: TICKET_PRICE });
    });

    it("Should not allow non-owner to perform draw", async function () {
      await expect(
        dLottery.connect(addr1).performDraw()
      ).to.be.reverted;
    });

    it("Should allow owner to perform draw when all tickets are sold", async function () {
      const tx = await dLottery.connect(owner).performDraw();
      const receipt = await tx.wait();
      
      // Check event
      const drawCompletedEvent = receipt.logs.find(e => e.fragment.name === "DrawCompleted");
      expect(drawCompletedEvent).to.not.be.undefined;
      
      // Check draw result
      const [isCompleted, winningTicket, winner, isPrizeClaimed] = await dLottery.getDrawResult(1);
      
      expect(isCompleted).to.equal(true);
      expect(winningTicket).to.be.gt(0);
      expect(winningTicket).to.be.lte(MAX_TICKET_NUMBER);
      expect(isPrizeClaimed).to.equal(false);
    });

    it("Should not allow performing draw twice", async function () {
      await dLottery.connect(owner).performDraw();
      
      await expect(
        dLottery.connect(owner).performDraw()
      ).to.be.revertedWith("Draw is already completed");
    });
  });

  describe("Prize Claiming", function () {
    let winningTicket;
    let winner;
    
    beforeEach(async function () {
      // Purchase all tickets
      await dLottery.connect(addr1).buyTicket({ value: TICKET_PRICE });
      await dLottery.connect(addr2).buyTicket({ value: TICKET_PRICE });
      await dLottery.connect(addr3).buyTicket({ value: TICKET_PRICE });
      await dLottery.connect(addr4).buyTicket({ value: TICKET_PRICE });
      await dLottery.connect(addr5).buyTicket({ value: TICKET_PRICE });
      
      // Perform draw
      const tx = await dLottery.connect(owner).performDraw();
      const receipt = await tx.wait();
      
      // Get draw result
      const drawCompletedEvent = receipt.logs.find(e => e.fragment.name === "DrawCompleted");
      winningTicket = drawCompletedEvent.args.winningTicket;
      winner = drawCompletedEvent.args.winner;
    });

    it("Should not allow claiming prize before draw is completed", async function () {
      // Deploy a new contract for this test
      const DLottery = await ethers.getContractFactory("DLottery");
      const newDLottery = await upgrades.deployProxy(DLottery, [owner.address], { initializer: 'initialize' });
      await newDLottery.waitForDeployment();
      
      await expect(
        newDLottery.connect(addr1).claimPrize()
      ).to.be.revertedWith("Draw is not completed yet");
    });

    it("Should not allow non-winner to claim prize", async function () {
      // Find a non-winner
      const nonWinner = [addr1, addr2, addr3, addr4, addr5].find(addr => addr.address !== winner);
      
      await expect(
        dLottery.connect(nonWinner).claimPrize()
      ).to.be.reverted;
    });

    it("Should allow winner to claim prize", async function () {
      // Find the winner signer
      const winnerSigner = [addr1, addr2, addr3, addr4, addr5].find(addr => addr.address === winner);
      
      // Check winner's balance before claiming
      const balanceBefore = await ethers.provider.getBalance(winner);
      
      // Claim prize
      const tx = await dLottery.connect(winnerSigner).claimPrize();
      const receipt = await tx.wait();
      
      // Calculate gas cost
      const gasCost = receipt.gasUsed * receipt.gasPrice;
      
      // Check winner's balance after claiming
      const balanceAfter = await ethers.provider.getBalance(winner);
      
      // Expected prize is 5 * TICKET_PRICE
      const expectedPrize = TICKET_PRICE * 5n;
      
      // Check that the winner received the prize (accounting for gas costs)
      expect(balanceAfter- balanceBefore  + gasCost).to.equal(expectedPrize);
      
      // Check that prize is marked as claimed
      const [, , , isPrizeClaimed] = await dLottery.getDrawResult(1);
      expect(isPrizeClaimed).to.equal(true);
      
      // Check that accumulated prize is reset
      const drawInfo = await dLottery.getCurrentDrawInfo();
      expect(drawInfo.currentPrize).to.equal(0);
    });

    it("Should emit PrizeClaimed event", async function () {
      // Find the winner signer
      const winnerSigner = [addr1, addr2, addr3, addr4, addr5].find(addr => addr.address === winner);
      console.log("🚀 ~ winnerSigner:", winnerSigner)
      
      // Expected prize is 5 * TICKET_PRICE
      const expectedPrize = TICKET_PRICE * 5n;
      
      await expect(dLottery.connect(winnerSigner).claimPrize())
        .to.emit(dLottery, "PrizeClaimed")
        .withArgs(1, winner, expectedPrize);
    });

    it("Should not allow claiming prize twice", async function () {
      // Find the winner signer
      const winnerSigner = [addr1, addr2, addr3, addr4, addr5].find(addr => addr.address === winner);
      console.log("🚀 ~ winnerSigner:", winnerSigner)
      
      // Claim prize
      await dLottery.connect(winnerSigner).claimPrize();
      
      // Try to claim again
      await expect(
        dLottery.connect(winnerSigner).claimPrize()
      ).to.be.revertedWith("Prize has already been claimed");
    });
  });

  describe("Multiple Draws", function () {
    beforeEach(async function () {
      // Complete the first draw
      await dLottery.connect(addr1).buyTicket({ value: TICKET_PRICE });
      await dLottery.connect(addr2).buyTicket({ value: TICKET_PRICE });
      await dLottery.connect(addr3).buyTicket({ value: TICKET_PRICE });
      await dLottery.connect(addr4).buyTicket({ value: TICKET_PRICE });
      await dLottery.connect(addr5).buyTicket({ value: TICKET_PRICE });
      
      await dLottery.connect(owner).performDraw();
      
      // Create a new draw
      await dLottery.connect(owner).createNewDraw();
    });

    it("Should create a new draw with incremented ID", async function () {
      const drawInfo = await dLottery.getCurrentDrawInfo();
      expect(drawInfo.drawId).to.equal(2);
    });

    it("Should allow purchasing tickets for the new draw", async function () {
      await dLottery.connect(addr1).buyTicket({ value: TICKET_PRICE });
      
      const [hasBought, ticketNumber] = await dLottery.hasParticipantBoughtTicket(addr1.address);
      expect(hasBought).to.equal(true);
      expect(ticketNumber).to.be.gt(0);
    });

    it("Should maintain history of previous draws", async function () {
      const [isCompleted, winningTicket, winner, isPrizeClaimed] = await dLottery.getDrawResult(1);
      
      expect(isCompleted).to.equal(true);
      expect(winningTicket).to.be.gt(0);
      expect(winner).to.not.equal(ethers.ZeroAddress);
    });
  });

  describe("Emergency Functions", function () {
    beforeEach(async function () {
      // Add some funds to the contract
      await dLottery.connect(addr1).buyTicket({ value: TICKET_PRICE });
      await dLottery.connect(addr2).buyTicket({ value: TICKET_PRICE });
    });

    it("Should only allow owner to withdraw funds", async function () {
      await expect(
        dLottery.connect(addr1).emergencyWithdraw(TICKET_PRICE)
      ).to.be.reverted;
    });

    it("Should allow owner to withdraw specific amount", async function () {
      const ownerBalanceBefore = await ethers.provider.getBalance(owner.address);
      
      const tx = await dLottery.connect(owner).emergencyWithdraw(TICKET_PRICE);
      const receipt = await tx.wait();
      
      // Calculate gas cost
      const gasCost = receipt.gasUsed * receipt.gasPrice;
      
      const ownerBalanceAfter = await ethers.provider.getBalance(owner.address);
      
      // Owner should receive the withdrawn amount minus gas costs
      expect(ownerBalanceAfter + gasCost - ownerBalanceBefore).to.equal(TICKET_PRICE);
      
      // Contract balance should be reduced
      const contractBalance = await dLottery.getContractBalance();
      expect(contractBalance).to.equal(TICKET_PRICE);
    });

    it("Should not allow withdrawing more than the balance", async function () {
      const excessiveAmount = ethers.parseEther("10");
      
      await expect(
        dLottery.connect(owner).emergencyWithdraw(excessiveAmount)
      ).to.be.reverted;
    });
  });

  describe("View Functions", function () {
    beforeEach(async function () {
      // Purchase some tickets
      await dLottery.connect(addr1).buyTicket({ value: TICKET_PRICE });
      await dLottery.connect(addr2).buyTicket({ value: TICKET_PRICE });
    });

    it("Should correctly report ticket ownership", async function () {
      const [isAssigned1, participant1] = await dLottery.getTicketInfo(1);
      
      if (isAssigned1) {
        expect(participant1).to.be.oneOf([addr1.address, addr2.address]);
      }
      
      const [hasBought, ticketNumber] = await dLottery.hasParticipantBoughtTicket(addr1.address);
      expect(hasBought).to.equal(true);
      
      // Check the specific ticket
      const [isAssigned2, participant2] = await dLottery.getTicketInfo(ticketNumber);
      expect(isAssigned2).to.equal(true);
      expect(participant2).to.equal(addr1.address);
    });

    it("Should reject invalid ticket numbers", async function () {
      await expect(
        dLottery.getTicketInfo(0)
      ).to.be.revertedWith("Invalid ticket number");
      
      await expect(
        dLottery.getTicketInfo(MAX_TICKET_NUMBER + 1)
      ).to.be.revertedWith("Invalid ticket number");
    });

    it("Should correctly report draw details", async function () {
      const [tickets, participants] = await dLottery.getCurrentDrawDetails();
      
      expect(tickets.length).to.equal(2);
      expect(participants.length).to.equal(2);
      expect(participants).to.include(addr1.address);
      expect(participants).to.include(addr2.address);
    });

    it("Should reject invalid draw IDs", async function () {
      await expect(
        dLottery.getDrawResult(0)
      ).to.be.revertedWith("Invalid draw ID");
      
      await expect(
        dLottery.getDrawResult(99)
      ).to.be.revertedWith("Invalid draw ID");
    });
  });
});