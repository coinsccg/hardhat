// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

interface IERC20 {
    function transferFrom(address sender,address recipient,uint256 amount) external returns (bool);
}

contract BatchTransfer {
    // 使用calldata会减少gas
    function batchTransfer(IERC20 token, address from, address[] calldata toList, uint256[] calldata valueList) public returns (bool){
        require(from == msg.sender, "No permission");
        require(toList.length > 0);
        require(toList.length == valueList.length);
        uint256 len = toList.length; // 减少gas
        for(uint i=0; i < len; i++){
            address to = toList[i]; // 减少gas
            uint256 amount = valueList[i]; // 减少gas
            token.transferFrom(from, to, amount);
        }
        return true;
    }
}
