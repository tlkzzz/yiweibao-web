/** 
 * @Description
 */
import React from 'react';
import {bindActionCreators} from 'redux';
import {browserHistory} from 'react-router';
import {connect} from 'react-redux';
import actions from '../../actions/patrol.js';
import commonActions from '../../actions/common.js';
import {createForm} from 'rc-form';

import SelectPublic from '../../components/common/select_public.js';

import EAMModal from '../../components/common/modal.js';

import {
    Icon,
    Button,
    Table,
    Pagination,
    Collapse,
    Form,
    Input,
    Row,
    Col,
    Select,
    Radio,
    DatePicker,
    Menu,
    notification,
    InputNumber,
    message,
    Modal
} from 'antd';
const Panel = Collapse.Panel;
const FormItem = Form.Item;
const Option = Select.Option;

import moment from 'moment';
class FormComponent extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            selectRouteShow: false,
        }

        this.selectRouteColumns = [
            {
                title: '编码',
                dataIndex: 'patrolRouteNum',
                key: 'patrolRouteNum',
                sorter: true,
            },
            {
                title: '描述',
                dataIndex: 'description',
                key: 'description',
                sorter: true,
            },
            {
                title: '状态',
                dataIndex: 'statusDescription',
                key: 'status',
                sorter: true,
            },
            {
                title: '站点',
                dataIndex: 'site',
                key: 'site',
                sorter: true,
            }
        ];
    }

    selectCode = (stateAttr) => {
        this.setState({[stateAttr]: true});
    }

    componentDidUpdate() {
        const {form, parentProps} = this.props;
        const {state, actions} = parentProps;
        if (!state.getFormValues) {
            actions.getFormValues(true);
            form.validateFields((err, values) => {
                if (err) {
                    for (let attr in err) {
                        /*notification.warning({
                            message: '提示',
                            description: err[attr].errors[0].message
                        });*/
                        message.warning(err[attr].errors[0].message)
                        break;
                    }
                } else {
                    actions.getFormValues(values);
                }
            });
        }
    }

    componentWillMount() {
        const {parentProps} = this.props;
        const {commonActions, commonState} = parentProps;
        const domainValueParam = {
            orgId: commonState.orgId,
            siteId: commonState.siteId,
            prodId: 'EAM'
        }
        commonActions.getDomainValue(domainValueParam, 'patrolType', 'PATROL_TYPE');
        commonActions.getDomainValue(domainValueParam, 'patrolPlanStatus', 'PATROL_PLAN_STATUS');
    }

    render() {
        let {data, editable, parentProps} = this.props;
        let {state, commonState, location} = parentProps;
        const {getFieldDecorator} = this.props.form;
        const isAddPlan = location.query.add_plan;
        const patrolTypeData = commonState.patrolTypeData,
            planStatusData = commonState.planStatusData
        if (JSON.stringify(data) === '[]') data = {};
        const nowDate = moment(moment().format('YYYY-MM-DD'));
        return (
            <div>
                <Form layout="vertical">
                    <Row gutter={16} justify="start">
                        <Col className="gutter-row" sm={{span: 0}}>
                            <FormItem
                                label="巡检计划id"
                            >
                                {
                                    getFieldDecorator('id', {
                                        initialValue: data.id
                                    })(
                                        <Input disabled/>
                                    )
                                }
                            </FormItem>
                        </Col>
                        <Col className="gutter-row" sm={{span: 0}}>
                            <FormItem
                                label="创建时间"
                            >
                                {
                                    getFieldDecorator('createtime', {
                                        initialValue: data.createtime
                                    })(
                                        <Input disabled/>
                                    )
                                }
                            </FormItem>
                        </Col>
                        <Col className="gutter-row" sm={{span: 0}}>
                            <FormItem
                                label="站点id"
                            >
                                {
                                    getFieldDecorator('siteId', {
                                        initialValue: isAddPlan ? commonState.siteId : data.siteId
                                    })(
                                        <Input />
                                    )
                                }
                            </FormItem>
                        </Col>
                        <Col className="gutter-row" sm={{span: 0}}>
                            <FormItem
                                label="组织id"
                            >
                                {
                                    getFieldDecorator('orgId', {
                                        initialValue: isAddPlan ? commonState.orgId : data.orgId
                                    })(
                                        <Input />
                                    )
                                }
                            </FormItem>
                        </Col>
                        <Col className="gutter-row" sm={{span: 0}}>
                            <FormItem
                                label="巡检路线id"
                            >
                                {
                                    getFieldDecorator('patrolRouteId', {
                                        initialValue: this.state.patrolRouteId ? this.state.patrolRouteId : data.patrolRouteId
                                    })(
                                        <Input />
                                    )
                                }
                            </FormItem>
                        </Col>
                        <Col className="gutter-row" xs={{span: 0}}>
                            <FormItem
                                label="计划类型编码"
                            >
                                {
                                    getFieldDecorator('type', {
                                        initialValue: this.state.type ? this.state.type : data.type
                                    })(
                                        <Input disabled/>
                                    )
                                }
                            </FormItem>
                        </Col>
                        <Col className="gutter-row" sm={{span: 5}}>
                            <FormItem
                                label="计划编号"
                            >
                                {
                                    getFieldDecorator('patrolPlanNum', {
                                        initialValue: isAddPlan ? state.planCode : data.patrolPlanNum
                                    })(
                                        <Input disabled/>
                                    )
                                }
                            </FormItem>
                        </Col>
                        <Col className="gutter-row" sm={{span: 9}}>
                            <FormItem
                                label="计划描述"
                            >
                                {
                                    getFieldDecorator('description', {
                                        initialValue: data.description,
                                        rules: [{required: true, message: '计划描述不能为空!'}]
                                    })(
                                        <Input />
                                    )
                                }
                            </FormItem>
                        </Col>
                        <Col className="gutter-row" sm={{span: 3}}>
                            <FormItem
                                label="状态"
                            >
                                {
                                    getFieldDecorator('status', {
                                        initialValue: data.status ? data.status : (planStatusData[0] && planStatusData[0].value)
                                    })(
                                        <Select size="large" style={{width: '100%'}} disabled={!editable}>
                                            {
                                                planStatusData.map((item, i) => <Option key={i}
                                                                                        value={item.value}>{item.description}</Option>)
                                            }
                                        </Select>
                                    )
                                }
                            </FormItem>
                        </Col>
                        <Col className="gutter-row" sm={{span: 6}}>
                            <FormItem
                                label="组织"
                            >
                                {
                                    getFieldDecorator('org', {
                                        initialValue: isAddPlan ? commonState.orgName : data.org
                                    })(
                                        <Input disabled/>
                                    )
                                }
                            </FormItem>
                        </Col>
                    </Row>
                    <Row gutter={16} justify="start">
                        <Col className="gutter-row" sm={{span: 5}}>
                            <FormItem
                                label="路线编码"
                            >
                                {
                                    getFieldDecorator('patrolRouteNum', {
                                        initialValue: this.state.patrolRouteNum ? this.state.patrolRouteNum : data.patrolRouteNum,
                                        rules: [{required: true, message: '路线编码不能为空!'}]
                                    })(
                                        <Input onClick={() => {
                                            this.selectCode('selectRouteShow')
                                        }} readOnly disabled={!editable}/>
                                    )
                                }
                            </FormItem>
                        </Col>
                        <Col className="gutter-row" sm={{span: 9}}>
                            <FormItem
                                label="路线描述"
                            >
                                {
                                    getFieldDecorator('patrolRouteDsr', {
                                        initialValue: this.state.patrolRouteDsr ? this.state.patrolRouteDsr : data.patrolRouteDsr
                                    })(
                                        <Input disabled/>
                                    )
                                }
                            </FormItem>
                        </Col>
                        <Col className="gutter-row" sm={{span: 3}}>
                            <FormItem
                                label="状态日期"
                            >
                                {
                                    getFieldDecorator('statusdate', {
                                        initialValue: data.length ? data.statusdate : nowDate
                                    })(
                                        <DatePicker
                                            disabled
                                            showTime
                                            format="YYYY-MM-DD"
                                            placeholder="Select Time"
                                            onChange={(onChange) => {
                                            }}
                                            onOk={(onOk) => {
                                            }}
                                        />
                                    )
                                }
                            </FormItem>
                        </Col>
                        <Col className="gutter-row" sm={{span: 6}}>
                            <FormItem
                                label="站点"
                            >
                                {
                                    getFieldDecorator('site', {
                                        initialValue: isAddPlan ? commonState.siteName : data.site
                                    })(
                                        <Input disabled/>
                                    )
                                }
                            </FormItem>
                        </Col>
                    </Row>
                    <Row gutter={16} justify="start">
                        <Col className="gutter-row" xs={{span: 5}}>
                            <FormItem
                                label="计划类型"
                            >
                                {
                                    getFieldDecorator('typeDescription', {
                                        initialValue: this.state.typeDescription ? this.state.typeDescription : data.typeDescription
                                    })(
                                        <Input disabled/>
                                    )
                                }
                            </FormItem>
                        </Col>
                        <Col className="gutter-row" xs={{span: 9}} offset={9}>
                            <FormItem
                                label="备注"
                            >
                                {
                                    getFieldDecorator('remark', {
                                        initialValue: data.remark
                                    })(
                                        <Input />
                                    )
                                }
                            </FormItem>
                        </Col>
                    </Row>
                </Form>
                <SelectPublic
                    fetch={{
                        url: "/eam/open/patrolRoute/findPage",
                        type: 'post',
                        data: {
                            pageNum: 1,
                            pageSize: 5,
                        },
                        actionsType: 'ROUTE_GET_LIST'
                    }}
                    stateAttr="routeListData"
                    width={1200}
                    modalHide={() => {
                        this.setState({selectRouteShow: false})
                    }}
                    columns={this.selectRouteColumns}
                    visible={this.state.selectRouteShow}
                    onOk={record => {
                        this.setState({
                            patrolRouteId: record.id,
                            patrolRouteNum: record.patrolRouteNum,
                            patrolRouteDsr: record.description,
                            type: record.type,
                            typeDescription: record.typeDescription
                        })
                    }}
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
    localStorage.setItem('plan_edit_flag', true);
    let tmp = Object.assign({}, JSON.parse(localStorage.getItem('plan_edit')), values);
    localStorage.setItem('plan_edit', JSON.stringify(tmp));
}})(FormComponent)

// 频率新建表单
class FrequencyFormComponent extends React.Component {
    constructor(props) {
        super(props);
        this.formItemLayout = {
            labelCol: {
                xs: {span: 24},
                sm: {span: 6},
            },
            wrapperCol: {
                xs: {span: 24},
                sm: {span: 14},
            },
        };
    }

    render() {
        const {form, data} = this.props;
        const {getFieldDecorator} = form;

        return (
            <Form>
                <FormItem
                    {...this.formItemLayout}
                    label="频率"
                >
                    {
                        getFieldDecorator('frequency', {
                            initialValue: data ? data.frequency : '',
                            rules: [{required: true, message: '文本不能为空'}],
                        })(
                            <InputNumber style={{width: '100%'}} min={0} step={0.01}/>
                        )
                    }
                </FormItem>
                <FormItem
                    {...this.formItemLayout}
                    label="频率单位"
                >
                    {
                        getFieldDecorator('unit', {
                            initialValue: data ? data.unit : '',
                            rules: [{required: true, message: '文本不能为空'}],
                        })(
                            <Select size="large" style={{width: '100%'}}>
                                <Option value="天">天</Option>
                                <Option value="周">周</Option>
                                <Option value="月">月</Option>
                                <Option value="年">年</Option>
                            </Select>
                        )
                    }
                </FormItem>
                <FormItem
                    {...this.formItemLayout}
                    label="下次生成日期"
                >
                    {
                        getFieldDecorator('nextdate', {
                            initialValue: data ? moment(moment(data.nextdate).format("YYYY-MM-DD HH:00")) : '',
                            rules: [{required: true, message: '文本不能为空'}],
                        })(
                            <DatePicker
                                showTime
                                format="YYYY-MM-DD HH:mm"
                                placeholder="Select Time"
                                onChange={() => {
                                }}
                                onOk={() => {
                                }}
                            />
                        )
                    }
                </FormItem>
            </Form>
        )
    }
}
const NewFrequencyForm = Form.create()(FrequencyFormComponent);
class PlanOneComponent extends React.Component {
    constructor(props) {
        super(props);

        this.props.router.setRouteLeaveHook(
            this.props.route,
            this.routerWillLeave.bind(this)
        );
        this.onBeforeUnload = (event) => {
            const isEdited = JSON.parse(localStorage.getItem('plan_edit_flag'));
            if (isEdited) {
                let confirmationMessage = '当前页面已修改，是否确认离开？';

                (event || window.event).returnValue = confirmationMessage; // Gecko and Trident
                return confirmationMessage; // Gecko and WebKit
            }
            return "\o/";
        };

        //注册刷新事件，当页面刷新时，缓存页面数据
        window.addEventListener('beforeunload', this.onBeforeUnload);

        this.state = {
            modalShow: false,
            currentPage: 1,
            frequencyLoading: false,
            frequencyEditData: '',
            editable: false,
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

        // 频率表格字段
        this.frequencyColumns = [
            {
                title: '序号',
                dataIndex: 'step',
                key: 'step',
                render: (text, record, key) => {
                    const step = parseInt(key) + 1
                    record.step = step;
                    return (
                        <p>{step}</p>
                    )
                }
            },
            {
                title: '频率',
                dataIndex: 'frequency',
                key: 'frequency',
                render: defaultRender
            },
            {
                title: '频率单位',
                dataIndex: 'unit',
                key: 'unit',
                render: defaultRender
            },
            {
                title: '下次生成日期',
                dataIndex: 'nextdate',
                key: 'nextdate',
                render: (text, record, key) => {
                    return (
                        <p>{text ? moment(text).format("YYYY-MM-DD HH:00:00") : '-'}</p>
                    )
                }
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
                                    this.frequencyDel(record);
                                }}
                            />
                            <Icon type="edit"
                                  onClick={() => {
                                      this.frequencyEdit(record);
                                  }}
                            />
                        </div>
                    )
                }
            },
        ];
        const {location} = this.props;

        const isAddPlan = location.query.add_plan;

        this.frequencyParam = {
            id: isAddPlan ? '' : JSON.parse(localStorage.getItem('plan')).id,
            pageNum: 1,
            pageSize: 998,
        }
        this.localPlan = JSON.parse(localStorage.getItem('plan'));
    }

    pageChange = () => {

    }
    // 频率列表（频率）
    frequencyGetList = () => {
        const {actions} = this.props;
        this.setState({
            frequencyLoading: true,
        });
        actions.updatePlanList(this.frequencyParam, () => {
            this.setState({
                frequencyLoading: false,
            });
        });
    }
    // 新建频率
    frequencyAdd = () => {
        this.setState({frequencyEditData: ''});
        this.frequencyAddModal.modalShow();
    }

    // 保存新建/编辑频率
    frequencyAddSave = () => {
        let {actions} = this.props;
        let editJson = this.state.frequencyEditData;

        this.frequencyAddForm.validateFields((err, values) => {
            if (err) return;
            values.id = editJson.id;
            values.nextdate = values.nextdate.format('YYYY-MM-DD HH:mm:ss');
            actions.updatePlanList([editJson ? 'FREQUENCY_EDIT' : 'FREQUENCY_ADD', [values]]);
        });

        this.frequencyAddModal.modalHide();
    }
    // 编辑频率
    frequencyEdit = (record) => {
        this.setState({frequencyEditData: record});
        this.frequencyAddModal.modalShow();
    }
    // 删除频率
    frequencyDel = (record) => {
        let {actions} = this.props;
        actions.updatePlanList(['FREQUENCY_DEL', record]);
    }
    frequencyAfterClose = () => {
        this.frequencyAddForm.resetFields();
    }

    componentWillMount() {
        const {actions, location, commonState} = this.props;
        const isAddPlan = location.query.add_plan;
        if (this.localPlan) {
            this.frequencyGetList();
            this.setState({editable: false});
        }
        //新建空白页面
        if (isAddPlan || !this.localPlan) {
            this.setState({editable: true});
            actions.getCode({modelKey: 'patrolplan', siteId: commonState.siteId}, "GET_PLAN_CODE")
        }
    }

    routerWillLeave(nextLocation) {
        const { location } = this.props;
        if (!nextLocation.pathname.startsWith(location.pathname.substring(0, location.pathname.length - 1))) {
            //切换其它页面
            const isEdited = JSON.parse(localStorage.getItem('plan_edit_flag'));
            if (isEdited) {
                const confirm = Modal.confirm;
                confirm({
                    title: '提示',
                    content: '当前页面已修改，是否确认离开？',
                    onOk() {
                        localStorage.removeItem('plan_edit_flag');
                        localStorage.removeItem('plan_edit');
                        browserHistory.push(nextLocation.pathname);
                    }
                });
                return false;
            } else {
                localStorage.removeItem('plan_edit_flag');
                localStorage.removeItem('plan_edit');
            }
        }
    }

    render() {
        const {state, location} = this.props;
        const frequencyData = state.frequencyListData || [];
        // 频率数据
        const frequencyList = frequencyData.patrolPlanFrequencyVoList || [];
        console.log('===========================');
        console.log('频率-新增的数据。。 -> ', frequencyData.newFrequencyList);
        console.log('频率-删除的原数据。 -> ', frequencyData.delOriginalDataId);
        console.log('===========================');

        return (
            <div className="eam-tab-page">
                <div className="eam-content">
                    <Collapse bordered={false} defaultActiveKey={['1', '2', '3']}>
                        <Panel header={<span className="label">基本信息 <Icon type="caret-down"/></span>} key="1"
                               style={this.customPanelStyle}>
                            <NewForm data={frequencyData} editable={this.state.editable} parentProps={{...this.props}}/>
                        </Panel>
                        <Panel header={<span className="label">频率 <Icon type="caret-down"/></span>} key="2"
                               style={this.customPanelStyle}>
                            <Table
                                rowKey="id"
                                loading={this.state.frequencyLoading}
                                pagination={{
                                    showTotal: (total, range) => `当前第${range[0]}-${range[1]}条 / 共${total}条`,
                                    defaultPageSize: 5,
                                }}
                                dataSource={frequencyList}
                                columns={this.frequencyColumns}
                                bordered
                            />
                            <div className="panel-tools-right">
                                <Button type="primary" size="large" onClick={this.frequencyAdd}>新建</Button>
                            </div>
                        </Panel>
                    </Collapse>
                </div>
                <EAMModal
                    title={`${this.state.frequencyEditData ? '编辑' : '新建'}频率`}
                    ref={frequencyAddModal => this.frequencyAddModal = frequencyAddModal}
                    afterClose={this.frequencyAfterClose}
                >
                    <NewFrequencyForm data={this.state.frequencyEditData}
                                      ref={frequencyAddForm => this.frequencyAddForm = frequencyAddForm}/>
                    <div className="modal-footer clearfix">
                        <Button size="large" onClick={() => {
                            this.frequencyAddModal.modalHide()
                        }}>取消</Button>
                        <Button type="primary" size="large" onClick={this.frequencyAddSave}>确定</Button>
                    </div>
                </EAMModal>
            </div>
        )
    }
}


function mapStateToProps(state) {
    return {
        state: state.patrol,
        commonState: state.common
    }
}

function buildActionDispatcher(dispatch) {
    return {
        actions: bindActionCreators(actions, dispatch),
        commonActions: bindActionCreators(commonActions, dispatch),
    }
}

export default connect(mapStateToProps, buildActionDispatcher)(PlanOneComponent);