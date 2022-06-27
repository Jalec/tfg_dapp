import React, { Component } from 'react';


class TxInfo extends Component {
  constructor(props) {
    super(props);
    this.state = { 
    };
  }
  
  render() {
    //This component lists all the information from the last transaction confirmed by the application and also give us a link to the Blockchain Explorer
    let link="https://rinkeby.etherscan.io/tx/" + this.props.txhash;
    return (
        <div> 
          <h1 className='d-flex justify-content-center mb-3 mt-5 display-4 text-light'>Last Transaction Details</h1>
          <div className="card width: 18rem;">
            <ul className="list-group list-group-flush">
              <li className="list-group-item"><b>Transaction Hash:</b> {this.props.txhash} </li>
              <li className="list-group-item"><b>Block Number:</b> {this.props.blockNumber} </li>
              <li className="list-group-item"><b>User address (From):</b> {this.props.userAddress}</li>
              <li className="list-group-item"><b>Contract address (To):</b> {this.props.contractAddress}</li>
              <li className="list-group-item"><b>Gas Used:</b> {this.props.gasUsed}</li>
            </ul>
            <a className="btn btn-primary btn-block btn-lg" href={link} target="_blank" rel="noopener noreferrer">See on Blockchain Explorer</a>
          </div>
          
          <div className="alert alert-warning mb-3 mt-5" role="alert">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-info-circle" viewBox="0 0 16 16">
              <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14zm0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16z"/>
              <path d="m8.93 6.588-2.29.287-.082.38.45.083c.294.07.352.176.288.469l-.738 3.468c-.194.897.105 1.319.808 1.319.545 0 1.178-.252 1.465-.598l.088-.416c-.2.176-.492.246-.686.246-.275 0-.375-.193-.304-.533L8.93 6.588zM9 4.5a1 1 0 1 1-2 0 1 1 0 0 1 2 0z"/>
            </svg> 
            &nbsp;&nbsp;&nbsp; The busy state of the Rinkeby testnet may causes some unexpected results on the application, p.e. delay on the confirmation of transactions, difficulties to pull the transaction information, failing transactions.  
          </div> 
        </div>
    );
  }
}

export default TxInfo;
