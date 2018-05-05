/**
 * 环境监测 详细 ，新增 修改页面 
 */
import React from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import actions from '../../actions/environmental.js';
import commonActions from '../../actions/common';
import { Link, browserHistory } from 'react-router';
import { createForm } from 'rc-form';
import Dropdown from '../../components/common/dropdown.js';
import NumInp from '../../components/common/num_inp.js';
import MyModal from '../../components/common/modal.js';

import SelectAsset from '../common/select_asset';

import ReactEcharts from 'echarts-for-react';

import moment from 'moment';

import { Icon, Modal, Button, Tabs, Tree, Table, Pagination, Collapse, Form, Input, Row, Col, Select, Radio, DatePicker, Menu, InputNumber } from 'antd';
const Panel = Collapse.Panel;
const FormItem = Form.Item;
const Option = Select.Option;
const RadioButton = Radio.Button;
const RadioGroup = Radio.Group;
const TabPane = Tabs.TabPane;
const TreeNode = Tree.TreeNode;
const confirm = Modal.confirm;
const { MonthPicker, YearPicker } = DatePicker;

class FormComponent extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            locationModalShow: false,
            classificationModalShow: false,
            assetDetailData: '',
            location: {},
            classification: {},
            id: '',
        }
    }
    /////////////////////////////////////获取环境监测设备详情/////////////////////////////////
    componentDidMount() {
        //获取 url 里面的参数  初始化数据
        let { location } = this.props.props || '';
        let param = location.search.substring(1);
        if (param != '') {
            this.setState({
                id: param
            });
            this.getAssetDetail({ id: param });
        } else {
            const { actions ,commonState} = this.props.props;
            actions.setMeterListHide(true);
            let codeParam = {
                modelKey: 'hjjc_asset' ,
                siteId: commonState.siteId,
            } ;
            actions.getGeneratorCode(codeParam,(data) =>{
                
            }) ;
        }
    }

    getAssetDetail = (param) => {
        const { actions, form } = this.props.props;

        actions.assetGetDetail(param, (data) => {
            this.setState({
                assetDetailData: data,
            });
            actions.setDetailTitle(data.name) ;
        })
    }

    locationTreeShow = () => {
        this.setState({ locationModalShow: true });
    }

    classificationTreeShow = () => {
        this.setState({ classificationModalShow: true });
    }

    //保存
    componentDidUpdate() {
        const { form } = this.props;
        const { state, actions, commonState } = this.props.props;
        if (state.getFormValues != false) {
            actions.getFormValues(false);

            form.validateFields((err, values) => {
                if (!err) {
                    let param = form.getFieldsValue();
                    let id = this.state.id;
                    param = {
                        ...values,
                        orgId: commonState.orgId,
                        siteId: commonState.siteId,
                        products: commonState.productArray,
                        id: id,
                    }
                    actions.environmetnAssetSave([id ? 'ENVIRONMENT_ASSET_EDIT' : 'ENVIRONMENT_ASSET_ADD', param], (data) => {
                        browserHistory.push(`/environmental/environment_asset/detail?${data.id}`)
                    });
                }
            });
        }
    }
    render() {
        const { getFieldDecorator } = this.props.form;
        const { commonState } = this.props;
        const { assetDetailData } = this.state ? this.state : '';
        const { generatorCode } =  this.props.props.state ;
        return (
            <div>
                <Form layout="vertical">
                    <Row gutter={16}>
                        <Col className="gutter-row" sm={{ span: 4 }}>
                            <FormItem
                                label="传感器编码"
                            >
                                {
                                    getFieldDecorator('thirdPartyCode', {
                                        rules: [{ required: true, message: '传感器编码不能为空！' }],
                                        initialValue:  generatorCode||assetDetailData.code 
                                    })(
                                        <Input  disabled/>
                                        )
                                }
                            </FormItem>
                        </Col>
                        <Col className="gutter-row" sm={{ span: 9 }}>
                            <FormItem
                                label="传感器名称"
                            >
                                {
                                    getFieldDecorator('name', {
                                        rules: [{ required: true, message: '传感器名称不能为空！' }],
                                        initialValue: assetDetailData.name || ''
                                    })(
                                        <Input placeholder="请输入传感器名称" />
                                        )
                                }
                            </FormItem>
                        </Col>
                        <Col className="gutter-row" sm={{ span: 6 }}>
                            <FormItem
                                label="传感器类型"
                            >
                                {
                                    getFieldDecorator('classificationName', {
                                        initialValue: this.state.classification.name ? this.state.classification.name : assetDetailData && assetDetailData.classification ? assetDetailData.classification.name : '',
                                        rules: [{ required: true, message: '传感器类型不能为空！' }],
                                    })(
                                        <Input placeholder="请选择类型"  onClick={this.classificationTreeShow}  suffix={<Icon type="plus"  onClick={this.classificationTreeShow} /> } />
                                        )
                                }
                                <SelectAsset
                                    treeData={
                                        [
                                            {
                                                name: '分类查询',
                                                key: 'classifications',
                                                actionsMethod: 'classifiGetTree',
                                                param: {
                                                    orgId: commonState.orgId,//'e0bc74c4f58611e58c2d507b9d28ddca',
                                                    productArray: commonState.productArray,
                                                    parentId: "c6519b4e612711e79a2890d370b53e17",
                                                },
                                                data: 'classifiTreeData',
                                            }
                                        ]
                                    }
                                    getClassifiList
                                    meterClassification //获取分类列表
                                    selectAssetModalHide={() => { this.setState({ classificationModalShow: false }) }}
                                    visible={this.state.classificationModalShow}
                                    onOk={(record) => {
                                        this.setState({ classification: record[0] })
                                    }}
                                />
                            </FormItem>
                        </Col>
                        <Col className="gutter-row" style={{ display: 'none' }}>
                            <FormItem
                                label="分类id"
                            >
                                {
                                    getFieldDecorator('classificationId', {
                                        initialValue: this.state.classification.id ? this.state.classification.id : assetDetailData ? assetDetailData.classificationId : '',
                                        rules: [{ required: true, message: '文本不能为空' }],
                                    })(
                                        <Input />
                                        )
                                }
                            </FormItem>
                        </Col>
                        <Col className="gutter-row" sm={{ span: 5 }}>
                            <FormItem
                                label="当前状态"
                            >
                                {
                                    getFieldDecorator('warning', {
                                        initialValue: 'warning'
                                    })(
                                        <Select size="large" style={{ width: '100%' }}>
                                            <Option value="normal">正常</Option>
                                            <Option value="warning">报警</Option>
                                            <Option value="urgentAlarm">紧急报警</Option>
                                            <Option value="timeout">超时</Option>
                                            <Option value="offline">离线</Option>
                                            <Option value="notActive">未激活</Option>
                                        </Select>
                                        )
                                }
                            </FormItem>
                        </Col>

                        <Col className="gutter-row" sm={{ span: 4 }}>
                            <FormItem
                                label="位置编码"
                            >
                                {
                                    getFieldDecorator('locationCode', {
                                        initialValue: this.state.location.code ? this.state.location.code : assetDetailData && assetDetailData.location ? assetDetailData.location.code : '',
                                        rules: [{ required: true, message: '位置不能为空！' }],
                                    })(
                                        <Input placeholder="请选择编码"  onClick={this.locationTreeShow}  suffix={<Icon type="plus"  onClick={this.locationTreeShow} />} />
                                        )
                                }
                                <SelectAsset
                                    treeData={
                                        [
                                            {
                                                name: '位置查询',
                                                key: 'locations',
                                                param: {
                                                    orgId: commonState.orgId,//'e0bc74c4f58611e58c2d507b9d28ddca',
                                                    siteId: commonState.siteId,
                                                    productArray: commonState.productArray,
                                                },
                                                actionsMethod: 'locationsGetTree',
                                                data: 'locationsTreeData',
                                            }
                                        ]
                                    }
                                    getLocationList //获取位置列表
                                    selectAssetModalHide={() => { this.setState({ locationModalShow: false }) }}
                                    visible={this.state.locationModalShow}
                                    onOk={(record) => {
                                        this.setState({ location: record[0] })
                                    }
                                    }
                                />
                            </FormItem>
                        </Col>
                        <Col className="gutter-row" style={{ display: 'none' }}>
                            <FormItem
                                label="位置id"
                            >
                                {
                                    getFieldDecorator('locationId', {
                                        initialValue: this.state.location.id ? this.state.location.id : assetDetailData ? assetDetailData.locationId : '',
                                        rules: [{ required: true, message: '文本不能为空' }],
                                    })(
                                        <Input />
                                        )
                                }
                            </FormItem>
                        </Col>
                        <Col className="gutter-row" sm={{ span: 9 }}>
                            <FormItem
                                label="位置名称"
                            >
                                {
                                    getFieldDecorator('locationName', {
                                        initialValue: this.state.location.description ? this.state.location.description : assetDetailData && assetDetailData.location ? assetDetailData.location.description : '',
                                        rules: [{ required: true, message: '文本不能为空' }],
                                    })(
                                        <Input placeholder="" disabled />
                                        )
                                }
                            </FormItem>
                        </Col>
                        <Col className="gutter-row" sm={{ span: 6 }}>
                            <FormItem
                                label="传输周期(分钟)"
                            >
                                {
                                    getFieldDecorator('timeinterval', {
                                        initialValue: assetDetailData.timeinterval,
                                        rules: [{ required: true, message: '传输周期不能为空！' }],
                                    })(
                                        <InputNumber min={1} />
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

const NewFormComponent = Form.create()(FormComponent)

// 测点新建表单
class MeterFormComponent extends React.Component {
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
    render() {
        const { form, data } = this.props;
        const { getFieldDecorator } = form;

        return (
            <Form>
                <FormItem
                    {...this.formItemLayout}
                    label="测点名称"
                >
                    {
                        getFieldDecorator('name', {
                            initialValue: data ? data.name : '',
                            rules: [{ required: true, message: '文本不能为空' }],
                        })(
                            <Input style={{ width: '100%' }} />
                            )
                    }
                </FormItem>
                <FormItem
                    {...this.formItemLayout}
                    label="测点编码"
                >
                    {
                        getFieldDecorator('code', {
                            initialValue: data ? data.code : '',
                            rules: [{ required: true, message: '文本不能为空' }],
                        })(
                            <Input style={{ width: '100%' }} />
                            )
                    }
                </FormItem>
                <FormItem
                    {...this.formItemLayout}
                    label="测点描述"
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
            </Form>
        )
    }
}
const MeterForm = Form.create()(MeterFormComponent);
// 报警规则新建表单
class MeterWarningFormComponent extends React.Component {
    constructor(props) {
        super(props);
        let defaultRender = (text, record, key) => {
            return (
                <p>{text ? text : '-'}</p>
            )
        };
        this.meterWarningListColumns = [
            {
                title: '报警名称',
                dataIndex: 'name',
                sorter: (a, b) => a.name.length - b.name.length,
                key: 'name',
                render: defaultRender
            },
            {
                title: '描述',
                dataIndex: 'description',
                sorter: (a, b) => a.description.length - b.description.length,
                key: 'description',
                render: defaultRender
            },
            // {
            //     title: '操作符号',
            //     dataIndex: 'operationSymbol',
            //     sorter: (a, b) => a.operationSymbol.length - b.operationSymbol.length,
            //     key: 'operationSymbol',
            //     render: defaultRender
            // },
            {
                title: '值',
                dataIndex: 'value',
                sorter: (a, b) => a.value - b.value,
                key: 'value',
                render: defaultRender
            },
            {
                title: '类型',
                dataIndex: 'action',
                sorter: (a, b) => a.action.length - b.action.length,
                key: 'action',
                render: (text, record, key) => {
                    if (record.action == 'EM_BJSX') {
                        return (
                            <p>报警上限</p>
                        )
                    }
                    if (record.action == 'EM_BJXX') {
                        return (
                            <p>报警下限</p>
                        )
                    }
                    if (record.action == 'EM_YJSX') {
                        return (
                            <p>预警上限</p>
                        )
                    }
                    if (record.action == 'EM_YJXX') {
                        return (
                            <p>预警下限</p>
                        )
                    }
                    if (record.action == 'EM_GZYJ') {
                        return (
                            <p>光照预警</p>
                        )
                    }
                }
            },
            {
                title: '持续时间 单位(秒)',
                dataIndex: 'duration',
                sorter: (a, b) => a.duration - b.duration,
                key: 'duration',
                render: defaultRender
            },
            {
                title: '操作',
                dataIndex: '4',
                key: '4',
                width: 200,
                render: (text, record, key) => {
                    return (
                        <div className="table-icon-group">
                            <Icon
                                type="delete"
                                onClick={() => {
                                    this.warningRuleDeleteShowConfirm(record.id, record.name);
                                }}
                            />

                        </div>
                    )
                }
            },
        ];
    }
    state = {
        meterWarningListLoading: true,
        meterWarningListData: [],
        operationSymbolTypes: [],
        actionType: [],
    };
    componentDidMount() {
        this.getWarningList(); //获取规则列表
        this.getOperationSymbolType(); //获取操作符号
    }
    componentDidUpdate() {
        const { warningFresh } = this.props.props.state;
        if (warningFresh) {
            const { actions } = this.props.props;
            actions.setWarningFresh(false);
            this.getWarningList();
        }
    }
    getWarningList = () => {
        const { meterInfo } = this.props.props.state;

        let param = {
            meterId: meterInfo.id || '',
        };
        const { actions } = this.props.props;
        actions.warningGetList(param, (data) => {
            const actionType = [];  // 报警类型控件显示隐藏处理
            var bjsx = false  ;
            var bjxx = false;
            var yjsx = false;
            var yjxx = false;
            var gzyj = false;
            if (data.list) {
                data.list.map((item, i) => {
                    if (item.action.indexOf("EM_BJSX") == 0) {
                        bjsx = true;
                    }
                    if (item.action.indexOf("EM_BJXX") == 0) {
                        bjxx = true;

                    }
                    if (item.action.indexOf("EM_YJSX") == 0) {
                        yjsx = true;
                    }
                    if (item.action.indexOf("EM_YJXX") == 0) {
                        yjxx = true;
                    }
                    if (item.action.indexOf("EM_GZYJ") == 0) {
                        gzyj = true;
                    }

                });
            }
            if (!bjsx) {
                actionType.push(<Option value="EM_BJSX">报警上限</Option>);
            }
            if (!bjxx) {
                actionType.push(<Option value="EM_BJXX">报警下限</Option>);
            }
            if (!yjsx) {
                actionType.push(<Option value="EM_YJSX">预警上限</Option>);
            }
            if (!yjxx) {
                actionType.push(<Option value="EM_YJXX">预警下限</Option>);
            }
            if (!gzyj && meterInfo.what == 'light') {
                actionType.push(<Option value="EM_GZYJ">光照预警</Option>);
            }
            this.setState({
                meterWarningListData: data.list,
                actionType: actionType ,
            });
        });
    }
    //  下拉符号
    getOperationSymbolType = () => {
        const { actions } = this.props.props;
        actions.operationSymbolTypeGetList('', (data) => {
            const operationSymbolTypes = [];
            for (var key of Object.keys(data)) {
                operationSymbolTypes.push(<option key={key} value={key}>{key}</option>)
            }

            this.setState({
                operationSymbolTypes: operationSymbolTypes,
            });
        });
    }
    //报警规则添加
    warningRuleAdd = () => {
        const { actions } = this.props.props;
        const { form } = this.props;

        form.validateFields((err, values) => {
            if (!err) {
                let param = {
                    ...values,
                    meterId: this.props.props.state.meterInfo.id,
                }
                actions.warningRuleSave(param, (data) => {
                    if (data.success) {
                        this.getWarningList();
                        form.resetFields();
                        actions.setMeterListFresh(true);
                    } else {
                        //失败了 弹出错误
                    }

                });
            }
        });
    }
//下发配置
    warningRuleGrant = () => {
        const { actions } = this.props.props;
        const {  commonState } = this.props.props;
        let param = {
            meterId: this.props.props.state.meterInfo.id ,
            orgId: commonState.orgId ,
            siteId: commonState.siteId ,
            productArray: commonState.productArray ,
        }
        actions.warningRuleGrant( param, (data) => {
            if (data.success) {
                alert("下发成功")
            } else {
                //失败了 弹出错误
            }

        });
    }
    warningRuleDeleteShowConfirm = (id, text) => {
        confirm({
            title: `删除 ${text}?`,
            okText: '删除',
            onOk: () => {
                let { actions } = this.props.props;
                actions.warningRuleDelete([id], (data) => {
                    if (data.success) {
                        this.getWarningList();
                        actions.setMeterListFresh(true);
                    }
                });
            }
        });
    }
    render() {
        const { form, data } = this.props;
        const { getFieldDecorator } = form;
        const { meterInfo } = this.props.props.state;
        const { meterWarningListData } = this.state || [];
        const operationSymbolTypes = this.state.operationSymbolTypes ? this.state.operationSymbolTypes : '';
        const actionType = this.state.actionType ? this.state.actionType : '';
        return (
            <div>
                <Form layout="vertical">
                    <Row gutter={16}>
                        <Col className="gutter-row" sm={{ span: 3 }}>
                            <FormItem
                                label="报警名称"
                            >
                                {
                                    getFieldDecorator('name', {
                                        rules: [{ required: true, message: '请填写报警名称' }],
                                    })(
                                        <Input placeholder="请填写报警名称" />
                                        )
                                }
                            </FormItem>
                        </Col>
                        <Col className="gutter-row" sm={{ span: 3 }}>
                            <FormItem
                                label="类型"
                            >
                                {
                                    getFieldDecorator('action', {
                                        rules: [{ required: true, message: '请选择类型' }],
                                    })

                                        (
                                        <Select size="large" style={{ width: '100%' }}>
                                                {actionType}
                                        </Select>
                                        )
                                }
                            </FormItem>
                        </Col>

                        {/* <Col className="gutter-row" sm={{ span: 3 }}>
                            <FormItem 
                                label="操作符"
                            >
                                {
                                    getFieldDecorator('operationSymbol', {
                                        rules: [{ required: true, message: '请选择操作符号' }],
                                        initialValue: '=',
                                    })(
                                        <select style={{ width: 90, height: 30 }}>
                                            {operationSymbolTypes}
                                        </select>
                                        )
                                }
                            </FormItem>
                        </Col> */}
                        <Col className="gutter-row" sm={{ span: 3 }}>
                            <FormItem
                                label="值"
                            >
                                {
                                    getFieldDecorator('value', {
                                        rules: [{ required: true, message: '请填值' }],
                                    })(
                                        <InputNumber min={1} />
                                        )
                                }
                            </FormItem>
                        </Col>
                        <Col className="gutter-row" sm={{ span: 3 }}>
                            <FormItem
                                label="持续时间(s)"
                            >
                                {
                                    getFieldDecorator('duration', {
                                        rules: [{ required: true, message: '请填写持续时间' }],
                                    })(
                                        <InputNumber min={1} />
                                        )
                                }
                            </FormItem>
                        </Col>

                        <Col className="gutter-row" sm={{ span: 3 }}>
                            <FormItem
                                label="描述"
                            >
                                {
                                    getFieldDecorator('description', {
                                    })(
                                        <Input placeholder="请填写描述" />
                                        )
                                }
                            </FormItem>
                        </Col>

                        <Button type="primary" size="large" style={{ marginTop: 28, marginLeft: 10 }} onClick={this.warningRuleAdd}> 添加</Button>
                        <Button type="primary" size="large" style={{ marginTop: 28, marginLeft: 10 }} onClick={this.warningRuleGrant}> 下发配置</Button>

                    </Row>
                </Form>
                <div>
                    <Table
                        rowKey="id"
                        loading={this.meterWarningListLoading}
                        pagination={{
                            showTotal: (total, range) => `当前第${range[0]}-${range[1]}条 / 共${total}条`,
                            defaultPageSize: 5,
                        }}
                        dataSource={meterWarningListData}
                        columns={this.meterWarningListColumns}
                        // rowSelection={this.rowSelection}
                        bordered
                    />
                </div>
            </div>

        )
    }
}
const MeterWarningForm = Form.create()(MeterWarningFormComponent);

//测量点信息
class DateFormComponent extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            currentPage: 1,
        }
    }

    render() {
        const { getFieldDecorator } = this.props.form;
        const { data, commonState } = this.props;

        return (
            <Form layout="horizontal">
                <Row gutter={16} justify="start">
                    <Col className="gutter-row meter-point" xs={{ span: 9 }}>
                        <FormItem
                            label="开始时间"
                        >
                            {
                                getFieldDecorator('bt')(
                                    <DatePicker
                                        showTime
                                        format="YYYY-MM-DD"
                                        placeholder="Select Time"
                                        onChange={(onChange) => { }}
                                        onOk={(value) => { }}
                                    />
                                )
                            }
                        </FormItem>
                    </Col>
                    <Col className="gutter-row meter-point" xs={{ span: 9 }}>
                        <FormItem
                            label="结束时间"
                        >
                            {
                                getFieldDecorator('et')(
                                    <DatePicker
                                        showTime
                                        format="YYYY-MM-DD"
                                        placeholder="Select Time"
                                        onChange={(onChange) => { }}
                                        onOk={(value) => { }}
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
const NewDateFormComponent = createForm()(DateFormComponent);

class EnvironmentAssetDetailComponent extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            modalShow: false,
            currentPage: 1,
            tableLoading: false,
            treeLoading: false,
            visibleLocation: false,
            meterEditData: '',
            assetId: '',
            what: '',
            etype: 'bar',
            type: 'primary',
        }
        this.meterInfo = {};
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
        // 关联测点列表
        this.meterListColumns = [
            {
                title: '测点名称',
                dataIndex: 'name',
                key: 'name',
                sorter: (a, b) => a.name.length - b.name.length,
                render: defaultRender
            },
            {
                title: '测点结果',
                dataIndex: 'meterValue',
                key: 'meterValue',
                sorter: (a, b) => a.meterValue - b.meterValue,
                render: defaultRender
            },
            {
                title: '预警/报警信息',
                dataIndex: 'rules',
                key: 'rules',
                sorter: (a, b) => a.rules.length - b.rules.length,
                render: defaultRender
            },
            {
                title: '测量时间',
                dataIndex: 'meterValueTime',
                key: 'meterValueTime',
                sorter: (a, b) => a.meterValueTime - b.meterValueTime,
                render: (text, record, key) => {
                    return (
                        <p>{text ? text : '-'}</p>
                    )
                }
            },
            {
                title: '操作',
                dataIndex: '4',
                key: '4',
                width: 200,
                render: (text, record, key) => {
                    return (
                        <div className="table-icon-group">
                            <Link type="edit"
                                onClick={() => {
                                    this.meterDetail(record);
                                }}
                            >详细信息</Link>
                            <Link type="warning"
                                onClick={() => {
                                    this.meterWarningShow(record);
                                }}
                            >报警设置</Link>
                            <Icon
                                type="delete"
                                onClick={() => {
                                    this.meterDeleteShowConfirm(record.id, record.name);
                                }}
                            />

                        </div>
                    )
                }
            },
        ];

        // 关联工单列表
        this.columns = [
            {
                title: '工单编号',
                dataIndex: 'workOrderNum',
                key: 'workOrderNum',
                sorter: true,
                render: defaultRender
            },
            {
                title: '描述',
                dataIndex: 'description',
                key: 'description',
                sorter: true,
                render: defaultRender
            },
            {
                title: '创建时间',
                dataIndex: 'reportDate',
                key: 'reportDate',
                sorter: true,
                render: defaultRender
            },
            {
                title: '完成时间',
                dataIndex: 'actualEndDate',
                key: 'actualEndDate',
                sorter: true,
                render: defaultRender
            },
            {
                title: '工单类型',
                dataIndex: 'durati',
                key: 'durati',
                sorter: true,
                render: defaultRender
            },
            {
                title: '状态',
                dataIndex: 'worktype',
                key: 'worktype',
                sorter: true,
                render: defaultRender
            },
        ];

        //详细信息列表
        this.meterDetailColumns = [
            {
                title: '更新时间',
                dataIndex: 'timestamp',
                key: 'timestamp',
                sorter: true,
                render: (text, record, key) => {
                    return (
                        <p>{moment(new Date(parseInt(text))).format("YYYY-MM-DD HH:mm:ss")}</p>
                    )
                }
            },
            {
                title: '检测值',
                dataIndex: 'value',
                key: 'value',
                render: defaultRender
            },
            {
                title: '状态',
                dataIndex: 'qualityStandard',
                key: 'qualityStandard',
                render: defaultRender
            },
            {
                title: '工单编码',
                dataIndex: 'duration',
                key: 'duration',
                render: defaultRender
            },
            {
                title: '工单状态',
                dataIndex: 'duratio',
                key: 'duratio',
                render: defaultRender
            },
        ];
    }
    pageChange = (page, pageSize) => {
        this.setState({ currentPage: page });
        this.param.pageNum = page; //*** 需要修改参数 在方法内单独修改
        this.getList();
    }
    /////////////////////////查询测点信息 */
    componentDidMount() {
        this.getMeterList();
        this.getList();
    }
    componentDidUpdate() {
        const { state, actions } = this.props;
        if (state.meterListHide) {
            this.props.state.meterListData = {};
            actions.setMeterListHide(false);
        }
        if (state.meterListFresh) {
            this.getMeterList();
            actions.setMeterListFresh(false);
        }

    }
    //获取关联测点信息
    getMeterList = () => {
        let { location } = this.props;
        let id = location.search.substring(1);
        if (id != '') {
            this.setState({
                assetId: id
            });
            let param = {
                assetId: id,
            };
            const { actions } = this.props;
            this.setState({
                meterListLoading: true
            });

            actions.meterGetList(param, (data) => {
                this.setState({
                    meterListLoading: false,
                    meterListData: data,
                });

            })
        } else {
            this.setState({
                meterListLoading: false,
                meterListData: {},
            });
        }

    }
    //获取关联工单
    getList = () => {
        const { actions, location } = this.props;
        let id = location.search.substring(1);
        if (id != '') {
            this.setState({
                assetId: id
            });
            let param = {
                assetId: id,
                pageNum: 1,
                pageSize: 10,
            };
            this.setState({
                meterListLoading: true
            });
            actions.recordsGetList(param, () => {
                this.setState({
                    meterListLoading: false,
                });
            });
        } else {
            this.setState({
                meterListLoading: false,
            });
        }
    }
    // 新建测点弹框
    meterAdd = () => {
        this.setState({ meterEditData: '' });
        this.meterAddModal.modalShow();
    }
    // 新建测点弹框
    meterEdit = (record) => {
        this.setState({ meterEditData: '' });
        this.meterAddModal.modalShow();
    }
    // 保存新建/编辑 meter步骤
    meterSave = () => {

        let { actions, commonState } = this.props;
        let editJson = this.state.meterEditData;

        this.meterAddForm.validateFields((err, values) => {
            values.orgId = commonState.orgId;
            values.siteId = commonState.siteId;
            values.assetId = this.state.assetId;
            if (err) return;
            values.id = editJson.id;
            actions.meterUpdate([editJson ? 'METER_EDIT' : 'METER_ADD', values], (data) => {

                if (data.success) {
                    this.getMeterList();
                }
            });
        });
        this.meterAddModal.modalHide();
    }
    meterDetail = (record) => {
        this.setState({
            what: record.what,
            tagid: record.id,
        })
        this.detailModal.modalShow();
    }

    删除确认
    meterDeleteShowConfirm = (id, text) => {
        confirm({
            title: `删除 ${text}?`,
            okText: '删除',
            onOk: () => {
                let { actions } = this.props;
                actions.meterDelete([id], (data) => {
                    this.getMeterList();
                });
            }
        });
    }
    //报警信息弹窗
    meterWarningShow = (record) => {
        const { actions } = this.props;
        actions.setMeterInfo(record);
        actions.setWarningFresh(true);
        this.meterWarningModal.modalShow();
    }

    //关闭弹窗
    meterAfterClose = () => {
        this.meterAddForm.resetFields();
    }
    //日视图
    dayChange = (value) => {
        const { actions, state, commonState } = this.props;
        let time1 = moment(value._d).format('YYYY-MM-DD');
        let time = Date.parse(new Date(time1));
        const et = '1496869947875';
        const bt = '1496783547875';
        const tagid = 'pt1001';
        const site = 'value_site';
        const param = {
            tagid,
            site,
            bt,
            et,
        }
        actions.pointGetList(param, (json) => {
        });
    }
    //月视图
    monthChange = (value) => {
        const { actions, state, commonState } = this.props;
        let time1 = moment(value._d).format('YYYY-MM');
        let time = Date.parse(new Date(time1));
        const et = '1496869947875';
        const bt = '1496783547875';
        const tagid = 'pt1001';
        const site = 'value_site';
        const param = {
            tagid,
            site,
            bt,
            et,
        }
        actions.pointGetList(param, (json) => {
        });
    }
    //年视图
    yearChange = (value) => {
        const { actions, state, commonState } = this.props;
        let time1 = moment(value._d).format('YYYY');
        let time = Date.parse(new Date(time1));
        const et = '1496869947875';
        const bt = '1496783547875';
        const tagid = 'pt1001';
        const site = 'value_site';
        const param = {
            tagid,
            site,
            bt,
            et,
        }
        actions.pointGetList(param, (json) => {
        });
    }
    getPoint = () => {
        const { actions, state, commonState } = this.props;

        this.DateForm.props.form.validateFields((err, values) => {
            const bt1 = moment(values['bt']).format('YYYY-MM-DD HH:mm:ss');
            const et1 = moment(values['et']).format('YYYY-MM-DD HH:mm:ss');
            // const bt = Date.parse(new Date(bt1));
            // const et = Date.parse(new Date(et1));
            const et = '1496869947875';
            const bt = '1496783547875';
            const tagid = 'pt1001';
            const site = 'value_site';
            const param = {
                tagid,
                site,
                bt,
                et,
                paging: { "page": 1, "per": "998" },
            }
            actions.pointGetList(param, (json) => {
            });
        })
    }

    //bar line sline的转换
    BarChange = () => {
        this.setState({
            etype: 'bar',
            type: 'primary',
            lineType: '',
            SLineType: '',
        });
    }

    LineChange = () => {
        this.setState({
            etype: 'line',
            lineType: 'primary',
            type: '',
            SLineType: '',
        });
    }

    SLineChange = () => {
        this.setState({
            etype: 'sline',
            SLineType: 'primary',
            type: '',
            lineType: '',
        });
    }
    //测量图表配置项
    getOption = (datas) => {
        let param = {
            emunit: '',
            infoConfig: '',
            dataList: [],
            text: '',
            seriesname: ''
        }
        let xData = [];
        let yData = [];
        if (datas) {
            let timestamp = datas && datas.map((item) => {
                let timestamp = moment(new Date(parseInt(item.timestamp))).format("YYYY-MM-DD HH:mm:ss").substr(11);
                xData.push(timestamp);
                yData.push(item.value);
            })
        }

        if (this.state.what == "temperature") {
            param = {
                emunit: "℃",
                infoConfig: "温度配置",
                dataList: ['最高温度', '最低温度'],
                text: '温度传输日志',
                seriesname: '气温'
            }

        } else if (this.state.what == "battery") {
            param = {
                emunit: "%",
                infoConfig: "电量配置",
                dataList: ['最大电量', '最小电量'],
                text: '电量传输日志',
                seriesname: '电量'
            }
        } else if (this.state.what == "light") {
            param = {
                emunit: "Lx",
                infoConfig: "光照度配置",
                dataList: ['最强光照', '最弱光照'],
                text: '光照传输日志',
                seriesname: '光照'
            }

        } else if (this.state.what == "humidity") {
            param = {
                emunit: "RH",
                infoConfig: "湿度配置",
                dataList: ['最大湿度', '最小湿度'],
                text: '湿度传输日志',
                seriesname: '湿度'
            }
        }

        const option = {
            tooltip: {
                trigger: 'axis'
            },
            title: {
                x: 13,
                top: 20,
                text: param.text,
                textStyle: {
                    fontFamily: '"FZLanTing","Microsoft YaHei","helvetica","simsun"',
                    fontSize: 18,
                    fontWeight: 'bold',
                    color: '#000'
                }
            },
            color: ['#34A3EC'],
            legend: {
            },
            calculable: true,
            toolbox: {
                show: false,
            },
            calculable: true,
            grid: {
                left: '3%',
                right: '4%',
                containLabel: true
            },
            xAxis: {
                type: 'category',
                axisLabel: {
                    //interval: '$scope.step',
                    rotate: 0
                },
                axisLine: {
                    lineStyle: {
                        width: 2
                    }
                },
                splitLine: {//终于找到了，背景图的内置表格中“边框”的颜色线条  这个是x跟y轴轴的线
                    show: true,
                    lineStyle: {
                        color: "#E2E2E2",
                        type: "solid",
                        width: 2
                    }
                },
                data: xData,
            },
            yAxis: {
                lineWidth: 3,
                type: 'value',
                axisLabel: {
                    formatter: '{value} ' + param.emunit
                },
                axisLine: {
                    lineStyle: {
                        width: 2
                    }
                },
                splitLine: {//终于找到了，背景图的内置表格中“边框”的颜色线条  这个是x跟y轴轴的线
                    show: false
                },
            },
            dataZoom: [
                {
                    show: true,
                    start: 94,
                    end: 100
                },
                {
                    type: 'inside',
                    start: 94,
                    end: 100
                },
                {
                    show: false,
                    yAxisIndex: 0,
                    filterMode: 'empty',
                    width: 30,
                    height: '80%',
                    showDataShadow: false,
                    left: '93%'
                }
            ],
        };
        if (this.state.etype == 'bar') {
            option.series = [
                {
                    name: param.seriesname,
                    type: 'bar',
                    data: yData,
                    barWidth: 10,
                    markPoint: {
                        data: [
                            { type: 'max', name: '最大值' },
                            { type: 'min', name: '最小值' }
                        ]
                    },
                    markLine: {
                        data: [
                            { type: 'average', name: '平均值' }
                        ]
                    }
                }
            ];
        } else if (this.state.etype == 'line') {
            option.xAxis.boundaryGap = false;
            /* boundaryGap : false,*/
            option.series = [
                {
                    name: param.seriesname,
                    type: 'line',
                    data: yData,
                    markPoint: {
                        data: [
                            { type: 'max', name: '最大值' },
                            { type: 'min', name: '最小值' }
                        ]
                    },
                    markLine: {
                        data: [
                            { type: 'average', name: '平均值' }
                        ]
                    }
                }
            ];
        } else if (this.state.etype == 'sline') {
            option.xAxis.boundaryGap = false;
            option.series = [
                {
                    name: param.seriesname,
                    type: 'line',
                    data: yData,
                    areaStyle: { normal: {} },
                    markPoint: {
                        data: [
                            { type: 'max', name: '最大值' },
                            { type: 'min', name: '最小值' }
                        ],
                        label: {
                            normal: {
                                show: true,
                                formatter: '{b}: {c}'
                            }
                        }
                    },
                    markLine: {
                        data: [
                            { type: 'average', name: '平均值' }
                        ]
                    }
                }
            ];
        }
        return option;
    }
    render() {
        const { state, commonState, location } = this.props;
        let meterListData = state.meterListData;

        const recordsListData = state.recordsListData;
        const list = recordsListData.list;

        if (meterListData != null) {
            meterListData = meterListData.list;
        }
        const { meterInfo } = this.state || '';
        const pointList = state.pointListData;
        const datas = pointList.datas;

        let id = location.search.substring(1);
        return (
            <div className="eam-tab-page">
                <div className="eam-content">
                    <Collapse bordered={false} defaultActiveKey={['1', '2', '3']}>
                        <Panel header={<span className="label">基本信息 <Icon type="caret-down" /></span>} key="1" style={this.customPanelStyle}>
                            <NewFormComponent
                                props={this.props}
                                commonState={commonState}
                            />
                        </Panel>
                        <Panel header={<span className="label">测点信息 <Icon type="caret-down" /></span>} key="2" style={this.customPanelStyle}>
                            <Table
                                rowKey="id"
                                loading={this.state.meterListLoading}
                                pagination={{
                                    showTotal: (total, range) => `当前第${range[0]}-${range[1]}条 / 共${total}条`,
                                    defaultPageSize: 5,
                                }}
                                dataSource={meterListData}
                                columns={this.meterListColumns}
                                // rowSelection={this.rowSelection}
                                bordered
                            />
                            <MyModal
                                title='详细信息'
                                ref={detailModal => this.detailModal = detailModal}
                                width={1200}
                            >
                                <Tabs defaultActiveKey="1">
                                    <TabPane tab="测点数据查询" key="1">
                                        <div>
                                            <div className="top-bar clearfix">
                                                <div className="list-tools-left pull-left">
                                                    <NewDateFormComponent wrappedComponentRef={DateForm => this.DateForm = DateForm} />
                                                </div>
                                                <div className="list-tools-right pull-right" >
                                                    <Button type="primary" size="large" onClick={this.getPoint}>运行</Button>
                                                </div>
                                            </div>
                                            <div className="eam-content">
                                                <Table
                                                    rowKey="id"
                                                    className="point-echarts"
                                                    pagination={false}
                                                    dataSource={datas}
                                                    columns={this.meterDetailColumns}
                                                    scroll={{ y: 240 }}
                                                />
                                            </div>
                                        </div>
                                    </TabPane>
                                    <TabPane tab="测点数据图表" key="2">
                                        <div>
                                            <div className="top-bar clearfix">
                                                <div className="list-tools-left pull-left">
                                                    <DatePicker
                                                        showTime
                                                        format="YYYY-MM-DD"
                                                        placeholder="日视图"
                                                        onChange={(value) => {
                                                        }}
                                                        onOk={(value) => {
                                                            this.dayChange(value)
                                                        }}
                                                    />
                                                    <MonthPicker
                                                        showTime
                                                        format="YYYY-MM"
                                                        placeholder="月视图"
                                                        onChange={(value) => {
                                                            this.monthChange(value)
                                                        }}
                                                        onOk={(value) => {

                                                        }}
                                                    />
                                                    <DatePicker
                                                        showTime
                                                        format="YYYY"
                                                        placeholder="年视图"
                                                        onChange={(onChange) => { }}
                                                        onOk={(value) => {
                                                            this.yearChange(value)
                                                        }}
                                                    />
                                                </div>
                                                <div className="list-tools-right pull-right">
                                                    <Button type="primary" size="large" >下载图表</Button>
                                                    <Button size="small" onClick={this.BarChange} type={this.state.type}>bar</Button>
                                                    <Button size="small" onClick={this.LineChange} type={this.state.lineType}>line</Button>
                                                    <Button size="small" onClick={this.SLineChange} type={this.state.SLineType}>sline</Button>
                                                </div>
                                            </div>
                                            <div className="eam-content">
                                                <ReactEcharts
                                                    option={this.getOption(datas)}
                                                    notMerge={true}
                                                    lazyUpdate={true}
                                                    theme={"theme_name"}
                                                />
                                            </div>
                                        </div>
                                    </TabPane>
                                </Tabs>
                            </MyModal>
                            <MyModal
                                title={'报警信息'}
                                width={1000}
                                loading={this.state.meterWarningListLoading}
                                ref={meterWarningModal => this.meterWarningModal = meterWarningModal}
                                meterInfo={this.props.state.meterInfo}
                                props={this.props}
                                onOk={this.meterWarningSave}
                                afterClose={this.meterWarningAfterClose}
                            >

                                <MeterWarningForm props={this.props} />

                            </MyModal>
                            <MyModal
                                title={`${this.state.meterEditData ? '编辑' : '新建'}测量点`}
                                ref={meterAddModal => this.meterAddModal = meterAddModal}
                                onOk={this.meterSave}
                                afterClose={this.meterAfterClose}
                            >
                                <MeterForm data={this.state.meterEditData} ref={meterAddForm => this.meterAddForm = meterAddForm} />
                                <div className="modal-footer clearfix">
                                    <Button type="primary" size="large" onClick={this.meterSave}>确定</Button>
                                </div>
                            </MyModal>
                            <div className="panel-tools-right">
                                {id ? <Button type="primary" size="large" onClick={this.meterAdd}>新建</Button> : ''}
                            </div>
                        </Panel>
                        <Panel header={<span className="label">关联工单<Icon type="caret-down" /></span>} key="3" style={this.customPanelStyle}>
                            <Table
                                rowKey="id"
                                loading={this.state.meterListLoading}
                                pagination={{
                                    showTotal: (total, range) => `当前第${range[0]}-${range[1]}条 / 共${total}条`,
                                    defaultPageSize: 5,
                                }}
                                dataSource={list}
                                columns={this.columns}
                                // rowSelection={this.rowSelection}
                                bordered
                            />
                        </Panel>
                    </Collapse>
                </div>
            </div>
        )
    }
}
const EnvironmentAssetDetailForm = Form.create()(EnvironmentAssetDetailComponent);

function mapStateToProps(state) {
    return {
        state: state.environmental,
        commonState: state.common
    }
}

function buildActionDispatcher(dispatch) {
    return {
        actions: bindActionCreators(actions, dispatch),
        commonActions: bindActionCreators(commonActions, dispatch),
    }
}


export default connect(mapStateToProps, buildActionDispatcher)(EnvironmentAssetDetailComponent);
