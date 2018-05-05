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

import {filterArrByAttr, correspondenceJson, msFormat} from '../../tools/';

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
    Timeline,
    notification,
    message,
    Modal
} from 'antd';
const Panel = Collapse.Panel;
const FormItem = Form.Item;


import moment from 'moment';

class FormComponent extends React.Component {
    constructor(props) {
        super(props)

        this.state = {
            selectPlanShow: false,
        }

        this.selectPlanColumns = [
            {
                title: '编码',
                dataIndex: 'patrolPlanNum',
                key: 'patrolPlanNum',
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
    }

    render() {

        let {data, editable, parentProps} = this.props;
        let {state, commonState, location} = parentProps;
        const {getFieldDecorator} = this.props.form;

        const isAddPatrolOrder = location.query.add_patrol_order;

        const patrolOrderTypeData = commonState.patrolTypeData;

        const nowDate = moment(moment().format('YYYY-MM-DD HH:mm:ss'));

        return (
            <div>
                <Form layout="vertical">
                    <Row gutter={16} justify="start">
                        <Col className="gutter-row" sm={{span: 0}}>
                            <FormItem
                                label="巡检工单id"
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
                                label="组织id"
                            >
                                {
                                    getFieldDecorator('orgId', {
                                        initialValue: isAddPatrolOrder ? commonState.orgId : data.orgId
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
                                        initialValue: isAddPatrolOrder ? commonState.siteId : data.siteId
                                    })(
                                        <Input />
                                    )
                                }
                            </FormItem>
                        </Col>
                        <Col className="gutter-row" style={{display: 'none'}}>
                            <FormItem
                                label="计划id"
                            >
                                {
                                    getFieldDecorator('patrolPlanId', {
                                        initialValue: this.state.patrolPlanId ? this.state.patrolPlanId : data.patrolPlanId
                                    })(
                                        <Input readOnly disabled={!editable}/>
                                    )
                                }
                            </FormItem>
                        </Col>
                        <Col className="gutter-row" xs={{span: 0}}>
                            <FormItem
                                label="创建人"
                            >
                                {
                                    getFieldDecorator('createPersonId', {
                                        initialValue: data.createPersonId || commonState.personId
                                    })(
                                        <Input disabled/>
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
                        <Col className="gutter-row" xs={{span: 3}}>
                            <FormItem
                                label="工单编码"
                            >
                                {
                                    getFieldDecorator('patrolOrderNum', {
                                        initialValue: isAddPatrolOrder ? state.orderCode : data.patrolOrderNum
                                    })(
                                        <Input disabled/>
                                    )
                                }
                            </FormItem>
                        </Col>
                        <Col className="gutter-row" xs={{span: 9}}>
                            <FormItem
                                label="工单描述"
                            >
                                {
                                    getFieldDecorator('description', {
                                        initialValue: data.description,
                                        rules: [{required: true, message: '巡检点描述不能为空!'}]
                                    })(
                                        <Input disabled={!editable}/>
                                    )
                                }
                            </FormItem>
                        </Col>
                        <Col className="gutter-row" xs={{span: 6}}>
                            <FormItem
                                label="状态"
                            >
                                {
                                    getFieldDecorator('statusName', {
                                        initialValue: isAddPatrolOrder ? '待提报' : (data.status && correspondenceJson.patrolOrder[data.status].text)
                                    })(
                                        <Input disabled/>
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
                                        initialValue: isAddPatrolOrder ? 'DTB' : data && data.status
                                    })(
                                        <Input disabled/>
                                    )
                                }
                            </FormItem>
                        </Col>
                        <Col className="gutter-row" xs={{span: 6}}>
                            <FormItem
                                label="组织"
                            >
                                {
                                    getFieldDecorator('org', {
                                        initialValue: isAddPatrolOrder ? commonState.orgName : data.org
                                    })(
                                        <Input disabled/>
                                    )
                                }
                            </FormItem>
                        </Col>
                    </Row>
                    <Row gutter={16} justify="start">
                        <Col className="gutter-row" xs={{span: 3}}>
                            <FormItem
                                label="巡检计划"
                            >
                                {
                                    getFieldDecorator('patrolPlanNum', {
                                        initialValue: this.state.patrolPlanNum ? this.state.patrolPlanNum : data.patrolPlanNum,
                                        rules: [{required: true, message: '巡检计划不能为空!'}]
                                    })(
                                        <Input onClick={() => {
                                            this.selectCode('selectPlanShow')
                                        }} readOnly disabled={!editable}/>
                                    )
                                }
                            </FormItem>
                        </Col>
                        <Col className="gutter-row" xs={{span: 9}}>
                            <FormItem
                                label="巡检计划描述"
                            >
                                {
                                    getFieldDecorator('patrolPlanDsr', {
                                        initialValue: this.state.patrolPlanDsr ? this.state.patrolPlanDsr : data.patrolPlanDsr
                                    })(
                                        <Input disabled/>
                                    )
                                }
                            </FormItem>
                        </Col>
                        <Col className="gutter-row" xs={{span: 6}}>
                            <FormItem
                                label="状态日期"
                            >
                                {
                                    getFieldDecorator('statusdate', {
                                        initialValue: data.statusdate ? moment(data.statusdate, 'YYYY-MM-DD HH:mm') : nowDate
                                    })(
                                        <DatePicker
                                            disabled
                                            showTime
                                            format="YYYY-MM-DD HH:mm:ss"
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
                        <Col className="gutter-row" xs={{span: 6}}>
                            <FormItem
                                label="站点"
                            >
                                {
                                    getFieldDecorator('site', {
                                        initialValue: isAddPatrolOrder ? commonState.siteName : data.site
                                    })(
                                        <Input disabled/>
                                    )
                                }
                            </FormItem>
                        </Col>
                    </Row>
                    <Row gutter={16} justify="start">
                        <Col className="gutter-row" xs={{span: 3}}>
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
                        <Col className="gutter-row" xs={{span: 9}}>
                            <FormItem
                                label="备注"
                            >
                                {
                                    getFieldDecorator('remark', {
                                        initialValue: data.remark
                                    })(
                                        <Input disabled={!editable}/>
                                    )
                                }
                            </FormItem>
                        </Col>
                        <Col className="gutter-row" xs={{span: 6}}>
                            <FormItem
                                label="创建人"
                            >
                                {
                                    getFieldDecorator('createPersonName', {
                                        initialValue: data.createPersonName || commonState.personName
                                    })(
                                        <Input disabled/>
                                    )
                                }
                            </FormItem>
                        </Col>
                        <Col className="gutter-row" xs={{span: 6}}>
                            <FormItem
                                label="创建时期"
                            >
                                {
                                    getFieldDecorator('createtime', {
                                        initialValue: data.createtime ? moment(data.createtime, 'YYYY-MM-DD HH:mm') : nowDate
                                    })(
                                        <DatePicker
                                            disabled
                                            showTime
                                            format="YYYY-MM-DD HH:mm:ss"
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
                    </Row>
                </Form>
                <SelectPublic
                    fetch={{
                        url: "/eam/open/patrolPlan/findPage",
                        type: 'post',
                        data: {
                            pageNum: 1,
                            pageSize: 5,
                        },
                        actionsType: 'PLAN_GET_LIST'
                    }}
                    stateAttr="planListData"
                    width={1200}
                    modalHide={() => {
                        this.setState({selectPlanShow: false})
                    }}
                    columns={this.selectPlanColumns}
                    visible={this.state.selectPlanShow}
                    onOk={record => {
                        this.setState({
                            patrolPlanId: record.id,
                            patrolPlanNum: record.patrolPlanNum,
                            patrolPlanDsr: record.description,
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
    localStorage.setItem('order_edit_flag', true);
    let tmp = Object.assign({}, JSON.parse(localStorage.getItem('order_edit')), values);
    localStorage.setItem('order_edit', JSON.stringify(tmp));
}})(FormComponent)

class OrderOneComponent extends React.Component {
    constructor(props) {
        super(props);
        this.props.router.setRouteLeaveHook(
            this.props.route,
            this.routerWillLeave.bind(this)
        );
        this.onBeforeUnload = (event) => {
            const isEdited = JSON.parse(localStorage.getItem('order_edit_flag'));
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

        const {location} = this.props;

        const isAddPatrolOrder = location.query.add_patrol_order;

        this.param = {
            id: isAddPatrolOrder ? '' : (localStorage.getItem('patrolOrder') && JSON.parse(localStorage.getItem('patrolOrder')).id),
            pageNum: 1,
            pageSize: 998,
        }

        this.localPatrolOrder = JSON.parse(localStorage.getItem('patrolOrder'));

    }

    // 工单提报获取数据
    patrolOrderCommitGetList = () => {
        const {actions} = this.props;
        this.setState({assetLoading: true});
        actions.patrolOrderCommitUpdateList(this.param, () => {
            this.setState({assetLoading: false});
        });
    }

    componentWillMount() {
        const {actions, location, commonState} = this.props;
        const isAddPatrolOrder = location.query.add_patrol_order;

        let index = location.pathname.lastIndexOf("/");
        const curProcess = location.pathname.substring(index + 1);
        // if (this.localPatrolOrder && this.localPatrolOrder.process >= curProcess) this.patrolOrderCommitGetList();


        if (this.localPatrolOrder) {
            if (this.localPatrolOrder.process == curProcess) {
                this.setState({editable: true});
            } else {
                this.setState({editable: false});
            }
            this.patrolOrderCommitGetList();
        }
        if (isAddPatrolOrder || !this.localPatrolOrder) {
            this.setState({editable: true});
            actions.getCode({modelKey: 'patrolorder', siteId: commonState.siteId}, "GET_ORDER_CODE")
        }

    }
    routerWillLeave(nextLocation) {
        const { location } = this.props;
        if (!nextLocation.pathname.startsWith(location.pathname.substring(0, location.pathname.length - 1))) {
            //切换其它页面
            const isEdited = JSON.parse(localStorage.getItem('order_edit_flag'));
            if (isEdited) {
                const confirm = Modal.confirm;
                confirm({
                    title: '提示',
                    content: '当前页面已修改，是否确认离开？',
                    onOk() {
                        localStorage.removeItem('order_edit_flag');
                        localStorage.removeItem('order_edit');
                        browserHistory.push(nextLocation.pathname);
                    }
                });
                return false;
            } else {
                localStorage.removeItem('order_edit_flag');
                localStorage.removeItem('order_edit');
            }
        }
    }
    render() {

        const {state, location} = this.props;
        const patrolOrderCommitData = state.patrolOrderCommitListData || [];

        // 执行记录数据
        const recordList = patrolOrderCommitData.eamImpleRecordVoVoList || [];
        // 执行记录日期
        const recordDateArr = patrolOrderCommitData.dateArr;

        return (
            <div className="eam-tab-page">
                <div className="eam-content">
                    <Collapse bordered={false} defaultActiveKey={['1', '2', '3']}>
                        <Panel header={<span className="label">基本信息 <Icon type="caret-down"/></span>} key="1"
                               style={this.customPanelStyle}>
                            <NewForm data={patrolOrderCommitData} editable={this.state.editable}
                                     parentProps={{...this.props}}/>
                        </Panel>
                        <Panel header={<span className="label">执行记录 <Icon type="caret-down"/></span>} key="3"
                               style={this.customPanelStyle}>
                            <Timeline>
                                {
                                    recordList.map((item, i) => {

                                        let time = item.endTime ? item.endTime.split(' ')[1] : '';

                                        let iconType;
                                        if (i === 0) {
                                            iconType = item.endTime ? 'minus-circle-o' : 'clock-circle-o';
                                        } else {
                                            iconType = item.processType === 'reject' ? 'exclamation-circle-o' : 'check-circle-o';
                                        }

                                        return (
                                            <Timeline.Item
                                                key={i}
                                                dot={
                                                    <div>
                                                        <div
                                                            className={recordDateArr[i] ? 'date' : ''}>{recordDateArr[i] ? recordDateArr[i] : ''} {recordDateArr[i] ?
                                                            <i></i> : ''}</div>
                                                        <div>
                                                            <Icon
                                                                className={item.processType === 'reject' ? 'red pull-right' : 'pull-right'}
                                                                type={iconType} style={{fontSize: '16px'}}/>
                                                            <span className="pull-right time">{time.slice(0, 5)}</span>
                                                        </div>
                                                    </div>
                                                }
                                            >
                                                <h2>
                                                    <span
                                                        className={item.processType === 'reject' ? 'red name' : 'name'}>{item.name}</span>
                                                    <span>持续时间：{item.durationInMillis ? `${msFormat(item.durationInMillis, 'h')}小时${msFormat(item.durationInMillis, 'm')}分钟` : '-'}</span>
                                                    &nbsp;&nbsp;
                                                    <span>责任人：{item.personName}</span>
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
        state: state.patrol,
        commonState: state.common,
    }
}

function buildActionDispatcher(dispatch) {
    return {
        actions: bindActionCreators(actions, dispatch),
        commonActions: bindActionCreators(commonActions, dispatch),
    }
}

export default connect(mapStateToProps, buildActionDispatcher)(OrderOneComponent);
