// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract CharityDAO {
    enum VotingOptions {
        Approve,
        Deny
    }
    enum ProposalStatus {
        Executed,
        Failed,
        Active
    }

    struct Proposal {
        address proposer;
        address payable receiver;
        string description;
        uint256 donationAmount;
        uint256 votesForApprove;
        uint256 votesForDeny;
        uint256 createdAt;
        ProposalStatus status;
        mapping(address => bool) isVoted;
    }

    mapping(uint256 => Proposal) proposals;
    mapping(address => bool) contributors;

    uint256 public treasuryBalance;
    uint256 public proposalCount;
    uint256 public constant VOTING_PERIOD = 2 minutes;

    modifier onlyContributor() {
        require(contributors[msg.sender], "ONLY CONTRIBUTOR");
        _;
    }

    modifier onlyActiveProposal(uint256 _proposalId) {
        require(proposals[_proposalId].createdAt != 0, "PROPOSAL DOESNT EXIST");
        require(
            proposals[_proposalId].status == ProposalStatus.Active,
            "VOTING PERIOD ENDED"
        );
        _;
    }

    modifier onVotingEnd(uint256 _proposalId) {
        uint256 votingDuration = proposals[_proposalId].createdAt +
            VOTING_PERIOD;
        require(votingDuration < block.timestamp);
        _;
    }

    function contribute() external payable {
        require(msg.value > 0, "CONTRIBUTION CANNOT BE ZERO");
        contributors[msg.sender] = true;
        treasuryBalance = treasuryBalance + msg.value;
    }

    function createProposal(
        address payable _receiver,
        string calldata _desc,
        uint256 _amount
    ) external onlyContributor returns (uint256) {
        require(_amount <= treasuryBalance, "INSUFFICIENT TREASURY BALANCE");
        uint256 proposalId = proposalCount++;

        Proposal storage proposal = proposals[proposalId];
        proposal.proposer = msg.sender;
        proposal.receiver = _receiver;
        proposal.description = _desc;
        proposal.donationAmount = _amount;
        proposal.createdAt = block.timestamp;
        proposal.status = ProposalStatus.Active;

        return proposalId;
    }

    function vote(uint256 _proposalId, VotingOptions _vote)
        external
        onlyContributor
        onlyActiveProposal(_proposalId)
    {
        Proposal storage proposal = proposals[_proposalId];
        require(!proposal.isVoted[msg.sender], "ALREADY VOTED");

        proposal.isVoted[msg.sender] = true;
        if (_vote == VotingOptions.Approve) {
            proposal.votesForApprove++;
        } else {
            proposal.votesForDeny++;
        }
    }

    function executeProposal(uint256 _proposalId)
        external
        onVotingEnd(_proposalId)
    {
        Proposal storage proposal = proposals[_proposalId];

        if (proposal.votesForApprove > proposal.votesForDeny) {
            proposal.status = ProposalStatus.Executed;
            (bool success, ) = proposal.receiver.call{
                value: proposal.donationAmount
            }("");
            require(success, "TRANSFER FAILED");
        } else {
            proposal.status = ProposalStatus.Failed;
        }
    }
}
