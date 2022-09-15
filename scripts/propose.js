const { parseEther } = require("@ethersproject/units");
const { charityDAOAddress, receiverAddress } = require("../constants");
const hre = require("hardhat");


async function main () {
  console.log("Creating a new proposal...");
  
  const proposer = await hre.reef.getSignerByName("account1");
  await proposer.claimDefaultAccount();
  const proposerAddress = await proposer.getAddress();
  
  const charityDAO = await hre.reef.getContractAt("CharityDAO", charityDAOAddress, proposer);

  const createProposalTx = await charityDAO.createProposal(receiverAddress, 'Save The Tiger', parseEther("3"));
  await createProposalTx.wait();

  console.log(`New proposal created by ${proposerAddress} (tx: ${createProposalTx.hash})`);
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
