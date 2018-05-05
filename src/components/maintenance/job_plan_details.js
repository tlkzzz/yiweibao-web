/**
 * 作业标准-详情页 
 */
import React from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import actions from '../../actions/maintenance.js';
import commonActions from '../../actions/common.js';

import Dropdown from '../../components/common/dropdown.js';
import SelectAsset from '../../components/common/select_asset.js';
import Modal from '../../components/common/modal.js';

import { filterArrByAttr } from '../../tools/';

import { Icon, Button, Upload, Table, Pagination, Collapse, Form, Input, InputNumber, Row, Col, Select, Radio, DatePicker, Checkbox } from 'antd';
const Panel = Collapse.Panel;
const FormItem = Form.Item;
const Option = Select.Option;
const RadioButton = Radio.Button;
const RadioGroup = Radio.Group;

import moment from 'moment';

class FormComponent extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            selectAssetShow: false,
            currentPage: 1,
            selectPersonModalShow: false,
        }
    }

    selectAssetModalShow = () => {
        const { form, parentProps } = this.props;
        const classificationId = form.getFieldValue('classificationId');
        this.ignoreIds = classificationId ? [form.getFieldValue('classificationId')] : [];
        this.setState({ selectAssetShow: true });
    }
    componentDidUpdate () {
        const { form, parentProps } = this.props;
        const { state, actions } = parentProps;
        if (!state.getFormValues) {
            actions.getFormValues(form.getFieldsValue());
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
        commonActions.getDomainValue(domainValueParam, 'standardtype', 'STANDARD_TYPE');
        commonActions.getDomainValue(domainValueParam, 'jptype', 'JP_TYPE');
        commonActions.getDomainValue(domainValueParam, 'jpStatus', 'JP_STATUS');
    }
    render () {
        
        const { data, parentProps, form, location } = this.props;
        const { commonState, state } = parentProps;
        const { getFieldDecorator } = form;

        const isAddJobPlan = location.query.add_Job_Plan;

        const standardTypeData = commonState.standardTypeData,
              jpTypeData = commonState.jpTypeData,
              jpStatusData = commonState.jpStatusData;

        const nowDate = moment(moment().format('YYYY-MM-DD HH:mm:ss'));
        

        return (
            <div>
                <Form layout="vertical">
                    <Row gutter={16} justify="start">
                        <Col className="gutter-row" xs={{ span: 4}}>
                            <FormItem
                                label="编码"
                            >
                                {
                                  getFieldDecorator('jobStandardNum',{
                                        initialValue: isAddJobPlan ? state.jobPlanCode : data.jobStandardNum
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
                                        initialValue: data.description
                                    })(
                                        <Input />
                                    )
                                }
                            </FormItem>
                        </Col>
                        <Col className="gutter-row" xs={{ span: 6}}>
                            <FormItem
                                label="标准类型"
                            >
                                {
                                    getFieldDecorator('standardType',{
                                        initialValue: isAddJobPlan ? (standardTypeData[0] && standardTypeData[0].value) : data.standardType
                                    })
                                    (
                                        <Select size="large" style={{ width: '100%' }}>
                                            {
                                                standardTypeData.map((item, i) => <Option key={i} value={item.value}>{item.description}</Option>)
                                            }
                                        </Select>
                                    )
                                }
                            </FormItem>
                        </Col>
                        <Col className="gutter-row" xs={{ span: 6}}>
                            <FormItem
                                label="组织"
                            >
                                {
                                  getFieldDecorator('orgName ', {
                                        initialValue: isAddJobPlan ? commonState.orgName : data.orgName
                                    })(
                                        <Input disabled/>
                                    )
                                }
                            </FormItem>
                        </Col>
                        <Col className="gutter-row" xs={{ span: 4}}>
                            <FormItem
                                label="设备分类"
                            >
                                {
                                  getFieldDecorator('classificationNum', {
                                        initialValue: data.classificationNum 
                                    })(
                                        <Input readOnly suffix={ <Icon style={{'cursor': 'pointer'}} onClick={this.selectAssetModalShow} type="plus" /> } onClick={this.selectAssetModalShow} />
                                    )
                                }
                            </FormItem>
                        </Col>
                        <Col className="gutter-row" style={{display: 'none'}}>
                            <FormItem
                                label="设备分类id"
                            >
                                {
                                  getFieldDecorator('classificationId', {
                                        initialValue: data.classificationId 
                                    })(
                                        <Input readOnly suffix={ <Icon style={{'cursor': 'pointer'}} onClick={this.selectAssetModalShow} type="plus" /> }/>
                                    )
                                }
                            </FormItem>
                        </Col>
                        <Col className="gutter-row" xs={{ span: 8}} >
                            <FormItem
                                label="设备描述"
                            >
                                {
                                    getFieldDecorator('classificationName' , {
                                        initialValue: data.classificationName 
                                    })(
                                        <Input disabled/>
                                    )
                                }
                            </FormItem>
                        </Col>
                        <Col className="gutter-row" xs={{ span: 6}}>
                            <FormItem
                                label="作业类型"
                            >
                                {
                                    getFieldDecorator('jobType',{
                                        initialValue: isAddJobPlan ? (jpTypeData[0] && jpTypeData[0].value) : data.jobType
                                    })
                                    (
                                        <Select size="large" style={{ width: '100%' }}>
                                            {
                                                jpTypeData.map((item, i) => <Option key={i} value={item.value}>{item.description}</Option>)
                                            }
                                        </Select>
                                    )
                                }
                            </FormItem>
                        </Col>
                        <Col className="gutter-row" xs={{ span: 6}}>
                            <FormItem
                                label="站点"
                            >
                                {
                                    getFieldDecorator('siteName ', {
                                        initialValue: isAddJobPlan ? commonState.siteName : data.siteName
                                    })(
                                        <Input disabled/>
                                    )
                                }
                            </FormItem>
                        </Col>
                        <Col className="gutter-row" xs={{ span: 4}}>
                            <FormItem
                                label="状态"
                            >
                                {
                                    getFieldDecorator('status',{
                                        initialValue: isAddJobPlan ? (jpStatusData[0] && jpStatusData[0].value) : data.status
                                    })
                                    (
                                        <Select size="large" style={{ width: '100%' }} disabled>
                                            {
                                                jpStatusData.map((item, i) => <Option key={i} value={item.value}>{item.description}</Option>)
                                            }
                                        </Select>
                                    )
                                }
                            </FormItem>
                        </Col>
                        <Col className="gutter-row" xs={{ span: 8}}>
                            <FormItem
                                label="状态日期"
                            >
                                {
                                    getFieldDecorator('statusDate',{
                                        initialValue: data.length ? moment(data.statusDate, 'YYYY-MM-DD HH:mm') : nowDate
                                    })(
                                        <DatePicker
                                            disabled
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
                    </Row>
                </Form>
                <SelectAsset
                    treeData = {
                        [
                            {
                                name: '分类查询',
                                key: 'classifications',
                                actionsMethod: 'classifiGetTree',
                                data: 'classifiTreeData',
                            },
                        ]
                    }
                    getClassifiList
                    selectAssetModalHide={() => { this.setState({ selectAssetShow: false }) }}
                    visible={this.state.selectAssetShow}
                    ignoreIds={ this.ignoreIds }
                    onOk={(selected) => {

                        console.log(selected[0])

                        form.setFieldsValue({
                            classificationNum: selected[0].classificationCode,
                            classificationId: selected[0].classificationId,
                            classificationName: selected[0].classificationName
                        });
                    }}
                />
            </div>
        )
    }
}

const NewForm = Form.create()(FormComponent)

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
                    label="标准操作时间"
                >
                    {
                        getFieldDecorator('taskDuration', {
                            initialValue: data ? data.taskDuration : '',
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

class jobPlanDetailsComponent extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            currentPage: 1,
            taskStepsEditData: ''
        }

        this.customPanelStyle = {
            background: '#fff',
            borderRadius: 2,
            marginBottom: 24,
            border: 0,
            boxShadow: '0 1px 6px rgba(0, 0, 0, 0.2)'
        };

        this.taskParam = {
            id: localStorage.jobPlanId,
            pageNum: 1,
            pageSize: 10,
        };

        let defaultRender = (text, record, key) => {
            return (
                <p>{text ? text : '-'}</p>
            )
        };

        //保准任务字段
        this.taskStepsColumns = [
            {
                title: '任务序号',
                dataIndex: 'taskSequence',
                key: 'taskSequence',
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
                width: '30%',
                dataIndex: 'description',
                key: 'description',
                sorter: true,
                render: defaultRender
            },
            {
                title: '质量标准',
                width: '30%',
                dataIndex: 'qualityStandard',
                key: 'qualityStandard',
                sorter: true,
                render: defaultRender
            },
            {
                title: '标准操作时间',
                dataIndex: 'taskDuration',
                key: 'taskDuration',
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
                width: '30%',
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
                        <InputNumber min={1} defaultValue={record.itemQty} onChange={(num) => {
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
                dataIndex: 'storeroomName',
                key: 'storeroomName',
                sorter: true,
                render: defaultRender
            },
            // {
            //     title: '是否周转',
            //     dataIndex: 'turnOver',
            //     key: 'turnOver',
            //     sorter: true,
            //     render: (text, record, key) => {
            //         let txt;

            //         if (text === true) {
            //             txt = '是';
            //         }
            //         else if (text === false) {
            //             txt = '否';
            //         }
            //         else {
            //             txt = '-';
            //         }

            //         return (
            //             <p>{txt}</p>
            //         )
            //     }
            // },
            // {
            //     title: '状态',
            //     dataIndex: 'status',
            //     key: 'status',
            //     sorter: true,
            //     render: (text, record, key) => {
            //         let txt;

            //         if (text === true) {
            //             txt = '活动';
            //         }
            //         else if (text === false) {
            //             txt = '不活动';
            //         }
            //         else {
            //             txt = '-';
            //         }

            //         return (
            //             <p>{txt}</p>
            //         )
            //     }
            // },
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

        const isAddJobPlan = location.query.add_Job_Plan;
        this.localJobPlan = localStorage.getItem('jobPlan');
        this.param = {
            id: isAddJobPlan ? '' : (this.localJobPlan && JSON.parse(this.localJobPlan).id),
            pageNum: 1,
            pageSize: 1,
        }


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
            actions.jobPlanDetailsUpdateList([editJson ? 'TASK_STEPS_EDIT' : 'TASK_STEPS_ADD', [values]]);
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
        actions.jobPlanDetailsUpdateList(['TASK_STEPS_DEL', record]);
    }
    taskStepsAfterClose = () => {
        this.taskStepsAddForm.resetFields();
    }

    // 新建所需物料
    materialsAdd = () => {
        const { actions, state, commonState } = this.props;
        this.setState({materialsAddLoading: true});

        const maintenanceJobStandardItemVoList = state.jobPlanDetailsListData.maintenanceJobStandardItemVoList || [];

        let ids = state.jobPlanDetailsListData ? filterArrByAttr(maintenanceJobStandardItemVoList, 'id').join(',') : '';

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

        actions.jobPlanDetailsUpdateList(['MATERIALS_ADD', this.materialsAddSelectedRows]);
        this.materialsAddModal.modalHide();
    }
    // 所需物料删除
    materialsDel = (record) => {
        let { actions } = this.props;
        actions.jobPlanDetailsUpdateList(['MATERIALS_DEL', record]);
    }
    // 所需物料编辑
    materialsEdit = (record) => {
        let { actions } = this.props;
        actions.jobPlanDetailsUpdateList(['MATERIALS_EDIT', record]);
    }
    jobPlanDetailsGetList = () => {
        const { actions } = this.props;
        this.setState({ tableLoading: true });
        actions.jobPlanDetailsUpdateList(this.param, () => {
            this.setState({ tableLoading: false });
        });
    }

    componentWillMount () {
        const { location, actions, commonState } = this.props;
        const isAddJobPlan = location.query.add_Job_Plan;

        this.localJobPlan && this.jobPlanDetailsGetList();

        if (isAddJobPlan || !this.localJobPlan) {
            const param = {
                orgId: commonState.orgId,
                siteId: commonState.siteId,
                modelKey: 'job'
            }
            actions.getJobPlanCode(param)
        }
    }
    render () {
        const { state, commonState, actions, commonActions, location } = this.props;
        const data = state.jobPlanDetailsListData;

        // 任务步骤数据
        const taskStepsList = data.maintenanceJobStandardTaskVoList;
        // 所需物料数据
        const materialsList = data.maintenanceJobStandardItemVoList;

        // 所需物料新建列表数据
        const materialsAddData = state.materialsAddListData;
        const materialsAddList = materialsAddData.list;

        return (
            <div className="eam-tab-page">
                <div className="eam-content">
                    <Collapse bordered={false} defaultActiveKey={['1', '2', '3']}>
                        <Panel header={<span className="label">基本信息 <Icon type="caret-down" /></span>} key="1" style={this.customPanelStyle}>
                            <NewForm
                                data={data}
                                location={location}
                                parentProps={{...this.props}}
                            />
                        </Panel>
                        <Panel header={<span className="label">标准任务 <Icon type="caret-down" /></span>} key="2" style={this.customPanelStyle}>
                            <Table
                                rowKey="id"
                                loading={this.state.taskstepsLoading}
                                pagination={{
                                    showTotal: (total, range) => `当前第${range[0]}-${range[1]}条 / 共${total}条`,
                                    defaultPageSize: 5,
                                }}
                                dataSource={taskStepsList}
                                columns={this.taskStepsColumns}
                                rowSelection={this.rowSelection}
                                bordered
                            />
                            <div className="panel-tools-right">
                                <Button type="primary" size="large" onClick={this.taskStepsAdd}>新建</Button>
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
                                <Button type="primary" size="large" onClick={this.materialsAdd} >新建</Button>
                            </div>
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

export default connect(mapStateToProps, buildActionDispatcher)(jobPlanDetailsComponent);
