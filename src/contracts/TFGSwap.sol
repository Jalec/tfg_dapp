pragma solidity ^0.5.0;

import "./Token.sol";
import "@chainlink/contracts/src/v0.5/interfaces/AggregatorV3Interface.sol";

contract TFGSwap {
    string public name = "TFGSwap Cryptocurrency Exchange";
    Token public token;
    uint public rate = 0;
    AggregatorV3Interface internal priceFeed;
    

    event TokensBought(
        address account,
        address token,
        uint amount,
        uint rate
    );

    event TokensSold(
        address account,
        address token,
        uint amount,
        uint rate
    );

    constructor(Token _token) public {
        token = _token;
        priceFeed = AggregatorV3Interface(0x8A753747A1Fa494EC906cE90E9f37563A8AF630e);
    }

    function getLatestPrice() public view returns (int) {
        (
            /*uint80 roundID*/,
            int price,
            /*uint startedAt*/,
            /*uint timeStamp*/,
            /*uint80 answeredInRound*/
        ) = priceFeed.latestRoundData();
        return price/100000000;
    }

    function buyTokens(uint n_tokensToBuy) public payable {
        // Calculate the number of tokens to buy
        
        // Amount of tokens
        uint tokenAmount = n_tokensToBuy; 

        // To be sure we have enough tokens to do the operation
        require(token.balanceOf(address(this)) >= tokenAmount); 

        // Transfer tokens to the user
        token.transfer(msg.sender, tokenAmount);

        // Emit an event
        emit TokensBought(msg.sender, address(token), tokenAmount, rate);
    }

    function sellTokens(uint _amount, uint _etherToRedeem) public {
        // Users can't sell more tokens than they have
        require(token.balanceOf(msg.sender) >= _amount);

        // Calculate the amount of Ether to redeem
        uint etherAmount = _etherToRedeem;

        // To be sure we have enough Ether to do the operation
        require(address(this).balance >= etherAmount); 

        // Perform sale
        token.transferFrom(msg.sender, address(this), _amount);
        msg.sender.transfer(etherAmount);

        emit TokensSold(msg.sender, address(token), _amount, rate);
    }

}
