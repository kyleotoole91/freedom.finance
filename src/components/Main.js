import React, { Component } from 'react'
import ethLogo from '../eth-logo.png'
import tokenLogo from '../token-logo.png'

let etherAmount

class Main extends Component {

  constructor(props) {
    super(props)
    this.state = {
      tokenAmount: 0
    }
  }

  render() {
    return (
      <div id="content">
        <div className="card mb-4">
          <div className="card-body">
            <form className="mb-3" onSubmit={(event) => {
              event.preventDefault()
              //Purchasing tokens
              etherAmount = window.web3.utils.toWei(etherAmount, 'Ether')
              this.props.buyTokens(etherAmount)
            }}> 
              <div>
                <label className="float-left"><b>ETH Amount</b></label>
                <span className="float-right text-muted">
                  Balance: {this.props.state.etherBalance}
                </span>
              </div>
              <div className="input-group mb-4">
                <input 
                  type="text"
                  onChange={(event) =>{
                    etherAmount = this.input.value.toString()
                    this.setState({
                      tokenAmount: etherAmount * 100
                    })
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
                    <img src={ethLogo} height="32" alt=""/>
                    &nbsp;&nbsp;&nbsp; ETH
                  </div>
                </div>
              </div>
              <span className="float-right text-muted">
                Balance: {this.props.state.tokenBalance}
              </span>
              <div className="input-group mb-2">
                <input 
                  type="text"
                  className="form-control form-control-lg"
                  placeholder="0"
                  value={this.state.tokenAmount}
                  disabled
                /> 
                <div className="input-group-append">
                  <div className="input-group-text">
                    <img src={tokenLogo} height="32" alt=""/>
                    &nbsp;&nbsp; FDM
                  </div>
                </div>
              </div>
              <div className="mb-5">
                <span className="float-left text-muted"> Exchange Rate </span>
                <span className="float-right text-muted"> 1 ETH = 100 FDM </span>
              </div>
              <button type="submit" className="btn btn-primary btn-block btn-lg">Swap</button>
            </form>
          </div>  
        </div> 
      </div>
    );
  }
}

export default Main;
