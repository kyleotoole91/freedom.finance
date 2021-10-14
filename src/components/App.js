import React, { Component } from 'react'
import './App.css'
const Web3 = require('web3')

class App extends Component {

  async loadWeb3() {
    if (window.ethereum) {
      await window.ethereum
                    .request({
                      method: 'eth_requestAccounts'
                    })
                    .then((result) => {
                      // The result varies by RPC method.
                      // For example, this method will return a transaction hash hexadecimal string on success.
                      console.log('Connected to wallet: ' + result)
                    })
                    .catch((error) => {
                      window.alert('Please install MetaMask')
                    });
      window.web3 = new Web3(window.ethereum)
    } else {
      window.alert('Please install MetaMask')
    }
  }

  async componentWillMount() {
    await this.loadWeb3()
    console.log(window.web3)
  }
  

  render() {
    return (
      <div>
        <nav className="navbar navbar-dark fixed-top bg-dark flex-md-nowrap p-0 shadow">
          <a
            className="navbar-brand col-sm-3 col-md-2 mr-0"
            href="http://www.dappuniversity.com/bootcamp"
            target="_blank"
            rel="noopener noreferrer"
          >
            Dapp University
          </a>
        </nav>
        <div className="container-fluid mt-5">
          <div className="row">
            <main role="main" className="col-lg-12 d-flex text-center">
              <div className="content mr-auto ml-auto">
                <h1>Hello, World</h1>
              </div>
            </main>
          </div>
        </div>
      </div>
    );
  }
}

export default App;
