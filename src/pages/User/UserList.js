import React, { PureComponent, Fragment } from 'react';
import { connect } from 'dva';
import moment from 'moment';
import {
  Row,
  Col,
  Card,
  Form,
  Input,
  Select,
  TreeSelect,
  Icon,
  Button,
  Dropdown,
  Menu,
  InputNumber,
  DatePicker,
  Modal,
  message,
  Badge,
  Divider,
  Steps,
  Radio,
} from 'antd';
import StandardTable from '@/components/StandardTable';
import PageHeaderWrapper from '@/components/PageHeaderWrapper';
import Authorized from '@/utils/Authorized';
import listDataConvertSelectTreeData from '@/utils/treeUtil';
import styles from './UserList.less';

const FormItem = Form.Item;
const { Step } = Steps;
const { TextArea } = Input;
const { Option } = Select;
const RadioGroup = Radio.Group;
const getValue = obj =>
  Object.keys(obj)
    .map(key => obj[key])
    .join(',');
const statusMap = ['default','success','error'];
const status = ['未定义','正常', '删除'];

const CreateForm = Form.create()(props => {
  const { modalVisible, form, handleAdd,handleUpdate,
    handleModalVisible ,userFormValues,confirmLoading} = props;
  //const { userFormValues }=this.state
  let isUpdate=false;
  if(JSON.stringify(userFormValues)!=='{}'){
    isUpdate=true;
  }
  const okHandle = () => {
    form.validateFields((err, fieldsValue) => {
      if (err) return;
      //form.resetFields();
      if(isUpdate){
        fieldsValue.id=userFormValues.id;
        handleUpdate(fieldsValue);
      }else{
        handleAdd(fieldsValue);  
      }
    });
  };
  const title=(isUpdate?"编辑":"新建")+"用户"
  return (
    <Modal
      destroyOnClose
      title={title}
      width={640}
      visible={modalVisible}
      confirmLoading={confirmLoading}
      onOk={okHandle}
      onCancel={() => handleModalVisible()}
    >
      <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 16 }} label="用户名">
        {form.getFieldDecorator('user_name', {
          rules: [{ required: true, message: '请输入2-20个字符！', min: 2,max:20 }],
          initialValue: userFormValues.user_name,
        })(<Input placeholder="请输入用户名" disabled={isUpdate}/>)}
        </FormItem>
      <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 16 }} label="密码">
        {form.getFieldDecorator('password', {
          rules: [{ required: true, message: '密码长度在6-20位！', min: 6,max:20 }],
          initialValue: userFormValues.password,
        })(<Input type="password" placeholder="请输入密码" />)}
      </FormItem>
      <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 16 }} label="姓名">
        {form.getFieldDecorator('real_name', {
          rules: [{ required: true, message: '姓名至少2个字符以上！', min: 2 }],
          initialValue: userFormValues.real_name,
        })(<Input placeholder="请输入真实姓名" />)}
      </FormItem>
      <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 16 }} label="邮箱">
        {form.getFieldDecorator('email', {
          rules: [{ required: true, message: '请输入正确的邮箱地址！' }],
          initialValue: userFormValues.email,
        })(<Input type="email" placeholder="请输入邮箱" />)}
      </FormItem>
      <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 16 }} label="手机号">
        {form.getFieldDecorator('phono_number', {
          rules: [{ required: true, message: '请输入正确的手机号码！' }],
          initialValue: userFormValues.phono_number,
        })(<Input placeholder="请输入手机号" />)}
      </FormItem>
    </Modal>
  );
});


const AssignRoleForm = Form.create()(props => {
  const { handelAssignRoles,assignModalVisible, form,handleAssignRoleModalVisible,roleList,confirmLoading,assignRoles} = props;
  const okHandle = () => {
    form.validateFields((err, fieldsValue) => {
      if (err) return;
      //form.resetFields();
      handelAssignRoles(fieldsValue);
    });
  };
  return (
    <Modal
      destroyOnClose
      title={'分配角色'}
      width={640}
      visible={assignModalVisible}
      confirmLoading={confirmLoading}
      onOk={okHandle}
      onCancel={() => handleAssignRoleModalVisible()}
    >
       <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 16 }} label="已分配的角色">
        {form.getFieldDecorator('id', {
          rules: [{ required: true, message: '请选择要分配的角色！' }],
          initialValue:assignRoles,
        })(<Select
              mode="multiple"
              style={{ width: '100%' }}
              placeholder="请选择角色"
            >
              {roleList.map(role => (
                <Option key={role.id} value={role.id}>
                  {role.role_name}
                </Option>
              ))}
            </Select>)}
      </FormItem>
    </Modal>
  );
});
// 绑定机构model
const BindingOrganForm = Form.create()(props => {
  const { bindingOrganVisible, form,confirmLoading,handleBingingOrganModalVisible,
    bindingOrgan,allOrgans,handleBindingUserOrgan} = props;
  const TreeNode = TreeSelect.TreeNode
  let isUpdate=false;
  const okHandle = () => {
    form.validateFields((err, fieldsValue) => {
      if (err) return;
      handleBindingUserOrgan(fieldsValue)
    });
  };
  //debugger
  const treeSelectProp={
    multiple:false,//多选
    treeCheckable:false,//展示复选框
    showCheckedStrategy:TreeSelect.SHOW_CHILD ,//展示策略 SHOW_ALL SHOW_PARENT SHOW_CHILD
    treeDefaultExpandAll:false,
    treeDataSimpleMode:false,
    maxTagCount:3,
    //treeCheckStrictly:true,
    style:{width:'100%'},
    //value:assignMenus,
  };

  return (
    <Modal
      destroyOnClose
      title={'绑定机构'}
      width={640}
      visible={bindingOrganVisible}
      onOk={okHandle}
      confirmLoading={confirmLoading}
      onCancel={()=>handleBingingOrganModalVisible()}
    >
      <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 16 }} label="已绑定机构">
        {form.getFieldDecorator('id', {
          rules: [{ required: true, message: '请选择机构！' }],
          initialValue: bindingOrgan,
        })(<TreeSelect treeData={allOrgans} {...treeSelectProp} placeholder="请选择..." />
        )}
        </FormItem>
    </Modal>
  );
});


/* eslint react/no-multi-comp:0 */
@connect(({ userlist, loading }) => ({
  userlist,
  loading: loading.models.userlist,
}))
@Form.create()
class UserList extends PureComponent {
  state = {
    modalVisible: false,
    updateModalVisible: false,
    expandForm: false,
    selectedRows: [],
    formValues: {},
    userFormValues: {},
    updateRowIndex:undefined,
    assignModalVisible:false,
    roleList:[],//角色列表
    confirmLoading:false,//弹出框加载
    assignRoles:[],//已分配角色列表
    bindingOrganVisible:false,//绑定机构model是否可见
    bindingOrgan:undefined,
    allOrgans:[],
  };

  columns = [
    {
      title: '用户名',
      dataIndex: 'user_name',
    },
    {
      title: '姓名',
      dataIndex: 'real_name',
    },
    {
      title: '邮箱',
      dataIndex: 'email',
    },
    {
      title: '电话',
      dataIndex: 'phono_number',
    },
    {
      title: '创建时间',
      dataIndex: 'create_time',
    },
    {
      title: '锁定状态',
      dataIndex: 'lock_status',
      render(val) {
        val=val?val:0;
        //return val==1?'正常':'删除'
        return <Badge status={statusMap[val]} text={status[val]} />;
      },
    },
    {
      title: '操作',
      render: (text, record,index) => (
        <Fragment>
          <Authorized authority={'user'} noMatch={
            <Button disabled size="small" onClick={() => this.handleUpdateModalVisible(true, record,index)}>
              <Icon type="edit" theme="twoTone" />
            </Button>
          } >
            <Button  size="small" onClick={() => this.handleUpdateModalVisible(true, record,index)}>
              <Icon type="edit" theme="twoTone" />
            </Button>
          </Authorized>
          
          <Divider type="vertical" />
          <Button icon="user-delete" type='danger' size="small" onClick={() => this.handleDeleteRecord(record,index)}/>
        </Fragment>
      ),
    },
  ];

  componentDidMount() {
    const { dispatch } = this.props;
    dispatch({
      type: 'userlist/fetch',
    });
  }

  handleStandardTableChange = (pagination, filtersArg, sorter) => {
    const { dispatch } = this.props;
    const { formValues } = this.state;
    const filters = Object.keys(filtersArg).reduce((obj, key) => {
      const newObj = { ...obj };
      newObj[key] = getValue(filtersArg[key]);
      return newObj;
    }, {});

    const params = {
      pageNum: pagination.current,
      pageSize: pagination.pageSize,
      ...formValues,
      ...filters,
    };
    if (sorter.field) {
      params.sorter = `${sorter.field}_${sorter.order}`;
    }

    dispatch({
      type: 'userlist/fetch',
      payload: params,
    });
  }

  handleFormReset = () => {
    const { form, dispatch } = this.props;
    form.resetFields();
    this.setState({
      formValues: {},
    });
    dispatch({
      type: 'userlist/fetch',
      payload: {},
    });
  }

  toggleForm = () => {
    const { expandForm } = this.state;
    this.setState({
      expandForm: !expandForm,
    });
  }

  handleMenuClick = e => {
    const { dispatch } = this.props;
    const { selectedRows } = this.state;

    if (!selectedRows || selectedRows.length >1 ){
      message.warn("请选择要绑定的用户，最多选一个");
      return;
    } 

    switch (e.key) {
      case 'organ':
        this.handleBingingOrganModalVisible(true);
        break;
      default:
        break;
    }
  }

  handleBingingOrganModalVisible=(flag)=>{
    const { selectedRows } = this.state;

    this.setState({
        bindingOrganVisible: !!flag,
    });
    const { bindingOrgan,allOrgans } =this.state;
    if(flag && (!allOrgans || allOrgans.length <1 )){
      const { dispatch } = this.props;
      dispatch(
        {
          type: 'userlist/userorgan',
          payload: {
            selectedRows:selectedRows
        },
        callback:(response)=>{
          if(response.success){
            const bindrgan=response.data.bindingOrgan;
            let allOrgans=response.data.allOrgans;
            let organs=[allOrgans];
            listDataConvertSelectTreeData(organs,'org_name');
            this.setState(
              {
                bindingOrgan:bindrgan?bindrgan['key']:bindrgan,
                allOrgans:organs,
              }
            );
          }else{
            message.error(response.message);
          }
        }
      });
    }
  }

  handleBindingUserOrgan=(values)=>{
    const { dispatch} = this.props;
    const { selectedRows } = this.state;
    this.changeConfirmLoadState(true);
    dispatch({
      type: 'userlist/bindOrgan',
      payload: {
        ...values,
        userid:selectedRows[0]['id']
      },
      callback:(response)=>{
        this.changeConfirmLoadState();
        this.handleBingingOrganModalVisible();
        if(response.success){
          this.setState({
            bindingOrgan:values['id'],
          });
        }else{
          message.error('绑定失败:'+response.message);
        }
      }
    });
  }

  handleSelectRows = rows => {
    this.setState({
      selectedRows: rows,
    });
  }

  handleSearch = e => {
    e.preventDefault();

    const { dispatch, form } = this.props;

    form.validateFields((err, fieldsValue) => {
      if (err) return;

      const values = {
        ...fieldsValue,
        updatedAt: fieldsValue.updatedAt && fieldsValue.updatedAt.valueOf(),
      };

      this.setState({
        formValues: values,
      });

      dispatch({
        type: 'userlist/fetch',
        payload: values,
      });
    });
  }

  handleModalVisible = flag => {
    this.setState({
      modalVisible: !!flag,
      userFormValues: {},
    });
  }

  handleUpdateModalVisible = (flag, record,index) => {
    this.setState({
      modalVisible: !!flag,
      userFormValues: record || {},
      updateRowIndex: index,
    });
  }

  handleDeleteRecord=(record,index)=>{
    Modal.confirm({
      title: '删除用户',
      content: '确定删除该用户吗？',
      okText: '确认',
      cancelText: '取消',
      onOk: () => this.handleDelete(record,index),
    });
  }

  handleDelete=(record,index)=>{
    const { dispatch} = this.props;
    this.setState({
      confirmLoading:true
    });
    dispatch({
      type:'userlist/delete',
      payload:{
        record
      },
      callback:(response)=>{
        this.setState({
            confirmLoading:false
        });
        if(response.success){
          let listData=this.props.userlist;
          //删除页面上的数据
          listData.data.list.splice(index,1);
        }else{
          message.error(response.message);
        }
      }
    });
  }

  handleAdd = (fields) => {
    const { dispatch,form } = this.props;
    this.changeConfirmLoadState(true);    
    dispatch({
      type: 'userlist/add',
      payload: {
        ...fields
      },
      callback:(response)=>{
        this.changeConfirmLoadState();        
        if(response.success){
          form.resetFields();
          message.success('添加成功');
          const data=this.props.userlist.data;;
          let datalist=data.list;
          const pageSize=data.pagination.pageSize;
          if(datalist.length<pageSize){
            //添加到列表中
            datalist.push(response.data);
          }
          this.handleModalVisible();
        }else{
          message.error(response.message);
        }
      }
    });
  }

  changeConfirmLoadState=flag=>{
    this.setState(
      {
          confirmLoading:!!flag
      }
    );
  }

  handleUpdate = (fields) => {
    const { dispatch } = this.props;
    const { updateRowIndex}=this.state;
    this.changeConfirmLoadState(true);     
    dispatch({
      type: 'userlist/update',
      payload: {
        ...fields
      },
      callback:(response)=>{
        this.changeConfirmLoadState();
        if(response.success){
          message.success('修改成功');
          const data=this.props.userlist.data;;
          let datalist=data.list;
          datalist.splice(updateRowIndex,1,response.data);
          this.handleModalVisible();
        }else{
          message.error(response.message);
        }
        
      }
    })
    //this.handleUpdateModalVisible();
  };

  handleAssignRoleModalVisible=(flag)=>{
    const { selectedRows } = this.state;
    if(flag){
      //model显示 请求后台数据
      const { dispatch } = this.props;
      dispatch(
        {
          type: 'userlist/useroles',
          payload: {
            selectedRows:selectedRows
        },
        callback:(response)=>{
          if(response.success){
            const data=response.data;
            const roles=data.AllRoles;
            const assignRoles=data.AssignRoles;

            this.setState({
              roleList:roles,
              assignRoles:assignRoles,
              assignModalVisible: !!flag,
            });
          }else{
            message.error(response.message);
          }
        }
      });
    }else{
      this.setState({
        assignModalVisible: !!flag,
        roleList:[],
      });
    }
  }


  handelAssignRoles=(fieldsValue)=>{
    const { selectedRows} =this.state;
    let userids=[];
    selectedRows.map(item=>{
      userids.push(item.id);
    });
    const { dispatch } = this.props;
    this.changeConfirmLoadState(true); 
    dispatch({
        type: 'userlist/assignRoles',
        payload: {
          userids:userids,
          roleids:fieldsValue.id
        },
        callback:(response)=>{
          this.changeConfirmLoadState(); 
          if(response.success){
            message.success('分配成功');
            this.setState({
              roleList:[],
              assignRoles:[],
              assignModalVisible: false,
            });
          }else{
            message.error(response.message);
            
          }
        }
      });
    
  }

  renderSimpleForm() {
    const {
      form: { getFieldDecorator },
    } = this.props;
    return (
      <Form onSubmit={this.handleSearch} layout="inline">
        <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
          <Col md={8} sm={24}>
            <FormItem label="规则名称">
              {getFieldDecorator('name')(<Input placeholder="请输入" />)}
            </FormItem>
          </Col>
          <Col md={8} sm={24}>
            <FormItem label="使用状态">
              {getFieldDecorator('status')(
                <Select placeholder="请选择" style={{ width: '100%' }}>
                  <Option value="0">关闭</Option>
                  <Option value="1">运行中</Option>
                </Select>
              )}
            </FormItem>
          </Col>
          <Col md={8} sm={24}>
            <span className={styles.submitButtons}>
              <Button type="primary" htmlType="submit">
                查询
              </Button>
              <Button style={{ marginLeft: 8 }} onClick={this.handleFormReset}>
                重置
              </Button>
              <a style={{ marginLeft: 8 }} onClick={this.toggleForm}>
                展开 <Icon type="down" />
              </a>
            </span>
          </Col>
        </Row>
      </Form>
    );
  }

  renderAdvancedForm() {
    const {
      form: { getFieldDecorator },
    } = this.props;
    return (
      <Form onSubmit={this.handleSearch} layout="inline">
        <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
          <Col md={8} sm={24}>
            <FormItem label="规则名称">
              {getFieldDecorator('name')(<Input placeholder="请输入" />)}
            </FormItem>
          </Col>
          <Col md={8} sm={24}>
            <FormItem label="使用状态">
              {getFieldDecorator('status')(
                <Select placeholder="请选择" style={{ width: '100%' }}>
                  <Option value="0">关闭</Option>
                  <Option value="1">运行中</Option>
                </Select>
              )}
            </FormItem>
          </Col>
          <Col md={8} sm={24}>
            <FormItem label="调用次数">
              {getFieldDecorator('number')(<InputNumber style={{ width: '100%' }} />)}
            </FormItem>
          </Col>
        </Row>
        <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
          <Col md={8} sm={24}>
            <FormItem label="更新日期">
              {getFieldDecorator('date')(
                <DatePicker style={{ width: '100%' }} placeholder="请输入更新日期" />
              )}
            </FormItem>
          </Col>
          <Col md={8} sm={24}>
            <FormItem label="使用状态">
              {getFieldDecorator('status3')(
                <Select placeholder="请选择" style={{ width: '100%' }}>
                  <Option value="0">关闭</Option>
                  <Option value="1">运行中</Option>
                </Select>
              )}
            </FormItem>
          </Col>
          <Col md={8} sm={24}>
            <FormItem label="使用状态">
              {getFieldDecorator('status4')(
                <Select placeholder="请选择" style={{ width: '100%' }}>
                  <Option value="0">关闭</Option>
                  <Option value="1">运行中</Option>
                </Select>
              )}
            </FormItem>
          </Col>
        </Row>
        <div style={{ overflow: 'hidden' }}>
          <div style={{ float: 'right', marginBottom: 24 }}>
            <Button type="primary" htmlType="submit">
              查询
            </Button>
            <Button style={{ marginLeft: 8 }} onClick={this.handleFormReset}>
              重置
            </Button>
            <a style={{ marginLeft: 8 }} onClick={this.toggleForm}>
              收起 <Icon type="up" />
            </a>
          </div>
        </div>
      </Form>
    );
  }

  renderForm() {
    const { expandForm } = this.state;
    return expandForm ? this.renderAdvancedForm() : this.renderSimpleForm();
  }

  render() {
    const {
      userlist: { data },
      location: { pathname },
      route: { routes },
      loading,
    } = this.props;
    
    const { selectedRows, modalVisible, updateModalVisible, 
      userFormValues,assignModalVisible,roleList,confirmLoading,
      assignRoles,bindingOrganVisible,bindingOrgan,allOrgans} = this.state;
    const menu = (
      <Menu onClick={this.handleMenuClick} selectedKeys={[]}>
        <Menu.Item key="organ">绑定机构</Menu.Item>
        <Menu.Item key="approval">批量审批</Menu.Item>
      </Menu>
    );

    const parentMethods = {
      handleAdd: this.handleAdd,
      handleUpdate:this.handleUpdate,
      handleModalVisible: this.handleModalVisible,
      confirmLoading:confirmLoading,
    };
    const assignRoleModelParentMethods={
      handleAssignRoleModalVisible:this.handleAssignRoleModalVisible,
      handelAssignRoles:this.handelAssignRoles,
    }
    const assignRoleModelParentStates={
      roleList:roleList,
      assignModalVisible:assignModalVisible,
      confirmLoading:confirmLoading,
      assignRoles:assignRoles,
    }
    const bindingOrganModelStates={
      bindingOrganVisible:bindingOrganVisible,
      confirmLoading:confirmLoading,
      handleBingingOrganModalVisible:this.handleBingingOrganModalVisible,
      bindingOrgan:bindingOrgan,
      allOrgans:allOrgans,
      handleBindingUserOrgan:this.handleBindingUserOrgan,
    }
    

    return (
      <PageHeaderWrapper title="用户列表">
        <Card bordered={false}>
          <div className={styles.tableList}>
            <div className={styles.tableListForm}>{this.renderForm()}</div>
            <div className={styles.tableListOperator}>
              <Button icon="user-add" type="primary" onClick={() => this.handleModalVisible(true)}>
                新建
              </Button>
              {selectedRows.length > 0 && (
                <span>
                  <Button onClick={()=>this.handleAssignRoleModalVisible(true)}>分配角色</Button>
                  <Dropdown overlay={menu}>
                    <Button>
                      更多操作 <Icon type="down" />
                    </Button>
                  </Dropdown>
                </span>
              )}
            </div>
            <StandardTable
              style={{"overflowX":"scroll"}}
              selectedRows={selectedRows}
              loading={loading}
              data={data}
              columns={this.columns}
              onSelectRow={this.handleSelectRows}
              onChange={this.handleStandardTableChange}
            />
          </div>
        </Card>
        <CreateForm {...parentMethods} modalVisible={modalVisible} userFormValues={userFormValues} />
        <AssignRoleForm {...assignRoleModelParentMethods} {...assignRoleModelParentStates} />
        <BindingOrganForm {...bindingOrganModelStates}/>
      </PageHeaderWrapper>
    );
  }
}

export default UserList;
