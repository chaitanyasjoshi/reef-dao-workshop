const hre = require("hardhat");

async function main () {
  const deployer = await hre.reef.getSignerByName("account1");
  await deployer.claimDefaultAccount();

  console.log("Deploying CharityDAO...")
  const CharityDAO = await hre.reef.getContractFactory("CharityDAO", deployer);
  const charityDAO = await CharityDAO.deploy();
  await charityDAO.deployed();
  console.log(`CharityDAO deployed to ${charityDAO.address}`);

  console.log("Verifying CharityDAO contract...");
  await hre.reef.verifyContract(charityDAO.address, "CharityDAO", []);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
