const {
    time,
    loadFixture,
  } = require("@nomicfoundation/hardhat-toolbox/network-helpers");
const { anyValue } = require("@nomicfoundation/hardhat-chai-matchers/withArgs");
const { expect } = require("chai");
const { ethers } = require("hardhat");
  
describe("lesson14", function () {
    async function contractsFixture() {
    
      const horseName = "Horse"; 
      const plant = "plant";
      const meat = "meat";
      const food = "any"; 
      const Horse = await ethers.getContractFactory("Horse");
      const horse = await Horse.deploy(horseName);
      
      const dogName = "Dog";
      const Dog = await ethers.getContractFactory("Dog");
      const dog = await Dog.deploy(dogName);
      const chocolate = "chocolate";

      const Farmer = await ethers.getContractFactory("Farmer");
      const farmer = await Farmer.deploy();      
  
      return {horse, horseName, farmer, plant, meat, food, chocolate, dog, dogName};
    }
  
    describe("Horse and Farmer", function () {
      it("Horse has the correct name", async function () {
        const { horse, horseName } = await loadFixture(contractsFixture);

        expect(await horse._name()).to.equal(horseName);
      });
  
      it("Horse can sleep", async function () {
        const { horse } = await loadFixture(contractsFixture);
  
        expect(await horse.sleep()).to.equal("Z-z-z-z...");
      });
  
      it("Horse can eat “plant”", async function () {
        const { horse, plant } = await loadFixture(contractsFixture);
        
        expect(await horse.eat(plant)).to.equal(
            `Із задоволенням зʼїсть ${plant}`
        );
      });

      it("Horse cannot eat ”meat”, ”not-food”, ”plastic”", async function () {
        const { horse, food } = await loadFixture(contractsFixture);
        
        await expect(horse.eat(food)).to.be.revertedWith("Can only eat plant food");
      });

      it("Farmer can call Horse, Horse responds correctly", async function () {
        const { horse, farmer } = await loadFixture(contractsFixture);
  
        expect(await farmer.call(horse.target)).to.equal("Igogo");
      });

      it("Farmer can feed Horse with plant", async function () {
        const {horse, farmer, plant} = await loadFixture(contractsFixture);

        expect(await farmer.feed(horse.target, plant)).to.equal(`Із задоволенням зʼїсть ${plant}`);
      });

      it("Farmer cannot feed Horse with anything else", async function () {
        const {horse, farmer, food} = await loadFixture(contractsFixture);

        expect(await farmer.feed(horse.target, food)).to.equal(`не зʼїсть ${food}`);
      });
    });

    describe("Dog and Farmer", async function() {
        it("Dog has the correct name", async function() {
            const {dog, dogName} = await loadFixture(contractsFixture);

            expect(await dog._name()).to.equal(dogName);
        });

        it("Dog can sleep", async function() {
            const {dog} = await loadFixture(contractsFixture);

            expect(await dog.sleep()).to.equal("Z-z-z-z...");
        });

        it("Dog can eat “plant”", async function() {
            const {dog, plant} = await loadFixture(contractsFixture);

            expect(await dog.eat(plant)).to.equal(`Із задоволенням зʼїсть ${plant}`);
        });

        it("Dog can eat ”meat”", async function() {
            const {dog, meat} = await loadFixture(contractsFixture);

            expect(await dog.eat(meat)).to.equal(`Із задоволенням зʼїсть ${meat}`);
        });

        it("Dog cannot eat ”not-food”, ”plastic”, ”chocolate”", async function() {
            const {dog, food, chocolate} = await loadFixture(contractsFixture);

            await expect(dog.eat(chocolate)).to.be.revertedWith("Animal can`t eats a chocolate");
            await expect(dog.eat(food)).to.be.revertedWith("Animal can eats only meat or plant and no chocolate");
        });

        it("Farmer can call Dog, Dog responds correctly", async function() {
            const {farmer, dog} = await loadFixture(contractsFixture);

            expect(await farmer.call(dog.target)).to.equal("Woof");
        });

        it("Farmer can feed Dog with ”meat”,”plant”", async function() {
            const {farmer, dog, meat, plant} = await loadFixture(contractsFixture);

            expect(await farmer.feed(dog.target, meat)).to.equal(`Із задоволенням зʼїсть ${meat}`);
            expect(await farmer.feed(dog.target, plant)).to.equal(`Із задоволенням зʼїсть ${plant}`)   
        });

        it("Farmer cannot feed Dog with ”not-food”, ”plastic” and anything else", async function() {
            const {farmer, dog, food, chocolate} = await loadFixture(contractsFixture);

            expect(await farmer.feed(dog.target, chocolate)).to.equal("Animal can`t eats a chocolate");
            expect(await farmer.feed(dog.target, food)).to.equal(`не зʼїсть ${food}`);
        });
    });
}); 