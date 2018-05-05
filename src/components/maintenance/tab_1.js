/**
 * 维保保养-维保工单-工单提报 
 */
import React from 'react';
import { bindActionCreators } from 'redux';
import { browserHistory } from 'react-router';
import { connect } from 'react-redux';
import actions from '../../actions/maintenance.js';
import commonActions from '../../actions/common.js';
import { createForm } from 'rc-form';

import Dropdown from '../../components/common/dropdown.js';
import SelectAsset from '../../components/common/select_asset.js';
import SelectPublic from '../../components/common/select_public.js';

import { filterArrByAttr, correspondenceJson, msFormat } from '../../tools/';

import { Icon, Button, Table, Pagination, Collapse, Form, Input, Row, Col, Select, Radio, DatePicker, Menu, Timeline, notification } from 'antd'; 
const Panel = Collapse.Panel;
const FormItem = Form.Item;
const Option = Select.Option;
const RadioButton = Radio.Button;
const RadioGroup = Radio.Group;

import moment from 'moment';

class FormComponent extends React.Component {
    constructor (props) {
        super(props)

        this.state = {
            parentCodeModalShow: false,
            selectLocationShow: false,
        }

        this.selectParentCodeColumns = [
            {
                title: '工单编号',
                dataIndex: 'workOrderNum',
                key: 'workOrderNum',
                sorter: true,
            },
            {
                title: '描述',
                width: '15%',
                dataIndex: 'description',
                key: 'description',
                sorter: true,
            },
            {
                title: '工程类型',
                dataIndex: 'projectType',
                key: 'projectType',
                sorter: true,
            },
            {
                title: '超时',
                dataIndex: 'udisww',
                key: 'udisww',
                sorter: true,
            },
            {
                title: '外委',
                dataIndex: 'executeWhetherTimeout',
                key: 'executeWhetherTimeout',
                sorter: true,
            },
            {
                title: '状态',
                dataIndex: 'status',
                key: 'status',
                sorter: true,
            },
            {
                title: '提报时间',
                dataIndex: 'reportDate',
                key: 'reportDate',
                sorter: true,
            },
        ];
    }
    selectCode = (stateAttr) => {
        this.setState({ [stateAttr]: true });
    }
    componentDidUpdate () {
        const { form, parentProps } = this.props;
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
                    actions.getFormValues(values);
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
        commonActions.getDomainValue(domainValueParam, 'woType', 'WORK_ORDER_TYPE');
        commonActions.getDomainValue(domainValueParam, 'woProjectType', 'WORK_PROJECT_TYPE');
        commonActions.getDomainValue(domainValueParam, 'workOrder', 'WORK_ORDER_STATUS');
    }
    render () {

        let { data, editable, parentProps } = this.props;
        let { state, commonState, location } = parentProps;
        const { getFieldDecorator } = this.props.form;

        const isAddWorkOrder = location.query.add_work_order;

        const workProjectTypeData = commonState.workProjectTypeData,
              workOrderTypeData = commonState.workOrderTypeData;

        const nowDate = moment(moment().format('YYYY-MM-DD HH:mm:ss'));

        return (
            <div>
                <Form layout="vertical">
                    <Row gutter={16}>
                        <Col className="gutter-row" xs={{ span: 3}}>
                            <FormItem
                                label="工单编码"
                            >
                                {
                                    getFieldDecorator('workOrderNum', {
                                        initialValue: isAddWorkOrder ? state.workOrderCode : data.workOrderNum,
                                        rules: [{
                                            required: true,
                                            message: '工单编码不能为空！',
                                        }],
                                    })(
                                        <Input disabled />
                                    )
                                }
                            </FormItem>
                        </Col>
                        <Col className="gutter-row" xs={{ span: 9}}>
                            <FormItem
                                label="工单描述"
                            >
                                {
                                    getFieldDecorator('description', {
                                        initialValue: data.description,
                                        rules: [{
                                            required: true,
                                            message: '工单描述不能为空！',
                                        }],
                                    })(
                                        <Input disabled={!editable} />
                                    )
                                }
                            </FormItem>
                        </Col>
                        <Col className="gutter-row" xs={{ span: 6}}>
                            <FormItem
                                label="工程类型"
                            >
                                {
                                    getFieldDecorator('projectType', {
                                        initialValue: (data && data.projectType) ? data.projectType : (workProjectTypeData[0] && workProjectTypeData[0].value),
                                        rules: [{
                                            required: true,
                                            message: '工程类型不能为空！',
                                        }],
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
                        <Col className="gutter-row" xs={{ span: 6}}>
                            <FormItem
                                label="站点"
                            >
                                {
                                    getFieldDecorator('siteName', {
                                        initialValue: isAddWorkOrder ? commonState.siteName : data.siteName
                                    })(
                                        <Input disabled />
                                    )
                                }
                            </FormItem>
                        </Col>

                        <Col className="gutter-row" xs={{ span: 3}}>
                            <FormItem
                                label="设备设施"
                            >
                                {
                                    getFieldDecorator('zanshibuzuo1', {
                                        initialValue: ''
                                    })(
                                        <Input readOnly disabled/>
                                    )
                                }
                            </FormItem>
                        </Col>
                        <Col className="gutter-row" xs={{ span: 9}}>
                            <FormItem
                                label="设备设施描述"
                            >
                                {
                                    getFieldDecorator('zanshibuzuo2')(
                                        <Input disabled />
                                    )
                                }
                            </FormItem>
                        </Col>
                        <Col className="gutter-row" xs={{ span: 6}}>
                            <FormItem
                                label="工单类型"
                            >
                                {
                                    getFieldDecorator('workType', {
                                        initialValue: (data && data.workType) ? data.workType : (workOrderTypeData[0] && workOrderTypeData[0].value),
                                        rules: [{
                                            required: true,
                                            message: '工单类型不能为空！',
                                        }],
                                    })(
                                        <Select size="large" style={{ width: '100%' }} disabled={!editable}>
                                            {
                                                workOrderTypeData.map((item, i) => <Option key={i} value={item.value}>{item.description}</Option>)
                                            }
                                        </Select>
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
                                        initialValue: isAddWorkOrder ? '待提报' : (data.status && correspondenceJson.workOrder[data.status].text)
                                    })(
                                        <Input disabled />
                                    )
                                }
                            </FormItem>
                        </Col>
                        <Col className="gutter-row" style={{display: 'none'}}>
                            <FormItem
                                label="状态值"
                            >
                                {
                                    getFieldDecorator('status', {
                                        initialValue: isAddWorkOrder ? 'DTB' : data && data.status
                                    })(
                                        <Input disabled />
                                    )
                                }
                            </FormItem>
                        </Col>

                        <Col className="gutter-row" xs={{ span: 3}}>
                            <FormItem
                                label="位置编码"
                            >
                                {
                                    getFieldDecorator('locationNum', {
                                        initialValue: this.state.locationCode ? this.state.locationCode : data.locationNum
                                    })(
                                        <Input
                                            suffix={!editable ? null : <Icon style={{cursor: 'pointer'}} type="plus" onClick={() => {this.selectCode('selectLocationShow')}} />}
                                            onClick={() => {this.selectCode('selectLocationShow')}} readOnly disabled={!editable}
                                        />
                                    )
                                }
                            </FormItem>
                        </Col>
                        <Col className="gutter-row" style={{display: 'none'}}>
                            <FormItem
                                label="位置编码id"
                            >
                                {
                                    getFieldDecorator('locationId', {
                                        initialValue: this.state.locationId ? this.state.locationId : data.locationId
                                    })(
                                        <Input readOnly disabled={!editable}/>
                                    )
                                }
                            </FormItem>
                        </Col>
                        <Col className="gutter-row" xs={{ span: 9}}>
                            <FormItem
                                label="位置描述"
                            >
                                {
                                    getFieldDecorator('locationDesc', {
                                        initialValue: this.state.locationDesc ? this.state.locationDesc : data.locationDesc
                                    })(
                                        <Input disabled />
                                    )
                                }
                            </FormItem>
                        </Col>
                        <Col className="gutter-row" xs={{ span: 6}}>
                            <FormItem
                                label="事件级别"
                            >
                                {
                                    getFieldDecorator('incidentLevel', {
                                        initialValue: isAddWorkOrder ? 'M' : data.incidentLevel
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
                        <Col className="gutter-row" xs={{ span: 6}}>
                            <FormItem
                                label="状态时间"
                            >
                                {
                                    getFieldDecorator('statusDate', {
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

                        <Col className="gutter-row" xs={{ span: 3}}>
                            <FormItem
                                label="父级工单编码"
                            >
                                {
                                    getFieldDecorator('parentWorkOrderNum', {
                                        initialValue: this.state.parentWorkOrderNum ? this.state.parentWorkOrderNum : data.parentWorkOrderNum
                                    })(
                                        <Input
                                            // suffix={<Icon style={{cursor: 'pointer'}} type="plus" onClick={() => {this.selectCode('parentCodeModalShow')}} />}
                                            onClick={() => {this.selectCode('parentCodeModalShow')}}
                                            disabled
                                        />
                                    )
                                }
                            </FormItem>
                        </Col>
                        <Col className="gutter-row" style={{display: 'none'}}>
                            <FormItem
                                label="父级工单编码id"
                            >
                                {
                                    getFieldDecorator('parentWorkOrderId', {
                                        initialValue: this.state.parentWorkOrderId ? this.state.parentWorkOrderId : data.parentWorkOrderId
                                    })(
                                        <Input readOnly onClick={() => {this.selectCode('parentCodeModalShow')}} disabled/>
                                    )
                                }
                            </FormItem>
                        </Col>
                        <Col className="gutter-row" xs={{ span: 9}}>
                            <FormItem
                                label="父级工单描述"
                            >
                                {
                                    getFieldDecorator('parentWorkOrderDesc', {
                                        initialValue: this.state.parentWorkOrderDesc ? this.state.parentWorkOrderDesc : data.parentWorkOrderDesc
                                    })(
                                        <Input disabled />
                                    )
                                }
                            </FormItem>
                        </Col>
                        <Col className="gutter-row" xs={{ span: 6}}>
                            <FormItem
                                label="提报人"
                            >
                                {
                                    getFieldDecorator('reportName', {
                                        initialValue: data.reportName || commonState.personName
                                    })(
                                        <Input disabled />
                                    )
                                }
                            </FormItem>
                        </Col>
                        <Col className="gutter-row" xs={{ span: 6}}>
                            <FormItem
                                label="预防性维护"
                            >
                                {
                                    getFieldDecorator('maintenancePlanNum', {
                                        initialValue: data.maintenancePlanNum
                                    })(
                                        <Input disabled/>
                                    )
                                }
                            </FormItem>
                        </Col>

                        <Col className="gutter-row" xs={{ span: 12}}>
                            <FormItem
                                label="提报说明"
                            >
                                {
                                    getFieldDecorator('reportDescription', {
                                        initialValue: data.reportDescription
                                    })(
                                        <Input type="textarea" className="eam-textarea" disabled={!editable}/>
                                    )
                                }
                            </FormItem>
                        </Col>
                        <Col className="gutter-row" xs={{ span: 6}}>
                            <FormItem
                                label="提报时间"
                            >
                                {
                                    getFieldDecorator('reportDate', {
                                        initialValue: data.length ? moment(data.reportDate, 'YYYY-MM-DD HH:mm') : nowDate
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
                        <Col className="gutter-row" xs={{ span: 6}}>
                            <FormItem
                                label="档案编号"
                            >
                                {
                                    getFieldDecorator('archivesNum', {
                                        initialValue: data.archivesNum,
                                    })(
                                        <Input disabled={!editable}/>
                                    )
                                }
                            </FormItem>
                        </Col>
                        <Col className="gutter-row" xs={{ span: 6}}>
                            <FormItem
                                label="电话"
                            >
                                {
                                    getFieldDecorator('reportMobile', {
                                        initialValue: isAddWorkOrder ? commonState.personMobile : data.reportMobile
                                    })(
                                        <Input  disabled/>
                                    )
                                }
                            </FormItem>
                        </Col>
                        <Col className="gutter-row" xs={{ span: 6}}>
                            <FormItem
                                label="是否外委"
                            >
                                {
                                    getFieldDecorator('udisww', {
                                        initialValue: typeof data.udisww + '' === 'undefined' ? 'false' : data.udisww + ''
                                    })(
                                        <RadioGroup size="large" className="radio-group-col-2" style={{ width: '100%' }} disabled={!editable}>
                                            <RadioButton value="true"><i className="radio-group-icon-o"></i>外委</RadioButton>
                                            <RadioButton value="false"><Icon type="minus" />非外委</RadioButton>
                                        </RadioGroup>
                                    )
                                }
                            </FormItem>
                        </Col>
                    </Row>
                </Form>

                <SelectPublic
                    fetch={{
                        url: "/eam/open/workorder/findPageWorkOrderNotParentList",
                        type: 'post',
                        data: {
                            pageNum:1,
                            pageSize:5,
                        },
                        actionsType: 'PARENT_CODE_GET_LIST'
                    }}
                    stateAttr="parentCodeListData"
                    width={1200}
                    modalHide={() => { this.setState({ parentCodeModalShow: false }) }}
                    columns={this.selectParentCodeColumns}
                    visible={this.state.parentCodeModalShow}
                    onOk={record => {

                        this.setState({
                            parentWorkOrderId: record.id,
                            parentWorkOrderNum: record.workOrderNum,
                            parentWorkOrderDesc: record.description,
                        })
                    }}
                />
                <SelectAsset
                    treeData = {
                        [
                            {
                                name: '位置查询',
                                key: 'locations',
                                actionsMethod: 'locationsGetTree',
                                data: 'locationsTreeData',
                            }
                        ]
                    }
                    getLocationList //获取位置列表
                    selectAssetModalHide={() => { this.setState({ selectLocationShow: false }) }}
                    visible={this.state.selectLocationShow}
                    onOk={(selected) => {
                        this.setState({
                            locationCode: selected[0].code,
                            locationId: selected[0].id,
                            locationDesc: selected[0].description,
                        })
                    }}
                />
            </div>
        )
    }
}
const NewForm = Form.create()(FormComponent)
// const NewForm = connect(mapStateToProps, buildActionDispatcher)(createForm()(FormComponent));

class WorkOrderOneComponent extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            assetLoading: false,
            selectAssetShow: false,
            currentPage: 1,
            editable: false,
        }

        this.customPanelStyle = {
            background: '#fff',
            borderRadius: 2,
            marginBottom: 24,
            border: 0,
            boxShadow: '0 1px 6px rgba(0, 0, 0, 0.2)'
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
    // 工单提报获取数据
    workOrderCommitGetList = () => {
        const { actions } = this.props;
        this.setState({ assetLoading: true });
        actions.workOrderCommitUpdateList(this.param, () => {
            this.setState({ assetLoading: false });
        });
    }
    // 设备信息新建
    assetAdd = () => {
        const { state } = this.props;
        this.ignoreIds = state.workOrderCommitListData.assetList ? filterArrByAttr(state.workOrderCommitListData.assetList, 'id') : [];
        this.setState({ selectAssetShow: true });
    }
    assetAddSave = (selected) => {
        const { actions } = this.props;
        actions.workOrderCommitUpdateList(['ASSET_ADD', selected]);
    }
    assetDel = (record) => {
        let { actions } = this.props;
        actions.workOrderCommitUpdateList(['ASSET_DEL', record]);
    }
    componentWillMount () {
        const { actions, location, commonState } = this.props;
        const isAddWorkOrder = location.query.add_work_order;

        const curProcess = location.pathname.charAt(location.pathname.length-1);
        if (this.localWorkOrder && this.localWorkOrder.process >= curProcess) this.workOrderCommitGetList();

        if (this.localWorkOrder) {
            if (this.localWorkOrder.process == curProcess) {
                this.setState({ editable: true });
            } else {
                this.setState({ editable: false });
            }
        }

        // if (!isAddWorkOrder && !this.localWorkOrder) browserHistory.push('/maintenance/work_order');
        if (isAddWorkOrder || !this.localWorkOrder) {
            this.setState({ editable: true });
            const param = {
                orgId: commonState.orgId,
                siteId: commonState.siteId,
                modelKey: 'wo'
            }
            actions.getWorkOrderCode(param);
        }
        
    }
    render () {

        const { state, commonState, location, commonActions, actions } = this.props;
        const workOrderCommitData = state.workOrderCommitListData;

        const assetList = workOrderCommitData.assetList;
        // 执行记录数据
        const recordList = workOrderCommitData.eamImpleRecordVoVoList || [];
        // 执行记录日期
        const recordDateArr = workOrderCommitData.dateArr;

        const defaultRender = (text, record, key) => {
            return (
                <p>{text ? text : '-'}</p>
            )
        };

        // 设备信息表格字段
        const assetColumns = this.state.editable ? 
        [
            {
                title: '设备信息',
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
                title: '位置',
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
        ]:
        [
            {
                title: '设备信息',
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
                title: '位置',
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
        ];

        return (
            <div className="eam-tab-page">
                <div className="eam-content">
                    <Collapse bordered={false} defaultActiveKey={['1', '2', '3']}>
                        <Panel header={<span className="label">工单信息 <Icon type="caret-down" /></span>} key="1" style={this.customPanelStyle}>
                            <NewForm
                                data={workOrderCommitData}
                                editable={this.state.editable}
                                parentProps={{...this.props}}
                            />
                        </Panel>
                        <Panel header={<span className="label">设备信息 <Icon type="caret-down" /></span>} key="2" style={this.customPanelStyle}>
                            <Table
                                rowKey="id"
                                loading={this.state.assetLoading}
                                pagination={{
                                    showTotal: (total, range) => `当前第${range[0]}-${range[1]}条 / 共${total}条`,
                                    defaultPageSize: 5,
                                }}
                                dataSource={assetList}
                                columns={assetColumns}
                                bordered
                            />
                            <div className="panel-tools-right">
                                {/*<Dropdown
                                    disabled={!this.state.editable}
                                    overlay={(
                                         <Menu>
                                            <Menu.Item key="0"><Icon type="edit" /> 变更状态</Menu.Item>
                                                                                        <Menu.Item key="1"><Icon type="setting" /> 批量派工</Menu.Item>
                                                                                        <Menu.Divider />
                                            <Menu.Item key="3"><Icon type="delete" /> 批量删除</Menu.Item>
                                        </Menu>
                                    )}
                                    trigger={['click']}
                                >
                                    更多操作
                                </Dropdown>*/}
                                <Button type="primary" size="large" onClick={this.assetAdd} style={{display: this.state.editable? 'inline-block' : 'none'}}>新建</Button>
                            </div>
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
