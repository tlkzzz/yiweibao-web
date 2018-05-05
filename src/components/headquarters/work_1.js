/**
  * @Description 总部事务-工作计划
 */
import React from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import actions from '../../actions/headquarters.js';
import commonActions from '../../actions/common.js';
import Dropdown from '../../components/common/dropdown.js';
import EamModal from '../../components/common/modal.js';
import moment from 'moment';

import { Icon, Button, notification ,Upload, Tabs, Modal, Checkbox, Spin, Table, Pagination, Collapse, Tree, Form, Input, Row, Col, Select, DatePicker,message } from 'antd';
const Panel = Collapse.Panel;
const FormItem = Form.Item;
const { TextArea } = Input;
const Option = Select.Option


//频率信息
class FrequencyComponent extends React.Component {
    render () {
        const { getFieldDecorator } = this.props.form;
        const { data } = this.props;
        return (
            <Form layout="vertical">
                <Row gutter={16} justify="start">
                    <Col className="gutter-row" xs={{ span: 6}}>
                        <FormItem
                            label="工作频率"
                        >
                            {
                                getFieldDecorator('vendorId ',{
                                  initialValue : data ? data.vendorId : ''
                                })(
                                  <Select size="large" style={{ width: '100%' }}>
                                      <Option value="请选择">请选择</Option>
                                      <Option value="工作频率">工作频率</Option>
                                      <Option value="检查频率">检查频率</Option>
                                  </Select>
                                )
                            }
                        </FormItem>
                    </Col>
                    <Col className="gutter-row" xs={{ span: 6}}>
                        <FormItem
                            label="起始日期"
                        >
                            {
                              getFieldDecorator('manufacturer  ',{
                                initialValue : data ? data.manufacturer  : ''
                              })(
                                  <Input readOnly suffix={<Icon type="calendar" />} />
                                )
                            }
                        </FormItem>
                    </Col>
                    <Col className="gutter-row" xs={{ span: 6}}>
                        <FormItem
                            label="执行频次"
                        >
                            {
                              getFieldDecorator('serialNum  ',{
                                initialValue : data ? data.serialNum  : ''
                              })(
                                    <Input  readOnly/>
                                )
                            }
                        </FormItem>
                    </Col>
                    <Col className="gutter-row" xs={{ span: 6}}>
                        <FormItem
                            label="执行频率"
                        >
                            {
                              getFieldDecorator('purchasePrice   ',{
                                initialValue : data ? data.purchasePrice   : ''
                              })(
                                <Select size="large" style={{ width: '100%' }}>
                                    <Option value="请选择">请选择</Option>
                                    <Option value="天">天</Option>
                                    <Option value="月">月</Option>
                                    <Option value="年">年</Option>
                                </Select>
                                )
                            }
                        </FormItem>
                    </Col>
                </Row>
            </Form>
        )
    }
}
const BFormComponent = Form.create()(FrequencyComponent);
class WorkOrderOneComponent extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            currentPage: 1,
        }

        this.customPanelStyle = {
            background: '#fff',
            borderRadius: 2,
            marginBottom: 24,
            border: 0,
            boxShadow: '0 1px 6px rgba(0, 0, 0, 0.2)'
        };

        this.taskParam = {
            id: localStorage.ipId,
            pageNum: 1,
            pageSize: 10,
        };
        let defaultRender = (text, record, key) => {
            return (
                <p>{text ? text : '-'}</p>
            )
        };

        //表格字段
        this.columns = [
            {
                title: '序号',
                dataIndex: 'code',
                key: 'code',
                sorter: true,
                render: defaultRender
            },
            {
                title: '内容描述',
                dataIndex: 'name',
                key: 'name',
                sorter: true,
                render: defaultRender
            },
            {
                title: '操作',
                dataIndex: '4',
                key: '4',
                width: 120,
                render: (text, record, key) => {
                    return (
                        <div className="table-icon-group">
                            <Icon
                                type="delete"
                            />
                        </div>
                    )
                }
            },
        ];
    }

    getPlanDetail = (data) => {
        const { actions } = this.props;
        if(data != "" || data != null){

            let param = {id:data};
            actions.getPlanDetail(param, (json) => {
                localStorage.setItem("planDetail",JSON.stringify(json));
            });
        }

    }
    componentDidUpdate() {
        const {state, actions} = this.props;
        if(state.getFormValues==true){
            actions.getFormValues(false);
            this.formDataSave();
        }
    }
    //保存
    formDataSave = () => {
        const { actions,commonState } = this.props;
         if (__DEV__) console.log("commonState",commonState)
        this.props.form.validateFields((err, values) => {
            if (err) {
                for (let attr in err) {
                    message.warning(err[attr].errors[0].message);
                    // notification.warning({
                    //     message: '警告',
                    //     description: err[attr].errors[0].message
                    // });
                }
            }
            if (!err) {
                
                values.validStartDate = moment(values.validStartDate).format('YYYY-MM-DD HH:mm:ss');
                values.validEndDate = moment(values.validEndDate).format('YYYY-MM-DD HH:mm:ss');
                
                 if (__DEV__) console.log("values",values);
                let param = {
                        ...values,
                        orgId: commonState.orgId,
                        siteId: commonState.siteId,
                        }
                actions.savePlanDetail(param, (msg) => {
                     if (__DEV__) console.log("msg",msg)
                    if (msg.success) {
                        //更新数据
                        message.success("保存成功");

                        param = {id: msg.data.id};
                        actions.getPlanDetail(param, (json) => {
                        });
                        localStorage.setItem('workId', msg.data.id );

                    } else {
                        message.error(msg.msg);
                    }
                });
            }
        });
    }
    componentWillMount () {
        const id = localStorage.getItem("workId")
        const { state, commonState,commonActions } = this.props;
        if(id){
            if (__DEV__)console.log("修改")
            state.routineIsAdd=false
            this.getPlanDetail(id);
        }else{
            if (__DEV__)console.log("添加")
            
            state.routineIsAdd=true
            state.planDetail='';
            let  param = {
                modelKey: "hq_zbjp",
                orgId: commonState.orgId,
                siteId: commonState.siteId
            };
            commonActions.codeGenerator(param, () => {
                this.setState({tableLoading: false});
            });
        }
        const domainValueParam = {
            orgId: commonState.orgId,
            siteId: commonState.siteId,
            prodId: 'EAM'
        }
        commonActions.getDomainValue(domainValueParam, 'checkItem', 'CHECKITEM');//检查项
        commonActions.getDomainValue(domainValueParam, 'HQPlanStatus', 'HQ_PLAN_TYPE');//状态
        commonActions.getDomainValue(domainValueParam, 'HQPlanNature', 'HQ_PLAN_NATURE');//计划性质
        
    }
    render () {
        const { getFieldDecorator } = this.props.form;
        const { state, commonState } = this.props;
        const data = state.planDetail;
        const code = commonState.codeEntity ;
    //   const list = data.list;
        const checkItems= commonState.checkItem==undefined?[]:commonState.checkItem;
        const hqPlanNature= commonState.hqPlanNature==undefined?[]:commonState.hqPlanNature;
        const hqPlanType= commonState.hqPlanType==undefined?[]:commonState.hqPlanType;
        const siteList = commonState.siteList ? commonState.siteList : [];

        
        return (
            <div className="eam-tab-page">
                <div className="eam-content">
                    <Collapse bordered={false} defaultActiveKey={['1', '2', '3']}>
                        <Panel header={<span className="label">计划信息 <Icon type="caret-down" /></span>} key="1" style={this.customPanelStyle}>
                            <Form layout="vertical">
                                <Row gutter={16} justify="start">
                                    <Col className="gutter-row" xs={{ span: 6}}>
                                        <FormItem
                                            label="计划编号"
                                        >
                                            {
                                                getFieldDecorator('planNum',{
                                                    rules: [{ required: true, message: '计划编号不能为空' }],
                                                    initialValue: data ? data.planNum : code
                                                })(
                                                    <Input  readOnly/>
                                                )
                                            }
                                            {
                                                getFieldDecorator('id',{
                                                    initialValue: data ? data.id : ''
                                                })(
                                                    <Input type="hidden" />
                                                )
                                            }
                                        </FormItem>
                                    </Col>
                                    <Col className="gutter-row" xs={{ span: 6}} >
                                        <FormItem
                                            label="计划名称"
                                        >
                                            {
                                                getFieldDecorator('planName',{
                                                    initialValue: data ? data.planName : '',
                                                    rules: [
                                                        { required: true, message: '请填写计划名称！'},
                                                        { max: 200, message: '计划名称长度不能超过30字符长度！'}
                                                    ]
                                                })
                                                (
                                                    <Input />
                                                )
                                            }
                                        </FormItem>
                                    </Col>
                                    <Col className="gutter-row" xs={{ span: 6}} >
                                        <FormItem
                                            label="计划性质"
                                        >
                                            {
                                                getFieldDecorator('nature', {
                                                    initialValue: data ? data.nature : '',
                                                    rules: [
                                                        { required: true, message: '请选择计划性质！'},

                                                    ]
                                                })(
                                                    <Select size="large" style={{ width: '100%' }}>
                                                        {
                                                            hqPlanNature.map((item, i) => <Option key={i}  value={item.value}>{item.description}</Option>)
                                                        }
                                                    </Select>
                                                )
                                            }
                                        </FormItem>
                                    </Col>
                                    <Col className="gutter-row" xs={{ span: 6}} >
                                        <FormItem
                                            label="计划状态"
                                        >
                                            {
                                                getFieldDecorator('status', {
                                                    initialValue: data ? data.status : '',
                                                    rules: [
                                                        { required: true, message: '请选择计划状态！'},
                                                    ]
                                                })(
                                                    <Select size="large" style={{ width: '100%' }}>
                                                        {
                                                            hqPlanType.map((item, i) => <Option key={i}  value={item.value}>{item.description}</Option>)
                                                        }
                                                    </Select>
                                                )
                                            }
                                        </FormItem>
                                    </Col>
                                </Row>
                                <Row gutter={16} justify="start">
                                    <Col className="gutter-row" xs={{ span: 12}}>
                                        <FormItem
                                            label="计划描述"
                                        >
                                            {
                                                getFieldDecorator('description', {
                                                    initialValue: data? data.description : '',
                                                    rules: [
                                                        { max: 200, message: '计划描述长度不能超过300字符长度！'}
                                                    ]
                                                })(
                                                    <TextArea />
                                                )
                                            }
                                        </FormItem>
                                    </Col>
                                    <Col className="gutter-row" xs={{ span: 12}}>
                                        <FormItem
                                            label="计划应用范围"
                                        >
                                            {
                                                getFieldDecorator('planSite', {
                                                    initialValue: data.planSite ? data.planSite : [],
                                                    rules: [
                                                        { required: true, message: '请选择计划应用范围！'},
                                                    ]
                                                })(
                                                    <Select  size="large" style={{width: '100%'}} mode="multiple">
                                                        {
                                                            siteList.map((item, i) => <Option key={i}  value={item.id}>{item.name}</Option>)
                                                        }
                                                    </Select>
                                                )
                                            }
                                        </FormItem>
                                    </Col>
                                    <Col className="gutter-row" xs={{ span: 6}}>
                                        <FormItem
                                            label="检查项"
                                        >
                                            {
                                                getFieldDecorator('checkItem',{
                                                    initialValue: data ? data.checkItem : '',
                                                    rules: [
                                                        { required: true, message: '请选择检查项！'}
                                                    ]
                                                })(
                                                    <Select  size="large" style={{width: '100%'}}  >
                                                        {
                                                            checkItems.map((item, i) => <Option key={i}  value={item.value}>{item.description}</Option>)
                                                        }
                                                    </Select>
                                                )
                                            }
                                        </FormItem>
                                    </Col>
                                </Row>
                                <Row gutter={16} justify="start">
                                    <Col className="gutter-row" xs={{ span: 6}}>
                                        <FormItem
                                            label="有效开始时间"
                                        >
                                            {
                                                getFieldDecorator('validStartDate',{
                                                initialValue: data.validStartDate ? moment(data.validStartDate,"YYYY-MM-DD HH:mm:ss")  : "",
                                                    rules: [
                                                        { required: true, message: '请选择有效开始时间！'}
                                                    ]
                                                })(
                                                    <DatePicker format="YYYY-MM-DD HH:mm:ss" showTime placeholder="Select Time"/>
                                                )
                                            }
                                        </FormItem>
                                    </Col>
                                    <Col className="gutter-row" xs={{ span: 6}} >
                                        <FormItem
                                            label="有效结束时间"
                                        >
                                            {
                                                getFieldDecorator('validEndDate',{
                                                    initialValue: data.validEndDate ? moment(data.validEndDate,"YYYY-MM-DD HH:mm:ss")  : "",
                                                    rules: [
                                                        { required: true, message: '请选择有效结束时间！'}
                                                    ]
                                                })(
                                                <DatePicker format="YYYY-MM-DD HH:mm:ss" showTime placeholder="Select Time"/>
                                                )
                                            }
                                        </FormItem>
                                    </Col>
                                </Row>
                            </Form>
                        </Panel>
                           
                    </Collapse>
                </div>
            </div>
        )
    }
}


function mapStateToProps (state) {
    return {
        state: state.headquarters,
        commonState: state.common
    }
}

function buildActionDispatcher(dispatch) {
    return {
        actions: bindActionCreators(actions, dispatch),
        commonActions: bindActionCreators(commonActions, dispatch),
    }
}

export default connect(mapStateToProps, buildActionDispatcher)(Form.create()(WorkOrderOneComponent));
