import { ethers } from "hardhat";

async function main() {
  const Shout = await ethers.getContractFactory("Shout");
  const shout = await Shout.deploy();
  await shout.deployed();
  console.log(`Shout deployed to ${shout.address}`);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
