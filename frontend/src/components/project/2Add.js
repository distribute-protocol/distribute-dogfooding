import React from 'react'
import { Table } from 'antd'
import ProjectHeader from '../shared/ProjectHeader'
import ButtonSubmitTaskList from '../../contractComponents/stage2/SubmitTaskList'
import ButtonCheckActive from '../../contractComponents/stage2/CheckActive'
import ButtonRewardProposer from '../../contractComponents/stage2/RewardProposer'
import DraggableTable from '../shared/DraggableTable'

const columns = [{
  title: 'Task Description',
  dataIndex: 'description',
  key: 'description'
}, {
  title: 'Percentage',
  dataIndex: 'percentage',
  key: 'percentage'
}, {
  title: 'ETH Reward',
  dataIndex: 'ethReward',
  key: 'ethReward'
}, {
  title: 'USD Reward',
  dataIndex: 'usdReward',
  key: 'usdReward'
}, {
  title: '',
  dataIndex: 'deleteTask',
  key: 'deleteTask'
}]

const submissionColumns = [{
  title: 'Submitter',
  dataIndex: 'submitter',
  key: 'submitter'
}, {
  title: 'Submission',
  dataIndex: 'submission',
  key: 'submission'
}, {
  title: 'Weighting',
  dataIndex: 'weighting',
  key: 'weighting'
}]

export default ({
  name,
  address,
  photo,
  summary,
  location,
  cost,
  reputationCost,
  date,
  submission,
  tasks,
  submissionTasks,
  moveRow,
  user
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
      <div style={{marginLeft: 10}}>
        <ButtonRewardProposer
          user={user}
          address={address}
        />
      </div>
      <div style={{padding: 10}}>
        <div>
          <div>
            Task Submission Expires: <strong> {typeof date !== 'undefined' ? `${date}` : 'N/A'}</strong>
          </div>
          {submission}
        </div>
        <div style={{display: 'flex', flexDirection: 'column', backgroundColor: '#FCFCFC', marginTop: 30}}>
          <DraggableTable address={address} data={tasks} columns={columns} moveRow={moveRow} />
        </div>
        <ButtonSubmitTaskList
          user={user}
          address={address}
        />
        <div>
          <div style={{display: 'flex', flexDirection: 'column', backgroundColor: '#FCFCFC', marginTop: 30}}>
            <Table style={{backgroundColor: '#ffffff'}} dataSource={submissionTasks} columns={submissionColumns} pagination={false} />
          </div>
        </div>
        <ButtonCheckActive
          user={user}
          address={address}
        />
      </div>
    </div>
  )
}
