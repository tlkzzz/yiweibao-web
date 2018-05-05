/** 
 * @Description 设备台账展示
 */
import React from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { Link, browserHistory } from 'react-router';
import commonActions from '../../actions/common.js';
import actions from '../../actions/equipment.js';

import SearchInp from '../../components/common/search_inp.js';
import DropdownMenu from '../../components/common/dropdown_menu.js';
import Multiselect from '../../components/common/multiselect.js';
import BackList from '../../components/common/back_list.js';
import Collection from '../../components/common/collection.js';
import Dropdown from '../../components/common/dropdown.js';
import AsideTree from '../../components/common/aside_tree.js';
import ListTools from '../common/list_tools';
import EamModal from '../common/modal.js';
import DetailsPagination from '../common/details_pagination.js';
import StatusChangeForm from '../common/statusChange.js';
import MoreOperations from '../common/more_operations.js';

import { filterArrByAttr , runActionsMethod , correspondenceJson } from '../../tools';

import { Icon, Checkbox, Modal, Button, Table, Pagination, Menu,Avatar,message} from 'antd';
const confirm = Modal.confirm;

class AssetComponent extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            modalShow: false,
            currentPage: 1,
            tableLoading: false,
            rowSelection: null, // 表格多选
            selectedRowKeys: [],
            list:{},
        }

        //表格多选
        this.rowSelection = {
            onChange: (selectedRowKeys, selectedRows) => {
                this.setState({ selectedRowKeys :selectedRowKeys });
            },
            onSelect: (record, selected, selectedRows) => {
            },
            onSelectAll: (selected, selectedRows, changeRows) => {
            },
        };

        let defaultRender = (text, record, key) => {
            return (
                <p>{text ? text : '-'}</p>
            )
        };

        //表格字段
        this.columns = [{
                title: '图片地址',
                dataIndex: 'pics',
                key: 'pics',
                sorter: true,
                render: val =><Avatar src={val} />
            },
            {
                title: '设备名称',
                dataIndex: 'name',
                key: 'name',
                sorter: true,
                render: (text, record, key) => {
                    return (
                        <p><span className="order-number" onClick={() => { this.jumpToTabPage(record) }}>{text ? text : '-'}</span></p>
                    )
                }
            },
            {
                title: '设备分类',
                dataIndex: 'typeName',
                key: 'typeName',
                sorter: true,
            },
            {
                title: '所属项目',
                dataIndex: 'tspName',
                key: 'tspName',
                sorter: true,
            },
            {
                title: '台账简称',
                dataIndex: 'simple_name',
                key: 'simple_name',
                sorter: true,
            }, {
                title: '位置描述',
                dataIndex: 'position',
                key: 'position',
                sorter: true,
            },
            
            {
                title: '创建时间',
                dataIndex: 'create_date',
                key: 'create_date',
                sorter: true,
            },{
                title: '操作',
                dataIndex: '4',
                key: '4',
                width: 120,
                render: (text, record, key) => {
                    return (
                        <div className="table-icon-group">
                            <Icon  className="icon-right"
                                type="delete"
                                onClick={() => {
                                    this.showConfirm(record.id, record.name)
                                }}
                            />
                        </div>
                    )
                }
            },
        ];

        //*** 初始化列表参数 需要到处改参数的请求 把参数定义到这里 严禁把参数用state管理 因为参数变化不需要触发render来渲染页面**/
        const { commonState } = this.props;
        this.param = {
          //  orgId: commonState.orgId,
          //  siteId: commonState.siteId,
            pageNum: 1,
            pageSize: 10,
          //  classificationId:'ea9a6ad4662d11e79308aaf2bfe747ac',
           // productArray: commonState.productArray,
           keyword :'',
        }
        
        this.treeParam = {
            parentId: 'ea9a6ad4662d11e79308aaf2bfe747ac',
            orgId: commonState.orgId,
        }

    }
    jumpToTabPage = (record , isAdd) => {
        if (isAdd) {
            this.listMoreOperations.cancel();
            localStorage.removeItem("asset");
            localStorage.removeItem("param");
            browserHistory.push('/equipment/');
            browserHistory.push(`/equipment/asset/tab_1?add_asset=1`);
        } else {
            let json = {};
            json.id = record.id;
            json.status = record.status;
            json.code = record.code;
            json.description = record.name;
            localStorage.setItem('LIST_PARAM', JSON.stringify(this.param));
            localStorage.setItem('asset', JSON.stringify(json));
            browserHistory.push('/equipment/asset');
            browserHistory.push(`/equipment/asset/tab_1`);
        }
    }
    tableSelectChange = (selectedRowKeys) => {
        this.setState({ selectedRowKeys });
    }
    // 表格事件
    tableChange = (pagination, filters, sorter) => {
        if (sorter.order) {
            let sorterOrder = sorter.order;
            let endIndex = sorterOrder.indexOf('end');
            sorterOrder = sorterOrder.slice(0, endIndex);
            let field = `${sorter.field}`;

            if(field == 'locationName') {
                this.param.sorts = `locationId ${sorterOrder}`;
            }else{
                this.param.sorts = `${sorter.field} ${sorterOrder}`;
            }
        }else{
            this.param.sorts = '';
        }
        this.getList();
    }
    // 分页事件
    pageChange = (page, pageSize) => {
        this.setState({ currentPage: page });
        this.param.pageNum = page; //*** 需要修改参数 在方法内单独修改
        this.getList();
    }

    onShowSizeChange = (page, pageSize) => {
        this.setState({ currentPage: page });
        this.param.pageNum = page;
        this.param.pageSize = pageSize;//*** 需要修改参数 在方法内单独修改
        this.getList();
    }
    // 模糊查询
    fuzzyQuery = (keywords) => {
        this.param.word = keywords;
        this.getList();
    }
    getList = (cb) => {
        const { commonActions, actions ,state } = this.props;
        this.setState({ tableLoading: true });
        // commonActions.assetsGetList(this.param, () => {
        //     cb && cb();
        //     this.setState({ tableLoading: false });
        // });
        //获取设备台账列表
        actions.statusList(this.param,(json) => {
            this.setState({ tableLoading: false ,list:json.result});
            console.log(json);


        })
    }
    // 删除确认
    // showConfirm = (id, text) => {
    //     if (!id) {
    //         message.error('请选择要删除的数据。')
    //     } else {
    //         confirm({
    //             title: `删除 ${text ? text : '数据' }?`,
    //             okText: '删除',
    //             onOk: () => {
    //             		const pathname = window.location.pathname;
    //                 const isDetailsPage = pathname.indexOf('tab_1') !== -1;
    //                 this.del(id, (json) => {
    //                     if (json.success) {
    //                         isDetailsPage ? browserHistory.push('/equipment/asset/') : this.getList();
    //                     }
    //                 });
    //             }
    //         });
    //     }
    // }
    // 删除确认
    showConfirm = (id, text) => {
        if(!id){
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
    // 列表删除
    del = (id) => {
        const { actions } = this.props;
        let param = {ids: id};
          actions.delAsset(param, (json) => {
            if(json.code==200){
                   message.success('删除成功');
                    this.setState({ selectedRowKeys : []});
                    this.getList();
            }else{
                  message.error(json.msg);
            }

        });



    }
    // 列表删除
    // del = (id,callback) => {
    //     const { actions } = this.props;
    //     let param = {ids: id};
    //     runActionsMethod(actions, 'assetsDel', param, (json) => {
    //         this.setState({
    //             selectedRowKeys : []
    //         })
    //         callback(json);
    //         this.getList();
    //     });
    // }

    // 模糊查询
    fuzzyQuery = (keywords) => {
        this.param.keyword = keywords;
        this.getList();
    }
    // 更多操作
    moreClick = (key, hideCheckBox) => {
        if (key === '0') { // 变更状态
            if (!this.state.selectedRowKeys.length) {
                message.error('请选择数据');
            } else {
                this.statusChangeModal.modalShow();
            }
        }
        if (key === '2') { //批量删除
            this.showConfirm(this.state.selectedRowKeys)
        }
    }
    // 详情页更多操作
    detailsMoreClick = (key) => {
        if (key === '0') {
            this.statusChangeModal.modalShow();
        }
        if (key === '2') { // 详情页删除
            const asset = JSON.parse(localStorage.getItem('asset'));
            this.showConfirm(asset.id, asset.code)
        }
    }
    // 变更状态
    statusChange = () => {
        const { actions, location } = this.props;

        const values = this.statusChangeForm.props.form.getFieldsValue();
        const pathname = location.pathname;
        const isDetailsPage = pathname.indexOf('tab_1') !== -1;
        const asset = JSON.parse(localStorage.getItem('asset'));

        if (isDetailsPage) asset.status = values.status;
        let param = {
            ids: isDetailsPage ? [asset.id] : this.state.selectedRowKeys,
            status: values.status,
        }

        runActionsMethod(actions, 'assetStatusChange', param, () => {
            if (isDetailsPage) {
                this.jumpToTabPage(asset);
            } else {
                this.setState({ selectedRowKeys: [] });
                this.listMoreOperations.cancel();
                this.getList();
            }
            this.statusChangeModal.modalHide();
        });
    }

//  componentDidMount () {
//      const { actions,state } =this.props;
//      this.getList();
//  }
    listToolsComponentWillMount = () => { // 代替 componentWillMount
        //this.resetListParam();
        this.getList();
    }
    render () {

        const { children, commonState, state, location} = this.props;
        const data = commonState.assetsListData;
        // const list = data ? data.list : [];
        const list = this.state.list;
        console.log(list);
        console.log(list,44544)
        const getCodeData = state.getCodeData;
        const statusList = state.statusList;
        const rowSelection = this.state.rowSelection ?
                            {
                                selectedRowKeys: this.state.selectedRowKeys,
                                onChange: this.tableSelectChange,
                            } :
                            null;
        const asset = JSON.parse(localStorage.getItem('asset'));
        const isAdd = location.query.add_asset;
        const NewStatusChange = (
            <EamModal
                title="变更状态"
                ref={statusChangeModal => this.statusChangeModal = statusChangeModal}
                afterClose={() => {
                    this.statusChangeForm.props.form.resetFields()
                }}
            >
                <StatusChangeForm
                    statusData={statusList}
                    wrappedComponentRef={statusChangeForm => this.statusChangeForm = statusChangeForm}
                />
                <div className="modal-footer clearfix">
                    <Button size="large" onClick={() => {this.statusChangeModal.modalHide()}}>取消</Button>
                    <Button type="primary" size="large" onClick={this.statusChange}>确定</Button>
                </div>
            </EamModal>
        )


        return children ?
        (
            <div>
                <div className="top-bar clearfix">
                    <div className="details-title pull-left">
                        <h3>{isAdd ? getCodeData : (asset && asset.code)}</h3>
                        <span className="eam-tag">{(asset && asset.status) && correspondenceJson.assetStatus[asset.status].text}</span>
                        <p>{asset && asset.description}</p>
                    </div>
                    <div className="list-tools-right pull-right">
                        <BackList location={location}/>
                        {
                            isAdd ?
                            null :
                            <DetailsPagination
                                state={commonState} // 列表数据的state
                                listDataName="assetsListData" // 列表数据state名 -> data = state.workOrderListData
                                localStorageName="asset" // onChang 方法内设置的存储名
                                onChange={(record)=>{
                                    let json = {};
                                    json.id = record.id;
                                    json.status = record.status;
                                    json.code = record.code;
                                    json.description = record.description;

                                    localStorage.setItem('asset', JSON.stringify(json));
                                    browserHistory.push('/equipment/');
                                    browserHistory.push(`/equipment/asset/tab_1`);
                                }}
                                getList={(pageNum, cb) => {
                                      // *分页是根据列表页数据切换数据 本业列表数据用完 这里请求上|下一页数据
                                      // *列表页跳详情页必须本地存储列表页请求数据参数 全局统一用LIST_PARAM 防止详情页刷新请求的数据与列表跳详情的数据不一致
                                    this.param = JSON.parse(localStorage.getItem('LIST_PARAM'));
                                    if (pageNum) this.param.pageNum = pageNum;
                                    this.getList(cb);
                                }}
                           />
                        }
                        {
                            isAdd ?
                            null :
                            <Dropdown
                                overlay={(
                                    <Menu onClick={(e) => {this.detailsMoreClick(e.key)}}>
                                        <Menu.Item key="0"><Icon type="edit" /> 变更状态</Menu.Item>
                                        <Menu.Divider />
                                        <Menu.Item key="2"><Icon type="delete" /> 删除</Menu.Item>
                                    </Menu>
                                )}
                                trigger={['click']}
                            >
                                更多操作
                            </Dropdown>
                        }
                    </div>
                    <div className="eam-tab-nav">
                        <Link activeClassName="active" to={`/equipment/asset/tab_1`}><Icon type="check-circle-o" /> 设备设施信息</Link>
                        { isAdd ?
                            null
                            :
                            <Link activeClassName="active" to={`/equipment/asset/tab_2`}><Icon type="check-circle-o" /> 设备设施结构</Link>
                        }
                        { isAdd ?
                            null
                            :
                            <Link activeClassName="active" to={`/equipment/asset/tab_3`}><Icon type="check-circle-o" /> 技术参数</Link>
                        }
                        { isAdd ?
                            null
                            :
                            <Link activeClassName="active" to={`/equipment/asset/tab_4`}><Icon type="check-circle-o" /> 作业标准</Link>
                        }
                        { isAdd ?
                            null
                            :
                            <Link activeClassName="active" to={`/equipment/asset/tab_5`}><Icon type="check-circle-o" /> 保养计划</Link>
                        }
                        { isAdd ?
                            null
                            :
                            <Link activeClassName="active" to={`/equipment/asset/tab_6`}><Icon type="check-circle-o" /> 关联测点</Link>
                        }
                        { isAdd ?
                            null
                            :
                            <Link activeClassName="active" to={`/equipment/asset/tab_7`}><Icon type="check-circle-o" /> 维保记录</Link>
                        }
                        { isAdd ?
                            null
                            :
                            <Link activeClassName="active" to={`/equipment/asset/tab_8`}><Icon type="check-circle-o" /> 图纸资料</Link>
                        }
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
                        title="设备设施台账"
                        commonState={commonState}
                        commonActions={commonActions}
                        listToolsComponentWillMount={this.listToolsComponentWillMount}
                        onEnter={(text) => {
                            this.fuzzyQuery(text);
                        }}
                    />
                    <div className="list-tools-right pull-right">
                        <Pagination
                            total={list.rowcount}
                            className="pull-left"
                            current={this.state.currentPage}
                            onChange={this.pageChange}
                        />
                        {NewStatusChange}
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
                                    this.setState({ selectedRowKeys: [] }); // 清空选择
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
                        <Button type="primary" size="large" onClick={() => {this.jumpToTabPage('',true)}}>新建</Button>
                    </div>
                </div>
                <div className="eam-content">
                    <div className="eam-content-inner">
                        <div className="eam-side-left">
                            <AsideTree
                                data={
                                    [
                                        {
                                            name: '设备设施体系',
                                            key: 'classifications',
                                            actionsMethod: 'classifiGetTree',
                                            data: 'classifiTreeData',
                                        },
                                        {
                                            name: '位置体系',
                                            key: 'locations',
                                            param: {
                                                orgId:  commonState.orgId,//'e0bc74c4f58611e58c2d507b9d28ddca',
                                                siteId: commonState.siteId,
                                                productArray: commonState.productArray,
                                            },
                                            actionsMethod: 'locationsGetTree',
                                            data: 'locationsTreeData',
                                        },
                                    ]
                                }
                                onSelect={(id, key) => {
                                    if (key === 'classifications') {
                                        this.param.classificationId = id;
                                        this.param.productArray = commonState.productArray;
                                    } else {
                                        this.param.locationId = id;
                                        this.param.classificationId = "ea9a6ad4662d11e79308aaf2bfe747ac";
                                        this.param.productArray = commonState.productArray;
                                    }
                                    this.getList();
                                }}
                            />
                        </div>
                        <div className="eam-main-right">
                            <Table
                                loading={this.state.tableLoading}
                                rowKey="id"
                                pagination={false}
                                dataSource={list.list}
                                columns={ this.columns }
                                rowSelection={rowSelection}
                                bordered
                                onChange={this.tableChange}
                            />
                            <Pagination
                                total={list.rowcount}
                                showTotal={(total, range) => `当前第${range[0]}-${range[1]}条 / 共${total}条`}
                                current={this.state.currentPage}
                                showQuickJumper
                                showSizeChanger
                                onChange={this.pageChange}
                                onShowSizeChange={this.onShowSizeChange}
                            />
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}


function mapStateToProps (state) {
    return {
        state: state.equipment,
        commonState: state.common
    }
}

function buildActionDispatcher(dispatch) {
    return {
        actions: bindActionCreators(actions, dispatch),
        commonActions: bindActionCreators(commonActions, dispatch),
    }
}

export default connect(mapStateToProps, buildActionDispatcher)(AssetComponent);
