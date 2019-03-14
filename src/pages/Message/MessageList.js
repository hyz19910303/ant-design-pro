import React, { Component, Fragment } from 'react';
import { connect } from 'dva';
import { Form, Card, Select, List, Tag, Icon, Row, Col, Button,Modal,Input,message,Radio } from 'antd';
import { FormattedMessage } from 'umi/locale';
import { findDOMNode } from 'react-dom';

import TagSelect from '@/components/TagSelect';
import StandardFormRow from '@/components/StandardFormRow';
import MessageListContent from '@/components/MessageListContent';
import PageHeaderWrapper from '@/components/PageHeaderWrapper';
import styles from './MessageList.less';

const { Option } = Select;
const FormItem = Form.Item;
const RadioButton = Radio.Button;
const RadioGroup = Radio.Group;
const SelectOption = Select.Option;
const { Search, TextArea } = Input;

const pageSize = 5;

@connect(({ messagelist,user, loading }) => ({
  messagelist,
  currentUser: user.currentUser,
  loading: loading.models.messagelist,
}))
@Form.create()
class MessageList extends Component {
  
  state = { 
    visible: false, 
    done: false,
    rolelist:[],
    targets:[],
    msgTypeVal:'message',
    msgStateVal:undefined,
    confirmLoading:false,
    initLoading:true,
    loading: false,
    current:undefined,
  };

  formLayout = {
    labelCol: { span: 7 },
    wrapperCol: { span: 13 },
  };

  componentDidMount() {
    const { dispatch,messagelist:{ pageNum,pageSize} } = this.props;
    dispatch({
      type: 'messagelist/fetch',
      payload: {
        pageNum,
        pageSize,
      },
    });
  }

  fetchMore = () => {
    const { dispatch,messagelist:{ pageNum,pageSize} } = this.props;
    dispatch({
      type: 'messagelist/fetch',
      payload: {
        pageNum,
        pageSize,
      },
    });
  };

  showModal = () => {
    this.setState({
      visible: true,
      current: undefined,
    });
    this.getRoleList(null);
  };

  showEditModal = item => {
    this.setState({
      visible: true,
      current: item,
    });
    this.getRoleList(item.id);
  };

  getRoleList =(id)=>{
    const { dispatch} =this.props;
    dispatch({
       type: 'messagelist/fetchTargets',
       payload:{
         id:id
       },
       callback:(response)=>{
          if(response.success){
            const {data:{targets,allRoles} } = response;
            this.setState({
              rolelist:allRoles,
              targets:targets,
            });
          }
       }
    });
  }

  handleDone = () => {
    setTimeout(() => this.addBtn.blur(), 0);
    this.setState({
      done: false,
      visible: false,
    });
  };

  handleCancel = () => {
    setTimeout(() => this.addBtn.blur(), 0);
    this.setState({
      visible: false,
    });
  };

  handleSubmit = e => {
    e.preventDefault();
    const { dispatch, form,currentUser,messagelist } = this.props;
    const { current } = this.state;
    const id = current ? current.id : undefined;    
    setTimeout(() => this.addBtn.blur(), 0);
    this.setState({confirmLoading:true});
    form.validateFields((err, fieldsValue) => {
      if (err){
        this.setState({confirmLoading:false});
        return;
      } 
      dispatch({
        type: 'messagelist/submit',
        payload: { id,
          issuer: currentUser.real_name?currentUser.real_name:currentUser.user_name,
          ...fieldsValue 
        },
        callback:(response)=>{
          this.setState({
              confirmLoading:false,
          });
          if(response.success){
            message.success('发布成功');
            this.setState({
              visible:false,
            });
          }else{
            message.success('发布失败:'+response.message);
          }
        }
      });
    });
  };

  showDeleteModal=(currentItem,index)=>{
    Modal.confirm({
      title: '删除消息',
      content: '确定删除该消息吗？',
      okText: '确认',
      cancelText: '取消',
      onOk: () => this.deleteItem(currentItem,index),
    });
  }

  deleteItem = (item,index) => {
    const { dispatch } = this.props;    
    dispatch({
      type: 'messagelist/delete',
      payload: { ...item },
      callback:(response)=>{
        if(response.success){
          let messagelist=this.props.messagelist;
          messagelist.list.splice(index,1)
          message.success('删除成功');
        }else{
          message.error('删除失败:'+response.message);
        }
      }
    });
  };

  changeMsgType=(radio)=>{
    this.setState({
      msgTypeVal:radio.target.value
    });
  }

  changeMsgState=(radio)=>{
    //radio.preventDefault;
    this.setState({
      msgStateVal:radio.target.value
    });
  }

  render() {
    const {
      form,
      messagelist: { list,data,pageSize },
      loading,
    } = this.props;
    const { getFieldDecorator } = form;

    const { visible, done, current = {},rolelist,targets,confirmLoading,initLoading } = this.state;
    let {msgTypeVal,msgStateVal}= this.state;
    const IconText = ({ type, text }) => (
      <span>
        <Icon type={type} style={{ marginRight: 8 }} />
        {text}
      </span>
    );

    const Tags=(props)=>{
      const {state ,msg_type,extra}=props;
      let stateName='';
      let stateColor='green';
      let typeName='';
      let typeColor='cyan';
      if('doing'==state){
        stateName='进行中'
      }else if('urgent'==state){
        stateName='紧急';
        stateColor='red';
      }else if('todo'==state){
        stateName='待办';
      }
      if('event'==msg_type){
        typeName='事件';
        typeColor='red';
      }else if('notification'==msg_type){
        typeName='通知';
        typeColor='blue'
      }else if('message'==msg_type){
        typeName='消息'
      }
      return (<span>
                {typeName?<Tag color={typeColor}>{typeName}</Tag>:null}
                {stateName?<Tag color={stateColor}>{stateName}</Tag>:null}
                {extra?<Tag color='red'>{extra}</Tag>:null}
              </span>);
    }


    const modalFooter = { okText: '保存', onOk: this.handleSubmit, onCancel: this.handleCancel };

    const formItemLayout = {
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 24 },
        md: { span: 12 },
      },
    };

    const getModalContent = () => {
      if(current.msg_type){
        msgTypeVal=current.msg_type;
      }
      msgStateVal=current.state?current.state:msgStateVal;
      return (
        <Form onSubmit={this.handleSubmit}>
          <FormItem label="类型" {...this.formLayout}>
            {getFieldDecorator('msg_type', {
              rules: [{ required: true, message: '请选择' }],
              valuePropName:'checked',
              initialValue:msgTypeVal,
            })(
              <RadioGroup defaultValue={msgTypeVal} name='msg_type' onChange={(v)=>this.changeMsgType(v)} >
                  <Radio value={'message'}>消息</Radio>
                  <Radio value={'notification'}>通知</Radio>
                  <Radio value={'event'}>事件</Radio>
              </RadioGroup>
            )}
          </FormItem>
          {msgTypeVal=='event'?(
            <FormItem label="状态" {...this.formLayout}>
            {getFieldDecorator('state', {
              rules: [{ required: true, message: '请选择' }],
              valuePropName:'checked',
              initialValue:msgStateVal?msgStateVal:'todo',
            })(
              <RadioGroup name='state' defaultValue={msgStateVal?msgStateVal:'todo'} onChange={(v)=>this.changeMsgState(v)} >
                  <Radio value={'todo'}>待办</Radio>
                  <Radio value={'urgent'}>紧急</Radio>
                  <Radio value={'doing'}>进行中</Radio>
              </RadioGroup>
              )}
          </FormItem>
          ):null}
          <FormItem label="标题" {...this.formLayout}>
            {getFieldDecorator('title', {
              rules: [{ required: true, message: '请输入标题' }],
              initialValue: current.title,
            })(<Input placeholder="请输入标题" />)}
          </FormItem>
          <FormItem label="内容" {...this.formLayout}>
            {getFieldDecorator('content', {
              rules: [{ required: false, message: '字符最大不超过100',max:100}],
              initialValue: current.content,
            })( <TextArea rows={3} placeholder="输入内容" />)}
          </FormItem>
          <FormItem label="接受角色" {...this.formLayout}>
            {getFieldDecorator('targets', {
              rules: [{ required: true, message: '请选择接受角色' }],
              initialValue: targets,
            })(
              <Select mode="multiple" placeholder="请选择">
                {rolelist.map(role => (
                  <Select.Option key={role.id} value={role.id}>
                    {role.role_name}
                  </Select.Option>
                ))}
              </Select>
            )}
          </FormItem>
          {msgTypeVal=='event'?(
            <FormItem {...this.formLayout} label="描述">
            {getFieldDecorator('extra', {
              rules: [{required: true, message: '请输入不超过六个字符的描述！', max: 6 }],
              initialValue: current.extra,
            })(<TextArea rows={2} placeholder="请输入该信息状态的描述（如紧急）" />)}
          </FormItem>
          ):null}
        </Form>
      );
    };
    

    const loadMore =
      data.length >= pageSize ? (
        <div style={{ textAlign: 'center', marginTop: 16 }}>
          <Button onClick={this.fetchMore} style={{ paddingLeft: 48, paddingRight: 48 }}>
            {loading ? (
              <span>
                <Icon type="loading" /> 加载中...
              </span>
            ) : (
              '加载更多'
            )}
          </Button>
        </div>
      ) : null;

    return (
      <Fragment>
        <PageHeaderWrapper title="消息列表">
        <Card
          style={{ marginTop: 24 }}
          bordered={false}
          bodyStyle={{ padding: '8px 32px 32px 32px' }}
        >  
           <Button
              type="dashed"
              style={{ width: '100%', marginBottom: 8 }}
              icon="plus"
              onClick={this.showModal}
              ref={component => {
                /* eslint-disable */
                this.addBtn = findDOMNode(component);
                /* eslint-enable */
              }}
            >
              添加
            </Button>
          <List
            size="large"
            loading={list.length === 0 ? loading : false}
            rowKey="id"
            itemLayout="vertical"
            loadMore={loadMore}
            dataSource={list}
            renderItem={(item,index) => (
              <List.Item
                key={item.id}
                actions={[
                  <Button onClick={(e)=>this.showEditModal(item,index)} size='small' type='primary' icon='edit'>编辑</Button>,
                  <Button onClick={(e)=>this.showDeleteModal(item,index)} size='small' type='danger' icon='delete'>删除</Button>,
                ]}
                extra={<div className={styles.listItemExtra} />}
              >
                <List.Item.Meta
                  title={
                    <a className={styles.listItemMetaTitle} href={item.href}>
                      {item.title}
                    </a>
                  }
                  description={
                    <Tags {...item}/>
                  }
                />
                <MessageListContent data={item} />
              </List.Item>
            )}
          />
        </Card>
        <Modal
          title={done ? null : `${current ? '编辑' : '添加'}消息`}
          width={640}
          destroyOnClose
          visible={visible}
          confirmLoading={confirmLoading}
          {...modalFooter}
        >
          {getModalContent()}
        </Modal>
        </PageHeaderWrapper>
      </Fragment>
    );
  }
}

export default MessageList;
