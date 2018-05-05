/**
 * 维修保养-预防维护计划 
 */
import React from 'react';
import { bindActionCreators } from 'redux';
import { Link, browserHistory } from 'react-router';
import { connect } from 'react-redux';
import actions from '../../actions/maintenance.js';
import commonActions from '../../actions/common.js';

import Collection from '../../components/common/collection.js';
import Dropdown from '../../components/common/dropdown.js';
import NumInp from '../../components/common/num_inp.js';
import BackList from '../common/back_list';
import ListTools from '../common/list_tools';
import EamModal from '../../components/common/modal.js';
import DetailsPagination from '../../components/common/details_pagination.js';
import MoreOperations from '../../components/common/more_operations.js';
import StatusChangeForm from '../../components/common/statusChange.js';

import { runActionsMethod, filterArrByAttr } from '../../tools/';

import { Icon, Button, Table, Pagination, Form, Input, Row, Col, Select, Menu, Modal, message } from 'antd';
const FormItem = Form.Item;
const Option = Select.Option;
const confirm = Modal.confirm;

import moment from 'moment';

class maintenancePlanComponent extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            tableLoading: false,
            currentPage: 1,
            selectedRowKeys: [],
            rowSelection: null,
            moreOperationsKey: '',
        }

        this.customPanelStyle = {
            background: '#fff',
            borderRadius: 2,
            marginBottom: 24,
            border: 0,
            boxShadow: '0 1px 6px rgba(0, 0, 0, 0.2)'
        };

        this.recordDate = null;

        const  { commonState } = this.props;

        this.param = {
            orgId: commonState.orgId,
            siteId: commonState.siteId,
            pageNum: 1,
            pageSize: 10,
        }
    }
    // 分页事件
    pageChange = (page, pageSize) => {
        this.setState({ currentPage: page });
        this.param.pageNum = page; //*** 需要修改参数 在方法内单独修改
        this.getList();
    }

    jumpToDetail = (record, isAdd) => {

        const { actions } = this.props;

        if (isAdd) {
            localStorage.removeItem('maintenancePlan');
            
            actions.mPDetailsUpdateList('CLEAR_DATA'); //清除工单提报现有数据
            browserHistory.push('/maintenance/');
            browserHistory.push('/maintenance/maintenance_plan/mp_tab_1?add_maintenance_Plan=1');
        } else {

            let json = {};
            json.id = record.id;
            json.status = record.status;
            json.maintenancePlanNum = record.maintenancePlanNum;
            json.description = record.description;

            localStorage.setItem('LIST_PARAM', JSON.stringify(this.param));
            localStorage.setItem('maintenancePlan', JSON.stringify(json));
            browserHistory.push(`/maintenance/maintenance_plan/mp_tab_1`);
        }
    }
    // 列表删除
    del = (id, callback) => {
        const { actions } = this.props;
        let param = {ids: id};
        runActionsMethod(actions, 'maintenancePlanDel', param, (json) => {
            callback(json);
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
                            isDetailsPage ? browserHistory.push('/maintenance/maintenance_plan') : this.getList();
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
        runActionsMethod(actions, 'maintenancePlanCollect', param);
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
                message.error('请选择工单');
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
            const localMaintenancePlan = JSON.parse(localStorage.getItem('maintenancePlan'));
            this.showConfirm(localMaintenancePlan.id, localMaintenancePlan.maintenancePlanNum)
        }
    }
    // 变更状态
    statusChange = () => {
        const { actions, location } = this.props;

        const values = this.statusChangeForm.props.form.getFieldsValue();
        const pathname = location.pathname;

        const isDetailsPage = pathname.indexOf('tab') !== -1;
        const localMaintenancePlan = JSON.parse(localStorage.getItem('maintenancePlan'));;

        if (isDetailsPage) localMaintenancePlan.status = values.status;

        let param = {
            ids: isDetailsPage ? [localMaintenancePlan.id] : this.state.selectedRowKeys,
            status: values.status,
            statusRemark: values.description || '',
        }

        runActionsMethod(actions, 'maintenancePlanStatusChange', param, () => {
            if (isDetailsPage) {
                this.jumpToDetail(localMaintenancePlan)
            } else {
                this.setState({ selectedRowKeys: [] });
                this.listMoreOperations.cancel();
                this.getList();
            }

            this.statusChangeModal.modalHide();
        });
    }
    getList = (cb) => {
        const { actions } = this.props;
        this.setState({ tableLoading: true });
        actions.maintenancePlanGetList(this.param, () => {
            cb && cb();
            this.setState({ tableLoading: false });
        });
    }
    // 保存
    mpSave = () => {
        const { actions, location, commonState } = this.props;

        const isAddMaintenancePlan = location.query.add_maintenance_Plan;
        const localMaintenancePlan = JSON.parse(localStorage.getItem('maintenancePlan'));

        actions.getFormValues(false);
        clearTimeout(this.timer);
        this.timer = setTimeout(() => {
            const { state } = this.props;
            const data = state.maintenanceDetailListData;

            const ids = {
                orgId: commonState.orgId,
                siteId: commonState.siteId,
                id: localMaintenancePlan ? localMaintenancePlan.id : '',
            }

            if (state.getFormValues === true || !state.getFormValues[0] || !state.getFormValues[1] || !state.getFormValues[2]) return;

            const addAssetList = data.newAssetList || [],
                  deleteAssetList = data.delOriginalDataId,
                  maintenancePlanActiveTimeVoList = data.maintenancePlanActiveTimeVoList,
                  deleteMaintenancePlanActiveTimeVoList = data.termDateDelOriginalDataId;

            addAssetList.forEach((item) => {
                item.assetId = item.id;
            })

            if (state.getFormValues[2]) {
                state.getFormValues[2].extDate = moment(state.getFormValues[2].extDate).format('YYYY-MM-DD');
                state.getFormValues[2].nextDate = moment(state.getFormValues[2].nextDate).format('YYYY-MM-DD');
            }
            
            
            const param = {
                ...ids,
                ...state.getFormValues[0],
                ...state.getFormValues[1],
                ...state.getFormValues[2],
                ...state.getFormValues[3],
                addAssetList,
                deleteAssetList,
                maintenancePlanActiveTimeVoList,
                deleteMaintenancePlanActiveTimeVoList,
            }      

            runActionsMethod(actions, 'mpSave', param, (json) => {
                const data = json.data;

                const obj = {};
                obj.id = data.id;
                obj.status = data.status
                obj.maintenancePlanNum = data.maintenancePlanNum;
                obj.description = data.description;

                localStorage.setItem('maintenancePlan', JSON.stringify(obj));
                
                setTimeout(() => {
                    browserHistory.push('/maintenance/');
                    browserHistory.push('/maintenance/maintenance_plan/mp_tab_1');
                }, 500);
                
            });
        },0);
    }
    // 数据是否加载完成 未完成不能点保存
    loadIsComplete = (isAdd) => {

        const { state, commonState, location } = this.props;

        let complete = false

        if (location.pathname.indexOf('mp_tab_3') !== -1) return true;

        const maintenancePlanCode = isAdd ? state.maintenancePlanCode : true,
              pmStatusData = commonState.pmStatusData,
              workProjectTypeData = commonState.workProjectTypeData,
              timeFrequencyData = commonState.timeFrequencyData,
              maintenanceDetailListData = isAdd ? true : state.maintenanceDetailListData.id;

        if (
                maintenancePlanCode &&
                pmStatusData.length &&
                workProjectTypeData.length &&
                timeFrequencyData.length &&
                maintenanceDetailListData
        ) complete = true;

        return complete;
    }
    resetListParam = () => {
        this.param.status = this.param.projectType = this.param.assignPersonId = this.param.personliableId = [];
    }
    listToolsComponentWillMount = () => { // 代替 componentWillMount
        this.resetListParam();
        this.getList();
    }
    render () {
        const { state, commonState, commonActions, children, location } = this.props;

        const data = state.maintenancePlanListData;
        const list = data.list;

        const pageName = location.pathname.split('/')[3];


        //表格多选
        const rowSelection = this.state.rowSelection ? 
        {
            selectedRowKeys: this.state.selectedRowKeys,
            onChange: this.tableSelectChange,
            getCheckboxProps: record => {

                let disabled = false;

                if (this.state.moreOperationsKey === '2') {
                    disabled = record.status !== 'draft';
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

        // 保养计划表格字段
        const maintenancePlanColumns = [
            {
                title: '编码',
                dataIndex: 'maintenancePlanNum',
                key: 'maintenancePlanNum',
                render: (text, record, key) => {
                    return (
                      <p><a href="javascript:;" className="order-number" onClick={() => { this.jumpToDetail(record) }}>{text ? text : '-'}</a></p>
                    )
                }
            },
            {
                title: '描述',
                width: '30%',
                dataIndex: 'description',
                key: 'description',
                render: defaultRender
            },
            {
                title: '作业标准描述',
                dataIndex: 'jobStandardDesc',
                key: 'jobStandardDesc',
                render: defaultRender
            },
            {
                title: '工程类型',
                dataIndex: 'projectType',
                key: 'projectType',
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
                title: '状态',
                dataIndex: 'status',
                key: 'status',
                render: (text, record, key) => {
                    const arr = commonState.pmStatusData.filter((item, i) => {
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
                            {
                                record.status === 'draft' ?
                                <Icon
                                    type="delete"
                                    onClick={() => {
                                        this.showConfirm(record.id, record.maintenancePlanNum)
                                    }}
                                /> : 
                                null
                            }
                            
                        </div>
                    )
                }
            },
        ];

        const isAddMaintenancePlan = location.query.add_maintenance_Plan;
        const localMaintenancePlan = JSON.parse(localStorage.getItem('maintenancePlan'));

        const maintenancePlanNum = isAddMaintenancePlan ? state.maintenancePlanCode : (localMaintenancePlan && localMaintenancePlan.maintenancePlanNum)

        const status = localMaintenancePlan && localMaintenancePlan.status;
        const statusArr = commonState.pmStatusData.filter((item, i) => {
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
                    statusData={commonState.pmStatusData}
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
                        <h3>{this.loadIsComplete(isAddMaintenancePlan) ? maintenancePlanNum : <span><Icon type="loading" /> 数据加载中...</span>}</h3>
                        <span className="eam-tag">{this.loadIsComplete(isAddMaintenancePlan) ? (statusArr[0] && statusArr[0].description) : ''}</span>
                        <p>{this.loadIsComplete(isAddMaintenancePlan) ? (localMaintenancePlan && localMaintenancePlan.description) : ''}</p>
                    </div>
                    <div className="list-tools-right pull-right">
                        {
                            isAddMaintenancePlan ?
                            null :
                            <DetailsPagination
                                state={state} // 列表数据的state
                                listDataName="maintenancePlanListData" // 列表数据state名 -> data = state.workOrderListData
                                localStorageName="maintenancePlan" // onChang 方法内设置的存储名
                                onChange={(record)=>{
                                    let json = {};
                                    json.id = record.id;
                                    json.status = record.status;
                                    json.maintenancePlanNum = record.maintenancePlanNum;
                                    json.description = record.description;

                                    localStorage.setItem('maintenancePlan', JSON.stringify(json));
                                    browserHistory.push('/maintenance/');
                                    browserHistory.push(`/maintenance/maintenance_plan/mp_tab_1`);
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
                            isAddMaintenancePlan ?
                            null : 
                            <Dropdown
                                overlay={(
                                    <Menu onClick={(e) => {this.detailsMoreClick(e.key)}}>
                                        <Menu.Item key="0"><Icon type="edit" /> 变更状态</Menu.Item>
                                        {
                                            localMaintenancePlan && localMaintenancePlan.status === 'draft' ?
                                            <Menu.Divider /> : 
                                            null
                                        }
                                        {
                                            localMaintenancePlan && localMaintenancePlan.status === 'draft' ?
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
                            isAddMaintenancePlan ?
                            null : 
                            <Button type="primary" size="large" onClick={() => { this.jumpToDetail('', true) }}>新建</Button>
                        }
                        {
                            (pageName && pageName === 'mp_tab_3') ?
                            null :
                            <Button
                                size="large"
                                onClick={this.mpSave}
                                disabled={this.loadIsComplete(isAddMaintenancePlan) ? false : true}
                            >保存</Button>
                        }
                    </div>
                    <div className="eam-tab-nav" style={{visibility: (pageName && pageName === 'mp_tab_3') ? 'inherit' : 'hidden'}}>
                        <Link activeClassName="active" to='/maintenance/maintenance_plan/mp_tab_1'><Icon type="check-circle-o" /> 预防维护</Link>
                        <Link activeClassName="active" to='/maintenance/maintenance_plan/mp_tab_2'><Icon type="check-circle-o" /> 频率</Link>
                        <Link activeClassName="active" to='/maintenance/maintenance_plan/mp_tab_3'><Icon type="check-circle-o" /> 工单记录</Link>
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
                        title="预防维护计划"
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
                                    key: 'pmStatusData',
                                    label: '状态',
                                    actionsType: 'PM_STATUS',
                                    actionsParam: 'pmStatus',
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
                                    key: 'assignPersonName',
                                    label: '分派人',
                                },
                                {
                                    type: 'SELECT_PERSON',
                                    key: 'personliableName',
                                    label: '责任人',
                                },
                            ],
                            onOk: result => {
                                this.setState({ currentPage: 1 });
                                this.param.pageNum = 1;

                                this.param.status = filterArrByAttr(result[0] && result[0].data || [], 'value');
                                this.param.projectType = filterArrByAttr(result[1] && result[1].data || [], 'value');
                                this.param.assignPersonId = filterArrByAttr(result[2] && result[2].data || [], 'id');
                                this.param.personliableId = filterArrByAttr(result[3] && result[3].data || [], 'id');

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
                            dataSource={list}
                            rowSelection={rowSelection}
                            columns={maintenancePlanColumns}
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
        commonState: state.common
    }
}

function buildActionDispatcher(dispatch) {
    return {
        actions: bindActionCreators(actions, dispatch),
        commonActions: bindActionCreators(commonActions, dispatch)
    }
}

export default connect(mapStateToProps, buildActionDispatcher)(maintenancePlanComponent);
