/** 
 * @Description
 */
import React from 'react';
import ReactDOM from 'react-dom';
import {bindActionCreators} from 'redux';
import {Link, browserHistory} from 'react-router';
import {connect} from 'react-redux';
import actions from '../../actions/contract.js';
import commonActions from '../../actions/common.js';

import Collection from '../../components/common/collection.js';
import MoreOperations from '../../components/common/more_operations.js';
import BackList from '../../components/common/back_list.js';
import ListTools from '../../components/common/list_tools.js';
import EamModal from '../../components/common/modal.js';


import {runActionsMethod, filterArrByAttr} from '../../tools/';
import {Icon, Checkbox, Modal, Button, Table, Pagination, Input, Radio, message} from 'antd';
const confirm = Modal.confirm;
const RadioGroup = Radio.Group;

class ManageComponent extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            modalShow: false,
            selectedRowKeys: [],
            currentPage: 1,
            rowSelection: null, // 表格多选
            sendProcessRadioValue: 'agree', // 发送流程默认同意
            sendProcessYTitle: '', // 同意显示标题
            sendProcessYName: '',  // 同意显示人名
        }


        let defaultRender = (text, record, key) => {
            return (
                <p>{text ? text : '-'}</p>
            )
        };

        //表格字段
        this.columns = [
            {
                title: '编号',
                dataIndex: 'contractNum',
                key: 'contractNum',
                sorter: true,
                render: (text, record, key) => {
                    return (
                        <p><a className="order-number" onClick={() => {
                            this.jumpToDetail(record)
                        }}>{text ? text : '-'}</a></p>
                    )
                }
            },
            {
                title: '描述',
                dataIndex: 'description',
                key: 'description',
                sorter: true,
                render: defaultRender
            },
            {
                title: '合同类型',
                dataIndex: 'typeDsr',
                key: 'contractType',
                sorter: true,
                render: defaultRender
            },
            {
                title: '施工单位',
                dataIndex: 'contractCompany',
                key: 'contractCompany',
                sorter: true,
                render: defaultRender
            },
            {
                title: '状态',
                dataIndex: 'statusDsr',
                key: 'status',
                sorter: true,
                render: defaultRender
            },
            {
                title: '提报时间',
                dataIndex: 'createDate',
                key: 'create_date',
                sorter: true,
                render: defaultRender
            },
            {
                title: '操作',
                dataIndex: '4',
                key: '4',
                width: 120,
                render: (text, record, key) => {
                    return (
                        <div className="table-icon-group">
                            <Icon
                                type="delete"
                                onClick={() => {
                                    this.showDeleteConfirm(record.id, record.description)
                                }}
                            />
                        </div>
                    )
                }
            },
        ];
        //*** 初始化列表参数 需要到处改参数的请求 把参数定义到这里 严禁把参数用state管理 因为参数变化不需要触发render来渲染页面
        const {commonState} = this.props;
        this.param = {
            orgId: commonState.orgId,
            siteId: commonState.siteId,
            personId: commonState.personId,
            pageNum: 1,
            pageSize: 10,
        }
    }

    jumpToDetail = (record, isAdd) => {
        const {actions} = this.props;

        if (isAdd) {
            localStorage.removeItem('manage');
            actions.clearList('MANAGE_INFO_GET_LIST');
            browserHistory.push('/contract/');
            browserHistory.push('/contract/manage/manage_info?add_manage=1');
        } else {
            let json = {};
            json.id = record.id;
            json.status = record.status;
            json.statusDsr = record.statusDsr;
            json.contractNum = record.contractNum;
            json.description = record.description;

            localStorage.setItem('manage', JSON.stringify(json));
            localStorage.setItem('LIST_PARAM', JSON.stringify(this.param)); // localStorage 全大写加下划线命名 作为通用存储名
            browserHistory.push(`/contract/manage/manage_info`);
        }
    }

    // 高级筛选点击
    seniorFilterClick = () => {
        this.setState({modalShow: true})
        this.dropdownSeniorFilter.hide();
    }
    // 高级筛选弹窗隐藏
    modalHide = () => {
        this.setState({modalShow: false});
    }
    // 表格事件
    tableChange = (pagination, filters, sorter) => {
        if (sorter.order) {
            let sorterOrder = sorter.order;
            let endIndex = sorterOrder.indexOf('end');
            sorterOrder = sorterOrder.slice(0, endIndex);
            this.param.sorts = `${sorter.columnKey} ${sorterOrder}`;
        } else {
            this.param.sorts = '';
        }

        this.getList();
    }
    // 分页事件
    pageChange = (page, pageSize) => {
        this.setState({currentPage: page});
        this.param.pageNum = page; //*** 需要修改参数 在方法内单独修改
        this.getList();
    }
    // 获取列表数据
    getList = () => {
        const {actions} = this.props;
        this.setState({tableLoading: true});
        actions.manageGetList(this.param, () => {
            this.setState({tableLoading: false});
        });
    };
    //删除
    deleteContract = (id) => {
        const {actions} = this.props;
        let param = {
            ids: id,
            userId: this.param.personId
        };
        actions.contractManageDel(param, (data) => {
            if (data.success) {
                this.getList();
            } else {
                message.error(data.msg)
            }
        });
    }

    //弹出删除确认框
    showDeleteConfirm = (id, arg) => {
        if (Array.isArray(id) && !id.length) {
            message.error('请选择要删除的数据。')
        } else {
            confirm({
                title: `删除 ${typeof arg !== 'function' ? arg : (id.length + '条数据')}?`,
                okText: '删除',
                onOk: () => {
                    if (Array.isArray(id)) id = id.join(',')
                    this.deleteContract(id);
                    if (typeof arg === 'function') arg(); // 隐藏复选框
                }
            });
        }
    }


    // 模糊查询
    fuzzyQuery = (keywords) => {
        this.param.words = keywords;
        this.getList();
    }
    tableSelectChange = (selectedRowKeys) => {
        this.setState({selectedRowKeys});
    }
    // 更多操作
    moreClick = (key, hideCheckBox) => {
        if (key === '0') { //批量删除
            this.showDeleteConfirm(this.state.selectedRowKeys, hideCheckBox)
        }

    }
    // 保存合同
    manageSave = () => {
        const {actions, location} = this.props;
        actions.getFormValues(false);

        const pathname = location.pathname;

        clearTimeout(this.timer);
        this.timer = setTimeout(() => {
            const {state, commonState} = this.props;
            let createUser = commonState.personId;
            if (pathname.indexOf('manage_info') !== -1) {
                const data = state.manageInfoListData;
                if (state.getFormValues === true) return;
                const param = {
                    ...state.getFormValues,
                    createUser
                }

                runActionsMethod(actions, 'manageInfoSave', param, () => {
                    setTimeout(() => {
                        this.getList();
                        browserHistory.push('/contract');
                        browserHistory.push('/contract/manage');
                    }, 500);
                });
            }
        }, 0);
    }

    loadIsComplete = (isAdd) => {

        const {state, commonState} = this.props;

        let complete = false

        const manageCode = isAdd ? state.manageCode : true,
            manageStatusData = commonState.manageStatusData,
            contractTypeData = commonState.contractTypeData;

        if (
            manageCode &&
            manageStatusData.length &&
            contractTypeData.length
        ) complete = true;

        return complete;
    }

    // 发送流程
    sendProcess = (curStatus) => {

        const {state, actions} = this.props;
        const data = state.manageInfoListData;
        if (curStatus === "XZ") { // 待提报
            confirm({
                title: '是否启动任务流程？',
                className: 'send-process-confirm',
                content: (
                    <p className="send-process-text">任务将会推送到 <span
                        className="blue">&lt;{`${data.propertyManager}`}&gt;</span> 进行处理。通过记录中“执行记录”进行实时查看！</p>
                ),
                iconType: 'smile-o',
                onOk: () => {
                    this.sendProcessConfirm(curStatus, data.id);
                }
            });
        } else {

            let sendProcessYTitle, sendProcessYName, sendProcessNTitle, sendProcessNName;

            if (curStatus === "ZX") {

                sendProcessYTitle = '合同执行';
                sendProcessYName = `${data.excutePerson}${data.entrustExecutePersonName ? (',' + data.entrustExecutePersonName) : ''}`;

                this.setState({sendProcessYTitle, sendProcessYName});
            }
            else if (curStatus === "PJ") {
                actions.getFormValues(false);
                clearTimeout(this.timer);
                this.timer = setTimeout(() => { // 异步获取表单值 因为actions.getFormValues为异步执行 同步取值取不到
                    const {state} = this.props;
                    sendProcessYTitle = '合同评价';
                    sendProcessYName = data.assignPerson;
                    this.setState({sendProcessYTitle, sendProcessYName});
                }, 0);
            }
            this.sendProcessModal.modalShow();
        }
    }

    sendProcessConfirm = (curStatus, id) => {
        const {actions} = this.props;

        const param = {};
        param.id = id;

        if (curStatus == "XZ") {
            param.processStatus = 'agree';
            param.description = '已启动任务流程';
        } else {
            param.processStatus = this.state.sendProcessRadioValue;
            param.description = ReactDOM.findDOMNode(this.sendProcessTextarea).value;

        }
        param.siteId = this.param.siteId;
        param.personId = this.param.personId;

        runActionsMethod(actions, 'sendProcess', param, (json) => {

/*
            const {state} = this.props;
            let dataName = 'manageInfoListData';

            const data = state[dataName];

            const obj = {};
            obj.id = data.id; // 详情数据里取
            obj.status = json.data; // 保存成功返回数据里取保存后最新值
            obj.contractNum = this.localStorageContract.contractNum; // 本地存储取 因为有的返回数据没有编号和描述
            obj.description = this.localStorageContract.description; // 本地存储取 因为有的返回数据没有编号和描述

            localStorage.setItem('contract', JSON.stringify(obj));
*/

            setTimeout(() => {
                this.getList();
                browserHistory.push('/contract/manage');
            }, 500);
        });
    }

    resetListParam = () => {
        this.param.status = [];
        this.param.type = [];
    }


    listToolsComponentWillMount = () => { // 代替 componentWillMount
        this.resetListParam();
        this.getList();
    }

    render() {
        const {children, state, location, commonState, actions, commonActions} = this.props;
        const data = state.manageListData || [];
        const dataSource = data.list;

        const isAddManage = location.query.add_manage;

        const localStorageManage = JSON.parse(localStorage.getItem('manage'));

        const manageCommitData = state.manageInfoListData;
        const manageCommitNum = manageCommitData.contractNum ? manageCommitData.contractNum : (localStorageManage && localStorageManage.contractNum);
        const manageCode = isAddManage ? state.manageCode : manageCommitNum;

        //只有合同信息页面才显示发送流程按钮
        const curProcess = location.pathname.substring(location.pathname.lastIndexOf("/") + 1);
        let sendProcess = localStorageManage && curProcess === 'manage_info';

        let sendProcessId = manageCommitData.id, curStatus = manageCommitData.status;

        let isConstruction = manageCommitData.contractType === 'C' ? true : false;

        let isRepair = manageCommitData.contractType === 'R' ? true : false;

        let isMaintenance = manageCommitData.contractType === 'M' ? true : false;

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
            } :
            null;

        return children ?
            (
                <div>
                    <div className="top-bar clearfix">
                        <div className="details-title pull-left">
                            <h3>{this.loadIsComplete(isAddManage) ? manageCode :
                                <span><Icon type="loading"/> 数据加载中...</span>}</h3>
                            <span
                                className="eam-tag">{manageCommitData.statusDsr ? manageCommitData.statusDsr : (localStorageManage && localStorageManage.statusDsr)}</span>
                            <p>{manageCommitData.description ? manageCommitData.description : (localStorageManage && localStorageManage.description)}</p>
                        </div>
                        <div className="list-tools-right pull-right">
                            <Pagination
                                total={50}
                                className="pull-left"
                                current={this.state.currentPage}
                                onChange={this.pageChange}
                            />
                            <BackList  location={location}/>
                            {
                                sendProcess ?
                                    <Button type="primary" size="large"
                                            onClick={() => {
                                                this.sendProcess(curStatus)
                                            }}>发送流程</Button> :
                                    null
                            }
                        </div>
                        <div className="eam-tab-nav">
                            <Link activeClassName="active" to="/contract/manage/manage_info"><Icon
                                type="check-circle-o"/>合同信息</Link>
                            {
                                (isAddManage === 1 || !isConstruction) ?
                                    null :
                                    <Link activeClassName="active" to="/contract/manage/manage_construction"><Icon
                                        type="check-circle-o"/>施工进度</Link>
                            }
                            {
                                (isAddManage != 1 && isConstruction) ?
                                    <Button type="primary" size="large"
                                            style={{position: 'absolute', right: 0, bottom: 10}} onClick={() => {
                                        localStorage.removeItem('construction');
                                        actions.clearList('CONSTRUCTION_INFO_GET_LIST');
                                        browserHistory.push('/contract/');
                                        browserHistory.push('/contract/construction/construction_info?add_construction=1&contract=1');
                                    }}>新建</Button>
                                    : null
                            }
                            {
                                (isAddManage || !isMaintenance) ?
                                    null :
                                    <Link activeClassName="active" to="/contract/manage/manage_plan"><Icon
                                        type="check-circle-o"/>保养计划</Link>
                            }
                            {
                                (isAddManage || !isMaintenance) ?
                                    null :
                                    <Link activeClassName="active" to="/contract/manage/manage_order"><Icon
                                        type="check-circle-o"/>保养工单</Link>
                            }
                            {
                                (isAddManage || !isRepair) ?
                                    null :
                                    <Link activeClassName="active" to="/contract/manage/manage_order2"><Icon
                                        type="check-circle-o"/>维修工单</Link>
                            }
                            <Button
                                style={{position: 'absolute', right: 0, bottom: 10}}
                                size="large"
                                onClick={this.manageSave}
                            >
                                保存
                            </Button>

                        </div>
                    </div>
                    {children}
                    <EamModal
                        title="发送流程"
                        ref={sendProcessModal => this.sendProcessModal = sendProcessModal}
                    >
                        <RadioGroup onChange={e => {
                            this.setState({sendProcessRadioValue: e.target.value})
                        }} value={this.state.sendProcessRadioValue}>
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
                        </RadioGroup>
                        <p
                            style={{marginTop: 20}}
                            className="send-process-text"
                        >
                            备注说明：（填写审批意见等）
                        </p>
                        <Input type="textarea" rows={4}
                               ref={sendProcessTextarea => this.sendProcessTextarea = sendProcessTextarea}/>
                        <div className="modal-footer clearfix">
                            <Button size="large" onClick={() => {
                                this.sendProcessModal.modalHide()
                            }}>取消</Button>
                            <Button type="primary" size="large" onClick={() => {
                                this.sendProcessConfirm(curProcess, sendProcessId)
                            }}>确定</Button>
                        </div>
                    </EamModal>
                </div>
            ) :
            (
                <div>
                    <div className="top-bar clearfix">
                        <ListTools
                            title="合同管理"
                            commonState={commonState}
                            commonActions={commonActions}
                            onEnter={(text) => {
                                this.fuzzyQuery(text);
                            }}
                            listToolsComponentWillMount={this.listToolsComponentWillMount}
                            collectionChange={(checked) => {
                                //this.param = Object.assign({}, this.param, json);
                                this.param.collect = checked;
                                this.getList();
                            }}
                            seniorFilter={{
                                data: [
                                    {
                                        type: 'DOMAIN_VALUE',               // 选择项类型
                                        key: 'manageStatusData',         // key 域值的key用作取state数据
                                        label: '状态',                    // 标题
                                        actionsType: 'CONTRACT_MANAGE_STATUS',   // 域值actions type
                                        actionsParam: 'contractStatus',           // 域值actions 参数
                                    },
                                    {
                                        type: 'DOMAIN_VALUE',
                                        key: 'contractTypeData',
                                        label: '合同类型',
                                        actionsType: 'CONTRACT_TYPE',
                                        actionsParam: 'contractType',

                                    },
                                ],
                                onOk: result => {
                                    this.setState({currentPage: 1});
                                    this.param.pageNum = 1;

                                    this.param.status = filterArrByAttr(result[0] && result[0].data || [], 'value');
                                    this.param.type = filterArrByAttr(result[1] && result[1].data || [], 'value');

                                    this.getList();
                                }
                            }}
                        />
                        <div className="list-tools-right pull-right">
                            <Pagination
                                total={data.total}
                                className="pull-left"
                                current={this.state.currentPage}
                                onChange={this.pageChange}
                            />
                            <MoreOperations
                                style={{float: 'left'}}
                                menuData={[
                                    {
                                        icon: 'delete',
                                        text: '批量删除',
                                        confirmText: '确认删除'
                                    },
                                ]}
                                onChange={(key, showCheckbox) => {
                                    let rowSelection;

                                    if (showCheckbox) {
                                        this.setState({selectedRowKeys: []}); // 清空选择
                                        rowSelection = true
                                    } else {
                                        rowSelection = false;
                                    }

                                    this.setState({rowSelection})
                                }}
                                onOk={(key, hideCheckBox) => {
                                    this.moreClick(key, hideCheckBox);
                                }}
                            />
                            <Button type="primary" size="large" onClick={() => {
                                this.jumpToDetail('', true)
                            }}>新建</Button>
                        </div>
                    </div>
                    <div className="eam-content">
                        <div className="eam-content-inner">
                            <Table
                                loading={this.state.tableLoading}
                                rowKey="id"
                                pagination={false}
                                dataSource={dataSource} // ***渲染数据
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
                    </div>
                </div>
            )
    }
}

function mapStateToProps(state) {
    return {
        state: state.contract,
        commonState: state.common
    }
}

function buildActionDispatcher(dispatch) {
    return {
        actions: bindActionCreators(actions, dispatch),
        commonActions: bindActionCreators(commonActions, dispatch),
    }
}

export default connect(mapStateToProps, buildActionDispatcher)(ManageComponent);