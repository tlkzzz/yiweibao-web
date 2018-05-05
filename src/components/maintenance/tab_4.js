/**
 * 维保保养-维保工单-确认验收 
 */
import React from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { browserHistory } from 'react-router';
import actions from '../../actions/maintenance.js';
import commonActions from '../../actions/common.js';

import Dropdown from '../../components/common/dropdown.js';
import Upload from '../../components/common/upload.js';

import { msFormat } from '../../tools/';

import { Icon, Button, Table, Pagination, Collapse, Form, Input, Row, Col, Select, Radio, DatePicker, Menu, Timeline } from 'antd';
const Panel = Collapse.Panel;
const FormItem = Form.Item;
const Option = Select.Option;
const RadioButton = Radio.Button;
const RadioGroup = Radio.Group;

import moment from 'moment';

class FormComponent extends React.Component {
    componentDidUpdate () {
        const { form, parentProps } = this.props;
        const { state, actions } = parentProps;
        if (!state.getFormValues) {
            actions.getFormValues(form.getFieldsValue());
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
        commonActions.getDomainValue(domainValueParam, 'workOrder', 'WORK_ORDER_STATUS');
    }
    render () {
        let { data, editable, parentProps, form } = this.props;
        const { state, commonState } = parentProps;
        const { getFieldDecorator } = form;
        data = data ? data : {}

        const nowDate = moment(moment().format('YYYY-MM-DD HH:mm:ss'));

        return (
            <Form layout="vertical">
                <Row gutter={16}>
                    <Col className="gutter-row" xs={{ span: 6}}>
                        <FormItem
                            label="确认解决"
                        >
                            {
                                getFieldDecorator('confirm', {
                                    initialValue: data.confirm === true ? 'true' : 'false'
                                })(
                                    <RadioGroup size="large" className="radio-group-col-2" style={{ width: '100%' }} disabled={state.workOrderCheckListData.status === 'GB' ? true : !editable}>
                                        <RadioButton value="true">是</RadioButton>
                                        <RadioButton value="false">否</RadioButton>
                                    </RadioGroup>
                                )
                            }
                        </FormItem>
                    </Col>
                    <Col className="gutter-row" xs={{ span: 6}}>
                        <FormItem
                            label="验收人"
                        >
                            {
                                getFieldDecorator('acceptorName', {
                                    initialValue: commonState.personName
                                })(
                                    <Input disabled />
                                )
                            }
                        </FormItem>
                    </Col>
                    <Col className="gutter-row" style={{display: 'none'}}>
                        <FormItem
                            label="验收人id"
                        >
                            {
                                getFieldDecorator('acceptorId', {
                                    initialValue: commonState.personId
                                })(
                                    <Input disabled />
                                )
                            }
                        </FormItem>
                    </Col>
                    <Col className="gutter-row" xs={{ span: 6}}>
                        <FormItem
                            label="验收时间"
                        >
                            {
                                getFieldDecorator('acceptionTime', data.acceptionTime && {
                                    initialValue: moment(data.acceptionTime, 'YYYY-MM-DD HH:mm')
                                })(
                                    <DatePicker
                                        disabled={state.workOrderCheckListData.status === 'GB' ? true : !editable}
                                        showTime
                                        format="YYYY-MM-DD HH:mm:ss"
                                        placeholder="选择日期"
                                        onChange={() => {
                                            form.setFieldsValue({
                                                confirm: 'true'
                                            })
                                        }}
                                        onOk={() => {
                                            form.setFieldsValue({
                                                confirm: 'true'
                                            })
                                        }}
                                    />
                                )
                            }
                        </FormItem>
                    </Col>
                    <Col className="gutter-row" xs={{ span: 6}}>
                        <FormItem
                            label="单设备标准工时"
                        >
                            {
                                getFieldDecorator('singleAssetNomaltime', {
                                    initialValue: data.singleAssetNomaltime
                                })(
                                    <Input disabled />
                                )
                            }
                        </FormItem>
                    </Col>
                    <Col className="gutter-row" xs={{ span: 6}}>
                        <FormItem
                            label="单设备本次工时"
                        >
                            {
                                getFieldDecorator('singleAssetThistime', {
                                    initialValue: data.singleAssetThistime
                                })(
                                    <Input disabled />
                                )
                            }
                        </FormItem>
                    </Col>
                    <Col className="gutter-row" xs={{ span: 6}}>
                        <FormItem
                            label="单设备上次工时"
                        >
                            {
                                getFieldDecorator('singleAssetLasttime', {
                                    initialValue: data.singleAssetLasttime
                                })(
                                    <Input disabled />
                                )
                            }
                        </FormItem>
                    </Col>
                    <Col className="gutter-row" xs={{ span: 6}}>
                        <FormItem
                            label="工单总时长"
                        >
                            {
                                getFieldDecorator('workOrderTotalDuration', {
                                    initialValue: data.workOrderTotalDuration
                                })(
                                    <Input disabled />
                                )
                            }
                        </FormItem>
                    </Col>
                    <Col className="gutter-row" xs={{ span: 6}}>
                        <FormItem
                            label="单设备总工时"
                        >
                            {
                                getFieldDecorator('workOrderTotalTime', {
                                    initialValue: data.workOrderTotalTime
                                })(
                                    <Input disabled />
                                )
                            }
                        </FormItem>
                    </Col>
                    <Col className="gutter-row" xs={{ span: 6}}>
                        <FormItem
                            label="验收说明"
                        >
                            {
                                getFieldDecorator('acceptionDesc', {
                                    initialValue: data.acceptionDesc
                                })(
                                    <Input type="textarea" className="eam-textarea" disabled={state.workOrderCheckListData.status === 'GB' ? true : !editable} />
                                )
                            }
                        </FormItem>
                    </Col>
                </Row>
            </Form>
        )
    }
}
const NewForm = Form.create()(FormComponent);

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

        let defaultRender = (text, record, key) => {
            return (
                <p>{text ? text : '-'}</p>
            )
        };

        this.formValuesArr = [];

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
                title: '估计持续时间（分钟）',
                dataIndex: 'duration',
                key: 'duration',
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
                                onClick={() => {
                                    this.taskStepsDel(record);
                                }}
                            />
                            <Icon type="edit"
                                onClick={() => {
                                    this.taskStepsEdit(record);
                                }}
                            />
                        </div>
                    )
                }
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
    workOrderCheckGetList = () => {
        const { actions } = this.props;
        this.setState({ tableLoading: true });
        actions.workOrderCheckUpdateList(this.param, () => {
            this.setState({ tableLoading: false });
        });
    }
    componentWillMount () {
        const { location } = this.props;
        const isAddWorkOrder = location.query.add_work_order;

        const curProcess = location.pathname.charAt(location.pathname.length-1);
        if (this.localWorkOrder && this.localWorkOrder.process >= curProcess) this.workOrderCheckGetList();

        if (this.localWorkOrder && this.localWorkOrder.process == curProcess) {
            this.setState({ editable: true });
        } else {
            this.setState({ editable: false });
        }
        if (!isAddWorkOrder && !this.localWorkOrder) browserHistory.push('/maintenance/work_order');
    }
    render () {

        const { state, actions, commonActions, commonState } = this.props;
        const data = state.workOrderCheckListData;

        // 执行记录数据
        const recordList = data.eamImpleRecordVoVoList || [];
        // 执行记录日期
        const recordDateArr = data.dateArr;
        
        return (
            <div className="eam-tab-page">
                <div className="eam-content">
                    <Collapse bordered={false} defaultActiveKey={['1', '2', '3']}>
                        <Panel header={<span className="label">工单信息 <Icon type="caret-down" /></span>} key="1" style={this.customPanelStyle}>
                            <NewForm
                                data={data}
                                editable={this.state.editable}
                                parentProps={{...this.props}}
                            />
                        </Panel>
                        <Panel header={<span className="label">上传图片 <Icon type="caret-down" /></span>} key="2" style={this.customPanelStyle}>
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

export default connect(mapStateToProps, buildActionDispatcher)(WorkOrderOneComponent);