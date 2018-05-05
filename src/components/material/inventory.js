/** 
 * @Description  物资库存
 */
import React from 'react';
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';
import {filterArrByAttr} from '../../tools';
import {Link, browserHistory} from 'react-router';
import actions from '../../actions/material.js';
import MoreOperations from '../../components/common/more_operations.js';
import DetailsPagination from '../../components/common/details_pagination.js';
import StatusChangeForm from '../../components/common/statusChange.js';
import EamModal from '../../components/common/modal.js';
import BackList from '../common/back_list';
import Collection from '../../components/common/collection.js';
import Dropdown from '../../components/common/dropdown.js';
import ListTools from '../../components/common/list_tools.js';
import commonActions from '../../actions/common.js';


import {Icon, Checkbox, Modal, Button, Table, Form, Input, Pagination, Menu, message} from 'antd';
const confirm = Modal.confirm;


class InventoryComponent extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            modalShow: false,
            currentPage: 1,
            tableLoading: false,
        }

        //表格多选
        // this.rowSelection = {
        //     onChange: (selectedRowKeys, selectedRows) => {
        //         this.setState({selectedRows: selectedRows});
        //         console.log(`selectedRowKeys: ${selectedRowKeys}`, 'selectedRows: ', selectedRows);
        //     },
        //     onSelect: (record, selected, selectedRows) => {
        //         console.log(record, selected, selectedRows);
        //     },
        //     onSelectAll: (selected, selectedRows, changeRows) => {
        //         console.log(selected, selectedRows, changeRows);
        //     },
        // };

        let defaultRender = (text, record, key) => {
            return (
                <p>{text ? text : '-'}</p>
            )
        };


        //表格字段
        this.columns = [
            {
                title: '物资编码',
                dataIndex: 'itemNum',
                key: 'itemNum',
                sorter: true,
                render: (text, record, key) => {
                    return (
                        <p><Link className="order-number" activeClassName="active" onClick={() => {
                            this.jumpToDetail(record)
                        }}>{text ? text : '-'}</Link></p>
                    )
                }
            },
            {
                title: '物资名称',
                dataIndex: 'itemName',
                key: 'itemName',
                sorter: true,
                render: defaultRender
            },
            {
                title: '库房名称',
                dataIndex: 'storeroomName',
                key: 'storeroomName',
                sorter: true,
                render: defaultRender
            },
            {
                title: '当前余量',
                dataIndex: 'currentBalance',
                key: 'currentBalance',
                sorter: true,
                render: defaultRender
            },
            {
                title: '订购单位',
                dataIndex: 'orderUnitName',
                key: 'orderUnitName',
                sorter: true,
                render: defaultRender
            },
            {
                title: '是否周转',
                dataIndex: 'isTurnOver',
                key: 'isTurnOver',
                sorter: true,
                render: (text, record, key) => {
                    return (

                        <p><Checkbox checked={text} disabled/></p>
                    )
                }
            },
            {
                title: '状态',
                dataIndex: 'statusName',
                key: 'statusName',
                sorter: true,
                render: defaultRender
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

    jumpToDetail = (record) => {

        if (record == undefined) {
            browserHistory.push('/material/inventory/');
            browserHistory.push('/material/inventory/inventory_detail');
        } else {
            let json = {};
            json.id = record.id;
            localStorage.setItem('item', JSON.stringify(json));
            localStorage.setItem('LIST_PARAM', JSON.stringify(this.param));
            browserHistory.push('/material/inventory/');
            browserHistory.push(`/material/inventory/inventory_detail?id=${record.id}`);
        }

    }

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
        actions.inventoryGetList(this.param);
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
        actions.inventoryGetList(this.param, () => {
            this.setState({tableLoading: false});
        });
    }
    // 删除物资库存
    // del = (id) => {
    //     const { actions } = this.props;
    //     let param = {ids: id};
    //     actions.deleteInventory(param, (json) => {
    //         console.log(json);
    //         if (json.data) {
    //             message.success(json.msg);
    //             this.getList();
    //         } else {
    //             message.error(json.msg);
    //         }
    //     });
    // }


    //批量删除
    // batchDel=()=>{
    //     const { actions } = this.props;
    //     const selectedRows = this.state.selectedRows;
    //     const param={
    //         ids: filterArrByAttr(selectedRows,'id').join(',')
    //     }
    //     actions.deleteInventory(param, (json) => {
    //         if (json.success) {
    //             message.success(json.msg);
    //             this.getList();
    //         } else {
    //             message.error(json.msg);
    //         }
    //     });
    // }

    // 修改
    update = (id) => {
        const {actions} = this.props;

        let param = {ids: id};
        actions.energyPriceUpdate(param, (success) => {
            if (success) {

            } else {

            }
        });
    }


    // //删除确认框
    // showConfirm = (id, text) => {
    //     confirm({
    //         title: `删除 ${text}?`,
    //         okText: '删除',
    //         onOk: () => {
    //             this.del(id);
    //         }
    //     });
    // }
    // 模糊查询
    fuzzyQuery = (keywords) => {
        console.log(keywords);
        this.param.word = keywords;
        this.getList();
    }

    //保存修改  根据id判断
    inventorysave = () => {
        const {actions, location} = this.props;
        actions.getFormValues(true);

    }
    // 更多操作
    moreClick = (key, hideCheckBox) => {
        if (key === '0') {
            if (Array.isArray(this.state.selectedRowKeys) && !this.state.selectedRowKeys.length) {
                message.error('请选择要删除的数据。')
            } else {
                this.statusChangeModal.modalShow();
            }
        }
    }

    componentWillMount() {
        this.getList();
        this.getInventoryStatus() ;
    }

    getInventoryStatus = () => {
        const {commonActions, commonState} = this.props;
        const domainValueParam = {
            orgId: commonState.orgId,
            siteId: commonState.siteId,
            prodId: 'EAM'
        }
        commonActions.getDomainValue(domainValueParam, 'inventoryStatus', 'INVENTORY_STATUS');
    }

    detailsMoreClick = (key) => {
        if (key === '0') {
            this.statusChangeModal.modalShow();
        }
    }
    tableSelectChange = (selectedRowKeys) => {
        this.setState({selectedRowKeys});
    }
    statusChange = () => {
        const {actions} = this.props;
        const values = this.statusChangeForm.props.form.getFieldsValue();
        const pathname = window.location.pathname;
        const isDetailsPage = pathname.indexOf('detail') !== -1;

        let param = {
            id:  isDetailsPage ? JSON.parse(localStorage.getItem('item')).id : this.state.selectedRowKeys,
            status: values.status,
        }
        actions.updateInventoryStatus(param, (json) => {
            if (json.success) {
                if (isDetailsPage) {
                    this.statusChangeModal.modalHide();
                    const localitem = JSON.parse(localStorage.getItem('item'));
                    this.jumpToDetail(localitem);
                } else {
                    this.statusChangeModal.modalHide();
                    this.setState({selectedRowKeys: []});
                    this.listMoreOperations.cancel();
                    this.getList();
                }
            } else {
                message.error(json.msg);
            }
        });

    }

    render() {

        const {children, state, commonState,location} = this.props;

        const data = state.inventoryListData; //*** 拿到请求返回的数据
        const list = data.list || [];

        const entity = state.inventoryEntity;

        const code = commonState.codeEntity;

        const rowSelection = this.state.rowSelection ?
            {
                selectedRowKeys: this.state.selectedRowKeys,
                onChange: this.tableSelectChange,
                // getCheckboxProps: record => ({
                //     disabled: this.state.moreOperationsKey === '2' ? record.status !== 'DTB' : false, // 批量删除 不是待提报 全部disable
                // })
            } :
            null;


        // 高级筛选选项数据
        const seniorFilterSelectArr = [
            [],
            [],
        ];


        const NewStatusChange = (
            <EamModal
                title="变更状态"
                ref={statusChangeModal => this.statusChangeModal = statusChangeModal}
            >
                <StatusChangeForm
                    statusData={commonState.inventoryStatusData}
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
                            <h3>{entity ? entity.itemNum : '新建物资库存'}</h3>
                            <span className="eam-tag">{entity ? entity.statusName : ''}</span>
                            <p>{entity ? entity.itemName : ''}</p>
                        </div>
                        <div className="list-tools-right pull-right">
                            {entity ? <DetailsPagination
                                state={state} // 此模块state
                                listDataName="inventoryListData" // 列表数据state名 -> data = state.workOrderListData
                                localStorageName="item" // onChang 方法内设置的存储名
                                onChange={(record) => {
                                    let json = {};
                                    json.id = record.id;

                                    // *跳转前存相关数据 和列表页跳详情页做同样处理 (这个存储是必要的操作并且必须包含id)
                                    localStorage.setItem('item', JSON.stringify(json));
                                    // *根据自己的模块做跳转
                                    browserHistory.push('/material/')
                                    browserHistory.push(`/material/inventory/inventory_detail?id=${record.id}`);
                                }}
                                getList={(pageNum, cb) => {
                                    // *分页是根据列表页数据切换数据 本业列表数据用完 这里请求上|下一页数据
                                    // *列表页跳详情页必须本地存储列表页请求数据参数 全局统一用LIST_PARAM 防止详情页刷新请求的数据与列表跳详情的数据不一致
                                    this.param = JSON.parse(localStorage.getItem('LIST_PARAM'));
                                    if (pageNum) this.param.pageNum = pageNum;
                                    this.getList(cb);
                                }}
                            /> : null }
                            <BackList location={location} />
                            {entity ? <Dropdown
                                overlay={(
                                    <Menu onClick={(e) => {
                                        this.detailsMoreClick(e.key)
                                    }}>

                                        <Menu.Item key="0"><Icon type="edit"/> 变更状态</Menu.Item>
                                    </Menu>
                                )}
                                trigger={['click']}
                            >
                                更多操作
                            </Dropdown> : null}
                            <Button type="primary" size="large" onClick={() => {
                                this.jumpToDetail()
                            }}>新建</Button>
                            <Button type="primary" size="large" onClick={this.inventorysave}>保存</Button>
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
                            title="物资库存"
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
                                this.jumpToDetail()
                            }}>新建</Button>
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
        state: state.material,
        commonState: state.common
    }
}

function buildActionDispatcher(dispatch) {
    return {
        actions: bindActionCreators(actions, dispatch),
        commonActions: bindActionCreators(commonActions, dispatch),
    }
}

export default connect(mapStateToProps, buildActionDispatcher)(InventoryComponent);
