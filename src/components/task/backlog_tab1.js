/** 
 * @Description 全部工单
 */
import React from 'react';
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';
import {Link,browserHistory} from 'react-router';
import PubSub  from 'pubsub-js';
import {pubTopic} from '../../tools/constant';
import actions from '../../actions/my_task.js';
import repairactions from '../../actions/matter_repair.js';
import workOrderAction from '../../actions/maintenance.js';
import commonActions from '../../actions/common.js';
import Multiselect from '../../components/common/multiselect.js';
import { correspondenceJson } from '../../tools/';
import {Icon, Button, Table, Form, Pagination, Row, Col,message} from 'antd';


class AllBacklogWorkOrderComponent extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            tableLoading: false,
            currentPage: 1,
            selectedRowKeys:[]
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
        const { repairactions,state,workOrderAction } = parentProps

      if(record.orderStatus==undefined
          &&record.orderStatus==null){
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
                browserHistory.push(`/patrol/order/${status.path}`);
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
                workOrderAction.workOrderSetList(state.taskPageData)
                localStorage.setItem('workOrder', JSON.stringify(json));
                localStorage.setItem('LIST_PARAM', JSON.stringify(this.param));
                browserHistory.push(`/maintenance/work_order/${status.path}`);





                break;
            case "headquartersDaliyTask"://例行工作单
                browserHistory.push("/headquarters/routine_work_order/routine_work_order_form");;
                localStorage.setItem('dailyTaskId', record.businessKey);
                break;
            case "dispatchOrder"://派工单
                this.dispatchOrderConfigJson  = correspondenceJson.dispatchOrder;  //派工单
                 status = this.dispatchOrderConfigJson[record.orderStatus];
                browserHistory.push(`/matter_repair/dispatch/dispatch_${status.path}`);
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
                    browserHistory.push(`/matter_repair/repair/${status.path}`);
                });

                break;
            default:
                message.error("数据异常");

        }
        } catch (e) {
            message.error("数据异常1");
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
        const rowSelection = {
            selectedRows: this.state.selectedRowKeys,
            onChange: this.tableSelectChange,
        }


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

    componentWillMount() {
        const {state} = this.props;
        state.currentTab="ALL";
        this.getStatusData(state.currentTab)

    }
    render() {
        const {state, commonState} = this.props;
        const myTaskStatus = state.myTaskStatus ? state.myTaskStatus : [];

        return (
            <div className="eam-tab-page">
                <div className="eam-content">
                    <div style={{padding: 12, background: 'white'}}>
                        <div style={{float: 'left', marginTop: 18}}>
                            <span>选择工单状态:</span>
                        </div>
                        <div className="senior-filter-item" style={{marginLeft: 90, borderBottom: 0}} onClick={this.selectOrderStatus}>
                        <Multiselect data={myTaskStatus}  ref={orderStatus => this.orderStatus = orderStatus}/>
                        </div>
                    </div>
                    <AllBacklogWorkOrderComponent parentProps={this.props} ref="orderListComponent"/>
                </div>
            </div>
        )
    }
}


function mapStateToProps(state) {
    return {
        state: state.my_task,
        commonState: state.common,
    }
}

function buildActionDispatcher(dispatch) {
    return {
        actions: bindActionCreators(actions, dispatch),
        commonActions: bindActionCreators(commonActions, dispatch),
        repairactions:bindActionCreators(repairactions, dispatch),
        workOrderAction:bindActionCreators(workOrderAction, dispatch),
    }
}

export default connect(mapStateToProps, buildActionDispatcher)(BacklogOneComponent);