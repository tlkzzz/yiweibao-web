/**
 * @Description  抄表管理
 */
import React from 'react';
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';
import {Link, browserHistory} from 'react-router';
import {filterArrByAttr} from '../../tools';
import actions from '../../actions/daily.js';
import  commonActions from '../../actions/common.js';

import EamModal from '../../components/common/modal.js';
import Collection from '../../components/common/collection.js';
import Dropdown from '../../components/common/dropdown.js';
import BackList from '../../components/common/back_list.js';
import ListTools from '../../components/common/list_tools.js';

import StatusChangeForm from '../../components/common/statusChange.js';
import MoreOperations from '../../components/common/more_operations.js';

import {Icon, Checkbox, Modal, Button, Table, Form, Input, Pagination, Menu, message} from 'antd';
const confirm = Modal.confirm;
// const FormItem = Form.Item;

class copymeterComponent extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            modalShow: false,
            currentPage: 1,
            tableLoading: false,
            selectedRowKeys:[],
        }

        //表格多选
        this.rowSelection = {
            onChange: (selectedRowKeys, selectedRows) => {
                this.setState({selectedRowKeys: selectedRowKeys});
                console.log(`selectedRowKeys: ${selectedRowKeys}`);
            },
            onSelect: (record, selected, selectedRows) => {
                console.log(record, selected, selectedRows);
            },
            onSelectAll: (selected, selectedRows, changeRows) => {
                // console.log(selected, selectedRows, changeRows);
            },
        };

        let defaultRender = (text, record, key) => {
            return (
                <p>{text ? text : '-'}</p>
            )
        };

        //表格字段
        this.columns = [
            {
                title: '抄表编码',
                dataIndex: 'copyMeterNum',
                key: 'copyMeterNum',
                sorter: true,
                render: (text, record, key) => {
                    return (
                        <p><Link className="order-number" activeClassName="active"
                                 to={`/daily/copymeter/copymeter_detail?id=${record.id}`}>{text ? text : '-'}</Link></p>
                    )
                }
            },
            {
                title: '抄表描述',
                width: '15%',
                dataIndex: 'description',
                key: 'description',
                sorter: true,
                render: defaultRender
            },
            {
                title: '位置描述',
                width: '15%',
                dataIndex: 'locationDescription',
                key: 'locationDescription',
                sorter: true,
                render: defaultRender
            },
            {
                title: '仪表种类',
                dataIndex: 'copyMeterTypeName',
                key: 'copyMeterTypeName',
                sorter: true,
                render: defaultRender
            },
            {
                title: '能耗分类',
                dataIndex: 'energyConsumptionType',
                key: 'energyConsumptionType',
                sorter: true,
                render: defaultRender
            },
            {
                title: '状态',
                dataIndex: 'status',
                key: 'status',
                sorter: true,
                render: (text, record, key) => {
                    return (

                        <p>{record.status ? '活动' : '不活动'}</p>
                    )
                }
            },
            {
                title: '抄表时间',
                dataIndex: 'copyMeterDate',
                key: 'copyMeterDate',
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
                            {/*<Collection*/}
                            {/*onChange={arg => {*/}
                            {/*console.log(arg)*/}
                            {/*}}*/}
                            {/*/>*/}
                            <Icon
                                type="delete"
                                onClick={() => {
                                    this.showConfirm(record.id, record.copyMeterNum)
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
            pageNum: 1,
            pageSize: 10,
            siteId: commonState.siteId,
            orgId: commonState.orgId,

        }

    }

    tableSelectChange = (selectedRowKeys) => {
        this.setState({ selectedRowKeys });
    };
    // 表格事件
    tableChange = (pagination, filters, sorter) => {
        const {actions} = this.props;
        // console.log(sorter)
        if (sorter.order) {
            let sorterOrder = sorter.order;
            let endIndex = sorterOrder.indexOf('end');
            sorterOrder = sorterOrder.slice(0, endIndex);
            this.param.sorts = `${sorter.field} ${sorterOrder}`;
        } else {
            this.param.sorts = '';
        }
        actions.copyMeterGetList(this.param);
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
        actions.copyMeterGetList(this.param, () => {
            this.setState({tableLoading: false});
        });
    }
    // 删除抄表管理
    del = (id) => {
        const {actions} = this.props;
        let param = {ids: id};
        actions.deleteCopyMeter(param, (json) => {
            if (json.success) {
                message.success(json.msg);
                this.getList();
            } else {
                message.error(json.msg);
            }
        });
    }

    batchDel = () => {
        const {actions} = this.props;
        const selectedRows = this.state.selectedRowKeys;
        const param = {
            ids: selectedRows
        }
        actions.deleteCopyMeter(param, (json) => {
            if (json.data) {
                message.success(json.msg);
                this.getList();
            } else {
                message.error(json.msg);
            }
        });
        this.setState({
            selectedRowKeys: []
        })
    }

    //删除确认框
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
        console.log(keywords);
        this.param.keyword = keywords;
        this.getList();
    }
    // 更多操作
    moreClick = (key, hideCheckBox) => {
        if (key === '0') { // 变更状态
            if (!this.state.selectedRowKeys.length) {
                message.error('请选择');
            } else {
                this.statusChangeModal.modalShow();
            }
        }
        if (key === '2') { //批量删除

            this.showConfirm(this.state.selectedRowKeys, hideCheckBox)
        }
    };
// 保存
    copyMeterSaveHandle = () => {
        const {actions} = this.props;
        actions.getFormValues(true);
    }


    componentWillMount() {
        this.getList();
        this.getCopyMeterStatus();
    }

    statusChange = () => {

        const {actions} = this.props;
        const values = this.statusChangeForm.props.form.getFieldsValue();
        const pathname = window.location.pathname;
        const isDetailsPage = pathname.indexOf('detail') !== -1;

        let param = {
            ids: isDetailsPage ? JSON.parse(localStorage.getItem('item')).id : this.state.selectedRowKeys,
            status: values.status,
        }
        actions.copyMeterUpdateStatus(param, (json) => {
            if (json.success) {

                if (isDetailsPage) {
                    this.statusChangeModal.modalHide();
                    const localitem = JSON.parse(localStorage.getItem('item'));
                    this.jumpToDetail(localitem);
                } else {
                    this.setState({selectedRowKeys: []});
                    this.listMoreOperations.cancel();
                    this.getList();
                    this.statusChangeModal.modalHide();
                }
            } else {
                message.error(json.msg);
            }
        });
    }
    getCopyMeterStatus = () => {
        const {commonActions, commonState} = this.props;
        const domainValueParam = {
            orgId: commonState.orgId,
            siteId: commonState.siteId,
            prodId: 'EAM'
        }
        commonActions.getDomainValue(domainValueParam, 'receiveStatus', 'RECEIVE_STATUS');
        // commonActions.getDomainValue(domainValueParam, 'copymeterStatusData', 'COPY_METER_STATUS');
    }
    render() {

        const {children, state, commonState,location} = this.props;
        const data = state.copymeterListData || [];//*** 拿到请求返回的数据
        const list = data.list;

        const entity = state.copymeterEntity;
        const code = commonState.codeEntity;
        const rowSelection = this.state.rowSelection ?
            {
                selectedRowKeys: this.state.selectedRowKeys,
                onChange: this.tableSelectChange,
            } :
            null;
        // 高级筛选选项数据
        const seniorFilterSelectArr = [
            [],
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
                    statusData={commonState.receiveStatusData}
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
                            <h3>{entity ? entity.copyMeterNum : code }</h3>
                            <span className="eam-tag">{entity ? entity.status ? '活动' : '不活动' : '' }</span>
                            <p>{entity ? entity.description : '' }</p>
                        </div>
                        <div className="list-tools-right pull-right">
                            <BackList location={location}/>
                            {/*<Dropdown*/}
                            {/*overlay={(*/}
                            {/*<Menu>*/}
                            {/*<Menu.Item key="0"><Icon type="edit" /> 变更状态</Menu.Item>*/}
                            {/*<Menu.Item key="1"><Icon type="setting" /> 批量派工</Menu.Item>*/}
                            {/*<Menu.Divider />*/}
                            {/*<Menu.Item key="3"><Icon type="delete" /> 批量删除</Menu.Item>*/}
                            {/*</Menu>*/}
                            {/*)}*/}
                            {/*trigger={['click']}*/}
                            {/*>*/}
                            {/*更多操作*/}
                            {/*</Dropdown>*/}
                            {/*<Button size="large">新建</Button>*/}
                            <Button type="primary" size="large" onClick={this.copyMeterSaveHandle}>保存</Button>
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
                            title="抄表管理"
                            onEnter={(text) => {
                                this.fuzzyQuery(text);
                            }}
                            conditionList={seniorFilterSelectArr}
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
                            <Button type="primary" size="large"><Link activeClassName="active"
                                                                      to={`/daily/copymeter/copymeter_detail`}>新建</Link></Button>
                        </div>
                    </div>
                    <div className="eam-content">
                        <div className="eam-content-inner">
                            <Table
                                loading={this.state.tableLoading}
                                rowKey="id"
                                pagination={false}
                                dataSource={list} // ***渲染数据
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
                                showSizeChanger
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
        state: state.daily,
        commonState: state.common
    }
}

function buildActionDispatcher(dispatch) {
    return {
        actions: bindActionCreators(actions, dispatch),
        commonActions: bindActionCreators(commonActions, dispatch),
    }
}

export default connect(mapStateToProps, buildActionDispatcher)(copymeterComponent);
