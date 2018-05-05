/** 
 * @Description  钥匙申请单
 */
import React from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { Link } from 'react-router';
import actions from '../../actions/material.js';

import BackList from '../common/back_list';
import Collection from '../../components/common/collection.js';
import Dropdown from '../../components/common/dropdown.js';
import ListTools from '../../components/common/list_tools.js';


import { Icon, Checkbox, Modal, Button, Table, Form, Input, Pagination, Menu, message} from 'antd';
const confirm = Modal.confirm;


class ApplicationComponent extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            currentPage: 1,
            tableLoading: false,
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
                title: '申请编码',
                dataIndex: 'itemNum',
                key: 'itemNum',
                sorter: true,
                render: (text, record, key) => {
                    return (
                        <p><Link className="order-number" activeClassName="active" to="/key/application/application_detail">{text ? text : '-'}</Link></p>
                    )
                }
            },
            {
                title: '申请事由',
                dataIndex: 'itemName',
                key: 'itemName',
                sorter: true,
                render: defaultRender
            },
            {
                title: '申请类别',
                dataIndex: 'status',
                key: 'status',
                sorter: true,
                render:defaultRender
            },
            {
                title: '申请部门',
                dataIndex: 'storeroomName',
                key: 'storeroomName',
                sorter: true,
                render: defaultRender
            },
            {
                title: '申请',
                dataIndex: 'sta',
                key: 'sta',
                sorter: true,
                render:defaultRender
            },
            {
                title: '申请日期',
                dataIndex: 'storeroom',
                key: 'storeroom',
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
        actions.inventoryGetList(this.param, () => {
            this.setState({ tableLoading: false });
        });
    }
    // 模糊查询
    fuzzyQuery = (keywords) => {
        console.log(keywords) ;
        this.param.word = keywords;
        this.getList();
    }
    componentWillMount () {
        this.getList();
    }
    render () {

        const { children , state } = this.props;

        const data = state.inventoryListData; //*** 拿到请求返回的数据
        const list = data.list||[];

        // 高级筛选选项数据
        const seniorFilterSelectArr = [
            [],
            [],
        ];

        return children ?
            (
              <div>
                  <div className="top-bar clearfix">
                      <div className="details-title pull-left">
                          <h3>ZHRMGHG-12115</h3>
                          <span className="eam-tag">活动</span>
                          <p>这是描述</p>
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
                            title="钥匙申请单"
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
                            <Dropdown
                                overlay={(
                                    <Menu >
                                        <Menu.Item key="0" ><Icon type="edit"   /> 变更状态</Menu.Item>
                                        <Menu.Item key="3" ><Icon type="delete" /> 批量删除</Menu.Item>
                                        <Menu.Item key="1"><Icon type="setting" /> 导出Excel</Menu.Item>
                                    </Menu>
                                )}
                                trigger={['click']}
                            >
                                更多操作
                            </Dropdown>
                            <Button type="primary" size="large"><Link activeClassName="active" to="/key/application/application_detail">新建</Link></Button>
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
                                rowSelection={this.rowSelection}
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
                </div>
            )
    }
}


function mapStateToProps (state) {
    return {
        state: state.material
    }
}

function buildActionDispatcher(dispatch) {
    return {
        actions: bindActionCreators(actions, dispatch),
    }
}

export default connect(mapStateToProps, buildActionDispatcher)(ApplicationComponent);
