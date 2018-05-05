/** 
 * @Description
 */
import React from 'react';
import {bindActionCreators} from 'redux';
import { browserHistory } from 'react-router';
import {connect} from 'react-redux';
import actions from '../../actions/patrol.js';
import commonActions from '../../actions/common.js';
import {createForm} from 'rc-form';
import EAMModal from '../../components/common/modal.js';

import {filterArrByAttr} from '../../tools/';

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
    message,
    Modal
} from 'antd';
const Panel = Collapse.Panel;
const FormItem = Form.Item;

import moment from 'moment';
class FormComponent extends React.Component {
    constructor(props) {
        super(props);

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
        commonActions.getDomainValue(domainValueParam, 'patrolRouteStatus', 'PATROL_ROUTE_STATUS');
    }

    render() {
        let {data, editable, parentProps} = this.props;
        let {state, commonState, location} = parentProps;
        const {getFieldDecorator} = this.props.form;
        const isAddRoute = location.query.add_route;

        const patrolTypeData = commonState.patrolTypeData,
            routeStatusData = commonState.routeStatusData

        if (JSON.stringify(data) === '[]') data = {};

        const nowDate = moment(moment().format('YYYY-MM-DD'));
        return (
            <Form layout="vertical">
                <Row gutter={16} justify="start">
                    <Col className="gutter-row" sm={{span: 0}}>
                        <FormItem
                            label="巡检点id"
                        >
                            {
                                getFieldDecorator('id', {
                                    initialValue: data.id
                                })(
                                    <Input  disabled/>
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
                                    <Input  disabled/>
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
                                    initialValue: isAddRoute ? commonState.orgId : data.orgId
                                })(
                                    <Input />
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
                                    initialValue: isAddRoute ? commonState.siteId : data.siteId
                                })(
                                    <Input />
                                )
                            }
                        </FormItem>
                    </Col>
                    <Col className="gutter-row" sm={{span: 5}}>
                        <FormItem
                            label="路线编码"
                        >
                            {
                                getFieldDecorator('patrolRouteNum', {
                                    initialValue: isAddRoute ? state.routeCode : data.patrolRouteNum
                                })(
                                    <Input  disabled/>
                                )
                            }
                        </FormItem>
                    </Col>
                    <Col className="gutter-row" sm={{span: 9}}>
                        <FormItem
                            label="路线描述"
                        >
                            {
                                getFieldDecorator('description', {
                                    initialValue: data.description,
                                    rules: [{required: true, message: '路线描述不能为空!'}]
                                })(
                                    <Input />
                                )
                            }
                        </FormItem>
                    </Col>
                    <Col className="gutter-row" sm={{span: 6}}>
                        <FormItem
                            label="状态"
                        >
                            {
                                getFieldDecorator('status', {
                                    initialValue: data.status ? data.status : (routeStatusData[0] && routeStatusData[0].value)
                                })(
                                    <Select size="large" style={{width: '100%'}} disabled={!editable}>
                                        {
                                            routeStatusData.map((item, i) => <Option key={i}
                                                                                     value={item.value}>{item.description}</Option>)
                                        }
                                    </Select>
                                )
                            }
                        </FormItem>
                    </Col>
                    <Col className="gutter-row" sm={{span: 4}}>
                        <FormItem
                            label="组织"
                        >
                            {
                                getFieldDecorator('org', {
                                    initialValue: isAddRoute ? commonState.orgName : data.org
                                })(
                                    <Input  disabled/>
                                )
                            }
                        </FormItem>
                    </Col>
                </Row>
                <Row gutter={16} justify="start">
                    <Col className="gutter-row" sm={{span: 5}}>
                        <FormItem
                            label="路线类型"
                        >
                            {
                                getFieldDecorator('type', {
                                    initialValue: data.type ? data.type : (patrolTypeData[0] && patrolTypeData[0].value)
                                })(
                                    <Select size="large" style={{width: '100%'}}>
                                        {
                                            patrolTypeData.map((item, i) => <Option key={i}
                                                                                    value={item.value}>{item.description}</Option>)
                                        }
                                    </Select>
                                )
                            }
                        </FormItem>
                    </Col>
                    <Col className="gutter-row" sm={{span: 9}}>
                        <FormItem
                            label="备注说明"
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

                    <Col className="gutter-row" sm={{span: 6}}>
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
                    <Col className="gutter-row" sm={{span: 4}}>
                        <FormItem
                            label="站点"
                        >
                            {
                                getFieldDecorator('site', {
                                    initialValue: isAddRoute ? commonState.siteName : data.site
                                })(
                                    <Input  disabled/>
                                )
                            }
                        </FormItem>
                    </Col>
                </Row>
            </Form>
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
    localStorage.setItem('route_edit_flag', true);
    let tmp = Object.assign({}, JSON.parse(localStorage.getItem('route_edit')), values);
    localStorage.setItem('route_edit', JSON.stringify(tmp));
}})(FormComponent)

// 巡检点新建表单
class RouteFormComponent extends React.Component {
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
                    label="巡检项"
                >
                    {
                        getFieldDecorator('description', {
                            initialValue: data ? data.description : '',
                            rules: [{required: true, message: '文本不能为空'}],
                        })(
                            <Input style={{width: '100%'}}/>
                        )
                    }
                </FormItem>
            </Form>
        )
    }
}
const NewRouteForm = Form.create()(RouteFormComponent);
class RouteInfoComponent extends React.Component {
    constructor(props) {
        super(props);

        this.props.router.setRouteLeaveHook(
            this.props.route,
            this.routerWillLeave.bind(this)
        );
        this.onBeforeUnload = (event) => {
            const isEdited = JSON.parse(localStorage.getItem('route_edit_flag'));
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
            pointAddLoading: false,
            pointEditData: '',
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

        // 巡检点表格字段
        this.pointColumns = [
            {
                title: '序号',
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
                title: '巡检点编码',
                dataIndex: 'patrolnum',
                key: 'patrolnum',
                sorter: true,
                render: defaultRender
            },
            {
                title: '巡检点描述',
                dataIndex: 'description',
                key: 'description',
                sorter: true,
                render: defaultRender
            },
            {
                title: '描述说明',
                dataIndex: 'descriptions',
                key: 'descriptions',
                sorter: true,
                render: defaultRender
            },
            {
                title: '注意事项',
                dataIndex: 'remark',
                key: 'remark',
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
                                    this.pointDel(record);
                                }}
                            />
                        </div>
                    )
                }
            },
        ];
        //多选巡检点表格字段
        this.pointAddColumns = [
            {
                title: '巡检点编码',
                dataIndex: 'patrolnum',
                key: 'patrolnum',
                sorter: true,
                render: defaultRender
            },
            {
                title: '巡检点描述',
                dataIndex: 'description',
                key: 'description',
                sorter: true,
                render: defaultRender
            },
            {
                title: '状态',
                dataIndex: 'statusDescription',
                key: 'status',
                sorter: true,
                render: defaultRender
            },
            {
                title: '站点',
                dataIndex: 'site',
                key: 'site',
                sorter: true,
                render: defaultRender
            },
        ];

        const {location} = this.props;

        const isAddRoute = location.query.add_route;

        this.pointAddRowSelection = {
            onChange: (selectedRowKeys, selectedRows) => {
                //新建巡检点勾选的数据
                this.pointAddSelectedRows = selectedRows;
            },
        };
        this.pointParam = {
            id: isAddRoute ? '' : JSON.parse(localStorage.getItem('route')).id,
            pageNum: 1,
            pageSize: 998,
        }

        this.localRoute = JSON.parse(localStorage.getItem('route'));
    }

    pageChange = () => {

    }
    // 任务分派列表（任务步骤、巡检点）
    pointGetList = () => {
        const {actions} = this.props;
        this.setState({
            pointLoading: true,
        });
        actions.updateRouteList(this.pointParam, () => {
            this.setState({
                pointLoading: false,
            });
        });
    }
    // 新增巡检点
    pointAdd = () => {
        const {actions, state, commonState} = this.props;
        let typeArr = [];
        let type = this.routeForm.props.form.getFieldValue("type")
        typeArr.push(type)
        this.setState({pointAddLoading: true});
        let ids = state.routePointListData.patrolPointVoList ? filterArrByAttr(state.routePointListData.patrolPointVoList, 'id').join(',') : '';

        const param = {
            orgId: commonState.orgId,
            siteId: commonState.siteId,
            pageNum: 1,
            pageSize: 10,
            patrolRouteId: this.pointParam.id,
            type: typeArr,
            ids
        };

        actions.pointAddGetList(param, () => {
            this.setState({pointAddLoading: false});
        });
        this.pointAddModal.modalShow();
    }

    // 保存新建/编辑巡检项
    pointAddSave = () => {
        const {actions} = this.props;
        actions.updateRouteList(['ROUTE_POINT_STEPS_ADD', this.pointAddSelectedRows]);
        this.pointAddModal.modalHide();
    }

    // 删除关联巡检点
    pointDel = (record) => {
        let {actions} = this.props;
        actions.updateRouteList(['ROUTE_POINT_STEPS_DEL', record]);
    }

    pointAfterClose = () => {
        this.pointAddForm.resetFields();
    }
    //表格事件
    tableChange = (pagination, filters, sorter) => {
        if (sorter.order) {
            let sorterOrder = sorter.order;
            let endIndex = sorterOrder.indexOf('end');
            sorterOrder = sorterOrder.slice(0, endIndex);
            this.pointParam.sorts = `${sorter.columnKey} ${sorterOrder}`;
        } else {
            this.pointParam.sorts = '';
        }
        this.pointGetList();
    }

    componentWillMount() {  //获取 url 里面的参数  初始化数据
        const {actions, location, commonState} = this.props;
        const isAddRoute = location.query.add_route;
        if (this.localRoute) {
            this.pointGetList();
            this.setState({editable: false});
        }
        //新建空白页面
        if (isAddRoute || !this.localRoute) {
            this.setState({editable: true});
            actions.getCode({
                modelKey: 'patrolroute',
                siteId: commonState.siteId
            }, "GET_ROUTE_CODE")
        }
    }

    routerWillLeave(nextLocation) {
        const { location } = this.props;
        if (!nextLocation.pathname.startsWith(location.pathname.substring(0, location.pathname.length - 1))) {
            //切换其它页面
            const isEdited = JSON.parse(localStorage.getItem('route_edit_flag'));
            if (isEdited) {
                const confirm = Modal.confirm;
                confirm({
                    title: '提示',
                    content: '当前页面已修改，是否确认离开？',
                    onOk() {
                        localStorage.removeItem('route_edit_flag');
                        localStorage.removeItem('route_edit');
                        browserHistory.push(nextLocation.pathname);
                    }
                });
                return false;
            } else {
                localStorage.removeItem('route_edit_flag');
                localStorage.removeItem('route_edit');
            }
        }
    }

    render() {
        const {state} = this.props;

        const pointData = state.routePointListData;
        // 检查项数据
        const pointList = pointData.patrolPointVoList;

        // 巡检点新建列表数据
        const pointAddData = state.pointAddListData;
        const pointAddList = pointAddData.list;

        console.log('===========================');
        console.log('任务步骤-新增的数据。。 -> ', pointData.newpointList);
        console.log('任务步骤-删除的原数据。 -> ', pointData.delOriginalDataId);
        console.log('===========================');

        return (
            <div className="eam-tab-page">
                <div className="eam-content">
                    <Collapse bordered={false} defaultActiveKey={['1', '2', '3']}>
                        <Panel header={<span className="label">基本信息 <Icon type="caret-down"/></span>} key="1"
                               style={this.customPanelStyle}>
                            <NewForm data={pointData} editable={this.state.editable} parentProps={{...this.props}}
                                     wrappedComponentRef={routeForm => this.routeForm = routeForm}/>
                        </Panel>
                        <Panel header={<span className="label">巡检点 <Icon type="caret-down"/></span>} key="2"
                               style={this.customPanelStyle}>
                            <Table
                                rowKey="id"
                                loading={this.state.pointLoading}
                                pagination={{
                                    showTotal: (total, range) => `当前第${range[0]}-${range[1]}条 / 共${total}条`,
                                    defaultPageSize: 5,
                                }}
                                dataSource={pointList}
                                columns={this.pointColumns}
                                bordered
                            />
                            <div className="panel-tools-right">
                                <Button type="primary" size="large" onClick={this.pointAdd}>新建</Button>
                            </div>
                        </Panel>
                    </Collapse>
                </div>
                <EAMModal
                    title={`多选巡检点`}
                    ref={pointAddModal => this.pointAddModal = pointAddModal}
                    width={1200}
                >
                    <Table
                        rowSelection={this.pointAddRowSelection}
                        loading={this.state.pointAddLoading}
                        rowKey="id"
                        dataSource={pointAddList}
                        columns={this.pointAddColumns}
                        bordered
                    />
                    <div className="modal-footer clearfix">
                        <Button size="large" onClick={() => {
                            this.pointAddModal.modalHide()
                        }}>取消</Button>
                        <Button type="primary" size="large" onClick={this.pointAddSave}>确定</Button>
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

export default connect(mapStateToProps, buildActionDispatcher)(RouteInfoComponent);