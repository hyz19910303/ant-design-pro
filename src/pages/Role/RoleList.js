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
  const { modalVisible, form, handleAdd,handleUpdate,handleModalVisible ,roleFormValues} = props;
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

/* eslint react/no-multi-comp:0 */
@connect(({ rolelist, loading }) => ({
  rolelist,
  loading: loading.models.rolelist,
}))
@Form.create()
class RoleList extends PureComponent {
  state = {
    modalVisible: false,
    updateModalVisible: false,
    expandForm: false,
    selectedRows: [],
    formValues: {},
    roleFormValues: {},
    updateRowIndex:undefined,
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
          <Button icon="edit" size="small" onClick={() => this.handleUpdateModalVisible(true, record,index)}/>
          <Divider type="vertical" />
          <Button icon="delete" size="small" onClick={() => this.handleDeleteRecord(record,index)}/>
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
    dispatch({
      type:'rolelist/delete',
      payload:{
        record
      },
      callback:(response)=>{
        let listData=this.props.rolelist;
        //删除页面上的数据
        listData.data.list.splice(index,1);
      }
    });
  }

  handleAdd = (fields) => {
    const { dispatch,form } = this.props;
    dispatch({
      type: 'rolelist/add',
      payload: {
        ...fields
      },
      callback:(response)=>{
        //var that=this;
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

  handleUpdate = (fields) => {
    const { dispatch } = this.props;
    const { updateRowIndex}=this.state;
    
    dispatch({
      type: 'rolelist/update',
      payload: {
        ...fields
      },
      callback:(response)=>{
        if(response.success){
          //form.resetFields();
          message.success('修改成功');
          const data=this.props.rolelist.data;;
          let datalist=data.list;
          // const pageSize=data.pagination.pageSize;
          // if(datalist.length<pageSize){
            datalist.splice(updateRowIndex,1);
            datalist.splice(updateRowIndex,1,response.data);
          // }
          this.handleModalVisible();
        }else{
          message.error(response.message);
        }
        
      }
    })
    //this.handleUpdateModalVisible();
  };

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
    const { selectedRows, modalVisible, updateModalVisible, roleFormValues } = this.state;
    const menu = (
      <Menu onClick={this.handleMenuClick} selectedKeys={[]}>
        <Menu.Item key="remove">删除</Menu.Item>
        <Menu.Item key="approval">批量审批</Menu.Item>
      </Menu>
    );

    const parentMethods = {
      handleAdd: this.handleAdd,
      handleUpdate:this.handleUpdate,
      handleModalVisible: this.handleModalVisible,
    };
    // const updateMethods = {
    //   handleUpdateModalVisible: this.handleUpdateModalVisible,
    //   handleUpdate: this.handleUpdate,
    // };
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
                  <Button>批量操作</Button>
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
        <CreateForm {...parentMethods} modalVisible={modalVisible} roleFormValues={roleFormValues} />
      </PageHeaderWrapper>
    );
  }
}

export default RoleList;
