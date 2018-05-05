/** 
 * @Description: 缺陷管理-整改单-执行汇报
 */
import React from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import actions from '../../actions/defect_document.js';
import EamModal from '../../components/common/modal.js';
import commonActions from '../../actions/common.js';
import { correspondenceJson, filterArrByAttr } from '../../tools/';
import Upload from '../../components/common/upload.js';
import moment from 'moment';

import { Icon, Button, Table, Pagination, Collapse,InputNumber, Form, Input, Row, Col, Select, Radio, DatePicker, Timeline, Modal,message  } from 'antd';
const Panel = Collapse.Panel;
const FormItem = Form.Item;

class FormComponent extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            selectPersonModalShow: false,
            currentPage: 1,
            assignPerson: { // 分派人
                id: '',
                value: '',
            },
            executorPerson: { // 执行人
                id: '',
                value: '',
            },
            entrustExecutePerson: { // 执行委托人
                id: '',
                value: '',
            },
            visibleProcess: false,
        }
        this.param = {
            pageSize: 10,
            pageNum: 0
        }
        this.userColumns = [
            {
                title: '姓名',
                dataIndex: 'name',
                key: 'name',
                sorter: true,
                render: defaultRender
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
            {
                title: '年龄',
                dataIndex: 'gender',
                key: 'gender',
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
                            <Button type="primary" onClick={() => {this.selectCheckPerson(record.personId, record.name)}}>选择</Button>
                        </div>
                    )
                }
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
            siteId:commonState.siteId,
            orgId:commonState.orgId,
          //  productArray:["EAM"]
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

        const { actions } = this.props.props;
        this.props.form.validateFields((err, values) => {
            if (!err) {

                actions.dispatchWorkOrderSave(values);
            }
        });
    }
    sendProcessHide = () => {
        this.setState({ visibleProcess: false })
    }
    getRepairWorkOrderInfo = (id) => {
        const param = {id: id};
        const {actions} = this.props.props;
        actions.dispatchOrderInfo(param, (json) => {
            if(json.processInstanceId!=null){
                this.getExecutionRecord(json.processInstanceId);//开始查询执行记录
            }
        });
    }

    //获取执行记录
    getExecutionRecord=(processInstanceId)=>{
        let  param = { processInstanceId: processInstanceId}
        const {actions} = this.props.props;
        actions.repairOrderFlowHistory(param, (json) => {
        });

    }

    componentWillMount() {
        // let id =localStorage.getItem('workOrderId');
        // localStorage.setItem('workOrderIdSign', "DHB" );
        // if(id!=null){
        //     this.getRepairWorkOrderInfo(id);
        // }
        // this.getList();
    }
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
        // const {state, actions} = this.props.props;
        // if(state.getFormValues){
        //     actions.getFormValues(false);
        //     this.formDataSave();
        // }

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

        }
        let dtb;
        let region=[];
        return (
            <div>
                <Form layout="vertical">
                        {
                            getFieldDecorator('workOrderNum', {
                                initialValue: data ? data.workOrderNum : null
                            })(
                                <Input type="hidden" />
                            )
                        }
                    <Row gutter={16}>
                        <Col className="gutter-row" xs={{ span: 5 }}>
                            <FormItem
                                label="完成时间"
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
                        <Col className="gutter-row" xs={{ span: 5 }}>
                            <FormItem
                                label="实际监管人"
                            >
                                {
                                    getFieldDecorator('workOrderStatusDescription', {
                                        initialValue: data ? data.workOrderStatusDescription : ''
                                    })(
                                        <Input  disabled />
                                    )
                                }
                            </FormItem>
                        </Col>
                        <Col className="gutter-row" xs={{ span: 5 }}>
                            <FormItem
                                label="是否挂起"
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
                        <Col className="gutter-row" xs={{ span: 5 }}>
                            <FormItem
                                label="工单状态"
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

                      <Col className="gutter-row" xs={{ span: 5 }}>

                        <FormItem
                            label="工时"
                        >
                            {
                                getFieldDecorator('actualExecutionPerson',{
                                    initialValue: data ? data.actualExecutionPerson :'',
                                    rules: [
                                        { required: true, message: '实际执行人不能为空！'}
                                    ]
                                })(
                                    <Input  disabled />
                                )
                            }
                        </FormItem>
                    </Col>
                      <Col className="gutter-row" xs={{ span: 5 }}>
                            <FormItem
                                label="实际执行"
                            >
                                {
                                    getFieldDecorator('workOrderStatusDescription', {
                                        initialValue: data ? data.workOrderStatusDescription : ''
                                    })(
                                        <Input  disabled />
                                    )
                                }
                            </FormItem>
                        </Col>
                      <Col className="gutter-row" xs={{ span: 5 }}>
                        <FormItem
                            label="挂起类型"
                        >
                            {
                                getFieldDecorator('consumeHours',{
                                    inintialValue : data ? data.consumeHours : '',
                                })(
                                    <Select onChange={this.getBuildingNumber} disabled={dtb} size="large"
                                            style={{width: '100%'}}>
                                        {
                                            region.map((item, i) => <Option key={i}
                                                                            value={item.value}>{item.description}</Option>)
                                        }
                                    </Select>
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
const NewFormComponent = Form.create()(FormComponent)

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
    }

    render() {
        const { state, actions,commonActions,commonState } = this.props;

        // 执行记录数据
        const recordList =state.repairWorkFlowHistory;
        // 执行记录日期
        const recordDateArr = filterArrByAttr(recordList, 'startTime');
        let workOrderId =localStorage.getItem('workOrderId');
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

                                        let time = item.startTime.split(' ')[1];

                                        return (
                                            <Timeline.Item
                                                key={i}
                                                dot={
                                                    <div>
                                                        <div className={recordDateArr[i] ? 'date' : ''}>{recordDateArr[i] ? recordDateArr[i] : ''} {recordDateArr[i] ? <i></i> : ''}</div>
                                                        <div>
                                                            <Icon className="pull-right" type={i === 0 ? 'clock-circle-o' : 'check-circle-o'} style={{ fontSize: '16px' }} />
                                                            <span className="pull-right time">{time.slice(0, 5)}</span>
                                                        </div>
                                                    </div>
                                                }
                                            >
                                                <h2>
                                                    <span className="name">{item.name}</span>
                                                    <span> 持续时间：{item.durationInMillis}</span>
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