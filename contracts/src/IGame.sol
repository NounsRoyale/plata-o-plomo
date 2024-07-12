// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.13;

struct GameCurrency {
    bool enabled;
    uint256 price;
}

interface IGame {
    event Entered(address indexed player, address indexed currency);

    event Ate(
        address indexed playerEating,
        address indexed playerEaten,
        uint256 percentageEaten
    );

    event Exited(address indexed player);

    /**
     * @dev Enter the game
     * @dev This function should be called by the player to enter the game
     * & pay the entry fee
     */
    function enter(address player, address currency) external payable;

    /**
     * @dev Eat the food
     * @dev This function should be called by the game engine to eat the foo
     * & split streams
     */
    function eat(
        address playerEating,
        address playerEaten,
        uint256 percentageEaten
    ) external;

    /**
     * @dev Exit the game
     * @dev This function should be called by the player to leave the game or
     * by the game engine to remove player from the game
     */
    function exit(address player) external;
}
