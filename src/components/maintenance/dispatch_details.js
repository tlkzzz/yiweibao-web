/** 
 * @Description 位置体系-基本信息
 */
import React from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import actions from '../../actions/equipment.js';
import { createForm } from 'rc-form';
import { browserHistory } from 'react-router';
import Dropdown from '../../components/common/dropdown.js';
import SelectAsset from '../common/select_asset';
import { runActionsMethod } from '../../tools';

import { Icon, Button, Modal, Table, Pagination, Collapse, Form, Input,message, Row, Col, Select} from 'antd';
const Panel = Collapse.Panel;
const FormItem = Form.Item;
const Option = Select.Option;

class FormComponent extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            currentPage: 1,
            parentLocation: {},
            locationModalShow: false,
              servicePoints:[],//设备分类
        }
    }


 // 设备设施信息
    getList = () => {
         const { actions} = this.props;
            //查询公司下面所有的站点
         actions.getCompanyServicePoints('', (json) => {
                this.setState({servicePoints:json.result})
          });
    }

 componentWillMount () {
       this.getList();
    }



    render () {
        const { getFieldDecorator } = this.props.form;
    const servicePoints = this.state.servicePoints.map(p => <Option key={p.tspId}>{p.tspName}</Option>);
        return (
            <Form layout="vertical">
                <Row gutter={32} justify="start">
                    <Col className="gutter-row" xs={{ span:6}}>
                        <FormItem
                            label="所属网点"
                        >
                            {
                                getFieldDecorator('tseUnitid',{
                                    rules: [{ required: true,  message: '请选择站点!'}],
                                })(
                                 <Select size="large" style={{ width: '100%' }}     placeholder="请选择站点" >
                                       {servicePoints}
                                    </Select>
                                )
                            }
                        </FormItem>
                    </Col>
                    <Col className="gutter-row" xs={{ span: 9}}>
                        <FormItem
                            label="分类名称"
                        >
                            {
                                getFieldDecorator('tbName',{
                                  
                                    rules: [{ required: true, message: '分类名称不能为空' }],
                                })(
                                    <Input />
                                )
                            }
                        </FormItem>
                    </Col>
                </Row>
               
            </Form>
        )
    }
}
const NewFormComponent = Form.create()(FormComponent)


class WorkOrderOneComponent extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            saveLoading:false,
        }

        this.customPanelStyle = {
            background: '#fff',
            borderRadius: 2,
            marginBottom: 24,
            border: 0,
            boxShadow: '0 1px 6px rgba(0, 0, 0, 0.2)'
        };

       
    }

  
//位置体系详情页面保存
    locationDetailSave = () => {
        const  { actions, state , commonState, location } = this.props;
        // const isAdd = location.query.add_location;
        // const id = isAdd ? '' : (JSON.parse(localStorage.getItem('locations')).id);
        // const orgId = commonState.orgId;
        // const siteId = commonState.siteId;
        // let parentLocation = this.state.parentLocation;
        // let parentId = parentLocation.id;

        this.locationDetailAddForm.props.form.validateFields((err, values) => {
      
             if(err) {
                message.error("*是必填数据,使用年限是数字类型");
                return;
            } else {
             this.setState({saveLoading:true});
                actions.saveAssetType(values, (json) => {
                      this.setState({saveLoading:false});
                        if(json.code==200){
                            message.success(json.msg);
                           browserHistory.push(`/equipment/location`);
                        }else{
                            message.error(json.msg);
                        }
                    });  




            }


       })
    }


    componentWillMount () {
      
    }
    render () {
        const { state, location ,actions} = this.props;
     

        return (
            <div className="eam-tab-page">
                <div className="eam-content">
                    <Collapse bordered={false} defaultActiveKey={['1', '2']}>
                        <Panel header={<span className="label">基本信息 <Icon type="caret-down" /></span>} key="1" style={this.customPanelStyle}>
                            <div className="panel-tools-right">
                                <Button size="large" type="primary" loading={this.state.saveLoading} onClick={this.locationDetailSave}>保存</Button>
                            </div>
                            <NewFormComponent
                                actions={actions}
                                location={location}
                           
                                wrappedComponentRef={locationDetailAddForm => this.locationDetailAddForm = locationDetailAddForm}
                            />
                        </Panel>
                      
                    </Collapse>
                </div>
            </div>
        )
    }
}


function mapStateToProps (state) {
    return {
        state: state.equipment,
    }
}

function buildActionDispatcher(dispatch) {
    return {
        actions: bindActionCreators(actions, dispatch),
    }
}

export default connect(mapStateToProps, buildActionDispatcher)(WorkOrderOneComponent);
