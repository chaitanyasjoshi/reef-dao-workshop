const { formatEther, parseEther } = require("@ethersproject/units");
const { charityDAOAddress } = require("../constants");
const hre = require("hardhat");

async function main () {
  console.log("Contributing to CharityDAO...");
  const signers = await hre.reef.getSigners();
  let count = 0;

  for await (const signer of signers) {
    await signer.claimDefaultAccount();
    const contributor = await signer.getAddress();
    const charityDAO = await hre.reef.getContractAt("CharityDAO", charityDAOAddress, signer);
    const contributeTx = await charityDAO.contribute({ value: parseEther("1") });
    await contributeTx.wait();
    console.log(`${contributor} contributed 1 REEF to CharityDAO`)
    if (count == 4) break;
    count++;
  }

  const provider = await hre.reef.getProvider();
  const treasuryBalance = await provider.getBalance(charityDAOAddress);
  console.log(`CharityDAO treasury balance after all contributions: ${formatEther(treasuryBalance)} REEF`);
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
