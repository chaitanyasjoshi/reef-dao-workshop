const { formatEther } = require("@ethersproject/units");
const { charityDAOAddress, receiverAddress } = require("../constants");
const hre = require("hardhat");


async function main () {
  console.log("Executing CharityDAO proposal 0...");

  const provider = await hre.reef.getProvider();
  let receiverBalance = await provider.getBalance(receiverAddress);
  console.log(`Balance of receiver before proposal execution: ${formatEther(receiverBalance)} REEF`);
  
  const executor = await hre.reef.getSignerByName("account1");
  await executor.claimDefaultAccount();
  const executorAddress = await executor.getAddress();
  
  const charityDAO = await hre.reef.getContractAt("CharityDAO", charityDAOAddress, executor);

  const executeProposalTx = await charityDAO.executeProposal(0);
  await executeProposalTx.wait();
  console.log(`Proposal 0 executed by ${executorAddress} (tx: ${executeProposalTx.hash})`);

  
  const treasuryBalance = await provider.getBalance(charityDAOAddress);
  console.log(`CharityDAO treasury balance after proposal execution: ${formatEther(treasuryBalance)} REEF`);
  receiverBalance = await provider.getBalance(receiverAddress);
  console.log(`Balance of receiver after proposal execution: ${formatEther(receiverBalance)} REEF`);
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
