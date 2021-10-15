import React, { Component } from 'react'
import './App.css'
import Navbar from './Navbar'
import Token from '../abis/Token.json'
//import FreedomFinance from '../abis/FreedomFinance.json'
const Web3 = require('web3')

const noWeb3Msg = 'Please install a Web3 provider (MetaMask)';
const connectedToWeb3Msg = 'Connected to Web3 wallet: ';

class App extends Component {

  constructor(props) {
    super(props)
    this.state = {
      account: '',
      accountBalance: '0',
      etherBalance: '0'
    }
  }
  
  async componentWillMount() {
    await this.loadWeb3()
    await this.loadWeb3Data()
  }

  async loadWeb3() {
    if (window.ethereum) {
      await window.ethereum
                    .request({
                      method: 'eth_requestAccounts'
                    })
                    .then((result) => {
                      console.log(connectedToWeb3Msg + result)
                    })
                    .catch((error) => {
                      window.alert(noWeb3Msg)
                    });
      window.web3 = new Web3(window.ethereum)
      console.log(window.web3)
    } else {
      window.alert(noWeb3Msg)
    }
  }

  async loadWeb3Data() {
    const web3 = window.web3
    const accounts = await web3.eth.getAccounts()
    const accountBalance = await web3.eth.getBalance(accounts[0])
    const etherBalance = web3.utils.fromWei(accountBalance, 'ether')

    this.setState({ account: accounts[0],
                    etherBalance: accountBalance})
    console.log(this.state.account)

    this.setState({ accountBalance,
                    etherBalance })
    console.log(this.state.accountBalance)
    
    const networkId = await web3.eth.net.getId()
    const tokenData = Token.networks[networkId]
    if (tokenData) {
      const token = new web3.eth.Contract(Token.abi, Token.networks[networkId].address)
      console.log(Token)
    } else {
      window.alert('Unable to obtain Token smart contract from network')
    }
  }

  render() {
    return (
      <div>
        <Navbar account={this.state.account} />
        <div className="container-fluid mt-5">
          <div className="row">
            <main role="main" className="col-lg-12 d-flex text-center">
              <div className="content mr-auto ml-auto">
                <h1>Welcome to Freedom Finance!</h1>
                <h3>Your Ether balance is : {this.state.etherBalance}</h3>
              </div>
            </main>
          </div>
        </div>
      </div>
    );
  }
}

export default App;
