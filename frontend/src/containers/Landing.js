import React from 'react'
import { connect } from 'react-redux'
import { eth } from '../utilities/blockchain'
import uport from '../utilities/uport'
import { Button } from 'antd'
import { loginUser } from '../actions/userActions'
import { getNetworkStatus } from '../actions/networkActions'

class Landing extends React.Component {
  constructor () {
    super()
    this.state = {
      metamask: false
    }
    this.getUport = this.getUport.bind(this)
    this.checkMetamaskConnected = this.checkMetamaskConnected.bind(this)
    this.checkMetamask = this.checkMetamask.bind(this)
  }

  componentWillMount () {
    this.checkMetamaskConnected()
  }

  checkMetamaskConnected () {
    if (!this.state.metamask && window.ethereum._metamask.isEnabled()) {
      this.checkMetamask()
    } else if (!window.ethereum._metamask.isEnabled()) {
      window.ethereum.enable()
    }
    setTimeout(() => {
      this.checkMetamaskConnected()
    }, 1000)
  }

  checkMetamask () {
    eth.getAccounts(async (err, accounts) => {
      if (!err) {
        this.setState({metamask: accounts.length})
      }
    })
  }

  getUport () {
    if (this.state.metamask) {
      const reqObj = {
        requested: ['name', 'avatar', 'country'],
        notifications: true
      } 
      uport.requestDisclosure(reqObj)
      uport.onResponse('disclosureReq').then(res => { 
        this.props.getNetworkStatus()
        this.props.loginUser(res.payload)
      })
    } else {
      alert('please consent to metamask')
    }
  }

  render () {
    return (
      <div style={{padding: 30}}>
        <h1 className='display-3'>Welcome to Distribute</h1>
        <hr className='my-2' />
        <p>You need a uPort to continue. You can download the mobile app with one of the links below.</p>
        <p>Upon login, you will be prompted to receive your first reputation points.</p>
        <span>
          <a href='https://itunes.apple.com/us/app/uport-identity-wallet-ethereum/id1123434510?mt=8'>uPort iOS</a>
          <span> | </span>
          <a href='https://play.google.com/store/apps/details?id=com.uportMobile'>uPort Android</a>
        </span>

        <p className='lead' style={{marginTop: 30, alignItems: 'center'}}>
          <Button color='primary' onClick={this.getUport}>
            Connect with uPort
          </Button>
        </p>
      </div>
    )
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    loginUser: (credentials) => dispatch(loginUser(credentials)),
    getNetworkStatus: () => dispatch(getNetworkStatus())
  }
}
export default connect(null, mapDispatchToProps)(Landing)
