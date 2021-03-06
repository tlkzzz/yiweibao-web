/**
 * @Description 全部工单
 */
import React from 'react';
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';
import {Link,browserHistory} from 'react-router';
import PubSub  from 'pubsub-js';
import {pubTopic} from '../../tools/constant';
import actions from '../../actions/main.js';
import repairactions from '../../actions/matter_repair.js';
import commonActions from '../../actions/common.js';
import Multiselect from '../../components/common/multiselect.js';
import { correspondenceJson } from '../../tools/';
import {Icon, Button, Table, Form, Pagination, Row, Col,message,Badge} from 'antd';

import SearchInp from '../../components/common/search_inp.js';//模糊查询
import MoreOperations from '../../components/common/more_operations.js';


class AllBacklogWorkOrderComponent extends React.Component {
    constructor(props) {
        super(props);
        PubSub.subscribe(pubTopic.task.TO_TASK.BATCH_ASSIGNMENT, this.getDispatch);
        this.state = {
            tableLoading: false,
            currentPage: 1,
            selectedRowKeys: [],
            rowSelection: null,
        }
        PubSub.subscribe(pubTopic.task.TO_TASK.ALL, this.queryKeyword);
        PubSub.subscribe(pubTopic.task.TO_TASK.MYTASK_REFRESH, this.myTaskRefresh);
        const {parentProps} = this.props;
        const {actions, commonState,state} = parentProps;
        this.queryAction = actions;
        this.queryState = state;
        this.param = {
            orgId: commonState.orgId,
            siteId: commonState.siteId,
            sorts: 'createTime desc',
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
        if(data=="ALL"){
            this.queryAction.myTaskBacklogGetAllList(this.param);
        }
    }
    //跳转
    jumpToTabPage = (record) => {

        let status;
        let json = {};
        const { parentProps } = this.props;
        const { repairactions } = parentProps

      if(record.orderStatus==undefined
          &&record.orderStatus==null){
          message.error("数据异常");
          return;
      }
      try {
        switch(record.orderType)
        {
            case "patrolOrder"://巡检工单
                this.patrolOrderCorrJson = correspondenceJson.patrolOrder;//巡检
                status = record.orderStatus;
                status = this.patrolOrderCorrJson[status];
                json.id = record.businessKey;
                json.process = status.process;
                json.status = record.orderStatus;
                json.patrolOrderNum = record.orderNum;
                // json.description = record.description;
                localStorage.setItem('patrolOrder', JSON.stringify(json));
                browserHistory.push(`/patrol/order/${status.path}?from=/task/backlog/backlog_tab1`);
                break;
            case "workOrder"://维保工单
                // 后端返回英文显示中文的对应数据
                this.workOrderCorrJson  = correspondenceJson.workOrder; //维保
                status = record.orderStatus;
                status = this.workOrderCorrJson[status];
                json.id = record.businessKey;
                json.process = status.process;
                json.status = record.orderStatus;
                json.workOrderNum = record.orderNum;
                localStorage.setItem('workOrder', JSON.stringify(json));
                browserHistory.push(`/maintenance/work_order/${status.path}?from=/maintenance/work_order/${status.path}`);
                break;
            case "headquartersDaliyTask"://例行工作单
                browserHistory.push("/headquarters/routine_work_order/routine_work_order_form?from=/task/backlog/backlog_tab1");;
                localStorage.setItem('dailyTaskId', record.businessKey);
                break;
            case "dispatchOrder"://派工单
                this.dispatchOrderConfigJson  = correspondenceJson.dispatchOrder;  //派工单
                 status = this.dispatchOrderConfigJson[record.orderStatus];
                browserHistory.push(`/matter_repair/dispatch/dispatch_${status.path}?from=/task/backlog/backlog_tab1`);
                PubSub.publish(pubTopic.dispatchorder.DISPATCH_ORDER, record.businessKey);
                localStorage.setItem('workOrderId', record.businessKey);
                break;
            case "repairOrder"://报修工单
                this.repairOrderConfigJson  = correspondenceJson.repairOrder;//报修
                localStorage.setItem('addRepairWorkOrder', false);
                //查询工单数据
                repairactions.repairOrderInformation({ id: record.businessKey }, (data) => {
                    //存入初始数据
                    localStorage.setItem('repairWorkOrder_init', JSON.stringify(data));
                    localStorage.setItem('repairWorkOrder_edit', localStorage.getItem('repairWorkOrder_init'));
                    let status = this.repairOrderConfigJson[data.workOrderStatus];
                    browserHistory.push(`/matter_repair/repair/${status.path}?from=/task/backlog/backlog_tab1`);
                });
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
            this.param.sorts = '';
        }
        this.queryAction.myTaskBacklogGetAllList(this.param);
    }
    // 分页事件
    pageChange = (page, pageSize) => {
        this.setState({currentPage: page});
        this.param.pageNum = page;
        this.queryAction.myTaskBacklogGetAllList(this.param);
    }
    componentWillMount() {
        const { parentProps } = this.props;
        const { state } = parentProps
        this.queryAction.myTaskBacklogGetAllList(this.param);
    }
    //查询工单状态过滤
    queryStatus = (status) => {
        if (status) {
            this.param.orderStatus = status;
        } else {
            this.param.orderStatus = '';
        }
        this.queryAction.myTaskBacklogGetAllList(this.param);
    }
    queryKeyword = (msg, data) => {
        if (data) {
            this.param.word = data;
        } else {
            this.param.word = '';
        }
        this.queryAction.myTaskBacklogGetAllList(this.param);
    }
    //获取选中值
    tableSelectChange = (selectedRowKeys,selectedRows) => {
        const {state} = this.props.parentProps;
        state.myTaskSelect=[];//先清空
        state.myTaskSelect=selectedRows;
        this.setState({selectedRowKeys});
    }
    //此代码可以抽取公共方法
    getTranslate = (text, record, type) => {
        const {commonState, commonActions, state} = this.props.parentProps;
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
    render() {
        const {parentProps} = this.props;
        const {state} = parentProps;
        const data = state.taskPageData;
        const list = data.list;
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

class BacklogOneComponent extends React.Component {
    constructor(props) {
        super(props);
        // 高级筛选选项数据
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
                list.push(item.value);
            })
            this.refs.orderListComponent.queryStatus(list);
        } else {
            this.refs.orderListComponent.queryStatus("");
        }
    }

    getStatusData = (dominValue) => {//获取数据
        const {commonActions, commonState, state} = this.props;
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
            commonActions.findDomainValueValue(domainValueParam, 'taskType', 'TASK_TYPE_STATUS', (json) => {
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
                    ALL:statusData
                }
            }else{
                cacheStatusData={
                    ...cacheStatusData,
                    todo:{
                        ALL:statusData
                    }
                }
            }
        }else{
            cacheStatusData={
                todo:{
                    ALL:statusData
                }
            }
        }
        localStorage.setItem('mytask', JSON.stringify(cacheStatusData));
    }
    
    getStatusData = (dominValue) => {//获取数据
        const {commonActions, commonState, state} = this.props;
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
            commonActions.findDomainValueValue(domainValueParam, 'taskType', 'TASK_TYPE_STATUS', (json) => {
                state.myTaskStatus = json.data;
                this.saveCache(state.currentTab,json.data)
            })//状态
        }
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
    //分页
    pageChange = (page, pageSize) => {
        const { state } = this.props;
        this.setState({ currentPage: page });
        this.param.pageNum = page;
        if(state.taskPageData){
            let list=state.taskPageData.list;
            for(let att in list){
                if(list[att].orderType=="ALL"){
                    this.param.orderType = list[att].orderType;
                    //this.param.orderStatus = list[att].orderStatus;
                    break;
                }
            }
        this.queryActions.myTaskFindPageTaskToDoList(this.param)
    	}
    }
    componentWillMount() {
        const {commonActions, commonState, state} = this.props;
        state.currentTab="ALL";
        this.getStatusData(state.currentTab);
        this.getTaskMiniNum();
    }
    render () {
        const {state, commonState,actions} = this.props;
        const myTaskStatus = state.myTaskStatus ? state.myTaskStatus : [];
        const myTaskLogoNumToDo = state.myTaskLogoNumToDo;
        const taskPageData = state.taskPageData;
        let none="block";
        if(state.taskPageData){
            let list=state.taskPageData.list;
            none="none";
            for(let att in list){
                if(list[att].orderType=="workOrder"&&list[att].orderStatus=="DFP"){
                    none="block";
                    break;
                }
            }
        }else{
            none="none"
        }
        return (
            <div>   
                 <div className="main-nav clearfix">
                    <Link to="/main/task/backlog_tab1" activeClassName="active">待办任务</Link>
                    <Link to="/main/task/handle_tab1" activeClassName="active">经办任务</Link>
                </div>  
                <div className="main-content clear">
                    <div className="eam-tab-page">
				         <div className="eam-content">
                            <div className="eam-card eam-task-condition clearfix">
                                <div className="eam-task-tab-nav">
                                    <Link activeClassName="active" className="eam-task-tab-nav-a"  to="/main/task/backlog_tab1">全部</Link>
                                    
                                    <Link activeClassName="active" className="eam-task-tab-nav-a" to="/main/task/backlog_tab2">报修工单<span>{myTaskLogoNumToDo.repairOrder ? myTaskLogoNumToDo.repairOrder>99?'99+':myTaskLogoNumToDo.repairOrder : 0}</span></Link>
                                    
                                    <Link activeClassName="active" className="eam-task-tab-nav-a"  to="/main/task/backlog_tab3">维保工单<span>{myTaskLogoNumToDo.workOrder ? myTaskLogoNumToDo.workOrder>99?'99+':myTaskLogoNumToDo.workOrder : 0}</span></Link>
                                    
                                    <Link activeClassName="active" className="eam-task-tab-nav-a"  to="/main/task/backlog_tab4">派工工单<span>{myTaskLogoNumToDo.dispatchOrder ? myTaskLogoNumToDo.dispatchOrder>99?'99+':myTaskLogoNumToDo.dispatchOrder : 0}</span></Link>
                                    
                                    <Link activeClassName="active" className="eam-task-tab-nav-a"  to="/main/task/backlog_tab5">巡检工单<span>{myTaskLogoNumToDo.patrolOrder ? myTaskLogoNumToDo.patrolOrder>99?'99+':myTaskLogoNumToDo.patrolOrder : 0}</span></Link>
                                    
                                    <Link activeClassName="active" className="eam-task-tab-nav-a"  to="/main/task/backlog_tab6">商品订单<span>{myTaskLogoNumToDo.headquartersDaliyTask ? myTaskLogoNumToDo.headquartersDaliyTask>99?'99+':myTaskLogoNumToDo.headquartersDaliyTask : 0}</span></Link>
					                
					                <div className="pull-right task-pull-right-margin">
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
                                <AllBacklogWorkOrderComponent parentProps={this.props} ref="orderListComponent"/>
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
        repairactions:bindActionCreators(repairactions, dispatch),
    }
}

export default connect(mapStateToProps, buildActionDispatcher)(BacklogOneComponent);