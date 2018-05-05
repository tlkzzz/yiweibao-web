/** 
 * @Description 待办任务-派工单
 */
import React from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { Link,browserHistory } from 'react-router';
import PubSub  from 'pubsub-js';
import { pubTopic } from '../../tools/constant';
import actions from '../../actions/my_task.js';
import Multiselect from '../../components/common/multiselect.js';
import commonActions from '../../actions/common.js';
import { correspondenceJson } from '../../tools/';
import { Icon, Button, Table, Form,Pagination, Row, Col,message } from 'antd';


class BacklogMaintenanceWorkOrderComponent extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            tableLoading: false,
            currentPage: 1,
        }
        PubSub.subscribe(pubTopic.task.TO_TASK.DISPACHORDER, this.queryKeyword );
        PubSub.subscribe(pubTopic.task.TO_TASK.MYTASK_REFRESH, this.myTaskRefresh);
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
        if(data=="dispatchOrder"){
            this.queryAction.myTaskBacklogGetDispatchList(this.param);
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
            return
        }
        try {
            switch(record.orderType)
        {
            case "dispatchOrder"://派工单
                this.dispatchOrderConfigJson  = correspondenceJson.dispatchOrder;  //派工单
                status = this.dispatchOrderConfigJson[record.orderStatus];
                browserHistory.push(`/matter_repair/dispatch/dispatch_${status.path}`);
                PubSub.publish(pubTopic.dispatchorder.DISPATCH_ORDER, record.businessKey);
                localStorage.setItem('workOrderId', record.businessKey);
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

        this.queryAction.myTaskBacklogGetDispatchList(this.param);
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
        state.batchAssignmentButton=false;//派工按钮初始化隐藏
        this.setState({ currentPage: page });
        this.param.pageNum = page;
        this.queryAction.myTaskBacklogGetDispatchList(this.param);
    }

    componentWillMount () {
        const { parentProps } = this.props;
        const { actions,state,commonState } = parentProps;
        actions.myTaskBacklogGetDispatchList(this.param);
    }
    //查询工单状态过滤
    queryStatus=(status)=>{
        if(status){
            this.param.orderStatus = status;
        }else{
            this.param.orderStatus = '';
        }
        this.queryAction.myTaskBacklogGetDispatchList(this.param);
    }
    queryKeyword = (msg,data) =>{
        if(data){
            this.param.word = data;
        }else{
            this.param.word = '';
        }
        this.queryAction.myTaskBacklogGetDispatchList(this.param);
    }
    //获取选中值
    tableSelectChange = (selectedRowKeys,selectedRows) => {
        const {state} = this.props.parentProps;
        state.myTaskSelect=[];//先清空
        state.myTaskSelect=selectedRows;
        this.setState({selectedRowKeys});
    }
    render () {
        const { parentProps } = this.props;
        const { state } = parentProps;
        const data = state.taskPageData;
        const list = data==null?[]: data.list;

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


class BacklogThreeComponent extends React.Component {
    constructor(props) {
        super(props);
    }

    selectOrderStatus = () => {
        // console.log("-------showValue-------", this.orderStatus);
        // console.log("-------showValue-------", this.orderStatus.getSelected()[0].description);
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
                console.info(json.data)
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
                    dispatchOrder:statusData
                }
            }else{
                cacheStatusData={
                    ...cacheStatusData,
                    todo:{
                        dispatchOrder:statusData
                    }
                }
            }
        }else{
            cacheStatusData={
                todo:{
                    dispatchOrder:statusData
                }
            }
        }
        localStorage.setItem('mytask', JSON.stringify(cacheStatusData));
    }
    componentWillMount () {
        const { state } = this.props;
        state.currentTab="dispatchOrder";
        this.getStatusData( state.currentTab)
    }



    render () {
        const { state,commonState } = this.props;
        const myTaskStatus=state.myTaskStatus?state.myTaskStatus:[];
        return (
            <div className="eam-tab-page">
                <div className="eam-content">
                    <div  style={{padding: 12,background:'white'}}>
                        <div style={{float:'left',marginTop:18}}>
                            <span>选择工单状态:</span>
                        </div>
                        <div className="senior-filter-item" style={{marginLeft:90,borderBottom:0}}onClick={this.selectOrderStatus}>
                            <Multiselect  data={myTaskStatus} ref={orderStatus => this.orderStatus = orderStatus} />
                        </div>
                    </div>
                    <BacklogMaintenanceWorkOrderComponent parentProps={this.props} ref="orderListComponent"  />
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
    }
}

export default connect(mapStateToProps, buildActionDispatcher)(BacklogThreeComponent);