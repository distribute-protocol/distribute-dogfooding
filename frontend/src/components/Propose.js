import React from 'react'
import { Button, Form, Input, DatePicker, Upload, Icon } from 'antd'
const { TextArea } = Input
const FormItem = Form.Item

const ProposeForm = (props) => {
  let {
    handlePhotoChange,
    imageUrl,
    cost,
    reputationCost,
    loading,
    handlePriceChange,
    handleLocationChange,
    proposeProject,
    map
  } = props
  let submitHandler = (type) => {
    proposeProject(type, props.form.getFieldsValue())
    props.form.resetFields()
  }
  const uploadButton = (
    <div>
      {loading
        ? (<Icon type={'loading'} />)
        : (<div>
          <Icon type={'plus'} />
          <div className='ant-upload-text'>Upload</div>
        </div>)
      }
    </div>
  )
  const { getFieldDecorator } = props.form
  return (
    <div>
      <div style={{marginLeft: 200, marginBottom: 100}}>
        <header className='App-header'>
          <h3 className='App-title2'>Propose Project</h3>
        </header>
        <div style={{display: 'flex', flexDirection: 'column', marginLeft: 100, marginRight: 200}}>
          <Form layout='horizontal'>
            <FormItem label='Name'>
              {getFieldDecorator('name')(<Input placeholder='Project Name' />)}
            </FormItem>
            <FormItem label='Photo'>
              <Upload
                name='avatar'
                listType='picture-card'
                className='avatar-uploader'
                showUploadList={false}
                // action='//jsonplaceholder.typicode.com/posts/'
                // beforeUpload={beforeUpload}
                onChange={handlePhotoChange}
              >
                {imageUrl
                  ? <img style={{width: 200, height: 200}} src={imageUrl} alt='' />
                  : uploadButton}
              </Upload>
            </FormItem>
            <FormItem label='Summary'>
              {getFieldDecorator('summary')(<TextArea rows={4} type='textarea' placeholder='Project Summary' />)}
            </FormItem>
            <FormItem label='Location'>
              {getFieldDecorator('location')(<Input placeholder='Project Location' onChange={handleLocationChange} />)}
            </FormItem>
            {map}
            <FormItem label='Cost'>
              {getFieldDecorator('cost')(<Input placeholder='ETH' type='number' onChange={handlePriceChange} />)}
            </FormItem>
            <FormItem label='Staking End Date'>
              {getFieldDecorator('date')(<DatePicker />)}
            </FormItem>
            <div style={{marginTop: 20}}>
              <h4>{`You have to deposit ${cost} tokens`}</h4>
            </div>
            <div style={{marginTop: 20}}>
              <h4>{`You have to deposit ${reputationCost} reputation`}</h4>
            </div>
            <div style={{marginTop: 20}}>
              <Button type='info' onClick={() => submitHandler('tokens')} style={{marginLeft: 10}}>
                Propose Project (Tokens)
              </Button>
            </div>
            <div style={{marginTop: 20}}>
              <Button type='info' onClick={() => submitHandler('reputation')} style={{marginLeft: 10}}>
                Propose Project (Reputation)
              </Button>
            </div>
          </Form>
        </div>
      </div>
    </div>
  )
}

export default Form.create()(ProposeForm)
