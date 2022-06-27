const { assert } = require('chai');
const { default: Web3 } = require('web3');

const Token = artifacts.require('Token');
const TFGSwap = artifacts.require("TFGSwap");

require('chai')
    .use(require('chai-as-promised'))
    .should()


// These are the tests for the local blockchain Ganache and are made on previous versions 
// of the current Smart-Cobntracts of the project that have less functionalities    
contract('TFGSwap', ([deployer, investor]) => {
    let token, tfgSwap;
    before(async () => {
        token = await Token.new();
        tfgSwap = await TFGSwap.new(token.address);
        await token.transfer(tfgSwap.address, '1000000000000000000000000');
    })
    describe('Token deployment', async () => {
        it('smart-contract has a name', async () => {
            const name = await token.name();
            assert.equal(name, 'TFG Token');
        })
    })

    describe('TFGSwap deployment', async () => {
        it('smart-contract has a name', async () => {            
            const name = await tfgSwap.name();
            assert.equal(name, 'TFGSwap Cryptocurrency Exchange');
        })

        it('contract has tokens', async() => {
            let balance = await token.balanceOf(tfgSwap.address);
            assert.equal(balance.toString(), '1000000000000000000000000');
        })
    })

    describe('Buy Tokens using buyTokens()', async () => {
        let result 

        before(async () => {
            //Buy tokens before each example
            result = await tfgSwap.buyTokens({from: investor, value: '1000000000000000000'});
        })
        it('Allows user to instantly purchase tokens from TFGSwap for a fixed price', async () => {
            //Check investor token balance after purchase
            let investorBalance = await token.balanceOf(investor);
            assert.equal(investorBalance.toString(), '100000000000000000000'); //100 ether
            
            // Check TFGSwap after purchase of the tokens
            let TFGSwapBalance = await token.balanceOf(tfgSwap.address);
            assert.equal(TFGSwapBalance.toString(), '999900000000000000000000'); //100 ether
            TFGSwapBalance = await web3.eth.getBalance(tfgSwap.address);
            assert.equal(TFGSwapBalance.toString(), web3.utils.toWei('1', 'Ether'));

            const event = result.logs[0].args;
            assert.equal(event.account, investor);
            assert.equal(event.token, token.address);
            assert.equal(event.amount.toString(), '100000000000000000000', );
            assert.equal(event.rate.toString(), '100');

        })
    })

    describe('Sell Tokens using sellTokens()', async () => {
        let result 

        before(async () => {
            // Investor must approve the purchase 
            await token.approve(tfgSwap.address, '100000000000000000000', { from: investor})

            // Investor sells the tokens
            result = await tfgSwap.sellTokens('100000000000000000000', { from: investor});
        })
        it('Allows user to sell tokens to TFGSwap for a fixed price', async () => {
            let investorBalance = await token.balanceOf(investor);
            assert.equal(investorBalance.toString(), '0'); //100 ether

            let TFGSwapBalance = await token.balanceOf(tfgSwap.address);
            assert.equal(TFGSwapBalance.toString(), '1000000000000000000000000');
            TFGSwapBalance = await web3.eth.getBalance(tfgSwap.address);
            assert.equal(TFGSwapBalance.toString(), web3.utils.toWei('0', 'Ether'));

            const event = result.logs[0].args;
            assert.equal(event.account, investor);
            assert.equal(event.token, token.address);
            assert.equal(event.amount.toString(), '100000000000000000000', );
            assert.equal(event.rate.toString(), '100');

            // Users can't sell more tokens than they have
            await tfgSwap.sellTokens('500000000000000000000000000', { from: investor}).should.be.rejected;

        })
    })
})