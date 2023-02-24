import { ethers } from "hardhat";

async function main() {
  const Whisper = await ethers.getContractFactory("Whisper");
  const whisper = await Whisper.deploy();
  await whisper.deployed();
  console.log(`Whisper deployed to ${whisper.address}`);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
