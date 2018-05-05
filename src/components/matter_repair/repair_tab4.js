/**
 * 报事报修-报修工单-验收确认 
 */
import React from 'react';
import { bindActionCreators } from 'redux';
import { browserHistory } from 'react-router';
import { connect } from 'react-redux';
import actions from '../../actions/matter_repair.js';
import commonActions from '../../actions/common.js';
import moment from 'moment';
import { correspondenceJson, filterArrByAttr, msFormat } from '../../tools/';

import SelectPerson from '../../components/common/select_person.js';
import Upload from '../../components/common/upload.js';
import PubSub  from 'pubsub-js';
import { pubTopic } from '../../tools/constant';

import { Icon, Button, Collapse, Form, Input, Row, Col, Select, Radio, DatePicker, Timeline, Modal, notification, message } from 'antd';
const Panel = Collapse.Panel;
const FormItem = Form.Item;
const RadioButton = Radio.Button;
const RadioGroup = Radio.Group;

class FormComponent extends React.Component {
    constructor(props) {
        super(props);
        this.status = '待提报';
        this.state = {
            selectPersonModalShow: false,
            currentInp: null
        };
    }
    personInputFocus = (selected) => {
        let selectedPerson = {};
        switch (this.state.currentInp) {
            case 'acceptPerson': {
                selectedPerson = {
                    acceptPersonId: filterArrByAttr(selected, 'personId'),
                    acceptPerson: filterArrByAttr(selected, 'name')
                };
            } break;
        }
        this.props.form.setFieldsValue(selectedPerson);
    };
    componentWillMount() {
        const { data, editable, commonState } = this.props;
        if (editable && correspondenceJson.repairOrder.DYS.code == data.workOrderStatus && data.acceptPersonId == null) {
            if (data.authPersonList != null && data.authPersonList.length != 0 && data.authPersonList.indexOf(commonState.personId) != -1) {
                data.acceptPersonId = commonState.personId;
                data.acceptPerson = commonState.personName;
                let tmp = JSON.parse(localStorage.getItem('repairWorkOrder_edit'));
                tmp.acceptPersonId = commonState.personId;
                tmp.acceptPerson = commonState.personName;
                localStorage.setItem('repairWorkOrder_edit_flag', true);
                localStorage.setItem('repairWorkOrder_edit', JSON.stringify(tmp));
            }
        }
    }
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
                let flag = true;
                if (error) {
                    for (let attr in error) {
                        message.warning(error[attr].errors[0].message);
                    }
                    flag = false;
                } else {
                    if (correspondenceJson.repairOrder.DYS.code == values.workOrderStatus && !values.confirm) {
                        message.warning('请确认解决后再进行验收操作！');
                        flag = false;
                    }
                }
                //通知上层回调
                PubSub.publish(pubTopic.matterrepair.MATTER_REPAIR_SEND_PROCESS_FORM_VALIDATE_CALLBACK, flag);
            });
        }
    }
    render() {
        const { getFieldDecorator } = this.props.form;
        const { data, editable } = this.props;
        return (
            <div>
                <Form layout="vertical">
                    {/*隐藏域值*/}
                    {
                        getFieldDecorator('acceptPersonId', {
                            initialValue: data.acceptPersonId ? data.acceptPersonId : null
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
                        <Col className="gutter-row" xs={{ span: 8}}>
                            <Row gutter={16}>
                                <Col className="gutter-row" xs={{ span: 24 }}>
                                    <FormItem
                                        label="确认解决"
                                    >
                                        {
                                            getFieldDecorator('confirm', {
                                                initialValue: data.confirm ? data.confirm : false
                                            })(
                                                <RadioGroup size="large" className="radio-group-col-2" style={{ width: '100%' }} disabled={!editable}>
                                                    <RadioButton value={true}><i className="radio-group-icon-o"></i>是</RadioButton>
                                                    <RadioButton value={false}><Icon type="minus" />否</RadioButton>
                                                </RadioGroup>
                                            )
                                        }
                                    </FormItem>
                                </Col>
                                <Col className="gutter-row" xs={{ span: 24 }}>
                                    <FormItem
                                        label="验收人"
                                    >
                                        {
                                            getFieldDecorator('acceptPerson', {
                                                initialValue: data.acceptPerson ? data.acceptPerson : null
                                            })(
                                                <Input placeholder="验收人" readOnly disabled={!editable} onClick={() => {
                                                    this.setState({
                                                        selectPersonModalShow: true,
                                                        currentInp: 'acceptPerson'
                                                    });
                                                }} />
                                            )
                                        }
                                    </FormItem>
                                </Col>
                                <Col className="gutter-row" xs={{ span: 24 }}>
                                    <FormItem
                                        label="验收时间"
                                    >
                                        {
                                            getFieldDecorator('acceptTime', {
                                                initialValue: data.acceptTime ? moment(data.acceptTime, 'YYYY-MM-DD HH:mm') : null
                                            })(
                                                <DatePicker
                                                    showTime
                                                    disabled={!editable}
                                                    format="YYYY-MM-DD HH:mm"
                                                    placeholder="验收时间"
                                                    onChange={(onChange) => { }}
                                                    onOk={(onOk) => { }}
                                                />
                                            )
                                        }
                                    </FormItem>
                                </Col>
                            </Row>
                        </Col>
                        <Col className="gutter-row" xs={{ span: 8}}>
                            <Row gutter={16}>
                                <Col className="gutter-row" xs={{ span: 24 }}>
                                    <FormItem
                                        label="验收说明"
                                    >
                                        {
                                            getFieldDecorator('acceptDescription', {
                                                initialValue: data.acceptDescription ? data.acceptDescription : ''
                                            })(
                                                <Input type="textarea" placeholder="验收说明" className="eam-textarea" disabled={!editable}/>
                                            )
                                        }
                                    </FormItem>
                                </Col>
                            </Row>
                        </Col>
                        <Col className="gutter-row" xs={{ span: 8}}>
                            <Row gutter={16}>
                                <Col className="gutter-row" xs={{ span: 24 }}>
                                    <FormItem
                                        label="状态"
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
                                <Col className="gutter-row" xs={{ span: 24 }}>
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
                            </Row>
                        </Col>
                    </Row>
                    <SelectPerson
                        multiple
                        visible={this.state.selectPersonModalShow}
                        selectPersonModalHide={() => { this.setState({ selectPersonModalShow: false }) }}
                        onOk={this.personInputFocus.bind(this)}
                    />
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

class WorkOrderFourComponent extends React.Component {
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
        const { state, commonState, commonActions } = this.props;
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
                            <NewFormComponent props={this.props} editable={editable} data={workOrderInfo} commonState={commonState} commonActions={commonActions}/>
                        </Panel>
                        <Panel header={<span className="label">图片信息 <Icon type="caret-down" /></span>} key="2" style={this.customPanelStyle}>
                            <Upload
                                hideButton={!editable}
                                quoteId={workOrderInfo.id}
                                quoteType="repairOrderImg_accept"
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

export default connect(mapStateToProps, buildActionDispatcher)(WorkOrderFourComponent);