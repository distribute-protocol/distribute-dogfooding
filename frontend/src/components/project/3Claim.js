import React from 'react'
import ProjectHeader from '../shared/ProjectHeader'
import ButtonSubmitFinalTaskList from '../../contractComponents/stage3/SubmitFinalTaskList'
import ButtonCheckValidate from '../../contractComponents/stage3/CheckValidate'
import { Table } from 'antd'

const columns = [{
  title: 'Task Description',
  dataIndex: 'description',
  key: 'description'
}, {
  title: 'ETH Reward',
  dataIndex: 'ethReward',
  key: 'ethReward'
}, {
  title: 'Rep to Claim',
  dataIndex: 'repClaim',
  key: 'repClaim'
}, {
  title: 'USD Reward',
  dataIndex: 'usdReward',
  key: 'usdReward'
}, {
  title: '',
  dataIndex: 'buttons',
  key: 'buttons'
}]

export default ({
  name,
  address,
  photo,
  user,
  summary,
  location,
  cost,
  reputationCost,
  date,
  tasks,
  checkValidateStatus
}) => {
  return (
    <div style={{backgroundColor: '#DDE4E5', marginBottom: 30}}>
      <ProjectHeader
        name={name}
        address={address}
        photo={photo}
        summary={summary}
        location={location}
        cost={cost}
        reputationCost={reputationCost}
      />
      <div style={{padding: 10}}>
        <div>
          <div>
            Task Completion Expires: <strong>{typeof date !== 'undefined' ? `${date}` : 'N/A'}</strong>
          </div>
        </div>
        <div style={{display: 'flex', flexDirection: 'column', backgroundColor: '#FCFCFC', marginTop: 30}}>
          <Table dataSource={tasks} columns={columns} pagination={false} />
        </div>
      </div>
      <div style={{margin: 20}}>
        <ButtonSubmitFinalTaskList
          address={address}
          user={user}
        />
        <ButtonCheckValidate
          address={address}
          user={user}
        />
      </div>
    </div>
  )
}
