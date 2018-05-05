/**
 * 报事报修-报修工单-执行汇报 
 */

import React from 'react';
import { bindActionCreators } from 'redux';
import { browserHistory } from 'react-router';
import { connect } from 'react-redux';
import actions from '../../actions/matter_repair.js';
import commonActions from '../../actions/common.js';

import SelectPerson from '../../components/common/select_person.js';
import Upload from '../../components/common/upload.js';
import moment from 'moment';
import { correspondenceJson, filterArrByAttr, msFormat } from '../../tools/';
import PubSub  from 'pubsub-js';
import { pubTopic } from '../../tools/constant';

import { Icon, Button, Table, Collapse, Form, Input, InputNumber, Row, Col, Select, Radio, DatePicker, Menu, Timeline, Modal, message, notification } from 'antd';
const Panel = Collapse.Panel;
const FormItem = Form.Item;
const Option = Select.Option;
const RadioButton = Radio.Button;
const RadioGroup = Radio.Group;
const InputGroup = Input.Group;

// 主表单
class FormComponent extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            selectPersonModalShow: false,
            currentInp: null
        };
    }
    personInputFocus = (selected) => {
        let selectedPerson = {};
        switch (this.state.currentInp) {
            case 'actualExecutionPerson': {
                let workGroup = null, workGroupArray = filterArrByAttr(selected, 'workgroup');
                for (let i=0,len=workGroupArray.length;i<len;i++) {
                    if (i == 0) {
                        workGroup = workGroupArray[i];
                    } else {
                        if (workGroupArray[i-1] != workGroupArray[i]) {
                            workGroup = null;
                            break;
                        }
                    }
                }
                selectedPerson = {
                    actualExecutionPersonId: filterArrByAttr(selected, 'personId'),
                    actualExecutionPerson: filterArrByAttr(selected, 'name'),
                    actualWorkGroup: workGroup
                }
            } break;
        }
        this.props.form.setFieldsValue(selectedPerson);
    };
    componentDidUpdate() {
        const { state, actions } = this.props.props;
        if (state.getFormValues === true) {
            actions.getFormValues(false);
            this.props.form.validateFields((error, values) => {
                let flag = error == null;
                //flag = this.extendValid(flag, values, true);
                if (error) {
                    for (let attr in error) {
                        message.warning(error[attr].errors[0].message);
                    }
                }
                //通知上层回调
                PubSub.publish(pubTopic.matterrepair.MATTER_REPAIR_SAVE_FORM_VALIDATE_CALLBACK, flag);
            });
        } else if (state.getFormValidate === true) {
            const { editable } = this.props;
            actions.getFormValidate(false);
            //若当前环节不允许修改内容，只有提交流程，允许跳过表单校验环节
            if (editable) {
                this.props.form.validateFields((error, values) => {
                    let flag = error == null;
                    flag = this.extendValid(flag, values);
                    if (error) {
                        for (let attr in error) {
                            message.warning(error[attr].errors[0].message);
                        }
                    }
                    //通知上层回调
                    PubSub.publish(pubTopic.matterrepair.MATTER_REPAIR_SEND_PROCESS_FORM_VALIDATE_CALLBACK, flag);
                });
            } else {
                //通知上层回调
                PubSub.publish(pubTopic.matterrepair.MATTER_REPAIR_SEND_PROCESS_FORM_VALIDATE_CALLBACK, true);
            }
        }
    }
    //扩展校验
    extendValid = (flag, values) => {
        if (values.suspension) {
            if (values.suspensionType == null) {
                let errorMessage = '请选择挂起类型！';
                message.warning(errorMessage);
                flag = false;
            }
        } else {
            if (values.completionTime == null || !values.completionTime instanceof moment) {
                let errorMessage = '请选择完成时间！';
                message.warning(errorMessage);
                flag = false;
            }

            if (values.consumeHours == null || values.consumeHours.length == 0) {
                let errorMessage = '请填写工时耗时！';
                message.warning(errorMessage);
                flag = false;
            }

            if (values.actualExecutionPersonId == null || values.actualExecutionPersonId.length == 0) {
                let errorMessage = '请选择实际执行人！';
                message.warning(errorMessage);
                flag = false;
            }
        }
        return flag;
    };
    buildInitConsumeHoursValue = (value, isHour) => {
        let buildMinute = (num) => {
            let minute = `${num}`.split('.')[1];
            return minute.length > 1 ? Number(minute) : Number(minute) * 10;
        };
        return value && !Number.isNaN(value) ?
            (
                isHour ? Math.trunc(value) : (Number.isSafeInteger(value) ? 0 : buildMinute(value))
            ) :
            null
    };
    onConsumeHoursValueChange = (value, isHour) => {
        const { getFieldValue, setFieldsValue } = this.props.form;
        let otherValue = getFieldValue(isHour ? 'consumeHours_minute' : 'consumeHours_hours');
        if (value || otherValue) {
            let hour, minute;
            hour = isHour ? value : otherValue;
            minute = isHour ? otherValue : value;
            hour = hour ? hour : 0;
            minute = minute ? (minute < 10 ? `0${minute}` : minute) : 0;
            setFieldsValue({consumeHours: `${hour}.${minute}`});
            if (!isHour) {
                setFieldsValue({consumeHours_hours: hour});
            }
        } else {
            setFieldsValue({consumeHours: null});
        }
    };
    componentWillMount () {
        const { commonActions, commonState } = this.props;
        const domainValueParam = {
            orgId: commonState.orgId,
            siteId: commonState.siteId,
            prodId: 'EAM'
        };
        commonState.suspensionTypeData.length == 0 && commonActions.getDomainValue(domainValueParam, 'suspensiontype', 'SUSPENSION_TYPE');
    }
    render() {
        const { getFieldDecorator } = this.props.form;
        const { data, editable, commonState } = this.props;
        const suspensionTypeData = commonState.suspensionTypeData ? commonState.suspensionTypeData : [];

        return (
            <div>
                <Form layout="vertical">
                    {/*隐藏域值*/}
                    {
                        getFieldDecorator('actualExecutionPersonId', {
                            initialValue: data.actualExecutionPersonId ? data.actualExecutionPersonId : null
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
                    {
                        getFieldDecorator('consumeHours', {
                            initialValue: data.consumeHours ? data.consumeHours : null,
                        })(
                            <Input type="hidden" />
                        )
                    }
                    <Row gutter={16}>
                        <Col className="gutter-row" xs={{ span: 18}}>
                            <Row gutter={16}>
                                <Col className="gutter-row" xs={{ span: 8 }}>
                                    <FormItem
                                        label="完成时间"
                                        required
                                    >
                                        {
                                            getFieldDecorator('completionTime', {
                                                initialValue: data.completionTime ? moment(data.completionTime, 'YYYY-MM-DD HH:mm') : null,
                                            })(
                                                <DatePicker
                                                    showTime
                                                    disabled={!editable}
                                                    format="YYYY-MM-DD HH:mm"
                                                    placeholder="完成时间"
                                                    onChange={(onChange) => { }}
                                                    onOk={(onOk) => { }}
                                                />
                                            )
                                        }
                                    </FormItem>
                                </Col>
                                <Col className="gutter-row" xs={{ span: 8 }}>
                                    <FormItem
                                        label="实际执行人"
                                    >
                                        {
                                            getFieldDecorator('actualExecutionPerson', {
                                                initialValue: data.actualExecutionPerson ? data.actualExecutionPerson : ''
                                            })(
                                                <Input placeholder="实际执行人" readOnly disabled={!editable} onClick={() => {
                                                    this.setState({
                                                        selectPersonModalShow: true,
                                                        currentInp: 'actualExecutionPerson'
                                                    });
                                                }} />
                                            )
                                        }
                                    </FormItem>
                                </Col>
                                <Col className="gutter-row" xs={{ span: 8 }}>
                                    <FormItem
                                        label="是否挂起"
                                    >
                                        {
                                            getFieldDecorator('suspension', {
                                                initialValue: data.suspension ? data.suspension : false
                                            })(
                                                <RadioGroup size="large" className="radio-group-col-2" style={{ width: '100%' }} disabled={!editable}>
                                                    <RadioButton value={true}><i className="radio-group-icon-o"></i>是</RadioButton>
                                                    <RadioButton value={false}><Icon type="minus" />否</RadioButton>
                                                </RadioGroup>
                                            )
                                        }
                                    </FormItem>
                                </Col>

                                <Col className="gutter-row" xs={{ span: 8 }}>
                                    <FormItem
                                        label="工时耗时 (小时 : 分钟)"
                                        required
                                    >
                                        <InputGroup compact>
                                            {
                                                getFieldDecorator('consumeHours_hours', {
                                                    initialValue: this.buildInitConsumeHoursValue(data.consumeHours, true),
                                                })(
                                                    <InputNumber min={0} max={999} style={{ width: '80px', textAlign: 'center' }} onChange={(value) => this.onConsumeHoursValueChange(value, true)} placeholder="小时" disabled={!editable}/>
                                                )
                                            }
                                            <InputNumber style={{ width: 20, pointerEvents: 'none', marginLeft: '-8px', marginRight: 0 }} placeholder=":" disabled />
                                            {
                                                getFieldDecorator('consumeHours_minute', {
                                                    initialValue: this.buildInitConsumeHoursValue(data.consumeHours, false),
                                                })(
                                                    <InputNumber min={0} max={60} style={{ width: '80px', textAlign: 'center' }} onChange={(value) => this.onConsumeHoursValueChange(value, false)} placeholder="分钟" disabled={!editable} formatter={value => value && value < 10 ? `0${value}` : value} />
                                                )
                                            }
                                        </InputGroup>
                                    </FormItem>
                                </Col>
                                <Col className="gutter-row" xs={{ span: 8 }}>
                                    <FormItem
                                        label="实际执行班组"
                                    >
                                        {
                                            getFieldDecorator('actualWorkGroup', {
                                                initialValue: data.actualWorkGroup ? data.actualWorkGroup : null
                                            })(
                                                <Input placeholder="实际执行班组" readOnly disabled={!editable}/>
                                            )
                                        }
                                    </FormItem>
                                </Col>
                                <Col className="gutter-row" xs={{ span: 8 }}>
                                    <FormItem
                                        label="挂起类型"
                                    >
                                        {
                                            getFieldDecorator('suspensionType', {
                                                initialValue: data.suspensionType ? data.suspensionType : null
                                            })(
                                                <Select size="large" style={{ width: '100%' }} disabled={!editable}>
                                                    {
                                                        suspensionTypeData.map((item, i) => <Option key={i} value={item.value}>{item.description}</Option>)
                                                    }
                                                </Select>
                                            )
                                        }
                                    </FormItem>
                                </Col>
                            </Row>
                        </Col>
                        <Col className="gutter-row" xs={{ span: 6}}>
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
                                        label="情况说明"
                                    >
                                        {
                                            getFieldDecorator('suspensionCause', {
                                                initialValue: data.suspensionCause ? data.suspensionCause : ''
                                            })(
                                                <Input type="textarea" placeholder="情况说明" className="eam-textarea" disabled={!editable}/>
                                            )
                                        }
                                    </FormItem>
                                </Col>
                            </Row>
                        </Col>
                    </Row>
                </Form>
                <SelectPerson
                    multiple
                    visible={this.state.selectPersonModalShow}
                    selectPersonModalHide={() => { this.setState({ selectPersonModalShow: false }) }}
                    onOk={this.personInputFocus.bind(this)}
                />
            </div>
        )
    }
}
const NewForm = Form.create({onValuesChange: (props, values) => {
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

class WorkOrderThreeComponent extends React.Component {
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
            taskStepsLoading: false,
            materialsLoading: false,
            currentPage: 1,
            pageSize: 5,
        }

        this.customPanelStyle = {
            background: '#fff',
            borderRadius: 2,
            marginBottom: 24,
            border: 0,
            boxShadow: '0 1px 6px rgba(0, 0, 0, 0.2)'
        };

        this.recordDate = null;

        let defaultRender = (text, record, key) => {
            return (
                <p>{text ? text : '-'}</p>
            )
        };

        //所需物料表格字段
        this.materialsColumns = [
            {
                title: '物料编码',
                dataIndex: 'itemNum',
                key: 'itemNum',
                sorter: true,
                render: defaultRender
            },
            {
                title: '物资名称',
                dataIndex: 'itemName',
                key: 'itemName',
                sorter: true,
                render: defaultRender
            },
            {
                title: '数量',
                dataIndex: 'quantity',
                key: 'quantity',
                sorter: true,
                render: defaultRender
            },
            {
                title: '单位',
                dataIndex: 'orderUnit',
                key: 'orderUnit',
                sorter: true,
                render: defaultRender
            },
            {
                title: '库房',
                dataIndex: 'storeroomName',
                key: 'storeroomName',
                sorter: true,
                render: defaultRender
            }
        ];
    }
    // 分页事件
    pageChange = (page, pageSize) => {
        this.setState({ currentPage: page });
        this.getMaterialsList();
    };
    //加载物资数据
    getMaterialsList = () => {
        const { actions } = this.props;
        const repairWorkOrderInfo = JSON.parse(localStorage.getItem('repairWorkOrder_init'));
        if (repairWorkOrderInfo.workOrderId) {
            this.setState({materialsLoading: true});
            let param = {
                id: repairWorkOrderInfo.workOrderId,
                pageNum: this.state.currentPage,
                pageSize: this.state.pageSize,
            };
            //查询物资列表
            actions.repairWorkOrderMaterialsList(param, () => {
                this.setState({materialsLoading: false});
            });
        }
    };
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

        //加载物资列表
        this.getMaterialsList();
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

        // 所需物料数据
        const materialsList = state.repairWorkOrderMaterialsList || [];
        // 执行记录数据
        const recordList = state.repairWorkFlowHistory || [];
        // 执行记录日期
        const recordDateArr = filterArrByAttr(recordList, 'startTime');

        return (
            <div className="eam-tab-page">
                <div className="eam-content">
                    <Collapse bordered={false} defaultActiveKey={['1', '2', '3', '4']}>
                        <Panel header={<span className="label">工单信息 <Icon type="caret-down" /></span>} key="1" style={this.customPanelStyle}>
                            <NewForm
                                props={this.props}
                                editable={editable}
                                data={workOrderInfo}
                                commonState={commonState}
                                commonActions={commonActions}
                            />
                        </Panel>
                        <Panel header={<span className="label">使用物料 <Icon type="caret-down" /></span>} key="3" style={this.customPanelStyle}>
                            <Table
                                rowKey="id"
                                loading={this.state.materialsLoading}
                                pagination={{
                                    showTotal: (total, range) => `当前第${range[0]}-${range[1]}条 / 共${total}条`,
                                    onChange: this.pageChange,
                                    defaultPageSize: this.state.pageSize,
                                }}
                                dataSource={materialsList.list}
                                columns={this.materialsColumns}
                                bordered
                            />
                        </Panel>
                        <Panel header={<span className="label">图片信息 <Icon type="caret-down" /></span>} key="2" style={this.customPanelStyle}>
                            <Upload
                                hideButton={!editable}
                                quoteId={workOrderInfo.id}
                                quoteType="repairOrderImg"
                                commonActions={commonActions}
                                commonState={commonState}
                            />
                        </Panel>
                        <Panel header={<span className="label">执行记录 <Icon type="caret-down" /></span>} key="4" style={this.customPanelStyle}>
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

export default connect(mapStateToProps, buildActionDispatcher)(WorkOrderThreeComponent);