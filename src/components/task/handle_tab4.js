/** 
 * @Description 经办任务-派工单
 */
import React from 'react';
import {bindActionCreators} from 'redux';
import { Link,browserHistory } from 'react-router';
import {connect} from 'react-redux';
import PubSub  from 'pubsub-js';
import { pubTopic } from '../../tools/constant';
import actions from '../../actions/my_task.js';
import commonActions from '../../actions/common.js';
import { correspondenceJson } from '../../tools/';
import {Icon, Button, Table, Form, Pagination, Row, Col,message} from 'antd';


class MaintenanceWorkOrderComponent extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            tableLoading: false,
            currentPage: 1,
        }
        PubSub.subscribe(pubTopic.task.HANDLE_QUERY_KEYWORD, this.queryKeyword );
        PubSub.subscribe(pubTopic.task.HANDILING_TASK.DISPACHORDER, this.getPush );
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
        if (sorter.order) {
            let sorterOrder = sorter.order;
            let endIndex = sorterOrder.indexOf('end');
            sorterOrder = sorterOrder.slice(0, endIndex);
            this.param.sorts = `${sorter.field} ${sorterOrder}`;
        } else {
            this.param.sorts = '';
        }

        this.queryAction.myTaskHandleGetDispatchList(this.param);
    }
    //此代码可以抽取公共方法
    getTranslate = (text, record, type) => {
        const {commonState, commonActions} = this.props.parentProps;
        const statusData = commonState.taskType;
       // console.info(statusData);
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
    //获取推送
    getPush=(mag,data)=>{

        if(data=="GET_ALL"){//获取全部
            this.param.complete = false;
            this.queryAction.myTaskHandleGetDispatchList(this.param);
            return;
        }
        if(data=="GET_NO_CLOSE"){//获取非关闭
            this.param.complete = true;
            this.queryAction.myTaskHandleGetDispatchList(this.param);
            return;
        }
        if(data!=null&&data!=undefined){//模糊查询
            this.queryKeyword(null,data)
        }
    }
    // 分页事件
    pageChange = (page, pageSize) => {
        this.setState({currentPage: page});
        this.param.pageNum = page;
        this.queryAction.myTaskHandleGetDispatchList(this.param);
    } //获取状态数据
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
        const { actions,state,commonState } = parentProps;
       // console.log("----------componentWillMount----commonState------",{orderStatus:'待分派',sorts:'desc'},commonState);
        this.queryAction.myTaskHandleGetDispatchList(this.param);
        this.getStatusData();
        state.currentTab="dispatchOrder";
    }
    queryKeyword = (msg,data) =>{
        console.info("4")
        if(data){
            this.param.word = data;
        }else{
            this.param.word = '';
        }
        actions.myTaskHandleGetDispatchList(this.param);
    }
    getTranslate = (text, record, type) => {
        const {commonState, commonActions} = this.props.parentProps;
       // console.info(record);
        const statusData = commonState.taskType;
        const domainValueParam = {
            orgId: commonState.orgId,
            siteId: commonState.siteId,
            prodId: 'EAM'
        }
        if (type == "taskType") {//任务类型
            if (statusData.length == 0) {
                commonActions.getDomainValue(domainValueParam, 'taskType', 'TASK_TYPE');
            }
            for (let attr in statusData) {
                if (statusData[attr].value == text) {
                    return statusData[attr].description;
                }
            }
        } else if (type == "status") {//状态
            let sign = false;
            for (let attr in statusData) {
                if (statusData[attr].value == record.orderType) {
                    let data = statusData[attr].data;
                    if (data == null || data == undefined) {
                        commonActions.getDomainValue(domainValueParam, record.orderType, 'TASK_TYPE_STATUS', (json) => {
                            if (json.success) {
                                statusData[attr].data = json.data;
                               // console.info(statusData)
                                let jsonData = statusData[attr].data;
                                for (let var1 in jsonData) {
                                    if (jsonData[var1].value == text) {
                                        return jsonData[var1].description;
                                    }
                                }
                            }
                        });
                    } else {
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
        }
        return text;
    }
    render() {
        const { parentProps } = this.props;
        const { state } = parentProps;
        console.info(data);
        const data = state.taskPageData;
        console.info(data);
        const list =  data==null?[]:data.list;
        return (
            <div className="eam-content">
                <div className="eam-content-inner">
                    <Table
                        rowKey="taskId"
                        loading={this.state.tableLoading}
                        pagination={false}
                        dataSource={list}
                        columns={this.columns}
                        rowSelection={this.rowSelection}
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
            </div>
        )
    }
}

class HandleThreeComponent extends React.Component {
    constructor(props) {
        super(props);
        // 高级筛选选项数据
        this.seniorFilterSelectArr = [
            [{description: '待分派', value: 1},
                {description: '待汇报', value: 2},
                {description: '待接单', value: 3},
                {description: '待验收', value: 4},
                {description: '待验收确认', value: 5}]
        ];
    }

    render() {
        return (
            <div className="eam-tab-page">
                <div className="eam-content">
                    <MaintenanceWorkOrderComponent parentProps={this.props} />
                </div>
            </div>
        )
    }
}


function mapStateToProps (state) {
    return {
        state: state.my_task,
        commonState: state.common,
    }
}



function buildActionDispatcher(dispatch) {
    return {
        actions: bindActionCreators(actions, dispatch),
        commonActions:bindActionCreators(commonActions, dispatch),
    }
}

export default connect(mapStateToProps, buildActionDispatcher)(HandleThreeComponent);