/**
 * 报事报修-报修工单-工单提报 
 */
import React from 'react';
import { bindActionCreators } from 'redux';
import { browserHistory } from 'react-router';
import { connect } from 'react-redux';
import actions from '../../actions/matter_repair.js';
import commonActions from '../../actions/common.js';
import moment from 'moment';

import Upload from '../../components/common/upload.js';
import { correspondenceJson, filterArrByAttr, msFormat } from '../../tools/';
import PubSub  from 'pubsub-js';
import { pubTopic } from '../../tools/constant';

import { Icon, Button, Collapse, Form, Input, Row, Col, Select, Radio, DatePicker, Timeline, Modal, message, notification } from 'antd';
const Panel = Collapse.Panel;
const FormItem = Form.Item;
const Option = Select.Option;
const RadioButton = Radio.Button;
const RadioGroup = Radio.Group;

class FormComponent extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            selectPersonModalShow: false
        };
    }
    personInputFocus = () => {
        this.setState({ selectPersonModalShow: true });
    };
    componentDidUpdate() {
        const { state, actions } = this.props.props;
        if (state.getFormValues === true) {
            actions.getFormValues(false);
            this.props.form.validateFields((error, values) => {
                if (error) {
                    for (let attr in error) {
                        message.warning(error[attr].errors[0].message);
                    }
                }
                //通知上层回调
                PubSub.publish(pubTopic.matterrepair.MATTER_REPAIR_SAVE_FORM_VALIDATE_CALLBACK, error == null);
            });
        } else if (state.getFormValidate === true) {
            actions.getFormValidate(false);
            this.props.form.validateFields((error, values) => {
                let flag = error == null;
                if (values.description == null || values.description.length == 0) {
                    let descriptionErrorMessage = '请填写工单描述！';
                    this.props.form.setFields({description: {errors: [new Error(descriptionErrorMessage)]}});
                    message.warning(descriptionErrorMessage);
                    flag = false;
                }
                if (error) {
                    for (let attr in error) {
                        message.warning(error[attr].errors[0].message);
                    }
                }
                 //通知上层回调
                 PubSub.publish(pubTopic.matterrepair.MATTER_REPAIR_SEND_PROCESS_FORM_VALIDATE_CALLBACK, flag);
            });
        }
    }
    componentWillMount () {
        const { commonActions, commonState } = this.props;
        const domainValueParam = {
            orgId: commonState.orgId,
            siteId: commonState.siteId,
            prodId: 'EAM'
        };
        commonState.workProjectTypeData.length == 0 && commonActions.getDomainValue(domainValueParam, 'roProjectType', 'WORK_PROJECT_TYPE');
        commonState.workOrderSourceData.length == 0 && commonActions.getDomainValue(domainValueParam, 'udwoly', 'WORK_ORDER_SOURCE');
        commonState.incidentNatureData.length == 0 && commonActions.getDomainValue(domainValueParam, 'incidentnature', 'WORK_ORDER_INCIDENT_NATURE');
    };
    render() {
        const { getFieldDecorator } = this.props.form;
        const { data, editable, commonState } = this.props;

        const workProjectTypeData = commonState.workProjectTypeData ? commonState.workProjectTypeData : [],
            workOrderSourceData = commonState.workOrderSourceData ? commonState.workOrderSourceData : [],
            incidentNatureData = commonState.incidentNatureData ? commonState.incidentNatureData : [];

        return (
            <div>
                <Form layout="vertical">
                    {/*隐藏域值*/}
                    {
                        getFieldDecorator('workOrderId', {
                            initialValue: data.workOrderId ? data.workOrderId : null
                        })(
                            <Input type="hidden" />
                        )
                    }
                    {
                        getFieldDecorator('orgId', {
                            initialValue: data.orgId ? data.orgId : null
                        })(
                            <Input type="hidden" />
                        )
                    }
                    {
                        getFieldDecorator('siteId', {
                            initialValue: data.siteId ? data.siteId : null
                        })(
                            <Input type="hidden" />
                        )
                    }
                    {
                        getFieldDecorator('reportPersonId', {
                            initialValue: data.reportPersonId ? data.reportPersonId : null
                        })(
                            <Input type="hidden" />
                        )
                    }
                    {
                        getFieldDecorator('workOrderStatus', {
                            initialValue: data.workOrderStatus ? data.workOrderStatus : null
                        })(
                            <Input type="hidden" />
                        )
                    }
                    <Row gutter={16}>
                        <Col className="gutter-row" xs={{ span: 3 }}>
                            <FormItem
                                label="工单编码"
                            >
                                {
                                    getFieldDecorator('workOrderNum', {
                                        initialValue: data.workOrderNum ? data.workOrderNum : null,
                                        rules: [{
                                            required: true
                                        }]
                                    })(
                                        <Input placeholder="工单编码" disabled />
                                    )
                                }
                            </FormItem>
                        </Col>
                        <Col className="gutter-row" xs={{ span: 9 }}>
                            <FormItem
                                label="工单描述"
                                required
                            >
                                {
                                    getFieldDecorator('description', {
                                        initialValue: data.description ? data.description : null,
                                    })(
                                        <Input placeholder="工单描述" disabled={!editable}/>
                                    )
                                }
                            </FormItem>
                        </Col>
                        <Col className="gutter-row" xs={{ span: 6 }}>
                            <FormItem
                                label="工程类型"
                            >
                                {
                                    getFieldDecorator('projectType', {
                                        initialValue: data.projectType ? data.projectType : null,
                                        rules: [{
                                            required: true,
                                            message: '请选择工程类型！'
                                        }]
                                    })(
                                        <Select size="large" style={{ width: '100%' }} disabled={!editable}>
                                            {
                                                workProjectTypeData.map((item, i) => <Option key={i} value={item.value}>{item.description}</Option>)
                                            }
                                        </Select>
                                    )
                                }
                            </FormItem>
                        </Col>
                        <Col className="gutter-row" xs={{ span: 6 }}>
                            <FormItem
                                label="工单状态"
                            >
                                {
                                    getFieldDecorator('workOrderStatusText', {
                                        initialValue: data.workOrderStatus ? correspondenceJson.repairOrder.statusCodeToText(data.workOrderStatus) : null
                                    })(
                                        <Input placeholder="工单状态" disabled />
                                    )
                                }
                            </FormItem>
                        </Col>

                        <Col className="gutter-row" xs={{ span: 6 }}>
                            <FormItem
                                label="报修部门"
                            >
                                {
                                    getFieldDecorator('repairDept', {
                                        initialValue: data.repairDept ? data.repairDept : ''
                                    })(
                                        <Input placeholder="报修部门" disabled={!editable}/>
                                    )
                                }
                            </FormItem>
                        </Col>
                        <Col className="gutter-row" xs={{ span: 6 }}>

                        </Col>
                        <Col className="gutter-row" xs={{ span: 6 }}>
                            <FormItem
                                label="工单来源"
                            >
                                {
                                    getFieldDecorator('workOrderSource', {
                                        initialValue: data.workOrderSource ? data.workOrderSource : null,
                                        rules: [{
                                            required: true,
                                            message: '请选择工单来源！'
                                        }]
                                    })(
                                        <Select size="large" style={{ width: '100%' }} disabled={!editable}>
                                            {
                                                workOrderSourceData.map((item, i) => <Option key={i} value={item.value}>{item.description}</Option>)
                                            }
                                        </Select>
                                    )
                                }
                            </FormItem>
                        </Col>
                        <Col className="gutter-row" xs={{ span: 6 }}>
                            <FormItem
                                label="状态时间"
                            >
                                {
                                    getFieldDecorator('workOrderStatusDate', {
                                        initialValue: data.workOrderStatusDate ? moment(data.workOrderStatusDate, 'YYYY-MM-DD HH:mm') : null
                                    })(
                                        <DatePicker
                                            showTime
                                            disabled
                                            format="YYYY-MM-DD HH:mm"
                                            placeholder="状态时间"
                                            onChange={(onChange) => { }}
                                            onOk={(onOk) => { }}
                                        />
                                    )
                                }
                            </FormItem>
                        </Col>

                        <Col className="gutter-row" xs={{ span: 6 }}>
                            <FormItem
                                label="报修人"
                            >
                                {
                                    getFieldDecorator('repairPerson', {
                                        initialValue: data.repairPerson ? data.repairPerson : ''
                                    })(
                                        <Input placeholder="请填写报修人" disabled={!editable}/>
                                    )
                                }
                            </FormItem>
                        </Col>
                        <Col className="gutter-row" xs={{ span: 6 }}>

                        </Col>
                        <Col className="gutter-row" xs={{ span: 6 }}>
                            <FormItem
                                label="事件性质"
                            >
                                {
                                    getFieldDecorator('incidentNature', {
                                        initialValue: data.incidentNature ? data.incidentNature : null
                                    })(
                                        <Select size="large" style={{ width: '100%' }} disabled={!editable}>
                                            {
                                                incidentNatureData.map((item, i) => <Option key={i} value={item.value}>{item.description}</Option>)
                                            }
                                        </Select>
                                    )
                                }
                            </FormItem>
                        </Col>
                        <Col className="gutter-row" xs={{ span: 6 }}>
                            <FormItem
                                label="提报人"
                            >
                                {
                                    getFieldDecorator('reportPersonName', {
                                        initialValue: data.reportPersonName ? data.reportPersonName : null,
                                        rules: [{
                                            required: true,
                                            message: '请选择提报人!'
                                        }]
                                    })(
                                        <Input placeholder="请选择提报人" readOnly disabled/>
                                    )
                                }
                            </FormItem>
                        </Col>

                        <Col className="gutter-row" xs={{ span: 6 }}>
                            <FormItem
                                label="联系方式"
                            >
                                {
                                    getFieldDecorator('repairPersonTel', {
                                        initialValue: data.repairPersonTel ? data.repairPersonTel : ''
                                    })(
                                        <Input placeholder="请填写联系方式" disabled={!editable}/>
                                    )
                                }
                            </FormItem>
                        </Col>
                        <Col className="gutter-row" xs={{ span: 6 }}>

                        </Col>
                        <Col className="gutter-row" xs={{ span: 6 }}>
                            <FormItem
                                label="事件级别"
                            >
                                {
                                    getFieldDecorator('incidentLevel', {
                                        initialValue: data.incidentLevel ? data.incidentLevel : null
                                    })(
                                        <RadioGroup size="large" className="radio-group-col-3" style={{ width: '100%' }} disabled={!editable}>
                                            <RadioButton value="H">高</RadioButton>
                                            <RadioButton value="M">中</RadioButton>
                                            <RadioButton value="L">低</RadioButton>
                                        </RadioGroup>
                                    )
                                }
                            </FormItem>
                        </Col>
                        <Col className="gutter-row" xs={{ span: 6 }}>
                            <FormItem
                                label="电话"
                            >
                                {
                                    getFieldDecorator('reportPersonTel', {
                                        initialValue: data.reportPersonTel ? data.reportPersonTel : ''
                                    })(
                                        <Input placeholder="提报人电话" disabled={!editable}/>
                                    )
                                }
                            </FormItem>
                        </Col>

                        <Col className="gutter-row" xs={{ span: 12 }}>
                            <FormItem
                                label="提报说明"
                            >
                                {
                                    getFieldDecorator('reportDescription', {
                                        initialValue: data.reportDescription ? data.reportDescription : ''
                                    })(
                                        <Input type="textarea" placeholder="请填写提报说明" className="eam-textarea" disabled={!editable}/>
                                    )
                                }
                            </FormItem>
                        </Col>
                        <Col className="gutter-row" xs={{ span: 6 }}>
                            <FormItem
                                label="提报员派单"
                            >
                                {
                                    getFieldDecorator('reportAssignFlag', {
                                        initialValue: data.reportAssignFlag ? data.reportAssignFlag : false
                                    })(
                                        <RadioGroup size="large" className="radio-group-col-2" style={{ width: '100%' }} disabled={!editable}>
                                            <RadioButton value={true}><i className="radio-group-icon-o"></i>是</RadioButton>
                                            <RadioButton value={false}><Icon type="minus" />否</RadioButton>
                                        </RadioGroup>
                                    )
                                }
                            </FormItem>
                        </Col>
                        <Col className="gutter-row" xs={{ span: 6 }}>
                            <FormItem
                                label="提报时间"
                            >
                                {
                                    getFieldDecorator('reportDate', {
                                        initialValue: data.reportDate ? moment(data.reportDate, 'YYYY-MM-DD HH:mm') : null
                                    })(
                                        <DatePicker
                                            showTime
                                            disabled
                                            format="YYYY-MM-DD HH:mm"
                                            placeholder="提报时间"
                                            onChange={(onChange) => { }}
                                            onOk={(onOk) => { }}
                                        />
                                    )
                                }
                            </FormItem>
                        </Col>
                    </Row>
                </Form>
            </div>
        )
    }
}
const NewFormComponent = Form.create({onValuesChange: (props, values) => {
    for (let attr in values) {
        if (values[attr] instanceof moment) {
            values[attr] = moment(values[attr]).format('YYYY-MM-DD HH:mm:ss');
        }
    }
    //标记表单数据已更新
    localStorage.setItem('repairWorkOrder_edit_flag', true);
    let tmp = Object.assign({}, JSON.parse(localStorage.getItem('repairWorkOrder_edit')), values);
    localStorage.setItem('repairWorkOrder_edit', JSON.stringify(tmp));
}})(FormComponent);

class WorkOrderOneComponent extends React.Component {
    constructor(props) {
        super(props);
        this.props.router.setRouteLeaveHook(
            this.props.route,
            this.routerWillLeave.bind(this)
        );
        this.onBeforeUnload = (event) => {
            const isEdited = JSON.parse(localStorage.getItem('repairWorkOrder_edit_flag'));
            if (isEdited) {
                let confirmationMessage = '当前页面已修改，是否确认离开？';

                (event || window.event).returnValue = confirmationMessage; // Gecko and Trident
                return confirmationMessage; // Gecko and WebKit
            }
            return "\o/";
        };

        //注册刷新事件，当页面刷新时，缓存页面数据
        window.addEventListener('beforeunload', this.onBeforeUnload);

        //订阅流程提交成功回调消息
        //PubSub.subscribe(pubTopic.matterrepair.MATTER_REPAIR_SEND_PROCESS_PASS_CALLBACK, (topic, status) => {});

        this.state = {
            modalShow: false,
            currentPage: 1,
        };

        this.customPanelStyle = {
            background: '#fff',
            borderRadius: 2,
            marginBottom: 24,
            border: 0,
            boxShadow: '0 1px 6px rgba(0, 0, 0, 0.2)'
        };
    }
    componentWillMount() {
        const { actions, state, location } = this.props;
        const isEdited = JSON.parse(localStorage.getItem('repairWorkOrder_edit_flag'));
        const addRepairWorkOrderFlag = JSON.parse(localStorage.getItem('addRepairWorkOrder'));
        if (isEdited) {
            const repairWorkOrderInfo_edit = JSON.parse(localStorage.getItem('repairWorkOrder_edit'));
            actions.updateRepairWorkOrder(repairWorkOrderInfo_edit);
        } else {
            const repairWorkOrderInfo = state.repairWorkOrderInfo;
            const repairWorkOrderInfo_init = JSON.parse(localStorage.getItem('repairWorkOrder_init'));

            if (addRepairWorkOrderFlag) {
                if (repairWorkOrderInfo instanceof Array || repairWorkOrderInfo == null) {
                    actions.updateRepairWorkOrder(repairWorkOrderInfo_init);
                }
                //移除流程数据
                actions.updaterepairOrderFlow(null);
            } else {
                if (repairWorkOrderInfo instanceof Array || repairWorkOrderInfo == null) {
                    //重新加载工单数据
                    actions.repairOrderInformation({ id: repairWorkOrderInfo_init.workOrderId }, (data) => {
                        if (data.processInstanceId) {
                            //查询流程数据
                            actions.repairOrderFlowHistory({ processInstanceId: data.processInstanceId });
                        } else {
                            //移除流程数据
                            actions.updaterepairOrderFlow(null);
                        }
                    });
                } else {
                    if (repairWorkOrderInfo.processInstanceId) {
                        //查询流程数据
                        actions.repairOrderFlowHistory({ processInstanceId: repairWorkOrderInfo.processInstanceId });
                    } else {
                        //移除流程数据
                        actions.updaterepairOrderFlow(null);
                    }
                }
            }
        }
    }
    routerWillLeave(nextLocation) {
        const { location } = this.props;
        if (!nextLocation.pathname.startsWith(location.pathname.substring(0, location.pathname.length - 1))) {
            //切换其它页面
            const isEdited = JSON.parse(localStorage.getItem('repairWorkOrder_edit_flag'));
            if (isEdited) {
                const confirm = Modal.confirm;
                confirm({
                    title: '提示',
                    content: '当前页面已修改，是否确认离开？',
                    onOk() {
                        localStorage.removeItem('repairWorkOrder_edit_flag');
                        localStorage.removeItem('repairWorkOrder_edit');
                        localStorage.removeItem('repairWorkOrder_init');
                        localStorage.removeItem('addRepairWorkOrder');
                        browserHistory.push(nextLocation.pathname);
                    }
                });
                return false;
            } else {
                localStorage.removeItem('repairWorkOrder_edit_flag');
                localStorage.removeItem('repairWorkOrder_edit');
                localStorage.removeItem('repairWorkOrder_init');
                localStorage.removeItem('addRepairWorkOrder');
            }
        }
    }
    componentWillUnmount() {
        window.removeEventListener('beforeunload', this.onBeforeUnload);
    }
    isEditable(workOrderInfo) {
        const { location } = this.props;
        let editable = false;
        if (workOrderInfo.workOrderStatus) {
            const status = correspondenceJson.repairOrder[workOrderInfo.workOrderStatus];
            editable = status && location.pathname.endsWith(status.path) && status.edit;
        }
        return editable;
    }
    render() {
        const { actions, state, commonState, commonActions } = this.props;
        const workOrderInfo = state.repairWorkOrderInfo || [];
        const editable = this.isEditable(workOrderInfo);

        // 执行记录数据
        const recordList = state.repairWorkFlowHistory || [];
        // 执行记录日期
        const recordDateArr = filterArrByAttr(recordList, 'startTime');
        return (
            <div className="eam-tab-page">
                <div className="eam-content">
                    <Collapse bordered={false} defaultActiveKey={['1', '2', '3']}>
                        <Panel header={<span className="label">工单信息 <Icon type="caret-down" /></span>} key="1" style={this.customPanelStyle}>
                            <NewFormComponent
                                props={this.props}
                                editable={editable}
                                data={workOrderInfo}
                                commonState={commonState}
                                commonActions={commonActions}
                            />
                        </Panel>
                        <Panel header={<span className="label">图片信息 <Icon type="caret-down" /></span>} key="2" style={this.customPanelStyle}>
                            <Upload
                                beforeUpload={() => {                              // 上传之前触发的方法 返回 Promise对象 用于上传之前的其他请求
                                    return new Promise((resolve, reject) => {
                                        let editedData = JSON.parse(localStorage.getItem('repairWorkOrder_edit'));
                                        for (let attr in editedData) {
                                            if (editedData[attr] === null) {
                                                delete editedData[attr];
                                            }
                                        }
                                        actions.repairWorkOrderSave(editedData, (msg) => {
                                            if (msg.success) {
                                                //更新数据
                                                actions.updateRepairWorkOrder(msg.data);
                                                localStorage.removeItem('addRepairWorkOrder');
                                                localStorage.removeItem('repairWorkOrder_edit_flag');
                                                localStorage.setItem('repairWorkOrder_init', JSON.stringify(msg.data));
                                                localStorage.setItem('repairWorkOrder_edit', localStorage.getItem('repairWorkOrder_init'));
                                                resolve(msg);
                                            } else {
                                                message.error(msg.msg, 3);
                                            }
                                        });
                                    })
                                }}
                                hideButton={!editable}
                                quoteId={workOrderInfo.workOrderId}
                                quoteType="repairOrderImg_submit"
                                commonActions={commonActions}
                                commonState={commonState}
                            />
                        </Panel>
                        <Panel header={<span className="label">执行记录 <Icon type="caret-down" /></span>} key="3" style={this.customPanelStyle}>
                            <Timeline>
                                {
                                    recordList.map((item, i) => {

                                        let time = item.endTime ? item.endTime.split(' ')[1] : '';

                                        let iconType;
                                        if (i === 0) {
                                            iconType = item.endTime ? 'minus-circle-o': 'clock-circle-o';
                                        } else {
                                            iconType = item.processType === 'reject' ? 'exclamation-circle-o' : 'check-circle-o';
                                        }

                                        return (
                                            <Timeline.Item
                                                key={i}
                                                dot={
                                                    <div>
                                                        <div className={recordDateArr[i] ? 'date' : ''}>{recordDateArr[i] ? recordDateArr[i] : ''} {recordDateArr[i] ? <i></i> : ''}</div>
                                                        <div>
                                                            <Icon className={item.processType === 'reject' ? 'red pull-right' : 'pull-right'} type={iconType} style={{ fontSize: '16px' }} />
                                                            <span className="pull-right time">{time.slice(0,5)}</span>
                                                        </div>
                                                    </div>
                                                }
                                            >
                                                <h2>
                                                    <span className={item.processType === 'reject' ? 'red name' : 'name'}>{item.name}</span>
                                                    <span>持续时间：{item.durationInMillis ? `${msFormat(item.durationInMillis, 'h')}小时${msFormat(item.durationInMillis, 'm')}分钟` : '-'}</span>
                                                    &nbsp;&nbsp;
                                                    <span>{iconType === 'clock-circle-o' ? '执行人' : '责任人'}：{item.personName}</span>
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
        commonActions: bindActionCreators(commonActions, dispatch)
    }
}

export default connect(mapStateToProps, buildActionDispatcher)(WorkOrderOneComponent);