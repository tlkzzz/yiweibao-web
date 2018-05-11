/** 
 * @Description 待办任务
 */
import React from 'react';
import {bindActionCreators} from 'redux';
import {Link} from 'react-router';
import {connect} from 'react-redux';
import PubSub  from 'pubsub-js';
import {pubTopic} from '../../tools/constant';
import actions from '../../actions/my_task.js';
import commonActions from '../../actions/common.js';
import  maintenanceActions from '../../actions/maintenance.js'
import moment from 'moment';
import EAModal from '../../components/common/modal.js';
import SearchInp from '../../components/common/search_inp.js';
import SelectPerson from '../../components/common/select_person.js';
import { correspondenceJson, filterArrByAttr } from '../../tools/';
import {Icon, Button, Table, Pagination,Select,Form,Input,DatePicker, Menu, Modal, message, Badge} from 'antd';

const confirm = Modal.confirm;
const Option = Select.Option;
const FormItem = Form.Item;

class BacklogComponent extends React.Component {
    constructor(props) {
        super(props);
        PubSub.subscribe(pubTopic.task.TO_TASK.BATCH_ASSIGNMENT, this.getDispatch);
        this.state = {
            tableLoading: false,
            currentPage: 1,
        }
        const {state, actions, commonState} = this.props;
        this.queryState=state;
        this.queryActions=actions;
    }

    // 模糊查询
    fuzzyQuery = (keywords) => {
        PubSub.publish(pubTopic.task.BACKLOG_QUERY_KEYWORD, keywords);
        const {state} = this.props;
        switch (state.currentTab) {
            case "ALL":
                PubSub.publish(pubTopic.task.TO_TASK.ALL, keywords);
                break;
            case "patrolOrder"://巡检
                PubSub.publish(pubTopic.task.TO_TASK.PATROLORDER, keywords);
                break;
            case "workOrder"://维保
                PubSub.publish(pubTopic.task.TO_TASK.WORKODER, keywords);
                break;
            case "headquartersDaliyTask"://例行工作单
                PubSub.publish(pubTopic.task.TO_TASK.DAILYTASK, keywords);
                break;
            case "dispatchOrder"://派工单
                PubSub.publish(pubTopic.task.TO_TASK.DISPACHORDER, keywords);
                break;
            case "repairOrder"://报修
                PubSub.publish(pubTopic.task.TO_TASK.REPAIRORDER, keywords);
                break;
        }
    }

    getMyTaskLogo = () => {
        const {state, actions, commonState} = this.props;
        let param = {
            siteId: commonState.siteId
        }
        actions.myTaskFindLogoToDo(param)
    }

    //批量处理
    getBatch=()=>{
        const {state, actions, commonState} = this.props;
        const myTaskSelect=state.myTaskSelect;
       let  returnValue=this.checkWorkOrder(myTaskSelect);  //验证
      if(returnValue.orderType=="workOrder"
          &&returnValue.orderStatus=="DFP"){
          let ids=filterArrByAttr(myTaskSelect,'businessKey');
          state.myTaskSelectId=filterArrByAttr(myTaskSelect,'businessKey');;
          this.workOrderchModal.modalShow();
      }
    }

    //验证数据是否符合规则
    checkWorkOrder=(data)=>{
        let orderType=null;
        let orderStatus=null;
        let sign=true;
        for(let att in data){
            //首先判断当前数据是否是维保和待分派
            //
            if(data[att].orderStatus!="DFP"||data[att].orderType!="workOrder"){//此处限制工单类型和状态类型，如需扩展修改此处条件即可
                message.error("请选择待分派维保工单");
                sign=false;
                orderStatus=null;
                orderType=null;
                break;
            }else{
                orderStatus=data[att].orderStatus;
                orderType=data[att].orderType;
            }
            //逐个对比
           if(att!=0&&!sign){
              if(data[att].orderType !=data[att-1].orderType&&data[att].orderStatus!=data[att-1].orderStatus){
                  message.error("请选择同类型的待分派维保工单");
                  sign=false;
                  orderStatus=null;
                  orderType=null;
                  break;
              }else{
                  orderStatus=data[att].orderStatus;
                  orderType=data[att].orderType;
              }
           }
        }
        let returnValue={
            sign:sign,
            orderStatus:orderStatus,
            orderType:orderType
        };
        return returnValue;
    }
    //弹框关闭
    getDispatch=(msg, data)=>{
        if(data=="WORKORDER_CLOSE"){
            this.workOrderchModal.modalHide()
        }
    }
    saveDispatch=()=>{

        PubSub.publish(pubTopic.task.TO_TASK.BATCH_ASSIGNMENT, 'WORKORDER_SAVE' );

    }


    componentWillMount() {
        const {state} = this.props;
        state.batchAssignmentButton = false;//派工按钮初始化隐藏
        this.getMyTaskLogo();
    }

    render() {
        const {children, state} = this.props;
        const myTaskLogo = state.myTaskLogo;
        let none="block";
        if(state.taskPageData){
            let list=state.taskPageData.list
            none="none";
            for(let att in list){
                if(list[att].orderType=="workOrder"&&list[att].orderStatus=="DFP"){
                    console.info("block");
                    none="block";
                    break;
                }
            }
        }else{
            none="none"
        }
        return (
            <div>
                <div className="top-bar clearfix">
                    <div className="details-title pull-left">
                        <h3>待办任务yyyy</h3>
                        <div className="fuzzy-query"><SearchInp onEnter={(text) => {
                            this.fuzzyQuery(text)
                        }}/></div>
                        <p></p>
                    </div>
                    <div className="eam-tab-nav">
                        <Link activeClassName="active" to="/task/backlog/backlog_tab1">全部</Link>
                        <Badge count={myTaskLogo ? myTaskLogo.repairOrder : 0} overflowCount={100}>
                            <Link activeClassName="active" to="/task/backlog/backlog_tab2">报修工单</Link>
                        </Badge>
                        <Badge count={myTaskLogo ? myTaskLogo.workOrder : 0} overflowCount={100}>
                            <Link activeClassName="active" to="/task/backlog/backlog_tab3">维保工单</Link>
                        </Badge>
                        <Badge count={myTaskLogo ? myTaskLogo.dispatchOrder : 0} overflowCount={100}>
                            <Link activeClassName="active" to="/task/backlog/backlog_tab4">派工工单</Link>
                        </Badge>
                        <Badge count={myTaskLogo ? myTaskLogo.patrolOrder : 0} overflowCount={100}>
                            <Link activeClassName="active" to="/task/backlog/backlog_tab5">巡检工单</Link>
                        </Badge>
                        <Badge count={myTaskLogo ? myTaskLogo.headquartersDaliyTask : 0} overflowCount={100}>
                            <Link activeClassName="active" to="/task/backlog/backlog_tab6">例行工作单</Link>
                        </Badge>
                        {/*<Button disabled={!state.batchAssignmentButton} type="primary" className="pull-right" onClick={this.getAll}> 批量派工 </Button>*/}
                     <Button style={{display: none}} type="primary" className="pull-right" onClick={this.getBatch}> 批量派工 </Button>

                    </div>

                    <EAModal
                        title={'维保工单'}
                        ref={workOrderchModal => this.workOrderchModal = workOrderchModal}
                        afterClose={() => { this.workOrderchModal.modalHide() }}
                    >
                        < WorkOrderStepsForm  props={this.props} />
                        <div className="modal-footer clearfix">
                            <Button size="large" onClick={() => { this.workOrderchModal.modalHide() }}>取消</Button>
                            <Button type="primary" size="large" onClick={this.saveDispatch}>确定</Button>
                        </div>
                    </EAModal>
                </div>
                {children}
            </div>
        )
    }
}

// 批量派工
class workOrderFormComponent extends React.Component {
    constructor(props) {
        super(props);

        //订阅父页面的消息
        PubSub.subscribe(pubTopic.task.TO_TASK.BATCH_ASSIGNMENT, this.saveDispatch );
        this.formItemLayout = {
            labelCol: {
                xs: { span: 24 },
                sm: { span: 6 },
            },
            wrapperCol: {
                xs: { span: 24 },
                sm: { span: 14 },
            },
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
            // productArray:["EAM"]
        }
        commonActions.personGetList(this.param, () => {
            this.setState({tableLoading: false});
        });
    }


    saveDispatch=(msg, data)=>{
        const {commonActions,commonState,state,maintenanceActions} = this.props.props;
        if(data=="WORKORDER_SAVE"){
            this.props.form.validateFields((err, values) => {
                if (!err) {
                    values.planStartDate = moment(values.planStartDate).format('YYYY-MM-DD HH:mm:ss');
                    values.planCompletionDate=moment(values.planCompletionDate).format('YYYY-MM-DD HH:mm:ss');
                    values.ids=values.ids.splice(",");
                  //  values.processStatus="agree";
                    maintenanceActions.batchAssignment(values,(json)=>{
                      if(json.success){
                          message.success(json.msg);
                          PubSub.publish(pubTopic.task.TO_TASK.BATCH_ASSIGNMENT, 'WORKORDER_CLOSE' );
                          PubSub.publish(pubTopic.task.TO_TASK.MYTASK_REFRESH,state.currentTab);
                      }else{
                          message.error(json.msg);
                      }

                    })

                }
            });
        }

    }

//验收人选择框
    personInputFocus = (selected) => {
        let selectedPerson = {};
        switch (this.state.currentInp) {
            case 'acceptPerson': {
                selectedPerson = {
                    assignPersonId: filterArrByAttr(selected, 'personId'),
                    acceptPerson: filterArrByAttr(selected, 'name')
                };
            } break;
        }
        console.info(selectedPerson);
        this.props.form.setFieldsValue(selectedPerson);



    }

    componentWillMount() {
        this.getList();
    }



    render () {
        const { getFieldDecorator } = this.props.form;
        const { data,commonState,state } = this.props.props;
        const ids= state.myTaskSelectId;

        return (
            <Form>
                /**
                 * 隐藏值
                 */
                {
                    getFieldDecorator('ids', {
                        initialValue: state.myTaskSelectId
                    })(
                        <Input   type="hidden" />
                    )

                }
                {
                    getFieldDecorator('assignPersonId', {
                        initialValue: null
                    })(
                        <Input  type="hidden" />
                    )

                }
                {
                    getFieldDecorator('processStatus', {
                        initialValue: "agree"
                    })(
                        <Input  type="hidden" />
                    )

                }
                <FormItem
                    {...this.formItemLayout}
                    label="执行人"
                >
                    {
                        getFieldDecorator('acceptPerson', {
                            initialValue: null,
                            rules: [{ required: true, message: '执行人' }],
                        })(
                            <Input placeholder="请选择验收人" disabled suffix={<Icon type="plus" onClick={() => {
                                this.setState({
                                    selectPersonModalShow: true,
                                    currentInp: 'acceptPerson'
                                });
                            }} /> }/>
                        )
                    }
                </FormItem>
                <FormItem
                    {...this.formItemLayout}
                    label="计划开始时间"
                >
                    {
                        getFieldDecorator('planStartDate', {
                            initialValue: null,
                            rules: [{ required: true, message: '计划开始时间不能为空' }],
                        })(
                            <DatePicker style={{ width: '100%' }}
                                        showTime
                                        format="YYYY-MM-DD HH:mm:ss"
                                        placeholder="请选择计划开始时间"
                                        onChange={(onChange) => { }}
                                        onOk={(onOk) => { }}
                            />
                        )
                    }
                </FormItem>
                <FormItem
                    {...this.formItemLayout}
                    label="计划结束时间"
                >
                    {
                        getFieldDecorator('planCompletionDate', {
                            initialValue: null,
                            rules: [{ required: true, message: '计划结束时间不能为空' }],
                        })(
                            <DatePicker
                                        showTime
                                        style={{ width: '100%' }}
                                        format="YYYY-MM-DD HH:mm:ss"
                                        placeholder="请选择计划结束时间"
                                        onChange={(onChange) => { }}
                                        onOk={(onOk) => { }}
                            />
                        )
                    }
                </FormItem>
                <FormItem
                    label="说明"
                >
                    {
                        getFieldDecorator('description', {
                            initialValue: null
                        })(
                            <Input type="textarea" placeholder="请填写说明" className="eam-textarea" />
                        )
                    }
                </FormItem>
                <SelectPerson
                    multiple
                    visible={this.state.selectPersonModalShow}
                    selectPersonModalHide={() => { this.setState({ selectPersonModalShow: false }) }}
                    onOk={this.personInputFocus.bind(this)}
                />
            </Form>
        )
    }
}
const WorkOrderStepsForm = Form.create()(workOrderFormComponent);
function mapStateToProps(state) {
    return {
        state: state.my_task,
        commonState: state.common,
        maintenanceState:state.maintenance
    }
}


function buildActionDispatcher(dispatch) {
    return {
        actions: bindActionCreators(actions, dispatch),
        commonActions: bindActionCreators(commonActions, dispatch),
        maintenanceActions: bindActionCreators(maintenanceActions, dispatch),
    }
}

export default connect(mapStateToProps, buildActionDispatcher)(BacklogComponent);