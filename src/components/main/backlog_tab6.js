/**
 * @Description  待办任务-例行工作单
 */
import React from 'react';
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';
import {Link, browserHistory} from 'react-router';
import PubSub  from 'pubsub-js';
import {pubTopic} from '../../tools/constant';
import actions from '../../actions/main.js';
import commonActions from '../../actions/common.js';
import Multiselect from '../../components/common/multiselect.js';
import {correspondenceJson} from '../../tools/';
import {Icon, Button, Table, Form, Pagination, Row, Col, message} from 'antd';
import SearchInp from '../../components/common/search_inp.js';//模糊查询

class BacklogMaintenanceWorkOrderComponent extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            tableLoading: false,
            currentPage: 1,
            selectedRowKeys: [],
            rowSelection: null,
        }
        PubSub.subscribe(pubTopic.task.TO_TASK.DAILYTASK, this.queryKeyword);
        PubSub.subscribe(pubTopic.task.TO_TASK.MYTASK_REFRESH, this.myTaskRefresh);


        const { parentProps } = this.props;
        const { actions,commonState,state } = parentProps;
        this.queryAction=actions;
        this.queryState = state;

        this.param = {
            orgId: commonState.orgId,
            siteId: commonState.siteId,
            sorts: 'createTime desc',
            orderType:'headquartersDaliyTask',
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
                        <p><span className="order-number" onClick={() => {
                            this.jumpToTabPage(record)
                        }}>{text ? text : '-'}</span></p>
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
        if(data=="headquartersDaliyTask"){
            this.queryAction.myTaskFindPageTaskToDoList(this.param);
        }
    }

    //跳转
    jumpToTabPage = (record) => {

        let status;
        let json = {};
        if (record.orderStatus == undefined
            && record.orderStatus == null) {
            message.error("数据异常");
            return;
        }
        try {
            switch (record.orderType) {
                case "headquartersDaliyTask"://例行工作单
                    browserHistory.push("/headquarters/routine_work_order/routine_work_order_form?from=/task/backlog/backlog_tab6");
                    localStorage.setItem('dailyTaskId', record.businessKey);
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

        this.queryAction.myTaskFindPageTaskToDoList(this.param);
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
        const {state} = this.props.parentProps;
        state.batchAssignmentButton=false;//派工按钮初始化隐藏
        this.setState({currentPage: page});
        this.param.pageNum = page;
        this.queryAction.myTaskFindPageTaskToDoList(this.param);
    }

    componentWillMount() {
        const {parentProps} = this.props;
        const {actions, state, commonState} = parentProps;
        actions.myTaskFindPageTaskToDoList(this.param);
    }

    //查询工单状态过滤
    queryStatus = (status) => {
        if (status) {
            this.param.orderStatus = status;
        } else {
            this.param.orderStatus = '';
        }
        this.queryAction.myTaskFindPageTaskToDoList(this.param);
    }
    queryKeyword = (msg, data) => {
        if (data) {
            this.param.word = data;
        } else {
            this.param.word = '';
        }
        this.queryAction.myTaskFindPageTaskToDoList(this.param);
    }
    //获取选中值
    tableSelectChange = (selectedRowKeys,selectedRows) => {
        const {state} = this.props.parentProps;
        state.myTaskSelect=[];//先清空
        state.myTaskSelect=selectedRows;
        this.setState({selectedRowKeys});
    }
    render() {
        const {parentProps} = this.props;
        const {state} = parentProps;
        const data = state.taskPageData;
        const list = data == null ? [] : data.list;

        //表格多选
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

class BacklogSixComponent extends React.Component {
constructor(props) {
        super(props);
        const {state, actions, commonState,parentProps} = this.props;
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
      if (this.orderStatus.getSelected().length > 0) {
            let list = [];
            this.orderStatus.getSelected().forEach(item => {
                list.push(item.description);
            })
            this.refs.orderListComponent.queryStatus(list);
        } else {
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
                    headquartersDaliyTask:statusData
                }
            }else{
                cacheStatusData={
                    ...cacheStatusData,
                    todo:{
                        headquartersDaliyTask:statusData
                    }
                }
            }
        }else{
            cacheStatusData={
                todo:{
                    headquartersDaliyTask:statusData
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
		console.log(actions)
 		actions.myTaskLogoNumToDo(param);
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
                    console.log(list[att].orderType);
                    console.log(list[att].orderStatus);
                    this.param.orderType = list[att].orderType;
                    //this.param.orderStatus = list[att].orderStatus;
                    break;
                }
            }
        this.queryActions.myTaskFindPageTaskToDoList(this.param)
    	}
    }
	componentWillMount() {
        const { state } = this.props;
        state.currentTab = "headquartersDaliyTask";
        this.getStatusData( state.currentTab)
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
                    <Link to="/main/task/backlog_tab1" activeClassName="active " className="active" className="active" >待办任务</Link>
                    <Link to="/main/task/handle_tab1" activeClassName="active">经办任务</Link>
                </div>  
                    
                <div className="main-content clear">
                    <div className="eam-tab-page">
		                <div className="eam-content">
		                	<div className="eam-card eam-task-condition clearfix">
			                    <div className="eam-task-tab-nav">
			                    	 <Link activeClassName="active" className="eam-task-tab-nav-a"  to="/main/task/backlog_tab1">全部</Link>
			                    	
			                    	<Link activeClassName="active" className="eam-task-tab-nav-a"  to="/main/task/backlog_tab2">报修工单<span>{myTaskLogoNumToDo.repairOrder ? myTaskLogoNumToDo.repairOrder>99?'99+':myTaskLogoNumToDo.repairOrder : 0}</span></Link>
			                    	
			                    	<Link activeClassName="active" className="eam-task-tab-nav-a"  to="/main/task/backlog_tab3">维保工单<span>{myTaskLogoNumToDo.workOrder ? myTaskLogoNumToDo.workOrder>99?'99+':myTaskLogoNumToDo.workOrder : 0}</span></Link>
			                    	
			                    	<Link activeClassName="active" className="eam-task-tab-nav-a"  to="/main/task/backlog_tab4">派工工单<span>{myTaskLogoNumToDo.dispatchOrder ? myTaskLogoNumToDo.dispatchOrder>99?'99+':myTaskLogoNumToDo.dispatchOrder : 0}</span></Link>
			                    	
			                    	<Link activeClassName="active" className="eam-task-tab-nav-a"  to="/main/task/backlog_tab5">巡检工单<span>{myTaskLogoNumToDo.patrolOrder ? myTaskLogoNumToDo.patrolOrder>99?'99+':myTaskLogoNumToDo.patrolOrder : 0}</span></Link>
			                    	
			                    	<Link activeClassName="active" className="eam-task-tab-nav-a"  to="/main/task/backlog_tab6">商品订单<span>{myTaskLogoNumToDo.headquartersDaliyTask ? myTaskLogoNumToDo.headquartersDaliyTask>99?'99+':myTaskLogoNumToDo.headquartersDaliyTask : 0}</span></Link>
			                    	<div className="pull-right task-pull-right-margin" >
					                <Pagination simple className="task-top-page" defaultCurrent={taskPageData.currentPage} total={taskPageData.total} onChange={this.pageChange} />
					            </div>
							</div>
		                	</div>   
		                	<div >
			                    <div style={{paddingLeft: 12, background: 'white',position:'relative'}} className="eam-card task-eam-card">
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
		                    	<BacklogMaintenanceWorkOrderComponent parentProps={this.props} ref="orderListComponent"/>
	                    	</div>
		                </div>
		            </div>
                </div>
            </div>
        )
    }
}

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
    }
}

export default connect(mapStateToProps, buildActionDispatcher)(BacklogSixComponent);