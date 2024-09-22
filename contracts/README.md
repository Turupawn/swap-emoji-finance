## Solidity interface

```solidity
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

interface EmojiContract {
	function aButtonBButton(uint256 strawberry,uint256 grapes) external returns (bool);
	function bButtonAButton(uint256 strawberry,uint256 grapes) external returns (bool);
}
```

## ABI

```json
[{"inputs": [{"name":"strawberry","type":"uint256"},{"name":"grapes","type":"uint256"}],"name": "aButtonBButton","outputs": [{"internalType": "bool", "name": "", "type": "bool"}], "stateMutability": "nonpayable", "type": "function"},{"inputs": [{"name":"strawberry","type":"uint256"},{"name":"grapes","type":"uint256"}],"name": "bButtonAButton","outputs": [{"internalType": "bool", "name": "", "type": "bool"}], "stateMutability": "nonpayable", "type": "function"}]
```