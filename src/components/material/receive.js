/** 
 * @Description  物资台账
 */
import React from 'react';
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';
import {Link, browserHistory} from 'react-router';
import {filterArrByAttr,} from '../../tools';
import actions from '../../actions/material.js';
import MoreOperations from '../../components/common/more_operations.js';
import DetailsPagination from '../../components/common/details_pagination.js';
import StatusChangeForm from '../../components/common/statusChange.js';
import EamModal from '../../components/common/modal.js';
import Dropdown from '../../components/common/dropdown.js';
import ListTools from '../../components/common/list_tools.js';
import BackList from '../common/back_list';
import  commonActions from '../../actions/common.js';
import moment from 'moment';


import {Icon, Checkbox, Modal, Button, Table, Form, Input, Pagination, Menu, message} from 'antd';
const confirm = Modal.confirm;
// const FormItem = Form.Item;


class ReceiveComponent extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            modalShow: false,
            currentPage: 1,
            tableLoading: false,
        }
        //表格多选
        this.rowSelection = {
            onChange: (selectedRowKeys, selectedRows) => {
                this.setState({selectedRows: selectedRows});
                console.log(`selectedRowKeys: ${selectedRowKeys}`, 'selectedRows: ', selectedRows);
            },
            onSelect: (record, selected, selectedRows) => {
                console.log(record, selected, selectedRows);
            },
            onSelectAll: (selected, selectedRows, changeRows) => {
                console.log(selected, selectedRows, changeRows);
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
                title: '接收单编码',
                dataIndex: 'goodsReceiveNum',
                key: 'goodsReceiveNum',
                sorter: true,
                render: (text, record, key) => {
                    return (
                        <p><Link className="order-number" activeClassName="active"
                                 onClick={() => {
                                     this.jumpToDetail(record)
                                 }}>{text ? text : '-'}</Link></p>
                    )
                }
            },
            {
                title: '接收单描述',
                dataIndex: 'description',
                key: 'description',
                sorter: true,
                render: defaultRender
            },
            {
                title: '实际接收人',
                dataIndex: 'receivePerson',
                key: 'receivePerson',
                sorter: true,
                render: defaultRender
            },
            {
                title: '接收日期',
                dataIndex: 'receiveDate',
                key: 'receiveDate',
                sorter: true,
                render: defaultRender
            },
            {
                title: '状态',
                dataIndex: 'status',
                key: 'status',
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
                                    this.showConfirm(record.id, record.goodsReceiveNum)
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

    // 表格事件
    tableChange = (pagination, filters, sorter) => {
        console.log(sorter)
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
        actions.receiveGetList(this.param);
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
        actions.receiveGetList(this.param, () => {
            this.setState({tableLoading: false});
        });
    }

    // 模糊查询
    fuzzyQuery = (keywords) => {
        // console.log(keywords);
        this.param.word = keywords;
        this.getList();
    }

    componentWillMount() {
        this.getList();
        this.getReceiveStatus();
    }


    //物资接受保存
    receiveSave = () => {
        const {actions} = this.props;
        actions.getFormValues(true);
    }

    // 删除
    del = (id) => {
        const {actions} = this.props;
        let param = {ids: id};
        actions.deleteReceive(param, (json) => {
            if (json.success) {
                const pathname = window.location.pathname;
                const isDetailsPage = pathname.indexOf('detail') !== -1;
                this.getList();
                if (isDetailsPage) {
                    browserHistory.push('/material/receive')
                }
            } else {
                message.error(json.msg);
            }
        });
    }

    tableSelectChange = (selectedRowKeys) => {
        this.setState({selectedRowKeys});
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
    // 更多操作
    moreClick = (key, hideCheckBox) => {
        if (key === '0') {
            if (Array.isArray(this.state.selectedRowKeys) && !this.state.selectedRowKeys.length) {
                message.error('请选择要的数据。')
            } else {
                this.statusChangeModal.modalShow();
            }
        }
        if (key === '2') { //批量删除
            this.showConfirm(this.state.selectedRowKeys, hideCheckBox)
        }
    }
    jumpToDetail = (record) => {

        if (record == undefined) {
            browserHistory.push('/material/');
            browserHistory.push('/material/receive/receive_detail');
        } else {
            let json = {};
            json.id = record.id;
            localStorage.setItem('item', JSON.stringify(json));
            localStorage.setItem('LIST_PARAM', JSON.stringify(this.param));
            browserHistory.push('/material/');
            browserHistory.push(`/material/receive/receive_detail?id=${record.id}`);
        }

    }
    detailsMoreClick = (key) => {
        if (key === '0') {
            this.statusChangeModal.modalShow();
        }
        if (key === '2') { // 详情页删除
            const localitem = JSON.parse(localStorage.getItem('item'));
            let id = [];
            id.push(localitem.id)
            this.showConfirm(id, function () {
            })
        }
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
        actions.updateReceiveStatus(param, (json) => {
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
    getReceiveStatus = () => {
        const {commonActions, commonState} = this.props;
        const domainValueParam = {
            orgId: commonState.orgId,
            siteId: commonState.siteId,
            prodId: 'EAM'
        }
        commonActions.getDomainValue(domainValueParam, 'receiveStatus', 'RECEIVE_STATUS');
    }

    render() {

        const {children, state, commonState,location} = this.props;
        const data = state.goodsreceiveListData //*** 拿到请求返回的数据
        const list = data.list;

        const entity = state.receiveEntity;
        const code = commonState.codeEntity;

        const rowSelection = this.state.rowSelection ?
            {
                selectedRowKeys: this.state.selectedRowKeys,
                onChange: this.tableSelectChange,
                getCheckboxProps: record => {

                    let disabled = false;
                    if (this.state.moreOperationsKey === '0')
                        disabled = record.status === '已接收';//
                    return {disabled};
                }
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
                    statusData={commonState.receiveStatusData}
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
                            <h3>{entity ? entity.goodsReceiveNum : code}</h3>
                            <span className="eam-tag">{entity ? entity.statusName : ''}</span>
                            <p>{entity ? entity.description : ''}</p>
                        </div>
                        <div className="list-tools-right pull-right">
                            {entity ? <DetailsPagination
                                state={state} // 此模块state
                                listDataName="goodsreceiveListData" // 列表数据state名 -> data = state.workOrderListData
                                localStorageName="item" // onChang 方法内设置的存储名
                                onChange={(record) => {
                                    let json = {};
                                    json.id = record.id;

                                    // *跳转前存相关数据 和列表页跳详情页做同样处理 (这个存储是必要的操作并且必须包含id)
                                    localStorage.setItem('item', JSON.stringify(json));
                                    // *根据自己的模块做跳转
                                    browserHistory.push('/material/')
                                    browserHistory.push(`/material/receive/receive_detail?id=${record.id}`);
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
                                        {entity.status == 'YJS' ? null :
                                            <Menu.Item key="0"><Icon type="edit"/> 变更状态</Menu.Item>}
                                        <Menu.Item key="2"><Icon type="delete"/> 删除</Menu.Item>
                                    </Menu>
                                )}
                                trigger={['click']}
                            >
                                更多操作
                            </Dropdown> : null}
                            <Button type="primary" size="large" onClick={() => {
                                this.jumpToDetail()
                            }}>新建</Button>
                            <Button type="primary" size="large" onClick={this.receiveSave}>保存</Button>
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
                            title="物资接收"
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

export default connect(mapStateToProps, buildActionDispatcher)(ReceiveComponent);
