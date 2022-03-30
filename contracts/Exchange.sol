// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

interface IERC20 {
    function totalSupply() external view returns (uint256);
    function balanceOf(address account) external view returns (uint256);
    function transfer(address recipient, uint256 amount) external returns (bool);
    function allowance(address owner, address spender) external view returns (uint256);
    function approve(address spender, uint256 amount) external returns (bool);
    function transferFrom(address sender,address recipient,uint256 amount) external returns (bool);
    event Transfer(address indexed from, address indexed to, uint256 value);
    event Approval(address indexed owner, address indexed spender, uint256 value);
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

contract Exchange is Ownable {

    IERC20 public oldA;
    IERC20 public newB;
    mapping (address => uint256) private user;
    mapping(address => bool) private _blacklist;
    address private preSale;
    bool private isExchange;
    uint256 public rate;

    event ExchangeEvent(address indexed sender, address indexed recipient, uint256 amount);

    constructor(IERC20 _oldA, IERC20 _newB, address _preSale){
        oldA = _oldA;
        newB = _newB;
        _owner = msg.sender;
        preSale = _preSale;
        isExchange = false;
        rate = 1;
    }

    function includeBlacklist(address account) external {
        require(_owner == msg.sender);
        _blacklist[account] = true;
    }

    function excludeBlacklist(address account) external {
        require(_owner == msg.sender);
        _blacklist[account] = false;
    }

    function getInBlacklist(address account) public view returns(bool) {
        return _blacklist[account];
    }

    function getExchangeAmount(address account) external view returns(uint256){
        return user[account];
    }

    function getExchange() public view returns(bool){
        return isExchange;
    }

    function setExchange(bool _isExchange) external {
        require(msg.sender == _owner, "Exchange: No permission");
        isExchange = _isExchange;
    }

    function exchange() external {
        require(!getInBlacklist(msg.sender), "Exchange: Blacklist unable to extract");
        require(getExchange(), "Exchange: Close exchange");
        address spender = msg.sender;
        uint256 balanceOldA = oldA.balanceOf(spender);
        uint256 balanceNewB = newB.balanceOf(preSale);
        uint256 excBalance = user[spender];
        uint256 exchangeAmount = (balanceOldA - excBalance)/rate;
        require(exchangeAmount > 0, "Exchange: Has been exchanged");
        require(balanceNewB >= exchangeAmount, "Exchange: The balance is insufficient and cannot be exchanged");
        newB.transferFrom(preSale, spender, exchangeAmount);
        user[spender] = balanceOldA;
        emit ExchangeEvent(preSale, spender, exchangeAmount);
    }

}


