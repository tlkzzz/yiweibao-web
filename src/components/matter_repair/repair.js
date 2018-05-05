/**
 * 报事报修-报修工单 
 */
import React from 'react';
import { bindActionCreators } from 'redux';
import { Link, browserHistory } from 'react-router';
import { connect } from 'react-redux';
import actions from '../../actions/matter_repair.js';
import commonActions from '../../actions/common.js';
import DetailsPagination from '../../components/common/details_pagination.js';
import MoreOperations from '../../components/common/more_operations.js';
import StatusChangeForm from '../../components/common/statusChange.js';
import EamModal from '../../components/common/modal.js';
import moment from 'moment';

import Collection from '../../components/common/collection.js';
import Dropdown from '../../components/common/dropdown.js';
import BackList from '../../components/common/back_list.js';
import ListTools from '../../components/common/list_tools.js';
import SendProcess from '../../components/common/send_process.js';
import { correspondenceJson, runActionsMethod, filterArrByAttr } from '../../tools/';
import PubSub  from 'pubsub-js';
import { pubTopic } from '../../tools/constant';

import { Icon, Button, Table, Pagination, Menu, Modal, Radio, Input, message } from 'antd';
const confirm = Modal.confirm;

class RepairComponent extends React.Component {
    constructor(props) {
        super(props);
        const { commonState } = this.props;

        //订阅发送流程-表单校验成功回调消息
        PubSub.subscribe(pubTopic.matterrepair.MATTER_REPAIR_SEND_PROCESS_FORM_VALIDATE_CALLBACK, this.sendProcessCallBack );
        //订阅工单保存-表单校验成功回调消息
        PubSub.subscribe(pubTopic.matterrepair.MATTER_REPAIR_SAVE_FORM_VALIDATE_CALLBACK, this.saveRepairOrderCallBack );

        // 后端返回英文显示中文的对应数据
        this.repairOrderConfigJson  = correspondenceJson.repairOrder;
        this.state = {
            tableLoading: false,
            workOrderLoading: false,
            currentPage: 1,
            visibleProcess: false,
            selectedRowKeys: [],
            sortedInfo: {},
            PASS_Message: '',       //流程弹框-通过消息
            REJECT_Message: '',     //流程弹框-驳回消息
            processDescription: '', //流程弹框-审批意见、驳回原因
            defaultProcessSelector: '', //流程弹框-默认选择项
        };

        this.defaultRender = (text, record, key) => {
            return (
                <p>{text ? text : '-'}</p>
            )
        };
        this.workOrderStatusRender = (text, record, key) => {
            const { commonState } = this.props;
            const workProjectTypeData = commonState.workOrderStatusData ? commonState.workOrderStatusData : [];
            const object = workProjectTypeData.find((object) => {
                return object.value == text;
            });
            return (
                <p>{object ? object.description : '-'}</p>
            )
        };
        this.projectTypeRender = (text, record, key) => {
            const { commonState } = this.props;
            const workProjectTypeData = commonState.workProjectTypeData ? commonState.workProjectTypeData : [];
            const object = workProjectTypeData.find((object) => {
                return object.value == text;
            });
            return (
                <p>{object ? object.description : '-'}</p>
            )
        };
        this.workOrderSourceRender = (text, record, key) => {
            const { commonState } = this.props;
            const workOrderSourceData = commonState.workOrderSourceData ? commonState.workOrderSourceData : [];
            const object = workOrderSourceData.find((object) => {
                return object.value == text;
            });
            return (
                <p>{object ? object.description : '-'}</p>
            )
        };

        this.param = {
            orgId: commonState.orgId,
            siteId: commonState.siteId,
            pageNum: 1,
            pageSize: 10,
        };
        this.paramRecord = {};
    }
    jumpToDetail = (record, isAdd) => {
        const { commonState, actions } = this.props;
        if (isAdd) {
            localStorage.setItem('addRepairWorkOrder', true);
            let param = {
                modelKey: 'repair',
                orgId: commonState.orgId,
                siteId: commonState.siteId
            };
            actions.getCodegenerator(param, (data) => {
                if (data && data.success) {
                    let initParam = {
                        workOrderNum: data.data,
                        workOrderStatus: correspondenceJson.repairOrder.DTB.code,
                        orgId: commonState.orgId,
                        siteId: commonState.siteId,
                        reportPersonId: commonState.personId,
                        reportPersonName: commonState.personName,
                        reportPersonTel: commonState.personMobile,
                        reportDate: moment().format('YYYY-MM-DD HH:mm:ss'),
                        workOrderStatusDate: moment().format('YYYY-MM-DD HH:mm:ss'),
                        projectType: commonState.workProjectTypeData ? commonState.workProjectTypeData[0].value : null,
                        workOrderSource: commonState.workOrderSourceData ? commonState.workOrderSourceData[0].value : null,
                        incidentLevel: 'M',
                    };
                    actions.updateRepairWorkOrder(initParam, () => {
                        //存入初始数据
                        localStorage.setItem('repairWorkOrder_init', JSON.stringify(initParam));
                        localStorage.setItem('repairWorkOrder_edit', localStorage.getItem('repairWorkOrder_init'));
                        //清空流程数据
                        actions.updaterepairOrderFlow(null);
                        browserHistory.push(`/matter_repair/repair/${this.repairOrderConfigJson.DTB.path}`);
                        //location.href = `/matter_repair/repair/${this.repairOrderConfigJson.DTB.path}`;
                    });
                } else {
                    message.error(data ? data.msg : '自动生成工单编码失败，请刷新后重试！', 3);
                }
            });
        } else {
            this.setState({ workOrderLoading: true });
            localStorage.setItem('addRepairWorkOrder', false);
            //查询工单数据
            actions.repairOrderInformation({ id: record.workOrderId }, (data) => {
                //存入初始数据
                localStorage.setItem('repairWorkOrder_init', JSON.stringify(data));
                localStorage.setItem('repairWorkOrder_edit', localStorage.getItem('repairWorkOrder_init'));
                let status = this.repairOrderConfigJson[data.workOrderStatus];
                this.setState({ workOrderLoading: false });
                browserHistory.push(`/matter_repair/repair/${status.path}`);
            });
        }
        localStorage.setItem('LIST_PARAM', JSON.stringify(this.paramRecord)); // localStorage 全大写加下划线命名 作为通用存储名
    };
    // 表格事件-排序
    tableChange = (pagination, filters, sorter) => {
        let sortedInfo = {};
        if (sorter.order) {
            let sorterOrder = sorter.order;
            sorterOrder = sorterOrder.slice(0, sorterOrder.indexOf('end'));
            sortedInfo = {
                sorts: sorter.field,
                order: sorterOrder
            }
        }
        this.setState({ sortedInfo });
        this.getList(sortedInfo);
    };
    // 分页事件
    pageChange = (page, pageSize) => {
        this.setState({ currentPage: page });
        this.param.pageNum = page;
        this.paramRecord.pageNum = page;
        this.getList(this.paramRecord);
    };
    toFirstPage = () => {
        this.setState({ currentPage: 1 });
        this.param.pageNum = 1;
    };
    //详情页返回列表
    detailBackToList = () => {
        this.toFirstPage();
        this.setState({ sortedInfo: {} });
        this.getList();
    };
    // 获取列表数据
    getList = (filter, cb) => {
        const { actions } = this.props;
        this.setState({
            tableLoading: true,
            selectedRowKeys: []
        });

        let param = Object.assign({}, this.param, this.state.sortedInfo, filter);
        this.paramRecord = param;
        actions.repairWorkOrderGetList(param, () => {
            cb && cb();
            this.setState({ tableLoading: false });
        });
    };
    // 列表删除
    del = (id) => {
        const { actions } = this.props;
        let param = { ids: id, };
        actions.repairWorkOrderDel(param, (json) => {
            if (json.success) {
                message.success(json.msg);
                this.getList();
            } else {
                message.error(json.msg);
            }
        });
    };
    delForDetail = () => {
        const isAdd = JSON.parse(localStorage.getItem('addRepairWorkOrder'));
        if (isAdd) {
            message.warning('当前工单未保存，无需删除！');
        } else {
            const { actions } = this.props;
            const order = JSON.parse(localStorage.getItem('repairWorkOrder_init'));
            confirm({
                title: `删除 ${order.workOrderNum} `,
                okText: '删除',
                onOk: () => {
                    let param = { ids: order.workOrderId, };
                    actions.repairWorkOrderDel(param, (json) => {
                        if (json.success) {
                            message.success(json.msg);
                            browserHistory.push('/matter_repair/repair');
                        } else {
                            message.error(json.msg);
                        }
                    });
                }
            });
        }
    };
    batchDel = () => {
        const selectedRowKeys = this.state.selectedRowKeys;
        if (selectedRowKeys == null || selectedRowKeys.length == 0) {
            message.warning('请选择要删除的工单！', 3);
        } else {
            confirm({
                title: `是否删除选中的 ${selectedRowKeys.length} 条工单?`,
                okText: '删除',
                onOk: () => {
                    this.del(selectedRowKeys);
                }
            });
        }
    };
    //收藏
    collectOrder = (key, data) => {
        const { actions } = this.props;
        let param = {
            ids: [data.workOrderId]
        };
        if (key) {
            runActionsMethod(actions, 'repairWorkOrderCollect', param);
        } else {
            runActionsMethod(actions, 'repairWorkOrderCollectCancel', param);
        }
    };
    //发送流程弹框显示
    sendProcessShow = () => {
        const { actions } = this.props;
        //校验权限
        this.validOperationAuth((flag) => {
            if (flag) {
                //校验表单数据
                actions.getFormValidate(true);
            }
        });
    };
    sendProcessHide = () => {
        this.setState({ visibleProcess: false });
    };
    sendProcess = (data) => {
        const repairWorkOrder = JSON.parse(localStorage.getItem('repairWorkOrder_edit'));
        const isAdd = JSON.parse(localStorage.getItem('addRepairWorkOrder'));
        const { actions } = this.props;

        repairWorkOrder.processStatus = data.flow;
        repairWorkOrder.processDescription = data.description;
        for (let attr in repairWorkOrder) {
            if (repairWorkOrder[attr] === null) {
                delete repairWorkOrder[attr];
            }
        }
        actions.repairOrderFlowCommit(repairWorkOrder, (msg) => {
            this.sendProcessHide();
            if (msg.success) {
                //更新数据
                actions.updateRepairWorkOrder(msg.data);
                localStorage.removeItem('addRepairWorkOrder');
                localStorage.removeItem('repairWorkOrder_edit_flag');
                localStorage.setItem('repairWorkOrder_init', JSON.stringify(msg.data));
                localStorage.setItem('repairWorkOrder_edit', localStorage.getItem('repairWorkOrder_init'));
                if (isAdd) {
                    message.success('流程启动成功！', 3);
                }
                message.success(msg.msg, 3);
                const oldStatus = this.repairOrderConfigJson[repairWorkOrder.workOrderStatus],
                    nextStatus = this.repairOrderConfigJson[msg.data.workOrderStatus];

                //如果是当前页面跳转，需要强制刷新工单数据，用于切换状态
                if (oldStatus.path == nextStatus.path) {
                    //重新加载工单数据
                    actions.repairOrderInformation({ id: msg.data.workOrderId }, (data) => {
                        localStorage.setItem('repairWorkOrder_init', JSON.stringify(data));
                        localStorage.setItem('repairWorkOrder_edit', localStorage.getItem('repairWorkOrder_init'));
                        if (data.processInstanceId) {
                            //更新流程数据
                            actions.repairOrderFlowHistory({ processInstanceId: data.processInstanceId });
                        } else {
                            //移除流程数据
                            actions.updaterepairOrderFlow(null);
                        }
                    });

                    //通知页面更新状态
                    //PubSub.publish(pubTopic.matterrepair.MATTER_REPAIR_SEND_PROCESS_PASS_CALLBACK, nextStatus);
                } else {
                    browserHistory.push(`/matter_repair/repair/${nextStatus.path}`);
                }
            } else {
                if (isAdd && msg.data && msg.data.processInstanceId) {
                    localStorage.removeItem('addRepairWorkOrder');
                    localStorage.removeItem('repairWorkOrder_edit_flag');
                    localStorage.setItem('repairWorkOrder_init', JSON.stringify(msg.data));
                    localStorage.setItem('repairWorkOrder_edit', localStorage.getItem('repairWorkOrder_init'));
                    message.warn(`流程启动成功，工单提报失败！ 详情：${msg.msg}`, 3);
                    //更新流程数据
                    actions.repairOrderFlowHistory({ processInstanceId: msg.data.processInstanceId });
                } else {
                    message.error(msg.msg);
                }
            }
        });
    };
    sendProcessCallBack = (topic, valid) => {
        if (valid) {
            this.sendProcessBuildMessage((visibleProcess) => {
                const repairWorkOrder = JSON.parse(localStorage.getItem('repairWorkOrder_edit'));
                if (visibleProcess && correspondenceJson.repairOrder.DTB.code == repairWorkOrder.workOrderStatus
                    && (repairWorkOrder.processInstanceId == null || repairWorkOrder.processInstanceId.length == 0)) {
                    confirm({
                        title: '是否启动任务流程？',
                        className: 'send-process-confirm',
                        content: (
                            <p className="send-process-text">任务将会推送到 <span className="blue">&lt;{`${this.state.PASS_Message}`}&gt;</span> 进行处理。通过记录中“执行记录”进行实时查看！</p>
                        ),
                        iconType: 'smile-o',
                        onOk: () => {
                            this.sendProcess({ flow: 'PASS', description: repairWorkOrder.reportDescription});
                        }
                    });
                } else {
                    this.setState({ visibleProcess: visibleProcess });
                }
            });
            //this.setState({ visibleProcess: true });
        }
    };
    sendProcessBuildMessage = (cb) => {
        const repairWorkOrder = JSON.parse(localStorage.getItem('repairWorkOrder_edit'));
        const { actions, commonState } = this.props;
        let defaultProcessSelector = 'PASS', PASS_Message, REJECT_Message, processDescription = '', visibleProcess = true, lazyUpdate = false;
        switch (repairWorkOrder.workOrderStatus) {
            case correspondenceJson.repairOrder.DTB.code: {
                processDescription = repairWorkOrder.reportDescription;
                if (repairWorkOrder.reportAssignFlag) {
                    PASS_Message = repairWorkOrder.reportPersonName;
                } else {
                    lazyUpdate = true;
                    let param = {
                        orgId: commonState.orgId,
                        siteId: commonState.siteId,
                        projectType: repairWorkOrder.projectType
                    };
                    actions.getRepairWorkOrder_UserListForProjectType(param, (data) => {
                        if (data.success) {
                            PASS_Message = data.data.map(item => item.name).join(',');
                        } else {
                            visibleProcess = false;
                            message.warning(data.msg, 3);
                        }

                        this.setState({ defaultProcessSelector, PASS_Message, REJECT_Message, processDescription });
                        cb && cb(visibleProcess);
                    });
                }
            } break;
            case correspondenceJson.repairOrder.DFP.code: {
                PASS_Message = repairWorkOrder.executionPerson + (repairWorkOrder.entrustExecutePerson ? `,${repairWorkOrder.entrustExecutePerson}` : '');
                REJECT_Message = repairWorkOrder.reportPersonName;
            } break;
            case correspondenceJson.repairOrder.DJD.code: {
                PASS_Message = commonState.personName;
                REJECT_Message = repairWorkOrder.dispatchPersonName;
            } break;
            case correspondenceJson.repairOrder.DHB.code: {
                if (repairWorkOrder.suspension) {
                    defaultProcessSelector = 'REJECT';
                    processDescription = repairWorkOrder.suspensionCause;
                }
                lazyUpdate = true;
                let param = {
                    orgId: commonState.orgId,
                    siteId: commonState.siteId,
                    projectType: repairWorkOrder.projectType
                };
                actions.getRepairWorkOrder_UserListForProjectType(param, (data) => {
                    if (data.success) {
                        PASS_Message = REJECT_Message = data.data.map(item => item.name).join(',');
                    } else {
                        visibleProcess = false;
                        message.warning(data.msg, 3);
                    }
                    this.setState({ defaultProcessSelector, PASS_Message, REJECT_Message, processDescription });
                    cb && cb(visibleProcess);
                });
            } break;
            case correspondenceJson.repairOrder.SQGQ.code: {
                lazyUpdate = true;
                let param = {
                    orgId: commonState.orgId,
                    siteId: commonState.siteId,
                    projectType: repairWorkOrder.projectType
                };
                actions.getRepairWorkOrder_UserListForProjectType(param, (data) => {
                    if (data.success) {
                        PASS_Message = data.data.map(item => item.name).join(',');
                        REJECT_Message = repairWorkOrder.receivePerson;
                    } else {
                        visibleProcess = false;
                        message.warning(data.msg, 3);
                    }
                    this.setState({ defaultProcessSelector, PASS_Message, REJECT_Message, processDescription });
                    cb && cb(visibleProcess);
                });
            } break;
            case correspondenceJson.repairOrder.GQ.code: {
                lazyUpdate = true;
                let param = {
                    orgId: commonState.orgId,
                    siteId: commonState.siteId,
                    projectType: repairWorkOrder.projectType
                };
                actions.getRepairWorkOrder_UserListForProjectType(param, (data) => {
                    if (data.success) {
                        PASS_Message = data.data.map(item => item.name).join(',');
                        REJECT_Message = repairWorkOrder.dispatchPersonName;
                    } else {
                        visibleProcess = false;
                        message.warning(data.msg, 3);
                    }
                    this.setState({ defaultProcessSelector, PASS_Message, REJECT_Message, processDescription });
                    cb && cb(visibleProcess);
                });
            } break;
            case correspondenceJson.repairOrder.DYS.code: {
                PASS_Message = repairWorkOrder.reportPersonName;
                REJECT_Message = repairWorkOrder.receivePerson;
                processDescription = repairWorkOrder.acceptDescription;
            } break;
            case correspondenceJson.repairOrder.YSDQR.code: {
                lazyUpdate = true;
                let param = {
                    orgId: commonState.orgId,
                    siteId: commonState.siteId,
                    projectType: repairWorkOrder.projectType
                };
                actions.getRepairWorkOrder_UserListForProjectType(param, (data) => {
                    if (data.success) {
                        PASS_Message = 'SYSTEM';
                        REJECT_Message = data.data.map(item => item.name).join(',');
                    } else {
                        visibleProcess = false;
                        message.warning(data.msg, 3);
                    }
                    this.setState({ defaultProcessSelector, PASS_Message, REJECT_Message, processDescription });
                    cb && cb(visibleProcess);
                });
            } break;
        }
        if (!lazyUpdate) {
            this.setState({ defaultProcessSelector, PASS_Message, REJECT_Message, processDescription });
            cb && cb(visibleProcess);
        }
    };
    //表单数据保存
    handleSubmit = () => {
        const { actions } = this.props;
        //校验权限
        this.validOperationAuth((flag) => {
            if (flag) {
                actions.getFormValues(true);
            }
        });
    };
    saveRepairOrderCallBack = (topic, valid) => {
        if (valid) {
            this.formDataSave();
        }
    };
    formDataSave = () => {
        const { actions } = this.props;
        let editedData = JSON.parse(localStorage.getItem('repairWorkOrder_edit'));
        for (let attr in editedData) {
            if (editedData[attr] === null) {
                delete editedData[attr];
            }
        }
        actions.repairWorkOrderSave(editedData, (msg) => {
            if (msg.success) {
                //更新数据
                actions.updateRepairWorkOrder(msg.data);
                localStorage.removeItem('addRepairWorkOrder');
                localStorage.removeItem('repairWorkOrder_edit_flag');
                localStorage.setItem('repairWorkOrder_init', JSON.stringify(msg.data));
                localStorage.setItem('repairWorkOrder_edit', localStorage.getItem('repairWorkOrder_init'));
                message.success("保存成功", 3);
            } else {
                message.error(msg.msg, 3);
            }
        });
    };
    //操作权限校验
    validOperationAuth = (cb) => {
        const { commonState } = this.props;
        const repairWorkOrder = JSON.parse(localStorage.getItem('repairWorkOrder_init'));
        let isValid = false;
        //跳过验证
        if (repairWorkOrder.authPersonList == null || repairWorkOrder.authPersonList.length == 0) {
            cb && cb(true);
            return;
        }
        if (repairWorkOrder.authPersonList.indexOf(commonState.personId) == -1) {
            message.warning('暂无权限操作', 5);
        } else {
            isValid = true;
        }
        cb && cb(isValid);
    };
    // 删除确认
    showConfirm = (id, text) => {
        confirm({
            title: `删除 ${text}?`,
            okText: '删除',
            onOk: () => {
                this.del(id);
            }
        });
    }
    // 模糊查询
    fuzzyQuery = (keywords) => {
        this.toFirstPage();
        let param = {};
        //拆解关键字
        keywords ? param.fuzzy = keywords.split(' ') : null;
        this.getList(param);
    };
    tableSelectChange = (selectedRowKeys) => {
        this.setState({ selectedRowKeys });
    };
    // 列表更多操作
    moreClick = (key, hideCheckBox) => {
        if (key === '0') { //变更状态
            if (!this.state.selectedRowKeys.length) {
                message.error('请选择工单');
            } else {
                this.statusChangeModal.modalShow();
            }
        } else if (key === '2') { //批量删除
            this.batchDel();
        }
    };
    moreClickForDetail = (key) => {
        if (key === '0') { //变更状态
            this.statusChangeModal.modalShow();
        } else if (key === '1') { //删除
            this.delForDetail();
        }
    };
    // 变更状态
    statusChange = () => {
        const { actions, location } = this.props;

        const values = this.statusChangeForm.props.form.getFieldsValue();
        const pathname = location.pathname;

        const isDetailsPage = pathname.indexOf('repair_tab') !== -1;
        const localStorageWorkOrder = JSON.parse(localStorage.getItem('repairWorkOrder_init'));

        if (isDetailsPage) localStorageWorkOrder.status = values.status;

        let param = {
            ids: isDetailsPage ? [localStorageWorkOrder.workOrderId] : this.state.selectedRowKeys,
            status: values.status,
            description: values.description,
        };

        runActionsMethod(actions, 'repairOrderStatusChange', param, () => {
            if (isDetailsPage) {
                this.jumpToDetail(localStorageWorkOrder, false);
            } else {
                this.setState({ selectedRowKeys: [] });
                this.listMoreOperations.cancel();
                this.getList();
            }

            this.statusChangeModal.modalHide();
        });
    };
    loadIsComplete = () => {
        return this.state.workOrderLoading;
    };
    componentWillMount() {
        this.getList();
    }
    render() {
        const { children, state, location, commonState, commonActions } = this.props;
        const data = state.repairWorkOrderListData || [];
        const list = data.list;

        const rowSelection = this.state.rowSelection ? {
                selectedRowKeys: this.state.selectedRowKeys,
                onChange: this.tableSelectChange,
                getCheckboxProps: record => {

                    let disabled = false;

                    if (this.state.moreOperationsKey === '0') { //变更状态 除了取消和关闭工单，其它工单均允许变更
                        disabled = record.workOrderStatus === correspondenceJson.repairOrder.QX.code || record.workOrderStatus === correspondenceJson.repairOrder.GB.code;
                    }
                    else if (this.state.moreOperationsKey === '2') { // 批量删除 不是待提报 全部disable
                        disabled = record.workOrderStatus !== correspondenceJson.repairOrder.DTB.code;
                    }

                    return { disabled }
                }
            } : null;
        const columns = [
            {
                width: '10%',
                title: '工单编号',
                dataIndex: 'workOrderNum',
                key: 'workOrderNum',
                sorter: true,
                render: (text, record, key) => {
                    return (
                        <p><Link className="order-number" onClick={() => { this.jumpToDetail(record) }}>{text ? text : '-'}</Link></p>
                    )
                }
            },
            {
                width: '30%',
                title: '报修描述',
                dataIndex: 'description',
                key: 'description',
                sorter: true,
                render: this.defaultRender
            },
            {
                width: '10%',
                title: '工程类型',
                dataIndex: 'projectType',
                key: 'projectType',
                sorter: true,
                render: this.projectTypeRender
            },
            {
                width: '10%',
                title: '工单来源',
                dataIndex: 'workOrderSource',
                key: 'workOrderSource',
                sorter: true,
                render: this.workOrderSourceRender
            },
            {
                width: '10%',
                title: '是否超时',
                dataIndex: 'executeTimeout',
                key: 'executeTimeout',
                sorter: true,
                render: (text, record) => {
                    return (
                        <p>{text ? '是' : '否'}</p>
                    )
                }
            },
            {
                width: '10%',
                title: '状态',
                dataIndex: 'workOrderStatus',
                key: 'workOrderStatus',
                sorter: true,
                render: this.workOrderStatusRender
            },
            {
                width: '10%',
                title: '提报时间',
                dataIndex: 'reportDate',
                key: 'reportDate',
                sorter: true,
                render: this.defaultRender
            },
            {
                width: '10%',
                title: '操作',
                dataIndex: '4',
                key: '4',
                render: (text, record, key) => {
                    return (
                        <div className="table-icon-group">
                            <Collection
                                isCollect={record.collect}
                                onChange={arg => {
                                    this.collectOrder(arg, record)
                                }}
                            />
                            {
                                record.workOrderStatus === correspondenceJson.repairOrder.DTB.code ?
                                <Icon
                                    style={{paddingLeft: '10px'}}
                                    type="delete"
                                    onClick={() => {
                                        this.showConfirm(record.workOrderId, record.workOrderNum)
                                    }}
                                /> : null
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
        );
        if (children) {
            const repairWorkOrderInfo = state.repairWorkOrderInfo;
            const status = this.repairOrderConfigJson[repairWorkOrderInfo.workOrderStatus];
            const inStatusPath = status && location.pathname.endsWith(status.path) && status.process;
            const enableSave = status && location.pathname.endsWith(status.path) && status.edit;
            const sendProcessModel = (
                <SendProcess
                    status={repairWorkOrderInfo.workOrderStatus}
                    visible={this.state.visibleProcess}
                    PASS_Message={this.state.PASS_Message}
                    REJECT_Message={this.state.REJECT_Message}
                    processDescription={this.state.processDescription}
                    defaultProcessSelector={this.state.defaultProcessSelector}
                    sendProcess={this.sendProcess}
                    sendProcessHide={this.sendProcessHide}
                />
            );
            return (
                <div>
                    <div className="top-bar clearfix">
                        <div className="details-title pull-left">
                            <h3>{this.loadIsComplete() ? (<span><Icon type="loading" /> 数据加载中...</span>) : (repairWorkOrderInfo && repairWorkOrderInfo.workOrderNum ? repairWorkOrderInfo.workOrderNum : '')}</h3>
                            <span className="eam-tag">{repairWorkOrderInfo && repairWorkOrderInfo.workOrderStatus ? this.repairOrderConfigJson.statusCodeToText(repairWorkOrderInfo.workOrderStatus) : ''}</span>
                            <p>{repairWorkOrderInfo && repairWorkOrderInfo.description ? repairWorkOrderInfo.description : ''}</p>
                        </div>
                        <div className="list-tools-right pull-right">
                            {repairWorkOrderInfo.id ? (
                                    <DetailsPagination
                                        state={state}
                                        listDataName="repairWorkOrderListData"
                                        localStorageName="repairWorkOrder_init"
                                        onChange={(record)=>{
                                            console.log(record);
                                            browserHistory.push('/matter_repair/');
                                            this.jumpToDetail(record, false);
                                        }}
                                        getList={(pageNum, cb) => {
                                            let paramRecord = JSON.parse(localStorage.getItem('LIST_PARAM'));
                                            if (pageNum) paramRecord.pageNum = pageNum;
                                            this.getList(paramRecord, cb);
                                        }}
                                    />
                                ) : null}

                            <BackList location={location}/>
                            {repairWorkOrderInfo.id && (
                                (repairWorkOrderInfo && repairWorkOrderInfo.workOrderStatus !== correspondenceJson.repairOrder.GB.code
                                && repairWorkOrderInfo.workOrderStatus !== correspondenceJson.repairOrder.QX.code)
                                || (repairWorkOrderInfo && repairWorkOrderInfo.workOrderStatus == correspondenceJson.repairOrder.DTB.code)
                            ) ? (
                                <Dropdown
                                    overlay={(
                                        <Menu onClick={(e) => {this.moreClickForDetail(e.key)}}>
                                            {
                                                repairWorkOrderInfo && repairWorkOrderInfo.workOrderStatus !== correspondenceJson.repairOrder.GB.code
                                                && repairWorkOrderInfo.workOrderStatus !== correspondenceJson.repairOrder.QX.code ?
                                                    (
                                                        <Menu.Item key="0"><Icon type="edit"/> 变更状态</Menu.Item>
                                                    ) : null
                                            }
                                            {
                                                repairWorkOrderInfo && repairWorkOrderInfo.workOrderStatus == correspondenceJson.repairOrder.DTB.code ?
                                                    (
                                                        <Menu.Divider />,
                                                        <Menu.Item key="1"><Icon type="delete"/> 删除</Menu.Item>
                                                    ) : null
                                            }
                                        </Menu>
                                    )}
                                    trigger={['click']}
                                >
                                    更多操作
                                </Dropdown>
                                ) : null}
                            {repairWorkOrderInfo.id ? (
                                    <Button type="primary" size="large" onClick={() => { this.jumpToDetail('', true) }}>新建</Button>
                                ) : null}
                            <Button type="primary" size="large" onClick={this.sendProcessShow} disabled={!inStatusPath}>发送流程</Button>
                        </div>
                        <div className="eam-tab-nav">
                            <Link activeClassName="active" to="/matter_repair/repair/repair_tab1"><Icon type="check-circle-o" /> 工单提报</Link>
                            <Link activeClassName="active" to="/matter_repair/repair/repair_tab2"><Icon type="check-circle-o" /> 任务分派</Link>
                            <Link activeClassName="active" to="/matter_repair/repair/repair_tab3"><Icon type="check-circle-o" /> 执行汇报</Link>
                            <Link activeClassName="active" to="/matter_repair/repair/repair_tab4"><Icon type="check-circle-o" /> 验收确认</Link>
                            <div className="eam-proess-right">
                                <Button size="large" onClick={this.handleSubmit} disabled={!enableSave}>保存</Button>
                            </div>
                        </div>

                    </div>
                    {children}
                    {sendProcessModel}
                    {NewStatusChange}
                </div>
            );
        } else {
            return (
                <div>
                    <div className="top-bar clearfix">
                        <ListTools
                            title="报修工单"
                            commonState={commonState}
                            commonActions={commonActions}
                            collectionChange={(checked) => {
                                this.toFirstPage();
                                this.param.collect = checked;
                                this.getList();
                            }}
                            listToolsComponentWillMount={this.detailBackToList}
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
                                        key: 'workOrderSourceData',
                                        label: '工单来源',
                                        actionsType: 'WORK_ORDER_SOURCE',
                                        actionsParam: 'udwoly',

                                    },
                                    {
                                        type: 'DOMAIN_VALUE',
                                        key: 'workProjectTypeData',
                                        label: '工程类型',
                                        actionsType: 'WORK_PROJECT_TYPE',
                                        actionsParam: 'roProjectType',

                                    },
                                    {
                                        type: 'DOMAIN_VALUE',
                                        key: 'incidentNatureData',
                                        label: '事件性质',
                                        actionsType: 'WORK_ORDER_INCIDENT_NATURE',
                                        actionsParam: 'incidentnature',

                                    },
                                    {
                                        type: 'DOMAIN_VALUE',
                                        key: 'incidentLevelData',
                                        label: '事件级别',
                                        actionsType: 'WORK_ORDER_INCIDENT_LEVEL',
                                        actionsParam: 'incidentlevel',

                                    },
                                    {
                                        type: 'SELECT_PERSON',
                                        key: 'reportPerson',
                                        label: '提报人',
                                    },
                                    {
                                        type: 'SELECT_PERSON',
                                        key: 'actualExecutionPerson',
                                        label: '实际执行人',
                                    },
                                    {
                                        type: 'SELECT_TIME',
                                        key: 'reportDate',
                                        label: '提报时间',
                                    },
                                    {
                                        type: 'SELECT_TIME',
                                        key: 'acceptDate',
                                        label: '验收时间',
                                    },
                                ],
                                onOk: result => {
                                    this.toFirstPage();
                                    let param = {};
                                    result[0] ? param.workOrderStatus = filterArrByAttr(result[0].data, 'value') : null;
                                    result[1] ? param.workOrderSource = filterArrByAttr(result[1].data, 'value') : null;
                                    result[2] ? param.projectType = filterArrByAttr(result[2].data, 'value') : null;
                                    result[3] ? param.incidentNature = filterArrByAttr(result[3].data, 'value') : null;
                                    result[4] ? param.incidentLevel = filterArrByAttr(result[4].data, 'value') : null;

                                    result[5] ? param.reportPersonId = filterArrByAttr(result[5].data, 'personId') : null;
                                    result[6] ? param.actualExecutionPersonId = filterArrByAttr(result[6].data, 'personId') : null;

                                    if (result[7]) {
                                        param.reportDateBegin = result[7].data[0] + ' 00:00:00';
                                        param.reportDateEnd = result[7].data[1] + ' 23:59:59';
                                    }

                                    if (result[8]) {
                                        param.acceptTimeBegin = result[8].data[0] + ' 00:00:00';
                                        param.acceptTimeEnd = result[8].data[1] + ' 23:59:59';
                                    }

                                    this.getList(param);
                                }
                            }}
                            onEnter={(text) => {
                                this.fuzzyQuery(text);
                            }}
                        />
                        <div className="list-tools-right pull-right">
                            <Pagination
                                total={data.total}
                                defaultPageSize={this.param.pageSize}
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
                            <Button type="primary" size="large" onClick={() => { this.jumpToDetail('', true) }}>新建</Button>
                        </div>
                    </div>
                    <div className="eam-content">
                        <div className="eam-content-inner">
                            <Table
                                rowKey="workOrderId"
                                loading={this.state.tableLoading}
                                pagination={false}
                                dataSource={list}
                                columns={columns}
                                rowSelection={rowSelection}
                                bordered
                                onChange={this.tableChange}
                            />
                            <Pagination
                                total={data.total}
                                defaultPageSize={this.param.pageSize}
                                showTotal={(total, range) => `当前第${range[0]}-${range[1]}条 / 共${total}条`}
                                current={this.state.currentPage}
                                showQuickJumper
                                onChange={this.pageChange}
                            />
                        </div>
                    </div>
                    {NewStatusChange}
                </div>
            );
        }
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
        commonActions: bindActionCreators(commonActions, dispatch)
    }
}

export default connect(mapStateToProps, buildActionDispatcher)(RepairComponent);