import { assert } from "chai";
import { ethers } from "hardhat";
import * as sapphire from '@oasisprotocol/sapphire-paratime';

describe("Whisper", function () {
    async function deploy() {
        const [accountOne, accountTwo] = await ethers.getSigners();
        const Whisper = await ethers.getContractFactory("Whisper");
        const whisper = await Whisper.deploy();

        return { whisper, accountOne, accountTwo };
    }

    it("should deploy", async function () {
        await deploy();
        assert.isTrue(true);
    });
    
    it("should have no messages to start", async () => {
        const { whisper } = await deploy();
        const messages = await whisper.getMessages();

        assert.equal(0, messages.length);
    });

    it("should send a message", async () => {
        const { whisper, accountOne, accountTwo } = await deploy();

        const accountTwoStartingMessages = await whisper.connect(accountTwo).getMessages();
        assert.equal(0, accountTwoStartingMessages.length);

        await whisper.sendMessage(accountTwo.address, "Hello world!");
        const accountTwoEndingMessages = await whisper.connect(accountTwo).getMessages();

        assert.equal(1, accountTwoEndingMessages.length);
        assert.equal("Hello world!", accountTwoEndingMessages[0].text);
        assert.equal(accountOne.address, accountTwoEndingMessages[0].from);
    });

    it("should send a message to yourself", async () => {
        const { whisper, accountOne } = await deploy();

        const accountOneStartingMessage = await whisper.getMessages();
        assert.equal(0, accountOneStartingMessage.length);

        await whisper.sendMessage(accountOne.address, "Hello world!");
        const accountOneEndingMessages = await whisper.getMessages();

        assert.equal(1, accountOneEndingMessages.length);
        assert.equal("Hello world!", accountOneEndingMessages[0].text);
        assert.equal(accountOne.address, accountOneEndingMessages[0].from);
    });
});