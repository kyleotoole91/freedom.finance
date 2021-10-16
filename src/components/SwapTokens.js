import React, { Component } from 'react'
import ethLogo from '../eth-logo.png'
import tokenLogo from '../token-logo.png'
import NumberFormat from 'react-number-format';

let etherAmount
let tokenAmount
const cardRadius = 32

class BuyTokens extends Component {
  constructor(props) {
    super(props)
    this.state = {
      topAmount: 0,
      bottomAmount: 0,
      switched: false
    }
  }
  
  buyTokens(event) {
    if (window.ethereum) {
      event.preventDefault()
      etherAmount = this.input.value.toString()
      etherAmount = window.web3.utils.toWei(etherAmount, 'Ether')
      this.props.buyTokens(etherAmount)
    } 
  }

  sellTokens(event) {
    if (window.ethereum) {
      event.preventDefault()
      etherAmount = this.input.value.toString()
      tokenAmount = window.web3.utils.toWei(tokenAmount, 'Ether')
      this.props.sellTokens(tokenAmount)
    } 
  }

  calcBuyToken(value) {
    return value * 100
  }

  calcSellToken(value) {
    return value / 100
  }

  calcSwap(){
    if(this.state.switched) {
      this.setState({ topAmount: this.input.value,
                      bottomAmount: this.calcSellToken(this.input.value) })   
    } else{
      this.setState({ topAmount: this.input.value,
                      bottomAmount: this.calcBuyToken(this.input.value) }) 
    }
  }
  
  render() {
    let topBalance 
    let topLogo 
    let bottomBalance
    let bottomLogo 
    let topAbbrev
    let bottomAbbrev
    let action

    if(this.state.switched) {
      topBalance = <NumberFormat value={ this.props.state.tokenBalance }thousandSeparator={ true } prefix={ '' }  displayType={ 'text' } />
      topLogo = tokenLogo 
      topAbbrev = <span>&nbsp;&nbsp;FDM</span>   
      action = 'Sell Tokens'
      bottomBalance = <NumberFormat value={ this.props.state.etherBalance }thousandSeparator={ true } prefix={ '' }  displayType={ 'text' } />
      bottomLogo = ethLogo 
      bottomAbbrev = <span>&nbsp;&nbsp;&nbsp;ETH</span> 
    } else {
      topBalance = <NumberFormat value={ this.props.state.etherBalance }thousandSeparator={ true } prefix={ '' }  displayType={ 'text' } />
      topLogo = ethLogo 
      topAbbrev = <span>&nbsp;&nbsp;&nbsp;ETH</span> 
      action = 'Buy Tokens'
      bottomBalance = <NumberFormat value={ this.props.state.tokenBalance }thousandSeparator={ true } prefix={ '' }  displayType={ 'text' } />
      bottomLogo = tokenLogo 
      bottomAbbrev = <span>&nbsp;&nbsp;FDM</span>     
    }

    return (
      <div id="content">
        <div className="card mb-4" style={{ borderTopLeftRadius: cardRadius, 
                                            borderTopRightRadius: cardRadius,
                                            borderBottomLeftRadius: cardRadius, 
                                            borderBottomRightRadius: cardRadius }} >
          <div className="card-body">
            <form className="mb-3" onSubmit={(event) => {
              if(!this.state.switched) {
                this.buyTokens(event)
              }else{
                this.selTokens(event)  
              }
            }}> 
              <div>
                <label className="float-left"><b>{action}</b></label>
                <span className="float-right text-muted">
                  Balance:  {topBalance}
                </span>
              </div>
              <div className="input-group mb-4">
                <input 
                  type="text"
                  onChange={(event) =>{
                    this.calcSwap()
                  }}
                  ref={(input) => {
                    this.input = input  
                  }}
                  className="form-control form-control-lg"
                  placeholder="0"
                  required
                />
                <div className="input-group-append">
                  <div className="input-group-text">
                    <img src={topLogo} height="32" alt=""/>
                    {topAbbrev}
                  </div>
                </div>
              </div>
              <div style={{cursor: 'pointer'}} onClick={(event) => {
                        if(!this.state.switched) {
                          this.setState({ switched: true,
                                          bottomAmount: this.calcSellToken(this.input.value) })   
                        } else{           
                          this.setState({switched: false,
                                          bottomAmount: this.calcBuyToken(this.input.value) }) 
                        }
                      }}>
                <span>&#8595;</span>
              </div>
              <span className="float-right text-muted">
                Balance: {bottomBalance} 
              </span>
              <div className="input-group mb-2">
                <input 
                  type="text"
                  className="form-control form-control-lg"
                  placeholder="0"
                  value={this.state.bottomAmount}
                  disabled
                /> 
                <div className="input-group-append">
                  <div className="input-group-text">
                    <img src={bottomLogo} height="32" alt=""/>
                    {bottomAbbrev}
                  </div>
                </div>
              </div>
              <div className="mb-5">
                <span className="float-left text-muted"> Exchange Balance (FDM) </span>
                <span className="float-right text-muted"> 
                  <NumberFormat value={ this.props.state.tokenBalanceEx }thousandSeparator={ true } prefix={ '' }  displayType={ 'text' } />
                </span>
              </div>
              <div className="mb-5">
                <span className="float-left text-muted"> Exchange Rate </span>
                <span className="float-right text-muted"> 1 ETH = 100 FDM </span>
              </div>
              <button disabled={this.props.state.account === ''} type="submit" className="btn btn-primary btn-block btn-lg">Swap</button>
            </form>
          </div>  
        </div> 
      </div>
    );
  }
}

export default BuyTokens;
