// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.13;

import {Test, console} from "forge-std/Test.sol";
import {ISuperToken} from "@superfluid/interfaces/superfluid/ISuperToken.sol";
import {MintableSuperToken} from "@supertokens/MintableSuperToken.sol";
import {Game} from "../src/Game.sol";
import {IConstantFlowAgreementV1} from "@superfluid-finance/ethereum-contracts/contracts/interfaces/agreements/IConstantFlowAgreementV1.sol";
import {CFAv1Forwarder} from "@superfluid-finance/ethereum-contracts/contracts/utils/CFAv1Forwarder.sol";

contract AgarTest is Test {
    address deployer = 0x4D5BA70D2f7bD991BF09A5979e5F5e7dCAD04679;
    ISuperToken sepoliaLifeToken =
        ISuperToken(payable(0xbf2F890E8F5CCCB3A1D7c5030dBC1843B9E36B0e));
    CFAv1Forwarder cfaV1Sepolia =
        CFAv1Forwarder(0xcfA132E353cB4E398080B9700609bb008eceB125);

    Game game;
    address gameAdmin = vm.addr(111111111111);

    function setUp() public {
        vm.createSelectFork("sepolia");

        game = new Game(deployer, sepoliaLifeToken, 1 ether);

        vm.prank(deployer);
        game.grantRole(game.GAME_ADMIN_ROLE(), gameAdmin);

        vm.prank(deployer);
        cfaV1Sepolia.grantPermissions(
            ISuperToken(address(sepoliaLifeToken)),
            address(game)
        );
    }

    /**
     * GAME ADMIN
     */

    function testMintTokens() public {
        vm.prank(deployer);
        MintableSuperToken(payable(address(sepoliaLifeToken))).mint(
            vm.addr(1234),
            1000 ether,
            ""
        );
    }

    /**
     * ENTER GAME
     */

    function testCannotEnterWithoutNaitvePayment() public {
        address player_one = vm.addr(1234);
        vm.deal(player_one, 1 ether);

        vm.prank(player_one);
        game.enter{value: 1 ether}(player_one, address(0));

        vm.warp(block.timestamp + 1 days);

        vm.assertEq(
            ISuperToken(sepoliaLifeToken).balanceOf(player_one),
            1 days * 1 ether
        );
    }

    function testCannotEnterWithCurrencyNotEnabled() public {}

    function testCannotEnterWithoutERC20Payment() public {
        // No ERC20 payment yet
    }

    function testEnterGamePayment() public {
        address player_one = vm.addr(99);
        address player_two = vm.addr(100);

        vm.deal(player_one, 1 ether);
        vm.deal(player_two, 1 ether);

        vm.prank(player_one);
        game.enter{value: 1 ether}(player_one, address(0));

        vm.prank(player_two);
        game.enter{value: 1 ether}(player_two, address(0));

        // Eating half of player_one's flow
        vm.prank(gameAdmin);
        game.eat(player_one, player_two, 5000);

        (, int96 playerOneFlow, , ) = cfaV1Sepolia.getFlowInfo(
            sepoliaLifeToken,
            deployer,
            player_one
        );
        (, int96 playerTwoFlow, , ) = cfaV1Sepolia.getFlowInfo(
            sepoliaLifeToken,
            deployer,
            player_two
        );

        vm.assertEq(
            playerOneFlow,
            game.BASE_FLOW_RATE() + game.BASE_FLOW_RATE() / 2
        );
        vm.assertEq(
            playerTwoFlow,
            game.BASE_FLOW_RATE() - game.BASE_FLOW_RATE() / 2
        );
    }

    /**
     * EAT
     */

    function testNonValidPercentageEaten() public {
        address player_one = vm.addr(99);
        address player_two = vm.addr(100);

        vm.deal(player_one, 1 ether);
        vm.deal(player_two, 1 ether);

        vm.prank(player_one);
        game.enter{value: 1 ether}(player_one, address(0));

        vm.prank(player_two);
        game.enter{value: 1 ether}(player_two, address(0));

        // Eating half of player_one's flow
        vm.prank(gameAdmin);
        vm.expectRevert(
            "Game: percentageEaten should be less than or equal to MAX_BPS"
        );
        game.eat(player_one, player_two, 500000);
    }
}
