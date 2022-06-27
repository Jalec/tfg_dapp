import React, { Component } from 'react';
import ethLogo from '../eth-logo.png';
import tfgLogo from '../tfg-logo.png';

class Buy extends Component {
  constructor(props) {
    super(props);
    this.state = { 
        output: '0'
    };
  }

  render() {
    return (
      <form className="mb-3" onSubmit={(event) => {
        event.preventDefault();
        // After submitting the amount of ethereum we want to use in order to buy TFG Tokens, these information is adjusted with the aim of having no problems
        // with the smart-contracts that is trying to interact with
        let etherAmount;
        etherAmount = this.input.value.toString();
        let m_tokensToBuy = etherAmount / this.props.exchangeRate;
        etherAmount = window.web3.utils.toWei(etherAmount, 'Ether');
        let a_tokensToBuy = m_tokensToBuy * 1000000000000000000;
        this.props.buyTokens(etherAmount, a_tokensToBuy);
    }}>
      <div>
        <label className="float-left"><b>Input</b></label>
        <span className="float-right text-muted">
          Balance: {this.props.ethBalance}
        </span>
      </div>
      <div className="input-group mb-4">
        <input
          type="number"
          onChange={(event) =>{
              const etherAmount = this.input.value.toString();
              this.setState({
                  output: etherAmount / (this.props.token_price/parseInt(this.props.ethereumPrice))
              })
          }}
          ref={(input) => {
              this.input = input;
          }}
          className="form-control form-control-lg"
          placeholder="0"
          step="0.1"
          required />
        <div className="input-group-append">
          <div className="input-group-text">
            <img src={ethLogo} height='32' alt=""/>
            &nbsp;&nbsp;&nbsp; ETH
          </div>
        </div>
      </div>
      <div>
        <label className="float-left"><b>Output</b></label>
        <span className="float-right text-muted">
          Balance: {this.props.tokenBalance}
        </span>
      </div>
      <div className="input-group mb-2">
        <input
          type="text"
          className="form-control form-control-lg"
          placeholder="0"
          value={this.state.output}
          disabled
        />
        <div className="input-group-append">
          <div className="input-group-text">
            <img src={tfgLogo} height='32' alt=""/>
            &nbsp;&nbsp;&nbsp; TFG
          </div>
        </div>
      </div>
      <div className="mb-5">
        <span className="float-left text-muted">Exchange Rate</span>
        <span className="float-right text-muted">1 TFG Token (65$) = {(this.props.token_price / this.props.ethereumPrice).toFixed(4)} ETH</span>
      </div>
      <button type="submit" className="btn btn-primary btn-block btn-lg">Swap</button>
      </form>
    );
  }
}

export default Buy;
