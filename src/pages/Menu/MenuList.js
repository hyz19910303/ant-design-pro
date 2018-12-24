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
import StandardTreeTable from '@/components/StandardTreeTable';
import PageHeaderWrapper from '@/components/PageHeaderWrapper';

import styles from './MenuList.less';

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
  const { modalVisible, form, handleAdd,handleUpdate,handleModalVisible,
    roleFormValues,pid,radioSeleted,confirmLoading} = props;
  let { radioVal}=props;
  let isUpdate=false;
  
  if(JSON.stringify(roleFormValues)!=='{}' && !pid){
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
        fieldsValue.pid=pid;
        handleAdd(fieldsValue);  
      }
    });
  };
  //等于默认的值
  if(radioVal==='0'){
    radioVal=roleFormValues.menu_type?roleFormValues.menu_type:radioVal;
  } 
  const title=(isUpdate?"编辑":"新建")+"菜单"
  const formLayout = {
    labelCol: { span: 5 },
    wrapperCol: { span: 16 },
    hasFeedback:true,
  };
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
      <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 16 }} label="菜单类型">
        {form.getFieldDecorator('menu_type',{
          valuePropName:'menu_type',
          initialValue:radioVal,
          }
        )
        (<RadioGroup name='menu_type' value={radioVal} onChange={(v)=>radioSeleted(v)} >
              <Radio value={'0'}>目录</Radio>
              <Radio value={'1'}>菜单</Radio>
              <Radio value={'2'}>按钮</Radio>
        </RadioGroup>)}
      </FormItem>
      <FormItem {...formLayout} label="菜单名称">
        {form.getFieldDecorator('menu_name', {
          rules: [{ required: true, message: '请输入2-20个字符！', min: 2,max:20 }],
          initialValue: roleFormValues.menu_name,
        })(<Input  placeholder="请输入菜单名称" />)}
        </FormItem>
      <FormItem {...formLayout} label="菜单代码">
        {form.getFieldDecorator('menu_code', {
          rules: [{ required: true, message: '菜单代码长度在3-20位！', min: 3,max:20 }],
          initialValue: roleFormValues.menu_code,
        })(<Input  type='number' placeholder="请输入菜单代码" />)}
      </FormItem>
      <FormItem {...formLayout}  label="URL">
        {form.getFieldDecorator('menu_url', {
          rules: [{ required: true, message: 'url不能为空！'}],
          initialValue: roleFormValues.menu_url,
        })(<Input placeholder="请输入url" />)}
      </FormItem>
      {radioVal!=='2'?
      (<FormItem {...formLayout} label="菜单图标">
        {form.getFieldDecorator('menu_icon', {
          rules: [{ message: '请输入至少两个字符的描述！', min: 2 }],
          initialValue: roleFormValues.menu_icon,
        })(<Input  placeholder="请参考antd的icon" />)}
      </FormItem>):null}
      <FormItem {...formLayout} label="描述">
        {form.getFieldDecorator('description', {
          rules: [{ message: '请输入至少两个字符的描述！', min: 2 }],
          initialValue: roleFormValues.description,
        })(<TextArea rows={2} placeholder="请输入至少两个字符" />)}
      </FormItem>
    </Modal>
  );
});

/* eslint react/no-multi-comp:0 */
@connect(({ menulist, loading }) => ({
  menulist,
  loading: loading.models.menulist,
}))
@Form.create()
class MenuList extends PureComponent {
  state = {
    modalVisible: false,
    expandForm: false,
    selectedRows: [],
    formValues: {},
    roleFormValues: {},
    updateRowIndex:undefined,
    radioVal:'0',
    confirmLoading:false,//弹出框加载
  };

  columns = [    
    {
      title: '菜单名称',
      dataIndex: 'menu_name',
      // width:'200px',
      align:'left',
    },
    {
      title: '菜单代码',
      dataIndex: 'menu_code',
      align:'center',
    },
    {
      title: 'URL',
      dataIndex: 'menu_url',
      align:'center',
    },
    {
      title:'图标',
      dataIndex:'menu_icon',
      align:'center',
    },
    {
      title: '菜单类型',
      dataIndex: 'menu_type',
      align:'center',
    },
    {
      title:'排序号',
      dataIndex:'order_no'
    },
    {
      title:'描述',
      dataIndex:'description',
      // width:'200px',
      align:'center',
    },
    {
      title: '操作',
      align:'center',
      render: (text, record,index) => (

        <Fragment>
          
          <Button icon='plus' size="small" onClick={() => this.handleModalVisible(true,record)}/>
          <Button  size="small" onClick={() => this.handleUpdateModalVisible(true, record,index)}>
            <Icon type="edit" theme="twoTone" />
          </Button>
          {record.children?null:<Button icon="delete" type='danger' size="small" onClick={() => this.handleDeleteRecord(record,index)}/>}
        </Fragment>
      ),
    },
  ];

  componentDidMount() {
    const { dispatch } = this.props;
    dispatch({
      type: 'menulist/fetch',
    });
  }

  radioSeleted=(radio)=>{
    this.setState({
      radioVal:radio.target.value,
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
      type: 'menulist/fetch',
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
      type: 'menulist/fetch',
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
          type: 'menulist/remove',
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
        type: 'menulist/fetch',
        payload: values,
      });
    });
  }

  handleModalVisible = (flag,record) => {
    let pid;
    if(record) pid=record.id;
    this.setState({
      modalVisible: !!flag,
      roleFormValues: {},
      pid:pid,
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
      title: '删除菜单',
      content: '确定删除该菜单吗？',
      okText: '确认',
      cancelText: '取消',
      onOk: () => this.handleDelete(record,index),
    });
  }
  /**
  *
  *
  */
  queryParentNode=(list,pid)=>{    
    let parent;
    for(var i=0;i<list.length;i++){
      const item=list[i];
      if(item.id===pid){
        return item;
      }else if(item.children && item.children.length>0){
       parent= this.queryParentNode(item.children,pid);
       if(parent){
          return parent;
       }
      }
    }
  }

  handleDelete=(record,index)=>{
    const { dispatch} = this.props;
    this.changeConfirmLoadState(true);
    dispatch({
      type:'menulist/delete',
      payload:{
        record
      },
      callback:(response)=>{
        this.changeConfirmLoadState();
        if(response.success){
          let listData=this.props.menulist;
          let parentNode=this.queryParentNode(listData.data.list,record.pid);
          for(var i=0;i<parentNode.children.length;i++){
            if(parentNode.children[i].id===record.id){
              parentNode.children.splice(i,1);
              break;
            }
          }
          message.success('删除成功');
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
      type: 'menulist/add',
      payload: {
        ...fields
      },
      callback:(response)=>{
        this.changeConfirmLoadState();
        if(response.success){
          form.resetFields();
          message.success('添加成功');
          this.handleModalVisible();
          const data=this.props.menulist.data;;
          let datalist=data.list;
          let record=response.data;
          let parentNode=this.queryParentNode(datalist,record.pid);
          if(parentNode.children){
            parentNode.children.push(record);
          }else{
            parentNode.children=[record]
          }
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
      type: 'menulist/update',
      payload: {
        ...fields
      },
      callback:(response)=>{
        this.changeConfirmLoadState();
        if(response.success){
          message.success('修改成功');
          this.handleModalVisible();
          const data=this.props.menulist.data;;
          let datalist=data.list;
          let record=response.data;
          let parentNode=this.queryParentNode(datalist,record.pid);
          for(var i=0;i<parentNode.children.length;i++){
            if(parentNode.children[i].id===record.id){
              parentNode.children.splice(i,1,record);
              break;
            }
          }
        }else{
          message.error(response.message);
        }
      }
    })
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
      menulist: { data },
      loading,
    } = this.props;
    const { selectedRows, modalVisible, roleFormValues,pid,radioVal,confirmLoading} = this.state;
    const parentMethodsAndState = {
      handleAdd: this.handleAdd,
      handleUpdate:this.handleUpdate,
      handleModalVisible: this.handleModalVisible,
      pid:pid,
      radioSeleted:this.radioSeleted,
      modalVisible:modalVisible,
      radioVal:radioVal,
      confirmLoading:confirmLoading,
      roleFormValues:roleFormValues,
    };
    return (
      <PageHeaderWrapper title="菜单列表">
        <Card bordered={false}>
          <div className={styles.tableList}>
            <div className={styles.tableListForm}>{this.renderForm()}</div>
            <StandardTreeTable
              indentSize={8}
              loading={loading}
              data={data}
              columns={this.columns}
              onSelectRow={this.handleSelectRows}
              onChange={this.handleStandardTableChange}
            />
          </div>
        </Card>
        <CreateForm {...parentMethodsAndState} />
      </PageHeaderWrapper>
    );
  }
}

export default MenuList;
