// SPDX-License-Identifier: MIT

pragma solidity ^0.8.0;

import "hardhat/console.sol";

library StringComparer {
    function compare(string memory str1, string memory str2) internal pure returns (bool) {
        return keccak256(abi.encodePacked(str1)) == keccak256(abi.encodePacked(str2));
    }
}

interface Living {
    function eat(string memory food) external returns (string memory);
}

contract HasName {
    string public _name;

    constructor(string memory name) {
        _name = name;
    }
}

abstract contract Animal is Living {
    function eat(string memory food) public virtual pure returns (string memory) {
        return string.concat(
            unicode"Із задоволенням зʼїсть ", food
        );
    }

    function sleep() pure virtual public returns (string memory) {
        return "Z-z-z-z...";
    }

    function speak() public virtual pure returns (string memory) {
        return "...";
    }
}

// ======================================================================================================
abstract contract Herbivore is Animal, HasName {
    string constant PLANT = "plant";

    modifier eatOnlyPlant(string memory food) {
        require(StringComparer.compare(food, PLANT), "Can only eat plant food");
        _;
    }

    function eat(string memory food) public pure virtual override eatOnlyPlant(food) returns (string memory) {
        return super.eat(food);
    }
}

// Create new abstract contract Carnivorous from Animal==================================================================
abstract contract Carnivorous is Animal, HasName {
    string constant MEAT = "meat";

    modifier eatOnlyMeat(string memory food) {
        require(StringComparer.compare(food, MEAT), unicode"Не зʼїсть plant");
        _;
    }

    function eat(string memory food) virtual public override pure eatOnlyMeat(food) returns (string memory) {
        return super.eat(food);
    }

}

// New contract Wolf from Carnivorous===================================================================
contract Wolf is Carnivorous {
    constructor(string memory name) HasName(name) {
    }

    function speak() public override pure returns (string memory) {
        return "Awoo";
    }
}

// New contract Wolf from Carnivorous and Herbivore to get their constants ===================================================================
contract Dog is Carnivorous, Herbivore {
    constructor(string memory name) HasName(name){
    }

// declaring new constant==================================
    string constant CHOCOLATE = "chocolate";

// create new modifier with 2 conditions===================
    modifier meatPlantNoChoco(string memory food) {
        require(!StringComparer.compare(food, CHOCOLATE), "Animal can`t eats a chocolate");
        require(StringComparer.compare(food, MEAT) || StringComparer.compare(food, PLANT), "Animal can eats only meat or plant and no chocolate");
        _;
    }

    function eat(string memory food) public pure meatPlantNoChoco(food) override (Carnivorous, Herbivore) returns (string memory) {
         return Animal.eat(food);
    }

    function speak() override pure public returns (string memory) {
        return "Woof";
    }
}

// =======================================================================================================
contract Cow is Herbivore {
    constructor(string memory name) HasName(name) {
    }


    function speak() public pure override returns (string memory) {
        return "Moooo";
    }
}

// =======================================================================================================
contract Horse is Herbivore {
    constructor(string memory name) HasName(name) {
    }

    function speak() pure public override returns(string memory) {
        return "Igogo";
    }
}

// =========================================================================================================
contract Farmer {

    function feed(address animal, string memory food) pure public returns(string memory) {
        try Animal(animal).eat(food){
            return Animal(animal).eat(food);
        }
        catch Error(string memory reason) {
            if (StringComparer.compare(reason, "Animal can`t eats a chocolate")) {
                return "Animal can`t eats a chocolate";
            }
            return string.concat(unicode"не зʼїсть ", food);
        }
    }

    function call(address animal) pure public returns(string memory) {
        return Animal(animal).speak();
    }
}