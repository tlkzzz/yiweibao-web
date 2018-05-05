/** 
 * @Description: 档案选择插件
 */

import React from 'react';
import ReactDOM from 'react-dom';
import { bindActionCreators } from 'redux';
import { Link, browserHistory } from 'react-router';
import { connect } from 'react-redux';
import commonActions from '../../actions/common.js';
import actions from '../../actions/archives_managent.js';
import { runActionsMethod, correspondenceJson, filterArrByAttr } from '../../tools/';
import { Icon, Button, Table, Pagination,notification, Tree,Collapse, Form, Input, Row, Col, Select, Radio, DatePicker, Timeline, Modal,message } from 'antd';
const TreeNode = Tree.TreeNode;

class WorkOrderComponent extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            tableLoading: false,
            currentPage: 1,
            selectedRowKeys: [],
            rowSelection: null, // 表格多选
            moreOperationsKey: '',
        }
        const { commonState } = this.props;
        this.param = {
            orgId: commonState.orgId,
            siteId: commonState.siteId,
            pageNum: 1,
            pageSize: 10,
        };
    }

    // 表格事件-排序
    tableChange = (pagination, filters, sorter) => {
        if (sorter.order) {
            let sorterOrder = sorter.order;
            let endIndex = sorterOrder.indexOf('end');
            sorterOrder = sorterOrder.slice(0, endIndex);
            this.param.sorts = `${sorter.field} ${sorterOrder}`;
        } else {
            this.param.sorts = '';
        }

        this.getList();
    }
    // 分页事件
    pageChange = (page, pageSize) => {
        this.setState({ currentPage: page });
        this.param.pageNum = page;
        this.getList();
    }

    //树选择 节点
    onTreeSelect = (selectedKeys, e) => {
        this.setState({selectNode: e.selectedNodes[0]});
        this.param.materialType=selectedKeys[0];
        this.getList();
    }
    // 获取列表数据
    getList = () => {
        const {actions} = this.props;
        this.setState({tableLoading: true});
        actions.archivesGetList(this.param, () => {
            this.setState({tableLoading: false});
        });
    }
    getTreeList = () => {
        const {actions,commonState} = this.props;
        const treeParam = {
            "orgId": commonState.orgId,
            "siteId": commonState.siteId,
        };
        actions.getArchivesTypeTree(treeParam);
    }
    // 递归遍历
    recursiveTree = (data) => {
        // console.log(data) ;
        let tree = data ? data.map((item, i) => {
                return <TreeNode title={item.typeName} key={item.id}>
                    {
                        item.children.length ?
                            this.recursiveTree(item.children) :
                            null
                    }
                </TreeNode>
            }) : null;
        return tree;
    }
    selectData=(data)=>{
        const {getSelectDate,modalHide} = this.props;
        getSelectDate(data);
        modalHide();
    }
    componentDidMount() {
        this.getList();
        this.getTreeList();
    }
    render () {

        const { children, state, commonState, commonActions, location } = this.props;
        const defaultRender = (text, record, key) => {
            return (
                <p>{text ? text : '-'}</p>
            )
        };

        const archivesdata = state.archivesListData;
        const list = archivesdata.list;
        const treedata = state.archivesTreeData;

        //表格字段
        const columns = [
            {
                title: '档案编号',
                dataIndex: 'archivesNum',
                key: 'archivesNum',
                sorter: true,
                render:  (text, record, key) => {
                        return (
                            <p><a href="javascript:;" onClick={() => { this.selectData(record) }} className="order-number">{text ? text : '-'}</a></p>
                        )
                    }

            },
            {
                title: '描述',
                dataIndex: 'description',
                key: 'description',
                render: defaultRender
            },
            {
                title: '存放位置',
                dataIndex: 'position',
                key: 'position',
                sorter: true,
                render: defaultRender
            },
            {
                title: '状态',
                dataIndex: 'status',
                key: 'status',
                sorter: false,
                render: defaultRender
            },
            {
                title: '提交人',
                dataIndex: 'creator',
                key: 'creator',
                sorter: true,
                render: defaultRender
            },
            {
                title: '提交时间',
                dataIndex: 'createDate',
                key: 'createDate    ',
                sorter: true,
                render: defaultRender
            }
        ];
        return children ?

            (
                <div>

                </div>
            ) :
            (
                <div>
                    <Modal
                        title={"档案信息" }
                        width={1200}
                        onCancel={this.props.modalHide}
                        visible={this.props.visible}
                        footer={null}
                        afterClose={() => { this.startGetList = true }}
                    >
                        <Row gutter={16}>
                            <Col className="gutter-row" span={6}>
                                <span onClick={() => {
                                   if(this.param.materialType){
                                       delete this.param.materialType
                                   }
                                   this.getList()//重新加载全部

                                }} > 档案分类</span>
                                <Tree
                                    showLine
                                    defaultExpandedKeys={['0-0-0']}
                                    onSelect={this.onTreeSelect}
                                >
                                    {this.recursiveTree(treedata)}
                                </Tree>
                                {/*<AsideTree*/}
                                {/*data={treeData}*/}
                                {/*onSelect={this.selectTreeNode}*/}
                                {/*/>*/}
                            </Col>
                            <Col className="gutter-row" span={18}>
                                <div className="eam-content">
                                    <div className="eam-content-inner">
                                        <Table
                                            rowKey="id"
                                            loading={this.state.tableLoading}
                                            pagination={false}
                                            dataSource={list}
                                            columns={columns}
                                            bordered
                                            onChange={this.tableChange}
                                        />
                                        <Pagination
                                            total={archivesdata.total}
                                            showTotal={(total, range) => `当前第${range[0]}-${range[1]}条 / 共${total}条`}
                                            current={this.state.currentPage}
                                            showQuickJumper
                                            onChange={this.pageChange}
                                        />
                                    </div>
                                </div>
                            </Col>
                        </Row>

                    </Modal>
                </div>
            )
    }
}

function mapStateToProps (state) {
    return {
        state: state.archives_managent,
        commonState: state.common,
    }
}

function buildActionDispatcher(dispatch) {
    return {
        actions: bindActionCreators(actions, dispatch),
        commonActions: bindActionCreators(commonActions, dispatch),
    }
}

export default connect(mapStateToProps, buildActionDispatcher)(WorkOrderComponent);
