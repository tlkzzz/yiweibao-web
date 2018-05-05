/** 
 * @Description  档案管理
 */
import React from 'react';
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';
import {Link, browserHistory} from 'react-router';
import commonActions from '../../actions/common.js';
import actions from '../../actions/archives_managent.js';

import DropdownMenu from '../common/dropdown_menu.js';
import Multiselect from '../common/multiselect.js';
import BackList from '../common/back_list.js';
import Collection from '../common/collection.js';
import Dropdown from '../common/dropdown.js';
import AsideTree from '../common/aside_tree.js';
import EamModal from '../../components/common/modal.js';
import ListTools from '../common/list_tools.js';
import {runActionsMethod, filterArrByAttr} from '../../tools/';
import moment from 'moment';


import {Icon, Checkbox, Modal, Button, Table, Form, Pagination, Menu, Select, Tree, Input, message} from 'antd';
const confirm = Modal.confirm;
const TreeNode = Tree.TreeNode;
const FormItem = Form.Item;

class NodeFormComponent extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        const {form, data} = this.props;
        const {getFieldDecorator} = form;
        //console.log(data);

        return (
            <Form>
                <FormItem
                    label="节点"
                    style={{display: 'none'}}
                >
                    {
                        getFieldDecorator('id', {
                            initialValue: data ? data.key : ''
                        })(
                            <Input />
                        )
                    }
                </FormItem>
                <FormItem
                    label="节点"
                >
                    {
                        getFieldDecorator('typeName', {
                            initialValue: data ? data.props.title : '',
                            rules: [{required: true, message: '文本不能为空'}],
                        })(
                            <Input style={{width: '100%'}}/>
                        )
                    }
                </FormItem>
            </Form>
        )
    }
}
const NewForm = Form.create()(NodeFormComponent);

class NodeFormComponent2 extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        const {form, data} = this.props;
        const {getFieldDecorator} = form;

        return (
            <Form>
                <div>{data ? `在--${data.props.title}--下添加节点` : '添加根节点'}</div>

                <FormItem
                    label="节点"
                    style={{display: 'none'}}
                >
                    {
                        getFieldDecorator('id', {
                            initialValue: data ? data.key : ''
                        })(
                            <Input />
                        )
                    }
                </FormItem>
                <FormItem
                    label="节点"
                >
                    {
                        getFieldDecorator('typeName', {
                            rules: [{required: true, message: '文本不能为空'}],
                        })(
                            <Input style={{width: '100%'}}/>
                        )
                    }
                </FormItem>
            </Form>
        )
    }
}
const NewForm2 = Form.create()(NodeFormComponent2);


class ArchivesComponent extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            ids: '',
            modalShow: false,
            currentPage: 1,
            tableLoading: false
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
                title: '档案编号',
                dataIndex: 'archivesNum',
                key: 'archivesNum',
                sorter: (a, b) => a.archivesNum - b.archivesNum,
                render: (text, record, key) => {
                    return (
                        <p><Link className="order-number"
                                 to={`/archives_managent/archives/archives_detail?id=${record.id}`}>{text ? text : '-'}</Link>
                        </p>
                    )
                }
            },
            {
                title: '档案名称',
                dataIndex: 'materialName',
                key: 'materialName',
                sorter: false,
                render: defaultRender
            },
            {
                title: '分类',
                dataIndex: 'typeName',
                key: 'typeName',
                sorter: false,
                render: defaultRender
            },
            {
                title: '存放位置',
                dataIndex: 'position',
                key: 'position',
                sorter: (a, b) => a.position - b.position,
                render: defaultRender
            },
            {
                title: '状态',
                dataIndex: 'status',
                key: 'status',
                sorter: false,
                render: defaultRender
            },
            //{
            //    title: '提交人',
            //    dataIndex: 'tus',
            //    key: 'tus',
            //    sorter: true,
            //    render: defaultRender
            //},
            {
                title: '操作',
                dataIndex: '4',
                key: '4',
                width: 120,
                render: (text, record, key) => {
                    return (
                        <div className="table-icon-group">
                            <Icon className="icon-right"
                                  type="delete"
                                  onClick={() => {
                                      this.showConfirm(record.id, record.archivesNum)
                                  }}
                            />

                        </div>
                    )
                }
            },
        ];

        // 初始化列表参数 需要到处改参数的请求 把参数定义到这里 严禁把参数用state管理 因为参数变化不需要触发render来渲染页面
        const {commonState} = this.props;
        this.param = {
            // orgId: commonState.orgId,
            pageNum: 1,
            pageSize: 10,
            orgId: commonState.orgId,
            siteId: commonState.siteId,
            materialType:'',
            productArray: commonState.productArray,
        }

        //this.treeParam = {
        //    parentId: 'ea9a6ad4662d11e79308aaf2bfe747ac',
        //    orgId: commonState.orgId,
        //}

    }

    // 表格事件
    tableChange = (pagination, filters, sorter) => {
        console.log(sorter)
    }
    // 分页事件
    pageChange = (page, pageSize) => {
        this.setState({currentPage: page});
        this.param.pageNum = page; // 需要修改参数 在方法内单独修改
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
    // 删除档案
    del = (id) => {
        const {actions} = this.props;
        let param = {ids: id};
        runActionsMethod(actions, 'archivesDel', param);
        this.getList();
    }
    // 新建档案
    archivesAdd = () => {
        this.setState({archivesEditData: ''});
        this.archivesAddModal.modalShow();
    }

    //编辑档案
    archiveseEdit = (record) => {
        this.setState({archivesEditData: record});
        this.archivesAddModal.modalShow();
    }
    archivesClose = () => {
        this.archivesAddModal.modalHide();
    }
    archivesAfterClose = () => {
        this.archivesAddForm.resetFields();
    }

    //删除确认
    showConfirm = (id, text) => {
        if (!id) {
            message.error('请选择要删除的数据。')
        } else {
            confirm({
                title: `删除 ${text ? text : '数据' }?`,
                okText: '删除',
                onOk: () => {
                    this.del(id);
                }
            });
        }
    }

    // 批量删除档案
    archivesDelAll = () => {
        const {actions} = this.props;
        const selectedRows = this.state.selectedRows;
        const taskParam = {
            ids: filterArrByAttr(selectedRows, 'id').join(',')
        }
        runActionsMethod(actions, 'archivesDel', taskParam, () => {
            console.log(111);
            this.getList();
        });
    }

    // 模糊查询
    fuzzyQuery = (keywords) => {
        this.param.word = keywords;
        this.getList();
    }

//保存
    archivesSave = () => {
        
        const { actions,commonState } = this.props;
        actions.getFormValues(false);
        clearTimeout(this.timer);
        this.timer = setTimeout(() => {
            const { state } = this.props;
                state.getFormValues.updateDate = moment(state.getFormValues.updateDate).format('YYYY-MM-DD HH:mm:ss');
                state.getFormValues.createDate = moment(state.getFormValues.createDate).format('YYYY-MM-DD HH:mm:ss');
                state.getFormValues.validStartTime = moment(state.getFormValues.validStartTime).format('YYYY-MM-DD HH:mm:ss');
                state.getFormValues.validEndTime = moment(state.getFormValues.validEndTime).format('YYYY-MM-DD HH:mm:ss');
    
            
            const param = {
                    ...state.getFormValues,
                    siteId:commonState.siteId,
                    orgId:commonState.orgId,
                }
            console.log(param) ;
            const id = param.id ;
            if(id==undefined || id ==''){
                actions.archivesCreate(param, (json) => {
                    if (json.success) {
                        '/archives_managent/archives/archives_detail?id=' + json.data.id;
                        window.location.href = '/archives_managent/archives';
                    } else {
                        message.error(json.msg);
                    }
                });
            } else {
                actions.archivesUpdate(param, (json) => {
                    if (json.success) {
                        window.location.href = '/archives_managent/archives';
                    } else {
                        message.error(json.msg);
                    }
                });
            }
        }, 0);
    }

    componentDidMount() {
        this.getList();
        this.getTreeList();
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

    //树选择 节点
    onTreeSelect = (selectedKeys, e) => {

        this.setState({selectNode: e.selectedNodes[0]});
        this.param.materialType=selectedKeys[0];
        this.getList();
    }

    editTree = () => {
        const node = this.state.selectNode;
        // console.log(node);
        if (node == null || node.length == 0) {
            message.error("请选中操作的节点！！");
        } else {
            this.setState({opertion: true});
            this.nodeModal.modalShow();
        }
    }
    nodeClose = () => {
        this.nodeAddForm.resetFields();
        this.nodeModal.modalHide();
    }

    nodeAddSave = () => {
        let {actions,commonState} = this.props;
        const opertion = this.state.opertion;


        this.nodeAddForm.validateFields((err, values) => {
            if (err) return;
            console.log(values);
    
            if (opertion) {
                actions.updateArchivesType(values, (json) => {
                    this.setState({opertion: ''});
                    if (json.success) {
                        this.getTreeList()
                    } else {
                        message.error(json.msg);
                    }
                });
            } else {
                if (values.id != null && values.id != '') {
                    const param = {
                        "id": null,
                        "hasChild": false,
                        "parentId": values.id,
                        "root": false,
                        "typeName": values.typeName,
                        orgId: commonState.orgId,
                        siteId: commonState.siteId,
                    }
                    console.log(param)
                    actions.addArchivesType(param, (json) => {
                        if (json.success) {
                            this.getTreeList()
                        } else {
                            message.error(json.msg);
                        }
                    });
                } else {
                    const param = {
                        "hasChild": false,
                        "parentId": null,
                        "root": true,
                        "typeName": values.typeName,
                        orgId: commonState.orgId,
                        siteId: commonState.siteId,
                    }
                    console.log(param)
                    actions.addArchivesType(param, (json) => {

                        if (json.success) {
                            this.getTreeList()
                        } else {
                            message.error(json.msg);
                        }
                    });
                }
            }
            this.nodeModal.modalHide();
        });
    }

    addTree = () => {
        this.setState({opertion: false});
        this.nodeModal.modalShow();
    }

    deleteTree = () => {
        const {actions} = this.props;
        const node = this.state.selectNode;
        const getIds = this.getIds(node);
        const id = getIds.substr(0, getIds.length - 1);
        if (node == null) {
            message.error("请选中操作的节点！！");
        } else {
            actions.deleteArchivesType({ids: id}, (json) => {
                if (json.success) {
                    this.setState({ids:''});
                    this.getTreeList()
                } else {
                    message.error(json.msg);
                }
            });
        }
    }
    getIds = (node) => {
        this.state.ids = this.state.ids + node.key + ",";
        if (node.props.children != null) {

            for (var i = 0; i < node.props.children.length; i++) {
                this.getIds(node.props.children[i]);
            }
        }
        return this.state.ids;
    }

    render() {

        const {children, commonState, state,location} = this.props;
        //

        const archivesdata = state.archivesListData;
        const list = archivesdata.list;
        const treedata = state.archivesTreeData;

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
                            <span className="eam-tag">待执行</span>
                            <p>这是工单描述工单描述工单描述工单描述工单描述</p>
                        </div>
                        <div className="list-tools-right pull-right">
                            <BackList location={location} />
                            <Dropdown
                                overlay={(
                                    <Menu>
                                        <Menu.Item key="0"><Icon type="edit"/> 变更状态</Menu.Item>
                                        <Menu.Item key="1"><Icon type="setting"/> 批量派工</Menu.Item>
                                        <Menu.Divider />
                                        <Menu.Item key="3"><Icon type="delete"/> 批量删除</Menu.Item>
                                    </Menu>
                                )}
                                trigger={['click']}
                            >
                                更多操作
                            </Dropdown>
                            <Button type="primary" size="large" onClick={this.archivesSave}>保存</Button>
                        </div>
                    </div>
                    {children}
                </div>
            ) :
            (
                <div>
                    <div className="top-bar clearfix">
                        <ListTools
                            title="档案管理"
                            onEnter={(text) => {
                                this.fuzzyQuery(text);
                            }}
                            conditionList={seniorFilterSelectArr}
                        />
                        <div className="list-tools-right pull-right">
                            <Pagination
                                total={archivesdata.total}
                                className="pull-left"
                                current={this.state.currentPage}
                                onChange={this.pageChange}
                            />
                            <Dropdown
                                overlay={(
                                    <Menu>
                                        <Menu.Item key="0"><Icon type="edit"/> 变更状态</Menu.Item>
                                        <Menu.Item key="1"><Icon type="setting"/> 批量派工</Menu.Item>
                                        <Menu.Divider />
                                        <Menu.Item key="3"><Icon type="delete"/> 批量删除</Menu.Item>
                                    </Menu>
                                )}
                                trigger={['click']}
                            >
                                更多操作
                            </Dropdown>
                            <Button type="primary" size="large"><Link activeClassName="active"
                                                                      to="/archives_managent/archives/archives_detail">新建</Link></Button>
                        </div>
                    </div>
                    <div className="eam-content">
                        <div className="eam-content-inner">
                            <div className="eam-side-left">
                                <Select
                                    mode="combobox"
                                    value={this.state.value}
                                    placeholder="搜索"
                                    notFoundContent=""
                                    defaultActiveFirstOption={false}
                                    style={{width: '100%'}}
                                    showArrow={false}
                                    filterOption={false}
                                    //onSearch={this.fetchUser}
                                    onChange={this.handleChange}
                                >

                                </Select>
                                <div style={{marginLeft: 7, marginTop: 9}}>
                                    <span> 档案分类</span>
                                    <span style={{marginLeft: 50}}>
                                      <Icon type="edit" onClick={this.editTree} style={{marginLeft: 10}}/>

                                     <Icon type="setting" onClick={this.addTree} style={{marginLeft: 10}}/>
                                      <Icon type="delete" onClick={this.deleteTree} style={{marginLeft: 10}}/>
                                </span>
                                </div>
                                <Tree
                                    showLine
                                    defaultExpandedKeys={['0-0-0']}
                                    onSelect={this.onTreeSelect}
                                >
                                    {this.recursiveTree(treedata)}
                                </Tree>
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
                                    total={archivesdata.total}
                                    showTotal={(total, range) => `当前第${range[0]}-${range[1]}条 / 共${total}条`}
                                    current={this.state.currentPage}
                                    showQuickJumper
                                    onChange={this.pageChange}
                                />
                            </div>
                            <EamModal
                                title='编辑节点'
                                ref={nodeModal => this.nodeModal = nodeModal}
                                afterClose={this.nodeClose}
                            >
                                {this.state.opertion ?
                                    <NewForm data={this.state.selectNode} opertion={this.state.opertion}
                                             ref={nodeAddForm => this.nodeAddForm = nodeAddForm}/> :
                                    <NewForm2 data={this.state.selectNode} opertion={this.state.opertion}
                                              ref={nodeAddForm => this.nodeAddForm = nodeAddForm}/>  }
                                <div className="modal-footer clearfix">
                                    <Button size="large" onClick={this.nodeClose}>取消</Button>
                                    <Button type="primary" size="large" onClick={this.nodeAddSave}>确定</Button>
                                </div>
                            </EamModal>
                        </div>
                    </div>
                </div>
            )
    }
}


function

mapStateToProps(state) {
    return {
        state: state.archives_managent,
        commonState: state.common
    }
}

function

buildActionDispatcher(dispatch) {
    return {
        actions: bindActionCreators(actions, dispatch),
        commonActions: bindActionCreators(commonActions, dispatch),
    }
}

export
default

connect(mapStateToProps, buildActionDispatcher)

(
    ArchivesComponent
)
;
