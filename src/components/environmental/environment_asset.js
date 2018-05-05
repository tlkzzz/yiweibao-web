/**
 * 环境监测-设备台账 
 */
import React from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import actions from '../../actions/environmental.js';
import { Link } from 'react-router';
import BackList from '../../components/common/back_list.js';

import Multiselect from '../../components/common/multiselect.js';
import Collection from '../../components/common/collection.js';
import AsideTree from '../../components/common/aside_tree.js';
import ListTools from '../common/list_tools';
import { Icon, Checkbox, Modal, Button, Table, Pagination, Menu, Tabs, Tree, Spin, Input } from 'antd';
const confirm = Modal.confirm;
const TabPane = Tabs.TabPane;
const TreeNode = Tree.TreeNode;
const Search = Input.Search;
var html = ''; // test

class EnvironmentAssetComponent extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            modalShow: false,
            currentPage: 1,
            tableLoading: false,
            treeLoading: false,
            expandedKeys: [],
            locationTreeData: [],
            autoExpandParent: false, //自动展开
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
                title: '名称',
                dataIndex: 'name',
                key: 'name',
                render: (text, record, key) => {
                    return (
                        <p><Link className="order-number" to={`/environmental/environment_asset/detail?` + record.id}>{text ? text : '-'}</Link></p>
                    )
                }
            },
            {
                title: '所在位置',
                dataIndex: 'locationName',
                key: 'locationName',
                width:150,
                render: defaultRender
            },
            {
                title: '监测数据',
                dataIndex: 'meters',
                key: 'meters',
                render: (text, record, key) => {
                    return (
                        record.meters.map((item, i) => {
                            return (
                                <div>
                                    {item.what == 'temperature' ?
                                        <div className="environment-list-div"><img src={require("../../images/sensor_temperature_green.svg")} />
                                            <span>{item.meterValue}</span>
                                        </div>
                                        : ''
                                    }
                                    {item.what == 'humidity' ?
                                        <div className="environment-list-div"><img src={require("../../images/sensor_humidity.svg")} />
                                            <span>{item.meterValue}</span>
                                        </div>
                                        : ''
                                    }
                                    {item.what == 'light' ?
                                        <div className="environment-list-div"><img src={require("../../images/sensor_light.svg")} />
                                            <span>{item.meterValue}</span>
                                        </div>
                                        : ''
                                    }
                                </div>
                            )
                        })
                    );
                }
            },
            {
                title: '电量',
                dataIndex: 'battery',
                key: 'batter',
                render: (text, record, key) => {
                    return (
                        record.meters.map((item, i) => {
                            return (
                                <div>
                                    {item.what == 'battery' ?
                                        <div className="environment-list-div"><img src={require("../../images/elec.png")} />
                                            <span>{Math.trunc(item.meterValue)+'%'}</span>
                                        </div>
                                        : ''
                                    }
                                </div>
                            )
                        })
                    )
                }
            },
            {
                title: '最后更新时间',
                dataIndex: 'meterValueTime',
                key: 'meterValueTime',
                render: (text, record, key) => {
                    return (
                        <div >
                            {record.meters.length >0 ? record.meters[0].meterValueTime : '-'}
                        </div>
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
                            {/* <Collection
                                onChange={arg => {
                                }}
                            /> */}
                            <Icon
                                type="delete"
                                onClick={() => {
                                    console.log('执行删除->' + record.id)
                                    this.showConfirm(record.id, record.name)
                                }}
                            />
                        </div>
                    )
                }
            },
        ];

        //*** 初始化列表参数 需要到处改参数的请求 把参数定义到这里 严禁把参数用state管理 因为参数变化不需要触发render来渲染页面
        const { commonState } = this.props;
        this.param = {
            orgId: commonState.orgId,
            siteId: commonState.siteId,
            pageNum: 1,
            pageSize: 10,
            classificationId: 'c6519b4e612711e79a2890d370b53e17',
            locationId: '',
            productArray: commonState.productArray,
        }

    }
    // 表格事件
    tableChange = (pagination, filters, sorter) => {
    }
    // 分页事件
    pageChange = (page, pageSize) => {
        this.setState({ currentPage: page });
        this.param.pageNum = page; //*** 需要修改参数 在方法内单独修改
        this.getList();
    }
    // 模糊查询
    fuzzyQuery = (keyword) => {
        this.param.keyword = keyword; // 关键字
        this.param.queryMeter = true; // 是否查询点
        this.getList();
    }
     
    // 获取树菜单
    getTree = (e) => {
        const { actions, commonState } = this.props;
        this.setState({ treeLoading: true });
        let param = {
            orgId: commonState.orgId,
            siteId: commonState.siteId,
            productArray: commonState.productArray,
            ...e ,
        };
    
        actions.locationGetTree(param, (data) => {
            console.log(data)
            this.setState({
                locationTreeData: data,
                treeLoading: false,
            });
        });
    }
    

    treeSelect = (keyArr) => {
        if (!keyArr.length) return;
        this.param.locationId = keyArr[0];
        this.getList();
    }
    getList = () => {
        const { actions } = this.props;
        this.setState({ tableLoading: true });
        actions.environmentAssetGetList(this.param, () => {
            this.setState({ tableLoading: false });
        });
    }
    removeByValue = function (val) {
        for (var i = 0; i < this.length; i++) {
            if (this[i] == val) {
                this.splice(i, 1);
                break;
            }
        }
    }
    // 递归遍历
    recursiveTree = (data) => {
        let tree = data.map((item, i) => {
            return <TreeNode title={item.description} key={item.id}
            >
                {
                    item.children && item.children.length > 0 ?
                        this.recursiveTree(item.children) :
                        null
                }
            </TreeNode>
        });
        return tree;
    }


    saveEnvironmentAsset = () => {
        const { actions } = this.props;
        actions.getFormValues(true);
    }
    // 删除确认
    showConfirm = (id, text) => {
        confirm({
            title: `删除 ${text}?`,
            okText: '删除',
            onOk: () => {
                const { actions } = this.props;

                actions.assetDelete([id], (data) => {
                    this.getList();
                });
            }
        });
    }
    componentDidMount() {
        this.getList();
        this.getTree(null);

    }


    onChange = (e) => {
        const value = e.target.value;
        let searchValue  = {
            name :value , 
        }
        this.getTree(searchValue);
    }


    // 重复循环数组

    render() {

        const { locationTreeData  ,environmentAssetListData} = this.props.state;
        const { children ,location} = this.props;
        const data = environmentAssetListData;
        const list = data ? data.list : [];
        const detailTitle = this.props.state.detailTitle ? this.props.state.detailTitle  :'新建传感器'; 
        return children ? (
            <div>
                <div className="top-bar clearfix">
                <div className="details-title pull-left">
                        <h3>{detailTitle}</h3>
                    </div>
                    <div className="list-tools-right pull-right">
                        {/* <BackList  onClick={this.getList} /> */}
                        <BackList location={location} />
                        <Button size="large" onClick={this.saveEnvironmentAsset}>保存</Button>
                    </div>
                </div>
                {children}
            </div>
        ) : (
                <div>
                    <div className="top-bar clearfix">
                        <ListTools
                            title="环境监测"
                            onEnter={(text) => {
                                this.fuzzyQuery(text);
                            }}
                        />
                        <div className="list-tools-right pull-right">
                            <Pagination
                                total={data?data.total:0}
                                className="pull-left"
                                current={this.state.currentPage}
                                onChange={this.pageChange}
                            />
                            <Link to="/environmental/environment_asset/detail"><Button type="primary" size="large">新建</Button> </Link>
                        </div>
                    </div>
                    <div className="eam-content">
                        <div className="eam-content-inner">
                            <div className="eam-side-left">
                                <Tabs defaultActiveKey="1" onChange={() => { }}>
                                    <TabPane tab="位置体系" key="1">
                                        <Search style={{ width: 230 }} placeholder="Search" onPressEnter={this.onChange} />
                                        {this.state.treeLoading ? <Spin /> : ''}
                                        <Tree
                                            showLine
                                            onSelect={this.treeSelect}
                                            autoExpandParent={this.state.autoExpandParent}
                                        >
                                            {this.recursiveTree(locationTreeData)}
                                        </Tree>
                                    </TabPane>
                                </Tabs>
                            </div>
                            <div className="eam-main-right">
                                <Table
                                    loading={this.state.tableLoading}
                                    rowKey="id"
                                    pagination={false}
                                    dataSource={list}
                                    columns={this.columns}
                                    rowSelection={this.rowSelection}
                                    bordered
                                    onChange={this.tableChange}
                                />
                                <Pagination
                                    total={data?data.total:0}
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
        state: state.environmental,
        commonState: state.common
    }
}

function buildActionDispatcher(dispatch) {
    return {
        actions: bindActionCreators(actions, dispatch),
    }
}

Array.prototype.removeByValue = function (val) {
    for (var i = 0; i < this.length; i++) {
        if (this[i] == val) {
            this.splice(i, 1);
            break;
        }
    }
}
export default connect(mapStateToProps, buildActionDispatcher)(EnvironmentAssetComponent);
