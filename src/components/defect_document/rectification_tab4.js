/** 
 * @Description: 缺陷管理-整改单-确认验收
 */
import React from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import actions from '../../actions/defect_document.js';
import EamModal from '../../components/common/modal.js';
import SelectPerson from '../../components/common/select_person.js';
import commonActions from '../../actions/common.js';
import Upload from '../../components/common/upload.js';
import moment from 'moment';
import { correspondenceJson, filterArrByAttr } from '../../tools/';
import { Icon, Button, Table, Pagination, Collapse, Form, Input, Row, Col, Select, Radio, DatePicker, Timeline, Modal,message  } from 'antd';
const Panel = Collapse.Panel;
const FormItem = Form.Item;

class FormComponent extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            selectPersonModalShow: false,
            currentPage: 1,
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

    //验收人选择框
    personInputFocus = (selected) => {
      //  this.userAddModal.modalShow();

        let selectedPerson = {};
        switch (this.state.currentInp) {
            case 'acceptPerson': {
                selectedPerson = {
                    acceptPersonId: filterArrByAttr(selected, 'personId'),
                    acceptPerson: filterArrByAttr(selected, 'name')
                };
            } break;
        }
        this.props.form.setFieldsValue(selectedPerson);
    }
    // 分页事件
    pageChange = (page, pageSize) => {
        this.setState({ currentPage: page });
        this.param.pageNum = page;
        this.getList();
    }
    //验收人选择弹框渲染
    taskStepsClose = () => {
        this.userAddModal.modalHide();
    }
    //验收人选择赋值
    selectCheckPerson = (id,name) => {
        //给人员赋值

        const {form} = this.props;
        form.setFieldsValue({'acceptPersonId': id, 'acceptPerson': name});
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
        // localStorage.setItem('workOrderIdSign', "DYS" );
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
                values.acceptTime = moment(values.acceptTime).format('YYYY-MM-DD HH:mm:ss');
                values.workOrderStatusDate = moment(values.workOrderStatusDate).format('YYYY-MM-DD HH:mm:ss');
                actions.dispatchWorkOrderSave(values, (msg) => {
                    if (msg.success) {
                        //更新数据
                        message.success("保存成功");

                        let  param = {id: msg.data.workOrderId};
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
            if(data.workOrderStatus!="DYS"){
                ismodify=true;
            }

        }

        return (
            <div>
                <Form layout="vertical">
                    {
                        //验收人ID
                        getFieldDecorator('acceptPersonId',{
                            initialValue: data ? data.acceptPersonId : ''
                        })(
                            <Input  disabled   type="hidden"/>
                        )
                    }
                    <Row gutter={16}>

                        <Col className="gutter-row" xs={{ span: 7 }}>
                            <FormItem
                                label="确认解决"
                            >
                                {
                                    getFieldDecorator('acceptPerson5',{
                                        initialValue: data ? data.acceptPerson : '',
                                        rules: [
                                            { required: true, message: '验收人不能为空！'}
                                        ]
                                    })(
                                        ismodify? <Input  disabled />:<Input placeholder="请选择验收人" disabled suffix={<Icon type="plus" onClick={() => {
                                                this.setState({
                                                    selectPersonModalShow: true,
                                                    currentInp: 'acceptPerson'
                                                });
                                            }} /> }/>
                                    )
                                }
                                <SelectPerson
                                multiple
                                visible={this.state.selectPersonModalShow}
                                selectPersonModalHide={() => { this.setState({ selectPersonModalShow: false }) }}
                                onOk={this.personInputFocus.bind(this)}
                            />

                            </FormItem>
                        </Col>
                        <Col className="gutter-row" xs={{ span: 7 }}>
                            <FormItem
                                label="工单状态"
                            >
                                {
                                    getFieldDecorator('workOrderStatusDescription4', {
                                        initialValue: data ? data.workOrderStatusDescription : ''
                                    })(
                                        <Input  disabled />
                                    )
                                }
                            </FormItem>
                        </Col>
                    </Row>
                    <Row gutter={16}>
                        <Col className="gutter-row" xs={{ span: 7 }}>
                            <FormItem
                                label="验收时间"
                            >
                                {
                                    getFieldDecorator('acceptTime3',{
                                      //  initialValue: data ?data.acceptTime: ""
                                        initialValue:data? data.acceptTime ? moment(data.acceptTime, 'YYYY-MM-DD HH:mm') :null:null,
                                        rules: [
                                            { required: true, message: '验收时间不能为空！'}
                                        ]
                                    })(
                                          <DatePicker disabled={ismodify}
                                            showTime
                                            format="YYYY-MM-DD HH:mm:ss"
                                            placeholder="请选择验收时间"
                                            onChange={(onChange) => { }}
                                            onOk={(onOk) => { }}
                                        />
                                    )
                                }
                            </FormItem>
                        </Col>
                        <Col className="gutter-row" xs={{ span: 12 }}>
                            <FormItem
                                label="验收人"
                            >
                                {
                                    getFieldDecorator('acceptDescription2',{
                                        initialValue : data ? data.acceptDescription : '',
                                        rules: [
                                            { max: 200, message: '验收说明长度不能超过200字符长度！'}
                                        ]
                                    })(
                                        <Input placeholder="请输入验收说明11" disabled={ismodify} />
                                    )
                                }
                            </FormItem>
                        </Col>
                    </Row>
                    <Row gutter={16}>
                        <Col className="gutter-row" xs={{ span: 12 }}>
                            <FormItem
                                label="验收说明"
                            >
                                {
                                    getFieldDecorator('acceptDescription1',{
                                        initialValue : data ? data.acceptDescription : '',
                                        rules: [
                                            { max: 200, message: '验收说明长度不能超过200字符长度！'}
                                        ]
                                    })(
                                        <Input type="textarea" placeholder="请输入验收说明" className="eam-textarea" disabled={ismodify} />
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

class WorkOrderFourComponent extends React.Component {
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
        const { state, actions,commonState,commonActions } = this.props;
        // 执行记录数据
        const recordList =state.repairWorkFlowHistory;
        // 执行记录日期
        const recordDateArr = filterArrByAttr(recordList, 'startTime');
        let workOrderId;
        return (
            <div className="eam-tab-page">
                <div className="eam-content">
                    <Collapse bordered={false} defaultActiveKey={['1', '2', '3']}>
                        <Panel header={<span className="label">工单信息 <Icon type="caret-down" /></span>} key="1" style={this.customPanelStyle}>
                            <NewFormComponent wrappedComponentRef={taskStepsAddForm => this.taskStepsAddForm = taskStepsAddForm} props={this.props} />
                        </Panel>
                        <Panel header={<span className="label">图片信息 <Icon type="caret-down" /></span>} key="2" style={this.customPanelStyle}>
                            <Upload
                                quoteId={workOrderId}
                                quoteType="dispatchOrderImg_report"
                                commonActions={commonActions}
                                commonState={commonState}
                            />
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

export default connect(mapStateToProps, buildActionDispatcher)(WorkOrderFourComponent);