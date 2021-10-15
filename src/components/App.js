import React, { Component } from 'react'
import './App.css'
import Navbar from './Navbar'
import Token from '../abis/Token.json'
import FreedomFinance from '../abis/FreedomFinance.json'
const Web3 = require('web3')

const noWeb3Msg = 'Please install a Web3 provider (MetaMask)';
const connectedToWeb3Msg = 'Connected to Web3 wallet: ';
let networkId = 0;

class App extends Component {

  constructor(props) {
    super(props)
    this.state = {
      account: '',
      accountBalance: '0',
      etherBalance: '0',
      tokenBalance: '0'
    }
  }
  
  async componentWillMount() {
    await this.loadWeb3()
    await this.loadWeb3Data()
    await this.loadTokenContract()
    await this.loadDappContract()
  }

  async loadWeb3() {
    if (window.ethereum) {
      await window.ethereum
                    .request({
                      method: 'eth_requestAccounts'
                    })
                    .then((result) => {
                      window.web3 = new Web3(window.ethereum)
                      console.log(connectedToWeb3Msg + result)
                    })
                    .catch((error) => {
                      window.alert(noWeb3Msg)
                    });
      console.log(window.web3)
    } else {
      window.alert(noWeb3Msg)
    }
  }

  async loadWeb3Data() {
    networkId = await window.web3.eth.net.getId() //5777 for Ganache
    const accounts = await window.web3.eth.getAccounts()
    const accountBalance = await window.web3.eth.getBalance(accounts[0])
    const etherBalance = window.web3.utils.fromWei(accountBalance, 'ether')
    this.setState({ account: accounts[0],
                    etherBalance: accountBalance})
    console.log(this.state.account)
    this.setState({ accountBalance,
                    etherBalance })
    console.log(this.state.accountBalance)
  }

  async loadTokenContract() {
    const tokenData = Token.networks[networkId]
    if (tokenData) {
      const tokenContract = new window.web3.eth.Contract(Token.abi, Token.networks[networkId].address)
      this.setState({ tokenContract })
      console.log(this.state.tokenContract)
      let tokenBalanceWei = await tokenContract.methods.balanceOf(this.state.account).call()
      let tokenBalance = window.web3.utils.fromWei(tokenBalanceWei, 'ether')
      this.setState({ tokenBalance: tokenBalance })
    } else {
      window.alert('Unable to obtain Token smart contract from network')
    } 
  }

  async loadDappContract() {
    const dAppData = FreedomFinance.networks[networkId]
    if (dAppData) {
      const dAppContract = new window.web3.eth.Contract(FreedomFinance.abi, FreedomFinance.networks[networkId].address)
      this.setState({ dAppContract })
      console.log(this.state.dAppContract)
    } else {
      window.alert('Unable to obtain dApp smart contract from network')
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
                <h3>Your Token balance is : {this.state.tokenBalance}</h3>
              </div>
            </main>
          </div>
        </div>
      </div>
    );
  }
}

export default App;
