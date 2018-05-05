/**  
 * @Description: 缺陷管理-整改单-工单提报
 */
import React from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import actions from '../../actions/defect_document.js';
import EamModal from '../../components/common/modal.js';
import commonActions from '../../actions/common.js';
import { correspondenceJson, filterArrByAttr } from '../../tools/';
import Upload from '../../components/common/upload.js';
import moment from 'moment';

import { Icon, Button, Table, Pagination,notification, Collapse, Form, Input, Row, Col, Select, Radio, DatePicker, Timeline, Modal,message } from 'antd';
const Panel = Collapse.Panel;
const FormItem = Form.Item;


class FormComponent extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            workflowStartupShow: false,//工作流启动
            currentPage: 1,
            visibleProcess: false,
        }

        this.currentInp = '';
        this.param = {
            pageSize: 10,
            pageNum: 0
        }
        let defaultRender = (text, record, key) => {
            return (
                <p>{text ? text : '-'}</p>
            )
        };
    }

    //人员数据加载
    getList = () => {
        const {commonActions,commonState} = this.props.props;
        this.setState({tableLoading: true});
        this.param={
            ...this.param,
            siteId:commonState.siteId,
            orgId:commonState.orgId,
          //  productArray:["EAM"]
        }


        commonActions.personGetList(this.param, () => {
            this.setState({tableLoading: false});
        });
    }
    //提报人选择框
    personInputFocus = () => {
        this.userAddModal.modalShow();

    }
    // 分页事件
    pageChange = (page, pageSize) => {
        this.setState({ currentPage: page });
        this.param.pageNum = page;
        this.getList();
    }
    //提报人选择弹框渲染
    taskStepsClose = () => {
        this.userAddModal.modalHide();
    }
    //提报人选择赋值
    selectCheckPerson = (record) => {
        //给人员赋值
        const {form} = this.props;
        form.setFieldsValue({'reportPersonTel': record.mobile,'reportPersonId': record.personId, 'reportPersonName': record.name});
        this.userAddModal.modalHide()
    }
    componentDidUpdate() {

        // const {state, actions} = this.props.props;
        // if(state.getFormValues==true){
        //     actions.getFormValues(false);
        //     this.formDataSave();
        // }
    }
    //保存
    formDataSave = () => {
        const { actions,commonState } = this.props.props;
        this.props.form.validateFields((err, values) => {
            if (!err) {
                for (let attr in values) {
                    if (values[attr] === null||values[attr]=="") delete values[attr];
                }
                values.reportDate = moment(values.reportDate).format('YYYY-MM-DD HH:mm:ss');
                if(values.workOrderStatusDate!=null){
                    values.workOrderStatusDate = moment(values.workOrderStatusDate).format('YYYY-MM-DD HH:mm:ss');
                }
                let param = {
                        ...values,
                        orgId: commonState.orgId,
                        siteId: commonState.siteId,
                        }
                actions.dispatchWorkOrderSave(param, (msg) => {
                    if (msg.success) {
                        //更新数据
                        message.success("保存成功");

                        param = {id: msg.data.workOrderId};
                        actions.dispatchOrderInfo(param, (json) => {
                        });
                        localStorage.setItem('workOrderId', msg.data.workOrderId );

                    } else {
                        message.error(msg.msg);
                    }
                });
            }
        });
    }

    //获取各个域值以及code
    getDomain = () => {
        const {actions, commonActions, state, commonState} =  this.props.props;
        const domainValueParam = {
            orgId: commonState.orgId,
            siteId: commonState.siteId,
            prodId: 'EAM'
        }
        const workProjectTypeData = commonState.workProjectTypeData//工程类型
        if (workProjectTypeData == null || !workProjectTypeData.length) {
            commonActions.getDomainValue(domainValueParam, 'woProjectType', 'WORK_PROJECT_TYPE');//工程类型
        }
        if (state.defectInfo == null) {
            let param = {
                orgId: commonState.orgId,
                siteId: commonState.siteId,
                prodId: 'EAM',
                modelKey: "defectDocument"
            };
            commonActions.codeGenerator(param);
        }
    }

    //获取信息
    GetDefectOrderInfo = (id) => {
        const {actions,commonActions,state,commonState} = this.props.props;
        if(id!=null&&id!="null"){
            let  param = {id: id};
            actions.dispatchOrderInfo(param, (json) => {
                if(json!=null&&json.processInstanceId!=null){
                    this.getExecutionRecord(json.processInstanceId);//开始查询执行记录
                }else{

                    state.repairWorkFlowHistory=[];
                }
            });
        }else{
            state.dispatchOrderInfo=null;//值清空

            let  param = {
                orgId: commonState.orgId,
                siteId: commonState.siteId,
                modelKey: "dispatch"
            };

            commonActions.codeGenerator(param, () => {
                this.setState({tableLoading: false});
            });
            state.repairWorkFlowHistory=[];
        }
    }
    //获取执行记录
    getExecutionRecord=(processInstanceId)=>{
        let  param = { processInstanceId: processInstanceId}
        const {actions,commonActions} = this.props.props;
        actions.getProcessExecutionRecord(param, (json) => {
            // if(json!=null){
            //     localStorage.setItem('dispatchOrderExecutionRecord_cache', json);
            // }
        });

    }
    componentWillMount() {
        // const {actions,commonActions,state} = this.props.props;
        // let id =localStorage.getItem('workOrderId');
        // localStorage.setItem('workOrderIdSign', "DTB" );
        //  this.getRepairWorkOrderInfo(id);
        //
        //  if(id==null){
        //      state.repairWorkFlowHistory=[];
        //  }
        // this.getList();

    }

    render() {
        const {getFieldDecorator } = this.props.form;
        const { state, commonState, location } = this.props.props;
        const data = state.defectOrderInfo;
        const code = commonState.codeEntity ;
        //true:不可以修改  false:可以修改
        let ismodify=false;
        let dtb=false
        let region=[];

        return (
            <Form layout="vertical">

                <Row gutter={16}>
                    <Col className="gutter-row" xs={{ span: 3 }}>
                        <FormItem
                            label="整改单"
                        >
                            {
                                getFieldDecorator('workOrderNum', {
                                    initialValue: data ? data.workOrderNum : code,
                                    rules: [{
                                        required: true
                                    }]
                                })(
                                    <Input  disabled />
                                )
                            }
                        </FormItem>
                    </Col>
                    <Col className="gutter-row" xs={{ span: 9 }}>
                        <FormItem
                            label="描述"
                        >
                            {
                                getFieldDecorator('description', {
                                    initialValue: data ? data.description : '',
                                    rules: [
                                        { required: true, message: '请填写描述！'},
                                        { max: 200, message: '描述长度不能超过200字符长度！'}
                                        ]
                                })(
                                    <Input placeholder="请输入派工描述"  disabled={ismodify}/>
                                )
                            }
                        </FormItem>
                    </Col>
                    <Col className="gutter-row" xs={{ span: 6 }}>
                        <FormItem label="区域">
                            {
                                getFieldDecorator('reportPersonName', {
                                    initialValue: data ? data.reportPersonName : commonState.personName,
                                })(
                                   <Input   disabled  />
                                )
                            }

                        </FormItem>
                    </Col>
                    <Col className="gutter-row" xs={{ span: 6 }}>
                        <FormItem
                            label="站点"
                        >
                            {
                                getFieldDecorator('siteName', {
                                    initialValue: data ? data.siteName :  commonState.siteName
                                })(
                                    <Input  disabled />
                                )
                            }
                        </FormItem>
                    </Col>
                </Row>
                <Row gutter={16}>
                    <Col className="gutter-row" xs={{ span: 6 }}>
                        <FormItem
                            label="关联缺陷单"
                        >
                            {
                                getFieldDecorator('demandDept', {
                                    initialValue: data ? data.demandDept : '',
                                    rules: [
                                        { required: true, message: '需求部门不能为空！'}
                                    ]
                                })(
                                    <Input placeholder="请选择验收人" disabled suffix={<Icon type="plus" onClick={() => {
                                        this.setState({
                                            selectPersonModalShow: true,
                                            currentInp: 'acceptPerson'
                                        });
                                    }} /> }/>
                                )
                            }
                        </FormItem>
                    </Col>
                    <Col className="gutter-row" xs={{ span: 6 }}>
                        <FormItem
                            label="缺陷单描述"
                        >
                            {
                                getFieldDecorator('reportDate', {
                                    initialValue: data? data.reportDate:null
                                })(
                                    <Input  disabled />
                                )
                            }
                        </FormItem>
                    </Col>
                    <Col className="gutter-row" xs={{ span: 6 }}>
                        <FormItem
                            label="楼号"
                        >
                            {
                                getFieldDecorator('workOrderStatusDescription', {
                                    initialValue: data ? data.workOrderStatusDescription : ''
                                })(
                                    <Input  disabled />
                                )
                            }
                        </FormItem>
                    </Col>
                    <Col className="gutter-row" xs={{ span: 6 }}>
                        <FormItem
                            label="工单状态"
                        >
                            {
                                getFieldDecorator('demandPerson', {

                                    initialValue: data ? data.demandPerson : '',
                                })(
                                    <Input   disabled />
                                )
                            }
                        </FormItem>
                    </Col>
                </Row>
                <Row gutter={16}>
                    <Col className="gutter-row" xs={{ span: 6 }}>
                            <FormItem
                                label="优先级"
                            >
                                {
                                    getFieldDecorator('reportPersonTel', {
                                        initialValue: data ? data.reportPersonTel : '',
                                        rules: [
                                            { max: 20, message: '提报人电话长度不能超过30！'},
                                        ]
                                    })(
                                        <Select onChange={this.getBuildingNumber} disabled size="large"
                                                style={{width: '100%'}}>
                                            {
                                                region.map((item, i) => <Option key={i}
                                                                                value={item.value}>{item.description}</Option>)
                                            }
                                        </Select>
                                    )
                                }
                            </FormItem>
                        </Col>
                    <Col className="gutter-row" xs={{ span: 6 }}>
                        <FormItem
                            label="关联图纸"
                        >
                            {
                                getFieldDecorator('workOrderStatusDate', {
                                    initialValue: data ? data.workOrderStatusDate: '',
                                })(
                                    <Input  disabled />
                                )
                            }
                        </FormItem>
                    </Col>
                    <Col className="gutter-row" xs={{ span: 6 }}>
                        <FormItem
                            label="楼层"
                        >
                            {
                                getFieldDecorator('demandPersonTel', {
                                    initialValue: data ? data.demandPersonTel : '',

                                })(
                                    <Input   disabled />
                                )
                            }
                        </FormItem>
                    </Col>
                    <Col className="gutter-row" xs={{ span: 6 }}>
                        <FormItem
                            label="提报日期"
                        >
                            {
                                getFieldDecorator('demandPersonTel', {
                                    initialValue: data ? data.receiveTime ? moment(data.receiveTime, 'YYYY-MM-DD HH:mm') : null : null,
                                    rules: [
                                        { max: 20, message: '联系方式长度不能超过20！'},
                                    ]
                                })(
                                    <Input  disabled />
                                )
                            }
                        </FormItem>
                    </Col>
                </Row>
                <Row gutter={16}>
                    <Col className="gutter-row" xs={{ span: 12 }}>
                        <FormItem
                            label="提报员派单"
                        >
                            {
                                getFieldDecorator('reportRemarks', {
                                    initialValue: data ? data.description : '',
                                    rules: [
                                        { max: 255, message: '备注长度不能超过255！'}
                                    ]
                                })(
                                    <Select onChange={this.getBuildingNumber} disabled={dtb} size="large"
                                            style={{width: '100%'}}>
                                        {
                                            region.map((item, i) => <Option key={i}
                                                                            value={item.value}>{item.description}</Option>)
                                        }
                                    </Select>
                                )
                            }
                        </FormItem>
                    </Col>
                    <Col className="gutter-row" xs={{ span: 6 }}>
                        <FormItem
                            label="工程类型"
                        >
                            {
                                getFieldDecorator('workOrderStatusDate', {
                                    initialValue: data ? data.workOrderStatusDate: '',
                                })(
                                    <Select onChange={this.getBuildingNumber} disabled={dtb} size="large"
                                            style={{width: '100%'}}>
                                        {
                                            region.map((item, i) => <Option key={i}
                                                                            value={item.value}>{item.description}</Option>)
                                        }
                                    </Select>
                                )
                            }
                        </FormItem>
                    </Col>
                    <Col className="gutter-row" xs={{ span: 6 }}>
                        <FormItem
                            label="方位"
                        >
                            {
                                getFieldDecorator('demandPersonTel', {
                                    initialValue: data ? data.demandPersonTel : '',
                                })(
                                    <Input  disabled />
                                )
                            }
                        </FormItem>
                    </Col>
                    <Col className="gutter-row" xs={{ span: 6 }}>
                        <FormItem
                            label="提报人"
                        >
                            {
                                getFieldDecorator('demandPersonTel', {
                                    initialValue: data ? data.demandPersonTel : '',
                                })(
                                    <Input  disabled />
                                )
                            }
                        </FormItem>
                    </Col>
                </Row>
                <Row gutter={16}>
                    <Col className="gutter-row" xs={{ span: 12 }}>
                        <FormItem
                            label="说明"
                        >
                            {
                                getFieldDecorator('reportRemarks', {
                                    initialValue: data ? data.description : '',
                                    rules: [
                                        { max: 255, message: '备注长度不能超过255！'}
                                    ]
                                })(
                                    <Input  placeholder="备注" className="eam-textarea"  disabled={ismodify} />
                                )
                            }
                        </FormItem>
                    </Col>
                    <Col className="gutter-row" xs={{ span: 12 }}>
                        <FormItem
                            label="电话"
                        >
                            {
                                getFieldDecorator('reportRemarks', {
                                    initialValue: data ? data.description : '',
                                    rules: [
                                        { max: 255, message: '备注长度不能超过255！'}
                                    ]
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
            modalShow: false,
            currentPage: 1,
        }

        this.customPanelStyle = {
            background: '#fff',
            borderRadius: 2,
            marginBottom: 24,
            border: 0,
            boxShadow: '0 1px 6px rgba(0, 0, 0, 0.2)'
        };
    }

    render() {
        const { state, actions,commonState,commonActions } = this.props;
        // 执行记录数据
        const recordList =state.repairWorkFlowHistory;
        let workOrderId;
        // 执行记录日期
        const recordDateArr = filterArrByAttr(recordList, 'startTime');
        return (
            <div className="eam-tab-page">
                <div className="eam-content">
                    <Collapse bordered={false} defaultActiveKey={['1', '2', '3']}>
                        <Panel header={<span className="label">工单信息 <Icon type="caret-down" /></span>} key="1" style={this.customPanelStyle}>
                            <NewFormComponent wrappedComponentRef={taskStepsAddForm => this.taskStepsAddForm = taskStepsAddForm} props={this.props}/>
                        </Panel>
                        <Panel header={<span className="label">图片信息 <Icon type="caret-down" /></span>} key="2" style={this.customPanelStyle}>
                            <Upload
                                quoteId={workOrderId}
                                quoteType="dispatchOrderImg_report"
                                commonActions={commonActions}
                                commonState={commonState}
                            />
                        </Panel>
                        <Panel header={<span className="label">执行记录 <Icon type="caret-down" /></span>} key="3" style={this.customPanelStyle}>
                            <Timeline>
                                {
                                    recordList.map((item, i) => {
                                        let time = item.startTime.split(' ')[1];
                                        return (
                                            <Timeline.Item
                                                key={i}
                                                dot={
                                                    <div>
                                                        <div className={recordDateArr[i] ? 'date' : ''}>{recordDateArr[i] ? recordDateArr[i] : ''} {recordDateArr[i] ? <i></i> : ''}</div>
                                                        <div>
                                                            <Icon className="pull-right" type={i === 0 ? 'clock-circle-o' : 'check-circle-o'} style={{ fontSize: '16px' }} />
                                                            <span className="pull-right time">{time.slice(0, 5)}</span>
                                                        </div>
                                                    </div>
                                                }
                                            >
                                                <h2>
                                                    <span className="name">{item.name}</span>
                                                    <span> 持续时间：{item.durationInMillis}</span>
                                                    <span> 责任人：{item.personName}</span>
                                                </h2>
                                                <p>{item.description}</p>
                                            </Timeline.Item>
                                        )
                                    })
                                }
                            </Timeline>
                        </Panel>
                    </Collapse>
                </div>
            </div>
        )
    }
}


function mapStateToProps(state) {
    return {
        state: state.matter_repair,
        commonState: state.common
    }
}

function buildActionDispatcher(dispatch) {
    return {
        actions: bindActionCreators(actions, dispatch),
        commonActions: bindActionCreators(commonActions, dispatch),
    }
}

export default connect(mapStateToProps, buildActionDispatcher)(WorkOrderOneComponent);