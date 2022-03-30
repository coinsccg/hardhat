// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

interface IERC20 {
    function transferFrom(address sender,address recipient,uint256 amount) external returns (bool);
}

contract Ownable {
    address public _owner;

    modifier onlyOwner() {
        require(_owner == msg.sender, "Ownable: caller is not the owner");
        _;
    }
   
    function renounceOwnership() public  onlyOwner {
        _owner = address(0);
    }

    function transferOwnership(address newOwner) public  onlyOwner {
        require(
            newOwner != address(0),
            "Ownable: new owner is the zero address"
        );
        _owner = newOwner;
    }
}

contract BatchTransfer is Ownable{

    IERC20 public token;

    constructor(IERC20 token_) {
        _owner = msg.sender;
        token = token_;
    }

    function setToken(IERC20 token_) external onlyOwner{
        token = token_;
    }
    
    function batchTransfer(address from, address[] memory toList, uint256[] memory valueList) public returns (bool){
        require(toList.length > 0);
        require(toList.length == valueList.length);
        for(uint i=0; i < toList.length; i++){
            token.transferFrom(from, toList[i], valueList[i]);
        }
        return true;
    }
}