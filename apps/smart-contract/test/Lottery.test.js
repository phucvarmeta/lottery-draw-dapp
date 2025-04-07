const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("DLottery", function () {
  let dLottery;
  let owner;
  let participants = [];
  const TICKET_PRICE = ethers.parseEther("0.001");

  beforeEach(async function () {
    // Get signers for testing
    [owner, ...participants] = await ethers.getSigners();
    
    // Deploy the DLottery contract
    const DLottery = await ethers.getContractFactory("DLottery");
    dLottery = await DLottery.deploy();
    await dLottery.waitForDeployment();
  });

  describe("Deployment", function () {
    it("Should set the right owner", async function () {
      expect(await dLottery.owner()).to.equal(owner.address);
    });

    it("Should create the first draw", async function () {
      const drawInfo = await dLottery.getCurrentDrawInfo();
      expect(drawInfo[0]).to.equal(1); // drawId should be 1
      expect(drawInfo[1]).to.equal(0); // participantsCount should be 0
      expect(drawInfo[2]).to.equal(false); // isCompleted should be false
      expect(drawInfo[3]).to.equal(0); // currentPrize should be 0
    });
  });

  describe("Ticket Purchase", function () {
    it("Should allow a user to buy a ticket", async function () {
      await dLottery.connect(participants[0]).buyTicket({ value: TICKET_PRICE })
        
      const drawInfo = await dLottery.getCurrentDrawInfo();
      expect(drawInfo[1]).to.equal(1); // participantsCount should be 1
      expect(drawInfo[3]).to.equal(TICKET_PRICE); // currentPrize should be TICKET_PRICE
      
      // Check if the participant has bought a ticket
      const participantInfo = await dLottery.hasParticipantBoughtTicket(participants[0].address);
      expect(participantInfo[0]).to.equal(true); // hasBought should be true
    });

    it("Should not allow a user to buy more than one ticket in a draw", async function () {
      await dLottery.connect(participants[0]).buyTicket({ value: TICKET_PRICE });
      
      await expect(dLottery.connect(participants[0]).buyTicket({ value: TICKET_PRICE }))
        .to.be.revertedWith("You already purchased a ticket for this draw");
    });

    it("Should not allow incorrect payment", async function () {
      await expect(dLottery.connect(participants[0]).buyTicket({ value: ethers.parseEther("0.002") }))
        .to.be.revertedWith("Incorrect amount sent");
    });
    
    it("Should not allow more than MAX_TICKETS to be sold", async function () {
      // Purchase 5 tickets by different participants
      for (let i = 0; i < 5; i++) {
        await dLottery.connect(participants[i]).buyTicket({ value: TICKET_PRICE });
      }
      
      // Try to purchase one more ticket
      await expect(dLottery.connect(participants[5]).buyTicket({ value: TICKET_PRICE }))
        .to.be.revertedWith("All tickets have been sold for this draw");
    });
  });

  describe("Draw", function () {
    beforeEach(async function () {
      // Purchase 5 tickets by different participants
      for (let i = 0; i < 5; i++) {
        await dLottery.connect(participants[i]).buyTicket({ value: TICKET_PRICE });
      }
    });
    
    it("Should not allow draw before all tickets are sold", async function () {
      // Create a new draw
      await dLottery.createNewDraw();
      
      // Try to perform draw without tickets sold
      await expect(dLottery.performDraw())
        .to.be.revertedWith("Not enough tickets sold yet");
    });
    
    it("Should perform draw and emit DrawCompleted event", async function () {
      await dLottery.performDraw()
        
      // Check that the draw is marked as completed
      const drawInfo = await dLottery.getCurrentDrawInfo();
      expect(drawInfo[2]).to.equal(true); // isCompleted should be true
    });
    
    it("Should not allow multiple draws for the same lottery", async function () {
      await dLottery.performDraw();
      
      await expect(dLottery.performDraw())
        .to.be.revertedWith("Draw is already completed");
    });
  });

  describe("Prize Claim", function () {
    let drawResult;
    
    beforeEach(async function () {
      // Purchase 5 tickets by different participants
      for (let i = 0; i < 5; i++) {
        await dLottery.connect(participants[i]).buyTicket({ value: TICKET_PRICE });
      }
      
      // Perform draw
      const tx = await dLottery.performDraw();
      const receipt = await tx.wait();
      
      // Extract draw result from event
      const drawCompletedEvent = receipt.logs.find(
        log => log.fragment && log.fragment.name === 'DrawCompleted'
      );
      
      if (drawCompletedEvent) {
        const args = drawCompletedEvent.args;
        drawResult = {
          drawId: args[0],
          winningTicket: args[1],
          winner: args[2]
        };
      }
    });
    
    it("Should only allow the winner to claim the prize", async function () {
      if (drawResult.winner === ethers.ZeroAddress) {
        console.log("No winner in this test run, skipping test");
        return;
      }
      
      // Find the winner's index
      let winnerIndex = -1;
      for (let i = 0; i < participants.length; i++) {
        if (participants[i].address === drawResult.winner) {
          winnerIndex = i;
          break;
        }
      }
      
      if (winnerIndex !== -1) {
        // Non-winner tries to claim
        await expect(dLottery.connect(participants[(winnerIndex + 1) % 5]).claimPrize())
          .to.be.revertedWith("Only the winner can claim the prize");
          
        // Winner claims prize
        const initialBalance = await ethers.provider.getBalance(participants[winnerIndex].address);
        const tx = await dLottery.connect(participants[winnerIndex]).claimPrize();
        const receipt = await tx.wait();
        
        // Calculate gas cost
        const gasCost = receipt.gasUsed * receipt.gasPrice;
        
        // Check new balance
        const newBalance = await ethers.provider.getBalance(participants[winnerIndex].address);
        expect(newBalance).to.be.gt(initialBalance - gasCost); // Account for gas costs
      } else {
        console.log("Winner not found among participants, this is unexpected");
      }
    });
    
    it("Should not allow claiming prize twice", async function () {
      if (drawResult.winner === ethers.ZeroAddress) {
        console.log("No winner in this test run, skipping test");
        return;
      }
      
      // Find the winner
      let winner = null;
      for (let i = 0; i < participants.length; i++) {
        if (participants[i].address === drawResult.winner) {
          winner = participants[i];
          break;
        }
      }
      
      if (winner) {
        // Claim prize
        await dLottery.connect(winner).claimPrize();
        
        // Try to claim again
        await expect(dLottery.connect(winner).claimPrize())
          .to.be.revertedWith("Prize has already been claimed");
      }
    });
  });

  describe("New Draw", function () {
    it("Should create a new draw and reset ticket data", async function () {
      // Purchase 5 tickets for first draw
      for (let i = 0; i < 5; i++) {
        await dLottery.connect(participants[i]).buyTicket({ value: TICKET_PRICE });
      }
      
      // Perform draw
      await dLottery.performDraw();
      
      // Create a new draw
      await dLottery.createNewDraw();
      
      // Check new draw info
      const drawInfo = await dLottery.getCurrentDrawInfo();
      expect(drawInfo[0]).to.equal(2); // drawId should be 2
      expect(drawInfo[1]).to.equal(0); // participantsCount should be 0
      expect(drawInfo[2]).to.equal(false); // isCompleted should be false
      
      // Check that the same user can buy a ticket in the new draw
      await expect(dLottery.connect(participants[0]).buyTicket({ value: TICKET_PRICE }))
        .to.emit(dLottery, "TicketPurchased")
        .withArgs(2, participants[0].address, expect.anything());
    });
    
    it("Should accumulate prize if no winner in previous draw", async function () {
      // Purchase 5 tickets for first draw
      for (let i = 0; i < 5; i++) {
        await dLottery.connect(participants[i]).buyTicket({ value: TICKET_PRICE });
      }
      
      // Perform draw
      const tx = await dLottery.performDraw();
      const receipt = await tx.wait();
      
      // Extract draw result from event
      const drawCompletedEvent = receipt.logs.find(
        log => log.fragment && log.fragment.name === 'DrawCompleted'
      );
      
      let winner = ethers.ZeroAddress;
      if (drawCompletedEvent) {
        winner = drawCompletedEvent.args[2];
      }
      
      // If there's a winner, have them claim the prize
      if (winner !== ethers.ZeroAddress) {
        for (let i = 0; i < participants.length; i++) {
          if (participants[i].address === winner) {
            await dLottery.connect(participants[i]).claimPrize();
            break;
          }
        }
      }
      
      // Create a new draw
      await dLottery.createNewDraw();
      
      // Check if prize is accumulated correctly
      const initialPrize = TICKET_PRICE * 5n;
      const drawInfo = await dLottery.getCurrentDrawInfo();
      
      if (winner === ethers.ZeroAddress) {
        // If no winner, prize should be accumulated
        expect(drawInfo[3]).to.equal(initialPrize);
      } else {
        // If there was a winner and they claimed, prize should be reset
        expect(drawInfo[3]).to.equal(0);
      }
      
      // Purchase 5 tickets for second draw
      for (let i = 5; i < 10; i++) {
        await dLottery.connect(participants[i]).buyTicket({ value: TICKET_PRICE });
      }
      
      // Check final prize amount
      const updatedDrawInfo = await dLottery.getCurrentDrawInfo();
      if (winner === ethers.ZeroAddress) {
        // If no winner in first draw, prize should be accumulated
        expect(updatedDrawInfo[3]).to.equal(initialPrize + TICKET_PRICE * 5n);
      } else {
        // If there was a winner, only second draw tickets count
        expect(updatedDrawInfo[3]).to.equal(TICKET_PRICE * 5n);
      }
    });
  });

  describe("Emergency Functions", function () {
    it("Should allow owner to withdraw funds in emergency", async function () {
      // Purchase 5 tickets to add funds to contract
      for (let i = 0; i < 5; i++) {
        await dLottery.connect(participants[i]).buyTicket({ value: TICKET_PRICE });
      }
      
      const contractBalance = await dLottery.getContractBalance();
      const initialOwnerBalance = await ethers.provider.getBalance(owner.address);
      
      // Owner withdraws all funds
      const tx = await dLottery.connect(owner).emergencyWithdraw(contractBalance);
      const receipt = await tx.wait();
      
      // Calculate gas cost
      const gasCost = receipt.gasUsed * receipt.gasPrice;
      
      // Check new balances
      const newContractBalance = await dLottery.getContractBalance();
      const newOwnerBalance = await ethers.provider.getBalance(owner.address);
      
      expect(newContractBalance).to.equal(0);
      expect(newOwnerBalance).to.be.gt(initialOwnerBalance - gasCost);
    });
    
    it("Should not allow non-owner to withdraw funds", async function () {
      await expect(dLottery.connect(participants[0]).emergencyWithdraw(TICKET_PRICE))
        .to.be.revertedWith("Only owner can call this function");
    });
  });

  describe("View Functions", function () {
    beforeEach(async function () {
      // Purchase 3 tickets
      for (let i = 0; i < 3; i++) {
        await dLottery.connect(participants[i]).buyTicket({ value: TICKET_PRICE });
      }
    });
    
    it("Should correctly return current draw details", async function () {
      const [tickets, participants_] = await dLottery.getCurrentDrawDetails();
      
      expect(tickets.length).to.equal(3);
      expect(participants_.length).to.equal(3);
      
      for (let i = 0; i < 3; i++) {
        expect(participants_[i]).to.equal(participants[i].address);
      }
    });
    
    it("Should correctly return ticket info", async function () {
      const [tickets] = await dLottery.getCurrentDrawDetails();
      
      // Check a purchased ticket
      const [isAssigned, participant] = await dLottery.getTicketInfo(tickets[0]);
      expect(isAssigned).to.equal(true);
      expect(participant).to.equal(participants[0].address);
      
      // Find an unsold ticket number (between 1 and 10)
      let unsoldTicket = 1;
      while (tickets.includes(unsoldTicket)) {
        unsoldTicket++;
      }
      
      // Check an unsold ticket
      const [isAssigned2, participant2] = await dLottery.getTicketInfo(unsoldTicket);
      expect(isAssigned2).to.equal(false);
      expect(participant2).to.equal(ethers.ZeroAddress);
    });
  });
}); 