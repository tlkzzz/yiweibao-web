/** 
 * @Description 待办任务-维保工单
 */


import React from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { Link ,browserHistory} from 'react-router';
import PubSub  from 'pubsub-js';
import { pubTopic } from '../../tools/constant';
import actions from '../../actions/main.js';
import Multiselect from '../../components/common/multiselect.js';
import commonActions from '../../actions/common.js';
import SearchInp from '../../components/common/search_inp.js';//模糊查询
import MoreOperations from '../../components/common/more_operations.js';
import maintenanceActions from '../../actions/maintenance.js'
import moment from 'moment';
import EAModal from '../../components/common/modal.js';
import SelectPerson from '../../components/common/select_person.js';
import { correspondenceJson, filterArrByAttr } from '../../tools/';
import {Icon, Button, Table, Pagination,Select,Form,Input,DatePicker, Menu, Modal, message, Badge, Row, Col} from 'antd';
const confirm = Modal.confirm;
const Option = Select.Option;
const FormItem = Form.Item;

import Dropdown from '../../components/common/dropdown.js';

class BacklogMaintenanceWorkOrderComponent extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            tableLoading: false,
            currentPage: 1,
            selectedRowKeys: [],
            rowSelection: null,
        }
        PubSub.subscribe(pubTopic.task.TO_TASK.WORKODER, this.queryKeyword );
        PubSub.subscribe(pubTopic.task.TO_TASK.MYTASK_REFRESH, this.myTaskRefresh);
        //表格多选
        const { parentProps } = this.props;
        const { actions,commonState,state } = parentProps;
        this.queryAction=actions;
        this.queryState = state;
        this.param = {
            orgId: commonState.orgId,
            siteId: commonState.siteId,
            sorts:'createTime desc',
            pageNum: 1,
            pageSize: 10,
        };
        let defaultRender = (text, record, key) => {
            return (
                <p>{text ? text : '-'}</p>
            )
        };
        //表格字段
        this.columns = [
            {
                title: '工单编号',
                dataIndex: 'orderNum',
                key: 'orderNum',
                // sorter: true,
                render: (text, record, key) => {
                    return (
                        <p><span className="order-number" onClick={() => {this.jumpToTabPage(record)}}>{text ? text : '-'}</span></p>
                    )
                }
            },
            {
                title: '描述',
                dataIndex: 'orderDescription',
                key: 'orderDescription',
                // sorter: true,
                render: defaultRender
            },
            {
                title: '任务类型',
                dataIndex: 'orderType',
                key: 'orderType',
                // sorter: true,
                render: (text, record, key) => {
                    text = this.getTranslate(text, record, "taskType");
                    return (
                        <p>{text ? text : '-'}</p>
                    )
                }
            },

            {
                title: '状态',
                dataIndex: 'orderStatus',
                key: 'orderStatus',
                sorter: true,
                // render: defaultRender
                render: (text, record, key) => {
                    text = this.getTranslate(text, record, "status");
                    return (
                        <p>{text ? text : '-'}</p>
                    )
                }
            },
            {
                title: '任务时间',
                dataIndex: 'createTime',
                key: 'createTime',
                sorter: true,
                render: defaultRender
            },
            // {
            //     title: '操作',
            //     dataIndex: '4',
            //     key: '4',
            //     width: 120,
            //     render: (text, record, key) => {
            //         return (
            //             <div className="table-icon-group">
            //                 <Icon
            //                     type="delete"
            //                     onClick={() => {
            //                         this.showConfirm(record.id, record.workOrderNum)
            //                     }}
            //                 />
            //             </div>
            //         )
            //     }
            // },
        ];
    }

    //刷新当前页面
    myTaskRefresh=(msg,data)=>{
        const {state} = this.props.parentProps;
        if(data=="workOrder"){
            this.queryAction.myTaskBacklogGetMaintenanceList(this.param);
        }
    }
    //跳转
    jumpToTabPage = (record) => {
        let status;
        let json = {};
         if(record.orderStatus==undefined
            &&record.orderStatus==null){
            message.error("数据异常");
            return;
        }
        try {
            switch(record.orderType)
           {
            case "workOrder"://维保工单
                // 后端返回英文显示中文的对应数据
                this.workOrderCorrJson  = correspondenceJson.workOrder;	//维保
                status = record.orderStatus;
                status = this.workOrderCorrJson[status];
                json.id = record.businessKey;
                json.process = status.process;
                json.status = record.orderStatus;
                json.workOrderNum = record.orderNum;
                localStorage.setItem('workOrder', JSON.stringify(json));
                browserHistory.push(`/maintenance/work_order/${status.path}?from=/task/backlog/backlog_tab3`);
                break;
            default:
                message.error("数据异常");
            }
        } catch (e) {
            message.error("数据异常");
        }
    }
	// 表格事件-排序
    tableChange = (pagination, filters, sorter) => {
        const {state} = this.props.parentProps;
        state.batchAssignmentButton=false;
        if (sorter.order) {
            let sorterOrder = sorter.order;
            let endIndex = sorterOrder.indexOf('end');
            sorterOrder = sorterOrder.slice(0, endIndex);
            this.param.sorts = `${sorter.field} ${sorterOrder}`;
        } else {
            this.param.sorts = 'createTime desc';
        }
        this.queryAction.myTaskBacklogGetMaintenanceList(this.param);
    }
    //此代码可以抽取公共方法
    getTranslate = (text, record, type) => {
        const {commonState, commonActions,state} = this.props.parentProps;
        const taskTypeData = commonState.taskType;
        if (type == "taskType") {//任务类型
            for (let attr in taskTypeData) {
                if (taskTypeData[attr].value == text) {
                    return taskTypeData[attr].description;
                }
            }
        } else if (type == "status") {//状态
            let statusData = state.myTaskStatus;
            for (let var2 in statusData) {
                if (statusData[var2].value == text) {
                    return statusData[var2].description;
                }
            }
        }
        return text;
    }
    // 分页事件
    pageChange = (page, pageSize) => {
        const { state } = this.props.parentProps;
        this.setState({ currentPage: page });
        this.param.pageNum = page;
        this.queryAction.myTaskBacklogGetMaintenanceList(this.param)
    }
    //查询工单状态过滤
    queryStatus=(status)=>{
        if(status){
            this.param.orderStatus = status;
        }else{
            this.param.orderStatus = '';
        }
        this.queryAction.myTaskBacklogGetMaintenanceList(this.param);
    }
    queryKeyword = (msg,data) =>{
        if(data){
            this.param.word = data;
        }else{
            this.param.word = '';
        }
        this.queryAction.myTaskBacklogGetMaintenanceList(this.param);
    }
    //获取选中值
    tableSelectChange = (selectedRowKeys,selectedRows) => {
        const {state} = this.props.parentProps;
        state.myTaskSelect=[];//先清空
        state.myTaskSelect=selectedRows;
        this.setState({selectedRowKeys});
    }
    componentWillMount () {
        const { parentProps } = this.props;
        const { actions,state,commonState } = parentProps;
        actions.myTaskBacklogGetMaintenanceList(this.param);
    }
    render () {
        const { parentProps } = this.props;
        const { state } = parentProps;
        const data = state.taskPageData;
        const list =  data==null?[]:data.list;


        const rowSelection = this.props.rowSelection ? 
        {
            selectedRowKeys: this.state.selectedRowKeys,
            onChange: this.tableSelectChange,
        } :
        null;

        return (
            <div className="eam-content-inner">
                <Table
                    rowKey="taskId"
                    loading={this.state.tableLoading}
                    pagination={false}
                    dataSource={list}
                    columns={this.columns}
                    rowSelection={rowSelection}
                    bordered
                    onChange={this.tableChange}
                    className="task-eam-card"
                />
                <Pagination
                    total={data.total}
                    showTotal={(total, range) => `当前第${range[0]}-${range[1]}条 / 共${total}条`}
                    current={this.state.currentPage}
                    showQuickJumper
                    onChange={this.pageChange}
                />
            </div>
        )
    }
}

class BacklogThreeComponent extends React.Component {
    constructor(props) {
        super(props);
        // 高级筛选选项数据
        // this.seniorFilterSelectArr = [
        //     [{description: '待汇报', value: "DHB"},
        //         {description: '待提报', value: "DTB"},
        //         {description: '待验收', value: "DYS"},
        //         {description: '待分派', value: "DFP"},
        //         {description: '待接单', value: "DJD"},
        //         {description: '关闭', value: "GB"},
        //         {description: '取消', value: "QX"}
        //     ]
        // ];
        PubSub.subscribe(pubTopic.task.TO_TASK.BATCH_ASSIGNMENT, this.getDispatch);
        this.state = {
            tableLoading: false,
            currentPage: 1,
            rowSelection:null,

        }
        const {state, actions, commonState} = this.props;
        this.queryState=state;
        this.queryActions=actions;
        this.param = {
            orgId: commonState.orgId,
            siteId: commonState.siteId,
            sorts:'createTime desc',
            pageNum: 1,
            pageSize: 10,
            orderType:'',
            orderStatus:'',
            sorts:'',
        };
    }

    selectOrderStatus = () => {
        if(this.orderStatus.getSelected().length>0){
            let list=[];
            this.orderStatus.getSelected().forEach(item=>{
                list.push(item.value);
            })
            this.refs.orderListComponent.queryStatus(list);
        }else{
            this.refs.orderListComponent.queryStatus("");
        }
    }

    getStatusData=(dominValue)=>{//获取数据
        const {commonActions, commonState,state} = this.props;
        let statusData = commonState.taskType;
        const domainValueParam = {
            orgId: commonState.orgId,
            siteId: commonState.siteId,
            prodId: 'EAM'
        }
        if (statusData.length < 1) {
            commonActions.getDomainValue(domainValueParam, 'taskType', 'TASK_TYPE')//任务类型
        }
        if(!this.getcheck(state.currentTab)){
            commonActions.getDomainValue(domainValueParam, dominValue, 'TASK_TYPE_STATUS', (json) => {
                state.myTaskStatus = json.data;
                this.saveCache(state.currentTab,json.data)
            })//状态
        }
    }

    //校验缓存中是否有该数据，如果有将该数据赋值给状态，并返回true
    getcheck = (statusSign) => {
        const {commonActions, commonState, state} = this.props;
        let statusdata = JSON.parse(localStorage.getItem('mytask'))
        let sign = false;
        if (statusdata) {
            if(statusdata.hasOwnProperty("todo")){
                if(statusdata.todo.hasOwnProperty(statusSign)){
                    if(statusdata.todo[statusSign].length){
                        state.myTaskStatus = statusdata.todo[statusSign];
                        sign=true;
                    }
                }
            }
        }
        return sign
    }
    saveCache=(statusSign,statusData)=>{
        const {commonActions, commonState, state} = this.props;
        let cacheStatusData = JSON.parse(localStorage.getItem('mytask'))
        if(cacheStatusData){
            if(cacheStatusData.hasOwnProperty("todo")){
                cacheStatusData.todo={
                    ...cacheStatusData.todo,
                    workOrder:statusData
                }
            }else{
                cacheStatusData={
                    ...cacheStatusData,
                    todo:{
                        workOrder:statusData
                    }
                }
            }
        }else{
            cacheStatusData={
                todo:{
                    workOrder:statusData
                }
            }
        }
        localStorage.setItem('mytask', JSON.stringify(cacheStatusData));
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
    //获取小标数量
	getTaskMiniNum = () => {
		const {actions, commonState} = this.props;
		const param = {
			siteId: commonState.siteId,
		}
 		actions.myTaskLogoNumToDo(param);
	}
	//批量处理
    getBatch=()=>{
	    const {state, actions, commonState} = this.props;
	    const myTaskSelect=state.myTaskSelect;
	    let returnValue=this.checkWorkOrder(myTaskSelect);  //验证
      	if(returnValue.orderType=="workOrder"&&returnValue.orderStatus=="DFP"){
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
    // 分页事件
    pageChange = (page, pageSize) => {
        const { state } = this.props;
        this.setState({ currentPage: page });
        this.param.pageNum = page;
        if(state.taskPageData){
            let list=state.taskPageData.list;
            for(let att in list){
                if(list[att].orderType=="workOrder"){
                    this.param.orderType = list[att].orderType;
                    //this.param.orderStatus = list[att].orderStatus;
                    break;
                }
            }
        this.queryActions.myTaskFindPageTaskToDoList(this.param)
    	}
    } 
	componentWillMount () {
		const { state } = this.props;
        state.currentTab="workOrder";
        this.getStatusData(state.currentTab)
        this.getTaskMiniNum();
    }
    render () {
    	const { state,commonState, actions } = this.props;
    const myTaskStatus=state.myTaskStatus?state.myTaskStatus:[];
    	const myTaskLogoNumToDo = state.myTaskLogoNumToDo;
    	const taskPageData = state.taskPageData;
    	let none="block";
        if(state.taskPageData){
            let list=state.taskPageData.list
            none="none";
            for(let att in list){
                if(list[att].orderType=="workOrder"&&list[att].orderStatus=="DFP"){
                    console.log(list[att].orderType);
                    console.log(list[att].orderStatus);
                    none="block";
                    break;
                }
            }
        }else{
            none="none"
        }
        return (
            <div>   
           		 <div className="main-nav task-active clearfix">
                    <Link to="/main/task/backlog_tab1" activeClassName="active " className="active" >待办任务</Link>
                    <Link to="/main/task/handle_tab1" activeClassName="active">经办任务</Link>
                </div>  
                    
                <div className="main-content clear">
                    <div className="eam-tab-page">
		                <div className="eam-content">
		                	<div className="eam-card eam-task-condition clearfix">
			                    <div className="eam-task-tab-nav">
			                    	 <Link activeClassName="active" className="eam-task-tab-nav-a" to="/main/task/backlog_tab1">全部</Link>
			                    	
			                    	<Link activeClassName="active" className="eam-task-tab-nav-a" to="/main/task/backlog_tab2">报修工单<span>{myTaskLogoNumToDo.repairOrder ? myTaskLogoNumToDo.repairOrder>99?'99+':myTaskLogoNumToDo.repairOrder : 0}</span></Link>
			                    	
			                    	<Link activeClassName="active" className="eam-task-tab-nav-a" to="/main/task/backlog_tab3">维保工单<span>{myTaskLogoNumToDo.workOrder ? myTaskLogoNumToDo.workOrder>99?'99+':myTaskLogoNumToDo.workOrder : 0}</span></Link>
			                    	
			                    	<Link activeClassName="active" className="eam-task-tab-nav-a" to="/main/task/backlog_tab4">派工工单<span>{myTaskLogoNumToDo.dispatchOrder ? myTaskLogoNumToDo.dispatchOrder>99?'99+':myTaskLogoNumToDo.dispatchOrder : 0}</span></Link>
			                    	
			                    	<Link activeClassName="active" className="eam-task-tab-nav-a" to="/main/task/backlog_tab5">巡检工单<span>{myTaskLogoNumToDo.patrolOrder ? myTaskLogoNumToDo.patrolOrder>99?'99+':myTaskLogoNumToDo.patrolOrder : 0}</span></Link>
			                    	
			                    	<Link activeClassName="active" className="eam-task-tab-nav-a" to="/main/task/backlog_tab6">商品订单<span>{myTaskLogoNumToDo.headquartersDaliyTask ? myTaskLogoNumToDo.headquartersDaliyTask>99?'99+':myTaskLogoNumToDo.headquartersDaliyTask : 0}</span></Link>
			                    	<div className="pull-right">
						                <Pagination simple className="task-top-page pull-left" defaultCurrent={taskPageData.currentPage} total={taskPageData.total} onChange={this.pageChange} />
				                     	<div className="task-more-btn pull-left" style={{display:none}}>
					                     	<MoreOperations
                                                style={{float: 'left'}}
                                                ref={listMoreOperations => this.listMoreOperations = listMoreOperations}
                                                menuData={[
                                                    {
                                                        icon: 'solution',
                                                        text: '批量派工',
                                                        confirmText: '确认派工'
                                                    },
                                                ]}
                                                onChange={(key, showCheckbox) => {
                                                    let rowSelection;

                                                    if (showCheckbox) {
                                                        this.setState({ selectedRowKeys: [] }); // 清空选择
                                                        rowSelection = true
                                                    } else {
                                                        rowSelection = false;
                                                    }

                                                    this.setState({
                                                        rowSelection,
                                                    })
                                                }}
                                                onOk={(key, hideCheckBox) => {
                                                    // this.moreClick(key, hideCheckBox);
                                                }}
                                            />
			                            </div>
		                            </div>
			                     	{/*<Button style={{display:none}} type="primary" className="pull-right eam-task-pull-right " onClick={this.getBatch}> 批量派工 </Button>*/}
			                    </div>
		                	</div>   
		                	<div >
			                    <div style={{paddingLeft: 12, background: 'white',position:'relative',height:55,}} className="eam-card task-eam-card">
			                        <div style={{float: 'left', marginTop: 18}}>
			                            <span>全部状态</span>
			                        </div>
			                        <div className="senior-filter-item task-mutiselect" style={{marginLeft: 90, borderBottom: 0}} onClick={this.selectOrderStatus}>
			                        	<Multiselect  data={myTaskStatus}  ref={orderStatus => this.orderStatus = orderStatus}/>
			                        </div>
			                        <div className="fuzzy-query task-fuzzy-query"><SearchInp onEnter={(text) => {
				                            this.fuzzyQuery(text)
				                        }}/></div>
				                    <p></p>
			                    </div>
		                    	<BacklogMaintenanceWorkOrderComponent
		                    		parentProps={this.props}
		                    		ref="orderListComponent"
		                    		rowSelection={this.state.rowSelection}
		                    	/>
		                    	<EAModal
			                        title={'维保工单'}
			                        ref={workOrderchModal => this.workOrderchModal = workOrderchModal}
			                        afterClose={() => { this.workOrderchModal.modalHide() }}
			                    >
			                        <WorkOrderStepsForm  props={this.props} />
			                        <div className="modal-footer clearfix">
			                            <Button size="large" onClick={() => { this.workOrderchModal.modalHide() }}>取消</Button>
			                            <Button type="primary" size="large" onClick={this.saveDispatch}>确定</Button>
			                        </div>
			                    </EAModal>
	                    	</div>
		                </div>
		            </div>
                </div>
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
	//提取选人组件
	taskPersonSelect = () => {
		this.setState({
            selectPersonModalShow: true,
            currentInp: 'acceptPerson'
        });
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
                            <Input placeholder="请选择执行人" 
                            readOnly
                            suffix={<Icon type="plus" onClick={this.taskPersonSelect} /> }
                            onClick={this.taskPersonSelect}
                            />
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
        state: state.main,
        commonState: state.common,
    }
}

function buildActionDispatcher(dispatch) {
    return {
        actions: bindActionCreators(actions, dispatch),
        commonActions: bindActionCreators(commonActions, dispatch),
        maintenanceActions: bindActionCreators(maintenanceActions, dispatch),
    }
}

export default connect(mapStateToProps, buildActionDispatcher)(BacklogThreeComponent);