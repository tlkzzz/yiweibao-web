import React from 'react';
import {bindActionCreators} from 'redux';
import {browserHistory} from 'react-router';
import {connect} from 'react-redux';
import actions from '../../actions/patrol.js';
import commonActions from '../../actions/common.js';
import {createForm} from 'rc-form';

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
    Checkbox,
    Modal
} from 'antd';
const Panel = Collapse.Panel;
const FormItem = Form.Item;
const RadioGroup = Radio.Group;

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
        const {state, actions, form} = this.props;
        if (!state.getFormValues) {
            actions.getFormValues(form.getFieldsValue());
        }
    }

    componentWillMount() {
        const {commonActions, commonState} = this.props;
        const domainValueParam = {
            orgId: commonState.orgId,
            siteId: commonState.siteId,
            prodId: 'EAM'
        }
        commonActions.getDomainValue(domainValueParam, 'patrolType', 'PATROL_TYPE');
    }

    render() {

        let {data, editable, state, commonState, location} = this.props;
        const {getFieldDecorator} = this.props.form;

        const isAddPatrolOrder = location.query.add_patrol_order;

        const patrolOrderTypeData = commonState.patrolTypeData;

        return (
            <div>
                <Form layout="vertical">
                    <Row gutter={16}>
                        <Col className="gutter-row" xs={{span: 0}}>
                            <FormItem
                                label="id"
                            >
                                {
                                    getFieldDecorator('id', {
                                        initialValue: data ? data.id : ''
                                    })(
                                        <Input disabled/>
                                    )
                                }
                            </FormItem>
                        </Col>
                        <Col className="gutter-row" xs={{span: 3}}>
                            <FormItem
                                label="实际执行人"
                            >
                                {
                                    getFieldDecorator('excutePerson', {
                                        initialValue: data ? data.excutePerson : ''
                                    })(
                                        <Input disabled/>
                                    )
                                }
                            </FormItem>
                        </Col>
                        <Col className="gutter-row" xs={{span: 9}}>
                            <FormItem
                                label="备注说明"
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
                                label="状态"
                            >
                                {
                                    getFieldDecorator('status', {
                                        initialValue: isAddPatrolOrder ? '待汇报' : (data.status && correspondenceJson.patrolOrder[data.status].text)
                                    })(
                                        <Input disabled/>
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
const NewForm = connect(mapStateToProps, buildActionDispatcher)(createForm({onValuesChange: (props, values) => {
    for (let attr in values) {
        if (values[attr] instanceof moment) {
            values[attr] = moment(values[attr]).format('YYYY-MM-DD HH:mm:ss');
        }
    }
    //标记表单数据已更新
    localStorage.setItem('order_edit_flag', true);
    let tmp = Object.assign({}, JSON.parse(localStorage.getItem('order_edit')), values);
    localStorage.setItem('order_edit', JSON.stringify(tmp));
}})(FormComponent));


class PatrolPointComponent extends React.Component {
    constructor(props) {
        super(props)


        this.state = {
            selectPlanShow: false,
            hasnewDate: false,
            newDate: '',
            endDate: '',
            duration: 0,
            isqualified: 1,
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
        let {editable} = this.props;
        this.termColumns = [
            {
                title: '序号',
                dataIndex: 'step',
                key: 'step',
                render: defaultRender
            },
            {
                title: '任务描述',
                dataIndex: 'patrolTermDsr',
                key: 'patrolTermDsr',
                render: defaultRender
            },
            {
                title: '是否合格',
                dataIndex: 'isqualified',
                key: 'isqualified',
                render: (text, record, key) => {
                    if (record.isqualified != "0") record.isqualified = "1"
                    return (
                        <RadioGroup value={record.isqualified} onChange={(e) => {
                            record.isqualified = e.target.value
                        }} disabled={!editable}>
                            <Radio value={"1"}>正常</Radio>
                            <Radio value={"0"}>异常</Radio>
                        </RadioGroup>
                    )
                }
            },
            {
                title: '异常说明',
                dataIndex: 'exceptionDsr',
                key: 'exceptionDsr',
                render: (text, record, key) => {
                    //onChange={(e) => {
                    //record.exceptionDsr = e.target.value
                    //}}
                    return (
                        <Input onChange={(e) => {
                            record.exceptionDsr = e.target.value
                            this.onFocus();
                        }} value={record.exceptionDsr} disabled={!editable}/>
                    )
                }
            },
        ];

        const {location} = this.props;

        const isAddPatrolOrder = location.query.add_patrol_order;

        this.param = {
            id: isAddPatrolOrder ? '' : (localStorage.getItem('patrolOrder') && JSON.parse(localStorage.getItem('patrolOrder')).id),
        }
    }

    // 分页事件
    pageChange = (page, pageSize) => {
        this.setState({currentPage: page});
        this.param.pageNum = page; //*** 需要修改参数 在方法内单独修改
        this.getpointList();
    }
    // 获取列表数据
    getpointList = () => {
        const {actions} = this.props;
        this.setState({tableLoading: true});
        actions.orderPointGetList(this.param, (json) => {
            this.setState({tableLoading: false});
            const list = json.list || [];
            if (list.length > 0) {
                const pointid = list[0].id;
                this.getPointList(pointid);
            }
        });
    };

    componentWillMount() {
        this.getpointList();
    }


    getPointInfo = (id) => {
        this.getPointList(id);
    }

    changeDate = (record, index, event) => {

        this.setState({
            endDate: moment(moment().format('YYYY-MM-DD HH:mm:ss'))
        });
        if (!this.state.hasnewDate) {
            this.setState({newDate: moment(moment().format('YYYY-MM-DD HH:mm:ss'))});
            this.setState({hasnewDate: true});
        }

        if (this.state.hasnewDate) {
            let {state} = this.props;
            let timeData = {};
            timeData.startdate = this.state.newDate.format('YYYY-MM-DD HH:mm:ss');
            timeData.enddate = this.state.endDate.format('YYYY-MM-DD HH:mm:ss');
            timeData.duration = ((this.state.endDate.toDate() - this.state.newDate.toDate()) / 60000).toFixed(0);
            this.setState({duration: timeData.duration});
            state.orderRecordTimeData = timeData;
        }
    }

    getPointList = (id) => {
        const {actions, location} = this.props;

        const isAddPatrolOrder = location.query.add_patrol_order;

        const termParam = {
            id: isAddPatrolOrder ? '' : (localStorage.getItem('patrolOrder') && JSON.parse(localStorage.getItem('patrolOrder')).id),
            pointid: id,
            pageNum: 1,
            pageSize: 998,
        }

        console.log(termParam);
        this.setState({
            termLoading: true,
        });
        actions.findPatrolTermByOrderId(termParam, () => {
            this.setState({
                termLoading: false,
            });
        });
        actions.findPatrolRecordByOrderAndPoint(termParam, () => {
            this.setState({
                termLoading: false,
            });
        });
    }


    render() {

        const {state, editable} = this.props;
        const dataList = state.orderPointListData || [];
        const list = dataList.list || [];

        const termData = state.pointTermListData || [];
        const timeData = state.orderRecordTimeData || {};
        let startdate = moment(timeData.startdate) || '',
            enddate = moment(timeData.enddate) || '',
            duration = timeData.duration
        // 检查项数据
        const termList = termData.list || [];

        return (
            <div>
                <div>
                    <div style={{padding: 3, background: 'white'}}>
                        <div className="senior-filter-item" style={{marginLeft: 10, borderBottom: 0}}>
                            <div className="eam-multiselect">
                                {
                                    list.map((item, i) => <Button className="order-excute-button" key={i}
                                                                  value={item.id} onClick={() => {
                                        this.getPointInfo(item.id)
                                    }}>{item.description}</Button>)
                                }
                            </div>
                        </div>
                    </div>
                </div>
                <div>
                    开始时间：<DatePicker
                    value={startdate}
                    disabled
                    className="order-excute-input"
                    showTime
                    format="YYYY-MM-DD HH:mm:ss"
                    placeholder="Select Time"
                    onChange={(onChange) => {
                    }}
                    style={{width: '300px'}}
                    onOk={(onOk) => {
                    }}
                />
                    结束时间：<DatePicker
                    value={enddate}
                    disabled
                    className="order-excute-input"
                    showTime
                    format="YYYY-MM-DD HH:mm:ss"
                    placeholder="Select Time"
                    onChange={(onChange) => {
                    }}
                    style={{width: '300px'}}
                    onOk={(onOk) => {
                    }}
                />
                    持续时间(分钟)：<Input style={{width: '300px'}} value={duration} className="order-excute-input"
                                    disabled/>
                    <RadioGroup defaultValue="1" onChange={(e) => {
                        for (let term of termList) {
                            term.isqualified = e.target.value
                        }
                        this.setState({isqualified: e.target.value});
                    }} disabled={!editable}>
                        <Radio value={"1"}>正常</Radio>
                        <Radio value={"0"}>异常</Radio>
                    </RadioGroup>
                </div>
                <div style={{height: '45px'}}></div>
                <div>
                    <Table
                        rowKey="id"
                        loading={this.state.termLoading}
                        //pagination={false}
                        pagination={{
                            showTotal: (total, range) => `当前第${range[0]}-${range[1]}条 / 共${total}条`,
                            defaultPageSize: 5,
                        }}
                        dataSource={termList}
                        columns={this.termColumns}
                        bordered
                        onRowClick={this.changeDate}
                        onChange={this.tableChange}
                    />
                </div>
            </div>


        )
    }
}

const PatrolPointForm = connect(mapStateToProps, buildActionDispatcher)(createForm({onValuesChange: (props, values) => {
    for (let attr in values) {
        if (values[attr] instanceof moment) {
            values[attr] = moment(values[attr]).format('YYYY-MM-DD HH:mm:ss');
        }
    }
    //标记表单数据已更新
    localStorage.setItem('order_edit_flag', true);
    let tmp = Object.assign({}, JSON.parse(localStorage.getItem('order_edit')), values);
    localStorage.setItem('order_edit', JSON.stringify(tmp));
}})(PatrolPointComponent));

class OrderExcuteComponent extends React.Component {
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
        const {actions, location} = this.props;
        const isAddPatrolOrder = location.query.add_patrol_order;

        let index = location.pathname.lastIndexOf("/");
        const curProcess = location.pathname.substring(index + 1);
        if (this.localPatrolOrder && (this.localPatrolOrder.status != 'DTB' && this.localPatrolOrder.status != 'DFP')) this.patrolOrderCommitGetList();

        if (this.localPatrolOrder) {
            if (this.localPatrolOrder.process == curProcess && this.localPatrolOrder.status == 'DHB') {
                this.setState({editable: true});
            } else {
                this.setState({editable: false});
            }
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
                            <NewForm data={patrolOrderCommitData} editable={this.state.editable} location={location}/>
                        </Panel>

                        <Panel header={<span className="label">巡检点 <Icon type="caret-down"/></span>} key="2"
                               style={this.customPanelStyle}>
                            <PatrolPointForm state={state} location={location} editable={this.state.editable}/>
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

export default connect(mapStateToProps, buildActionDispatcher)(OrderExcuteComponent);
