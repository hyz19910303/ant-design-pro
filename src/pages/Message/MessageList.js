import React, { PureComponent } from 'react';
import { findDOMNode } from 'react-dom';
import moment from 'moment';
import { connect } from 'dva';
import {
  List,
  Card,
  Row,
  Col,
  Radio,
  Input,
  Progress,
  Button,
  Icon,
  Dropdown,
  Menu,
  Avatar,
  Modal,
  Form,
  DatePicker,
  Select,
  message,
} from 'antd';

import PageHeaderWrapper from '@/components/PageHeaderWrapper';
import Result from '@/components/Result';

import styles from './MessageList.less';

const FormItem = Form.Item;
const RadioButton = Radio.Button;
const RadioGroup = Radio.Group;
const SelectOption = Select.Option;
const { Search, TextArea } = Input;

@connect(({ messagelist,user, loading }) => ({
  messagelist,
  currentUser: user.currentUser,
  loading: loading.models.messagelist,
}))
@Form.create()
class MessageList extends PureComponent {
  state = { 
    visible: false, 
    done: false,
    rolelist:[],
    targets:[],
    msgTypeVal:'message',
    msgStateVal:'todo',
    confirmLoading:false,
    initLoading:true,
    loading: false,
  };

  formLayout = {
    labelCol: { span: 7 },
    wrapperCol: { span: 13 },
  };

  componentDidMount() {
    const { dispatch } = this.props;
    const { count } =this.state;
    dispatch({
      type: 'messagelist/fetch',
      callback:response=>{
        this.setState({
          initLoading:false,
        });
      }
    });
  }

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
    const id = current ? current.id : '';    
    setTimeout(() => this.addBtn.blur(), 0);
    form.validateFields((err, fieldsValue) => {
      if (err) return;
      debugger
      dispatch({
        type: 'messagelist/submit',
        payload: { id,
          issuer: currentUser.real_name?currentUser.real_name:currentUser.user_name,
          ...fieldsValue 
        },
        callback:(response)=>{
          if(response.success){
            this.setState({
              confirmLoading:false,
              done: true,
            });
            //messagelist.list.push(response.data[0]);
          }
        }
      });
    });
  };

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

  changeMsgType=(val,option)=>{
    //radio.preventDefault;
    this.setState({
      msgTypeVal:val
    });
  }

  changeMsgState=(val,option)=>{
    //radio.preventDefault;
    this.setState({
      msgStateVal:val
    });
  }

  onLoadMore = () => {
    const { dispatch,messagelist:{pageNum,pageSize}} =this.props;
    this.setState({
      loading: true,
    });
    dispatch({
      type:'messagelist/fetch',
      payload:{
        pageNum:pageNum,
        pageSize:pageSize,
      },
      callback:response=>{
        this.setState({
          loading: false,
        }); 
        window.dispatchEvent(new Event('resize'));
      }
    });
    
  }

  render() {
    const {
      messagelist: { list,data,pageSize },
      loading,
    } = this.props;

    const {
      form: { getFieldDecorator },
    } = this.props;
    const { visible, done, current = {},rolelist,targets,confirmLoading,initLoading } = this.state;
    let {msgTypeVal,msgStateVal}= this.state;
    const editAndDelete = (key, currentItem,index) => {
      if (key === 'edit') this.showEditModal(currentItem);
      else if (key === 'delete') {
        Modal.confirm({
          title: '删除消息',
          content: '确定删除该消息吗？',
          okText: '确认',
          cancelText: '取消',
          onOk: () => this.deleteItem(currentItem,index),
        });
      }
    };

    const modalFooter = done
      ? { footer: null, onCancel: this.handleDone }
      : { okText: '保存', onOk: this.handleSubmit, onCancel: this.handleCancel };

    const Info = ({ title, value, bordered }) => (
      <div className={styles.headerInfo}>
        <span>{title}</span>
        <p>{value}</p>
        {bordered && <em />}
      </div>
    );

    const extraContent = (
      <div className={styles.extraContent}>
        <RadioGroup defaultValue="all">
          <RadioButton value="all">全部</RadioButton>
          <RadioButton value="progress">进行中</RadioButton>
          <RadioButton value="waiting">等待中</RadioButton>
        </RadioGroup>
        <Search className={styles.extraContentSearch} placeholder="请输入" onSearch={() => this.onLoadMore()} />
      </div>
    );
    

    const MsgType=(props)=>{
      const { type} =props;      
      let typeMsg='';
      if('message'==type){
          typeMsg='消息';
      }else if('event'==type){
         typeMsg='事件';
      }else if('notification'==type){
        typeMsg="通知"
      }
      return (<p>{typeMsg}</p>);
    }

    const ListContent = ({ data: { issuer, create_time, msg_type } }) => (
      <div className={styles.listContent}>
        <div className={styles.listContentItem}>
          <span>发布人</span>
          <p>{issuer}</p>
        </div>
        <div className={styles.listContentItem}>
          <span>创建时间</span>
          <p>{moment(create_time).format('YYYY-MM-DD HH:mm')}</p>
        </div>
        <div className={styles.listContentItem}>
          <span>类型</span>
          <MsgType type={msg_type}></MsgType>
        </div>
      </div>
    );

    const MoreBtn = props => (
      <Dropdown
        overlay={
          <Menu onClick={({ key }) => editAndDelete(key, props.current,props.index)}>
            <Menu.Item key="edit">编辑</Menu.Item>
            <Menu.Item key="delete">删除</Menu.Item>
          </Menu>
        }
      >
        <a>
          更多 <Icon type="down" />
        </a>
      </Dropdown>
    );

    const getModalContent = () => {
      if (done) {
        return (
          <Result
            type="success"
            title="操作成功"
            description=""
            actions={
              <Button type="primary" onClick={this.handleDone}>
                知道了
              </Button>
            }
            className={styles.formResult}
          />
        );
      }
      
      if(current.msg_type){
        msgTypeVal=current.msg_type;
      }
      msgStateVal=current.state?current.state:msgStateVal;
      return (
        <Form onSubmit={this.handleSubmit}>
          <FormItem label="类型" {...this.formLayout}>
            {getFieldDecorator('msg_type', {
              valuePropName:'msg_type',
            })(
              <Select defaultValue={msgTypeVal} onChange={(val,option)=>this.changeMsgType(val,option)} placeholder="请选择">
                <Select.Option key='message' value='message'>消息</Select.Option>
                <Select.Option key='notification' value='notification'>通知</Select.Option>
                <Select.Option key='event' value='event'>事件</Select.Option>
              </Select>
            )}
          </FormItem>
          {msgTypeVal=='event'?(
            <FormItem label="状态" {...this.formLayout}>
            {getFieldDecorator('state', {
              rules: [{ required: true, message: '请选择' }],
              valuePropName:'state',
            })(
              <Select defaultValue={msgStateVal} onChange={(val,option)=>this.changeMsgState(val,option)} placeholder="请选择">
                <Select.Option key='urgent' value='urgent'>紧急</Select.Option>
                <Select.Option key='todo' value='todo'>待办</Select.Option>
                <Select.Option key='doing' value='doing'>紧急</Select.Option>
              </Select>
            )}
          </FormItem>
          ):null}
          <FormItem label="消息标题" {...this.formLayout}>
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
            {getFieldDecorator('id', {
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
            <FormItem {...this.formLayout} label="状态描述">
            {getFieldDecorator('extra', {
              rules: [{required: true, message: '请输入不超过六个字符的描述！', max: 6 }],
              initialValue: current.extra,
            })(<TextArea rows={2} placeholder="请输入该信息状态的描述（如紧急）" />)}
          </FormItem>
          ):null}
        </Form>
      );
    };
    const loadMore = !initLoading && !loading && data.length>=pageSize? (
      <div style={{
        textAlign: 'center', marginTop: 12, height: 32, lineHeight: '32px',
      }}
      >
        <Button onClick={this.onLoadMore}>加载更多</Button>
      </div>
    ) : null;
    return (
      <PageHeaderWrapper>
        <div className={styles.standardList} >
          <Card
            className={styles.listCard}
            bordered={false}
            title="消息列表"
            style={{ marginTop: 24 }}
            bodyStyle={{ padding: '0 32px 40px 32px' }}
            extra={extraContent}
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
              style={{"overflowX":"scroll"}}
              size="large"
              rowKey="id"
              loading={loading}
              loadMore={loadMore}
              dataSource={list}
              renderItem={(item,index) => (
                <List.Item
                  actions={[
                    <a
                      onClick={e => {
                        e.preventDefault();
                        this.showEditModal(item);
                      }}
                    >
                      编辑
                    </a>,
                    <MoreBtn current={item} index={index} />,
                  ]}
                >
                  <List.Item.Meta
                    title={<span  style={item.state=='urgent'?{'color':'red'}:null} >{item.title}</span>}
                    description={item.content}
                  />
                  <ListContent data={item} />
                </List.Item>
              )}
            />
          </Card>
        </div>
        <Modal
          title={done ? null : `消息${current ? '编辑' : '添加'}`}
          className={styles.standardListForm}
          width={500}
          bodyStyle={done ? { padding: '60px 0' } : { padding: '28px 0 0' }}
          destroyOnClose
          visible={visible}
          confirmLoading={confirmLoading}
          {...modalFooter}
        >
          {getModalContent()}
        </Modal>
      </PageHeaderWrapper>
    );
  }
}

export default MessageList;
