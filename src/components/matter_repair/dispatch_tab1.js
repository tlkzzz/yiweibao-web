/**
 * 报事报修-报修工单-工单提报 
 */
import React from 'react';
import { bindActionCreators } from 'redux';
import { browserHistory } from 'react-router';
import { connect } from 'react-redux';
import actions from '../../actions/matter_repair.js';
import EamModal from '../../components/common/modal.js';
import commonActions from '../../actions/common.js';
import { correspondenceJson, filterArrByAttr,msFormat } from '../../tools/';
import moment from 'moment';

import { Icon, Button, Table, Pagination, Collapse,notification, Form, Input, Row, Col, Select, Radio, DatePicker, Timeline, Upload, Modal,message } from 'antd';
const Panel = Collapse.Panel;
const FormItem = Form.Item;
const Option = Select.Option;


class FormComponent extends React.Component {
    constructor(props) {
        super(props);


        this.state = {
            workflowStartupShow: false,//工作流启动
            currentPage: 1,
            visibleProcess: false,
        }

        this.currentInp = '';
        this.param = {
            pageSize: 10,
            pageNum: 0
        }
        let defaultRender = (text, record, key) => {
            return (
                <p>{text ? text : '-'}</p>
            )
        };
    }

    //人员数据加载
    getList = () => {
        const {commonActions,commonState} = this.props.props;
        this.setState({tableLoading: true});
        this.param={
            ...this.param,
            siteId:commonState.siteId,
            orgId:commonState.orgId,
          //  productArray:["EAM"]
        }
        commonActions.personGetList(this.param, () => {
            this.setState({tableLoading: false});
        });
    }
    //提报人选择框
    personInputFocus = () => {
        this.userAddModal.modalShow();

    }
    // 分页事件
    pageChange = (page, pageSize) => {
        this.setState({ currentPage: page });
        this.param.pageNum = page;
        this.getList();
    }
    //提报人选择弹框渲染
    taskStepsClose = () => {
        this.userAddModal.modalHide();
    }
    //提报人选择赋值
    selectCheckPerson = (record) => {
        //给人员赋值
        const {form} = this.props;
        form.setFieldsValue({'reportPersonTel': record.mobile,'reportPersonId': record.personId, 'reportPersonName': record.name});
        this.userAddModal.modalHide()
    }

    componentDidUpdate() {
        const {state, actions} = this.props.props;
        if(state.getFormValues==true){
            actions.getFormValues(false);
            this.formDataSave();
        }
    }
    //保存
    formDataSave = () => {
        const { actions,commonState,state } = this.props.props;
        this.props.form.validateFields((error, values) => {
            if (error) {
                for (let attr in error) {
                    message.warning(error[attr].errors[0].message);

                    // notification.warning({
                    //     message: '警告',
                    //     description: error[attr].errors[0].message
                    // });
                }
            }
            if (!error) {
                for (let attr in values) {
                    if (values[attr] === null||values[attr]==""||values[attr]==undefined) delete values[attr];
                }
                values.reportDate = moment(values.reportDate).format('YYYY-MM-DD HH:mm:ss');
                if(values.workOrderStatusDate!=null){
                    values.workOrderStatusDate = moment(values.workOrderStatusDate).format('YYYY-MM-DD HH:mm:ss');
                }
                let param = {
                        ...values,
                        orgId: commonState.orgId,
                        siteId: commonState.siteId,
                        }
                actions.dispatchWorkOrderSave(param, (msg) => {
                    if (msg.success) {
                        //更新数据
                        message.success("保存成功");

                        param = {id: msg.data.workOrderId};
                        actions.dispatchOrderInfo(param, (json) => {
                            localStorage.setItem('dispatchWorkOrder_edit', JSON.stringify(json));
                            localStorage.setItem('dispatchWorkOrder_edit_flag', false);
                        });
                        localStorage.setItem('workOrderId', msg.data.workOrderId );

                    } else {
                        message.error(msg.msg);
                    }
                });
            }
        });
    }


    //获取提报单信息
    getRepairWorkOrderInfo = (id) => {

        const {actions,commonActions,state,commonState} = this.props.props;
        if(id!=null&&id!="null"){
            state.dispatchIsAdd=false;
            let  param = {id: id};
            actions.dispatchOrderInfo(param, (json) => {
                localStorage.setItem('dispatchWorkOrder_edit', JSON.stringify(json));
                if(json!=null&&json.processInstanceId!=null){
                    this.getExecutionRecord(json.processInstanceId);//开始查询执行记录
                }else{
                    commonActions.updateProcessExecutionRecord([]);

                }
            });
        }else{
            state.dispatchIsAdd=true;
            actions.updateDispatchWorkOrder(null);
          //  state.dispatchOrderInfo=null;//值清空

            let  param = {
                orgId: commonState.orgId,
                siteId: commonState.siteId,
                modelKey: "dispatch"
            };
            commonActions.codeGenerator(param, (json) => {
                let patam={
                    workOrderNum:json.data,
                    workOrderStatus:'DTB'
                }
                let tmp = Object.assign({}, JSON.parse(localStorage.getItem('dispatchWorkOrder_edit')), patam);
                localStorage.setItem('dispatchWorkOrder_edit', JSON.stringify(tmp));
                this.setState({tableLoading: false});
            });
            commonActions.updateProcessExecutionRecord([]);
        }
    }
    //获取执行记录
    getExecutionRecord=(processInstanceId)=>{
        let  param = { processInstanceId: processInstanceId}
        const {actions,commonActions} = this.props.props;
        commonActions.getProcessExecutionRecord(param, (json) => {
        });
    }
    componentWillMount() {
        const {actions,commonActions,state} = this.props.props;
        let id =localStorage.getItem('workOrderId');
        localStorage.setItem('workOrderIdSign', "DTB" );
        let dispatchWorkOrder_edit=localStorage.getItem('dispatchWorkOrder_edit')?JSON.parse(localStorage.getItem('dispatchWorkOrder_edit')):false;
      if(state.dispatchIsAdd&&!dispatchWorkOrder_edit){//增加
          this.getRepairWorkOrderInfo(id);
          this.getList();
      }else{
          if(dispatchWorkOrder_edit){
              actions.updateDispatchWorkOrder(dispatchWorkOrder_edit);
          }else{
              this.getRepairWorkOrderInfo(id);

          }
      }

    }

    render() {
        const {getFieldDecorator } = this.props.form;
        const { state, commonState, location } = this.props.props;
        const data = state.dispatchOrderInfo;
        const code = commonState.codeEntity ;
        const persondata = commonState.personListData;
        const personList = persondata.list;
        const departmentList = commonState.departmentList ;
        //true:不可以修改  false:可以修改
        let ismodify=false;
        if(data!=null&&data.workOrderStatus!=null){
            if(data.workOrderStatus!="DTB"){
                 ismodify=true;
            }
        }

       // state.processOptionExplain
        return (
            <Form layout="vertical" >
                {/*隐藏域值*/}
                {
                    getFieldDecorator('workOrderId', {
                        initialValue: data ? data.workOrderId : null
                    })(
                        <Input type="hidden" />
                    )
                }{
                    getFieldDecorator('reportPersonId', {
                        initialValue: data ? data.reportPersonId?data.reportPersonId:commonState.personId : commonState.personId
                    })(
                        <Input type="hidden" />
                    )
                }
                <Row gutter={16}>
                    <Col className="gutter-row" xs={{ span: 3 }}>
                        <FormItem
                            label="工单编码"
                        >
                            {
                                getFieldDecorator('workOrderNum', {
                                    initialValue: data ? data.workOrderNum : code,
                                    rules: [{
                                        required: true
                                    }]
                                })(
                                    <Input placeholder="工单编码" disabled />
                                )
                            }
                        </FormItem>
                    </Col>
                    <Col className="gutter-row" xs={{ span: 9 }}>
                        <FormItem
                            label="派工描述"
                        >
                            {
                                getFieldDecorator('description', {
                                    initialValue: data ? data.description?data.description:'' : '',
                                    rules: [
                                        { required: true, message: '请填写派工描述！'},
                                        { max: 200, message: '派工描述长度不能超过200字符长度！'}
                                        ]
                                })(
                                    <Input placeholder="请输入派工描述"  disabled={ismodify}/>
                                )
                            }
                        </FormItem>
                    </Col>
                    <Col className="gutter-row" xs={{ span: 6 }}>
                        <FormItem label="提报人">
                            {
                                getFieldDecorator('reportPersonName', {
                                    initialValue: data ? data.reportPersonName?data.reportPersonName:commonState.personName : commonState.personName,
                                })(
                                   <Input placeholder="请选择提报人"  disabled  />
                                )
                            }

                        </FormItem>
                    </Col>
                    <Col className="gutter-row" xs={{ span: 6 }}>
                        <FormItem
                            label="站点"
                        >
                            {
                                getFieldDecorator('siteName', {
                                    initialValue: data ? data.siteName?data.siteName:commonState.siteName :  commonState.siteName
                                })(
                                    <Input placeholder="站点" disabled />
                                )
                            }
                        </FormItem>
                    </Col>
                </Row>
                <Row gutter={16}>
                    <Col className="gutter-row" xs={{ span: 6 }}>
                        <FormItem
                            label="需求部门"
                        >
                            {
                                getFieldDecorator('demandDept', {
                                    initialValue: data ? data.demandDept?data.demandDept:'' : '',
                                    rules: [
                                        { required: true, message: '需求部门不能为空！'}
                                    ]
                                })(
                                    <Select  size="large" style={{width: '100%'}} disabled={ismodify} >
                                        {
                                            departmentList.map((item, i) => <Option key={i}
                                                                                    value={item.value}>{item.description}</Option>)
                                        }
                                    </Select>
                                )
                            }
                        </FormItem>
                    </Col>
                    <Col className="gutter-row" xs={{ span: 6 }}>
                        <FormItem
                            label="提报时间"
                        >
                            {
                                getFieldDecorator('reportDate', {
                                    //  initialValue:  moment(data ? data.reportDate : new Date(), 'YYYY-MM-DD HH:mm:ss')
                                    initialValue: data? data.reportDate? moment(data.reportDate, 'YYYY-MM-DD HH:mm'):moment(new Date(), 'YYYY-MM-DD HH:mm') : moment(new Date(), 'YYYY-MM-DD HH:mm')
                                //    initialValue: data ? data.reportDate ? moment(data.reportDate, 'YYYY-MM-DD HH:mm'):moment({}, 'YYYY-MM-DD HH:mm'): {}
                                })(
                                    <DatePicker  disabled
                                        showTime
                                        format="YYYY-MM-DD HH:mm:ss"
                                        placeholder="请选择提报时间"
                                        onChange={(onChange) => { }}
                                        onOk={(onOk) => { }}
                                    />
                                )
                            }
                        </FormItem>
                    </Col>
                    <Col className="gutter-row" xs={{ span: 6 }}>
                        <FormItem
                            label="工单状态"
                        >
                            {
                                getFieldDecorator('workOrderStatusDescription', {
                                    initialValue: data ? data.workOrderStatusDescription?data.workOrderStatusDescription:'待提报' : '待提报'
                                })(
                                    <Input  disabled />
                                )
                            }
                        </FormItem>
                    </Col>
                    <Col className="gutter-row" xs={{ span: 6 }}>
                        <FormItem
                            label="需求人"
                        >
                            {
                                getFieldDecorator('demandPerson', {

                                    initialValue: data ? data.demandPerson? data.demandPerson:'': '',
                                    rules: [
                                        { required: true, message: '需求人不能为空！'},
                                        { max: 200, message: '需求人长度不能超过200！'}
                                    ]
                                })(
                                    <Input placeholder="请输入需求人"  disabled={ismodify} />
                                )
                            }
                        </FormItem>
                    </Col>
                </Row>
                <Row gutter={16}>
                <Col className="gutter-row" xs={{ span: 6 }}>
                        <FormItem
                            label="提报人电话"
                        >
                            {
                                getFieldDecorator('reportPersonTel', {
                                    initialValue: data ? data.reportPersonTel?data.reportPersonTel:'' : '',
                                    rules: [
                                        { max: 20, message: '提报人电话长度不能超过30！'},
                                    ]
                                })(
                                    <Input placeholder="请输入提报人电话" disabled={ismodify} />
                                )
                            }
                        </FormItem>
                    </Col>
                <Col className="gutter-row" xs={{ span: 6 }}>
                    <FormItem
                        label="状态时间"
                    >
                        {
                            getFieldDecorator('workOrderStatusDate', {
                                initialValue: data ? data.workOrderStatusDate?data.workOrderStatusDate:'': '',
                            })(
                                <Input  disabled />
                            )
                        }
                    </FormItem>
                </Col>
                <Col className="gutter-row" xs={{ span: 6 }}>
                    <FormItem
                        label="联系方式"
                    >
                        {
                            getFieldDecorator('demandPersonTel', {
                                initialValue: data ? data.demandPersonTel?data.demandPersonTel:'' : '',
                                rules: [
                                    { max: 20, message: '联系方式长度不能超过20！'},
                                ]
                            })(
                                <Input placeholder="联系方式"  disabled={ismodify} />
                            )
                        }
                    </FormItem>
                </Col>
                </Row>
                <Row gutter={16}>
                    <Col className="gutter-row" xs={{ span: 12 }}>
                        <FormItem
                            label="备注"
                        >
                            {
                                getFieldDecorator('reportRemarks', {
                                    initialValue: data ? data.reportRemarks : '',
                                    rules: [
                                        { max: 255, message: '备注长度不能超过255！'}
                                    ]
                                })(
                                    <Input type="textarea" placeholder="备注" className="eam-textarea"  disabled={ismodify} />
                                )
                            }
                        </FormItem>
                    </Col>
                </Row>
            </Form>
        )
    }
}
const NewFormComponent = Form.create({onValuesChange: (props, values) => {
    for (let attr in values) {
        if (values[attr] instanceof moment) {
            values[attr] = moment(values[attr]).format('YYYY-MM-DD HH:mm:ss');
        }
    }
    //标记表单数据已更新
    localStorage.setItem('dispatchWorkOrder_edit_flag', true);
    let tmp = Object.assign({}, JSON.parse(localStorage.getItem('dispatchWorkOrder_edit')), values);
    localStorage.setItem('dispatchWorkOrder_edit', JSON.stringify(tmp));

}})(FormComponent)

class WorkOrderOneComponent extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            modalShow: false,
            currentPage: 1,
        }

        this.customPanelStyle = {
            background: '#fff',
            borderRadius: 2,
            marginBottom: 24,
            border: 0,
            boxShadow: '0 1px 6px rgba(0, 0, 0, 0.2)'
        };

        this.props.router.setRouteLeaveHook(
            this.props.route,
            this.routerWillLeave.bind(this)
        );
        this.onBeforeUnload = (event) => {
            const isEdited = JSON.parse(localStorage.getItem('dispatchWorkOrder_edit_flag'));
            if (isEdited) {
                let confirmationMessage = '当前页面已修改，是否确认离开？';
                (event || window.event).returnValue = confirmationMessage; // Gecko and Trident
                return confirmationMessage; // Gecko and WebKit
            }
            return "\o/";
        };
        //注册刷新事件，当页面刷新时，缓存页面数据
        window.addEventListener('beforeunload', this.onBeforeUnload);
    }
    routerWillLeave(nextLocation)   {
        const { location } = this.props;
        if (!nextLocation.pathname.startsWith(location.pathname.substring(0, location.pathname.length - 1))) {
            //切换其它页面
            const isEdited = JSON.parse(localStorage.getItem('dispatchWorkOrder_edit_flag'));
            if (isEdited) {
                const confirm = Modal.confirm;
                confirm({
                    title: '提示',
                    content: '当前页面已修改，是否确认离开？',
                    onOk() {
                        localStorage.removeItem('dispatchWorkOrder');
                        localStorage.removeItem('dispatchWorkOrder_edit');
                        localStorage.removeItem('dispatchWorkOrder_edit_flag');
                        localStorage.removeItem('workOrderIdSign');
                        localStorage.removeItem('workOrderId');
                        browserHistory.push(nextLocation.pathname);
                    }
                });
                return false;
            } else {
                localStorage.removeItem('dispatchWorkOrder');
                localStorage.removeItem('dispatchWorkOrder_edit');
                localStorage.removeItem('dispatchWorkOrder_edit_flag');
                localStorage.removeItem('workOrderIdSign');
                localStorage.removeItem('workOrderId');
            }
        }
    }
    render() {
        const { state, actions,commonState } = this.props;
        const data=commonState.processExecutionRecord;
        const recordList = data.executionRecord || [];
        // 执行记录日期
        const recordDateArr = data.dateArr;

        return (
            <div className="eam-tab-page">
                <div className="eam-content">
                    <Collapse bordered={false} defaultActiveKey={['1', '2', '3']}>
                        <Panel header={<span className="label">工单信息 <Icon type="caret-down" /></span>} key="1" style={this.customPanelStyle}>
                            <NewFormComponent wrappedComponentRef={taskStepsAddForm => this.taskStepsAddForm = taskStepsAddForm} props={this.props}/>
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
        state: state.matter_repair,
        commonState: state.common
    }
}

function buildActionDispatcher(dispatch) {
    return {
        actions: bindActionCreators(actions, dispatch),
        commonActions: bindActionCreators(commonActions, dispatch),
    }
}

export default connect(mapStateToProps, buildActionDispatcher)(WorkOrderOneComponent);