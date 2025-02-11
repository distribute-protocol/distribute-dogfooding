import React from 'react'
import { connect } from 'react-redux'
import ClaimComponent from '../../components/project/3Claim'
import ButtonClaimTask from '../../contractComponents/stage3/ClaimTask'
import ButtonTaskComplete from '../../contractComponents/stage3/TaskComplete'
import { Button } from 'antd'
import { web3, P } from '../../utilities/blockchain'
const ButtonGroup = Button.Group

class ClaimProject extends React.Component {
  constructor () {
    super()
    this.state = {
      tasks: [],
      nextDeadline: ''
    }
  }

  componentWillMount () {
    this.getNextDeadline()
  }

  async getNextDeadline () {
    let nextDeadline = await P.at(this.props.address).nextDeadline() * 1000
    this.setState({nextDeadline: new Date(parseInt(nextDeadline))})
  }

  render () {
    let tasks
    if (this.props.project.taskList !== null && typeof this.props.project.tasks !== 'undefined') {
      let reputationCost = this.props.project.reputationCost
      let weiCost = Math.ceil(this.props.project.weiCost / 1.05)
      tasks = JSON.parse(this.props.project.taskList).map((task, i) => {
        let weiReward = Math.floor(weiCost * task.percentage / 100)
        return {
          key: i,
          description: task.description,
          ethReward: `${parseFloat(web3.fromWei(weiReward, 'ether')).toFixed(5)} ETH`,
          usdReward: `$${parseFloat(this.props.ethPrice * web3.fromWei(weiReward, 'ether')).toFixed(2)}`,
          repClaim: typeof reputationCost !== 'undefined' && typeof weiCost !== 'undefined' && typeof weiReward !== 'undefined' ? `${Math.floor(reputationCost * weiReward / weiCost)} rep` : '',
          buttons: <ButtonGroup>
            <ButtonClaimTask
              user={this.props.user}
              i={i}
              address={this.props.address}
            />
            <ButtonTaskComplete
              user={this.props.user}
              i={i}
              address={this.props.address}
            />
          </ButtonGroup>
        }
      })
    } else {
      tasks = []
    }

    return (
      <ClaimComponent
        name={this.props.project.name}
        user={this.props.user}
        address={this.props.address}
        photo={this.props.project.photo}
        summary={this.props.project.summary}
        location={this.props.project.location}
        cost={web3.fromWei(Math.ceil(this.props.project.weiCost / 1.05), 'ether')}
        reputationCost={this.props.project.reputationCost}
        date={this.state.nextDeadline}
        tasks={tasks}
      />
    )
  }
}

const mapStateToProps = (state, ownProps) => {
  return {
    project: state.projects[3][ownProps.address]
  }
}

export default connect(mapStateToProps)(ClaimProject)
