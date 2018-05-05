/** 
 * @Description 经办任务-全部
 */
import React from 'react';
import {bindActionCreators} from 'redux';
import { Link,browserHistory } from 'react-router';
import {connect} from 'react-redux';
import PubSub  from 'pubsub-js';
import { pubTopic } from '../../tools/constant';
import repairactions from '../../actions/matter_repair.js';
import commonActions from '../../actions/common.js';
import actions from '../../actions/main.js';
import { correspondenceJson } from '../../tools/';

import {Icon, Button, Table, Form, Pagination, Row, Col, Menu, Modal, message,Badge} from 'antd';
import SearchInp from '../../components/common/search_inp.js';//模糊查询
import Multiselect from '../../components/common/multiselect.js';

class AllHandleWorkOrderComponent extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            tableLoading: false,
            currentPage: 1,
        }
        PubSub.subscribe(pubTopic.task.HANDLE_QUERY_KEYWORD, this.queryKeyword );
        PubSub.subscribe(pubTopic.task.HANDILING_TASK.ALL, this.getPush );
        //表格多选
        this.rowSelection = {
            onChange: (selectedRowKeys, selectedRows) => {
                console.log(`selectedRowKeys: ${selectedRowKeys}`, 'selectedRows: ', selectedRows);
            },
            onSelect: (record, selected, selectedRows) => {
                console.log(record, selected, selectedRows);
            },
            onSelectAll: (selected, selectedRows, changeRows) => {
                console.log(selected, selectedRows, changeRows);
            },
        };


        const { parentProps } = this.props;
        const { commonState } = parentProps;
        const { actions } = parentProps;
        this.queryAction=actions;

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
            }
        ];
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
                    browserHistory.push(`/patrol/order/${status.path}?from=/task/handle/handle_tab1`);
                    break;
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
                    browserHistory.push(`/maintenance/work_order/${status.path}?from=/task/handle/handle_tab1`);
                    break;
                case "headquartersDaliyTask"://例行工作单
                    browserHistory.push("/headquarters/routine_work_order/routine_work_order_form?from=/task/handle/handle_tab1");;
                    localStorage.setItem('dailyTaskId', record.businessKey);
                    break;
                case "dispatchOrder"://派工单
                    this.dispatchOrderConfigJson  = correspondenceJson.dispatchOrder;  //派工单
                    status = this.dispatchOrderConfigJson[record.orderStatus];
                    browserHistory.push(`/matter_repair/dispatch/dispatch_${status.path}?from=/task/handle/handle_tab1`);
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
                        browserHistory.push(`/matter_repair/repair/${status.path}?from=/task/handle/handle_tab1`);
                    });
                    break;
                default:
                    message.error("数据异常");
            }
        } catch (e) {
            message.error("数据异常");
        }
    }
    //获取推送
    getPush=(mag,data)=>{

     if(data=="GET_ALL"){//获取全部
       this.param.complete = false;
       this.queryAction.myTaskHandleGetAllList(this.param);
       return;
     }
    if(data=="GET_NO_CLOSE"){//获取非关闭
        this.param.complete = true;
        this.queryAction.myTaskHandleGetAllList(this.param);
        return;
    }
     if(data!=null&&data!=undefined){//模糊查询
       this.queryKeyword(null,data)
     }
    }
// 表格事件-排序
    tableChange = (pagination, filters, sorter) => {
        if (sorter.order) {
            let sorterOrder = sorter.order;
            let endIndex = sorterOrder.indexOf('end');
            sorterOrder = sorterOrder.slice(0, endIndex);
            this.param.sorts = `${sorter.field} ${sorterOrder}`;
        } else {
            this.param.sorts = 'sorts:createTime desc';
        }
        this.queryAction.myTaskHandleGetAllList(this.param);
    }
    // 分页事件
    pageChange = (page, pageSize) => {
        this.setState({currentPage: page});
        this.param.pageNum = page;
        this.queryAction.myTaskHandleGetAllList(this.param);
    }
    //获取状态数据
    getStatusData=()=>{//获取数据
        const {commonActions, commonState} = this.props.parentProps;
        let statusData = commonState.taskType;
        const domainValueParam = {
            orgId: commonState.orgId,
            siteId: commonState.siteId,
            prodId: 'EAM'
        }
        if (statusData.length < 1) {
            commonActions.getDomainValue(domainValueParam, 'taskType', 'TASK_TYPE', (json) => {
                statusData = json.data;
                if (json.success) {
                    for (let attr in statusData) {
                        let data = statusData[attr].data;
                        if (data == null || data == undefined) {
                            commonActions.getDomainValue(domainValueParam, statusData[attr].value, 'TASK_TYPE_STATUS', (json1) => {
                                if (json1.success) {
                                    statusData[attr].data=json1.data;
                                    commonState.taskType =statusData;
                                }
                            });
                        }
                    }
                }
            })
        }
    }
    componentWillMount () {
        const { parentProps } = this.props;
        const { state } = parentProps
        // this.param.word=parentProps.state.keyword;
        this.queryAction.myTaskHandleGetAllList(this.param );
        this.getStatusData();
        state.currentTab="ALL";
    }
    queryKeyword = (msg,data) =>{
        console.info("1")
        if(data){
            this.param.word = data;
        }else{
            this.param.word = '';
        }
        this.queryAction.myTaskHandleGetAllList(this.param);
    }
    //此代码可以抽取公共方法
    getTranslate = (text, record, type) => {
        const {commonState, commonActions} = this.props.parentProps;
        const statusData = commonState.taskType;
        if (type == "taskType") {//任务类型
            for (let attr in statusData) {
                if (statusData[attr].value == text) {
                    return statusData[attr].description;
                }
            }
        } else if (type == "status") {//状态
            let sign = false;
            for (let attr in statusData) {
                if (statusData[attr].value == record.orderType) {
                    let jsonData = statusData[attr].data;
                    sign = true;
                    for (let var2 in jsonData) {
                        if (jsonData[var2].value == text) {
                            return jsonData[var2].description;
                        }
                    }
                }
            }
        }
        return text;
    }
    render() {
        const { parentProps } = this.props;
        const { state } = parentProps;
        const data = state.taskPageData;
        const list =  data==null?[]:data.list;
        return (
                <div className="eam-content-inner">
                    <Table
                        rowKey="taskId"
                        loading={this.state.tableLoading}
                        pagination={false}
                        dataSource={list}
                        columns={this.columns}
                        rowSelection={false}
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


class HandleOneComponent extends React.Component {
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
       // 模糊查询
    fuzzyQuery = (keywords) => {
        const { state} = this.props;
        switch(state.currentTab)
        {
            case "ALL":
                PubSub.publish(pubTopic.task.HANDILING_TASK.ALL,keywords);
                break;
            case "patrolOrder"://巡检
                PubSub.publish(pubTopic.task.HANDILING_TASK.PATROLORDER,keywords);
                break;
            case "workOrder"://维保
                PubSub.publish(pubTopic.task.HANDILING_TASK.WORKODER,keywords);
                break;
            case "headquartersDaliyTask"://例行工作单
                PubSub.publish(pubTopic.task.HANDILING_TASK.DAILYTASK,keywords);
                break;
            case "dispatchOrder"://派工单
                PubSub.publish(pubTopic.task.HANDILING_TASK.DISPACHORDER,keywords);
                break;
            case "repairOrder"://报修
                PubSub.publish(pubTopic.task.HANDILING_TASK.REPAIRORDER,keywords);
                break;
        }
       // PubSub.publish(pubTopic.task.HANDLE_QUERY_KEYWORD,keywords);
    }

    renderChildren=(props)=> {
        // console.log("-------renderChildren-------",props);
        //遍历所有子组件
        return React.Children.map(props.children, child => {
                return React.cloneElement(child, {
                    //把父组件的props.name赋值给每个子组件
                    name: props.keywords
                })
        })
    }
    //显示全部
    getAll=(data)=>{
	    const { state} = this.props;
	    const buttonStatus=state.getAllStatus;
	    let button;
	    if(buttonStatus){//true
	        state.getAllStatus=false;
	        button="GET_ALL"
	    }else{//false
	        state.getAllStatus=true;
	        button="GET_NO_CLOSE"
	    }
	    switch(state.currentTab)
	    {
	        case "ALL":
	            PubSub.publish(pubTopic.task.HANDILING_TASK.ALL,button);
	            break;
	        case "patrolOrder"://巡检
	            PubSub.publish(pubTopic.task.HANDILING_TASK.PATROLORDER,button);
	            break;
	        case "workOrder"://维保
	            PubSub.publish(pubTopic.task.HANDILING_TASK.WORKODER,button);
	            break;
	        case "headquartersDaliyTask"://例行工作单
	            PubSub.publish(pubTopic.task.HANDILING_TASK.DAILYTASK,button);
	            break;
	        case "dispatchOrder"://派工单
	            PubSub.publish(pubTopic.task.HANDILING_TASK.DISPACHORDER,button);
	            break;
	        case "repairOrder"://报修
	            PubSub.publish(pubTopic.task.HANDILING_TASK.REPAIRORDER,button);
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
 		actions.myTaskLogoNumDone(param);
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
        this.queryAction.myTaskHandleGetAllList(this.param);
    	}
    }
    componentWillMount() {
        const { parentProps } = this.props;
		this.getTaskMiniNum();
    }
    render () {
    	const {children,state, commonState} = this.props;
        const myTaskStatus = state.myTaskStatus ? state.myTaskStatus : [];
        const myTaskLogoNumDone = state.myTaskLogoNumDone;
        const buttonStatus=state.getAllStatus;
        const taskPageData = state.taskPageData;
        let none="block";
        if(state.taskPageData){
            let list=state.taskPageData.list
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
			                    	<Link activeClassName="active" className="eam-task-tab-nav-a"  to="/main/task/handle_tab1">全部</Link>
			                    	
			                    	<Link activeClassName="active" className="eam-task-tab-nav-a"  to="/main/task/handle_tab2">报修工单<span>{myTaskLogoNumDone.repairOrder ? myTaskLogoNumDone.repairOrder>99?'99+':myTaskLogoNumDone.repairOrder : 0}</span></Link>
			                    	
			                    	<Link activeClassName="active" className="eam-task-tab-nav-a"  to="/main/task/handle_tab3">维保工单<span>{myTaskLogoNumDone.workOrder ? myTaskLogoNumDone.workOrder>99?'99+':myTaskLogoNumDone.workOrder : 0}</span></Link>
			                    	
			                    	<Link activeClassName="active" className="eam-task-tab-nav-a"  to="/main/task/handle_tab4">派工工单<span>{myTaskLogoNumDone.dispatchOrder ? myTaskLogoNumDone.dispatchOrder>99?'99+':myTaskLogoNumDone.dispatchOrder : 0}</span></Link>
			                    	
			                    	<Link activeClassName="active" className="eam-task-tab-nav-a"  to="/main/task/handle_tab5">巡检工单<span>{myTaskLogoNumDone.patrolOrder ? myTaskLogoNumDone.patrolOrder>99?'99+':myTaskLogoNumDone.patrolOrder : 0}</span></Link>
			                    	
			                    	<Link activeClassName="active" className="eam-task-tab-nav-a"  to="/main/task/handle_tab6">商品订单<span>{myTaskLogoNumDone.headquartersDaliyTask ? myTaskLogoNumDone.headquartersDaliyTask>99?'99+':myTaskLogoNumDone.headquartersDaliyTask : 0}</span></Link>
			                    	<div className="pull-right task-pull-right-margin">
					                <Pagination simple className="task-top-page" defaultCurrent={taskPageData.currentPage} total={taskPageData.total} onChange={this.pageChange} />
			                     	<Button type="primary" className="pull-right eam-task-pull-right" onClick={this.getAll}> {buttonStatus?"显示全部":"取消显示全部"} </Button>
			                    </div>
			                 </div>   
		                	</div>   
		                	<div >
			                    <div style={{paddingLeft: 12, background: 'white',position:'relative'}} className="eam-card task-eam-card">
			                        <div style={{height:55}}>
			                           
			                        </div>
			                        <div className="fuzzy-query handle-fuzzy-query">
			                        	<SearchInp onEnter={(text) => {this.fuzzyQuery(text)}}/>
			                        </div>
				                    <p></p>
			                    </div>
		                    	<AllHandleWorkOrderComponent parentProps={this.props} />
	                    	</div>
		                </div>
		            </div>
                </div>
            </div>
        )
    }
}

function mapStateToProps (state) {
    return {
        state: state.main,
        commonState: state.common,
    }
}



function buildActionDispatcher(dispatch) {
    return {
        actions: bindActionCreators(actions, dispatch),
        commonActions:bindActionCreators(commonActions, dispatch),
        repairactions:bindActionCreators(repairactions, dispatch),
    }
}

export default connect(mapStateToProps, buildActionDispatcher)(HandleOneComponent);