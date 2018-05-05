/**
 * 维保保养-维保工单-任务分派 
 */

import React from 'react';
import { bindActionCreators } from 'redux';
import { browserHistory } from 'react-router';
import { connect } from 'react-redux';
import actions from '../../actions/maintenance.js';
import commonActions from '../../actions/common.js';

import Dropdown from '../../components/common/dropdown.js';
import Modal from '../../components/common/modal.js';
import SelectPerson from '../../components/common/select_person.js';
import SelectPublic from '../../components/common/select_public.js';

import { filterArrByAttr, correspondenceJson, msFormat } from '../../tools/';

import { Icon, Button, Table, Pagination, Collapse, Form, Input, InputNumber, Row, Col, Select, Radio, DatePicker, Menu, Timeline, notification } from 'antd';
const Panel = Collapse.Panel;
const FormItem = Form.Item;
const Option = Select.Option;
const RadioButton = Radio.Button;
const RadioGroup = Radio.Group;

import moment from 'moment';

// 主表单
class FormComponent extends React.Component {
    constructor (props) {
        super(props);

        this.state = {
            selectPersonModalShow: false,
            selectCompaniesModalShow: false,
            jobPlanModalShow: false,
        }

        this.currentInp = '';

        this.companiesColumns = [
            {
                title: '供应商编码',
                dataIndex: 'code',
                key: 'code',
                sorter: true,
            },
            {
                title: '供应商名称',
                dataIndex: 'name',
                key: 'name',
                sorter: true,
            },
        ];
    }
    selectJobPlanShow = () => {
        this.setState({ jobPlanModalShow: true });
    }
    personInputFocus = (e) => {
        this.currentInp = e.target.getAttribute('data-name');
        this.setState({
            selectPersonModalShow: true
        })
    }
    companyInputFocus = (e) => {
        this.setState({
            selectCompaniesModalShow: true,
        })
    }
    entrustExecuteChange = (e) => {

        const { form } = this.props;

        this.entrustExecuteChanged = true;
        let entrustExecutePersonDisabled;
        if (e.target.value === 'true') {
            entrustExecutePersonDisabled = false;
        } else {
            entrustExecutePersonDisabled = true;
            form.setFieldsValue({
                entrustExecutePersonName: '',
            });
        }
        this.setState({ entrustExecutePersonDisabled });
    }
    componentDidUpdate () {
        const { form, parentProps } = this.props;
        const { state, actions} = parentProps;

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
        const { commonState, commonActions} = parentProps;
        const domainValueParam = {
            orgId: commonState.orgId,
            siteId: commonState.siteId,
            prodId: 'EAM'
        }
        commonActions.getDomainValue(domainValueParam, 'jptype', 'JP_TYPE');
        commonActions.getDomainValue(domainValueParam, 'jpStatus', 'JP_STATUS');
        commonActions.getDomainValue(domainValueParam, 'standardtype', 'STANDARD_TYPE');
        commonActions.getDomainValue(domainValueParam, 'workOrder', 'WORK_ORDER_STATUS');
    }
    render () {
        let { data, editable, form, parentProps } = this.props;
        const { commonState } = parentProps;
        const { getFieldDecorator } = form;

        if (JSON.stringify(data) === '[]') data = {};


        if (editable) {

            if (data.entrustExecute) {
                this.entrustExecutePersonDisabled = false;
            } else {
                this.entrustExecutePersonDisabled = true;
            }
            
        } else {
            this.entrustExecutePersonDisabled = true
        }

        const nowDate = moment(moment().format('YYYY-MM-DD HH:mm:ss'));

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
                    <Row gutter={16}>
                        <Col className="gutter-row" xs={{ span: 3}}>
                            <FormItem
                                label="作业标准"
                            >
                                {
                                    getFieldDecorator('jobStandardNum',{
                                      initialValue : data.jobStandardNum
                                    })(
                                        <Input
                                            suffix={!editable ? null : <Icon style={{cursor: 'pointer'}} type="plus" onClick={this.selectJobPlanShow} />}
                                            onClick={this.selectJobPlanShow} disabled={!editable}
                                        />
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
                        <Col className="gutter-row" xs={{ span: 9}}>
                            <FormItem
                                label="作业标准描述"
                            >
                                {
                                    getFieldDecorator('jobStandardDesc', {
                                        initialValue: data.jobStandardDesc
                                    })(
                                        <Input disabled/>
                                    )
                                }
                            </FormItem>
                        </Col>
                        <Col className="gutter-row" xs={{ span: 6}}>
                            <FormItem
                                label="计划开始时间"
                            >
                                {
                                    getFieldDecorator('planStartDate', {
                                        initialValue: data.planStartDate ? moment(data.planStartDate, 'YYYY-MM-DD HH:mm') : nowDate,
                                        rules: [{
                                            type: 'object',
                                            required: true,
                                            message: '计划开始时间不能为空！',
                                        }],
                                    })(
                                        <DatePicker
                                            disabled={!editable}
                                            showTime
                                            format="YYYY-MM-DD HH:mm"
                                            placeholder="选择日期"
                                            onChange={() => {}}
                                            onOk={() => {}}
                                        />
                                    )
                                }
                            </FormItem>
                        </Col>
                        <Col className="gutter-row" xs={{ span: 6}}>
                            <FormItem
                                label="计划完成时间"
                            >
                                {
                                    getFieldDecorator('planCompletionDate', {
                                        initialValue: data.planCompletionDate ? moment(data.planCompletionDate, 'YYYY-MM-DD HH:mm') : nowDate,
                                        rules: [{
                                            type: 'object',
                                            required: true,
                                            message: '计划完成时间不能为空！',
                                        }],
                                    })(
                                        <DatePicker
                                            disabled={!editable}
                                            showTime
                                            format="YYYY-MM-DD HH:mm"
                                            placeholder="选择日期"
                                            onChange={() => {}}
                                            onOk={() => {}}
                                        />
                                    )
                                }
                            </FormItem>
                        </Col>

                        <Col className="gutter-row" xs={{ span: 12}}>
                            <FormItem
                                label="供应商"
                            >
                                {
                                    getFieldDecorator('companyName', {
                                        initialValue: data.companyName
                                    })(
                                        <Input
                                            suffix={!editable ? null : <Icon style={{cursor: 'pointer'}} type="plus" onClick={this.companyInputFocus} />}
                                            onClick={this.companyInputFocus}
                                            disabled={!editable}
                                        />
                                    )
                                }
                            </FormItem>
                        </Col>
                        <Col className="gutter-row" style={{display: 'none'}}>
                            <FormItem
                                label="供应商id"
                            >
                                {
                                    getFieldDecorator('companyId', {
                                        initialValue: data.companyId
                                    })(
                                        <Input disabled/>
                                    )
                                }
                            </FormItem>
                        </Col>
                        <Col className="gutter-row" xs={{ span: 6}}>
                            <FormItem
                                label="状态"
                            >
                                {
                                    getFieldDecorator('statusName', {
                                        initialValue: data.status && correspondenceJson.workOrder[data.status].text
                                    })(
                                        <Input disabled/>
                                    )
                                }
                            </FormItem>
                        </Col>
                        <Col className="gutter-row" style={{display: 'none'}}>
                            <FormItem
                                label="状态id"
                            >
                                {
                                    getFieldDecorator('status', {
                                        initialValue: data.status
                                    })(
                                        <Input disabled/>
                                    )
                                }
                            </FormItem>
                        </Col>
                        <Col className="gutter-row" xs={{ span: 6}}>
                            <FormItem
                                label="分派人"
                            >
                                {
                                    getFieldDecorator('assignPersonName', {
                                        initialValue: data.assignPersonName
                                    })(
                                        <Input
                                            // suffix={!editable ? null : <Icon style={{cursor: 'pointer'}} type="plus" data-name="assignPerson" onClick={this.personInputFocus} />}
                                            data-name="assignPerson"
                                            onClick={this.personInputFocus}
                                            readOnly
                                            disabled
                                        />
                                    )
                                }
                            </FormItem>
                        </Col>
                        <Col className="gutter-row" style={{display: 'none'}}>
                            <FormItem
                                label="分派人id"
                            >
                                {
                                    getFieldDecorator('assignPersonId', {
                                        initialValue: data.assignPersonId
                                    })(
                                        <Input readOnly />
                                    )
                                }
                            </FormItem>
                        </Col>

                        <Col className="gutter-row" xs={{ span: 3}}>
                            <FormItem
                                label="执行人"
                            >
                                {
                                    getFieldDecorator('executorPersonName', {
                                        initialValue: data.executorPersonName,
                                        rules: [{
                                            required: true,
                                            message: '执行人不能为空！',
                                        }],
                                    })(
                                        <Input
                                            suffix={!editable ? null : <Icon style={{cursor: 'pointer'}} type="plus" data-name="executorPerson" onClick={this.personInputFocus} />}
                                            data-name="executorPerson"
                                            onClick={this.personInputFocus}
                                            readOnly
                                            disabled={!editable}
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
                                    getFieldDecorator('executorPersonId', {
                                        initialValue: data.executorPersonId
                                    })(
                                        <Input readOnly />
                                    )
                                }
                            </FormItem>
                        </Col>

                        <Col className="gutter-row" xs={{ span: 9}}>
                            <FormItem
                                label="执行班组"
                            >
                                {
                                    getFieldDecorator('executionWorkGroup', {
                                        initialValue: data.executionWorkGroup
                                    })(
                                        <Input disabled />
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
                        <Col className="gutter-row" xs={{ span: 6}}>
                            <FormItem
                                label="委托执行"
                            >
                                {
                                    getFieldDecorator('entrustExecute', {
                                        initialValue: data.entrustExecute ? 'true' : 'false'
                                    })(
                                        <RadioGroup size="large" className="radio-group-col-2" style={{ width: '100%' }} disabled={!editable} onChange={this.entrustExecuteChange}>
                                            <RadioButton value="true"><i className="radio-group-icon-o"></i>委托</RadioButton>
                                            <RadioButton value="false"><Icon type="minus" />非委托</RadioButton>
                                        </RadioGroup>
                                    )
                                }
                            </FormItem>
                        </Col>
                        <Col className="gutter-row" xs={{ span: 6}}>
                            <FormItem
                                label="委托执行人"
                            >
                                {
                                    getFieldDecorator('entrustExecutePersonName', {
                                        initialValue: data.entrustExecutePersonName
                                    })(
                                        <Input
                                            suffix={
                                                (this.entrustExecuteChanged ? this.state.entrustExecutePersonDisabled : this.entrustExecutePersonDisabled) ?
                                                null :
                                                <Icon style={{cursor: 'pointer'}} type="plus" data-name="entrustExecutePerson" onClick={this.personInputFocus} />
                                            }
                                            data-name="entrustExecutePerson"
                                            onClick={this.personInputFocus}
                                            readOnly
                                            disabled={this.entrustExecuteChanged ? this.state.entrustExecutePersonDisabled : this.entrustExecutePersonDisabled}
                                        />
                                    )
                                }
                            </FormItem>
                        </Col>
                        <Col className="gutter-row" style={{display: 'none'}}>
                            <FormItem
                                label="委托执行人id"
                            >
                                {
                                    getFieldDecorator('entrustExecutePersonId', {
                                        initialValue: data.entrustExecutePersonId
                                    })(
                                        <Input readOnly />
                                    )
                                }
                            </FormItem>
                        </Col>
                    </Row>
                </Form>
                <SelectPublic
                    fetch={{
                        url: "/ams/open/companies/findPage",
                        type: 'post',
                        data: {
                            orgId: commonState.orgId,
                            siteId: commonState.siteId,
                            pageNum:1,
                            pageSize:5,
                        },
                        actionsType: 'COMPANIES_GET_LIST'
                    }}
                    stateAttr="companiesListData"
                    width={1200}
                    modalHide={() => { this.setState({ selectCompaniesModalShow: false }) }}
                    columns={this.companiesColumns}
                    visible={this.state.selectCompaniesModalShow}
                    onOk={record => {
                        form.setFieldsValue({
                            companyName: record.name,
                            companyId: record.id
                        });
                    }}
                />
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
                <SelectPerson
                    multiple
                    visible={this.state.selectPersonModalShow}
                    selectPersonModalHide={() => { this.setState({selectPersonModalShow: false}) }}
                    setSelected={() => {
                        let curClickPersonName = form.getFieldValue(this.currentInp + 'Name');
                        let curClickPersonId = form.getFieldValue(this.currentInp + 'Id');
                        let personWorkGroup = form.getFieldValue('personWorkGroup');
                        
                        curClickPersonName = curClickPersonName ? curClickPersonName.split(',') : [];
                        curClickPersonId = curClickPersonId ? curClickPersonId.split(',') : [];
                        personWorkGroup = personWorkGroup ? personWorkGroup.split(',') : [];

                        curClickPersonId = curClickPersonId.map((item, i) => (
                            {
                                personId: item,
                                name: curClickPersonName[i],
                                workgroup: personWorkGroup[i],
                            }
                        ));

                        return  curClickPersonId;
                    }}
                    onOk={(selected) => {

                        const name = filterArrByAttr(selected, 'name').join(',');
                        const personId = filterArrByAttr(selected, 'personId').join(',');

                        let json;
                        let executionWorkGroup;
                        if (this.currentInp === 'executorPerson') {

                            const len = selected.length;

                            if (len > 1) {

                                let isSame = true;

                                for (let i = 1; i < len; i++) {
                                    if (selected[i].workgroup !== selected[i-1].workgroup) {
                                        isSame = false;
                                        break;
                                    }
                                }
                                executionWorkGroup = isSame ? selected[0].workgroup : '';

                            } else {
                                executionWorkGroup = selected[0].workgroup;
                            }

                            json = {
                                [this.currentInp + 'Name']: name,
                                [this.currentInp + 'Id']: personId,
                                executionWorkGroup
                            }
                        } else {
                            json = {
                                [this.currentInp + 'Name']: name,
                                [this.currentInp + 'Id']: personId,
                            }
                        }

                        form.setFieldsValue(json);
                    }}
                />
            </div>
        )
    }
}

const NewForm = Form.create()(FormComponent);

// 任务步骤新建表单
class taskStepsFormComponent extends React.Component {
    constructor(props) {
        super(props);
        this.formItemLayout = {
            labelCol: {
                xs: { span: 24 },
                sm: { span: 6 },
            },
            wrapperCol: {
                xs: { span: 24 },
                sm: { span: 14 },
            },
        };
    }
    render () {
        const { form, data } = this.props;
        const { getFieldDecorator } = form;

        return (
            <Form>
                <FormItem
                    {...this.formItemLayout}
                    label="任务描述"
                >
                    {
                        getFieldDecorator('description', {
                            initialValue: data ? data.description : '',
                            rules: [{ required: true, message: '文本不能为空' }],
                        })(
                            <Input style={{ width: '100%' }} />
                        )
                    }
                </FormItem>
                <FormItem
                    {...this.formItemLayout}
                    label="质量标准"
                >
                    {
                        getFieldDecorator('qualityStandard', {
                            initialValue: data ? data.qualityStandard : '',
                            rules: [{ required: true, message: '文本不能为空' }],
                        })(
                            <Input style={{ width: '100%' }} />
                        )
                    }
                </FormItem>
                <FormItem
                    {...this.formItemLayout}
                    label="估计持续时间"
                >
                    {
                        getFieldDecorator('duration', {
                            initialValue: data ? data.duration : '',
                            rules: [{ required: true, message: '文本不能为空' }],
                        })(
                            <InputNumber precision={2} min={1} style={{ width: '100%' }} />
                        )
                    }
                </FormItem>
            </Form>
        )
    }
}
const NewtaskStepsForm = Form.create()(taskStepsFormComponent);

class WorkOrderTwoComponent extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            tableLoading: false,
            materialsAddLoading: false,
            currentPage: 1,
            taskStepsEditData: '',
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

        // 任务步骤表格字段
        this.taskStepsColumns = [
            {
                title: '任务',
                dataIndex: 'step',
                key: 'step',
                sorter: true,
                render: (text, record, key) => {
                    const step = parseInt(key) + 1
                    record.step = step;
                    return (
                        <p>{step}</p>
                    )
                }
            },
            {
                title: '任务描述',
                width: '35%',
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
                width: '40%',
                dataIndex: 'itemDesc',
                key: 'itemDesc',
                sorter: true,
                render: defaultRender
            },
            {
                title: '需求数量',
                dataIndex: 'itemQty',
                key: 'itemQty',
                sorter: true,
                render: (text, record, key) => {
                    record.itemQty = record.itemQty ? record.itemQty : 1;
                    return (
                        <InputNumber precision={2} min={1} max={parseInt(record.currentBalance)} defaultValue={record.itemQty} onChange={(num) => {
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
                                    this.materialsDel(record)
                                }}
                            />
                        </div>
                    )
                }
            },
        ];

        // 新建所需物料表格字段
        this.materialsAddColumns = [
            {
                title: '物资编码',
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
                title: '库房',
                dataIndex: 'storeroomName',
                key: 'storeroomName',
                sorter: true,
                render: defaultRender
            },
            {
                title: '物资库房当前余量',
                dataIndex: 'currentBalance',
                key: 'currentBalance',
                sorter: true,
                render: defaultRender
            },
            {
                title: '订购单位',
                dataIndex: 'orderUnitName',
                key: 'orderUnitName',
                sorter: true,
                render: defaultRender
            },
            {
                title: '是否周转',
                dataIndex: 'turnOver',
                key: 'turnOver',
                sorter: true,
                render: (text, record, key) => {
                    let txt;

                    if (text === true) {
                        txt = '是';
                    }
                    else if (text === false) {
                        txt = '否';
                    }
                    else {
                        txt = '-';
                    }

                    return (
                        <p>{txt}</p>
                    )
                }
            },
            {
                title: '状态',
                dataIndex: 'status',
                key: 'status',
                sorter: true,
                render: (text, record, key) => {
                    let txt;

                    if (text === true) {
                        txt = '活动';
                    }
                    else if (text === false) {
                        txt = '不活动';
                    }
                    else {
                        txt = '-';
                    }

                    return (
                        <p>{txt}</p>
                    )
                }
            },
        ];

        this.materialsAddRowSelection = {
            onChange: (selectedRowKeys, selectedRows) => {
                //新建所需物料勾选的数据
                this.materialsAddSelectedRows = selectedRows;
            },
        };

        const { location } = this.props;

        const isAddWorkOrder = location.query.add_work_order;

        this.param = {
            id: isAddWorkOrder ? '' : (localStorage.getItem('workOrder') && JSON.parse(localStorage.getItem('workOrder')).id),
            pageNum: 1,
            pageSize: 998,
        }

        this.localWorkOrder = JSON.parse(localStorage.getItem('workOrder'));
    }
    pageChange = () => {

    }
    // 任务分派列表（任务步骤、所需物料）
    taskGetList = () => {
        const { actions } = this.props;
        this.setState({ tableLoading: true });
        actions.updateList(this.param, () => {
            this.setState({ tableLoading: false });
        });
    }
    // 新建任务步骤
    taskStepsAdd = () => {
        this.setState({taskStepsEditData: ''});
        this.taskStepsAddModal.modalShow();
    }
    // 保存新建/编辑任务步骤
    taskStepsAddSave = () => {
        let { actions } = this.props;
        let editJson = this.state.taskStepsEditData;

        this.taskStepsAddForm.validateFields((err, values) => {
            if (err) return;
            values.id = editJson.id;
            actions.updateList([editJson ? 'TASK_STEPS_EDIT' : 'TASK_STEPS_ADD', [values]]);
        });

        this.taskStepsAddModal.modalHide();
    }
    // 编辑任务步骤
    taskStepsEdit = (record) => {
        this.setState({taskStepsEditData: record});
        this.taskStepsAddModal.modalShow();
    }
    // 删除任务步骤
    taskStepsDel = (record) => {
        let { actions } = this.props;
        actions.updateList(['TASK_STEPS_DEL', record]);
    }
    taskStepsAfterClose = () => {
        this.taskStepsAddForm.resetFields();
    }
    // 新建所需物料
    materialsAdd = () => {
        const { actions, state, commonState, commonActions } = this.props;
        this.setState({materialsAddLoading: true});

        let ids = state.taskListData.eamNeedItemVoList ? filterArrByAttr(state.taskListData.eamNeedItemVoList, 'id').join(',') : '';

        const param = {
            orgId: commonState.orgId,
            siteId: commonState.siteId,
            ids,
            pageNum: 1,
            pageSize: 10,
        };

        actions.materialsAddGetList(param, () => {
            this.setState({materialsAddLoading: false});
        });
        this.materialsAddModal.modalShow();
    }
    // 新建所需物料保存
    materialsAddSave = () => {
        const { actions } = this.props;

        this.materialsAddSelectedRows.forEach((item, i) => {
            item.itemUnit = item.orderUnitName; // 页面表格单位的字段名是itemUnit 新建弹出里的字段名是orderUnitName
            item.itemDesc = item.itemDescription;
        });

        actions.updateList(['MATERIALS_ADD', this.materialsAddSelectedRows]);
        this.materialsAddModal.modalHide();
    }
    // 所需物料删除
    materialsDel = (record) => {
        let { actions } = this.props;
        actions.updateList(['MATERIALS_DEL', record]);
    }
    // 所需物料编辑
    materialsEdit = (record) => {
        let { actions } = this.props;
        actions.updateList(['MATERIALS_EDIT', record]);
    }
    componentWillMount () {
        const { location } = this.props;
        const isAddWorkOrder = location.query.add_work_order;
        
        const curProcess = location.pathname.charAt(location.pathname.length-1);
        if (this.localWorkOrder && this.localWorkOrder.process >= curProcess) this.taskGetList();

        if (this.localWorkOrder && this.localWorkOrder.process == curProcess) {
            this.setState({ editable: true });
        } else {
            this.setState({ editable: false });
        }
        if (!isAddWorkOrder && !this.localWorkOrder) browserHistory.push('/maintenance/work_order');
    }
    render () {
        const { state } = this.props;

        const taskData = state.taskListData;
        // 任务步骤数据
        const taskStepsList = taskData.eamOrderstepVoList;
        // 所需物料数据
        const materialsList = taskData.eamNeedItemVoList;
        // 执行记录数据
        const recordList = taskData.eamImpleRecordVoVoList || [];
        // 执行记录日期
        const recordDateArr = taskData.dateArr;

        // 所需物料新建列表数据
        const materialsAddData = state.materialsAddListData;
        const materialsAddList = materialsAddData.list;

        return (
            <div className="eam-tab-page">
                <div className="eam-content">
                    <Collapse bordered={false} defaultActiveKey={['1', '2', '3', '4']}>
                        <Panel header={<span className="label">工单信息 <Icon type="caret-down" /></span>} key="1" style={this.customPanelStyle}>
                            <NewForm
                                data={taskData}
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
                                // rowSelection={this.rowSelection}
                                bordered
                            />
                            <div className="panel-tools-right">
                                <Button type="primary" size="large" onClick={this.taskStepsAdd} style={{display: taskData.status === 'GB' ? 'none' : 'inline-block'}}>新建</Button>
                            </div>
                        </Panel>
                        <Panel header={<span className="label">所需物料 <Icon type="caret-down" /></span>} key="3" style={this.customPanelStyle}>
                            <Table
                                rowKey="id"
                                loading={this.state.tableLoading}
                                pagination={{
                                    showTotal: (total, range) => `当前第${range[0]}-${range[1]}条 / 共${total}条`,
                                    defaultPageSize: 5,
                                }}
                                dataSource={materialsList}
                                columns={this.materialsColumns}
                                // rowSelection={this.rowSelection}
                                bordered
                            />
                            <div className="panel-tools-right">
                                <Button type="primary" size="large" onClick={this.materialsAdd} style={{display: taskData.status === 'GB' ? 'none' : 'inline-block'}}>新建</Button>
                            </div>
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

                <Modal
                    title={`${this.state.taskStepsEditData ? '编辑' : '新建'}任务步骤`}
                    ref={taskStepsAddModal => this.taskStepsAddModal = taskStepsAddModal}
                    afterClose={this.taskStepsAfterClose}
                >
                    <NewtaskStepsForm data={this.state.taskStepsEditData} ref={taskStepsAddForm => this.taskStepsAddForm = taskStepsAddForm} />
                    <div className="modal-footer clearfix">
                        <Button size="large" onClick={() => { this.taskStepsAddModal.modalHide() }}>取消</Button>
                        <Button type="primary" size="large" onClick={this.taskStepsAddSave}>确定</Button>
                    </div>
                </Modal>

                <Modal
                    title={`新建所需物料`}
                    ref={materialsAddModal => this.materialsAddModal = materialsAddModal}
                    width={1200}
                    // afterClose={this.taskStepsAfterClose}
                >
                    <Table
                        rowSelection={this.materialsAddRowSelection}
                        loading={this.state.materialsAddLoading}
                        rowKey="id"
                        dataSource={materialsAddList}
                        columns={this.materialsAddColumns}
                        bordered
                    />
                    <div className="modal-footer clearfix">
                        <Button size="large" onClick={() => { this.materialsAddModal.modalHide() }}>取消</Button>
                        <Button type="primary" size="large" onClick={this.materialsAddSave}>确定</Button>
                    </div>
                </Modal>
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

export default connect(mapStateToProps, buildActionDispatcher)(WorkOrderTwoComponent);