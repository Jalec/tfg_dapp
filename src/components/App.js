import React, { Component } from 'react';
import Web3 from 'web3';
import Token from '../abis/Token.json';
import TFGSwap from '../abis/TFGSwap.json';
import Navbar from './Navbar.js';
import Dex from './Dex.js';
import TxInfo from './TxInfo.js';
import './App.css';

class App extends Component {

  async componentWillMount() {
    await this.loadWeb3();
    await this.loadBlockchainData();
  } 

  // The purpose of this function is to import all the data that we need for the application that is stored on the blockchain using Web3.js
  async loadBlockchainData() {
    const web3 = new Web3(window.web3.currentProvider);

    const accounts = await web3.eth.getAccounts();
    this.setState({ account: accounts[0]});

    const ethBalance = await web3.eth.getBalance(this.state.account);
    this.setState({ ethBalance });
    
    //Load Token Data
    const networkId = await web3.eth.net.getId();
    const tokenData = Token.networks[networkId];
    if(tokenData){
      const token = new web3.eth.Contract(Token.abi, tokenData.address);
      this.setState({ token });
      let tokenBalance = await token.methods.balanceOf(this.state.account).call();
      this.setState({ tokenBalance: tokenBalance.toString() });
    } else {
      window.alert('Token contract not deployed to detected network.')
    }

    //Load TFGSwap Data
    const TFGprice = 65;
    const tfgSwapData = TFGSwap.networks[networkId];
    if(tfgSwapData){
      const tfgSwap = new web3.eth.Contract(TFGSwap.abi, tfgSwapData.address);
      this.setState({ tfgSwap });
      let ethereumPrice = await tfgSwap.methods.getLatestPrice().call();
      this.setState({ ethereumPrice: ethereumPrice.toString() });
      let exchangeRate = TFGprice / this.state.ethereumPrice;
      this.setState({ exchangeRate });
    } else {
      window.alert('TFGSwap contract not deployed to detected network.')
    }

    this.setState({ loading: false });   
  }

  // The purpose of this function is to connect our browser to the blockchain making use of Web3.js and Metamask
  async loadWeb3() {
    if(window.ethereum) {
      window.web3 = new Web3(window.ethereum);  
      await window.ethereum.enable();
    }
    else if (window.web3) {
      window.web3 = new Web3(window.web3.currentProvider);
    }
    else {
      window.alert('Non-Ethereum browser detected. You should consider trying MetaMask!');
    }
  }

  // This function aims to buy tokens given an etherAmount and the number of tokensToBuy using Web3.js, also after sending the transaction we use the confirmation feature to get 
  // the transaction details
  buyTokens= (etherAmount, n_tokensToBuy) => {
    this.setState({ loading: true });
    let tokensToBuy = n_tokensToBuy.toString();
    this.state.tfgSwap.methods.buyTokens(tokensToBuy.toString()).send({ value: etherAmount, from: this.state.account }).on('transactionHash', (hash) =>{
      this.setState({ loading: false });
      this.setState({ txhash: hash });
    }).on('confirmation', (confirmationNumber, receipt) =>{
      this.setState({ blockNumber: receipt.blockNumber});
      this.setState({ fromAddress: receipt.from});
      this.setState({ contractAddress: receipt.to});
      this.setState({ gasUsed: receipt.gasUsed});
    });
  }

  // This function aims to sell tokens given a tokenAmount and the number of ether to redeem using Web3.js, also after sending the transaction we use the confirmation feature to get 
  // the transaction details
  sellTokens= (tokenAmount, n_etherToRedeem) => {
    this.setState({ loading: true });
    let etherToRedeem = n_etherToRedeem.toString();
    this.state.token.methods.approve(this.state.tfgSwap.address, tokenAmount).send({ from: this.state.account }).on('transactionHash', (ahash) =>{
    });
    this.state.tfgSwap.methods.sellTokens(tokenAmount, etherToRedeem).send({ from: this.state.account }).on('transactionHash', (bhash) =>{
      this.setState({ loading: false });
    }).on('confirmation', (confirmationNumber, receipt) =>{
      this.setState({ txhash: receipt.transactionHash });
      this.setState({ blockNumber: receipt.blockNumber});
      this.setState({ fromAddress: receipt.from});
      this.setState({ contractAddress: receipt.to});
      this.setState({ gasUsed: receipt.gasUsed});
    });

  }

  constructor(props) {
    super(props);
    this.state = { 
      account:'',
      token: {},
      tfgSwap: {},
      ethereumPrice: '0',
      exchangeRate: '0',
      ethBalance: '0',
      tokenBalance: '0',
      loading: true,
      txhash: '',
      blockNumber: '',
      fromAddress: '',
      contractAddress: '',
      gasUsed: '',
      currentPage: 'dex',
      token_price: 65
    };
  }

  render() {
    let content;
    if(this.state.loading) {
      content= <div className="d-flex justify-content-center mt-5">
      <div className="spinner-border text-light" role="status">
        <span className="visually-hidden"></span>
      </div>
    </div>
    } else if (this.state.currentPage === 'dex') {
      content = <Dex 
      ethBalance={this.state.ethBalance} 
      tokenBalance={this.state.tokenBalance}
      ethereumPrice={this.state.ethereumPrice}
      exchangeRate={this.state.exchangeRate}
      buyTokens={this.buyTokens}
      sellTokens={this.sellTokens} 
      token_price={this.state.token_price}
      />
    } else if (this.state.currentPage === 'lp') {
      content = <TxInfo
      txhash={this.state.txhash}
      blockNumber={this.state.blockNumber}
      userAddress={this.state.fromAddress}
      contractAddress={this.state.contractAddress}
      gasUsed={this.state.gasUsed}
      />
    }
    return (
      <div>

        <Navbar account={this.state.account} />
        
        <div className="container-fluid mt-5">
          <div className="row">
            <main role="main" className="col-lg-12 ml-auto mr-auto" style={{ maxWidth: '600px' }}>
              <div className="content mr-auto ml-auto">
                <div className="btn-group btn-group-lg d-flex justify-content-center mt-5" role="group" aria-label="Basic example">
                  <button type="button" className="btn btn-info" 
                    onClick={(event)=>{
                    this.setState({ currentPage: 'dex' });
                    }}>
                      Dex
                  </button>
                  <button type="button" className="btn btn-info" 
                    onClick={(event)=>{
                    this.setState({ currentPage: 'lp' });
                    }}>
                      Tx Details
                  </button>
                </div>
                {content}
              </div>
            </main>
          </div>
        </div>
      </div>
    );
  }
}

export default App;
