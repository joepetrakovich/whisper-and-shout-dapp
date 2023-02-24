// SPDX-License-Identifier: MIT
pragma solidity 0.8.17;

contract Shout {

  struct Message {
    address from;
    string text;
    uint timestamp;
  }

  mapping(address => Message[]) private messages;

  event messageSent(address from, address to);

  function sendMessage(address to, string calldata text) public {
    Message memory message;
    message.from = msg.sender;
    message.text = text;
    message.timestamp = block.timestamp;

    messages[to].push(message);

    emit messageSent(msg.sender, to);
	}

  function getMessages() public view returns (Message[] memory) {
      return messages[msg.sender];
  }
}
