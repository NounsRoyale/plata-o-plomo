// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.13;

import {BaseScript} from "./Base.s.sol";
import {ISuperToken} from "@superfluid/interfaces/superfluid/ISuperToken.sol";
import {MintableSuperToken} from "@supertokens/MintableSuperToken.sol";
import {CFAv1Forwarder} from "@superfluid-finance/ethereum-contracts/contracts/utils/CFAv1Forwarder.sol";
import {Game} from "../src/Game.sol";

contract AgarScript is BaseScript {
    address sepoliaSuperTokenFactory =
        0x254C2e152E8602839D288A7bccdf3d0974597193;
    CFAv1Forwarder cfaV1Sepolia =
        CFAv1Forwarder(0xcfA132E353cB4E398080B9700609bb008eceB125);

    function setUp() public {}

    function grantAdminGameRole(
        DeployementChain chain
    ) public broadcastOn(chain) {
        (, address sender, ) = vm.readCallers();

        address backendAdmin = 0xe7e37649f37Ed6665260316413fdfe89f8edadb6;
        Game game = Game(_readDeployment("Game"));

        game.grantRole(game.GAME_ADMIN_ROLE(), backendAdmin);

        cfaV1Sepolia.grantPermissions(
            ISuperToken(_readDeployment("Life")),
            address(game)
        );
    }

    function deployGame(DeployementChain chain) public broadcastOn(chain) {
        (, address sender, ) = vm.readCallers();

        address backendAdmin = 0xe7e37649f37Ed6665260316413fdfe89f8edadb6;

        MintableSuperToken token = MintableSuperToken(
            payable(_readDeployment("Life"))
        );

        token.mint(backendAdmin, 1_000_000_000 ether, "");

        Game game = new Game(
            backendAdmin,
            ISuperToken(payable(token)),
            0.01 ether
        );

        _saveDeployment(address(game), "Game");
    }

    function deployLifeToken(DeployementChain chain) public broadcastOn(chain) {
        (, address sender, ) = vm.readCallers();
        MintableSuperToken token = new MintableSuperToken();

        token.initialize(sepoliaSuperTokenFactory, "Agar Life", "LIFE");

        token.mint(sender, 1_000_000_000 ether, "");

        _saveDeployment(address(token), "Life");
    }
}
