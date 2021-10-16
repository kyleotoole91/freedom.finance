import React, { Component } from 'react'
import './App.css'
import Navbar from './Navbar'
import SellTokens from './BuyTokens'
import Token from '../abis/Token.json'
import FreedomFinance from '../abis/FreedomFinance.json'
const Web3 = require('web3')

const noWeb3Msg = 'Please install a Web3 provider (MetaMask)'
const connectedToWeb3Msg = 'Connected to Web3 wallet: '
let tokenContract = null
let networkId = 0

class App extends Component {

  constructor(props) {
    super(props)
    this.state = {
      account: '',
      accountBalance: '0',
      etherBalance: '0',
      tokenBalance: '0',
      tokenBalanceEx: '0',
      etherBalanceEx: '0',
      loading: true
    }
  }

  buyTokens = (etherAmount) =>{
    this.setState({ loading: true })
    this.state.dAppContract.methods.buyTokens()
                                   .send({ from: this.state.account, value: etherAmount})
                                   .on('transactionHash', (hash) => { 
                                      this.componentWillMount() //reconnect/refresh after purchase dialog
                                    })
  }
  
  async componentWillMount() {
    this.setState({ loading: true })
    await this.loadWeb3()
    this.setState({ loading: false })
  }

  async loadData () {
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
                      this.loadData()
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
      tokenContract = new window.web3.eth.Contract(Token.abi, Token.networks[networkId].address)
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
      let exchangeAdress = FreedomFinance.networks[networkId].address;
      const dAppContract = new window.web3.eth.Contract(FreedomFinance.abi, exchangeAdress)
      let tokenBalanceEx = await this.state.tokenContract.methods.balanceOf(exchangeAdress).call()
      let etherBalanceEx = await window.web3.eth.getBalance(exchangeAdress)
      tokenBalanceEx = window.web3.utils.fromWei(tokenBalanceEx, 'ether') 
      etherBalanceEx = window.web3.utils.fromWei(etherBalanceEx, 'ether')
      this.setState({ dAppContract, tokenBalanceEx, etherBalanceEx })
      console.log(this.state.dAppContract)
      console.log('Exchange address: ' +exchangeAdress)
      console.log('Exchange Ether Balance: ' +this.state.etherBalanceEx)
      console.log('Exchange Token Balance: ' +this.state.tokenBalanceEx)
    } else {
      window.alert('Unable to obtain dApp smart contract from network')
    } 
  }

  render() {
    let content 
    if(this.state.loading) {
      content = <p id="loader" className="text-center">Loading...</p>
    } else {
      content = <SellTokens state={this.state}
                            buyTokens={this.buyTokens}
      />
    }

    return (
      <div>
        <Navbar account={this.state.account} />
        <div className="container-fluid mt-5">
          <div className="row">
            <main role="main" className="col-lg-12 d-flex text-center">
              <div className="content mr-auto ml-auto">
                <h1>Welcome to Freedom Finance!</h1>
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
