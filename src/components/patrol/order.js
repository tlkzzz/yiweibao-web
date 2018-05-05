/** 
 * @Description
 */
import React from 'react';
import ReactDOM from 'react-dom';
import {bindActionCreators} from 'redux';
import {Link, browserHistory} from 'react-router';
import {connect} from 'react-redux';
import actions from '../../actions/patrol.js';
import commonActions from '../../actions/common.js';

import Collection from '../../components/common/collection.js';
import MoreOperations from '../../components/common/more_operations.js';
import BackList from '../../components/common/back_list.js';
import ListTools from '../../components/common/list_tools.js';
import EamModal from '../../components/common/modal.js';


import {runActionsMethod, correspondenceJson, filterArrByAttr} from '../../tools/';
import {Icon, Checkbox, Modal, Button, Table, Pagination, Input, Radio, message} from 'antd';
const confirm = Modal.confirm;
const RadioGroup = Radio.Group;


class OrderComponent extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            modalShow: false,
            currentPage: 1,
            sendProcessRadioValue: 'agree', // 发送流程默认同意
            sendProcessYTitle: '', // 同意显示标题
            sendProcessYName: '',  // 同意显示人名
            sendProcessNTitle: '',
            sendProcessNName: '',
            rowSelection: null, // 表格多选
            selectedRowKeys: [],
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
                dataIndex: 'patrolOrderNum',
                key: 'patrolOrderNum',
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
                title: '工单描述',
                dataIndex: 'description',
                key: 'description',
                sorter: true,
                render: defaultRender
            },
            {
                title: '工单类型',
                dataIndex: 'typeDescription',
                key: 'type',
                sorter: true,
                render: defaultRender
            },
            {
                title: '生成时间',
                dataIndex: 'createDate',
                key: 'createtime',
                sorter: true,
                render: defaultRender
            },

            {
                title: '状态',
                dataIndex: 'statusDescription',
                key: 'status',
                sorter: true,
                render: defaultRender
            },
            {
                title: '站点',
                dataIndex: 'site',
                key: 'siteId',
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
                                    console.log('执行删除->' + record.id)
                                    this.showConfirm(record.id, record.description)
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
        // 后端返回英文显示中文的对应数据
        this.patrolOrderCorrJson = correspondenceJson.patrolOrder;
    }

    jumpToDetail = (record, isAdd) => {
        const {actions} = this.props;

        if (isAdd) {
            localStorage.removeItem('patrolOrder');
            actions.clearList('PATROL_ORDER_COMMIT_GET_LIST');
            browserHistory.push('/patrol/');
            browserHistory.push('/patrol/order/order_commit?add_patrol_order=1');
        } else {
            let status = record.status;
            status = this.patrolOrderCorrJson[status];

            let json = {};
            json.id = record.id;
            json.process = status.process;
            json.status = record.status;
            json.patrolOrderNum = record.patrolOrderNum;
            json.description = record.description;

            localStorage.setItem('patrolOrder', JSON.stringify(json));
            browserHistory.push(`/patrol/order/${status.path}`);
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
        actions.orderGetList(this.param, () => {
            this.setState({tableLoading: false});
        });
    };

    deletePatrolOrder = (id) => {
        const {actions} = this.props;
        let param = {ids: id};
        actions.patrolOrderDel(param, (data) => {
            if (data.success) {
                this.getList();
            } else {
                message.error(data.msg)
            }
        });
    }
    //弹出删除确认框
    showConfirm = (id, arg) => {
        if (Array.isArray(id) && !id.length) {
            message.error('请选择要删除的数据。')
        } else {
            confirm({
                title: `删除 ${typeof arg !== 'function' ? arg : (id.length + '条数据')}?`,
                okText: '删除',
                onOk: () => {
                    if (Array.isArray(id)) id = id.join(',')
                    this.deletePatrolOrder(id);
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
        if (key === '2') { //批量删除
            this.showConfirm(this.state.selectedRowKeys, hideCheckBox)
        }
    }
    // 保存工单
    orderSave = () => {
        const {actions, location} = this.props;
        actions.getFormValues(false);

        const pathname = location.pathname,
            path = '';
        clearTimeout(this.timer);
        this.timer = setTimeout(() => {
            const {state, commonState, location} = this.props;

            const isAddPatrolOrder = location.query.add_patrol_order;

            if (pathname.indexOf('order_commit') !== -1) {
                if (state.getFormValues === true) return;
                const param = {
                    ...state.getFormValues,
                }
                runActionsMethod(actions, 'orderCommitSave', param, this.saveDone);
            } else if (pathname.indexOf('order_assign') !== -1) {

                const param = {
                    ...state.getFormValues,
                }

                runActionsMethod(actions, 'orderAssignSave', param, this.saveDone);
            } else if (pathname.indexOf('order_excute') !== -1) {
                const recordTermList = state.pointTermListData.list,
                    orderRecordTimeData = state.orderRecordTimeData,
                    startdate = new Date(orderRecordTimeData.startdate),
                    enddate = new Date(orderRecordTimeData.enddate),
                    duration = orderRecordTimeData.duration;
                const
                    param = {
                        ...state.getFormValues,
                        recordTermList,
                        startdate,
                        enddate,
                        duration
                    }

                runActionsMethod(actions, 'orderAssignSave', param, this.saveDone);
            }
        }, 0);
    }

    saveDone = (data)=>{
        let record = data.data;
        let status = record.status;
        status = this.patrolOrderCorrJson[status];
        let json = {};
        json.id = record.id;
        json.process = status.process;
        json.status = record.status;
        json.patrolOrderNum = record.patrolOrderNum;
        json.description = record.description;

        localStorage.setItem('patrolOrder', JSON.stringify(json));
        localStorage.setItem('order_edit_flag', false);

        browserHistory.push('/patrol/');
        browserHistory.push(`/patrol/order/${status.path}`);
    }
    // 发送流程
    sendProcess = (curProcess) => {

        const {state, actions} = this.props;

        if (curProcess == "order_commit") { // 待提报
            const data = state.patrolOrderCommitListData;
            confirm({
                title: '是否启动任务流程？',
                className: 'send-process-confirm',
                content: (
                    <p className="send-process-text">任务将会推送到 <span
                        className="blue">&lt;{`${data.groupTypeName}用户组`}&gt;</span> 进行处理。通过记录中“执行记录”进行实时查看！</p>
                ),
                iconType: 'smile-o',
                onOk: () => {
                    this.sendProcessConfirm(curProcess, data.id);
                }
            });
        } else {

            let sendProcessYTitle, sendProcessYName, sendProcessNTitle, sendProcessNName;

            if (curProcess == "order_assign") { // 待分派
                const data = state.patrolOrderCommitListData;

                sendProcessYTitle = '任务分派';
                sendProcessYName = `${data.excutePerson}${data.entrustExecutePersonName ? (',' + data.entrustExecutePersonName) : ''}`;
                sendProcessNTitle = '驳回重新提报';
                sendProcessNName = data.createPerson;

                this.setState({sendProcessYTitle, sendProcessYName, sendProcessNTitle, sendProcessNName});
            }
            else if (curProcess == "order_excute") {

                const data = state.patrolOrderCommitListData;

                switch (data.status) {
                    case 'DJD': // 待接单
                        sendProcessYTitle = '接单';
                        sendProcessYName = 'eam'; //当前用户 之后改成动态获取
                        sendProcessNTitle = '重新分派';
                        sendProcessNName = `${data.groupTypeName}用户组`;

                        this.setState({sendProcessYTitle, sendProcessYName, sendProcessNTitle, sendProcessNName});
                        break;
                    case 'DHB':
                        actions.getFormValues(false);

                        clearTimeout(this.timer);
                        this.timer = setTimeout(() => { // 异步获取表单值 因为actions.getFormValues为异步执行 同步取值取不到
                            const {state} = this.props;

                            sendProcessYTitle = '执行汇报';
                            sendProcessYName = data.assignPerson;
                            sendProcessNTitle = '重新分派';
                            sendProcessNName = `${data.groupTypeName}用户组`;

                            this.setState({sendProcessYTitle, sendProcessYName, sendProcessNTitle, sendProcessNName});

                        }, 0);
                        break;
                }
            }
            this.sendProcessModal.modalShow();
        }

    }
    sendProcessConfirm = (curProcess, id) => {
        const {actions} = this.props;

        const param = {};
        param.id = id;

        if (curProcess == "order_commit") {
            param.processStatus = 'agree';
            param.description = '已启动任务流程';

        } else {
            param.processStatus = this.state.sendProcessRadioValue;
            param.description = ReactDOM.findDOMNode(this.sendProcessTextarea).value;
            //执行汇报
            if (curProcess == "order_excute") {
            }
        }
        param.siteId = this.param.siteId;
        param.personId = this.param.personId;

        runActionsMethod(actions, 'sendProcess', param, (json) => {

            const {state} = this.props;
            let dataName = '';

            switch (curProcess) {
                case 'order_commit':
                    dataName = 'patrolOrderCommitListData';
                    break;
                case 'order_assign':
                    dataName = 'patrolOrderCommitListData';
                    break;
                case 'order_excute':
                    dataName = 'patrolOrderCommitListData';
                    break;
            }

            const data = state[dataName];

            const obj = {};
            obj.id = data.id; // 详情数据里取
            obj.status = json.data; // 保存成功返回数据里取保存后最新值
            obj.process = correspondenceJson.patrolOrder[obj.status].process; // 保存成功返回数据里取保存后最新值
            obj.patrolOrderNum = this.localStoragePatrolOrder.patrolOrderNum; // 本地存储取 因为有的返回数据没有编号和描述
            obj.description = this.localStoragePatrolOrder.description; // 本地存储取 因为有的返回数据没有编号和描述

            localStorage.setItem('patrolOrder', JSON.stringify(obj));

            setTimeout(() => {
                this.getList();
                browserHistory.push('/patrol/order');
            }, 500);
            // setTimeout(() => { window.location.href = `/patrol/order/${obj.process}` }, 500);
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
        const {children, state, commonState, location, commonActions} = this.props;
        const data = state.orderListData;
        const dataSource = data.list;


        const isAddPatrolOrder = location.query.add_patrol_order;
        const localStoragePatrolOrder = JSON.parse(localStorage.getItem('patrolOrder'));
        this.localStoragePatrolOrder = localStoragePatrolOrder;

        const patrolOrderCommitData = state.patrolOrderCommitListData;
        const patrolOrderCommitNum = (localStoragePatrolOrder && localStoragePatrolOrder.patrolOrderNum);
        const orderCode = isAddPatrolOrder ? state.orderCode : patrolOrderCommitNum;


        const curProcess = location.pathname.substring(location.pathname.lastIndexOf("/") + 1);
        let sendProcess = localStoragePatrolOrder && localStoragePatrolOrder.process == curProcess;

        let sendProcessId, isSave;

        if (curProcess == "order_commit") {
            sendProcessId = patrolOrderCommitData.id;
            if (patrolOrderCommitData.status === 'DTB' || patrolOrderCommitData.length === 0) {
                isSave = true
            } else {
                isSave = false
            }
        }
        else if (curProcess == "order_assign") {
            // 执行人存在时才可以发送流程
            if (patrolOrderCommitData.excutePerson && sendProcess) {
                sendProcess = true;
                sendProcessId = patrolOrderCommitData.id; // 分派tab页详情数据找到工单id
            } else {
                sendProcess = false;
            }

            if (patrolOrderCommitData.status === 'DFP') {
                isSave = true
            } else {
                isSave = false
            }
        }
        else if (curProcess == "order_excute") {
            sendProcessId = state.patrolOrderCommitListData.id;

            if (patrolOrderCommitData.status === 'DHB') {
                isSave = true
            } else {
                isSave = false
            }
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
                getCheckboxProps: record => ({
                    disabled: record.status !== 'DTB', // 不是待提报 全部disable
                }),
            } :
            null;
        return children ?
            (
                <div>
                    <div className="top-bar clearfix">
                        <div className="details-title pull-left">
                            <h3>{orderCode}</h3>
                            <span
                                className="eam-tag">{(localStoragePatrolOrder && correspondenceJson.patrolOrder[localStoragePatrolOrder.status].text)}</span>
                            <p>{(localStoragePatrolOrder && localStoragePatrolOrder.description)}</p>

                        </div>
                        <div className="list-tools-right pull-right">
                            <Pagination
                                total={50}
                                className="pull-left"
                                current={this.state.currentPage}
                                onChange={this.pageChange}
                            />
                            <BackList location={location}/>
                            {
                                sendProcess ?
                                    <Button type="primary" size="large" onClick={() => {
                                        this.sendProcess(curProcess)
                                    }}>发送流程</Button> :
                                    null
                            }
                        </div>
                        <div className="eam-tab-nav">
                            <Link activeClassName="active" to="/patrol/order/order_commit"><Icon
                                type="check-circle-o"/>提报</Link>
                            {
                                isAddPatrolOrder ?
                                    null :
                                    <Link activeClassName="active" to="/patrol/order/order_assign"><Icon
                                        type="check-circle-o"/>分派</Link>
                            }
                            {
                                isAddPatrolOrder ?
                                    null :
                                    <Link activeClassName="active" to="/patrol/order/order_excute"><Icon
                                        type="check-circle-o"/>执行汇报</Link>
                            }
                            {isSave ? <Button
                                    style={{position: 'absolute', right: 0, bottom: 10}}
                                    size="large"
                                    onClick={this.orderSave}
                                >
                                    保存
                                </Button> : null}

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
                            title="巡检工单"
                            commonState={commonState}
                            commonActions={commonActions}
                            onEnter={(text) => {
                                this.fuzzyQuery(text);
                            }}
                            listToolsComponentWillMount={this.listToolsComponentWillMount}
                            /*collectionChange={(checked) => {
                             this.param.collect = checked;
                             this.getList();
                             }}*/
                            seniorFilter={{
                                data: [
                                    {
                                        type: 'DOMAIN_VALUE',               // 选择项类型
                                        key: 'orderStatusData',         // key 域值的key用作取state数据
                                        label: '状态',                    // 标题
                                        actionsType: 'PATROL_ORDER_STATUS',   // 域值actions type
                                        actionsParam: 'patrolOrder',           // 域值actions 参数
                                    },
                                    {
                                        type: 'DOMAIN_VALUE',
                                        key: 'patrolTypeData',
                                        label: '巡检类型',
                                        actionsType: 'PATROL_TYPE',
                                        actionsParam: 'patrolType',

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
                                        icon: 'edit',
                                        text: '变更状态',
                                        confirmText: '确认变更'
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
        state: state.patrol,
        commonState: state.common
    }
}

function buildActionDispatcher(dispatch) {
    return {
        actions: bindActionCreators(actions, dispatch),
        commonActions: bindActionCreators(commonActions, dispatch),
    }
}

export default connect(mapStateToProps, buildActionDispatcher)(OrderComponent);