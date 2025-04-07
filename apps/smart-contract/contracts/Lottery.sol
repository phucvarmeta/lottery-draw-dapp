// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

/**
 * @title DLottery
 * @dev A decentralized lottery application where users can buy tickets and win prizes
 */
contract DLottery {
    // Constants
    uint256 public constant TICKET_PRICE = 0.001 ether;
    uint8 public constant MAX_TICKETS = 5;
    uint8 public constant MAX_TICKET_NUMBER = 10;

    // State variables
    address public owner;
    uint256 public currentDrawId;
    uint256 public accumulatedPrize;

    // Struct to store Draw information
    struct Draw {
        uint256 id;
        uint256 datetime;
        address[] participants;
        mapping(address => uint8) ticketsByParticipant;
        mapping(uint8 => address) participantsByTicket;
        uint8[] soldTickets;
        bool completed;
        uint8 winningTicket;
        address winner;
        bool prizeClaimed;
    }

    // Mapping from drawId to Draw
    mapping(uint256 => Draw) public draws;

    // Events
    event DrawCreated(uint256 indexed drawId, uint256 datetime);
    event TicketPurchased(
        uint256 indexed drawId,
        address indexed participant,
        uint8 ticketNumber
    );
    event DrawCompleted(
        uint256 indexed drawId,
        uint8 winningTicket,
        address winner
    );
    event PrizeClaimed(uint256 indexed drawId, address winner, uint256 amount);

    // Modifiers
    modifier onlyOwner() {
        require(msg.sender == owner, "Only owner can call this function");
        _;
    }

    /**
     * @dev Constructor sets the owner and creates the first draw
     */
    constructor() {
        owner = msg.sender;
        createNewDraw();
    }

    /**
     * @dev Creates a new lottery draw
     * @return drawId of the newly created draw
     */
    function createNewDraw() public returns (uint256) {
        currentDrawId++;

        Draw storage newDraw = draws[currentDrawId];
        newDraw.id = currentDrawId;
        newDraw.datetime = block.timestamp;
        newDraw.completed = false;
        newDraw.prizeClaimed = false;

        emit DrawCreated(currentDrawId, block.timestamp);

        return currentDrawId;
    }

    /**
     * @dev Allows a user to buy a ticket for the current draw
     * @return drawId The current draw ID
     * @return ticketNumber The ticket number assigned to the user
     */
    function buyTicket()
        public
        payable
        returns (uint256 drawId, uint8 ticketNumber)
    {
        Draw storage currentDraw = draws[currentDrawId];

        require(!currentDraw.completed, "Current draw is already completed");
        require(
            currentDraw.participants.length < MAX_TICKETS,
            "All tickets have been sold for this draw"
        );
        require(msg.value == TICKET_PRICE, "Incorrect amount sent");
        require(
            currentDraw.ticketsByParticipant[msg.sender] == 0,
            "You already purchased a ticket for this draw"
        );

        // Generate a random ticket number that hasn't been sold yet
        ticketNumber = _generateRandomTicketNumber(currentDraw.soldTickets);

        // Register the participant
        currentDraw.participants.push(msg.sender);
        currentDraw.ticketsByParticipant[msg.sender] = ticketNumber;
        currentDraw.participantsByTicket[ticketNumber] = msg.sender;
        currentDraw.soldTickets.push(ticketNumber);

        // Add to the prize pool
        accumulatedPrize += msg.value;

        emit TicketPurchased(currentDrawId, msg.sender, ticketNumber);

        return (currentDrawId, ticketNumber);
    }

    /**
     * @dev Performs the lottery draw and determines the winner
     * @return drawId The current draw ID
     * @return winningTicket The winning ticket number
     * @return winner The address of the winner (or address(0) if no winner)
     */
    function performDraw()
        public
        returns (uint256 drawId, uint8 winningTicket, address winner)
    {
        Draw storage currentDraw = draws[currentDrawId];

        require(!currentDraw.completed, "Draw is already completed");
        require(
            currentDraw.participants.length == MAX_TICKETS,
            "Not enough tickets sold yet"
        );

        // Generate winning ticket number between 1 and MAX_TICKET_NUMBER
        winningTicket =
            uint8(
                uint256(
                    keccak256(
                        abi.encodePacked(
                            block.timestamp,
                            block.prevrandao,
                            msg.sender
                        )
                    )
                ) % MAX_TICKET_NUMBER
            ) +
            1;

        currentDraw.completed = true;
        currentDraw.winningTicket = winningTicket;

        // Check if there's a winner
        winner = currentDraw.participantsByTicket[winningTicket];
        currentDraw.winner = winner;

        emit DrawCompleted(currentDrawId, winningTicket, winner);

        return (currentDrawId, winningTicket, winner);
    }

    /**
     * @dev Allows the winner to claim their prize
     * @return amount The amount claimed
     */
    function claimPrize() public returns (uint256 amount) {
        Draw storage currentDraw = draws[currentDrawId];

        require(currentDraw.completed, "Draw is not completed yet");
        require(
            currentDraw.winner == msg.sender,
            "Only the winner can claim the prize"
        );
        require(!currentDraw.prizeClaimed, "Prize has already been claimed");

        currentDraw.prizeClaimed = true;

        // Calculate prize amount
        amount = accumulatedPrize;

        // Reset accumulated prize only if there was a winner
        if (currentDraw.winner != address(0)) {
            accumulatedPrize = 0;
        }

        // Transfer prize to winner
        (bool success, ) = payable(msg.sender).call{value: amount}("");
        require(success, "Transfer failed");

        emit PrizeClaimed(currentDrawId, msg.sender, amount);

        return amount;
    }

    /**
     * @dev Generates a random ticket number that hasn't been sold yet
     * @param soldTickets Array of already sold ticket numbers
     * @return randomTicket A random ticket number between 1 and MAX_TICKET_NUMBER that hasn't been sold yet
     */
    function _generateRandomTicketNumber(
        uint8[] memory soldTickets
    ) private view returns (uint8) {
        // Create an array of available tickets
        bool[] memory isTicketSold = new bool[](MAX_TICKET_NUMBER + 1);

        // Mark sold tickets
        for (uint i = 0; i < soldTickets.length; i++) {
            isTicketSold[soldTickets[i]] = true;
        }

        // Count available tickets
        uint8 availableCount = 0;
        for (uint8 i = 1; i <= MAX_TICKET_NUMBER; i++) {
            if (!isTicketSold[i]) {
                availableCount++;
            }
        }

        require(availableCount > 0, "No available tickets");

        // Generate random index for available tickets
        uint8 randomIndex = uint8(
            uint256(
                keccak256(
                    abi.encodePacked(
                        block.timestamp,
                        block.prevrandao,
                        msg.sender
                    )
                )
            ) % availableCount
        );

        // Find the ticket at that index
        uint8 currentIndex = 0;
        for (uint8 i = 1; i <= MAX_TICKET_NUMBER; i++) {
            if (!isTicketSold[i]) {
                if (currentIndex == randomIndex) {
                    return i;
                }
                currentIndex++;
            }
        }

        // Fallback (should never reach here)
        revert("Failed to generate random ticket");
    }

    /**
     * @dev Gets the current draw information
     * @return drawId The current draw ID
     * @return participantsCount The number of participants in the current draw
     * @return isCompleted Whether the current draw is completed
     * @return currentPrize The current prize pool
     */
    function getCurrentDrawInfo()
        public
        view
        returns (
            uint256 drawId,
            uint256 participantsCount,
            bool isCompleted,
            uint256 currentPrize
        )
    {
        Draw storage currentDraw = draws[currentDrawId];

        return (
            currentDrawId,
            currentDraw.participants.length,
            currentDraw.completed,
            accumulatedPrize
        );
    }

    /**
     * @dev Gets detailed information about the current draw
     * @return tickets An array of ticket numbers that have been sold
     * @return participants An array of participant addresses
     */
    function getCurrentDrawDetails()
        public
        view
        returns (uint8[] memory tickets, address[] memory participants)
    {
        Draw storage currentDraw = draws[currentDrawId];

        tickets = currentDraw.soldTickets;
        participants = currentDraw.participants;

        return (tickets, participants);
    }

    /**
     * @dev Gets information about a particular ticket in the current draw
     * @param ticketNumber The ticket number to query
     * @return isAssigned Whether the ticket has been assigned
     * @return participant The address of the participant who owns the ticket (or address(0) if not assigned)
     */
    function getTicketInfo(
        uint8 ticketNumber
    ) public view returns (bool isAssigned, address participant) {
        require(
            ticketNumber > 0 && ticketNumber <= MAX_TICKET_NUMBER,
            "Invalid ticket number"
        );

        Draw storage currentDraw = draws[currentDrawId];
        participant = currentDraw.participantsByTicket[ticketNumber];

        return (participant != address(0), participant);
    }

    /**
     * @dev Checks if a participant has bought a ticket for the current draw
     * @param participant The address of the participant
     * @return hasBought Whether the participant has bought a ticket
     * @return ticketNumber The ticket number assigned to the participant (or 0 if none)
     */
    function hasParticipantBoughtTicket(
        address participant
    ) public view returns (bool hasBought, uint8 ticketNumber) {
        Draw storage currentDraw = draws[currentDrawId];
        ticketNumber = currentDraw.ticketsByParticipant[participant];

        return (ticketNumber != 0, ticketNumber);
    }

    /**
     * @dev Gets the result of a completed draw
     * @param drawId The ID of the draw to query
     * @return isCompleted Whether the draw is completed
     * @return winningTicket The winning ticket number
     * @return winner The address of the winner
     * @return isPrizeClaimed Whether the prize has been claimed
     */
    function getDrawResult(
        uint256 drawId
    )
        public
        view
        returns (
            bool isCompleted,
            uint8 winningTicket,
            address winner,
            bool isPrizeClaimed
        )
    {
        require(drawId > 0 && drawId <= currentDrawId, "Invalid draw ID");

        Draw storage draw = draws[drawId];

        return (
            draw.completed,
            draw.winningTicket,
            draw.winner,
            draw.prizeClaimed
        );
    }

    /**
     * @dev Withdraws contract funds in case of emergency (only owner)
     * @param amount The amount to withdraw
     */
    function emergencyWithdraw(uint256 amount) public onlyOwner {
        require(amount <= address(this).balance, "Insufficient balance");

        (bool success, ) = payable(owner).call{value: amount}("");
        require(success, "Transfer failed");
    }

    /**
     * @dev Get contract balance
     * @return The current balance of the contract
     */
    function getContractBalance() public view returns (uint256) {
        return address(this).balance;
    }
}
