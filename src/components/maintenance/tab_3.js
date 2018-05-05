/**
 * 维保保养-维保工单-执行汇报 
 */
import React from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { browserHistory } from 'react-router';
import actions from '../../actions/maintenance.js';
import commonActions from '../../actions/common.js';

import Dropdown from '../../components/common/dropdown.js';
import SelectPerson from '../../components/common/select_person.js';
import Upload from '../../components/common/upload.js';

import { msFormat, filterArrByAttr } from '../../tools/';

import { Icon, Button, Table, Pagination, Collapse, Form, Input, Row, Col, Select, Radio, DatePicker, Menu, Timeline, notification } from 'antd';
const Panel = Collapse.Panel;
const FormItem = Form.Item;
const Option = Select.Option;
const RadioButton = Radio.Button;
const RadioGroup = Radio.Group;

import moment from 'moment';

class FormComponent extends React.Component {
    constructor (props) {
        super(props);

        this.state = {
            selectPersonModalShow: false,
        }
    }
    personInputFocus = (e) => {
        this.setState({ selectPersonModalShow: true });
    }
    suspensionChange = (e) => {
        this.suspensionChanged = true;
        let suspensionTypeDisabled;
        if (e.target.value === 'true') {
            suspensionTypeDisabled = false;
        } else {
            suspensionTypeDisabled = true;
        }
        this.setState({ suspensionTypeDisabled });
    }
    componentDidUpdate () {
        const { form, parentProps } = this.props;
        const { state, actions } = parentProps
        if (!state.getFormValues) {
            actions.getFormValues(true);
            form.validateFields((err, values) => {
                if (err) {
                    for (let attr in err) {
                        notification.warning({
                            message: '提示',
                            description: err[attr].errors[0].message
                        });
                        break;
                    }
                } else {
                    actions.getFormValues(values);
                }
            });
        }
    }
    componentWillMount () {
        const { parentProps } = this.props;
        const { commonState, commonActions } = parentProps;
        const domainValueParam = {
            orgId: commonState.orgId,
            siteId: commonState.siteId,
            prodId: 'EAM'
        }
        commonActions.getDomainValue(domainValueParam, 'suspensiontype', 'SUSPENSION_TYPE');
        commonActions.getDomainValue(domainValueParam, 'workOrder', 'WORK_ORDER_STATUS');
    }
    render () {
        let { data, editable, form, parentProps } = this.props;
        const { commonState, state } = parentProps;
        const { getFieldDecorator } = this.props.form;
        const suspensionTypeData = commonState.suspensionTypeData;

        const nowDate = moment(moment().format('YYYY-MM-DD HH:mm:ss'));

        if (editable) {
            if (data.suspension !== null) {
                this.suspensionTypeDisabled = data.suspension ? false : true;
            } else {
                this.suspensionTypeDisabled = form.getFieldValue('suspension') === 'true' ? false : true;
            }
        } else {
            this.suspensionTypeDisabled = true;
        }

        return (
            <div>
                <Form layout="vertical">
                    <Row gutter={16}>
                        <Col className="gutter-row" xs={{ span: 18}}>
                            <Row gutter={16}>
                                <Col className="gutter-row" xs={{ span: 8}}>
                                    <FormItem
                                        label="实际开始时间"
                                    >
                                        {
                                            getFieldDecorator('actualStartDate', {
                                                initialValue: data.actualStartDate ? moment(data.actualStartDate, 'YYYY-MM-DD HH:mm') : nowDate,
                                                rules: [{
                                                    type: 'object',
                                                    required: true,
                                                    message: '实际开始时间不能为空！',
                                                }],
                                            })(
                                                <DatePicker
                                                    disabled={state.workOrderReportListData.status === 'DHB' ? !editable : true}
                                                    showTime
                                                    format="YYYY-MM-DD HH:mm:ss"
                                                    placeholder="选择日期"
                                                    onChange={(onChange) => {}}
                                                    onOk={(onOk) => {}}
                                                />
                                            )
                                        }
                                    </FormItem>
                                </Col>
                                <Col className="gutter-row" xs={{ span: 8}}>
                                    <FormItem
                                        label="挂起"
                                    >
                                        {
                                            getFieldDecorator('suspension', {
                                                initialValue: data.suspension && data.suspension + '' || 'false'
                                            })(
                                                <RadioGroup size="large" className="radio-group-col-2" style={{ width: '100%' }} disabled={state.workOrderReportListData.status === 'DHB' ? !editable : true} onChange={this.suspensionChange}>
                                                    <RadioButton value="true">是</RadioButton>
                                                    <RadioButton value="false">否</RadioButton>
                                                </RadioGroup>
                                            )
                                        }
                                    </FormItem>
                                </Col>
                                <Col className="gutter-row" xs={{ span: 8}}>
                                    <FormItem
                                        label="执行人"
                                    >
                                        {
                                            getFieldDecorator('actualExecutorName', {
                                                initialValue: data.actualExecutorName
                                            })(
                                                <Input
                                                    suffix={
                                                        (state.workOrderReportListData.status === 'DHB' ? !editable : true) ?
                                                        null :
                                                        <Icon style={{cursor: 'pointer'}} type="plus" onClick={this.personInputFocus} />
                                                    }
                                                    onClick={this.personInputFocus}
                                                    readOnly
                                                    disabled={state.workOrderReportListData.status === 'DHB' ? !editable : true}
                                                />
                                            )
                                        }
                                    </FormItem>
                                </Col>
                                <Col className="gutter-row" style={{display: 'none'}}>
                                    <FormItem
                                        label="执行人id"
                                    >
                                        {
                                            getFieldDecorator('actualExecutorId', {
                                                initialValue: data.actualExecutorId
                                            })(
                                                <Input readOnly/>
                                            )
                                        }
                                    </FormItem>
                                </Col>
                                <Col className="gutter-row" xs={{ span: 8}}>
                                    <FormItem
                                        label="实际完成时间"
                                    >
                                        {
                                            getFieldDecorator('actualEndDate', {
                                                initialValue: data.actualEndDate ? moment(data.actualEndDate, 'YYYY-MM-DD HH:mm') : nowDate,
                                                rules: [{
                                                    type: 'object',
                                                    required: true,
                                                    message: '实际完成时间不能为空！',
                                                }],
                                            })(
                                                <DatePicker
                                                    disabled={state.workOrderReportListData.status === 'DHB' ? !editable : true}
                                                    showTime
                                                    format="YYYY-MM-DD HH:mm:ss"
                                                    placeholder="选择日期"
                                                    onChange={(onChange) => {}}
                                                    onOk={(onOk) => {}}
                                                />
                                            )
                                        }
                                    </FormItem>
                                </Col>
                                <Col className="gutter-row" xs={{ span: 8}}>
                                    <FormItem
                                        label="挂起类型"
                                    >
                                        {
                                            getFieldDecorator('suspensionType', {
                                                initialValue: data.suspensionType ? data.suspensionType : (suspensionTypeData[0] && suspensionTypeData[0].value)
                                            })(
                                                <Select size="large" style={{ width: '100%' }} disabled={this.suspensionChanged ? this.state.suspensionTypeDisabled : this.suspensionTypeDisabled}>
                                                    {
                                                        suspensionTypeData.map((item, i) => <Option key={i} value={item.value}>{item.description}</Option>)
                                                    }                                               
                                                </Select>
                                            )
                                        }
                                    </FormItem>
                                </Col>
                                <Col className="gutter-row" xs={{ span: 8}}>
                                    <FormItem
                                        label="实际执行班组"
                                    >
                                        {
                                            getFieldDecorator('actualWorkGroup', {
                                                initialValue: data.actualWorkGroup
                                            })(
                                                <Input disabled/>
                                            )
                                        }
                                    </FormItem>
                                </Col>
                                <Col className="gutter-row" style={{display: 'none'}}>
                                    <FormItem
                                        label="返回执行人所属班组"
                                    >
                                        {
                                            getFieldDecorator('personWorkGroup', {
                                                initialValue: data.personWorkGroup
                                            })(
                                                <Input disabled/>
                                            )
                                        }
                                    </FormItem>
                                </Col>
                            </Row>
                        </Col>
                        
                        <Col className="gutter-row" xs={{ span: 6}}>
                            <FormItem
                                label="故障总结"
                            >
                                {
                                    getFieldDecorator('failureSummarize', {
                                        initialValue: data.failureSummarize
                                    })(
                                        <Input type="textarea" className="eam-textarea" disabled={state.workOrderReportListData.status === 'DHB' ? !editable : true}/>
                                    )
                                }
                            </FormItem>
                        </Col>
                    </Row>
                </Form>
                <SelectPerson
                    multiple
                    visible={this.state.selectPersonModalShow}
                    selectPersonModalHide={() => { this.setState({selectPersonModalShow: false}) }}
                    setSelected={() => {
                        let actualExecutorName = form.getFieldValue('actualExecutorName');
                        let actualExecutorId = form.getFieldValue('actualExecutorId');
                        let personWorkGroup = form.getFieldValue('personWorkGroup');

                        actualExecutorName = actualExecutorName ? actualExecutorName.split(',') : [];
                        actualExecutorId = actualExecutorId ? actualExecutorId.split(',') : [];
                        personWorkGroup = personWorkGroup ? personWorkGroup.split(',') : [];

                        actualExecutorId = actualExecutorId.map((item, i) => (
                            {
                                personId: item,
                                name: actualExecutorName[i],
                                workgroup: personWorkGroup[i],
                            }
                        ));

                        return  actualExecutorId;
                    }}
                    onOk={(selected) => {
                        const len = selected.length;
                        let actualWorkGroup;

                        if (len > 1) {
                            let isSame = true;
                            for (let i = 1; i < len; i++) {
                                if (selected[i].workgroup !== selected[i-1].workgroup) {
                                    isSame = false;
                                    break;
                                }
                            }
                            actualWorkGroup = isSame ? selected[0].workgroup : '';
                        } else {
                            actualWorkGroup = selected[0].workgroup;
                        }

                        const json = {
                            actualExecutorName: filterArrByAttr(selected, 'name').join(','),
                            actualExecutorId: filterArrByAttr(selected, 'personId').join(','),
                            actualWorkGroup
                        }

                        form.setFieldsValue(json);
                    }}
                />
            </div>
        )
    }
}

const NewForm = Form.create()(FormComponent);

class WorkOrderThreeComponent extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            modalShow: false,
            currentPage: 1,
            tableLoading: false,
        }

        this.customPanelStyle = {
            background: '#fff',
            borderRadius: 2,
            marginBottom: 24,
            border: 0,
            boxShadow: '0 1px 6px rgba(0, 0, 0, 0.2)'
        };

        let defaultRender = (text, record, key) => {
            return (
                <p>{text ? text : '-'}</p>
            )
        };

        // 任务步骤表格字段
        this.taskStepsColumns = [
            {
                title: '任务',
                dataIndex: 'step',
                key: 'step',
                sorter: true,
                render: defaultRender
            },
            {
                title: '任务描述',
                width: '30%',
                dataIndex: 'description',
                key: 'description',
                sorter: true,
                render: defaultRender
            },
            {
                title: '质量标准',
                dataIndex: 'qualityStandard',
                key: 'qualityStandard',
                sorter: true,
                render: defaultRender
            },
            {
                title: '估计持续时间',
                dataIndex: 'duration',
                key: 'duration',
                sorter: true,
                render: defaultRender
            },
            // {
            //     title: '实际执行工时(分钟)',
            //     dataIndex: 'actualExecuteTime',
            //     key: 'actualExecuteTime',
            //     sorter: true,
            //     render: defaultRender
            // },
            {
                title: '已执行',
                dataIndex: 'executeSituation',
                key: 'executeSituation',
                sorter: true,
                render: (text, record, key) => {
                    let txt;
                    if (text === true) {
                        txt = <Icon type="check-circle-o" title="是" />
                    }
                    else if (text === false) {
                        txt = <Icon type="minus-circle-o" title="否" />
                    }
                    else {
                        txt = '-'
                    }

                    return (
                        <p>{txt}</p>
                    )
                }
            },
            {
                title: '是否异常',
                dataIndex: 'abnormal',
                key: 'abnormal',
                sorter: true,
                render: (text, record, key) => {
                    let txt;
                    if (text === true) {
                        txt = <Icon type="check-circle-o" title="是" />
                    }
                    else if (text === false) {
                        txt = <Icon type="minus-circle-o" title="否" />
                    }
                    else {
                        txt = '-'
                    }

                    return (
                        <p>{txt}</p>
                    )
                }
            },
        ];
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
                title: '物料描述',
                width: '30%',
                dataIndex: 'description',
                key: 'description',
                sorter: true,
                render: defaultRender
            },
            {
                title: '实际数量',
                dataIndex: 'itemQty',
                key: 'itemQty',
                sorter: true,
                render: (text, record, key) => {
                    record.itemQty = record.itemQty ? record.itemQty : 1;
                    return (
                        <NumInp unit="个" onChange={(num) => {
                            record.itemQty = num;
                            this.materialsEdit(record);
                        }} />
                    )
                }
            },
            {
                title: '单位',
                dataIndex: 'itemUnit',
                key: 'itemUnit',
                sorter: true,
                render: defaultRender
            },
            {
                title: '库房',
                dataIndex: 'storeRoomId',
                key: 'storeRoomId',
                sorter: true,
                render: defaultRender
            },
        ];

        const { location } = this.props;

        const isAddWorkOrder = location.query.add_work_order;

        this.param = {
            id: isAddWorkOrder ? '' : (localStorage.getItem('workOrder') && JSON.parse(localStorage.getItem('workOrder')).id),
            pageNum: 1,
            pageSize: 998,
        }

        this.localWorkOrder = JSON.parse(localStorage.getItem('workOrder'));
    }
    workOrderReportGetList = () => {
        const { actions } = this.props;
        this.setState({ tableLoading: true });
        actions.workOrderReportUpdateList(this.param, () => {
            this.setState({ tableLoading: false });
        });
    }
    componentWillMount () {
        const { location } = this.props;
        const isAddWorkOrder = location.query.add_work_order;

        const curProcess = location.pathname.charAt(location.pathname.length-1);
        if (this.localWorkOrder && this.localWorkOrder.process >= curProcess) this.workOrderReportGetList();

        if (this.localWorkOrder && this.localWorkOrder.process == curProcess) {
            this.setState({ editable: true });
        } else {
            this.setState({ editable: false });
        }
        if (!isAddWorkOrder && !this.localWorkOrder) browserHistory.push('/maintenance/work_order');
    }
    render () {
        const { state, commonActions, commonState, actions } = this.props;

        const data = state.workOrderReportListData;
        // 任务步骤数据
        const taskStepsList = data.eamOrderstepVoList;
        // 所需物料数据
        const materialsList = data.eamActualitemVoList;

        // 执行记录数据
        const recordList = data.eamImpleRecordVoVoList || [];
        // 执行记录日期
        const recordDateArr = data.dateArr;
        

        return (
            <div className="eam-tab-page">
                <div className="eam-content">
                    <Collapse bordered={false} defaultActiveKey={['1', '2', '3', '4', '5']}>
                        <Panel header={<span className="label">工单信息 <Icon type="caret-down" /></span>} key="1" style={this.customPanelStyle}>
                            <NewForm
                                data={data}
                                editable={this.state.editable}
                                parentProps={{...this.props}}
                            />
                        </Panel>
                        <Panel header={<span className="label">任务步骤 <Icon type="caret-down" /></span>} key="2" style={this.customPanelStyle}>
                            <Table
                                rowKey="id"
                                loading={this.state.tableLoading}
                                pagination={{
                                    showTotal: (total, range) => `当前第${range[0]}-${range[1]}条 / 共${total}条`,
                                    defaultPageSize: 5,
                                }}
                                dataSource={taskStepsList}
                                columns={this.taskStepsColumns}
                                bordered
                            />
                        </Panel>
                        <Panel header={<span className="label">工单实际物料 <Icon type="caret-down" /></span>} key="3" style={this.customPanelStyle}>
                            <Table
                                rowKey="id"
                                loading={this.state.tableLoading}
                                pagination={{
                                    showTotal: (total, range) => `当前第${range[0]}-${range[1]}条 / 共${total}条`,
                                    defaultPageSize: 5,
                                }}
                                dataSource={materialsList}
                                columns={this.materialsColumns}
                                bordered
                            />
                        </Panel>
                        <Panel header={<span className="label">上传图片 <Icon type="caret-down" /></span>} key="4" style={this.customPanelStyle}>
                            {
                                this.localWorkOrder.id ?
                                <Upload
                                    quoteId={this.localWorkOrder.id}
                                    quoteType="assetImg"
                                    commonActions={commonActions}
                                    commonState={commonState}
                                /> :
                                <span>请保存工单后上传图片</span>
                            }
                        </Panel>
                        <Panel header={<span className="label">执行记录 <Icon type="caret-down" /></span>} key="5" style={this.customPanelStyle}>
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


function mapStateToProps (state) {
    return {
        state: state.maintenance,
        commonState: state.common,
    }
}

function buildActionDispatcher(dispatch) {
    return {
        actions: bindActionCreators(actions, dispatch),
        commonActions: bindActionCreators(commonActions, dispatch),
    }
}

export default connect(mapStateToProps, buildActionDispatcher)(WorkOrderThreeComponent);