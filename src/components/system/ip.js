/** 
 * @Description 总部事务--Ip管理
 */
import React from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import actions from '../../actions/system.js';
import { Link, browserHistory } from 'react-router';
import PubSub  from 'pubsub-js';
import Dropdown from '../common/dropdown.js';
import SearchInp from '../common/search_inp.js';
import BackList from '../common/back_list.js';
import { runActionsMethod, correspondenceJson } from '../../tools/';
import { pubTopic } from '../../tools/constant';
import { Icon, Checkbox, Modal, Button, Table, Pagination, Menu } from 'antd';

class IpComponent extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            currentPage: 1,
        }

        let defaultRender = (text, record, key) => {
            return (
                <p>{text ? text : '-'}</p>
            )
        };

        //表格字段
        this.columns = [
            {
                title: 'IP地址',
                dataIndex: 'ip',
                key: 'ip',
                sorter: true,
                render: (text, record, key) => {
                      return (
                        <p><span className="order-number" onClick={() => { this.jumpToTabPage(record) }}>{text ? text : '-'}</span></p>
                      )
                  }
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
                dataIndex: 'status',
                key: 'status',
                sorter: true,
                render: (text, record, key) => {
                    return (
                        <p>{text==='Y'?'激活':'未激活'}</p>
                    )
                }
            },
            // {
            //     title: '创建人',
            //     dataIndex: 'creater',
            //     key: 'creater',
            //     sorter: true,
            //     render: defaultRender
            // },
            {
                title: '创建时间',
                dataIndex: 'createDate',
                key: 'createDate',
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
                                type="edit"
                                onClick={() => {
                                    console.log('编辑 ->' + record.id);
                                    this.jumpToTabPage(record);
                                }}
                            />
                            <Icon
                                type="delete"
                                style={{marginLeft:20}}
                                onClick={() => {
                                    console.log('执行删除->' + record.id);
                                    this.delIpList(record.id);
                                }}
                            />
                        </div>
                    )
                }
            },
        ];
        const { commonState } = this.props;
        this.param = {
            orgId: commonState.orgId,
            siteId: commonState.siteId,
            word : '',
            pageNum: 1,
            pageSize: 10,
            productArray:['EAM']
        }
        this.delIpIds=[];
        //保存后刷新列表
        PubSub.subscribe(pubTopic.system.IP_LIST_REFRESH, this.getIpList );
    }

    jumpToTabPage = (record) => {
        browserHistory.push(`/system/ip/ip_1`);
        PubSub.publish(pubTopic.system.IP_DETAIL, record.id );
        localStorage.setItem('ipId', record.id);
    }

    //表格多选或全选
    rowSelection = {
    onChange: (selectedRowKeys, selectedRows) => {
        console.log(`selectedRowKeys: ${selectedRowKeys}`, 'selectedRows: ', selectedRows,this);
        this.delIpIds=selectedRows;
    },
};
    // 表格事件
    tableChange = (pagination, filters, sorter) => {
        if (sorter.order) {
            let sorterOrder = sorter.order;
            let endIndex = sorterOrder.indexOf('end');
            sorterOrder = sorterOrder.slice(0, endIndex);
            this.param.sorts = `${sorter.field}`;
            this.param.order = `${sorterOrder}`;
        } else {
            this.param.sorts = '';
            this.param.order = 'desc';
        }
        this.getIpList();
    }
    // 分页事件
    pageChange = (page, pageSize) => {
        this.setState({ currentPage: page });
        this.param.pageNum = page;
        this.getIpList();
    }
//获取IP列表
    getIpList=()=>{
        const { actions } = this.props;
        this.setState({ tableLoading: true });
        actions.ipGetList(this.param, () => {
            this.setState({ tableLoading: false });
        });
    }
    //操作单条删除IP
    delIpList=(recordId)=>{
        const { actions } = this.props;
        this.setState({ tableLoading: true });
        actions.ipDelete({ids:recordId}, () => {
            this.setState({ tableLoading: false });
            this.getIpList();
        });
    };
    //多选删除
    delSelectMultipleIp=(item,key,keypath)=>{
        let ids=[];
        this.delIpIds.forEach(function (val,index,array) {
            ids.push(val.id)
        });
        this.delIpList(ids);
    };


    //保存IP
    saveIp=()=>{
        PubSub.publish(pubTopic.system.IP_DETAIL, 'IP_SAVE' );
    };
    //重置FORM
    resetForm=()=>{
        // console.log("-----save ip------",this.props);
        PubSub.publish(pubTopic.system.IP_DETAIL, 'IP_RESET' );
    };
    // 模糊查询
    fuzzyQuery = (keywords,props) => {
        this.param.word = keywords;
        this.getIpList();
    }
    componentWillMount () {
        this.getIpList();
    }
    render () {
        const { children, state,location } = this.props;
        const data=state.system.ipListData;
        const dataSource=data.list;
        return children ?
            (
                <div>
                    <div className="top-bar clearfix">
                        <div className="details-title pull-left">
                            <h3>IP管理</h3>
                            {/*<span className="eam-tag">待执行</span>*/}
                            {/*<p>这是工单描述工单描述工单描述工单描述工单描述</p>*/}
                        </div>
                        <div className="list-tools-right pull-right">
                            <BackList location={location} />
                            {/*<Button type="primary" size="large" onClick={this.resetForm}>重置</Button>*/}
                            <Button type="primary" size="large" onClick={this.saveIp}>保存</Button>
                        </div>
                    </div>
                    {children}
                </div>
            ) :(
            <div>
                <div className="top-bar clearfix">
                    <div className="details-title pull-left">
                        <h3>IP管理</h3>
                        <div className="fuzzy-query"><SearchInp  onEnter={(text) => {
                            this.fuzzyQuery(text,this.props)
                        }}/></div>
                        <p></p>
                    </div>
                    <div className="list-tools-right pull-right">
                        <Pagination
                            total={data.total}
                            className="pull-left"
                            current={this.state.currentPage}
                            onChange={this.pageChange}
                        />
                        <Dropdown
                            overlay={(
                                 <Menu onClick={this.delSelectMultipleIp}>
                                    {/*<Menu.Item key="0"><Icon type="edit" /> 变更状态</Menu.Item>*/}
                                    {/*<Menu.Item key="1"><Icon type="setting" /> 批量派工</Menu.Item>*/}
                                    {/*<Menu.Divider />*/}
                                    <Menu.Item key="3" ><Icon type="delete"  /> 批量删除</Menu.Item>
                                </Menu>
                            )}
                            trigger={['click']}
                        >
                            更多操作
                        </Dropdown>
                        <Button type="primary" size="large"><Link activeClassName="active" to="/system/ip/ip_1">新建</Link></Button>
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
                        total={data.total}
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
        state: state,
        commonState: state.common,
    }
}

function buildActionDispatcher(dispatch) {
    return {
        actions: bindActionCreators(actions, dispatch),
    }
}

export default connect(mapStateToProps, buildActionDispatcher)(IpComponent);
