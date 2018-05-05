/**
 * 系统管理-域管理 
 */
import React from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import actions from '../../actions/system.js';

import SearchInp from '../../components/common/search_inp.js';
import DropdownMenu from '../../components/common/dropdown_menu.js';
import Multiselect from '../../components/common/multiselect.js';
import Collection from '../../components/common/collection.js';
import Dropdown from '../../components/common/dropdown.js';

import { Icon, Checkbox, Modal, Button, Table, Pagination, Menu } from 'antd';
const confirm = Modal.confirm;

class IpComponent extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            modalShow: false,
            currentPage: 1,
            tableLoading: false,
        }

        //高级筛选当前选项dom
        this.seniorFilterHTML = (
            <div className="senior-filter-menu">
                <h2>
                    <span className="pull-right">
                        <Icon type="delete" />
                        清除条件
                    </span>
                    筛选条件
                </h2>
                <div className="senior-filter-inner">
                    <div className="item clearfix">
                        <span className="pull-left">工单状态：</span>
                        <span className="pull-left">待提报、待分派、待验收确认、取消、申请挂起</span>
                    </div>
                    <div className="item clearfix">
                        <span className="pull-left">工程类型：</span>
                        <span className="pull-left">升降系统、消防系统</span>
                    </div>
                    <div className="item clearfix">
                        <span className="pull-left">提报人：</span>
                        <span className="pull-left">王小二、张三、李四</span>
                    </div>
                    <div className="item clearfix">
                        <span className="pull-left">提报时间：</span>
                        <span className="pull-left">2017-05-02 > 2017-05-02</span>
                    </div>
                    <div className="item clearfix">
                        <span className="pull-left">验收时间：</span>
                        <span className="pull-left">2017-05-02 > 2017-05-02</span>
                    </div>
                </div>
            </div>
        );

        // 高级筛选选项数据
        this.seniorFilterSelectArr = [
            ['待提报', '待分派', '待接单', '待汇报', '待验收', '验收待确认', '取消', '关闭', '申请挂起', '挂起'],
            ['升降系统', '消防系统', '暖通系统', '供配电系统', '给排水系统', '物业自用设备', '其他通用设备', '弱电系统', '建筑设施'],
        ];

        //表格多选
        this.rowSelection = {
            onChange: (selectedRowKeys, selectedRows) => {
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
                title: '编号',
                dataIndex: 'domainNum',
                key: 'domainNum',
                sorter: true,
                render: defaultRender
            },
            {
                title: '域描述',
                dataIndex: 'description',
                key: 'description',
                sorter: true,
                render: defaultRender
            },
            {
                title: '类型',
                dataIndex: 'domainType',
                key: 'domainType',
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
                                onChange={arg => {
                                    console.log(arg)
                                }}
                            />
                            <Icon
                                type="delete"
                                onClick={() => {
                                    this.showConfirm(record.domainId, record.domainNum)
                                }}
                            />
                        </div>
                    )
                }
            },
        ];

        //*** 初始化列表参数 需要到处改参数的请求 把参数定义到这里 严禁把参数用state管理 因为参数变化不需要触发render来渲染页面
        this.param = {
            pageNum: 1,
            pageSize: 10,
        }

    }
    // 高级筛选点击
    seniorFilterClick = () => {
        this.setState({ modalShow: true })
        this.dropdownSeniorFilter.hide();
    }
    // 高级筛选弹窗隐藏
    modalHide = () => {
        this.setState({ modalShow: false });
    }
    // 表格事件
    tableChange = (pagination, filters, sorter) => {
        console.log(sorter)
    }
    // 分页事件
    pageChange = (page, pageSize) => {
        this.setState({ currentPage: page });
        this.param.pageNum = page; //*** 需要修改参数 在方法内单独修改
        this.getList();
    }
    // 获取列表数据
    getList = () => {
        const { actions } = this.props;
        this.setState({ tableLoading: true });
        actions.domainGetList(this.param, () => {
            this.setState({ tableLoading: false });
        });
    }
    // 删除域
    del = (id) => {
        const { actions } = this.props;
        let param = {ids: id};
        actions.domainDel(param, (success) => {
            if (success) {

            } else {
                
            }
        });
    }
    showConfirm = (id, text) => {
        confirm({
            title: `删除 ${text}?`,
            okText: '删除',
            onOk: () => {
                this.del(id);
            }
        });
    }
    componentWillMount () {
        this.getList();
    }
    render () {

        const { state } = this.props;
        const data = state.domainListData //*** 拿到请求返回的数据
        const list = data.list;

        return (
            <div>
                <div className="top-bar clearfix">
                    <h2>域管理</h2>
                    <div className="list-tools">
                        <div className="fuzzy-query"><SearchInp /></div>
                        <DropdownMenu
                            overlay={this.seniorFilterHTML}
                            trigger="hover"
                            ref={dropdownSeniorFilter => this.dropdownSeniorFilter = dropdownSeniorFilter}
                        >
                            <div className="senior-filter pull-left">
                                <Icon type="filter" />
                                <span onClick={this.seniorFilterClick}>高级筛选</span>
                            </div>
                        </DropdownMenu>
                        <Checkbox onChange={() => {}}>只显示收藏</Checkbox>
                    </div>
                    <div className="list-tools-right pull-right">
                        <Pagination
                            total={50}
                            className="pull-left"
                            current={this.state.currentPage}
                            onChange={this.pageChange}
                        />
                        <Dropdown
                            overlay={(
                                 <Menu>
                                    <Menu.Item key="0"><Icon type="edit" /> 变更状态</Menu.Item>
                                    <Menu.Item key="1"><Icon type="setting" /> 批量派工</Menu.Item>
                                    <Menu.Divider />
                                    <Menu.Item key="3"><Icon type="delete" /> 批量删除</Menu.Item>
                                </Menu>
                            )}
                            trigger={['click']}
                        >
                            更多操作
                        </Dropdown>
                        <Dropdown
                            overlay={(
                                 <Menu>
                                    <Menu.Item key="0"><Icon type="edit" /> 变更状态</Menu.Item>
                                    <Menu.Item key="1"><Icon type="setting" /> 批量派工</Menu.Item>
                                    <Menu.Divider />
                                    <Menu.Item key="3"><Icon type="delete" /> 批量删除</Menu.Item>
                                </Menu>
                            )}
                            trigger={['click']}
                        >
                            二次封装
                        </Dropdown>
                        <Button type="primary" size="large">新建</Button>
                    </div>
                </div>
                <Modal
                    title="高级筛选"
                    visible={this.state.modalShow}
                    cancelText="重置"
                    width={800}
                    footer={null}
                    onCancel={this.modalHide}
                >
                    <div className="senior-filter-item">
                        <h2>工单状态</h2>
                        <Multiselect activeArr={[true, true]} data={this.seniorFilterSelectArr[0]} />
                    </div>
                    <div className="senior-filter-item">
                        <h2>工单类型</h2>
                        <Multiselect data={this.seniorFilterSelectArr[1]} />
                    </div>
                    <div className="senior-filter-item">
                        <h2>提报人</h2>
                        <div>
                            
                        </div>
                    </div>
                    <div className="modal-footer clearfix">
                        <Button size="large">重置</Button>
                        <Button type="primary" size="large">确定</Button>
                    </div>
                </Modal>
                <div className="eam-content">
                    <div className="eam-content-inner">
                        <Table
                            loading={this.state.tableLoading}
                            rowKey="domainId"
                            pagination={false}
                            dataSource={list} // ***渲染数据
                            columns={this.columns}
                            rowSelection={this.rowSelection}
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


function mapStateToProps (state) {
    return {
        state: state.system
    }
}

function buildActionDispatcher(dispatch) {
    return {
        actions: bindActionCreators(actions, dispatch),
    }
}

export default connect(mapStateToProps, buildActionDispatcher)(IpComponent);