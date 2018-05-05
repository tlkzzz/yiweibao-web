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

import SelectPerson from '../../components/common/select_person.js';

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
    Modal
} from 'antd';
const Panel = Collapse.Panel;
const FormItem = Form.Item;
const Option = Select.Option;

import moment from 'moment';

class FormComponent extends React.Component {
    constructor(props) {
        super(props)

        this.state = {
            selectPersonsModalShow: false,
        }

        this.currentInp = '';
    }

    selectCode = (stateAttr) => {
        this.setState({[stateAttr]: true});
    }



    personsInputFocus = (e) => {
        this.currentInp = e.target.getAttribute('data-name');
        this.setState({
            selectPersonsModalShow: true
        })
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

        let {data, editable, state, commonState, form} = this.props;
        const {getFieldDecorator} = form;

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
                                        initialValue: data.orgId
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
                                        initialValue: data.siteId
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
                                        <Input  readOnly disabled={!editable}/>
                                    )
                                }
                            </FormItem>
                        </Col>
                        <Col className="gutter-row" xs={{span: 0}}>
                            <FormItem
                                label="分派人id"
                            >
                                {
                                    getFieldDecorator('assignPersonId', {
                                        initialValue: data.assignPersonId || commonState.personId
                                    })(
                                        <Input  disabled/>
                                    )
                                }
                            </FormItem>
                        </Col>
                        <Col className="gutter-row" xs={{span: 0}}>
                            <FormItem
                                label="执行人id"
                            >
                                {
                                    getFieldDecorator('excutePersonId', {
                                        initialValue: data.excutePersonId
                                    })(
                                        <Input  disabled/>
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
                                        //initialValue: data && data.status
                                        initialValue: 'DFP'
                                    })(
                                        <Input  disabled/>
                                    )
                                }
                            </FormItem>
                        </Col>
                        <Col className="gutter-row" xs={{span: 6}}>
                            <FormItem
                                label="执行人"
                            >
                                {
                                    getFieldDecorator('excutePerson', {
                                        initialValue: data.excutePerson
                                    })(
                                        <Input
                                            suffix={!editable ? null : <Icon style={{cursor: 'pointer'}} type="plus" data-name="excutePerson" onClick={this.personsInputFocus} />}
                                            data-name="excutePerson"
                                            onClick={this.personsInputFocus}
                                            readOnly
                                            disabled={!editable}
                                        />
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
                                        /*initialValue: (data.status && correspondenceJson.patrolOrder[data.status].text)*/
                                        initialValue: '待分派'
                                    })(
                                        <Input  disabled/>
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
                                        initialValue: data.org
                                    })(
                                        <Input  disabled/>
                                    )
                                }
                            </FormItem>
                        </Col>
                        <Col className="gutter-row" xs={{span: 6}}>
                            <FormItem
                                label="执行班组"
                            >
                                {
                                    getFieldDecorator('excuteWorkGroup', {
                                        initialValue: data.excuteWorkGroup
                                    })(
                                        <Select size="large" style={{width: '100%'}} disabled>
                                            <Option value="jack">Jack</Option>
                                            <Option value="lucy">Lucy</Option>
                                            <Option value="Yiminghe">yiminghe</Option>
                                        </Select>
                                    )
                                }
                            </FormItem>
                        </Col>
                    </Row>
                    <Row gutter={16} justify="start">
                        <Col className="gutter-row" xs={{span: 6}}>
                            <FormItem
                                label="分派人"
                            >
                                {
                                    getFieldDecorator('assignPerson', {
                                        initialValue: data.assignPerson
                                    })(
                                        <Input disabled/>
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
                                        initialValue: data.site
                                    })(
                                        <Input  disabled/>
                                    )
                                }
                            </FormItem>
                        </Col>
                    </Row>
                </Form>
                <SelectPerson
                    multiple
                    visible={this.state.selectPersonsModalShow}
                    selectPersonModalHide={() => { this.setState({selectPersonsModalShow: false}) }}
                    setSelected={() => {
                        let curClickPersonName = form.getFieldValue(this.currentInp);
                        let curClickPersonId = form.getFieldValue(this.currentInp + 'Id');

                        curClickPersonName = curClickPersonName ? curClickPersonName.split(', ') : [];
                        curClickPersonId = curClickPersonId ? curClickPersonId.split(',') : [];

                        curClickPersonId = curClickPersonId.map((item, i) => (
                            {
                                personId: item,
                                name: curClickPersonName[i],
                            }
                        ));

                        return  curClickPersonId;
                    }}
                    onOk={(selected) => {

                        const name = filterArrByAttr(selected, 'name').join(', ');
                        const personId = filterArrByAttr(selected, 'personId').join(',');

                        let json;
                        if (this.currentInp === 'excutePerson') {
                            json = {
                                [this.currentInp]: name,
                                [this.currentInp + 'Id']: personId,
                                excuteWorkGroup: selected.workgroup,
                            }
                        } else {
                            json = {
                                [this.currentInp]: name,
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

class OrderTwoComponent extends React.Component {
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


        this.param = {
            id: (localStorage.getItem('patrolOrder') && JSON.parse(localStorage.getItem('patrolOrder')).id),
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

        let index = location.pathname.lastIndexOf("/");
        const curProcess = location.pathname.substring(index+1);
        if (this.localPatrolOrder && this.localPatrolOrder.process!='order_commit') this.patrolOrderCommitGetList();

        if (this.localPatrolOrder) {
            if (this.localPatrolOrder.process == curProcess) {
                this.setState({ editable: true });
            } else {
                this.setState({ editable: false });
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

        const defaultRender = (text, record, key) => {
            return (
                <p>{text ? text : '-'}</p>
            )
        };

        return (
            <div className="eam-tab-page">
                <div className="eam-content">
                    <Collapse bordered={false} defaultActiveKey={['1', '2', '3']}>
                        <Panel header={<span className="label">分派信息 <Icon type="caret-down"/></span>} key="1"
                               style={this.customPanelStyle}>
                            <NewForm data={patrolOrderCommitData} editable={this.state.editable} location={location}/>
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

export default connect(mapStateToProps, buildActionDispatcher)(OrderTwoComponent);
