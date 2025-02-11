import React from 'react'
// import { Button } from 'antd'
import Sidebar from '../components/shared/Sidebar'
import Project from './project/4Validate'
// import fastforward from '../utilities/fastforward'
import { connect } from 'react-redux'
import { eth } from '../utilities/blockchain'
import price from 'crypto-price'
import { getProjects } from '../actions/projectActions'
import gql from 'graphql-tag'

let projQuery = gql`
  { allProjectsinState(state: 4){
      address,
      id,
      ipfsHash,
      location,
      name,
      tasks {
        id,
        address,
        claimer {
          account
        },
        claimed,
        claimedAt,
        complete,
        description,
        index,
        weighting,
        validationRewardClaimable,
        workerRewardClaimable,
        workerRewarded
      }
      nextDeadline,
      photo,
      reputationBalance,
      reputationCost,
      summary,
      state,
      tokenBalance,
      weiBal,
      weiCost
    }
  }`

class Validate extends React.Component {
  constructor () {
    super()
    this.state = {
      projects: []
    }
    // this.fastForward = this.fastForward.bind(this)
  }

  componentWillMount () {
    this.getProjects()
    this.setEthPrice()
  }

  async getProjects () {
    eth.getAccounts(async (err, result) => {
      if (!err) {
        if (result.length) {
          this.props.getProjects()
          this.setState({user: result[0]})
        } else {
          console.log('Please Unlock MetaMask')
        }
      }
    })
  }

  async setEthPrice () {
    let ethPrice = await price.getCryptoPrice('USD', 'ETH')
    this.setState({
      ethPrice: ethPrice.price
    })
  }

  // async fastForward () {
  //   await fastforward(7 * 24 * 60 * 60)
  // }

  render () {
    const projects = typeof this.props.projects !== `undefined`
      ? Object.keys(this.props.projects).map((address, i) => {
        return <Project
          key={i}
          index={i}
          address={address}
          project={this.props.projects[address]}
          user={this.state.user}
          ethPrice={this.state.ethPrice}
        />
      })
      : []

    return (
      <div>
        <Sidebar />
        <div style={{marginLeft: 200, marginBottom: 30}}>
          <header className='App-header'>
            <h3>Validate Tasks</h3>
            { /* <Button type='danger' onClick={this.fastForward}>fast forward 1 week</Button>
            <h6>ONLY DO THIS IF YOU ARE READY TO MOVE EVERY PROJECT TO THE NEXT STATE</h6>
            <h6>IF A PROJECT HAS UNCLAIMED TASKS IT WILL FAIL AND YOU WILL LOSE YOUR STAKED TOKENS</h6> */ }
          </header>
          <div style={{paddingLeft: '30px', paddingRight: '30px'}}>
            {projects}
          </div>
        </div>
      </div>
    )
  }
}

const mapStateToProps = (state, ownProps) => {
  return {
    projects: state.projects[4]
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    getProjects: () => dispatch(getProjects(4, projQuery))
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Validate)
