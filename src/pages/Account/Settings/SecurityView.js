import React, { Component,PureComponent, Fragment } from 'react';
import { formatMessage, FormattedMessage } from 'umi/locale';
import { List,Form,Modal,Input,message,Icon } from 'antd';
import { connect } from 'dva';
// import { getTimeDistance } from '@/utils/utils';
const FormItem = Form.Item;
const passwordStrength = {
  strong: (
    <font className="strong">
      <FormattedMessage id="app.settings.security.strong" defaultMessage="Strong" />
    </font>
  ),
  medium: (
    <font className="medium">
      <FormattedMessage id="app.settings.security.medium" defaultMessage="Medium" />
    </font>
  ),
  weak: (
    <font className="weak">
      <FormattedMessage id="app.settings.security.weak" defaultMessage="Weak" />
    </font>
  ),
};

const PasswordForm = Form.create()(props => {
  const { passwordModalVisible ,form, confirmLoading , handlePasswordModalVisible,handleUpdatePassword} = props;
  const okHandle = () => {
    form.validateFields((err, fieldsValue) => {
      if (err) return;
      handleUpdatePassword(fieldsValue);
    });
  };
  return (
    <Modal
      destroyOnClose
      title={'修改密码'}
      width={640}
      visible={passwordModalVisible}
      confirmLoading={confirmLoading}
      onOk={okHandle}
      onCancel={() => handlePasswordModalVisible()}
    >
       <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 16 }} label="新密码">
        {form.getFieldDecorator('password', {
          rules: [{ required: true,min:6, message: '密码长度至少6位' }],
          initialValue:null,
        })(<Input prefix={<Icon type="lock" style={{ color: 'rgba(0,0,0,.25)' }} />} type='password' placeholder="请输入新密码！" />)}
      </FormItem>
    </Modal>
  );
});

const EmailForm = Form.create()(props => {
  const { emailModalVisible ,form, confirmLoading , handleEmailModalVisible,handleUpdateEmail} = props;
  const okHandle = () => {
    form.validateFields((err, fieldsValue) => {
      if (err) return;
      handleUpdateEmail(fieldsValue);
    });
  };
  const pattern ="^[a-zA-Z0-9_-]+@[a-zA-Z0-9_-]+(\.[a-zA-Z0-9_-]+)+$";
  return (
    <Modal
      destroyOnClose
      title={'修改邮箱'}
      width={640}
      visible={emailModalVisible}
      confirmLoading={confirmLoading}
      onOk={okHandle}
      onCancel={() => handleEmailModalVisible()}
    >
       <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 16 }} label="新邮箱">
        {form.getFieldDecorator('email', {
          rules: [{ required: true,pattern:pattern, message: '邮箱格式不正确' }],
          initialValue:null,
        })(<Input prefix={<Icon type="mail" style={{ color: 'rgba(0,0,0,.25)' }} />}  placeholder="请输入新邮箱！" />)}
      </FormItem>
    </Modal>
  );
});

const PhonoForm = Form.create()(props => {
  const { phonoModalVisible ,form, confirmLoading , handlePhonoModalVisible,handleUpdatePhono} = props;
  const okHandle = () => {
    form.validateFields((err, fieldsValue) => {
      if (err) return;
      handleUpdatePhono(fieldsValue);
    });
  };
  const pattern='^((13[0-9])|(14[5,7,9])|(15([0-3]|[5-9]))|(166)|(17[0,1,3,5,6,7,8])|(18[0-9])|(19[8|9]))\\d{8}$';
  return (
    <Modal
      destroyOnClose
      title={'修改手机号'}
      width={640}
      visible={phonoModalVisible}
      confirmLoading={confirmLoading}
      onOk={okHandle}
      onCancel={() => handlePhonoModalVisible()}
    >
       <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 16 }} label="新号码">
        {form.getFieldDecorator('phono_number', {
          rules: [{ required: true,pattern:pattern, message: '手机号码正确' }],
          initialValue:null,
        })(<Input prefix={<Icon type="mobile" style={{ color: 'rgba(0,0,0,.25)' }} />}  placeholder="请输入新号码！" />)}
      </FormItem>
    </Modal>
  );
});
@connect(({ securityview, loading }) => ({
  securityview,
  loading: loading.models.securityview,
}))
class SecurityView extends PureComponent {
  
  state = {
    passwordModalVisible:false,
    emailModalVisible:false,
    phonoModalVisible:false,
    // confirmLoading:false,//弹出框加载
  };

  componentDidMount() {
      const { dispatch } = this.props;
      dispatch({
        type: 'securityview/fetchUserSecurityInfo',
        payload: {},
      });
  }
  // example data
  getData = () => [
    {
      title: formatMessage({ id: 'app.settings.security.password' }, {}),
      description: (
        <Fragment>
          {formatMessage({ id: 'app.settings.security.password-description' })}：
          {passwordStrength.weak}
        </Fragment>
      ),
      actions: [
        <a >
          <FormattedMessage id="app.settings.security.modify" defaultMessage="Modify" />
        </a>,
      ],
    },
    {
      title: formatMessage({ id: 'app.settings.security.phone' }, {}),
      description: `${formatMessage(
        { id: 'app.settings.security.phone-description' },
        {}
      )}：138****8293`,
      actions: [
        <a>
          <FormattedMessage id="app.settings.security.modify" defaultMessage="Modify" />
        </a>,
      ],
    },
    {
      title: formatMessage({ id: 'app.settings.security.question' }, {}),
      description: formatMessage({ id: 'app.settings.security.question-description' }, {}),
      actions: [
        <a>
          <FormattedMessage id="app.settings.security.set" defaultMessage="Set" />
        </a>,
      ],
    },
    {
      title: formatMessage({ id: 'app.settings.security.email' }, {}),
      description: `${formatMessage(
        { id: 'app.settings.security.email-description' },
        {}
      )}：ant***sign.com`,
      actions: [
        <a>
          <FormattedMessage id="app.settings.security.modify" defaultMessage="Modify" />
        </a>,
      ],
    },
    {
      title: formatMessage({ id: 'app.settings.security.mfa' }, {}),
      description: formatMessage({ id: 'app.settings.security.mfa-description' }, {}),
      actions: [
        <a>
          <FormattedMessage id="app.settings.security.bind" defaultMessage="Bind" />
        </a>,
      ],
    },
  ];
  ////////////////////////////////////

  getUserSecurityInfoData =()=>{
      const {securityview:{userSecurityInfo}} = this.props;
      let phono_number="未绑定" ,email="未绑定";
      if(userSecurityInfo){
         phono_number=userSecurityInfo.phono_number
         email=userSecurityInfo.email
      }
      const data= [
          {
            title: formatMessage({ id: 'app.settings.security.password' }, {}),
            description: (
              <Fragment>
                {formatMessage({ id: 'app.settings.security.password-description' })}
                {passwordStrength.weak}
              </Fragment>
            ),
            actions: [
              <a onClick={() => this.handlePasswordModalVisible(true)}>
                <FormattedMessage id="app.settings.security.modify" defaultMessage="Modify" />
              </a>,
            ],
          },
          {
            title: formatMessage({ id: 'app.settings.security.phone' }, {}),
            description: `${formatMessage(
              { id: 'app.settings.security.phone-description' },
              {}
            )} ${phono_number}`,
            actions: [
              <a onClick={this.handlePhonoModalVisible}>
                <FormattedMessage id="app.settings.security.modify" defaultMessage="Modify" />
              </a>,
            ],
          },
          {
            title: formatMessage({ id: 'app.settings.security.email' }, {}),
            description: `${formatMessage(
              { id: 'app.settings.security.email-description' },
              {}
            )} ${email}`,
            actions: [
              <a  onClick={this.handleEmailModalVisible}>
                <FormattedMessage id="app.settings.security.modify" defaultMessage="Modify" />
              </a>,
            ],
          },
      ]
    return data;
  }

  handleCallback=(response)=>{
    if(response.success){
      message.success("修改成功");
    }else{
      message.error("修改失败");
    }
  }

  handleUpdatePassword=(values)=>{
    const { dispatch } = this.props;
    dispatch({
      type: 'securityview/updatePassword',
      payload:{
        ...values
      },
      callback:(response)=>{
        this.handleCallback(response);
        this.handlePasswordModalVisible(false);
      }
    });
  }

  handleUpdateEmail=(values)=>{
    const { dispatch } = this.props;
    dispatch({
      type: 'securityview/updateEmail',
      payload:{
        ...values
      },
      callback:(response)=>{
        this.handleCallback(response);
        this.handleEmailModalVisible(false);
      }
    });
  }

  handleUpdatePhono=(values)=>{
    const { dispatch } = this.props;
    dispatch({
      type: 'securityview/updatePhonoNo',
      payload:{
        ...values
      },
      callback:(response)=>{
        this.handleCallback(response);
        this.handlePhonoModalVisible(false);
      }
    });
  }

  //控制modal 显示/隐藏
  handlePasswordModalVisible = flag => {
    this.setState({
      passwordModalVisible: !!flag,
      //userFormValues: {},
    });
  }
  handleEmailModalVisible = flag => {
    this.setState({
      emailModalVisible: !!flag,
      //userFormValues: {},
    });
  }
  handlePhonoModalVisible = flag => {
    this.setState({
      phonoModalVisible: !!flag,
      //userFormValues: {},
    });
  }

  render() {
    const { passwordModalVisible,emailModalVisible,phonoModalVisible } = this.state;
    const { securityview:{ confirmLoading} } = this.props;
    
    const passwordModelProp={
      passwordModalVisible:passwordModalVisible,
      confirmLoading:confirmLoading,
      handlePasswordModalVisible:this.handlePasswordModalVisible,
      handleUpdatePassword:this.handleUpdatePassword,
    };
    const emailModelProp={
      emailModalVisible:emailModalVisible,
      confirmLoading:confirmLoading,
      handleEmailModalVisible:this.handleEmailModalVisible,
      handleUpdateEmail:this.handleUpdateEmail,
    };
    const phonoModelProp={
      phonoModalVisible:phonoModalVisible,
      confirmLoading:confirmLoading,
      handlePhonoModalVisible:this.handlePhonoModalVisible,
      handleUpdatePhono:this.handleUpdatePhono,
    };

    return (
      <Fragment>
        <List
          itemLayout="horizontal"
          dataSource={this.getUserSecurityInfoData()}
          renderItem={item => (
            <List.Item actions={item.actions} >
              <List.Item.Meta title={item.title} description={item.description} />
            </List.Item>
          )}
        />
        <PasswordForm {...passwordModelProp} />
        <EmailForm {...emailModelProp} />
        <PhonoForm {...phonoModelProp} />
      </Fragment>
    );
  }
}

export default SecurityView;
