import React, { Component, Fragment } from 'react';
import { formatMessage, FormattedMessage } from 'umi/locale';
import { Form, Input, Upload, Select, Button,TreeSelect,message  } from 'antd';
import { connect } from 'dva';
import styles from './BaseView.less';
import GeographicView from './GeographicView';
import PhoneView from './PhoneView';
// import { getTimeDistance } from '@/utils/utils';

const FormItem = Form.Item;
const { Option } = Select;

// 头像组件 方便以后独立，增加裁剪之类的功能
const AvatarView = ({ avatar }) => (
  <Fragment>
    <div className={styles.avatar_title}>
      <FormattedMessage id="app.settings.basic.avatar" defaultMessage="Avatar" />
    </div>
    <div className={styles.avatar}>
      <img src={avatar} alt="avatar" />
    </div>
    <Upload fileList={[]}>
      <div className={styles.button_view}>
        <Button icon="upload">
          <FormattedMessage id="app.settings.basic.change-avatar" defaultMessage="Change avatar" />
        </Button>
      </div>
    </Upload>
  </Fragment>
);

const validatorGeographic = (rule, value, callback) => {
  if(!value){
    callback("请选择省市");
    callback();
    return;
  }
  const { province, city } = value;
  if (!province.key) {
    callback('请选择所在省!');
  }
  if (!city.key) {
    callback('请选择所在市!');
  }
  callback();
};

const validatorPhone = (rule, value, callback) => {
  let values 
  if(!value){
    callback('请输入电话号码!');
  }else{
    values=value.split('-');
  }
  if (values && !values[0]) {
    callback('请输入电话区号!');
  }
  if (values && !values[1]) {
    callback('请输入电话号码!');
  }
  callback();
};

@connect(({ user }) => ({
  currentUser: user.currentUser,
}))
@Form.create()
class BaseView extends Component {
  
  state={
    loading:false,
  }

  componentDidMount() {
    this.setBaseInfo();
  }

  setBaseInfo = () => {
    const { currentUser, form } = this.props;
    Object.keys(form.getFieldsValue()).forEach(key => {
      const obj = {};
      obj[key] = currentUser[key] || null;
      form.setFieldsValue(obj);
    });
  };

  getAvatarURL() {
    const { currentUser } = this.props;
    if (currentUser.avatar) {
      return currentUser.avatar;
    }
    const url = 'https://gw.alipayobjects.com/zos/rmsportal/BiazfanxmamNRoxxVxka.png';
    return url;
  }

  handleSubmit=e=>{
    const { dispatch, form ,currentUser} = this.props;

    form.validateFields((err, fieldsValue) => {
      if (err) return;
      this.setState({
        loading: true,
      });  
      dispatch({
        type: 'user/updateBaseInfo',
        payload: fieldsValue,
        callback:(response)=>{
          this.setState({
            loading: false,
          });  
          if(response.success){
            message.success('更新成功');
          }else{
            message.error('更新失败');
          }
        }
      });
    });
  }

  getViewDom = ref => {
    this.view = ref;
  };

  render() {
    const {
      form: { getFieldDecorator },
    } = this.props;
    const {loading} = this.state;
    return (
      <div className={styles.baseView} ref={this.getViewDom}>
        <div className={styles.left}>
          <Form layout="vertical"  >
            <FormItem >
              {getFieldDecorator('id', {
                rules: [
                ],
              })(<Input type="hidden" disabled={true} />)}
            </FormItem>
            <FormItem label={formatMessage({ id: 'app.settings.basic.email' })}>
              {getFieldDecorator('email', {
                rules: [
                  {
                    required: true,
                    message: formatMessage({ id: 'app.settings.basic.email-message' }, {}),
                  },
                ],
              })(<Input disabled={true} />)}
            </FormItem>
            <FormItem label={'账号'}>
              {getFieldDecorator('user_name', {
                rules: [
                  {
                    required: true,
                    message: formatMessage({ id: 'app.settings.basic.nickname-message' }, {}),
                  },
                ],
              })(<Input disabled={true} />)}
            </FormItem>
            <FormItem label={'真实姓名'}>
              {getFieldDecorator('real_name', {
                rules: [
                  {
                    required: true,
                    message: '请填写真实姓名',
                  },
                ],
              })(<Input disabled={true} />)}
            </FormItem>
            <FormItem label={formatMessage({ id: 'app.settings.basic.profile' })}>
              {getFieldDecorator('profile', {
                rules: [
                  {
                    required: false,
                    max: 20,
                    message: formatMessage({ id: 'app.settings.basic.profile-message' }, {}),
                  },
                ],
              })(
                <Input.TextArea
                  placeholder={formatMessage({ id: 'app.settings.basic.profile-placeholder' })}
                  rows={4}
                />
              )}
            </FormItem>
            <FormItem label={"个人签名"}>
              {getFieldDecorator('signature', {
                rules: [
                  {
                    required: false,
                    max: 20,
                    message: '请输入个人签名（最多20个字）',
                  },
                ],
              })(
                <Input.TextArea
                  placeholder={'请输入个人签名（最多20个字）'}
                  rows={4}
                />
              )}
            </FormItem>
            <FormItem label={'所属机构'}>
              {getFieldDecorator('organ', {
                rules: [
                  {
                    required: false,
                    max: 20,
                    message: '请选择机构',
                  },
                ],
              })(
                <Input disabled={true} />
              )}
            </FormItem>
            <FormItem label={formatMessage({ id: 'app.settings.basic.country' })}>
              {getFieldDecorator('countryCode', {
                rules: [
                  {
                    required: true,
                    message: formatMessage({ id: 'app.settings.basic.country-message' }, {}),
                  },
                ],
                initialValue: 'China',
              })(
                <Select style={{ maxWidth: 220 }}>
                  <Option value="China">中国</Option>
                </Select>
              )}
            </FormItem>
            <FormItem label={formatMessage({ id: 'app.settings.basic.geographic' })}>
              {getFieldDecorator('geographic', {
                rules: [
                  {
                    required: true,
                    message: formatMessage({ id: 'app.settings.basic.geographic-message' }, {}),
                  },
                  {
                    validator: validatorGeographic,
                  },
                ],
              })(<GeographicView />)}
            </FormItem>
            <FormItem label={formatMessage({ id: 'app.settings.basic.address' })}>
              {getFieldDecorator('address', {
                rules: [
                  {
                    required: true,
                    message: formatMessage({ id: 'app.settings.basic.address-message' }, {}),
                  },
                ],
              })(<Input />)}
            </FormItem>
            <FormItem label={formatMessage({ id: 'app.settings.basic.phone' })}>
              {getFieldDecorator('telphone', {
                rules: [
                  {
                    required: true,
                    message: formatMessage({ id: 'app.settings.basic.phone-message' }, {}),
                  },
                  { validator: validatorPhone },
                ],
              })(<PhoneView />)}
            </FormItem>
            <Button type="primary" loading={loading} onClick={this.handleSubmit}>
              <FormattedMessage
                id="app.settings.basic.update"
                defaultMessage="Update Information"
              />
            </Button>
          </Form>
        </div>
        <div className={styles.right}>
          <AvatarView avatar={this.getAvatarURL()} />
        </div>
      </div>
    );
  }
}

export default BaseView;
