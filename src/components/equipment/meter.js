/** 
 * @Description 仪表台账
 */
import React from 'react';
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';
import {Link, browserHistory} from 'react-router';

import commonActions from '../../actions/common.js';
import actions from '../../actions/environmental.js';
import equactions from '../../actions/equipment.js';

import SearchInp from '../../components/common/search_inp.js';
import DropdownMenu from '../../components/common/dropdown_menu.js';
import Multiselect from '../../components/common/multiselect.js';
import BackList from '../../components/common/back_list.js';
import Collection from '../../components/common/collection.js';
import Dropdown from '../../components/common/dropdown.js';
import AsideTree from '../common/aside_tree';
import ListTools from '../common/list_tools';

import {Icon, Checkbox, Modal, Tabs, Button, Table, Pagination, Menu, Tree} from 'antd';
const confirm = Modal.confirm;
const TreeNode = Tree.TreeNode;
const TabPane = Tabs.TabPane;

class MeterComponent extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            modalShow: false,
            currentPage: 1,
            tableLoading: false,
            treeLoading: false,
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
                title: '仪表编码',
                dataIndex: 'code',
                key: 'code',
                render: (text, record, key) => {
                    return (
                        <p><span className="order-number" onClick={() => {
                            this.jumpToTabPage(record)
                        }}>{text ? text : '-'}</span></p>
                    )
                }
            },
            {
                title: '仪表类型',
                dataIndex: 'name',
                key: 'name',
                render: defaultRender
            },
            {
                title: '仪表位置',
                dataIndex: 'locationName',
                key: 'locationName',
                render: defaultRender
            },
            {
                title: '是否生成二维码',
                dataIndex: '',
                key: '',
                render: (text, record, key) => {
                    return (
                        <p><Checkbox /></p>
                    )
                }
            },
            {
                title: '状态',
                dataIndex: 'status',
                key: 'status',
                render: defaultRender
            },
            {
                title: '创建时间',
                dataIndex: 'startDate',
                key: 'startDate',
                render: defaultRender
            },
        ];

        //*** 初始化列表参数 需要到处改参数的请求 把参数定义到这里 严禁把参数用state管理 因为参数变化不需要触发render来渲染页面
        const {commonState} = this.props;
        this.param = {
            // orgId: 'e0bc74c4f58611e58c2d507b9d28ddca',//commonState.orgId,//'e0bc74c4f58611e58c2d507b9d28ddca',
            // siteId: '8aaf4fb85474172c01547990053f00be',//commonState.siteId,
            productArray: ['e4eca0c036f111e7afa90242ac110005'],
            orgId: commonState.orgId,
            siteId: commonState.siteId,
            pageNum: 1,
            pageSize: 10,
            // productArray: commonState.productArray,
        }

        this.treeParam = {
            parentId: 'ea9a6ad4662d11e79308aaf2bfe747ac',
            orgId: commonState.orgId,
        }

    }

    jumpToTabPage = (record) => {
        browserHistory.push(`/equipment/meter/meter_1?${localStorage.meterId}`);
        localStorage.setItem('meterId', record.id);
    }

    jumpToTabDetail = () => {
        localStorage.removeItem('meterId');
        browserHistory.push(`/equipment/meter/meter_1`);
    }
    // 表格事件
    tableChange = (pagination, filters, sorter) => {
        console.log(sorter)
    }
    // 分页事件
    pageChange = (page, pageSize) => {
        this.setState({currentPage: page});
        this.param.pageNum = page; //*** 需要修改参数 在方法内单独修改
        this.getList();
    }

    getList = () => {
        const {actions} = this.props;
        this.param.classificationIds = ['1360cd2492c711e78d22f01faf517e53', '1a7b84cb92c711e78d22f01faf517e53', '1e554c0592c711e78d22f01faf517e53']
        this.setState({tableLoading: true});
        actions.environmentAssetGetList(this.param, () => {
            this.setState({tableLoading: false});
        });
    }


// 保存 根据id的值判断添加和修改
    add = () => {
        const {equactions} = this.props;
        equactions.getFormValues(true);
    }

    componentDidMount() {
        this.getList();
    }

    render() {

        const {eqvState, equstate, children, commonState,location} = this.props;
        const data = eqvState.environmentAssetListData || {};
        const list = data.data;
        // 高级筛选选项数据

        const entity = equstate.meterEntity;
        const code = commonState.codeEntity;

        const seniorFilterSelectArr = [
            [],
            [],
        ];

        return children ?
            (
                <div>
                    <div className="top-bar clearfix">
                        <div className="details-title pull-left">
                            <h3>{entity ? entity.code : code}</h3>
                            <span className="eam-tag">{entity ? entity.status : ''}</span>
                            <p></p>
                        </div>
                        <div className="list-tools-right pull-right">
                            <BackList location={location} />
                            <Button size="large" onClick={this.add}>保存</Button>
                        </div>
                        <div className="eam-tab-nav">
                            {entity ? <div><Link activeClassName="active"
                                                 to={`/equipment/meter/meter_1?id=${localStorage.meterId}`}><Icon
                                type="check-circle-o"/> 仪表信息</Link>
                                < Link activeClassName="active"
                                       to={`/equipment/meter/meter_2?id=${localStorage.meterId}`}><Icon
                                    type="check-circle-o"/> 抄表信息</Link></div> : <div></div>}
                        </div>
                    </div>
                    {children}
                </div>
            ) :
            (
                <div>
                    <div className="top-bar clearfix">
                        <ListTools
                            title="仪表台账"

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
                            <Button type="primary" size="large">批量删除</Button>
                            <Button type="primary" size="large" onClick={ this.jumpToTabDetail }>新建</Button>
                        </div>
                    </div>
                    <div className="eam-content">
                        <div className="eam-content-inner">
                            <div className="eam-side-left">

                                <AsideTree
                                    data={
                                        [
                                            {
                                                name: '位置体系',
                                                key: 'locations',
                                                param: {
                                                    orgId: commonState.orgId,//'e0bc74c4f58611e58c2d507b9d28ddca',//orgId: 'e0bc74c4f58611e58c2d507b9d28ddca',//
                                                    siteId: commonState.siteId, //siteId: '8aaf4fb85474172c01547990053f00be'
                                                    productArray: ['e4eca0c036f111e7afa90242ac110005'],//commonState.productArray,
                                                },
                                                actionsMethod: 'locationsGetTree',
                                                data: 'locationsTreeData',
                                            }
                                        ]
                                    }
                                    onSelect={(id, key) => {
                                        this.param.locationId = id;
                                        this.getList();
                                    }}
                                />
                            </div>
                            <div className="eam-main-right">
                                <Table
                                    loading={this.state.tableLoading}
                                    rowKey="id"
                                    pagination={false}
                                    dataSource={list}
                                    columns={ this.columns }
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
                </div>
            )
    }
}


function mapStateToProps(state) {
    return {
        commonState: state.common,
        equstate: state.equipment,
        eqvState: state.environmental

    }
}

function buildActionDispatcher(dispatch) {
    return {
        commonActions: bindActionCreators(commonActions, dispatch),
        equactions: bindActionCreators(equactions, dispatch),
        actions: bindActionCreators(actions, dispatch),
    }
}

export default connect(mapStateToProps, buildActionDispatcher)(MeterComponent);
