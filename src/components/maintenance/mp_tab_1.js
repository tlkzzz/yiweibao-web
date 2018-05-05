/**
 * 维修保养-预防维护计划-预防维护 
 */
import React from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { browserHistory } from 'react-router';
import actions from '../../actions/maintenance.js';
import commonActions from '../../actions/common.js';
import SelectPerson from '../common/select_person';

import Dropdown from '../../components/common/dropdown.js';
import SelectPublic from '../../components/common/select_public.js';
import SelectAsset from '../../components/common/select_asset.js';
import EamModal from '../../components/common/modal.js';

import { filterArrByAttr } from '../../tools/';

import { Icon, Button, Upload, Modal, Table, Pagination, Collapse, Form, Input, Row, Col, Select, Radio, DatePicker, Checkbox, Menu, Tabs, InputNumber, notification } from 'antd';
const Panel = Collapse.Panel;
const FormItem = Form.Item;
const Option = Select.Option;
const RadioButton = Radio.Button;
const RadioGroup = Radio.Group;
const TabPane = Tabs.TabPane;
const { RangePicker } = DatePicker;

import moment from 'moment';

class FormComponent extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            currentPage: 1,
        }
    }
    componentDidUpdate () {
        const { form, formValuesArr, parentProps } = this.props;
        const { state, actions } = parentProps;
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
                    formValuesArr[0] = values;
                }
            });
        }
    }
    componentWillMount () {
        const { parentProps } = this.props;
        const { commonActions, commonState } = parentProps;
        const domainValueParam = {
            orgId: commonState.orgId,
            siteId: commonState.siteId,
            prodId: 'EAM'
        }
        commonActions.getDomainValue(domainValueParam, 'pmStatus', 'PM_STATUS');
    }
    render () {
        
        const { data, form, location, parentProps } = this.props;
        const { state, commonState } = parentProps;
        const { getFieldDecorator } = form;

        const isAddMaintenancePlan = location.query.add_maintenance_Plan;

        const pmStatusData = commonState.pmStatusData;

        const today = moment().format('YYYY-MM-DD HH:mm:ss');

        return (
            <Form layout="vertical">
                <Row gutter={16} justify="start">
                    <Col className="gutter-row" xs={{ span: 4}}>
                        <FormItem
                            label="编码"
                        >
                            {
                                getFieldDecorator('maintenancePlanNum',{
                                    initialValue: isAddMaintenancePlan ? state.maintenancePlanCode : data.maintenancePlanNum,
                                    rules: [{
                                        required: true,
                                        message: '编码不能为空！',
                                    }],
                                })(
                                    <Input disabled />
                                )
                            }
                        </FormItem>
                    </Col>
                    <Col className="gutter-row" xs={{ span: 8}}>
                        <FormItem
                            label="描述"
                        >
                            {
                                getFieldDecorator('description',{
                                    initialValue: data.description,
                                    rules: [{
                                        required: true,
                                        message: '描述不能为空！',
                                    }],
                                })(
                                    <Input />
                                )
                            }
                        </FormItem>
                    </Col>
                    <Col className="gutter-row" xs={{ span: 6}}>
                        <FormItem
                            label="创建人"
                        >
                            {
                                getFieldDecorator('createUserName',{
                                    initialValue: isAddMaintenancePlan ? commonState.personName : data.createUserName
                                })
                                (
                                    <Input disabled />
                                )
                            }
                        </FormItem>
                    </Col>
                    <Col className="gutter-row" style={{display: 'none'}}>
                        <FormItem
                            label="创建人id"
                        >
                            {
                                getFieldDecorator('createUser',{
                                    initialValue: isAddMaintenancePlan ? commonState.personId : data.createUser
                                })
                                (
                                    <Input disabled />
                                )
                            }
                        </FormItem>
                    </Col>
                    <Col className="gutter-row" xs={{ span: 6}}>
                        <FormItem
                            label="站点"
                        >
                            {
                                getFieldDecorator('siteName', {
                                  initialValue: isAddMaintenancePlan ? commonState.siteName : data.siteName
                                })(
                                    <Input disabled />
                                )
                            }
                        </FormItem>
                    </Col>
                </Row>
                <Row gutter={16} justify="start">
                    <Col className="gutter-row" xs={{ span: 4}}>
                        <FormItem
                            label="状态时间"
                        >
                            {
                                getFieldDecorator('statusDate', {
                                  initialValue: isAddMaintenancePlan ? today : data.statusDate
                                })(
                                    <Input disabled />
                                )
                            }
                        </FormItem>
                    </Col>
                    <Col className="gutter-row" xs={{ span: 6}} offset={8}>
                        <FormItem
                            label="创建时间"
                        >
                            {
                                getFieldDecorator('createDate', {
                                  initialValue: isAddMaintenancePlan ? today : data.createDate
                                })(
                                    <Input disabled />
                                )
                            }
                        </FormItem>
                    </Col>
                    <Col className="gutter-row" xs={{ span: 6}}>
                        <FormItem
                            label="状态"
                        >
                            {
                                getFieldDecorator('status',{
                                  initialValue: isAddMaintenancePlan ? (pmStatusData[0] && pmStatusData[0].value) : data.status
                                })
                                (

                                    <Select size="large" style={{ width: '100%' }} disabled >
                                        {
                                            pmStatusData.map((item, i) => <Option key={i} value={item.value}>{item.description}</Option>)
                                        }
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
const NewForm = Form.create()(FormComponent)

//采购信息
class BuyFormComponent extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            currentPage: 1,
            selectPersonModalShow: false,
            jobPlanModalShow: false,
        }

    }
    selectJobPlanShow = () => {
        this.setState({ jobPlanModalShow: true });
    }
    selectPersonModalShow = (e) => {
        this.currentInp = e.target.getAttribute('data-name');
        this.setState({selectPersonModalShow: true})
    }
    componentDidUpdate () {
        const { form, formValuesArr, parentProps } = this.props;
        const { state, actions } = parentProps;
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
                    formValuesArr[1] = values;
                }
            });
        }
    }
    componentWillMount () {
        const { parentProps } = this.props;
        const { commonActions, commonState } = parentProps;
        const domainValueParam = {
            orgId: commonState.orgId,
            siteId: commonState.siteId,
            prodId: 'EAM'
        }
        // commonActions.getDomainValue(domainValueParam, 'woType', 'WORK_ORDER_TYPE');
        commonActions.getDomainValue(domainValueParam, 'woProjectType', 'WORK_PROJECT_TYPE');
        // commonActions.getDomainValue(domainValueParam, 'responsibleGroup', 'RESPONSIBLE_GROUP');
    }
    render () {
        
        const { data, form, parentProps, location } = this.props;
        const { commonState } = parentProps;
        const { getFieldDecorator } = form;

        const isAddMaintenancePlan = location.query.add_maintenance_Plan;

        const workProjectTypeData = commonState.workProjectTypeData;
              /*workOrderTypeData = commonState.workOrderTypeData,
              workOrderStatus = commonState.workOrderStatusData,
              responsibleGroupData = commonState.responsibleGroupData;*/

        const defaultRender = (text, record, key) => {
            return (
                <p>{text ? text : '-'}</p>
            )
        };

        const jobPlanColumns = [
            {
                title: '编码',
                dataIndex: 'jobStandardNum',
                key: 'jobStandardNum',
                sorter: true,
            },
            {
                title: '描述',
                dataIndex: 'description',
                key: 'description',
                sorter: true,
                render: defaultRender
            },
            {
                title: '标准类型',
                dataIndex: 'standardType',
                key: 'standardType',
                sorter: true,
                render: (text, record, key) => {
                    const arr = commonState.standardTypeData.filter((item, i) => {
                        return item.value == text;
                    });

                    return (
                        <p>{arr.length ? arr[0].description : '-'}</p>
                    )
                }
            },
            {
                title: '状态',
                dataIndex: 'status',
                key: 'status',
                sorter: true,
                render: (text, record, key) => {
                    const arr = commonState.jpStatusData.filter((item, i) => {
                        return item.value == text;
                    });

                    return (
                        <p>{arr.length ? arr[0].description : '-'}</p>
                    )
                }
            },
            {
                title: '作业类型',
                dataIndex: 'jobType',
                key: 'jobType',
                sorter: true,
                render: (text, record, key) => {
                    const arr = commonState.jpTypeData.filter((item, i) => {
                        return item.value == text;
                    });

                    return (
                        <p>{arr.length ? arr[0].description : '-'}</p>
                    )
                }
            },
            {
                title: '站点',
                dataIndex: 'siteName',
                key: 'siteName',
                render: defaultRender
            },
        ];

        return (
            <div>
                <Form layout="vertical">
                    <Row gutter={16} justify="start">
                        <Col className="gutter-row" xs={{ span: 6}}>
                            <FormItem
                                label="作业标准"
                            >
                                {
                                    getFieldDecorator('jobStandardNum',{
                                      initialValue : data.jobStandardNum
                                    })(
                                        <Input suffix={<Icon style={{cursor: 'pointer'}} type="plus" onClick={this.selectJobPlanShow} />} onClick={this.selectJobPlanShow} />
                                    )
                                }
                            </FormItem>
                        </Col>
                        <Col className="gutter-row" style={{display: 'none'}}>
                            <FormItem
                                label="作业标准id"
                            >
                                {
                                    getFieldDecorator('jobStandardId',{
                                      initialValue : data.jobStandardId
                                    })(
                                        <Input suffix={<Icon type="plus" />} />
                                    )
                                }
                            </FormItem>
                        </Col>
                        <Col className="gutter-row" xs={{ span: 6}}>
                            <FormItem
                                label="描述"
                            >
                                {
                                  getFieldDecorator('jobStandardDesc',{
                                    initialValue : data.jobStandardDesc
                                  })(
                                        <Input disabled />
                                    )
                                }
                            </FormItem>
                        </Col>
                        {/*<Col className="gutter-row" xs={{ span: 6}}>
                            <FormItem
                                label="责任班组"
                            >
                                {
                                    getFieldDecorator('personliableWorkGroup',{
                                        initialValue : data.personliableWorkGroup
                                    })(
                                        <Select size="large" style={{ width: '100%' }}>
                                            {
                                                responsibleGroupData.map((item, i) => <Option key={i} value={item.value}>{item.description}</Option>)
                                            }
                                        </Select>
                                    )
                                }
                            </FormItem>
                        </Col>
                        <Col className="gutter-row" xs={{ span: 6}}>
                            <FormItem
                                label="分派人"
                            >
                                {
                                  getFieldDecorator('assignPersonName',{
                                    initialValue : data.assignPersonName
                                  })(
                                       <Input suffix={<Icon style={{cursor: 'pointer'}} type="plus" data-name="assignPerson" onClick={this.selectPersonModalShow} />} data-name="assignPerson" onClick={this.selectPersonModalShow} />
                                    )
                                }
                            </FormItem>
                        </Col>
                        <Col className="gutter-row" style={{display: 'none'}}>
                            <FormItem
                                label="分派人id"
                            >
                                {
                                  getFieldDecorator('assignPersonId',{
                                    initialValue : data.assignPersonId
                                  })(
                                       <Input />
                                    )
                                }
                            </FormItem>
                        </Col>
                        <Col className="gutter-row" xs={{ span: 6}}>
                            <FormItem
                                label="工单类型"
                            >
                                {
                                  getFieldDecorator('workOrderType',{
                                    initialValue : data.workOrderType
                                  })(
                                    <Select size="large" style={{ width: '100%' }}>
                                        {
                                            workOrderTypeData.map((item, i) => <Option key={i} value={item.value}>{item.description}</Option>)
                                        }
                                    </Select>
                                    )
                                }
                            </FormItem>
                        </Col>*/}
                        <Col className="gutter-row" xs={{ span: 6}}>
                            <FormItem
                                label="事件级别"
                            >
                                {
                                  getFieldDecorator('incidentLevel',{
                                    initialValue : isAddMaintenancePlan ? 'M' : data.incidentLevel
                                  })(
                                        <RadioGroup size="large" className="radio-group-col-3" style={{ width: '100%' }}>
                                            <RadioButton value="H">高</RadioButton>
                                            <RadioButton value="M">中</RadioButton>
                                            <RadioButton value="L">低</RadioButton>
                                        </RadioGroup>
                                    )
                                }
                            </FormItem>
                        </Col>
                        <Col className="gutter-row" xs={{ span: 6}}>
                            <FormItem
                                label="工程类型"
                            >
                                {
                                    getFieldDecorator('projectType',{
                                        initialValue : data.projectType,
                                        rules: [{
                                            required: true,
                                            message: '工程类型不能为空！',
                                        }],
                                    })(
                                        <Select size="large" style={{ width: '100%' }}>
                                            {
                                                workProjectTypeData.map((item, i) => <Option key={i} value={item.value}>{item.description}</Option>)
                                            }
                                        </Select>
                                    )
                                }
                            </FormItem>
                        </Col>
                        {/*<Col className="gutter-row" xs={{ span: 6}}>
                            <FormItem
                                label="责任人"
                            >
                                {
                                  getFieldDecorator('personliableName',{
                                    initialValue : data.personliableName
                                  })(
                                      <Input suffix={<Icon style={{cursor: 'pointer'}} type="plus" data-name="personliable" onClick={this.selectPersonModalShow} />} data-name="personliable" onClick={this.selectPersonModalShow} />
                                    )
                                }
                            </FormItem>
                        </Col>
                        <Col className="gutter-row" style={{display: 'none'}}>
                            <FormItem
                                label="责任人id"
                            >
                                {
                                  getFieldDecorator('personliableId',{
                                    initialValue : data.personliableId
                                  })(
                                      <Input />
                                    )
                                }
                            </FormItem>
                        </Col>*/}
                        <Col className="gutter-row" xs={{ span: 6}}>
                            <FormItem
                                label="是否外委？"
                            >
                                {
                                    getFieldDecorator('udisww', {
                                        initialValue: typeof data.udisww + '' === 'undefined' ? 'false' : data.udisww + ''
                                    })
                                    (    
                                        <RadioGroup size="large" className="radio-group-col-2" style={{ width: '100%' }}>
                                            <RadioButton value="true"><i className="radio-group-icon-o"></i>外委</RadioButton>
                                            <RadioButton value="false"><Icon type="minus" />非外委</RadioButton>
                                        </RadioGroup>
                                    )
                                }
                            </FormItem>
                        </Col>
                        <Col className="gutter-row" xs={{ span: 6}}>
                            <FormItem
                                label="上次开始时间"
                            >
                                {
                                  getFieldDecorator('lastStartDate',{
                                    initialValue : data.lastStartDate
                                  })(
                                      <Input disabled />
                                    )
                                }
                            </FormItem>
                        </Col>
                        {/*<Col className="gutter-row" xs={{ span: 6}}>
                            <FormItem
                                label="工单状态"
                            >
                                {
                                    getFieldDecorator('workOrderStatusName',{
                                        initialValue : '待分派'
                                    })(
                                        <Input disabled />
                                    )
                                }
                            </FormItem>
                        </Col>
                        <Col className="gutter-row" style={{display: 'none'}}>
                            <FormItem
                                label="工单状态id"
                            >
                                {
                                    getFieldDecorator('workOrderStatus',{
                                        initialValue : 'DFP'
                                    })(
                                        <Input disabled />
                                    )
                                }
                            </FormItem>
                        </Col>*/}
                        <Col className="gutter-row" xs={{ span: 6}}>
                            <FormItem
                                label="上次完成时间"
                            >
                                {
                                  getFieldDecorator('lastEndDate',{
                                    initialValue : data.lastEndDate
                                  })(
                                      <Input disabled />
                                    )
                                }
                            </FormItem>
                        </Col>
                    </Row>
                </Form>
                <SelectPublic
                    fetch={{
                        url: "/eam/open/jobStandard/findPageJobStandardList",
                        type: 'post',
                        data: {
                            orgId: commonState.orgId,
                            siteId: commonState.siteId,
                            pageNum:1,
                            pageSize:5,
                        },
                        actionsType: 'JOB_PLAN_GET_LIST'
                    }}
                    stateAttr="jobPlanListData"
                    width={1200}
                    modalHide={() => { this.setState({ jobPlanModalShow: false }) }}
                    columns={jobPlanColumns}
                    visible={this.state.jobPlanModalShow}
                    onOk={record => {
                        form.setFieldsValue({
                            jobStandardNum: record.jobStandardNum,
                            jobStandardId: record.id,
                            jobStandardDesc: record.description,
                        });
                    }}
                />
                {/*<SelectPerson
                    visible={this.state.selectPersonModalShow}
                    selectPersonModalHide={() => { this.setState({selectPersonModalShow: false}) }}
                    onOk={(selected) => {
                        console.log(selected)
                    
                        form.setFieldsValue({
                            [this.currentInp + 'Name']: selected.name,
                            [this.currentInp + 'Id']: selected.personId,
                        });
                    }}
                />*/}
            </div>
        )
    }
}

const NewBForm = Form.create()(BuyFormComponent)

// 时间频率form
class FrequencyFormComponent extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            currentPage: 1,
        }

    }
    componentDidUpdate () {
        const { form, formValuesArr, parentProps } = this.props;
        const { state, actions } = parentProps;
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
                    formValuesArr[2] = values;
                }
            });
        }
    }
    componentWillMount () {
        const { parentProps } = this.props;
        const { commonActions, commonState } = parentProps;
        const domainValueParam = {
            orgId: commonState.orgId,
            siteId: commonState.siteId,
            prodId: 'EAM'
        }
        commonActions.getDomainValue(domainValueParam, 'timeFrequency', 'TIME_FREQUENCY');
    }
    render () {
        
        const { data, form, location, parentProps } = this.props;
        const { commonState } = parentProps;
        const { getFieldDecorator } = form;
        const list = data && data.list;

        const isAddMaintenancePlan = location.query.add_maintenance_Plan;

        const timeFrequencyData = commonState.timeFrequencyData;

        const nowDate = moment(moment().format('YYYY-MM-DD HH:mm:ss'));

        return (
            <Form layout="vertical">
                <Row gutter={16} justify="start">
                    <Col className="gutter-row" xs={{ span: 6}}>
                        <FormItem
                            label="频率"
                        >
                            {
                                getFieldDecorator('frequency',{
                                  initialValue : isAddMaintenancePlan ? '0' : data.frequency,
                                  rules: [{
                                        required: true,
                                        message: '频率不能为空！',
                                    }],
                                })(
                                    <InputNumber precision={2} min={1} style={{width: '100%'}} />
                                )
                            }
                        </FormItem>
                    </Col>
                    <Col className="gutter-row" xs={{ span: 6}}>
                        <FormItem
                            label="频率单位"
                        >
                            {
                              getFieldDecorator('frequencyUnit',{
                                initialValue : isAddMaintenancePlan ? (timeFrequencyData[0] && timeFrequencyData[0].value) : data.frequencyUnit
                              })(
                                <Select size="large" style={{ width: '100%' }}>
                                    {
                                        timeFrequencyData.map((item, i) => <Option key={i} value={item.value}>{item.description}</Option>)
                                    }
                                </Select>
                                )
                            }
                        </FormItem>
                    </Col>
                    <Col className="gutter-row" xs={{ span: 6}}>
                        <FormItem
                            label="估算下一到期日"
                        >
                            {
                                getFieldDecorator('nextDate',{
                                    initialValue : data.nextDate ? moment(data.nextDate, 'YYYY-MM-DD HH:mm') : nowDate
                                })(
                                    <DatePicker
                                        format="YYYY-MM-DD"
                                        onChange={(onChange) => {}}
                                        onOk={(onOk) => {}}
                                    />
                                )
                            }
                        </FormItem>
                    </Col>
                    <Col className="gutter-row" xs={{ span: 6}}>
                        <FormItem
                            label="延长日期"
                        >
                            {
                              getFieldDecorator('extDate',{
                                initialValue : data.extDate ? moment(data.extDate, 'YYYY-MM-DD HH:mm') : nowDate
                              })(
                                    <DatePicker
                                        format="YYYY-MM-DD"
                                        onChange={(onChange) => {}}
                                        onOk={(onOk) => {}}
                                    />
                                )
                            }
                        </FormItem>
                    </Col>
                </Row>
            </Form>
        )
    }
}
const NewFForm = Form.create()(FrequencyFormComponent)

class AddTermFormComponent extends React.Component {
    constructor(props) {
        super(props);
    }
    render () {

        const { form } = this.props;
        const { getFieldDecorator } = form;

        return (
            <Form layout="vertical">
                <Row gutter={16} justify="start">
                    <Col className="gutter-row">
                        <FormItem
                            label="有效日期"
                        >
                            {
                                getFieldDecorator('termDate', {
                                    // initialValue : data.extDate
                                })(
                                    <RangePicker
                                        format="MM-DD"
                                    />
                                )
                            }
                        </FormItem>
                    </Col>
                </Row>
            </Form>
        )
    }
}

const NewAddTermForm = Form.create()(AddTermFormComponent);

class MPTabOneComponent extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            currentPage: 1,
            selectAssetShow: false,
            termDateEditData: '',
        }

        this.customPanelStyle = {
            background: '#fff',
            borderRadius: 2,
            marginBottom: 24,
            border: 0,
            boxShadow: '0 1px 6px rgba(0, 0, 0, 0.2)'
        };

        const { location } = this.props;

        const isAddMaintenancePlan = location.query.add_maintenance_Plan;
        this.localMaintenancePlan = localStorage.getItem('maintenancePlan');

        this.param = {
            id: isAddMaintenancePlan ? '' : (this.localMaintenancePlan && JSON.parse(this.localMaintenancePlan).id),
            pageNum: 1,
            pageSize: 10,
        };

        let defaultRender = (text, record, key) => {
            return (
                <p>{text ? text : '-'}</p>
            )
        };

        // 维保表格字段
        this.maintenancePlanColumns = [
            {
                title: '设备设施编码',
                dataIndex: 'code',
                key: 'code',
                sorter: true,
                render: defaultRender
            },
            {
                title: '设备设施描述',
                width: '15%',
                dataIndex: 'description',
                key: 'description',
                sorter: true,
                render: defaultRender
            },
            {
                title: '分类编码',
                dataIndex: 'classificationCode',
                key: 'classificationCode',
                sorter: true,
                render: defaultRender
            },
            {
                title: '分类描述',
                width: '15%',
                dataIndex: 'classificationName',
                key: 'classificationName',
                sorter: true,
                render: defaultRender
            },
            {
                title: '位置编码',
                dataIndex: 'locationCode',
                key: 'locationCode',
                sorter: true,
                render: defaultRender
            },
            {
                title: '位置描述',
                width: '15%',
                dataIndex: 'locationName',
                key: 'locationName',
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
                                    this.assetDel(record);
                                }}
                            />
                        </div>
                    )
                }
            },
        ];

        // 有效期
        this.termColumns = [
            {
                title: '开始时间',
                dataIndex: 'startDate',
                key: 'startDate',
                sorter: true,
                render: defaultRender
            },
            {
                title: '结束时间',
                dataIndex: 'endDate',
                key: 'endDate',
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
                                    this.termDateDel(record);
                                }}
                            />
                            <Icon type="edit"
                                onClick={() => {
                                    this.termDateEdit(record);
                                }}
                            />
                        </div>
                    )
                }
            },
        ];

        this.formValuesArr = []; 
    }
    componentDidUpdate () {
        const { state, commonState, actions, commonActions, form, formValuesArr } = this.props;
        if (!state.getFormValues) {
            const data = state.maintenanceDetailListData;
            const checkedValuesData = data.weekFrequency ? data.weekFrequency.split(',') : [];
            const checkedValues = this.state.checkedValues;

            this.formValuesArr[3] = {
                useTargetDate: this.state.checked,
                weekFrequency: checkedValues ? checkedValues.join(',') : checkedValuesData.join(','),
            };
            actions.getFormValues(this.formValuesArr);
        }
    }
    mPDetailsGetList = () => {
        const { actions } = this.props;
        this.setState({
            tableLoading: true,
        });
        actions.mPDetailsUpdateList(this.param, () => {
            this.setState({
                tableLoading: false,
            });
        });
    }
    // 维保对象新建（设备）
    assetAdd = () => {
        const { state } = this.props;
        this.ignoreIds = state.maintenanceDetailListData.assetList ? filterArrByAttr(state.maintenanceDetailListData.assetList, 'id') : [];
        this.setState({ selectAssetShow: true });
    }
    assetAddSave = (selected) => {
        const { actions } = this.props;
        actions.mPDetailsUpdateList(['ASSET_ADD', selected]);
    }
    assetDel = (record) => {
        let { actions } = this.props;
        actions.mPDetailsUpdateList(['ASSET_DEL', record]);
    }
    tabClick = (key) => {
        const { location } = this.props;
        const isAddMaintenancePlan = location.query.add_maintenance_Plan;
        browserHistory.push(`/maintenance/maintenance_plan/${key}${isAddMaintenancePlan ? '?add_maintenance_Plan=1' : ''}`);
    }
    checkboxChange = (e) => {
        this.setState({
            checked: e.target.checked,
        });
    }
    checkboxGroupChange = (checkedValues) => {
        this.setState({ checkedValues });
    }
    termDateAdd = () => {
        this.setState({termDateEditData: ''});
        this.addTermModal.modalShow();
    }
    termDateEdit = (record) => {
        this.setState({termDateEditData: record});
        this.addTermModal.modalShow();
    }
    termDateDel = (record) => {
        const { actions } = this.props;
        actions.mPDetailsUpdateList(['TERM_DATE_DEL', record]);
    }
    termDateAddSave = () => {
        const { actions } = this.props;
        const { form } = this.termDateAddForm.props;
        const momentDateArr = form.getFieldValue('termDate');

        const json = {
            startDate : moment(momentDateArr[0]).format('MM-DD'),
            endDate : moment(momentDateArr[1]).format('MM-DD'),
        };
        json.id = this.state.termDateEditData.id;
        actions.mPDetailsUpdateList([this.state.termDateEditData ? 'TERM_DATE_EDIT' : 'TERM_DATE_ADD', [json]]);
        this.addTermModal.modalHide();
    }
    componentWillMount () {
        
        const { location, actions, commonActions, commonState } = this.props;
        const isAddMaintenancePlan = location.query.add_maintenance_Plan;

        this.localMaintenancePlan && this.mPDetailsGetList();

        if (isAddMaintenancePlan || !this.localMaintenancePlan) {
            const param = {
                orgId: commonState.orgId,
                siteId: commonState.siteId,
                modelKey: 'pm'
            }
            actions.getMaintenancePlanCode(param)
        }
        const domainValueParam = {
            orgId: commonState.orgId,
            siteId: commonState.siteId,
            prodId: 'EAM'
        }
        commonActions.getDomainValue(domainValueParam, 'jptype', 'JP_TYPE');
        commonActions.getDomainValue(domainValueParam, 'jpStatus', 'JP_STATUS');
        commonActions.getDomainValue(domainValueParam, 'standardtype', 'STANDARD_TYPE');

        if (isAddMaintenancePlan) {
            this.setState({
                checkedValues: ['1','2','3','4','5','6','7']
            })
        }
        
    }
    render () {
        const { state, location } = this.props;
        const data = state.maintenanceDetailListData;

        const assetList = data.assetList;
        const termDateList = data.maintenancePlanActiveTimeVoList;

        const pageName = location.pathname.split('/')[3];

        const checkedState = this.state.checked;
        const checkedValuesState = this.state.checkedValues;
        const checkedValuesData = data.weekFrequency ? data.weekFrequency.split(',') : [];

        const isAddMaintenancePlan = location.query.add_maintenance_Plan;

        return (
            <div className="eam-tab-page">
                <div className="eam-content">
                    <Tabs
                        className="eam-nav-tab"
                        style={{marginTop: -54}}
                        onTabClick={this.tabClick}
                        type="card"
                        activeKey={pageName}
                    >
                        <TabPane forceRender={true} tab={<span><Icon style={{margin: 0}} type="check-circle-o" /> 预防维护</span>} key="mp_tab_1">
                            <Collapse bordered={false} defaultActiveKey={['1', '2', '3']}>
                                <Panel header={<span className="label">基本信息 <Icon type="caret-down" /></span>} key="1" style={this.customPanelStyle}>
                                    <NewForm
                                        data={data}
                                        formValuesArr={this.formValuesArr}
                                        location={location}
                                        parentProps={{...this.props}}
                                    />
                                </Panel>
                                <Panel header={<span className="label">采购信息 <Icon type="caret-down" /></span>} key="2" style={this.customPanelStyle}>
                                    <NewBForm
                                        data={data}
                                        formValuesArr={this.formValuesArr}
                                        location={location}
                                        parentProps={{...this.props}}
                                    />
                                </Panel>
                                <Panel header={<span className="label">维保对象 <Icon type="caret-down" /></span>} key="3" style={this.customPanelStyle}>
                                    <Table
                                        rowKey="id"
                                        loading={this.state.tableLoading}
                                        pagination={{
                                            showTotal: (total, range) => `当前第${range[0]}-${range[1]}条 / 共${total}条`,
                                            defaultPageSize: 5,
                                        }}
                                        dataSource={assetList}
                                        columns={this.maintenancePlanColumns}
                                        rowSelection={this.rowSelection}
                                        bordered
                                    />
                                    <div className="panel-tools-right">
                                        <Dropdown
                                            disabled={!this.state.editable}
                                            overlay={(
                                                 <Menu>
                                                    <Menu.Item key="3"><Icon type="delete" /> 批量删除</Menu.Item>
                                                </Menu>
                                            )}
                                            trigger={['click']}
                                        >
                                            更多操作
                                        </Dropdown>
                                        <Button type="primary" size="large" onClick={this.assetAdd} >新建</Button>
                                    </div>
                                </Panel>
                            </Collapse>
                        </TabPane>
                        <TabPane forceRender={true} tab={<span><Icon style={{margin: 0}} type="check-circle-o" /> 频率</span>} key="mp_tab_2">
                            <Collapse bordered={false} defaultActiveKey={['1', '2', '3']}>
                                <Panel header={<span className="label">工单生成信息 <Icon type="caret-down" /> </span> } key="1" style={this.customPanelStyle}>
                                    <Checkbox
                                        checked={(checkedState === true || checkedState === false) ? checkedState : data.useTargetDate}
                                        onChange={this.checkboxChange}
                                    >使用上次的工单开始信息，计算到下一到期频率</Checkbox>
                                    <Checkbox.Group
                                        onChange={this.checkboxGroupChange}
                                        value={(checkedValuesState ? checkedValuesState : checkedValuesData)}
                                    >
                                        <Row>
                                            <Col span={3}><Checkbox value="1">星期一</Checkbox></Col>
                                            <Col span={3}><Checkbox value="2">星期二</Checkbox></Col>
                                            <Col span={3}><Checkbox value="3">星期三</Checkbox></Col>
                                            <Col span={3}><Checkbox value="4">星期四</Checkbox></Col>
                                            <Col span={3}><Checkbox value="5">星期五</Checkbox></Col>
                                            <Col span={3}><Checkbox value="6">星期六</Checkbox></Col>
                                            <Col span={3}><Checkbox value="7">星期日</Checkbox></Col>
                                        </Row>
                                    </Checkbox.Group>
                                </Panel>
                                <Panel header={<span className="label">时间频率 <Icon type="caret-down" /></span>} key="2" style={this.customPanelStyle}>
                                    <NewFForm
                                        data={data}
                                        location={location}
                                        formValuesArr={this.formValuesArr}
                                        parentProps={{...this.props}}
                                    />
                                </Panel>
                                <Panel header={<span className="label">有效日期 <Icon type="caret-down" /></span>} key="3" style={this.customPanelStyle}>
                                    <Table
                                        rowKey="id"
                                        // loading={this.state.taskstepsLoading}
                                        pagination={{
                                            showTotal: (total, range) => `当前第${range[0]}-${range[1]}条 / 共${total}条`,
                                            defaultPageSize: 5,
                                        }}
                                        dataSource={termDateList}
                                        columns={this.termColumns}
                                        bordered
                                    />
                                    <div className="panel-tools-right">
                                        <Dropdown
                                            disabled={!this.state.editable}
                                            overlay={(
                                                 <Menu>
                                                    <Menu.Item key="3"><Icon type="delete" /> 批量删除</Menu.Item>
                                                </Menu>
                                            )}
                                            trigger={['click']}
                                        >
                                            更多操作
                                        </Dropdown>
                                        <Button type="primary" size="large" onClick={this.termDateAdd} >新建</Button>
                                    </div>
                                </Panel>
                            </Collapse>
                        </TabPane>
                        <TabPane tab={<span><Icon style={{margin: 0}} type="check-circle-o" /> 工单记录</span>} key="mp_tab_3"></TabPane>
                    </Tabs>
                </div>
                <SelectAsset
                    multiple
                    treeData = {
                        [
                            {
                                name: '分类查询',
                                key: 'classifications',
                                actionsMethod: 'classifiGetTree',
                                data: 'classifiTreeData',
                            },
                            {
                                name: '位置查询',
                                key: 'locations',
                                actionsMethod: 'locationsGetTree',
                                data: 'locationsTreeData',
                            }
                        ]
                    }
                    selectAssetModalHide={() => { this.setState({ selectAssetShow: false }) }}
                    visible={this.state.selectAssetShow}
                    ignoreIds={ this.ignoreIds }
                    onOk={(selected) => {
                        this.assetAddSave(selected)
                    }}
                />
                <EamModal
                    title={`${this.state.termDateEditData ? '编辑' : '新建'}有效日期`}
                    ref={addTermModal => this.addTermModal = addTermModal}
                >
                    <NewAddTermForm
                        data={this.state.termDateEditData}
                        wrappedComponentRef={termDateAddForm => this.termDateAddForm = termDateAddForm}
                    />
                    <div className="modal-footer clearfix">
                        <Button size="large" onClick={() => {this.addTermModal.modalHide()}}>取消</Button>
                        <Button type="primary" size="large" onClick={this.termDateAddSave}>确定</Button>
                    </div>
                </EamModal>
            </div>
        )
    }
}


function mapStateToProps (state) {
    return {
        state: state.maintenance,
        commonState: state.common
    }
}

function buildActionDispatcher(dispatch) {
    return {
        actions: bindActionCreators(actions, dispatch),
        commonActions: bindActionCreators(commonActions, dispatch), 
    }
}

export default connect(mapStateToProps, buildActionDispatcher)(MPTabOneComponent);
