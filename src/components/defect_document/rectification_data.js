/**
 * @Description: 整改单
 */
import React from 'react';
import ReactDOM from 'react-dom';
import { bindActionCreators } from 'redux';
import { Link, browserHistory } from 'react-router';
import { connect } from 'react-redux';
import actions from '../../actions/defect_document.js';
import commonActions from '../../actions/common.js';

import Collection from '../../components/common/collection.js';
import MoreOperations from '../../components/common/more_operations.js';
import BackList from '../../components/common/back_list.js';
import ListTools from '../../components/common/list_tools.js';
import DetailsPagination from '../../components/common/details_pagination.js';
import { runActionsMethod, correspondenceJson, filterArrByAttr } from '../../tools/';
import moment from 'moment';
import { Icon, Button, Table, Pagination, Modal, Radio, Input, message } from 'antd';
const confirm = Modal.confirm;
const RadioGroup = Radio.Group;
const { TextArea } = Input;



class WorkOrderComponent extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            tableLoading: false,
            currentPage: 1,
            selectedRowKeys: [],
            rowSelection: null, // 表格多选
            moreOperationsKey: '',
        }
        const { commonState } = this.props;
        this.param = {
            orgId: commonState.orgId,
            siteId: commonState.siteId,
            pageNum: 1,
            pageSize: 10,
        };
    }
    jumpToDetail = (record, isAdd) => {
        if (isAdd) {
            // localStorage.removeItem('workOrder');
            // actions.workOrderCommitUpdateList('CLEAR_DATA'); //清除工单提报现有数据
            // browserHistory.push('/defect_document/');
            browserHistory.push('/defect_document/rectification_data/rectification_tab1');
        } else {
            // let status = record.status;
            // status = this.workOrderCorrJson[status];
            // let json = {};
            // json.id = record.id;
            // json.process = status.process;
            // json.status = record.status;
            // json.workOrderNum = record.workOrderNum;
            // json.description = record.description;
            //
            // localStorage.setItem('workOrder', JSON.stringify(json));
            // localStorage.setItem('LIST_PARAM', JSON.stringify(this.param)); // localStorage 全大写加下划线命名 作为通用存储名
            // browserHistory.push(`/maintenance/work_order/${status.path}`);
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

        // const { actions } = this.props;
        // this.setState({ tableLoading: true });
        // actions.workOrderGetList(this.param, () => {
        //     cb && cb();
        //     this.setState({ tableLoading: false });
        // });
    }
    // 列表删除
    del = (id) => {
        const { actions } = this.props;
        let param = {ids: id};
        runActionsMethod(actions, 'workOrderDel', param, () => {
            this.getList();
        });
    }
    // 删除确认
    showConfirm = (id, arg) => {
        if (Array.isArray(id) && !id.length) {
            message.error('请选择要删除的数据。')
        } else {
            confirm({
                title: `删除 ${typeof arg !== 'function' ? arg : (id.length + '条数据')}?`,
                okText: '删除',
                onOk: () => {
                    if (Array.isArray(id)) id = id.join(',')
                    this.del(id);
                    arg(); // 隐藏复选框
                }
            });
        }

    }

    // 模糊查询
    fuzzyQuery = (keywords) => {
        this.param.words = keywords;
        this.getList();
    }
    //表格选中
    tableSelectChange = (selectedRowKeys) => {
        this.setState({ selectedRowKeys });
    }
    // 更多操作
    moreClick = (key, hideCheckBox) => {
        if (key === '2') { //批量删除
            this.showConfirm(this.state.selectedRowKeys, hideCheckBox)
        }
    }
    // 保存工单
    defectSave = () => {

    }
    // 数据是否加载完成 未完成不能点保存
    loadIsComplete = (curProcess, isAddWorkOrder) => {
        const { state, commonState } = this.props;
        let complete = false
        switch (curProcess) {
            case '1':
                break;
        }
        complete=true;

        return complete;
    }

    listToolsComponentWillMount = () => { // 代替 componentWillMount

        this.getList();
    }
    render () {

        const { children, state, commonState, commonActions, location } = this.props;

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
                    // disabled: this.state.moreOperationsKey === '2' ? record.status !== 'DTB' : false, // 批量删除 不是待提报 全部disable
                })
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
                dataIndex: 'defectDocumentNum',
                key: 'defectDocumentNum',
                sorter: true,
                render: (text, record, key) => {
                    return (
                        <p><a className="order-number" onClick={() => { this.jumpToDetail(record) }}>{text ? text : '-'}</a></p>
                    )
                }
            },
            {
                title: '描述',
                dataIndex: 'description',
                key: 'description ',
                sorter: true,
                render: defaultRender
            },
            {
                title: '工程类型',
                dataIndex: 'projectType',
                key: 'projectType',
                sorter: true,
                render: (text, record, key) => {
                    const arr = commonState.workProjectTypeData.filter((item, i) => {
                        return item.value == text;
                    });
                    return (
                        <p>{arr.length ? arr[0].description : '-'}</p>
                    )
                }
            },
            {
                title: '重要程度',
                dataIndex: 'importance',
                key: 'importance',
                sorter: true,
                render: (text, record, key) => {
                }
            },
            {
                title: '责任属性',
                dataIndex: 'responsibility',
                key: 'responsibility',
                sorter: true,
                render: (text, record, key) => {
                }
            },
            {
                title: '发现时间',
                dataIndex: 'findDate',
                key: 'findDate',
                sorter: true,
                render: (text, record, key) => {
                }
            },
            {
                title: '状态',
                dataIndex: 'status',
                key: 'status',
                sorter: true,
                render: (text, record, key) => {
                    return (
                        <p>{text ? correspondenceJson.workOrder[text].text : '-'}</p>
                    )
                }
            },
            {
                title: '整改完成度',
                dataIndex: 'completeness',
                key: 'completeness',
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
                            <Collection
                                isCollect={record.collect}
                                onChange={checked => {
                                    this.collect(checked, record.id);
                                }}
                            />
                            <Icon
                                type="delete"
                                onClick={() => {
                                    this.showConfirm(record.id, record.workOrderNum)
                                }}
                            />
                        </div>
                    )
                }
            },
        ];
        const  isAddWorkOrder=true;//是否是新增
        return children ?

            (
                <div>
                    <div className="top-bar clearfix">
                        <div className="details-title pull-left">
                            <h3>我的编码</h3>
                            <span className="eam-tag">我是状态</span>
                            <p>我是描述</p>
                        </div>
                        {/*<h3>{this.loadIsComplete(curProcess, isAddWorkOrder) ? workOrderCode : <span><Icon type="loading" /> 数据加载中...</span>}</h3>*/}
                        {/*<span className="eam-tag">{this.loadIsComplete(curProcess, isAddWorkOrder) ? (localStorageWorkOrder && correspondenceJson.workOrder[localStorageWorkOrder.status].text) : null}</span>*/}
                        {/*<p>{this.loadIsComplete(curProcess, isAddWorkOrder) ? (localStorageWorkOrder && localStorageWorkOrder.description) : ''}</p>*/}
                        {/*</div>*/}
                        <div className="list-tools-right pull-right">
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
                            <BackList />
                            <Button type="primary" size="large" onClick={() => { this.jumpToDetail('', true) }}>新建</Button>
                            {/*{*/}
                            {/*( isAddWorkOrder) ?*/}
                            {/*<Button*/}
                            {/*size="large"*/}
                            {/*onClick={this.defectSave}*/}
                            {/*disabled={this.loadIsComplete(curProcess, isAddWorkOrder) ? false : true}*/}
                            {/*>*/}
                            {/*保存*/}
                            {/*</Button> :*/}
                            {/*null*/}
                            {/*}*/}
                            <Button>保存</Button>
                        </div>

                        <div className="eam-tab-nav">
                            <Link activeClassName="active" to='/defect_document/rectification_data/rectification_tab1'><Icon type="check-circle-o" />工单提报</Link>
                            <Link activeClassName="active" to='/defect_document/rectification_data/rectification_tab2'><Icon type="check-circle-o" /> 任务分派</Link>
                            <Link activeClassName="active" to='/defect_document/rectification_data/rectification_tab3'><Icon type="check-circle-o" />执行汇报</Link>
                            <Link activeClassName="active" to='/defect_document/rectification_data/rectification_tab4'><Icon type="check-circle-o" /> 确认验收</Link>
                            <Button type="primary" size="large" style={{position: 'absolute', right: 0, bottom: 10}} onClick={() => { this.sendProcess(curProcess) }}>发送流程</Button> :
                        </div>
                    </div>
                    {children}
                </div>
            ) :
            (
                <div>
                    <div className="top-bar clearfix">
                        <ListTools
                            title="整改单"
                            commonState={commonState}
                            commonActions={commonActions}
                            listToolsComponentWillMount={this.listToolsComponentWillMount}
                            onEnter={(text) => {
                                this.fuzzyQuery(text);
                            }}
                        />
                        <div className="list-tools-right pull-right">
                            <Pagination
                                total={10}
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
                                rowKey="id"
                                loading={this.state.tableLoading}
                                pagination={false}
                                dataSource={[]}
                                columns={columns}
                                rowSelection={rowSelection}
                                bordered
                                onChange={this.tableChange}
                            />
                            <Pagination
                                total={0}
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