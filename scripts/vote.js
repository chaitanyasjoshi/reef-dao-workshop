const { charityDAOAddress } = require("../constants");
const hre = require("hardhat");


async function main () {
  console.log("Voting on CharityDAO proposal 0")

  const signers = await hre.reef.getSigners();
  let count = 0;

  for await (const signer of signers) {
    const voter = await signer.getAddress();

    const charityDAO = await hre.reef.getContractAt("CharityDAO", charityDAOAddress, signer);
    const voteTx = await charityDAO.vote(0, 0);
    await voteTx.wait();
    console.log(`${voter} voted on proposal 0`)
    if (count == 4) break;
    count++;
  }
  console.log(`Voting completed!`);
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
