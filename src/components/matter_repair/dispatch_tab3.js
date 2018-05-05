/**
 * 报事报修-报修工单-工单提报 
 */
import React from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import actions from '../../actions/matter_repair.js';
import EamModal from '../../components/common/modal.js';
import { browserHistory } from 'react-router';
import commonActions from '../../actions/common.js';
import { correspondenceJson, filterArrByAttr ,msFormat} from '../../tools/';
import Upload from '../../components/common/upload.js';
import moment from 'moment';

import { Icon, Button, Table, Pagination,notification, Collapse,InputNumber, Form, Input, Row, Col, Select, Radio, DatePicker, Timeline, Modal,message  } from 'antd';
const Panel = Collapse.Panel;
const FormItem = Form.Item;
const InputGroup = Input.Group;

class FormComponent extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            selectPersonModalShow: false,
            currentPage: 1,
            visibleProcess: false,
        }
        this.param = {
            pageSize: 10,
            pageNum: 0
        }
        this.userColumns = [
            {
                title: '人员',
                dataIndex: 'name',
                key: 'name',
                sorter: true,
                render:  (text, record, key) => {
                    return (
                        <p><a href="javascript:;" onClick={() => { this.selectCheckPerson(record.personId, record.name)}} className="order-number">{text ? text : '-'}</a></p>
                    )
                }
            },
            {
                title: '职务',
                dataIndex: 'position',
                key: 'position',
                sorter: true,
                render: defaultRender
            },
            {
                title: '班组',
                dataIndex: 'workgroup',
                key: 'workgroup',
                sorter: true,
                render: defaultRender
            },
            {
                title: '电话',
                dataIndex: 'mobile',
                key: 'mobile',
                sorter: true,
                render: defaultRender
            },
        ];
        let defaultRender = (text, record, key) => {
            return (
                <p>{text ? text : '-'}</p>
            )
        };
        this.currentInp = '';
    }
    //人员数据加载
    getList = () => {
        const {commonActions,commonState} = this.props.props;
        this.setState({tableLoading: true});
        this.param={
            ...this.param,
            orgIds: [commonState.orgId],
            siteIds: [commonState.siteId],
            productIds: commonState.productArray,
        }
        commonActions.personGetList(this.param, () => {
            this.setState({tableLoading: false});
        });
    }

    //执行人选择框
    personInputFocus = () => {
        this.userAddModal.modalShow();

    }
    // 分页事件
    pageChange = (page, pageSize) => {
        this.setState({ currentPage: page });
        this.param.pageNum = page;
        this.getList();
    }
    //执行人选择弹框渲染
    taskStepsClose = () => {
        this.userAddModal.modalHide();
    }
    //执行人选择赋值
    selectCheckPerson = (id,name) => {
        //给人员赋值
        const {form} = this.props;
        form.setFieldsValue({'actualExecutionPersonId': id, 'actualExecutionPerson': name});
        this.userAddModal.modalHide()

    }

    sendProcess = (data) => {
        if (data) {
            this.props.form.validateFields((err, values) => {
                if (!err) {


                }
            });
        } else {

        }
    }
    formDataSave = () => {

        const { actions,state } = this.props.props;
        this.props.form.validateFields((error, values) => {
            if (error) {
                for (let attr in error) {
                    message.warning(error[attr].errors[0].message);
                }
            }
            values={
                ...state.dispatchOrderInfo,
                ...values
            }
            if (!error) {
                actions.dispatchWorkOrderSave(values,(msg) => {
                    if (msg.success) {
                        //更新数据
                        message.success("保存成功");
                        let param = {id: msg.data.workOrderId};
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
    sendProcessHide = () => {
        this.setState({ visibleProcess: false })
    }
    //获取提报单信息
    getRepairWorkOrderInfo = (id) => {

        const {actions,commonActions,state,commonState} = this.props.props;
        if(id!=null&&id!="null"){
            state.dispatchIsAdd=false;
            let  param = {id: id};
            actions.dispatchOrderInfo(param, (json) => {
                if(json!=null&&json.processInstanceId!=null){
                    this.getExecutionRecord(json.processInstanceId);//开始查询执行记录
                }else{

                    commonActions.updateProcessExecutionRecord([]);
                }
            });
        }else{
            state.dispatchIsAdd=true;
            actions.updateDispatchWorkOrder(null);
            //state.dispatchOrderInfo=null;//值清空

            let  param = {
                orgId: commonState.orgId,
                siteId: commonState.siteId,
                modelKey: "dispatch"
            };
            commonActions.codeGenerator(param, () => {
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
        // let id =localStorage.getItem('workOrderId');
        // localStorage.setItem('workOrderIdSign', "DHB" );

        //  this.getRepairWorkOrderInfo(id);
        //
        //
        // this.getList();
        let dispatchWorkOrder_edit=localStorage.getItem('dispatchWorkOrder_edit')?JSON.parse(localStorage.getItem('dispatchWorkOrder_edit')):false;

        let id =localStorage.getItem('workOrderId');
        localStorage.setItem('workOrderIdSign', "DHB" );
        if(state.dispatchIsAdd&&!dispatchWorkOrder_edit){//增加
            this.getRepairWorkOrderInfo(id);
            this.getList();
        }else{
            if(dispatchWorkOrder_edit){
                actions.updateDispatchWorkOrder(dispatchWorkOrder_edit);
              //  state.dispatchOrderInfo=dispatchWorkOrder_edit;
            }else{
                this.getRepairWorkOrderInfo(id);
                localStorage.setItem('dispatchWorkOrder_edit', JSON.stringify(state.dispatchOrderInfo));
            }
        }


    }

    buildInitConsumeHoursValue = (value, isHour) => {
        return value && value.indexOf(':') ?
            value.split(':')[isHour ? 0 : 1] :
            (isHour && value ? value : null)
    };
    onConsumeHoursValueChange = (value, isHour) => {
        const { getFieldValue, setFieldsValue } = this.props.form;
        let otherValue = getFieldValue(isHour ? 'consumeHours_minute' : 'consumeHours_hours');
        if (value || otherValue) {
            let hour, minute;
            hour = isHour ? value : otherValue;
            minute = isHour ? otherValue : value;
            otherValue = (hour && minute ? (hour + ':' + minute) : (hour ? hour + ':0' : '0:' + minute));
            setFieldsValue({consumeHours: otherValue});
        } else {
            setFieldsValue({consumeHours: null});
        }
    };

    //保存
    formDataSave = () => {
        const { actions,commonState,state } = this.props.props;
        this.props.form.validateFields((err, values) => {
            if (!err) {
                values={
                    ...state.dispatchOrderInfo,
                    ...values
                }
                for (let attr in values) {
                    if (values[attr] === null||values[attr]=="") delete values[attr];
                }
                values.workOrderStatusDate = moment(values.workOrderStatusDate).format('YYYY-MM-DD HH:mm:ss');
                values.receiveTime = moment(values.reportDate).format('YYYY-MM-DD HH:mm:ss');
                values.completionTime = moment(values.workOrderStatusDate).format('YYYY-MM-DD HH:mm:ss');
                values.consumeHours = parseFloat(values.consumeHours);

                actions.dispatchWorkOrderSave(values, (msg) => {
                    if (msg.success) {
                        //更新数据
                        message.success("保存成功");

                        let param = {id: msg.data.workOrderId};
                        actions.dispatchOrderInfo(param, (json) => {
                        });
                        localStorage.setItem('workOrderId', msg.data.workOrderId );

                    } else {
                        message.error(msg.msg);
                    }
                });
            }
        });
    }
    componentDidUpdate() {
        const {state, actions} = this.props.props;
        if(state.getFormValues){
            actions.getFormValues(false);
            this.formDataSave();
        }

    }
    render() {
        const { getFieldDecorator } = this.props.form;
        const { state, commonState } = this.props.props;
        const data = state.dispatchOrderInfo;
        const persondata = commonState.personListData;
        const personList = persondata.list;
        //true:不可以修改  false:可以修改
        let ismodify=false;
        if(data!=null&&data.workOrderStatus!=null){
            if(data.workOrderStatus!="DHB"){
                ismodify=true;
            }

        }else{
            ismodify=true;
        }

        return (
            <div>
                <Form layout="vertical">
                        {
                            getFieldDecorator('actualExecutionPersonId',{//实际实行人ID
                                initialValue: data ? data.actualExecutionPersonId?data.actualExecutionPersonId:'':''
                            })(
                                <Input  disabled  type="hidden"/>
                            )
                        }
                    {
                        getFieldDecorator('consumeHours', {
                            initialValue: data? data.consumeHours? data.consumeHours :null: null,
                        })(
                            <Input type="hidden" />
                        )
                    }
                        {
                            getFieldDecorator('workOrderId', {
                                initialValue: data ? data.workOrderId?data.workOrderId:null : null
                            })(
                                <Input type="hidden" />
                            )
                        }
                        {
                            getFieldDecorator('workOrderNum', {
                                initialValue: data ? data.workOrderNum?data.workOrderNum:null : null
                            })(
                                <Input type="hidden" />
                            )
                        }
                    <Row gutter={16}>
                        <Col className="gutter-row" xs={{ span: 7 }}>
                            <FormItem
                                label="接报时间"
                            >
                                {
                                    getFieldDecorator('receiveTime',{

                                     //   initialValue: data ? data.receiveTime  : "",
                                        initialValue:data? data.receiveTime ? moment(data.receiveTime, 'YYYY-MM-DD HH:mm'):null : null,
                                        rules: [{
                                            required: true,message: '接报时间不能为空！'
                                        }]
                                    })(
                                         <DatePicker disabled={ismodify}
                                            showTime
                                            format="YYYY-MM-DD HH:mm:ss"
                                            placeholder="请选择接报时间"
                                            onChange={(onChange) => { }}
                                            onOk={(onOk) => { }}
                                        />
                                    )
                                }
                            </FormItem>
                        </Col>
                        <Col className="gutter-row" xs={{ span: 7 }}>
                            <FormItem
                                label="工单状态"
                            >
                                {
                                    getFieldDecorator('workOrderStatusDescription', {
                                        initialValue: data ? data.workOrderStatusDescription?data.workOrderStatusDescription:'' : ''
                                    })(
                                        <Input  disabled />
                                    )
                                }
                            </FormItem>
                        </Col>
                        <Col className="gutter-row" xs={{ span: 7 }}>
                            <FormItem
                                label="完成时间"
                            >
                                {
                                    getFieldDecorator('completionTime',{
                                      //  initialValue: data ? data.completionTime : ""
                                        initialValue: data?data.completionTime ? moment(data.completionTime, 'YYYY-MM-DD HH:mm') :null: null,
                                        rules: [
                                            { required: true, message: '完成时间不能为空！'}
                                        ]
                                    })(
                                         <DatePicker
                                                showTime
                                                disabled={ismodify}
                                                format="YYYY-MM-DD HH:mm:ss"
                                                placeholder="请选择完成时间"
                                                onChange={(onChange) => { }}
                                                onOk={(onOk) => { }}
                                            />
                                    )
                                }
                            </FormItem>
                        </Col>
                    </Row>
                    <Row gutter={16}>

                    <Col className="gutter-row" xs={{ span: 7 }}>

                        <FormItem
                            label="实际执行人"
                        >
                            {
                                getFieldDecorator('actualExecutionPerson',{
                                    initialValue: data ? data.actualExecutionPerson?data.actualExecutionPerson:'' :'',
                                    rules: [
                                        { required: true, message: '实际执行人不能为空！'}
                                    ]
                                })(
                                    ismodify?<Input  disabled />:<Input placeholder="请选择实际执行人" readonly  suffix={<Icon type="plus" onClick={this.personInputFocus} /> } />
                                )
                            }
                            <EamModal
                                width={800}
                                title={`选择实际执行人`}
                                ref={userAddModal => this.userAddModal = userAddModal}
                                onOk={this.taskStepsAddSave}
                                footer={null}
                                afterClose={this.taskStepsAfterClose}
                                className="select-person"
                            >
                                <Row gutter={16}>
                                    <Col className="gutter-row" span={ 24 }>
                                        <Table
                                            rowKey="id"
                                            pagination={false}
                                            dataSource={personList}
                                            columns={this.userColumns}
                                            rowSelection={this.rowSelection}
                                            bordered
                                            onChange={this.tableChange}
                                        />
                                        <Pagination
                                            total={persondata.total}
                                            className="pull-left title-pagination"
                                            current={this.state.currentPage}
                                            onChange={this.pageChange}
                                        />
                                    </Col>
                                </Row>
                                <div className="modal-footer clearfix">
                                    <Pagination
                                        total={persondata.total}
                                        className="pull-left"
                                        showTotal={(total, range) => `当前第${range[0]}-${range[1]}条 / 共${total}条`}
                                        current={this.state.currentPage}
                                        onChange={this.pageChange}
                                        style={{padding: 0}}
                                    />
                                    <Button type="primary" size="large" onClick={this.taskStepsClose}>取消</Button>
                                </div>
                            </EamModal>
                        </FormItem>
                    </Col>
                    <Col className="gutter-row" xs={{ span: 7 }}>
                        <FormItem
                            label="工时耗时 (小时 : 分钟)"
                        >
                            {
                                getFieldDecorator('consumeHours',{
                                    inintialValue : data ? data.consumeHours : '',
                                    rules: [
                                        { required: true, message: '工时耗时不能为空！'},
                                    ]
                                })(
                                    <InputGroup compact >
                                        {
                                            getFieldDecorator('consumeHours_hours', {
                                                initialValue: this.buildInitConsumeHoursValue(data?data.consumeHours:null, true),
                                            })(
                                                <InputNumber min={0} max={999} style={{ width: '44%', textAlign: 'center' }} onChange={(value) => this.onConsumeHoursValueChange(value, true)} placeholder="小时" disabled={ismodify}/>
                                            )
                                        }
                                        <InputNumber style={{ width: 30, pointerEvents: 'none', marginLeft: '-8px', marginRight: 0 }} placeholder=":" disabled />
                                        {
                                            getFieldDecorator('consumeHours_minute', {
                                                initialValue: this.buildInitConsumeHoursValue(data?data.consumeHours:null, false),
                                            })(
                                                <InputNumber min={0} max={60} style={{ width: '44%', textAlign: 'center' }} onChange={(value) => this.onConsumeHoursValueChange(value, false)} placeholder="分钟" disabled={ismodify}/>
                                            )
                                        }
                                    </InputGroup>

                                )
                            }
                        </FormItem>
                    </Col>
                </Row>
                    <Row gutter={16}>
                        <Col className="gutter-row" xs={{ span: 12 }}>
                            <FormItem
                                label="情况说明"
                            >
                                {
                                    getFieldDecorator('reportDescription',{
                                        initialValue: data ? data.reportDescription : '',
                                        rules: [
                                            { max: 200, message: '情况说明长度不能超过200字符长度！'}
                                        ]
                                    })(
                                        <Input type="textarea" placeholder="请输入情况说明" disabled={ismodify} className="eam-textarea" />
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

class WorkOrderThreeComponent extends React.Component {
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

        const { state, actions,commonActions,commonState } = this.props;
        const data=commonState.processExecutionRecord;
        const recordList = data.executionRecord || [];
        // 执行记录日期
        const recordDateArr = data.dateArr;
        let workOrderId =localStorage.getItem('workOrderId');
        if(workOrderId){
            workOrderId=true;
        }else{
            workOrderId=false;
        }


        return (
            <div className="eam-tab-page">
                <div className="eam-content">
                    <Collapse bordered={false} defaultActiveKey={['1', '2', '3']}>
                        <Panel header={<span className="label">工单信息 <Icon type="caret-down" /></span>} key="1" style={this.customPanelStyle}>
                            <NewFormComponent wrappedComponentRef={taskStepsAddForm => this.taskStepsAddForm = taskStepsAddForm} props={this.props}/>
                        </Panel>
                        <Panel header={<span className="label">图片信息 <Icon type="caret-down" /></span>} key="2" style={this.customPanelStyle}>
                            { workOrderId?
                            <Upload
                                quoteId={workOrderId}
                                hideButton={workOrderId}
                                quoteType="dispatchOrderImg_report"
                                commonActions={commonActions}
                                commonState={commonState}
                            />:<span>请保存工单后上传图片</span>
                            }
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

export default connect(mapStateToProps, buildActionDispatcher)(WorkOrderThreeComponent);