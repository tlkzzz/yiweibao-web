/** 
 * @Description 酒店管理
 */
import React from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import actions from '../../actions/index.js';
import { Link, browserHistory } from 'react-router';

import SearchInp from '../../components/common/search_inp.js';
import DropdownMenu from '../../components/common/dropdown_menu.js';
import Multiselect from '../../components/common/multiselect.js';
import Collection from '../../components/common/collection.js'
import Dropdown from '../../components/common/dropdown.js';
import BackList from '../../components/common/back_list.js';
import ListTools from '../common/list_tools';

import { Icon, Checkbox, Modal, Button, Table, Pagination, Menu } from 'antd';

class HotelComponent extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            modalShow: false,
        }
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
                title: '酒店编号',
                dataIndex: 'ip',
                key: 'ip',
                sorter: (a, b) => {
                    if (a.ip > b.ip) {
                        return 1
                    }
                    else if (a.ip < b.ip) {
                        return -1
                    }
                },
                render: (text, record, key) => {
                      return (
                        <p><span className="order-number" onClick={() => { this.jumpToTabPage(record) }}>{text ? text : '-'}</span></p>
                      )
                  }
            },
            {
                title: '酒店名称',
                dataIndex: 'status',
                key: 'status',
                sorter: (a, b) => {
                    a.creater-b.creater
                },
                render: defaultRender
            },
            {
                title: '所在城市',
                dataIndex: 'creater',
                key: 'creater',
                sorter: true,
                render: defaultRender
            },
            {
                title: '详细地址',
                dataIndex: 'createTime',
                key: 'createTime',
                sorter: true,
                render: defaultRender
            },
            {
                title: '星级',
                dataIndex: 'createTimgge',
                key: 'createTimgge',
                sorter: true,
                render: defaultRender
            },
            {
                title: '品牌',
                dataIndex: 'ceateime',
                key: 'ceateime',
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
                                    console.log('执行删除->' + record.id)
                                }}
                            />
                        </div>
                    )
                }
            },
        ];
    }

    jumpToTabPage = (record) => {
        browserHistory.push(`/hotel_management/hotel/hotel_1?${localStorage.hotelId}`);
        localStorage.setItem('hotelId', record.id);
    }
    // 表格事件
    tableChange = (pagination, filters, sorter) => {
        console.log(sorter)
    }
    // 分页事件
    pageChange = (page, pageSize) => {
        this.setState({ currentPage: page });
    }
    render () {
        const { children, state } = this.props;
        // 高级筛选选项数据
        const seniorFilterSelectArr = [
            [],
            [],
        ];
        const dataSource = [
            {
                'ip': 'a',
                'status': '胡彦斌',
                'creater': 32,
                'createTime': '西湖区湖底公园1号'
            },
            {
                'ip': 'b',
                'status': '胡彦祖',
                'creater': 42,
                'createTime': '西湖区湖底公园1号'
            }
        ];
        return children ?
        (
            <div>
                <div className="top-bar clearfix">
                    <div className="details-title pull-left">
                        <h3>AJjksjckjs</h3>
                        <span className="eam-tag">待执行</span>
                        <p>这是工单描述工单描述工单描述工单描述工单描述</p>
                    </div>
                    <div className="list-tools-right pull-right">
                        <BackList />
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
                        <Button size="large">新建</Button>
                        <Button type="primary" size="large">保存</Button>
                    </div>
                </div>
                {children}
            </div>
        ) :
        (
            <div>
                <div className="top-bar clearfix">
                    <ListTools
                        title="酒店管理"
                        conditionList={seniorFilterSelectArr}
                    />
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
                        <Button type="primary" size="large"><Link activeClassName="active" to="/hotel_management/hotel/hotel_1">新建</Link></Button>
                    </div>
                </div>
                <div className="eam-content">
                    <Table
                        loading={this.state.tableLoading}
                        rowKey="id"
                        pagination={false}
                        dataSource={dataSource}
                        columns={ this.columns }
                        rowSelection={this.rowSelection}
                        bordered
                        onChange={this.tableChange}
                    />
                    <Pagination
                        total={50}
                        showSizeChanger
                        showTotal={(total, range) => `当前第${range[0]}-${range[1]}条 / 共${total}条`}
                        current={this.state.currentPage}
                        showQuickJumper
                        onChange={this.pageChange}
                    />
                </div>
            </div>
        )
    }
}


function mapStateToProps (state) {
    return {
        state: state
    }
}

function buildActionDispatcher(dispatch) {
    return {
        actions: bindActionCreators(actions, dispatch),
    }
}

export default connect(mapStateToProps, buildActionDispatcher)(HotelComponent);
