/** 
 * @Description 巡检路线
 */
import React from 'react';
import {bindActionCreators} from 'redux';
import {Link, browserHistory} from 'react-router';
import {connect} from 'react-redux';
import actions from '../../actions/patrol.js';
import commonActions from '../../actions/common.js';


import Collection from '../../components/common/collection.js';
import Dropdown from '../../components/common/dropdown.js';
import MoreOperations from '../../components/common/more_operations.js';
import BackList from '../../components/common/back_list.js';
import ListTools from '../../components/common/list_tools.js';
import EamModal from '../../components/common/modal.js';
import StatusChangeForm from '../../components/common/statusChange.js';
import {runActionsMethod, filterArrByAttr} from '../../tools/';

import {Icon, Checkbox, Modal, Button, Table, Pagination, message, Menu} from 'antd';
const confirm = Modal.confirm;

class RouteComponent extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            modalShow: false,
            currentPage: 1,
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
                dataIndex: 'patrolRouteNum',
                key: 'patrolRouteNum',
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
                title: '路线描述',
                dataIndex: 'description',
                key: 'description',
                sorter: true,
                render: defaultRender
            },
            {
                title: '巡检类型',
                dataIndex: 'typeDescription',
                key: 'type',
                sorter: true,
                render: defaultRender
            },
            {
                title: '备注',
                dataIndex: 'remark',
                key: 'remark',
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
                key: 'siteid',
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
            pageNum: 1,
            pageSize: 10,
        }
    }

    jumpToDetail = (record, isAdd) => {
        const {actions} = this.props;

        if (isAdd) {
            localStorage.removeItem('route');
            actions.clearList('ROUTE_POINT_GET_LIST');
            browserHistory.push('/patrol/');
            browserHistory.push('/patrol/route/route_info?add_route=1');
        } else {
            let json = {};
            json.id = record.id;
            json.status = record.status;
            json.statusDescription = record.statusDescription;
            json.patrolRouteNum = record.patrolRouteNum;
            json.description = record.description;

            localStorage.setItem('route', JSON.stringify(json));
            browserHistory.push('/patrol/');
            browserHistory.push(`/patrol/route/route_info`);
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
        actions.routeGetList(this.param, () => {
            this.setState({tableLoading: false});
        });
    };

    deletePatrolRoute = (id) => {
        const {actions} = this.props;
        let param = {ids: id};
        actions.patrolRouteDel(param, (data) => {
            if (data.success) {
                this.getList();
                browserHistory.push('/patrol/route');
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
                    this.deletePatrolRoute(id);
                    if (typeof arg === 'function')arg(); // 隐藏复选框
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
        if (key === '0') {//变更状态
            if (!this.state.selectedRowKeys.length) {
                message.error('请选择路线');
            } else {
                this.statusChangeModal.modalShow();
            }
        }
        if (key === '2') { //批量删除
            this.showConfirm(this.state.selectedRowKeys, hideCheckBox)
        }
    }
    detailsMoreClick = (key) => {
        if (key === '0') {
            this.statusChangeModal.modalShow();
        }
        if (key === '2') { // 详情页删除
            const localStorageRoute = JSON.parse(localStorage.getItem('route'));
            this.showConfirm(localStorageRoute.id, localStorageRoute.patrolRouteNum)
        }
    }
    statusChange = () => {
        const {actions, location} = this.props;

        const values = this.statusChangeForm.props.form.getFieldsValue();
        const pathname = location.pathname;

        const isDetailsPage = pathname.indexOf('route_info') !== -1;
        const localStorageRoute = JSON.parse(localStorage.getItem('route'));

        if (isDetailsPage) localStorageRoute.status = values.status;

        let param = {
            ids: isDetailsPage ? [localStorageRoute.id] : this.state.selectedRowKeys,
            status: values.status,
            description: values.description,
        }

        runActionsMethod(actions, 'routeStatusChange', param, () => {
            if (isDetailsPage) {
                this.jumpToDetail(localStorageRoute)
            } else {
                this.setState({selectedRowKeys: []});
                this.listMoreOperations.cancel();
                this.getList();
            }

            this.statusChangeModal.modalHide();
        });
    }

    // 保存巡检路线
    routeSave = () => {
        const {actions, location} = this.props;
        actions.getFormValues(false);

        const pathname = location.pathname;

        clearTimeout(this.timer);
        this.timer = setTimeout(() => {
            const {state} = this.props;

            if (pathname.indexOf('route_info') !== -1) {
                const data = state.routePointListData,
                    pointAddlist = data.newRoutePointList || [],
                    pointDeleteIdArr = data.delOriginalDataId || [],
                    pointDeleteIds = pointDeleteIdArr.join(',');
                if (state.getFormValues === true) return;

                const param = {
                    ...state.getFormValues,
                    pointAddlist,
                    pointDeleteIds,
                }

                runActionsMethod(actions, 'routeInfoSave', param, (data) => {
                    let record = data.data;
                    let json = {};
                    json.id = record.id;
                    json.status = record.status;
                    json.statusDescription = record.statusDescription;
                    json.patrolRouteNum = record.patrolRouteNum;
                    json.description = record.description;

                    localStorage.setItem('route', JSON.stringify(json));
                    localStorage.setItem('route_edit_flag', false);

                    browserHistory.push('/patrol/');
                    browserHistory.push(`/patrol/route/route_info`);
                });
            }
        }, 0);
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
        const {children, state, location, commonState, commonActions} = this.props;
        const data = state.routeListData;
        const dataSource = data.list;

        const isAddRoute = location.query.add_route;
        const isInfo = location.pathname.indexOf('route_info');

        const localStorageRoute = JSON.parse(localStorage.getItem('route'));

        const routeCommitData = state.routeListData;
        const routeCommitNum = routeCommitData.patrolRouteNum ? routeCommitData.patrolRouteNum : (localStorageRoute && localStorageRoute.patrolRouteNum);
        const routeCode = isAddRoute ? state.routeCode : routeCommitNum;

        const rowSelection = this.state.rowSelection ?
            {
                selectedRowKeys: this.state.selectedRowKeys,
                onChange: this.tableSelectChange,
            } :
            null;
        const NewStatusChange = (
            <EamModal
                title="变更状态"
                ref={statusChangeModal => this.statusChangeModal = statusChangeModal}
            >
                <StatusChangeForm
                    statusData={commonState.routeStatusData}
                    wrappedComponentRef={statusChangeForm => this.statusChangeForm = statusChangeForm}
                />
                <div className="modal-footer clearfix">
                    <Button size="large" onClick={() => {
                        this.statusChangeModal.modalHide()
                    }}>取消</Button>
                    <Button type="primary" size="large" onClick={this.statusChange}>确定</Button>
                </div>
            </EamModal>
        )
        return children ?
            (
                <div>
                    <div className="top-bar clearfix">
                        <div className="details-title pull-left">
                            <h3>{routeCode}</h3>
                            <span
                                className="eam-tag">{routeCommitData.statusDescription ? routeCommitData.statusDescription : (localStorageRoute && localStorageRoute.statusDescription)}</span>
                            <p>{routeCommitData.description ? routeCommitData.description : (localStorageRoute && localStorageRoute.description)}</p>
                        </div>
                        <div className="list-tools-right pull-right">
                            <Pagination
                                total={50}
                                className="pull-left"
                                current={this.state.currentPage}
                                onChange={this.pageChange}
                            />
                            {
                                isAddRoute ?
                                    null :
                                    <Dropdown
                                        overlay={(
                                            <Menu onClick={(e) => {this.detailsMoreClick(e.key)}}>
                                                <Menu.Item key="0"><Icon type="edit" /> 变更状态</Menu.Item>
                                                <Menu.Divider />
                                                <Menu.Item key="2"><Icon type="delete" /> 删除</Menu.Item>
                                            </Menu>
                                        )}
                                        trigger={['click']}
                                    >
                                        更多操作
                                    </Dropdown>
                            }
                            <BackList  location={location}/>
                            <Button size="large" onClick={this.routeSave}>保存</Button>
                        </div>
                    </div>
                    {children}
                    {NewStatusChange}
                </div>
            ) :
            (
                <div>
                    <div className="top-bar clearfix">
                        <ListTools
                            title="巡检路线"
                            commonState={commonState}
                            commonActions={commonActions}
                            onEnter={(text) => {
                                this.fuzzyQuery(text);
                            }}
                            listToolsComponentWillMount={this.listToolsComponentWillMount}
                            /*collectionChange={(checked) => {
                             //this.param = Object.assign({}, this.param, json);
                             this.param.collect = checked;
                             this.getList();
                             }}*/
                            seniorFilter={{
                                data: [
                                    {
                                        type: 'DOMAIN_VALUE',               // 选择项类型
                                        key: 'routeStatusData',         // key 域值的key用作取state数据
                                        label: '状态',                    // 标题
                                        actionsType: 'PATROL_ROUTE_STATUS',   // 域值actions type
                                        actionsParam: 'patrolRouteStatus',           // 域值actions 参数
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
                                ref={listMoreOperations => this.listMoreOperations = listMoreOperations}
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
                    {NewStatusChange}
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

export default connect(mapStateToProps, buildActionDispatcher)(RouteComponent);
