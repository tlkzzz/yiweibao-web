/**
 * 维修保养-作业标准
 */
import React from 'react';
import { bindActionCreators } from 'redux';
import { browserHistory } from 'react-router';
import { connect } from 'react-redux';
import actions from '../../actions/maintenance.js';
import commonActions from '../../actions/common.js';

import Collection from '../../components/common/collection.js';
import Dropdown from '../../components/common/dropdown.js';
import BackList from '../../components/common/back_list.js';
import ListTools from '../../components/common/list_tools.js';
import EamModal from '../../components/common/modal.js';
import DetailsPagination from '../../components/common/details_pagination.js';
import MoreOperations from '../../components/common/more_operations.js';
import StatusChangeForm from '../../components/common/statusChange.js';

import { runActionsMethod, filterArrByAttr } from '../../tools/';

import { Icon, Button, Table, Pagination, Menu, Modal, message } from 'antd';
const confirm = Modal.confirm;

import moment from 'moment';

class JobPlanComponent extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            tableLoading: false,
            currentPage: 1,
            selectedRowKeys: [],
            rowSelection: null,
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

        const { actions } = this.props;

        if (isAdd) {
            localStorage.removeItem('jobPlan');

            actions.jobPlanDetailsUpdateList('CLEAR_DATA'); //清除工单提报现有数据
            browserHistory.push('/maintenance/');
            browserHistory.push('/maintenance/job_plan/job_plan_details?add_Job_Plan=1');
        } else {

            let json = {};
            json.id = record.id;
            json.status = record.status;
            json.jobStandardNum = record.jobStandardNum;
            json.description = record.description;

            localStorage.setItem('LIST_PARAM', JSON.stringify(this.param));
            localStorage.setItem('jobPlan', JSON.stringify(json));
            browserHistory.push(`/maintenance/job_plan/job_plan_details`);
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
        const { commonActions } = this.props;
        this.setState({ tableLoading: true });
        commonActions.jobPlanGetList(this.param, () => {
            cb && cb();
            this.setState({ tableLoading: false });
        });
    }
    // 列表删除
    del = (id, callback) => {
        const { actions } = this.props;
        let param = {ids: id};
        runActionsMethod(actions, 'jobPlanDel', param, (json) => {
            callback(json);
            this.getList();
        });
    }
    // 删除确认
    showConfirm = (id, arg) => {
        if (Array.isArray(id) && !id.length) {
            message.error('请选择数据')
        } else {
            confirm({
                title: `删除 ${typeof arg !== 'function' ? arg : (id.length + '条数据')}?`,
                okText: '删除',
                onOk: () => {
                    const pathname = window.location.pathname;
                    const isDetailsPage = pathname.indexOf('job_plan_details') !== -1;

                    if (Array.isArray(id)) id = id.join(',')
                    this.del(id, (json) => {
                        if (json.success) {
                            isDetailsPage ? browserHistory.push('/maintenance/job_plan/') : this.getList();
                        }
                    });
                    if (typeof arg === 'function') arg(); // 隐藏复选框
                }
            });
        }

    }
    // 列表项收藏点击
    collect = (checked, id) => {
        const { actions } = this.props;
        const param = {
            checked,
            id,
        }
        runActionsMethod(actions, 'jobPlanCollect', param);
    }
    // 模糊查询
    fuzzyQuery = (keywords) => {
        this.param.words = keywords;
        this.getList();
    }
    tableSelectChange = (selectedRowKeys) => {
        this.setState({ selectedRowKeys });
    }
    // 列表更多操作
    moreClick = (key, hideCheckBox) => {
        if (key === '0') { // 变更状态
            if (!this.state.selectedRowKeys.length) {
                message.error('请选择数据');
            } else {
                this.statusChangeModal.modalShow();
            }
        }
        if (key === '2') { //批量删除
            this.showConfirm(this.state.selectedRowKeys, hideCheckBox)
        }
    }
    // 详情页更多操作
    detailsMoreClick = (key) => {
        if (key === '0') {
            this.statusChangeModal.modalShow();
        }
        if (key === '2') { // 详情页删除
            const localStorageJobPlan = JSON.parse(localStorage.getItem('jobPlan'));
            this.showConfirm(localStorageJobPlan.id, localStorageJobPlan.jobStandardNum)
        }
    }
    // 变更状态
    statusChange = () => {
        const { actions, location } = this.props;

        const values = this.statusChangeForm.props.form.getFieldsValue();
        const pathname = location.pathname;

        const isDetailsPage = pathname.indexOf('job_plan_details') !== -1;
        const localStorageJobPlan = JSON.parse(localStorage.getItem('jobPlan'));

        if (isDetailsPage) localStorageJobPlan.status = values.status;

        let param = {
            id: isDetailsPage ? [localStorageJobPlan.id] : this.state.selectedRowKeys,
            status: values.status,
            statusRemark: values.description || '',
        }

        runActionsMethod(actions, 'jobPlanStatusChange', param, () => {
            if (isDetailsPage) {
                this.jumpToDetail(localStorageJobPlan)
            } else {
                this.setState({ selectedRowKeys: [] });
                this.listMoreOperations.cancel();
                this.getList();
            }

            this.statusChangeModal.modalHide();
        });
    }
    // 保存
    jpSave = () => {
        const { actions, location, commonState } = this.props;

        const isAddJobPlan = location.query.add_Job_Plan;
        const localStorageJobPlan = JSON.parse(localStorage.getItem('jobPlan'));

        actions.getFormValues(false);
        clearTimeout(this.timer);
        this.timer = setTimeout(() => {
            const { state } = this.props;

            const ids = {
                orgId: commonState.orgId,
                siteId: commonState.siteId,
                id: localStorageJobPlan ? localStorageJobPlan.id : '',
            }

            const data = state.jobPlanDetailsListData,
                  maintenanceJobStandardItemVoList = data.newMaterialsList || [],
                  maintenanceJobStandardTaskVoList = data.newTaskStepsList || [],
                  deleteMaintenanceJobStandardItemVoList = data.materialDelOriginalDataId || [],
                  deleteMaintenanceJobStandardTaskVoList = data.delOriginalDataId || [];

            const maintenanceJobStandardItemCopy = JSON.parse(JSON.stringify(maintenanceJobStandardItemVoList));

            maintenanceJobStandardItemCopy.forEach(item => {
                item.itemId = item.id;
                item.itemUnit = item.orderUnit
                delete item.id;
                delete item.orderUnit;
            })

            state.getFormValues.statusDate = moment(state.getFormValues.statusDate).format('YYYY-MM-DD HH:mm:ss');

            const param = {
                ...ids,
                ...state.getFormValues,
                maintenanceJobStandardItemVoList: maintenanceJobStandardItemCopy,
                maintenanceJobStandardTaskVoList,
                deleteMaintenanceJobStandardItemVoList,
                deleteMaintenanceJobStandardTaskVoList,
            }



            runActionsMethod(actions, 'jpSave', param, (json) => {
                const data = json.data;

                const obj = {};
                obj.id = data.id;
                obj.status = data.status;
                obj.jobStandardNum = data.jobStandardNum;
                obj.description = data.description;

                localStorage.setItem('jobPlan', JSON.stringify(obj));

                setTimeout(() => {
                    browserHistory.push('/maintenance/');
                    browserHistory.push('/maintenance/job_plan/job_plan_details');
                }, 500);

            });
        },0);
    }
    // 数据是否加载完成 未完成不能点保存
    loadIsComplete = (isAdd) => {

        const { state, commonState } = this.props;

        let complete = false

        const jobPlanCode = isAdd ? state.jobPlanCode : true,
              standardTypeData = commonState.standardTypeData,
              jpTypeData = commonState.jpTypeData,
              jpStatusData = commonState.jpStatusData,
              jobPlanDetailsListData = isAdd ? true : state.jobPlanDetailsListData.id;

        if (
            jobPlanCode &&
            standardTypeData.length &&
            jpTypeData.length &&
            jpStatusData.length &&
            jobPlanDetailsListData
        ) complete = true;

        return complete;
    }
    resetListParam = () => {
        this.param.status = this.param.jobType = this.param.standardType = [];
    }
    listToolsComponentWillMount = () => { // 代替 componentWillMount
        this.resetListParam();
        this.getList();
    }
    render () {

        const { children, state, commonActions, commonState, location } = this.props;
        const data = commonState.jobPlanListData;
        const list = data.list;

        const workOrderStatus = state.workOrderStatusData,
              workOrderType = state.workOrderTypeData;

        // 高级筛选选项数据
        const seniorFilterSelectArr = [
            {
                title: '工单状态',
                btns: workOrderStatus
            },
            {
                title: '工程类型',
                btns: workOrderType
            },
        ];

        //表格多选
        const rowSelection = this.state.rowSelection ?
        {
            selectedRowKeys: this.state.selectedRowKeys,
            onChange: this.tableSelectChange,
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
                title: '编码',
                dataIndex: 'jobStandardNum',
                key: 'jobStandardNum',
                sorter: true,
                render: (text, record, key) => {
                    return (
                        <p><a className="order-number" onClick={() => { this.jumpToDetail(record) }}>{text ? text : '-'}</a></p>
                    )
                }
            },
            {
                title: '描述',
                width: '30%',
                dataIndex: 'description',
                key: 'description',
                sorter: true,
                render: defaultRender
            },
            {
                title: '标准类型',
                dataIndex: 'standardType',
                key: 'standardType',
                sorter: true,
                render: (text, record, key) => {
                    const arr = commonState.standardTypeData.filter((item, i) => {
                        return item.value == text;
                    });

                    return (
                        <p>{arr.length ? arr[0].description : '-'}</p>
                    )
                }
            },
            {
                title: '状态',
                dataIndex: 'status',
                key: 'status',
                sorter: true,
                render: (text, record, key) => {
                    const arr = commonState.jpStatusData.filter((item, i) => {
                        return item.value == text;
                    });

                    return (
                        <p>{arr.length ? arr[0].description : '-'}</p>
                    )
                }
            },
            {
                title: '作业类型',
                dataIndex: 'jobType',
                key: 'jobType',
                sorter: true,
                render: (text, record, key) => {
                    const arr = commonState.jpTypeData.filter((item, i) => {
                        return item.value == text;
                    });

                    return (
                        <p>{arr.length ? arr[0].description : '-'}</p>
                    )
                }
            },
            {
                title: '站点',
                dataIndex: 'siteName',
                key: 'siteName',
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
                                    this.showConfirm(record.id, record.jobStandardNum)
                                }}
                            />
                        </div>
                    )
                }
            },
        ];

        const isAddJobPlan = location.query.add_Job_Plan;
        const localStorageJobPlan = JSON.parse(localStorage.getItem('jobPlan'));

        const jobStandardNum = isAddJobPlan ? state.jobPlanCode : (localStorageJobPlan && localStorageJobPlan.jobStandardNum)

        const status = localStorageJobPlan && localStorageJobPlan.status;
        const statusArr = commonState.jpStatusData.filter((item, i) => {
            return item.value == status;
        });

        const NewStatusChange = (
            <EamModal
                title="变更状态"
                ref={statusChangeModal => this.statusChangeModal = statusChangeModal}
                afterClose={() => {
                    this.statusChangeForm.props.form.resetFields()
                }}
            >
                <StatusChangeForm
                    statusData={commonState.jpStatusData}
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
                        <h3>{this.loadIsComplete(isAddJobPlan) ? jobStandardNum : <span><Icon type="loading" /> 数据加载中...</span>}</h3>
                        <span className="eam-tag">{this.loadIsComplete(isAddJobPlan) ? (statusArr[0] && statusArr[0].description) : ''}</span>
                        <p>{this.loadIsComplete(isAddJobPlan) ? (localStorageJobPlan && localStorageJobPlan.description) : ''}</p>
                    </div>
                    <div className="list-tools-right pull-right">
                        {
                            isAddJobPlan ?
                            null :
                            <DetailsPagination
                                state={commonState} // 列表数据的state
                                listDataName="jobPlanListData" // 列表数据state名 -> data = state.workOrderListData
                                localStorageName="jobPlan" // onChang 方法内设置的存储名
                                onChange={(record)=>{
                                    let json = {};
                                    json.id = record.id;
                                    json.status = record.status;
                                    json.jobStandardNum = record.jobStandardNum;
                                    json.description = record.description;

                                    localStorage.setItem('jobPlan', JSON.stringify(json));
                                    browserHistory.push('/maintenance/');
                                    browserHistory.push(`/maintenance/job_plan/job_plan_details`);
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
                        <BackList location={location}/>
                        {
                            isAddJobPlan ?
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
                        {
                            isAddJobPlan ?
                            null :
                            <Button type="primary" size="large" onClick={() => { this.jumpToDetail('', true) }}>新建</Button>
                        }
                        <Button
                            size="large"
                            onClick={this.jpSave}
                            disabled={this.loadIsComplete(isAddJobPlan) ? false : true}
                        >
                            保存
                        </Button>
                    </div>
                </div>
                {children}
                {NewStatusChange}
            </div>
          ):
          (
            <div>
                <div className="top-bar clearfix">
                    <ListTools
                        title="作业标准"
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
                                    type: 'DOMAIN_VALUE',
                                    key: 'jpStatusData',
                                    label: '作业状态',
                                    actionsType: 'JP_STATUS',
                                    actionsParam: 'jpStatus',
                                },
                                {
                                    type: 'DOMAIN_VALUE',
                                    key: 'jpTypeData',
                                    label: '作业类型',
                                    actionsType: 'JP_TYPE',
                                    actionsParam: 'jptype',

                                },
                                {
                                    type: 'DOMAIN_VALUE',
                                    key: 'standardTypeData',
                                    label: '标准类型',
                                    actionsType: 'STANDARD_TYPE',
                                    actionsParam: 'standardtype',

                                },
                            ],
                            onOk: result => {
                                this.setState({ currentPage: 1 });
                                this.param.pageNum = 1;

                                this.param.status = filterArrByAttr(result[0] && result[0].data || [], 'value');
                                this.param.jobType = filterArrByAttr(result[1] && result[1].data || [], 'value');
                                this.param.standardType = filterArrByAttr(result[3] && result[3].data || [], 'value');

                                this.getList();
                            }
                        }}
                        onEnter={(text) => {
                            this.fuzzyQuery(text);
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
                            dataSource={list}
                            columns={columns}
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

export default connect(mapStateToProps, buildActionDispatcher)(JobPlanComponent);
