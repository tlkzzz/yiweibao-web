/** 
 * @Description: 缺陷管理-整改单-任务分派
 */
import React from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import actions from '../../actions/defect_document.js';
import EamModal from '../../components/common/modal.js';
import commonActions from '../../actions/common.js';
import { correspondenceJson, filterArrByAttr } from '../../tools/';
import moment from 'moment';

import { Icon, Button, Table, Pagination, Collapse, Form, Input, Row, Col, Select, Radio, DatePicker, Timeline, Upload, Modal,message  } from 'antd';
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
        let defaultRender = (text, record, key) => {
            return (
                <p>{text ? text : '-'}</p>
            )
        };
        this.param = {
            pageSize: 10,
            pageNum: 0
        }
        this.currentInp = '';
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
    }


    //人员数据加载
    getList = () => {
        const {commonActions,commonState} = this.props.props;
        this.setState({tableLoading: true});
        this.param={
            ...this.param,
            siteId:commonState.siteId,
            orgId:commonState.orgId,
           // productArray:["EAM"]
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
        form.setFieldsValue({'executionPersonId': id, 'executionPerson': name});
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
        // localStorage.setItem('workOrderIdSign', "DFP" );
        // let id =localStorage.getItem('workOrderId');
        // if(id!=null){
        //     this.getRepairWorkOrderInfo(id);
        // }
        // this.getList();
    }
    //保存
    formDataSave = () => {
        const { actions,commonState,state } = this.props.props;
        this.props.form.validateFields((err, values) => {
            values={
                ...state.dispatchOrderInfo,
                ...values
            }
            if (!err) {
                for (let attr in values) {
                    if (values[attr] === null||values[attr]=="") delete values[attr];
                }
                values.workOrderStatusDate = moment(values.workOrderStatusDate).format('YYYY-MM-DD HH:mm:ss');
                values.planCompleteTime = moment(values.planCompleteTime).format('YYYY-MM-DD HH:mm:ss');
              //  values.workOrderStatusDate = moment(values.workOrderStatusDate).format('YYYY-MM-DD HH:mm:ss');
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
            if(data.workOrderStatus!="DFP"){
                ismodify=true;
            }

        }
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
                        <Col className="gutter-row" xs={{ span: 7 }}>
                            <FormItem
                                label="监管人"
                            >
                                {
                                    getFieldDecorator('executionPerson', {
                                    initialValue: data ? data.executionPerson : '',
                                    rules: [
                                        { required: true, message: '监管人不能为空！'},
                                    ]
                                    })(
                                        !ismodify?<Input placeholder="请选择执行人" disabled suffix={<Icon type="plus" onClick={this.personInputFocus} /> } />:<Input  disabled />
                                    )
                                }
                            </FormItem>
                            <EamModal
                                width={800}
                                title={`选择执行人`}
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
                        </Col>
                        <Col className="gutter-row" xs={{ span: 7 }}>
                            <FormItem
                                label="委托监管"
                            >
                                {
                                    getFieldDecorator('siteName', {
                                        initialValue: data ? data.siteName : commonState.siteName
                                    })(
                                        <Input placeholder="站点" disabled />
                                    )
                                }
                            </FormItem>
                        </Col>
                        <Col className="gutter-row" xs={{ span: 7 }}>
                            <FormItem
                                label="分派人"
                            >
                                {
                                    getFieldDecorator('workOrderStatusDescription', {
                                        initialValue: data ? data.workOrderStatusDescription : ''
                                    })(
                                        <Input disabled  />
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
                                        initialValue: data ? data.workOrderStatusDescription : ''
                                    })(
                                        <Input disabled  />
                                    )
                                }
                            </FormItem>
                        </Col>
                    </Row>
                    <Row gutter={16}>
                        <Col className="gutter-row" xs={{ span: 7 }}>
                            <FormItem
                                label="监管班组"
                            >
                                {
                                    getFieldDecorator('planCompleteTime', {
                                    initialValue: data ? data.planCompleteTime : ""
                                    })(
                                        <Input disabled  />
                                    )
                                }
                            </FormItem>
                        </Col>
                        <Col className="gutter-row" xs={{ span: 7 }}>
                            <FormItem
                                label="分派人"
                            >
                                {
                                    getFieldDecorator('dispatchPersonName', {
                                    initialValue: data ? data.dispatchPersonName : commonState.personName
                                })(
                                        <Input placeholder="分派人" disabled/>
                                    )
                                }

                            </FormItem>
                        </Col>
                        <Col className="gutter-row" xs={{ span: 7 }}>
                            <FormItem
                                label="响应时间"
                            >
                                {
                                    getFieldDecorator('workOrderStatusDate', {
                                        initialValue: data ? data.workOrderStatusDate : '',
                                    })(
                                        <Input  disabled />
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

class WorkOrderTwoComponent extends React.Component {
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
        const { state, actions } = this.props;
        // 执行记录数据
        const recordList =state.repairWorkFlowHistory;
        // 执行记录日期
        const recordDateArr = filterArrByAttr(recordList, 'startTime');
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

export default connect(mapStateToProps, buildActionDispatcher)(WorkOrderTwoComponent);