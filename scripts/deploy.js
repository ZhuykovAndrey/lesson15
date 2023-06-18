const hre = require("hardhat");

async function main() {

  const cowName = "Cow";
  const Cow = await hre.ethers.getContractFactory("Cow");
  const cow =await Cow.deploy(cowName);
  await cow.waitForDeployment();

  const horseName = "Horse";
  const Horse = await hre.ethers.getContractFactory("Horse");
  const horse = await Horse.deploy(horseName);
  await horse.waitForDeployment();

  const wolfName = "Wolf";
  const Wolf = await hre.ethers.getContractFactory("Wolf");
  const wolf = await Wolf.deploy(wolfName);
  await wolf.waitForDeployment();

  const Farmer = await hre.ethers.getContractFactory("Farmer");
  const farmer = await Farmer.deploy();
  await farmer.waitForDeployment();

  const callCow = await farmer.call(cow.target);
  const callHorse = await farmer.call(horse.target);
  console.log(callCow);
  console.log(callHorse);

  const plant = "plant";
  const meat = "meat";

  const feedWolf1 = await farmer.feed(wolf.target, plant);
  const feedWolf2 = await farmer.feed(wolf.target, meat);
  console.log(feedWolf1);
  console.log(feedWolf2);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
