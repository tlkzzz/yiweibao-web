/** 
 * @Description  物资台账
 */
import React from 'react';
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';
import {Link} from 'react-router';
import {filterArrByAttr} from '../../tools';
import actions from '../../actions/material.js';
import {browserHistory} from 'react-router';

import MoreOperations from '../../components/common/more_operations.js';
import DetailsPagination from '../../components/common/details_pagination.js';
import StatusChangeForm from '../../components/common/statusChange.js';

import EamModal from '../../components/common/modal.js';
import Collection from '../../components/common/collection.js';
import Dropdown from '../../components/common/dropdown.js';
import ListTools from '../../components/common/list_tools.js';
import BackList from '../common/back_list';


import {Icon, Checkbox, Modal, Button, Table, Form, Input, Pagination, Menu, message} from 'antd';
const confirm = Modal.confirm;
// const FormItem = Form.Item;


class StoreroomComponent extends React.Component {
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
                title: '库房编号',
                dataIndex: 'storeroomNum',
                key: 'storeroomNum',
                sorter: true,
                render: (text, record, key) => {
                    return (
                        <p><Link className="order-number" activeClassName="active" onClick={() => {
                            this.jumpToDetail(record)
                        }}>{text ? text : '-'}</Link>
                        </p>
                    )
                }
            },
            {
                title: '库房名称',
                dataIndex: 'storeroomName',
                key: 'storeroomName',
                sorter: true,
                render: defaultRender
            },
            {
                title: '科目',
                dataIndex: 'controlacc',
                key: 'controlacc',
                sorter: true,
                render: defaultRender
            },
            {
                title: '负责人名称',
                dataIndex: 'personName',
                key: 'personName',
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

                        <p>{record.status == 'true' ? '活动' : '不活动'}</p>
                    )
                }
            },
            {
                title: '是否设置为缺省库房',
                dataIndex: 'isdefault',
                key: 'isdefault',
                sorter: true,
                render: (text, record, key) => {
                    return (

                        <p><Checkbox checked={text} disabled/></p>
                    )
                }
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
                                    this.showConfirm(record.id, record.storeroomNum)
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
        this.setState({tableLoading: true});
        actions.storeroomGetList(this.param, () => {
            this.setState({tableLoading: false});
        });
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
        actions.storeroomGetList(this.param, () => {
            this.setState({tableLoading: false});
        });
    }
    // 删除物资台账
    del = (id) => {
        const {actions} = this.props;
        let param = {ids: id};
        actions.deleteStoreroom(param, (json) => {
            console.log(json)
            if (json.data) {
                message.success(json.msg);
                const pathname = window.location.pathname;
                const isDetailsPage = pathname.indexOf('detail') !== -1;
                this.getList();
                if (isDetailsPage) {
                    browserHistory.push('/material/storeroom')
                }
            } else {
                message.error(json.msg);
            }
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
        console.log(keywords);
        this.param.word = keywords;
        this.getList();
    }
    //保存库房
    saveStoreroom = () => {
        const {actions} = this.props;
        actions.getFormValues(true);
    }

    // 更多操作
    moreClick = (key, hideCheckBox) => {
        if (key === '0') {
            if (Array.isArray(this.state.selectedRowKeys) && !this.state.selectedRowKeys.length) {
                message.error('请选择要变更状态的数据。')
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
            browserHistory.push('/material/storeroom/');
            browserHistory.push('/material/storeroom/storeroom_detail');
        } else {
            let json = {};
            json.id = record.id;
            localStorage.setItem('item', JSON.stringify(json));
            localStorage.setItem('LIST_PARAM', JSON.stringify(this.param));
            browserHistory.push('/material/storeroom/');
            browserHistory.push(`/material/storeroom/storeroom_detail?id=${record.id}`);
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
            ids: isDetailsPage ? JSON.parse(localStorage.getItem('item')).id : this.state.selectedRowKeys,
            status: values.status,
        }
        actions.updateStoreroomStatus(param, (json) => {
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

    componentWillMount() {
        this.getList();
    }

    render() {

        const {children, state, commonState,location} = this.props;
        const data = state.storeroomListData //*** 拿到请求返回的数据
        const list = data.list;

        const entity = state.storeroomEntity;
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
                    statusData={[{'value': 'true', 'description': '活动'}, {
                        'value': 'false',
                        'description': '不活动'
                    }]}
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
                            <h3>{entity ? entity.storeroomNum : code }</h3>
                            <span className="eam-tag">{entity ? entity.status == 'true' ? '活动' : '不活动' : '' }</span>
                            <p>{entity ? entity.storeroomName : ''}</p>
                        </div>
                        <div className="list-tools-right pull-right">
                            {entity ? <DetailsPagination
                                state={state} // 此模块state
                                listDataName="storeroomListData" // 列表数据state名 -> data = state.workOrderListData
                                localStorageName="item" // onChang 方法内设置的存储名
                                onChange={(record) => {
                                    let json = {};
                                    json.id = record.id;

                                    // *跳转前存相关数据 和列表页跳详情页做同样处理 (这个存储是必要的操作并且必须包含id)
                                    localStorage.setItem('item', JSON.stringify(json));
                                    // *根据自己的模块做跳转
                                    browserHistory.push('/material/')
                                    browserHistory.push(`/material/storeroom/storeroom_detail?id=${record.id}`);
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
                            <Button type="primary" size="large" onClick={this.saveStoreroom}>保存</Button>
                        </div>
                        {entity ? <div className="eam-tab-nav">
                            <Link activeClassName="active"
                                  to={`/material/storeroom/storeroom_detail?id=${entity.id }`}><Icon
                                type="check-circle-o"/> 库房信息</Link>
                            <Link activeClassName="active"
                                  to={`/material/storeroom/storeroom_detail_2?id=${entity.id }`}><Icon
                                type="check-circle-o"/> 物资明细</Link>
                        </div> : <div></div>}
                    </div>
                    {children}
                    {NewStatusChange}
                </div>
            ) :
            (
                <div>
                    <div className="top-bar clearfix">
                        <ListTools
                            title="库房管理"
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
    }
}

export default connect(mapStateToProps, buildActionDispatcher)(StoreroomComponent);
