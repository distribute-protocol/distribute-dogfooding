/* global alert */

import React from 'react'
import { connect } from 'react-redux'
import price from 'crypto-price'
import { eth, web3, dt } from '../utilities/blockchain'
import StatusComponent from '../components/Status'
import { getNetworkStatus } from '../actions/networkActions'
import { getUserStatus } from '../actions/userActions'

class Status extends React.Component {
  constructor () {
    super()
    this.state = {
      tokensToBuy: ''
    }
    this.getNetworkStatus = this.getNetworkStatus.bind(this)
    this.getPriceData = this.getPriceData.bind(this)
  }

  componentWillMount () {
    if (this.props.user.registering === true) {
      eth.getAccounts(async (err, accounts) => {
        if (!err) {
          if (accounts.length) {
            // get user token balance
            this.setState({user: accounts[0]})
          } else {
            alert('Please Unlock MetaMask')
          }
        }
      })
      this.getPriceData()
    } else {
      this.getNetworkStatus()
    }
  }

  componentWillReceiveProps () {
    this.getPriceData()
  }

  async getPriceData () {
    let ethPrice = await price.getCryptoPrice('USD', 'ETH')
    let weiBal = (await dt.weiBal()).toNumber()
    let currentPrice = (await dt.currentPrice()).toNumber()
    this.setState({
      ethPrice: ethPrice.price,
      weiBal,
      currentPrice: web3.fromWei(currentPrice, 'ether')
    })
  }

  getNetworkStatus () {
    this.props.getNetworkStatus()
    this.getPriceData()
    eth.getAccounts(async (err, accounts) => {
      if (!err) {
        if (accounts.length) {
          // get user token balance
          this.props.getUserStatus(accounts[0])
          this.setState({user: accounts[0]})
        } else {
          alert('Please Unlock MetaMask')
        }
      }
    })
  }

  async onChange (val) {
    this.setState({tokensToBuy: val})
    if (val > 0) {
      try {
        let ethRequired, refund
        await dt.weiRequired(val).then(result => {
          ethRequired = web3.fromWei(result.toNumber(), 'ether')
        })
        if (this.props.totalSupply === 0) {
          refund = ethRequired
        } else {
          await dt.currentPrice().then(result => {
            refund = web3.fromWei((result.toNumber() * val), 'ether')
          })
        }
        this.setState({ethToSend: ethRequired, ethToRefund: refund})
      } catch (error) {
        throw new Error(error)
      }
    }
  }

  render () {
    return (
      <StatusComponent
        totalTokenSupply={this.props.network.totalTokens}
        balance={this.props.user.userTokens}
        marketPercentage={this.props.user.userTokens
          ? Math.round(this.props.user.userTokens / this.props.network.totalTokens * 10000) / 100
          : 0}
        ethPool={web3.fromWei(this.state.weiBal, 'ether')}
        capitalEquivalent={this.state.ethPrice
          ? parseFloat(this.state.ethPrice * web3.fromWei(this.state.weiBal, 'ether')).toFixed(2)
          : 0}
        currentPrice={this.state.currentPrice}
        currentPriceUSD={this.state.currentPrice
          ? parseFloat(this.state.currentPrice * web3.fromWei(this.state.weiBal, 'ether')).toFixed(5)
          : 0}
        totalReputationSupply={this.props.network.totalReputation}
        reputationBalance={this.props.user.userReputation}
        ethToSend={typeof this.state.ethToSend === 'undefined'
          ? 'n/a'
          : Math.round(this.state.ethToSend * 100000) / 100000}
        ethToRefund={typeof this.state.ethToRefund === 'undefined'
          ? 'n/a'
          : Math.round(this.state.ethToRefund * 100000) / 100000}
        tokensToBuy={this.state.tokensToBuy}
        user={this.state.user}
        input={
          <input ref={(input) => (this.tokensToBuy = input)}
            placeholder='Number of Tokens'
            onChange={(e) => this.onChange(this.tokensToBuy.value)}
            value={this.state.tokensToBuy}
            type='number'
          />}
      />
    )
  }
}

const mapStateToProps = (state) => {
  return {
    user: state.user || {},
    network: state.network
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    getNetworkStatus: () => dispatch(getNetworkStatus()),
    getUserStatus: (userAccount) => dispatch(getUserStatus(userAccount))
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Status)
