import React, { Component, Suspense } from 'react';
import moment from 'moment';
// import 'moment/locale/zh-cn';
// moment.locale('zh-cn');
import { Row, Col, Icon, Menu, Dropdown,Card,Form,Input,Select,Button,InputNumber,DatePicker,Radio     } from 'antd';
import styles from './SearchTool.less';

const FormItem = Form.Item;
const RadioGroup = Radio.Group;
const { MonthPicker, RangePicker, WeekPicker } = DatePicker;

@Form.create()
class SearchTool extends  Component{

	state={
		dateType:2,
		beginTime:moment(new Date(),'YYYYMM').add(-3,'month'),
		endTime:moment(new Date(),'YYYYMM'),
		mode:'month',
		format:'YYYYMM',
		loading:false,
		
	}

	changeRadioValue=(radio)=>{
		let {mode,format}=this.state;
		const v=radio.target.value;
		if(v==1){
			mode="date";
			format='YYYYMMDD'
		}else if(v==2){
			mode="month"
			format='YYYYMM'
		}else if(v==4){
			mode="year"
			format='YYYY'
		}
		this.setState({
			dateType:v,
			mode:mode,
			format:format,
		});
	}

	selectBeginTime=(date,dateString)=>{
		const {endOpen} = this.state
		this.setState({
			beginTime:date,
			
		});

	}
	selectEndTime=(date,dateString)=>{
		this.setState({
			endTime:date,
		});
	}

	handleSubmit=(e)=>{
		e.preventDefault();
        const { dispatch, form, } = this.props;
        this.setState({loading:true});
        form.validateFields((err, fieldsValue) => {
	      if (err){
	        this.setState({loading:false});
	        return;
	      } 
	      setTimeout(this.setState({loading:false}), 50000)
	      //dispather
	    });
	}


	render(){
	   const {form: { getFieldDecorator }} = this.props;
	    const { dateType,beginTime,endTime,mode,format,loading} =this.state;
	    const curentDate=new Date();
	    
	    return (
	       <div className={styles.tableListForm}>
		      <Form onSubmit={this.handleSubmit} layout="inline" hideRequiredMark={true}>
		        <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
		          <Col md={8} sm={24}>
		            <FormItem label="日期类型" >
		              {getFieldDecorator('dateType',{
		              	rules: [{ required: true, message: '请选择' }],
			              valuePropName:'checked',
			              initialValue:dateType,
		              })(
		              	<RadioGroup  name='dateType' defaultValue={dateType}  onChange={(v)=>this.changeRadioValue(v)} >
				              <Radio value={4}>年</Radio>
				              <Radio value={2}>月</Radio>
				              <Radio value={1}>日</Radio>
				        </RadioGroup>)}
		            </FormItem>
		          </Col>
		          <Col md={4} sm={24}>
		            <FormItem label="开始日期" >
		              {getFieldDecorator('beginTime',{
		              	rules: [{ required: true, message: '请选择日期' }],
		              	initialValue:beginTime,
		              })(
		               <DatePicker mode={mode} autoFocus={true}   allowClear={false}  onPanelChange={(date,dateString)=>this.selectBeginTime(date,dateString)} 
		               	  readonly='readonly' 
		               	 format={format}
		                 style={{ width: '100%' }} />
		              )}
		            </FormItem>
		          </Col>
		          <Col md={4} sm={24}>
		            <FormItem label="结束日期">
		              {getFieldDecorator('endTime',{
		              	rules: [{ required: true, message: '请选择日期' }],
		              	initialValue:endTime,
		              })(
		               <DatePicker mode={mode}   readonly='readonly'  allowClear={false}  onPanelChange={(date,dateString)=>this.selectEndTime(date,dateString)}
		               
		                format={format}
		                style={{ width: '100%' }} />
		              )}
		            </FormItem>
		          </Col>
		          <Col md={8} sm={24}>
		            <FormItem label="所在区域">
		              {getFieldDecorator('area')(
		              	<Select placeholder="请选择" style={{ width: '100%' }}>
		                  <Select.Option value="0">上海</Select.Option>
		                  <Select.Option value="1">北京</Select.Option>
		                </Select>
		              )}
		            </FormItem>
		          </Col>
		        </Row>
		        <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
		          <Col md={8} sm={24}>
		            <FormItem label="机构类型">
		              {getFieldDecorator('orgType')(
		               	<Select placeholder="请选择" style={{ width: '100%' }}>
		                  <Select.Option value="0">综合</Select.Option>
		                  <Select.Option value="1">专科</Select.Option>
		                </Select>
		              )}
		            </FormItem>
		          </Col>
		          <Col md={8} sm={24}>
		            <FormItem label="机构列表">
		              {getFieldDecorator('org_code',{
		              	rules: [{ required: true, message: '请选择机构' }],
		              })(
		                <Select placeholder="请选择" style={{ width: '100%' }}>
		                  <Select.Option value="0">北大人民</Select.Option>
		                  <Select.Option value="1">复旦华山</Select.Option>
		                </Select>
		              )}
		            </FormItem>
		          </Col>
		          <Col md={8} sm={24}>
		            <div style={{ overflow: 'hidden' }}>
			          <div style={{ marginBottom: 24 }}>
			            <Button loading={loading} type="primary" htmlType="submit">
			              查询
			            </Button>
			          </div>
			        </div>
		          </Col>
		        </Row>
		      </Form>
	      </div>
	    );

	}

}
export default SearchTool;