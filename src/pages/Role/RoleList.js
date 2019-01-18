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

import styles from './RoleList.less';

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
  const { modalVisible, form, handleAdd,handleUpdate,handleModalVisible,roleFormValues,confirmLoading} = props;
  //const { roleFormValues }=this.state
  let isUpdate=false;
  if(JSON.stringify(roleFormValues)!=='{}'){
    isUpdate=true;
  }
  const okHandle = () => {
    form.validateFields((err, fieldsValue) => {
      if (err) return;
      //form.resetFields();
      if(isUpdate){
        fieldsValue.id=roleFormValues.id;
        handleUpdate(fieldsValue);
      }else{
        handleAdd(fieldsValue);  
      }
    });
  };
  const title=(isUpdate?"编辑":"新建")+"角色"
  return (
    <Modal
      destroyOnClose
      title={title}
      width={640}
      visible={modalVisible}
      onOk={okHandle}
      confirmLoading={confirmLoading}
      onCancel={() => handleModalVisible()}
    >
      <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 16 }} label="角色名称">
        {form.getFieldDecorator('role_name', {
          rules: [{ required: true, message: '请输入2-20个字符！', min: 2,max:20 }],
          initialValue: roleFormValues.role_name,
        })(<Input placeholder="请输入角色名称" />)}
        </FormItem>
      <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 16 }} label="角色代码">
        {form.getFieldDecorator('role_code', {
          rules: [{ required: true, message: '角色代码长度在3-20位！', min: 3,max:20 }],
          initialValue: roleFormValues.role_code,
        })(<Input type='number' placeholder="请输入角色代码" />)}
      </FormItem>
      <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 16 }} label="备注">
        {form.getFieldDecorator('role_remark', {
          rules: [{ message: '请输入至少两个字符的描述！', min: 2 }],
          initialValue: roleFormValues.role_remark,
        })(<TextArea rows={4} placeholder="请输入至少两个字符" />)}
      </FormItem>
    </Modal>
  );
});

const AssignMenuForm = Form.create()(props => {
  const { assignModalVisible, form,confirmLoading,handleAssignMenuModalVisible,
    menuTreeData,assignMenus,handleAssignRoleMenus} = props;
  const TreeNode = TreeSelect.TreeNode
  let isUpdate=false;
  const okHandle = () => {
    form.validateFields((err, fieldsValue) => {
      if (err) return;
      //form.resetFields();
      handleAssignRoleMenus(fieldsValue)
    });
  };
  //debugger
  const treeSelectProp={
    multiple:true,//多选
    treeCheckable:true,//展示复选框
    showCheckedStrategy:TreeSelect.SHOW_ALL ,//展示策略 SHOW_ALL SHOW_PARENT SHOW_CHILD
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
      title={'分配菜单'}
      width={640}
      visible={assignModalVisible}
      onOk={okHandle}
      confirmLoading={confirmLoading}
      onCancel={() => handleAssignMenuModalVisible()}
    >
      <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 16 }} label="已分配列表">
        {form.getFieldDecorator('id', {
          rules: [{ required: true, message: '请输入2-20个字符！' }],
          initialValue: assignMenus,
        })(<TreeSelect treeData={menuTreeData} {...treeSelectProp} placeholder="请选择..." />
        )}
        </FormItem>
    </Modal>
  );
});

/* eslint react/no-multi-comp:0 */
@connect(({ rolelist, loading }) => ({
  rolelist,
  loading: loading.models.rolelist,
}))
@Form.create()
class RoleList extends PureComponent {
  state = {
    modalVisible: false,
    expandForm: false,
    selectedRows: [],
    formValues: {},
    roleFormValues: {},
    updateRowIndex:undefined,
    confirmLoading:false,//弹出框加载
    assignModalVisible:false,
    assignMenus:[],
  };

  columns = [
    {
      title: '角色名',
      dataIndex: 'role_name',
    },
    {
      title: '角色代码',
      dataIndex: 'role_code',
    },
    {
      title: '备注',
      dataIndex: 'role_remark',
    },
    {
      title: '创建时间',
      dataIndex: 'create_time',
    },
    {
      title: '状态',
      dataIndex: 'flag',
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
          <Button size="small" onClick={() => this.handleUpdateModalVisible(true, record,index)}>
            <Icon type="edit" theme="twoTone" />
          </Button>
          <Divider type="vertical" />
          <Button type='danger' icon="delete" size="small" onClick={() => this.handleDeleteRecord(record,index)}/>
        </Fragment>
      ),
    },
  ];

  componentDidMount() {
    const { dispatch } = this.props;
    dispatch({
      type: 'rolelist/fetch',
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
      type: 'rolelist/fetch',
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
      type: 'rolelist/fetch',
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

    if (!selectedRows) return;
    switch (e.key) {
      case 'remove':
        dispatch({
          type: 'rolelist/remove',
          payload: {
            key: selectedRows.map(row => row.key),
          },
          callback: () => {
            this.setState({
              selectedRows: [],
            });
          },
        });
        break;
      default:
        break;
    }
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
        type: 'rolelist/fetch',
        payload: values,
      });
    });
  }

  handleModalVisible = flag => {
    this.setState({
      modalVisible: !!flag,
      roleFormValues: {},
    });
  }

  handleUpdateModalVisible = (flag, record,index) => {
    this.setState({
      modalVisible: !!flag,
      roleFormValues: record || {},
      updateRowIndex: index,
    });
  }

  handleDeleteRecord=(record,index)=>{
    Modal.confirm({
      title: '删除角色',
      content: '确定删除该角色吗？',
      okText: '确认',
      cancelText: '取消',
      onOk: () => this.handleDelete(record,index),
    });
  }

  handleDelete=(record,index)=>{
    const { dispatch} = this.props;
    this.changeConfirmLoadState(true);
    dispatch({
      type:'rolelist/delete',
      payload:{
        record
      },
      callback:(response)=>{
        this.changeConfirmLoadState();
        if(response.success){
          let listData=this.props.rolelist;
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
      type: 'rolelist/add',
      payload: {
        ...fields
      },
      callback:(response)=>{
        this.changeConfirmLoadState();
        if(response.success){
          form.resetFields();
          message.success('添加成功');
          const data=this.props.rolelist.data;;
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
      type: 'rolelist/update',
      payload: {
        ...fields
      },
      callback:(response)=>{
        this.changeConfirmLoadState();
        if(response.success){
          message.success('修改成功');
          const data=this.props.rolelist.data;;
          let datalist=data.list;
          datalist.splice(updateRowIndex,1,response.data);
          this.handleModalVisible();
        }else{
          message.error(response.message);
        }
      }
    })
  };

  handleAssignMenuModalVisible=(flag)=>{
    const { selectedRows } = this.state;
    if(flag){
      //model显示 请求后台数据
      const { dispatch } = this.props;
      dispatch({
          type: 'rolelist/roleAssignMenus',
          payload: {
            selectedRows:selectedRows
        },
        callback:(response)=>{
          if(response.success){
            const data=response.data;
            let treeMenus=data.TreeMenus;
            
            // treeMenus=treeMenus.map(item=>{
            //   item['pId']=item.pid;
            //   item['title']=item.menu_name;
            //   return item;
            // });
            
            this.listDataConvertSelectTreeData([treeMenus]);
            
            const assignMenus=data.AssignMenus;
            this.setState({
              menuTreeData:[treeMenus],
              assignModalVisible:!!flag,
              assignMenus:assignMenus,
            });
          }else{
            message.error(response.message);
          }
        }
      });
    }else{
      this.setState({
        assignModalVisible: !!flag,
        menuTreeData:[],
      });
    }
  }

  listDataConvertSelectTreeData=(list)=>{    
    
    for(var i=0;i<list.length;i++){
      let item=list[i];
      item.title=item.menu_name;
      item.key=item.id;
      item.value=item.id;
      if(item.children){
        this.listDataConvertSelectTreeData(item.children);
      }
      
    }
  }

  handleAssignRoleMenus=(menuids)=>{
     const { dispatch } = this.props;
     const { selectedRows } = this.state;
     let roleids=[];
      selectedRows.map(item=>{
        roleids.push(item.id);
      });
     this.changeConfirmLoadState(true);
     dispatch({
          type: 'rolelist/assignRoleMenus',
          payload: {
            menuids:menuids['id'],
            roleids:roleids,
        },
        callback:(response)=>{
          this.changeConfirmLoadState();
          if(response.success){
            message.success('分配成功');
            this.setState({
              menuTreeData:[],
              assignMenus:[],
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
            </span>
          </Col>
        </Row>
      </Form>
    );
  }

  renderForm() {
    //const { expandForm } = this.state;
    //return expandForm ? this.renderAdvancedForm() : this.renderSimpleForm();
    return this.renderSimpleForm();
  }

  render() {
    const {
      rolelist: { data },
      loading,
    } = this.props;
    const { selectedRows, modalVisible, roleFormValues,confirmLoading,
      assignModalVisible,menuTreeData,assignMenus } = this.state;
    const menu = (
      <Menu onClick={this.handleMenuClick} selectedKeys={[]}>
        <Menu.Item key="remove">删除</Menu.Item>
        <Menu.Item key="approval">批量审批</Menu.Item>
      </Menu>
    );

    const parentMethodsAndState = {
      handleAdd: this.handleAdd,
      handleUpdate:this.handleUpdate,
      handleModalVisible: this.handleModalVisible,
      confirmLoading:confirmLoading,
      modalVisible:modalVisible,
      roleFormValues: roleFormValues,
    };
    
    const assignMenuModelParentMethodsAndStates={
      assignModalVisible:assignModalVisible,
      menuTreeData:menuTreeData,
      handleAssignMenuModalVisible:this.handleAssignMenuModalVisible,
      roleFormValues: roleFormValues,
      assignMenus:assignMenus,
      handleAssignRoleMenus:this.handleAssignRoleMenus,
    }

    return (
      <PageHeaderWrapper title="角色列表">
        <Card bordered={false}>
          <div className={styles.tableList}>
            <div className={styles.tableListForm}>{this.renderForm()}</div>
            <div className={styles.tableListOperator}>
              <Button icon="user-add" type="primary" onClick={() => this.handleModalVisible(true)}>
                新建
              </Button>
              {selectedRows.length > 0 && (
                <span>
                  <Button onClick={()=>this.handleAssignMenuModalVisible(true)}>分配菜单</Button>
                  <Dropdown overlay={menu}>
                    <Button>
                      更多操作 <Icon type="down" />
                    </Button>
                  </Dropdown>
                </span>
              )}
            </div>
            <StandardTable
              selectedRows={selectedRows}
              loading={loading}
              data={data}
              columns={this.columns}
              onSelectRow={this.handleSelectRows}
              onChange={this.handleStandardTableChange}
            />
          </div>
        </Card>
        <CreateForm {...parentMethodsAndState} />
        <AssignMenuForm {...assignMenuModelParentMethodsAndStates} />
      </PageHeaderWrapper>
    );
  }
}

export default RoleList;
