import React, { Component } from 'react';


class Navbar extends Component {
  render() {
    return (
        <nav className="navbar navbar-dark fixed-top bg-dark flex-md-nowrap p-3 shadow">

          <a
            className="navbar-brand col-sm-3 col-md-2 mr-0"
            href=""
            rel="noopener noreferrer"
          >
            <h4 >TFG Decentralized Application</h4>
          </a>
          
          <ul className='navbar-nav px-3'>
              <li className='nav-item text-nowrap d-none d-sm-none d-sm-block'>
                <button type="button" className="btn btn-outline-light " disabled>
                  <small className='text-light'>
                      <small className='h6' id="account">{this.props.account}</small>
                  </small>
                </button>
              </li>
          </ul>
        </nav>
    );
  }
}

export default Navbar;


