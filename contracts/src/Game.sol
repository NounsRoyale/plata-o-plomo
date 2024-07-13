// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.13;

import {IGame, GameCurrency} from "./IGame.sol";
import {IERC20} from "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import {ISuperToken} from "@superfluid/interfaces/superfluid/ISuperToken.sol";
import {SuperTokenV1Library} from "@superfluid-finance/ethereum-contracts/contracts/apps/SuperTokenV1Library.sol";
import {AccessControlUpgradeable} from "@openzeppelin-contracts-upgradeable/access/AccessControlUpgradeable.sol";
import {UUPSUpgradeable} from "@openzeppelin-contracts-upgradeable/proxy/utils/UUPSUpgradeable.sol";

/**
 * @title Game contract
 * @dev Game contract that allows players to enter the game and start streaming $LIFE tokens.
 * The game admin can eat the flow of a player and exit the game.
 */
contract Game is IGame, AccessControlUpgradeable, UUPSUpgradeable {
    using SuperTokenV1Library for ISuperToken;

    /**
     * @notice Role to manage the game
     */
    bytes32 public constant GAME_ADMIN_ROLE = keccak256("GAME_ADMIN_ROLE");

    /**
     * @dev Base flow rate for the game
     */
    int96 public BASE_FLOW_RATE = 1 * 1e18; // 1 $LIFE per second

    /**
     * @dev Maximum basis points for percentage calculations
     */
    uint256 constant MAX_BPS = 10_000;

    /**
     * @notice $LIFE super token
     */
    ISuperToken public life;

    /**
     * @dev Address of the life pool account
     */
    address lifePool;

    /**
     * @notice Game currencies allowed as payment to enter the game
     */
    mapping(address => GameCurrency) public gameCurrencies;

    constructor() {}

    function initialize(
        address _lifePool,
        ISuperToken _life,
        int96 _baseFlowRate,
        uint256 nativePrice
    ) public initializer {
        __AccessControl_init();
        __UUPSUpgradeable_init();

        life = _life;
        lifePool = _lifePool;
        BASE_FLOW_RATE = _baseFlowRate;
        // Enable native currency
        gameCurrencies[address(0)].enabled = true;
        gameCurrencies[address(0)].price = nativePrice;

        _grantRole(DEFAULT_ADMIN_ROLE, msg.sender);
    }

    /**
     * @param player Player entering the game
     * @param currency Currency used to pay the entry fee
     */
    function enter(
        address player,
        address currency,
        bytes memory userData
    ) external payable override {
        require(!_isInGame(player), "Game: player already in game");

        // Pay to enter the game
        _handlePayments(player, currency);

        // Start streaming $LIFE tokens to the player
        life.createFlowFrom(lifePool, player, BASE_FLOW_RATE);

        emit Entered(player, currency, userData);
    }

    /**
     * @notice Adming function to let a player eat the flow of another player
     * @param playerEating address of the player eating
     * @param playerEaten address of the player eaten
     * @param percentageEaten percentage of the flow rate to be eaten based on MAX_BPS
     */
    function eat(
        address playerEating,
        address playerEaten,
        // Percentage of the flow rate to be eaten based on MAX_BPS
        uint256 percentageEaten
    ) external override onlyRole(GAME_ADMIN_ROLE) {
        require(
            _isInGame(playerEating) && _isInGame(playerEaten),
            "Game: players not in game"
        );
        require(
            percentageEaten <= MAX_BPS,
            "Game: percentageEaten should be less than or equal to MAX_BPS"
        );

        // Get the flow rate of the playerEaten
        (, int96 flowRate, , ) = life.getFlowInfo(lifePool, playerEaten);

        int96 eatenFlowRate = int96(
            int256((uint256(int256(flowRate)) * percentageEaten) / MAX_BPS)
        );

        // Calculate the new flow rate
        int96 newFlowRate = flowRate - eatenFlowRate;

        // Update the flow rate of the playerEaten
        if (newFlowRate <= 0) {
            life.deleteFlowFrom(lifePool, playerEaten);
        } else {
            life.updateFlowFrom(lifePool, playerEaten, newFlowRate);
        }

        // Get the flow rate of the playerEating
        (, flowRate, , ) = life.getFlowInfo(lifePool, playerEating);

        // Update the flow rate of the playerEating
        life.updateFlowFrom(lifePool, playerEating, flowRate + eatenFlowRate);

        emit Ate(playerEating, playerEaten, percentageEaten);
    }

    /**
     * @notice Admin function to exit a player from the game
     * @param player Player exiting the game
     */
    function exit(address player) external override onlyRole(GAME_ADMIN_ROLE) {
        require(_isInGame(player), "Game: player not in game");
        // Exit the game (delete the flow)
        life.deleteFlowFrom(lifePool, player);

        emit Exited(player);
    }

    function updateGamePrice(
        address currency,
        uint256 price
    ) external onlyRole(DEFAULT_ADMIN_ROLE) {
        gameCurrencies[currency].price = price;
    }

    function isInGame(address player) external view returns (bool) {
        return _isInGame(player);
    }

    // Internal methods

    function _handlePayments(address from, address currency) internal {
        require(gameCurrencies[currency].enabled, "Game: currency not enabled");

        // Payment validation
        if (currency == address(0)) {
            require(
                msg.value == gameCurrencies[currency].price,
                "Game: invalid price"
            );
        } else {
            revert("Game: ERC20 not supported");
        }
    }

    function _isInGame(address player) internal view returns (bool) {
        (, int96 flowRate, , ) = life.getFlowInfo(lifePool, player);
        return flowRate > 0;
    }

    function _authorizeUpgrade(
        address
    ) internal override onlyRole(DEFAULT_ADMIN_ROLE) {}
}
