// SPDX-License-Identifier: MIT
pragma solidity 0.8.17;

contract Whisper {

  struct Message {
    address from;
    string text;
    uint timestamp;
  }

  mapping(address => Message[]) private messages;

  function sendMessage(address to, string calldata text) public {
    Message memory message;
    message.from = msg.sender;
    message.text = text;
    message.timestamp = block.timestamp;

    messages[to].push(message);
	}

  function getMessages() public view returns (Message[] memory) {
      return messages[msg.sender];
  }
}
