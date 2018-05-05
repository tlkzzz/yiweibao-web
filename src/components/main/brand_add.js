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



class BrandAddFormComponent extends React.Component {
    constructor(props) {
        super(props);

         this.state = {
          loading:false,
         };

        this.customPanelStyle = {
            background: '#fff',
            borderRadius: 2,
            marginBottom: 24,
            border: 0,
            boxShadow: '0 1px 6px rgba(0, 0, 0, 0.2)'
        };
    }


  
   
   
  
   

    componentWillMount () {
        // const { actions, location , commonState } = this.props;
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
                  
                  e.preventDefault();
                     this.props.form.validateFieldsAndScroll((err, values) => {
                      if (!err) {
                        console.log('Received values of form: ', values);
                      //  console.log(this.state.fileList);



                      }
                    });
                }


                


    render () {
       const { getFieldDecorator } = this.props.form;

       const formItemLayout = {
        labelCol: { span: 6 },
        wrapperCol: { span: 8 },
      };
     
            
        return (
            <div className="eam-tab-page">
            	<div className="main-nav clearfix">
                 
                    <Link to="/main/settings/employee" activeClassName="active" className="active" >项目管理</Link>
                </div>
                <div className="eam-content">
                    <Collapse bordered={false} defaultActiveKey={['1', '2']}>
                      
                        <Panel header={<span className="label">新增 <Icon type="caret-down" /></span>} key="1" style={this.customPanelStyle}>
         <Form onSubmit={this.handleSubmit}>



        <FormItem
          {...formItemLayout}
          label=""
        >
          <span className="ant-form-text">项目信息</span>
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
              <Option value="china">China</Option>
              <Option value="use">U.S.A</Option>
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
          wrapperCol={{ span: 12, offset: 6 }}
        >
          <Button type="primary" loading={this.state.loading}  htmlType="submit">保存</Button>
        </FormItem>
      </Form>


                        </Panel>

                    </Collapse>
                </div>
      
            </div>
        )
    }
}

const BrandAddComponent = Form.create()(BrandAddFormComponent);


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

export default connect(mapStateToProps, buildActionDispatcher)(BrandAddComponent);
