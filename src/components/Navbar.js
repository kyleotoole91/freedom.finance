import Identicon from 'identicon.js';
import React, { Component } from 'react'

class Navbar extends Component {

  render() {
    return (
      <div>
        <nav className="navbar navbar-dark fixed-top bg-dark flex-md-nowrap p-0 shadow">
          <a
            className="navbar-bran col-sm-3 col-md-2 mr-0"
            href="./"
            rel="nooponer noreferrer"
          >
            Freedom Finance
          </a>
          <ul className="navbar-nav px-3">
            <li className="nav-item text-nowrap d-name d-sm-none d-sm-block">
              <small className="text-secondary">
                <small id="accounnt" >{this.props.account}</small>
              </small>
              { this.props.account
                ? <img
                  className="m-2"
                  width='30'
                  height='30'
                  src={`data:image/png;base64,${new Identicon(this.props.account, 30).toString()}`}
                  alt=""
                  />
                  : <span />
              }
            </li>
          </ul>
        </nav>
      </div>
    );
  }
}

export default Navbar;
