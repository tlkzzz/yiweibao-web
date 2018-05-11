/**
 * 维保保养-维保工单 
 */
import React from 'react';
import ReactDOM from 'react-dom';
import { bindActionCreators } from 'redux';
import { Link, browserHistory } from 'react-router';
import { connect } from 'react-redux';
import actions from '../../actions/maintenance.js';
import commonActions from '../../actions/common.js';

import Collection from '../../components/common/collection.js';
import Dropdown from '../../components/common/dropdown.js';
import MoreOperations from '../../components/common/more_operations.js';
import BackList from '../../components/common/back_list.js';
import ListTools from '../../components/common/list_tools.js';
import EamModal from '../../components/common/modal.js';
import DetailsPagination from '../../components/common/details_pagination.js';
import StatusChangeForm from '../../components/common/statusChange.js';
import DispatchOrderForm from './forms/dispatch_order.js';

import { runActionsMethod, correspondenceJson, filterArrByAttr } from '../../tools/';

import { Icon, Button, Table, Pagination, Modal, Radio, Input, message, Menu ,Avatar} from 'antd';
const confirm = Modal.confirm;
const RadioGroup = Radio.Group;
const { TextArea } = Input;

import moment from 'moment';

class WorkOrderComponent extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            tableLoading: false,
            currentPage: 1,
            selectedRowKeys: [],
            sendProcessRadioValue: 'agree', // 发送流程默认同意
            sendProcessYTitle: '', // 同意显示标题
            sendProcessYName: '',  // 同意显示人名
            sendProcessNTitle: '',
            sendProcessNName: '',
            rowSelection: null, // 表格多选
            moreOperationsKey: '',
            list:{},
        }

        const { commonState } = this.props;

        this.param = {
          //  orgId: commonState.orgId,
           // siteId: commonState.siteId,
            pageNum: 1,
            pageSize: 10,
            tsoType : 1,//1:普通报修 2:售后报修
            tsoStatus : '',//所有工单状态
            keywords:'',
        };

        // 后端返回英文显示中文的对应数据
        this.workOrderCorrJson  = correspondenceJson.workOrder;
    }
    //详情
    jumpToDetail = (record,isAdd) => {

        const { actions } = this.props;
        console.log(record);
        if (isAdd) {
            // localStorage.removeItem('workOrder');
            // actions.workOrderCommitUpdateList('CLEAR_DATA'); //清除工单提报现有数据
            browserHistory.push('/maintenance/');
            browserHistory.push('/maintenance/work_order/tab_1?add_work_order=1');
        } else {
            let status = record.status;
            status = this.workOrderCorrJson[status];

            let json = {};
            json.id = record.id;
            json.process = status.process;
            json.status = record.status;
            json.workOrderNum = record.workOrderNum;
            json.description = record.description;

            localStorage.setItem('workOrder', JSON.stringify(json));
            localStorage.setItem('LIST_PARAM', JSON.stringify(this.param)); // localStorage 全大写加下划线命名 作为通用存储名
            browserHistory.push(`/maintenance/work_order/${status.path}`);
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
        
        this.getList();
    }
    // 分页事件
    pageChange = (page, pageSize) => {
        this.setState({ currentPage: page });
        this.param.pageNum = page;
        this.getList();
    }
    // 获取列表数据
    getList = (cb) => {
        const { actions } = this.props;
        this.setState({ tableLoading: true });
        actions.getWorkOrderList(this.param, (json) => {
         
            this.setState({ tableLoading: false,list:json.result });


            console.log(json);
        });
    }
    // 列表删除
    del = (id, callback) => {
        const { actions } = this.props;
        let param = {ids: id};
        runActionsMethod(actions, 'workOrderDel', param, (json) => {
            callback(json)
            this.getList();
        });
    }
    // 删除确认
    showConfirm = (id, arg) => {
        if (Array.isArray(id) && !id.length) {
            message.error('请选择工单')
        } else {
            confirm({
                title: `删除 ${typeof arg !== 'function' ? arg : (id.length + '条数据')}?`,
                okText: '删除',
                onOk: () => {
                    const pathname = window.location.pathname;
                    const isDetailsPage = pathname.indexOf('tab') !== -1;

                    if (Array.isArray(id)) id = id.join(',')
                    this.del(id, (json) => {
                        if (json.success) {
                            isDetailsPage ? browserHistory.push('/maintenance/work_order') : this.getList();
                        }
                    });
                    if (typeof arg === 'function') arg(); // 隐藏复选框
                }
            });
        }
        
    }
    // 列表项收藏点击
    collect = (checked, id) => {
        // const { actions } = this.props;
        // const param = {
        //     checked,
        //     id,
        // }
        // runActionsMethod(actions, 'workOrderCollect', param);
    }

    workOrder_state=(e)=>{
          if(e==1){
            return '待派工'
        }else if(e==2){
            return '待确认'
        }else if(e==3){
            return '待维修'
        }else if(e==4){
            return '维修中'
        }else if(e==5){
            return '已维修'
        }else if(e==6){
            return '已支付'
        }else if(e==7){
            return '已完成'
        }

    }
    // 模糊查询
    fuzzyQuery = (keywords) => {
        this.param.keywords = keywords;
        this.getList();
    }
    tableSelectChange = (selectedRowKeys) => {
        this.setState({ selectedRowKeys });
    }
    // 列表更多操作
    moreClick = (key, hideCheckBox) => {
        if (key === '0') { // 变更状态
            if (!this.state.selectedRowKeys.length) {
                message.error('请选择工单');
            } else {
                this.statusChangeModal.modalShow();
            }
        }
        if (key === '1') { // 批量派工
            if (!this.state.selectedRowKeys.length) {
                message.error('请选择工单');
            } else {
                this.dispatchOrder.modalShow();
            }
        }
        if (key === '3') { //批量删除
            this.showConfirm(this.state.selectedRowKeys, hideCheckBox)
        }
    }
    // 详情页更多操作
    detailsMoreClick = (key) => {
        if (key === '0') {
            this.statusChangeModal.modalShow();
        }
        if (key === '2') { // 详情页删除
            const localStorageWorkOrder = JSON.parse(localStorage.getItem('workOrder'));
            this.showConfirm(localStorageWorkOrder.id, localStorageWorkOrder.workOrderNum)
        }
    }
    // 变更状态
    statusChange = () => {
        const { actions, location } = this.props;

        const values = this.statusChangeForm.props.form.getFieldsValue();
        const pathname = location.pathname;

        const isDetailsPage = pathname.indexOf('tab') !== -1;
        const localStorageWorkOrder = JSON.parse(localStorage.getItem('workOrder'));

        if (isDetailsPage) localStorageWorkOrder.status = values.status;

        let param = {
            ids: isDetailsPage ? [localStorageWorkOrder.id] : this.state.selectedRowKeys,
            status: values.status,
            description: values.description,
        }

        // runActionsMethod(actions, 'statusChange', param, () => {
        //     if (isDetailsPage) {
        //         this.jumpToDetail(localStorageWorkOrder)
        //     } else {
        //         this.setState({ selectedRowKeys: [] });
        //         this.listMoreOperations.cancel();
        //         this.getList();
        //     }

        //     this.statusChangeModal.modalHide();
        // });
    }
    // 批量派工确认
    dispatchOrderConfirm = () => {
        const { actions } = this.props;
        const { form } = this.dispatchOrderForm.props;

        form.validateFields((err, values) => {
            if (!err) {
                const planStartDate = moment(values.date[0]).format('YYYY-MM-DD HH:mm:ss');
                const planCompletionDate = moment(values.date[1]).format('YYYY-MM-DD HH:mm:ss');

                const param = {
                    processStatus: 'agree',
                    description: values.description || '',
                    executorPersonId: values.executorPersonId.split(','),
                    ids: this.state.selectedRowKeys,
                    planStartDate,
                    planCompletionDate,
                };
                // runActionsMethod(actions, 'dispatchOrder', param);
            }
        });
    }
    // 保存工单
    orderSave = () => {
        const { actions, location } = this.props;
        // actions.getFormValues(false);

        const pathname = location.pathname;

        clearTimeout(this.timer);
        this.timer = setTimeout(() => {
            const { state, commonState, location } = this.props;

            const isAddWorkOrder = location.query.add_work_order;
            const localStorageWorkOrder = JSON.parse(localStorage.getItem('workOrder'));

            const ids = {
                orgId: commonState.orgId,
                siteId: commonState.siteId,
                id: localStorageWorkOrder ? localStorageWorkOrder.id : '',
            }

            if (state.getFormValues === true) return;

            if (pathname.indexOf('tab_1') !== -1) {
                const data = state.workOrderCommitListData,
                      addAssetList = data.newAssetList || [],
                      deleteAssetList = data.delOriginalDataId || [];

                state.getFormValues.reportDate = moment(state.getFormValues.reportDate).format('YYYY-MM-DD HH:mm:ss');
                if (state.getFormValues.reportDate === 'Invalid date') state.getFormValues.reportDate = '';
                if (isAddWorkOrder) state.getFormValues.status = 'DTB';

                state.getFormValues.statusDate = moment(state.getFormValues.statusDate).format('YYYY-MM-DD HH:mm:ss');
                state.getFormValues.test12 = moment(state.getFormValues.test12).format('YYYY-MM-DD HH:mm:ss');

                state.getFormValues.createUser = commonState.personId;
                state.getFormValues.reportId = commonState.personId;
                state.getFormValues.reportName = commonState.personName;

                addAssetList.forEach((item) => {
                    item.assetId = item.id;
                })

                const param = {
                    ...ids,
                    ...state.getFormValues,
                    addAssetList,
                    deleteAssetList,
                }

                // runActionsMethod(actions, 'workOrderCommitSave', param, (json) => {
                //     const data = json.data;
                //     const obj = {};
                //     obj.id = data.id;
                //     obj.process = 1;
                //     obj.status = data.status;
                //     obj.workOrderNum = data.workOrderNum;
                //     obj.description = data.description;

                //     localStorage.setItem('workOrder', JSON.stringify(obj));
    
                //     setTimeout(() => {
                //         browserHistory.push('/maintenance/');
                //         browserHistory.push('/maintenance/work_order/tab_1');
                //     }, 500);
                // });
            }

            else if (pathname.indexOf('tab_2') !== -1) {
                const data = state.taskListData,
                      eamNeedItemVoList = data.newMaterialsList || [],
                      eamOrderstepVoList = data.newTaskStepsList || [],
                      deleteEamNeedItemVoList = data.materialDelOriginalDataId || [],
                      deleteEamOrderstepVoList = data.delOriginalDataId || [];

                state.getFormValues.planStartDate = moment(state.getFormValues.planStartDate).format('YYYY-MM-DD HH:mm:ss');
                state.getFormValues.planCompletionDate = moment(state.getFormValues.planCompletionDate).format('YYYY-MM-DD HH:mm:ss');

                const eamNeedItemCopy = JSON.parse(JSON.stringify(eamNeedItemVoList));

                eamNeedItemCopy.forEach(item => {
                    item.itemId = item.id;
                    item.itemUnit = item.orderUnit
                    delete item.id;
                    delete item.orderUnit;
                });

                const param = {
                    ...ids,
                    ...state.getFormValues,
                    eamNeedItemVoList: eamNeedItemCopy,
                    eamOrderstepVoList,
                    deleteEamNeedItemVoList,
                    deleteEamOrderstepVoList,
                }
        
                // runActionsMethod(actions, 'taskAssignSave', param, () => {
                //     setTimeout(() => {
                //         browserHistory.push('/maintenance/');
                //         browserHistory.push('/maintenance/work_order/tab_2');
                //     }, 500);
                // });
            }

            else if (pathname.indexOf('tab_3') !== -1) {
                const data = state.workOrderReportListData;

                state.getFormValues.actualStartDate = moment(state.getFormValues.actualStartDate).format('YYYY-MM-DD HH:mm:ss');
                state.getFormValues.actualEndDate = moment(state.getFormValues.actualEndDate).format('YYYY-MM-DD HH:mm:ss');

                state.getFormValues.status = localStorageWorkOrder.status; //表单没有显示状态 从本地取

                const param = {
                    ...ids,
                    ...state.getFormValues,
                }

                // runActionsMethod(actions, 'workOrderReportSave', param, () => {
                //     setTimeout(() => {
                //         browserHistory.push('/maintenance/');
                //         browserHistory.push('/maintenance/work_order/tab_3');
                //     }, 500);
                // });
            }

            else if (pathname.indexOf('tab_4') !== -1) {

                const data = state.workOrderCheckListData;
                state.getFormValues.acceptionTime = moment(state.getFormValues.acceptionTime).format('YYYY-MM-DD HH:mm:ss');
                state.getFormValues.status = localStorageWorkOrder.status; //表单没有显示状态 从本地取
                const param = {
                    ...ids,
                    ...state.getFormValues,
                }

                // runActionsMethod(actions, 'workOrderCheckSave', param, () => {
                //     setTimeout(() => {
                //         browserHistory.push('/maintenance/');
                //         browserHistory.push('/maintenance/work_order/tab_4');
                //     }, 500);
                // });
            }

            

        },0);
    }
    // 发送流程
    sendProcess = (curProcess) => {

        const { state, actions, commonState } = this.props;
        

        if (curProcess == 1) { // 待提报
            const data = state.workOrderCommitListData;
            confirm({
                title: '是否启动任务流程？',
                className: 'send-process-confirm',
                content: (
                    <p className="send-process-text">任务将会推送到 <span className="blue">&lt;{`${data.projectGroupTypeName}用户组`}&gt;</span> 进行处理。通过记录中“执行记录”进行实时查看！</p>
                ),
                iconType: 'smile-o',
                onOk: () => {
                    this.sendProcessConfirm(curProcess, data.id);
                }
            });
        } else {

            let sendProcessYTitle, sendProcessYName, sendProcessNTitle, sendProcessNName;

            if (curProcess == 2) { // 待分派
                const data = state.taskListData;
                
                sendProcessYTitle = '任务分派';
                sendProcessYName = `${data.executorPersonName}${data.entrustExecutePersonName ? (',' + data.entrustExecutePersonName) : ''}`;
                sendProcessNTitle = '驳回重新提报';
                sendProcessNName = data.reportName;

                this.setState({ sendProcessYTitle, sendProcessYName, sendProcessNTitle, sendProcessNName });
            }
            else if (curProcess == 3) {
                const data = state.workOrderReportListData;

                switch (data.status) {
                    case 'DJD': // 待接单
                        sendProcessYTitle = '接单';
                        sendProcessYName = commonState.personName;
                        sendProcessNTitle = '重新分派';
                        sendProcessNName = `${data.projectGroupTypeName}用户组`;

                        this.setState({ sendProcessYTitle, sendProcessYName, sendProcessNTitle, sendProcessNName });
                        break;
                    case 'DHB':
                        // actions.getFormValues(false);

                        clearTimeout(this.timer);
                        this.timer = setTimeout(() => { // 异步获取表单值 因为actions.getFormValues为异步执行 同步取值取不到
                            const { state } = this.props;
                            const suspension = state.getFormValues.suspension; //是否挂起
                            
                            sendProcessYTitle = suspension === 'false' ? '执行汇报' : '申请挂起';
                            sendProcessYName = data.assignPersonName;
                            sendProcessNTitle = '重新分派';
                            sendProcessNName = `${data.projectGroupTypeName}用户组`;

                            this.setState({ sendProcessYTitle, sendProcessYName, sendProcessNTitle, sendProcessNName });

                        }, 0);
                        break;
                    case 'SQGQ':
                        // actions.getFormValues(false);
                        clearTimeout(this.timer);
                        this.timer = setTimeout(() => { // 异步获取表单值 因为actions.getFormValues为异步执行 同步取值取不到
                            const { state } = this.props;
                            const suspensionType = state.getFormValues.suspensionType; // 挂起类型
                            
                            if (suspensionType === 'GYSWX') { // 挂起类型为供应商维修
                                sendProcessYTitle = '验收确认';
                                sendProcessYName = data.reportName;
                            } else {
                                sendProcessYTitle = '挂起';
                                sendProcessYName = data.assignPersonName;
                            }
                            sendProcessNTitle = '重新执行汇报';
                            sendProcessNName = data.actualExecutorResponsibleName;
                            
                            this.setState({ sendProcessYTitle, sendProcessYName, sendProcessNTitle, sendProcessNName });

                        }, 0);
                        break;
                    case 'GQ':
                        sendProcessYTitle = '验收确认';
                        sendProcessYName = data.reportName;
                        sendProcessNTitle = '重新执行汇报';
                        sendProcessNName = data.actualExecutorResponsibleName;

                        this.setState({ sendProcessYTitle, sendProcessYName, sendProcessNTitle, sendProcessNName });

                }

            }
            else if (curProcess == 4) {
                const data = state.workOrderCheckListData;
                
                sendProcessYTitle = '确认验收';
                sendProcessYName = data.reportName;
                sendProcessNTitle = '重新执行汇报';
                sendProcessNName = data.actualExecutorResponsibleName;

                this.setState({ sendProcessYTitle, sendProcessYName, sendProcessNTitle, sendProcessNName });
            }

            this.sendProcessModal.modalShow();
        }
        
    }
    sendProcessConfirm = (curProcess, id) => {
        const { actions } = this.props;

        if (curProcess != 1 && !this.state.sendProcessRadioValue) {
            message.error('选择项不能为空！', 6)
            return;
        }

        const param = {};
        param.id = id;

        if (curProcess == 1) {
            param.processStatus = 'agree';
            param.description = '已启动任务流程';
        } else {
            param.processStatus = this.state.sendProcessRadioValue;
            param.description = ReactDOM.findDOMNode(this.sendProcessTextarea).value;
        }

        // runActionsMethod(actions, 'sendProcess', param, (json) => {
        //     const { state } = this.props;
        //     let dataName = '';

        //     switch (curProcess) {
        //         case '1':
        //             dataName = 'workOrderCommitListData';
        //             break;
        //         case '2':
        //             dataName = 'taskListData';
        //             break;
        //         case '3':
        //             dataName = 'workOrderReportListData';
        //             break;
        //         case '4':
        //             dataName = 'workOrderCheckListData';
        //             break;
        //     }

        //     const data = state[dataName];

        //     const obj = {};
        //     obj.id = data.id; // 详情数据里取
        //     obj.status = json.data; // 保存成功返回数据里取保存后最新值
        //     obj.process = correspondenceJson.workOrder[obj.status].process; // 保存成功返回数据里取保存后最新值
        //     obj.workOrderNum = this.localStorageWorkOrder.workOrderNum; // 本地存储取 因为有的返回数据没有编号和描述
        //     obj.description = this.localStorageWorkOrder.description; // 本地存储取 因为有的返回数据没有编号和描述

        //     localStorage.setItem('workOrder', JSON.stringify(obj));

        //     setTimeout(() => {
        //         browserHistory.push(`/maintenance/`)
        //         browserHistory.push(`/maintenance/work_order/tab_${obj.process}`)
        //     }, 500);
        // });
    }
    // 数据是否加载完成 未完成不能点保存
    loadIsComplete = (curProcess, isAddWorkOrder) => {

        const { state, commonState } = this.props;

        let complete = false

        switch (curProcess) {
            case '1':
                const workOrderCode = isAddWorkOrder ? state.workOrderCode : true,
                      workProjectTypeData = commonState.workProjectTypeData,
                      workOrderTypeData = commonState.workOrderTypeData,
                      workOrderCommitListData = isAddWorkOrder ? true : state.workOrderCommitListData.id;

                if (this.canSave || isAddWorkOrder) {
                    if (
                        workOrderCode &&
                        workProjectTypeData.length &&
                        workOrderTypeData.length &&
                        workOrderCommitListData
                    ) complete = true;
                } else {
                    complete = true;
                }

                break;
            case '2':
                const standardTypeData = commonState.standardTypeData,
                      jpStatusData = commonState.jpStatusData,
                      jpTypeData = commonState.jpTypeData,
                      taskListData = state.taskListData.id;

                if (this.canSave) {
                    if (
                        standardTypeData.length &&
                        jpStatusData.length &&
                        jpTypeData.length &&
                        taskListData
                    ) complete = true;
                } else {
                    complete = true;
                }
                
                break;
            case '3':

                const suspensionTypeData = commonState.suspensionTypeData,
                      workOrderReportListData = state.workOrderReportListData.id;

                if (this.canSave) {
                    if (suspensionTypeData.length && workOrderReportListData) complete = true;
                } else {
                    complete = true;
                }
                
                break;
            case '4':
                const workOrderCheckListData = state.workOrderCheckListData.id;
                if (this.canSave) {
                    if (workOrderCheckListData) complete = true;
                } else {
                    complete = true;
                }
                break;
        }

        return complete;
    }
    // 重置高级筛选参数
    resetListParam = () => {
        this.param.status = [];
        this.param.workType = [];
        this.param.projectType = [];
        this.param.reportId = [];
        this.param.actualExecutorId = [];
        this.param.reportStartDate = null;
        this.param.reportEndDate = null;
        this.param.acceptionStartTime = null;
        this.param.acceptionEndTime = null;
    }
    listToolsComponentWillMount = () => { // 代替 componentWillMount
        //this.resetListParam();
        this.getList();
    }
    render () {
        const { children, state, commonState, commonActions, location } = this.props;
        const data = state.workOrderListData;
    //    const list = children || data.list;
    const list = this.state.list;

        const isAddWorkOrder = location.query.add_work_order;
        const isFromOther = location.query.from;

        const localStorageWorkOrder = JSON.parse(localStorage.getItem('workOrder'));
        this.localStorageWorkOrder = localStorageWorkOrder;

        const workOrderCommitData = state.workOrderCommitListData;
        const workOrderCommitNum = /*workOrderCommitData.workOrderNum ? workOrderCommitData.workOrderNum : */(localStorageWorkOrder && localStorageWorkOrder.workOrderNum);
        const workOrderCode = isAddWorkOrder ? state.workOrderCode : workOrderCommitNum;

        const taskData = state.taskListData;

        const curProcess = location.pathname.charAt(location.pathname.length-1);
        let sendProcess = localStorageWorkOrder && localStorageWorkOrder.process == curProcess;
        this.canSave = sendProcess;

        let sendProcessId;

        if (curProcess == 1) {
            sendProcessId = workOrderCommitData.id;
        }
        else if (curProcess == 2) { // 执行人存在
            if (taskData.executorPersonName && sendProcess) {
                sendProcess = true;
                sendProcessId = taskData.id; // 任务分配tab页详情数据找到工单id
            } else {
                sendProcess = false;
            }
        }
        else if (curProcess == 3) {
            sendProcessId = state.workOrderReportListData.id;
        }
        else if (curProcess == 4) {
            sendProcessId = state.workOrderCheckListData.id;
        }

        const radioStyle = {
            display: 'block',
            height: '30px',
            lineHeight: '30px',
            fontSize: 14
        };

        const rowSelection = this.state.rowSelection ? 
        {
            selectedRowKeys: this.state.selectedRowKeys,
            onChange: this.tableSelectChange,
            getCheckboxProps: record => {

                let disabled = false;

                if (this.state.moreOperationsKey === '1') {
                    disabled = record.status !== 'DFP';
                }
                else if (this.state.moreOperationsKey === '3') { // 批量删除 不是待提报 全部disable
                    disabled = record.status !== 'DTB';
                }

                return { disabled }
            }
        } :
        null;

        const defaultRender = (text, record, key) => {
            return (
                <p>{text ? text : '-'}</p>
            )
        };

        //表格字段
        const columns = [
            {
                title: '工单编号',
                dataIndex: 'tsoNumber',
                key: 'tsoNumber',
                render: (text, record, key) => {
                    return (
                        <p><a className="order-number" onClick={() => { this.jumpToDetail(record) }}>{text ? text : '-'}</a></p>
                    )
                }
            },
            {
                title: '商品/设备名称',
                dataIndex: 'tpName',
                key: 'tpName',
                sorter: true,
            },
            {
                title: '型号',
                dataIndex: 'specJsonValue',
                key: 'specJsonValue',
            },
            {
                title: '报修人',
                dataIndex: 'tmName',
                key: 'tmName',
            },{
                title: '联系电话',
                dataIndex: 'tcMobile',
                key: 'tcMobile',
                sorter: true,
            },
            {
                title: '联系地址',
                dataIndex: 'tcAddress',
                key: 'tcAddress',
            },
            {
                title: '提报时间',
                dataIndex: 'tsoAddDate',
                key: 'tsoAddDate',
                sorter: true,
            },
            {
                title: '状态',
                dataIndex: 'tsoStatus',
                key: 'tsoStatus',
                sorter: true,
                render: val => <span>{this.workOrder_state(val)}</span>
            },
            {
                title: '操作',
                dataIndex: '4',
                key: '4',
                width: 120,
                render: (text, record, key) => {
                    return (
                        <div className="table-icon-group">
                          {/**  <Collection
                                isCollect={record.collect}
                                onChange={checked => {
                                    this.collect(checked, record.tsoId);
                                }}
                            /> */}
                            {
                                record.tsoStatus == 1 ?
                                <Icon
                                    type="user-add"
                                    onClick={() => {
                                        this.showConfirm(record.tsoId, record.tsoNumber)
                                    }}
                                /> :
                                <Icon
                                    type="copy"
                                    onClick={() => {
                                        this.showConfirm(record.tsoId, record.tsoNumber)
                                    }}
                                /> 
                            }
                            
                        </div>
                    )
                }
            },
        ];

        const NewStatusChange = (
            <EamModal
                title="变更状态"
                ref={statusChangeModal => this.statusChangeModal = statusChangeModal}
                afterClose={() => {
                    this.statusChangeForm.props.form.resetFields()
                }}
            >
                <StatusChangeForm
                    statusData={commonState.workOrderStatusData}
                    wrappedComponentRef={statusChangeForm => this.statusChangeForm = statusChangeForm}
                />
                <div className="modal-footer clearfix">
                    <Button size="large" onClick={() => {this.statusChangeModal.modalHide()}}>取消</Button>
                    <Button type="primary" size="large" onClick={this.statusChange}>确定</Button>
                </div>
            </EamModal>
        )

        return children ?

        (
            <div>
                <div className="top-bar clearfix">
                    <div className="details-title pull-left">
                        <h3>{this.loadIsComplete(curProcess, isAddWorkOrder) ? workOrderCode : <span><Icon type="loading" /> 数据加载中...</span>}</h3>
                        <span className="eam-tag">{/*workOrderCommitData.status ? correspondenceJson.workOrder[workOrderCommitData.status].text : */this.loadIsComplete(curProcess, isAddWorkOrder) ? (localStorageWorkOrder && correspondenceJson.workOrder[localStorageWorkOrder.status].text) : null}</span>
                        <p>{/*workOrderCommitData.description ? workOrderCommitData.description : */this.loadIsComplete(curProcess, isAddWorkOrder) ? (localStorageWorkOrder && localStorageWorkOrder.description) : ''}</p>
                    </div>
                    <div className="list-tools-right pull-right">
                        {
                            (isAddWorkOrder || isFromOther) ? // 新建和来自其他页面 详情不切换分页
                            null :
                            <DetailsPagination
                                state={state} // 此模块state
                                listDataName="workOrderListData" // 列表数据state名 -> data = state.workOrderListData
                                localStorageName="workOrder" // onChang 方法内设置的存储名
                                onChange={(record)=>{
                                    let status = record.status;
                                    status = this.workOrderCorrJson[status];

                                    let json = {};
                                    json.id = record.id;
                                    json.process = status.process;
                                    json.status = record.status;
                                    json.workOrderNum = record.workOrderNum;
                                    json.description = record.description;

                                    // *跳转前存相关数据 和列表页跳详情页做同样处理 (这个存储是必要的操作并且必须包含id)
                                    localStorage.setItem('workOrder', JSON.stringify(json));
                                    // *根据自己的模块做跳转
                                    browserHistory.push('/maintenance/');
                                    browserHistory.push(`/maintenance/work_order/${status.path}`);
                                }}
                                getList={(pageNum, cb) => {
                                    // *分页是根据列表页数据切换数据 本业列表数据用完 这里请求上|下一页数据
                                    // *列表页跳详情页必须本地存储列表页请求数据参数 全局统一用LIST_PARAM 防止详情页刷新请求的数据与列表跳详情的数据不一致
                                    this.param = JSON.parse(localStorage.getItem('LIST_PARAM'));
                                    if (pageNum) this.param.pageNum = pageNum;
                                    this.getList(cb);
                                }}
                            />
                        }
                        <BackList location={location} />
                        {
                            isAddWorkOrder ?
                            null :
                            <Dropdown
                                overlay={(
                                    <Menu onClick={(e) => {this.detailsMoreClick(e.key)}}>
                                        <Menu.Item key="0"><Icon type="edit" /> 变更状态</Menu.Item>
                                        {
                                            localStorageWorkOrder && localStorageWorkOrder.status === 'DTB' ?
                                            <Menu.Divider /> : 
                                            null
                                        }
                                        {
                                            localStorageWorkOrder && localStorageWorkOrder.status === 'DTB' ?
                                            <Menu.Item key="2"><Icon type="delete" /> 删除</Menu.Item> : 
                                            null
                                        }
                                    </Menu>
                                )}
                                trigger={['click']}
                            >
                                更多操作
                            </Dropdown>
                        }
                        {
                            isAddWorkOrder ?
                            null :
                            <Button type="primary" size="large" onClick={() => { this.jumpToDetail('', true) }}>新建</Button>
                        }
                        {
                            sendProcess ?
                            <Button type="primary" size="large" onClick={() => { this.sendProcess(curProcess) }}>发送流程</Button> :
                            null
                        }
                    </div>

                    <div className="eam-tab-nav">
                        <Link activeClassName="active" to="/maintenance/work_order/tab_1"><Icon type="check-circle-o" /> 工单提报</Link>
                        {
                            isAddWorkOrder ? 
                            null :
                            <Link activeClassName="active" to="/maintenance/work_order/tab_2"><Icon type="check-circle-o" /> 任务分派</Link>
                        }
                        {
                            isAddWorkOrder ? 
                            null :
                            <Link activeClassName="active" to="/maintenance/work_order/tab_3"><Icon type="check-circle-o" /> 执行汇报</Link>
                        }
                        {
                            isAddWorkOrder ? 
                            null :
                            <Link activeClassName="active" to="/maintenance/work_order/tab_4"><Icon type="check-circle-o" /> 验收确认</Link>
                        }
                        {
                            (this.canSave || isAddWorkOrder) ?
                            <Button
                                style={{position: 'absolute', right: 0, bottom: 10}}
                                size="large"
                                onClick={this.orderSave}
                                disabled={this.loadIsComplete(curProcess, isAddWorkOrder) ? false : true}
                            >
                                保存
                            </Button> :
                            null
                        }
                    </div>
                </div>
                {children}
                <EamModal
                    title="发送流程"
                    ref={sendProcessModal => this.sendProcessModal = sendProcessModal}
                    afterClose={() => { this.setState({ sendProcessRadioValue: '' }) }}
                >
                    <RadioGroup onChange={e => { this.setState({ sendProcessRadioValue: e.target.value }) }} value={this.state.sendProcessRadioValue}>
                        <Radio
                            style={radioStyle}
                            value='agree'
                        >
                            {this.state.sendProcessYTitle}
                        </Radio>
                        <p
                            style={{marginBottom: 20, textIndent: 22}}
                            className="send-process-text"
                        >
                            任务将会推送到<span className="blue">&lt;{this.state.sendProcessYName}&gt;</span>进行处理。通过记录中“执行记录”进行实时查看！
                        </p>
                        <Radio
                            style={radioStyle}
                            value='reject'
                        >
                            {this.state.sendProcessNTitle}
                        </Radio>
                        <p
                            style={{textIndent: 22}}
                            className="send-process-text"
                        >
                            驳回到<span className="blue">&lt;{this.state.sendProcessNName}&gt;</span>重新处理。
                        </p>
                    </RadioGroup>
                    <p
                        style={{marginTop: 20}}
                        className="send-process-text"
                    >
                        备注说明：（填写驳回原因、审批意见等）
                    </p>
                    <Input type="textarea" rows={4} ref={sendProcessTextarea => this.sendProcessTextarea = sendProcessTextarea}/>
                    <div className="modal-footer clearfix">
                        <Button size="large" onClick={() => {this.sendProcessModal.modalHide()}}>取消</Button>
                        <Button type="primary" size="large" onClick={() => { this.sendProcessConfirm(curProcess, sendProcessId) }}>确定</Button>
                    </div>
                </EamModal>
                {NewStatusChange}
            </div>
        ) :
        (
            <div>
                <div className="top-bar clearfix">
                    <ListTools
                        title="维保工单"
                        commonState={commonState}
                        commonActions={commonActions}
                        collectionChange={(checked) => {
                            this.param.collect = checked;
                            this.getList();
                        }}
                        listToolsComponentWillMount={this.listToolsComponentWillMount}
                        seniorFilter = {{
                            data: [
                                {
                                    type: 'DOMAIN_VALUE',               // 选择项类型
                                    key: 'workOrderStatusData',         // key 域值的key用作取state数据
                                    label: '工单状态',                    // 标题
                                    actionsType: 'WORK_ORDER_STATUS',   // 域值actions type
                                    actionsParam: 'workOrder',           // 域值actions 参数
                                },
                                {
                                    type: 'DOMAIN_VALUE',
                                    key: 'workOrderTypeData',
                                    label: '工单类型',
                                    actionsType: 'WORK_ORDER_TYPE',
                                    actionsParam: 'woType',
                                    
                                },
                                {
                                    type: 'DOMAIN_VALUE',
                                    key: 'workProjectTypeData',
                                    label: '工程类型',
                                    actionsType: 'WORK_PROJECT_TYPE',
                                    actionsParam: 'woProjectType',
                                    
                                },
                                {
                                    type: 'SELECT_PERSON',
                                    key: 'reportName',
                                    label: '提报人',
                                },
                                {
                                    type: 'SELECT_PERSON',
                                    key: 'actualExecutionPersonName',
                                    label: '实际执行人',
                                },
                                {
                                    type: 'SELECT_TIME',
                                    key: 'reportDate',
                                    label: '提报时间',
                                },
                                {
                                    type: 'SELECT_TIME',
                                    key: 'acceptionDate',
                                    label: '验收时间',
                                },
                            ],
                            onOk: result => {
                                this.setState({ currentPage: 1 });
                                this.param.pageNum = 1;

                                this.param.status = filterArrByAttr(result[0] && result[0].data || [], 'value');
                                this.param.workType = filterArrByAttr(result[1] && result[1].data || [], 'value');
                                this.param.projectType = filterArrByAttr(result[2] && result[2].data || [], 'value');
                                this.param.reportId = filterArrByAttr(result[3] && result[3].data || [], 'personId');
                                this.param.actualExecutorId = filterArrByAttr(result[4] && result[4].data || [], 'personId');

                                this.param.reportStartDate = result[5] && result[5].data[0] || null;
                                this.param.reportEndDate = result[5] && result[5].data[1] || null;

                                this.param.acceptionStartTime = result[6] && result[6].data[0] || null;
                                this.param.acceptionEndTime = result[6] && result[6].data[1] || null;

                                this.getList();
                            }
                        }}
                        onEnter={(text) => {
                            this.fuzzyQuery(text);
                        }}
                    />
                    <div className="list-tools-right pull-right">
                        <Pagination
                            total={list.pageCount}
                            className="pull-left"
                            current={this.state.currentPage}
                            onChange={this.pageChange}
                        />
                        <MoreOperations
                            style={{float: 'left'}}
                            ref={listMoreOperations => this.listMoreOperations = listMoreOperations}
                            menuData={[
                                {
                                    icon: 'edit',
                                    text: '变更状态',
                                    confirmText: '选择状态'
                                },
                                {
                                    icon: 'solution',
                                    text: '批量派工',
                                    confirmText: '确认派工'
                                },
                                {
                                    divider: 'divider'
                                },
                                {
                                    icon: 'delete',
                                    text: '批量删除',
                                    confirmText: '确认删除'
                                }
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
                                }, () => {
                                    this.setState({
                                        moreOperationsKey: key,
                                    })
                                })
                            }}
                            onOk={(key, hideCheckBox) => {
                                this.moreClick(key, hideCheckBox);
                            }}
                        />
                        <Button type="primary" size="large"><a onClick={() => { this.jumpToDetail('', true) }}>新建</a></Button>
                    </div>
                </div>
                <div className="eam-content">
                    <div className="eam-content-inner">
                        <Table
                            rowKey="tsoId"
                            loading={this.state.tableLoading}
                            pagination={false}
                            dataSource={list.rows}
                            columns={columns}
                            rowSelection={rowSelection}
                            bordered
                            onChange={this.tableChange}
                        />
                        <Pagination
                            total={list.pageCount}
                            showTotal={(total, range) => `当前第${range[0]}-${range[1]}条 / 共${total}条`}
                            current={this.state.currentPage}
                            showQuickJumper
                            onChange={this.pageChange}
                        />
                    </div>
                </div>
                {NewStatusChange}
                <EamModal
                    title={<span>批量派工&nbsp;&nbsp;&nbsp;&nbsp;<span className="red">*此操作是高风险操作，请谨慎执行！</span></span>}
                    ref={dispatchOrder => this.dispatchOrder = dispatchOrder}
                    afterClose={() => {
                        this.dispatchOrderForm.props.form.resetFields()
                    }}
                >
                    <DispatchOrderForm wrappedComponentRef={dispatchOrderForm => this.dispatchOrderForm = dispatchOrderForm}/>
                    <div className="modal-footer clearfix">
                        <Button size="large" onClick={() => {this.dispatchOrder.modalHide()}}>取消</Button>
                        <Button type="primary" size="large" onClick={this.dispatchOrderConfirm}>确定</Button>
                    </div>
                </EamModal>
            </div>
        )
    }
}


function mapStateToProps (state) {
    return {
        state: state.maintenance,
        commonState: state.common,
    }
}

function buildActionDispatcher(dispatch) {
    return {
        actions: bindActionCreators(actions, dispatch),
        commonActions: bindActionCreators(commonActions, dispatch),
    }
}

export default connect(mapStateToProps, buildActionDispatcher)(WorkOrderComponent);