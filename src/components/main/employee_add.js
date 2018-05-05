/** 
 * @Description  二维码--详情页
 */
import React from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { Link , browserHistory } from 'react-router';
import actions from '../../actions/main.js';
import commonActions from '../../actions/common';
import { createForm } from 'rc-form';

import Dropdown from '../../components/common/dropdown.js';
import SelectPublic from '../../components/common/select_public.js';
import BackList from '../common/back_list';
import EAModal from '../../components/common/modal.js';

import { filterArrByAttr, correspondenceJson } from '../../tools/';

import moment from 'moment';

import { Icon, Button, Upload, Table,InputNumber, Pagination,Switch,Rate, Radio , Collapse, Form, Input, Row, Col, Select, DatePicker, Checkbox, Menu, message, Modal} from 'antd';
const Panel = Collapse.Panel;
const FormItem = Form.Item;
const Option = Select.Option;
const confirm = Modal.confirm;
const RadioButton = Radio.Button;
const RadioGroup = Radio.Group;



class EmployeeAddFormComponent extends React.Component {
    constructor(props) {
        super(props);

         this.state = {
        confirmDirty: false,
        autoCompleteResult: [],
        previewVisible: false,
        fileList: [],
        upload_url:[],
        selectData:[],
        loading:false,
         };

        this.customPanelStyle = {
            background: '#fff',
            borderRadius: 2,
            marginBottom: 24,
            border: 0,
            boxShadow: '0 1px 6px rgba(0, 0, 0, 0.2)'
        };
        const { location } = this.props;


       
    }


  
   
   
  
   
    //页面加载方法
    componentWillMount () {
        const { actions, location} = this.props;
        //查询公司下面所有的站点
         actions.getCompanyServicePoints('', (json) => {
              if(json.code==200){
                this.setState({selectData:json.result})
              }
          });


        // const isAdd = location.query.add_code;
        // if (isAdd) {
        //     actions.codeGetList({modelKey: 'qrCode', siteId : commonState.siteId});
        //     actions.updateList({id: ''}, () => {
        //         this.setState({
        //             taskstepsLoading: false,
        //         })
        //     });
        // }else{
        //     this.getList();
        // }
    }

                //提交数据
                handleSubmit = (e) => {
                     // console.log(this.state.fileList);
                  e.preventDefault();
                    this.props.form.validateFieldsAndScroll((err, values) => {  
                      if (!err) {
                        console.log(values);
                        // console.log(this.state.fileList);
                        let to = this.state.fileList;
                        let logo='';
                        // if(to.length !=0){
                        //   if(to[0].response.code==200){
                        //     logo = to[0].response.result;
                        //   }
                        // }
                             let object =  Object.assign({},{tcLogo:logo},values);
                             console.log(object);
                           const { actions} = this.props;
                           
                           this.setState({loading:true});

                  //查询公司下面所有的站点
                   actions.addEmployee(object, (json) => {
                      this.setState({loading:false});
                        if(json.code==200){
                            message.success(json.msg);
                              location.href = '/main/settings/employee';

                        }else{
                            message.error(json.msg);
                        }
                    });
   


                      }
                    });
                }

                  //密码二次验证
                     compareToFirstPassword = (rule, value, callback) => {
                    const form = this.props.form;
                    if (value && value !== form.getFieldValue('password')) {
                      callback('两次密码不一致!');
                    } else {
                      callback();
                    }
                  }
                  //密码二次验证
                  validateToNextPassword = (rule, value, callback) => {
                    const form = this.props.form;
                    if (value && this.state.confirmDirty) {
                      form.validateFields(['confirm'], { force: true });
                    }
                    callback();
                  }
                  //预览图片
                  handleCancel = () => this.setState({ previewVisible: false })
                  //预览图片
                  handlePreview = (file) => {
                    this.setState({
                      previewImage: file.url || file.thumbUrl,
                      previewVisible: true,
                    });
                  }
                 // 图片上传回调
                 handleChange = ({fileList }) => {
                         console.log(fileList);

                         if(fileList.length!=0){
                            // console.log(fileList.length)

                            
                         fileList.forEach(function(value,key,arr){
                              console.log(value)    // 结果依次为1，2，3

                              if(value.response){
                                if(value.response.code==200){
                                     value.status = 'success';
                                    console.log('result');
                                    console.log(value.response.result);
                                    
                                }else{
                                     value.status = 'error';
                                     message.error(value.response.msg);
                                }
                              }
                            })
                         }

                        // this.props.ImgUploadBack(fileList);

                       this.setState({ fileList });
                      }



    render () {
       const { getFieldDecorator } = this.props.form;
       const formItemLayout = {
          labelCol: { span: 6 },
          wrapperCol: { span: 8 },
        };
      const uploadButton = (
        <div>
          <Icon type="plus" />
          <div className="ant-upload-text">Upload</div>
        </div>
       );
         

        const provinceOptions = this.state.selectData.map(p => <Option key={p.tspId}>{p.tspName}</Option>);

        return (
            <div className="eam-tab-page">
            	<div className="main-nav clearfix">
                 
                    <Link to="/main/settings/employee" activeClassName="active" className="active" >员工管理</Link>
                </div>
                <div className="eam-content">
                    <Collapse bordered={false} defaultActiveKey={['1', '2']}>
                      
                        <Panel header={<span className="label">新增 <Icon type="caret-down" /></span>} key="1" style={this.customPanelStyle}>
                  <Form onSubmit={this.handleSubmit}>



        <FormItem
          {...formItemLayout}
          label=""
        >
          <span className="ant-form-text">员工信息</span>
        </FormItem>

         <FormItem
          {...formItemLayout}
          label="上传头像："
         
        >
          {getFieldDecorator('upload')(
             <div className="clearfix">
        <Upload
          action="http://localhost:8080/upload/uploadFile"
          listType="picture-card"
          fileList={this.state.fileList}
          onPreview={this.handlePreview}
          onChange={this.handleChange}
          
        >
          {this.state.fileList.length >= 1 ? null : uploadButton}
        </Upload>
        <Modal visible={this.state.previewVisible} footer={null} onCancel={this.handleCancel}>
          <img alt="example" style={{ width: '100%' }} src={this.state.previewImage} />
        </Modal>
      </div>
          )}
        </FormItem>




        <FormItem
          {...formItemLayout}
          label="所属站点："
          
        >
          {getFieldDecorator('tseUnitid', {
            rules: [
              { required: true, message: '请选择站点!' },
            ],
          })(
            <Select placeholder="请选择站点">
             {provinceOptions}
            </Select>
          )}
        </FormItem>



        <FormItem
          {...formItemLayout}
          label="员工姓名："
        >
          {getFieldDecorator('tseName', { 
           rules: [
              { required: true, message: '请输入员工姓名!'},
            ], 
        })(
            <Input />
          )}
        </FormItem>
        <FormItem
          {...formItemLayout}
          label="员工编码："
        >
          {getFieldDecorator('tseNumber', { 
           rules: [
              { required: true, message: '请输入员工编号!'},
            ], 
        })(
            <Input />
          )}
        </FormItem>





        <FormItem
          {...formItemLayout}
          label="联系电话："
        >
          {getFieldDecorator('tseMobile', { 
           rules: [
              { required: true, message: 'Please select your favourite colors!' },
            ], 
        })(
            <InputNumber />
          )}
        </FormItem>

       


        <FormItem
          {...formItemLayout}
          label="性别"
        >
          {getFieldDecorator('sex',{
                initialValue: '1',
                  rules: [{
                  required: true, message: '请选择性别',
                }],
          })(
            <RadioGroup>
              <Radio checked="checked" value="1">男</Radio>
              <Radio value="0">女</Radio>
            </RadioGroup>
          )}
        </FormItem>




           <FormItem
          {...formItemLayout}
          label=""
        >
          <span className="ant-form-text">账号信息</span>
        </FormItem>

                     <FormItem
                      {...formItemLayout}
                      label="登录账号："
                    >
                      {getFieldDecorator('tseLoginUser', { 
                       rules: [
                          { required: true, message: '请输入登陆账号' },
                        ], 
                    })(
                        <Input />
                      )}
                    </FormItem>
                                <FormItem
                      {...formItemLayout}
                      label="密码"
                    >
                      {getFieldDecorator('password', {
                        rules: [{
                          required: true, message: 'Please input your password!',
                        }, {
                          validator: this.validateToNextPassword,
                        }],
                      })(
                        <Input type="password" />
                      )}
                    </FormItem>
                    <FormItem
                      {...formItemLayout}
                      label="确认密码"
                    >
                      {getFieldDecorator('confirm', {
                        rules: [{
                          required: true, message: 'Please confirm your password!',
                        }, {
                          validator: this.compareToFirstPassword,
                        }],
                      })(
                        <Input type="password" onBlur={this.handleConfirmBlur} />
                      )}
                    </FormItem>

        <FormItem
          wrapperCol={{ span: 12, offset: 6 }}
        >
          <Button type="primary" loading={this.state.loading} htmlType="submit">保存</Button>
        </FormItem>
      </Form>


                        </Panel>

                    </Collapse>
                </div>
      
            </div>
        )
    }
}

const EmployeeAddComponent = Form.create()(EmployeeAddFormComponent);


function mapStateToProps (state) {
    return {
        state: state.main,
    }
}

function buildActionDispatcher(dispatch) {
    return {
        actions: bindActionCreators(actions, dispatch),
    }
}

export default connect(mapStateToProps, buildActionDispatcher)(EmployeeAddComponent);
