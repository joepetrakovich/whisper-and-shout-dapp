import { assert } from "chai";
import { ethers } from "hardhat";

describe("Shout", function () {
    async function deploy() {
        const [accountOne, accountTwo] = await ethers.getSigners();
        const Shout = await ethers.getContractFactory("Shout");
        const shout = await Shout.deploy();

        return { shout, accountOne, accountTwo };
    }

    it("should deploy", async function () {
        await deploy();
        assert.isTrue(true);
    });
    
    it("should have no messages to start", async () => {
        const { shout } = await deploy();
        const messages = await shout.getMessages();

        assert.equal(0, messages.length);
    });

    it("should send a message", async () => {
        const { shout, accountOne, accountTwo } = await deploy();

        const accountTwoStartingMessages = await shout.connect(accountTwo).getMessages();
        assert.equal(0, accountTwoStartingMessages.length);

        await shout.sendMessage(accountTwo.address, "Hello world!");
        const accountTwoEndingMessages = await shout.connect(accountTwo).getMessages();

        assert.equal(1, accountTwoEndingMessages.length);
        assert.equal("Hello world!", accountTwoEndingMessages[0].text);
        assert.equal(accountOne.address, accountTwoEndingMessages[0].from);
    });

    it("should send a message to yourself", async () => {
        const { shout, accountOne } = await deploy();

        const accountOneStartingMessage = await shout.getMessages();
        assert.equal(0, accountOneStartingMessage.length);

        await shout.sendMessage(accountOne.address, "Hello world!");
        const accountOneEndingMessages = await shout.getMessages();

        assert.equal(1, accountOneEndingMessages.length);
        assert.equal("Hello world!", accountOneEndingMessages[0].text);
        assert.equal(accountOne.address, accountOneEndingMessages[0].from);
    });
});