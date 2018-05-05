/** 
 * @Description 位置体系
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
 import DetailsPagination from '../common/details_pagination.js';
 import AsideTree from '../common/aside_tree';
 import ListTools from '../common/list_tools';
 import MoreOperations from '../../components/common/more_operations.js';
 import moment  from 'moment';

 import { runActionsMethod } from '../../tools';

 import { Icon, Checkbox, Modal, Button, Table, Pagination, Menu,message} from 'antd';
const confirm = Modal.confirm;
 class LocationComponent extends React.Component {
     constructor(props) {
         super(props);

         this.state = {
             modalShow: false,
             currentPage: 1,
             tableLoading: false,
             rowSelection: null, // 表格多选
             selectedRows: [],
             list:{},
         }
         let defaultRender = (text, record, key) => {
             return (
                 <p>{text ? text : '-'}</p>
             )
         };

         //表格字段
         this.columns = [
             {
                 title: '分类名称',
                 dataIndex: 'name',
                 key: 'name',
                 sorter: true,
             },
             {
                 title: '所属项目',
                 dataIndex: 'tspName',
                 key: 'tspName',
                 sorter: true,
             },
             {
                 title: '创建时间',
                 dataIndex: 'ctime',
                 key: 'ctime',
                 sorter: true,
                 render:val =><span>{moment(val).format('YYYY-MM-DD hh:mm:ss')}</span>
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
            // orgId: commonState.orgId,
            // siteId: commonState.siteId,
             pageNum: 1,
             pageSize: 10,
             keyword:'',

         }

         this.treeParam = {
             parentId: 'ea9a6ad4662d11e79308aaf2bfe747ac',
             orgId: commonState.orgId,
         }

     }
     jumpToTabPage = (record ,isAdd) => {
         if (isAdd) {
             this.listMoreOperations.cancel();
             localStorage.removeItem('locations');
             localStorage.removeItem('locationName');
             browserHistory.push(`/equipment/location/location_1?add_location=1`);
         } else {
             let json = {};
             json.id = record.id;
             json.code = record.code;
             json.description = record.description;
             json.status = record.status;
             localStorage.setItem('LIST_PARAM', JSON.stringify(this.param));
             localStorage.setItem('locations', JSON.stringify(json));
             browserHistory.push(`/equipment/location/location_1`);
         }
     }
     tableSelectChange = (selectedRows) => {
         this.setState({ selectedRows });
     }

     // 表格事件
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
         this.param.keyword = keywords;
         this.getList();
     }
     getList = (cb) => {
         const { actions } = this.props;
         this.setState({ tableLoading: true });
         actions.getAssetType(this.param, (json) => {
             this.setState({ tableLoading: false ,list:json.result});

         });
     }
//位置体系的批量删除
     locationsDel = () => {
         const { actions } = this.props;
         const selectedRows = this.state.selectedRows;
         const taskParam = {
            ids: selectedRows,
         }
         runActionsMethod(actions, 'locationsDel', taskParam);
         this.setState({
             selectedRows: []
         })
         this.getList();
     }
    

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
          actions.delAssetType(param, (json) => {
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
    //     runActionsMethod(actions, 'locationsDel', param, (json) => {
    //         this.setState({
    //             selectedRowKeys : []
    //         })
    //         callback(json);
    //         this.getList();
    //     });
    // }
    //  // 删除确认
    // showConfirm = (id, text) => {
    //     if (!id) {
    //         message.error('请选择要删除的数据。')
    //     } else {
    //         confirm({
    //             title: `删除 ${text ? text : '数据' }?`,
    //             okText: '删除',
    //             onOk: () => {
    //             	const pathname = window.location.pathname;
    //                 const isDetailsPage = pathname.indexOf('location_1') !== -1;
    //                 this.del(id, (json) => {
    //                     if (json.success) {
    //                         isDetailsPage ? browserHistory.push('/equipment/location/') : this.getList();
    //                     }
    //                 });
    //             }
    //         });
    //     }
    // }
     // 详情页更多操作
    detailsMoreClick = (key) => {
        if (key === '0') {
            this.statusChangeModal.modalShow();
        }
        if (key === '2') { // 详情页删除
            const locations = JSON.parse(localStorage.getItem('locations'));
            this.showConfirm(locations.id, locations.code)
        }
    }
    listToolsComponentWillMount = () => { // 代替 componentWillMount
        this.getList();
    }
     render () {

         const { children, state, commonState, location } = this.props;
         // const data = commonState.locationListData;
         const list =this.state.list;
         // console.log(commonState);

         const getCodeData = state.getCodeData;
         const rowSelection = this.state.rowSelection ?
                             {
                                 selectedRows: this.state.selectedRows,
                                 onChange: this.tableSelectChange,
                             } :
                             null;
         const isAdd = location.query.add_location;

         const location1 = JSON.parse(localStorage.getItem('locations'));

         return children ?
         (
             <div>
                 <div className="top-bar clearfix">
                     <div className="details-title pull-left">
                         <h3>{isAdd ? getCodeData : (location1 && location1.code)}</h3>
                         <span className="eam-tag">{location1 && location1.status}</span>
                         <p>{location1 && location1.description}</p>
                     </div>
                     <div className="list-tools-right pull-right">
                         <BackList location={location}/>
                        {
                            isAdd ?
                            null :
                            <DetailsPagination
                                state={commonState} // 列表数据的state
                                listDataName="locationListData" // 列表数据state名 -> data = state.workOrderListData
                                localStorageName="location1" // onChang 方法内设置的存储名
                                onChange={(record)=>{
                                    let json = {};
                                    json.id = record.id;
                                    json.status = record.status;
                                    json.code = record.code;
                                    json.description = record.description;

                                    localStorage.setItem('locations', JSON.stringify(json));
                                    browserHistory.push('/equipment/');
                                    browserHistory.push(`/equipment/location/location_1`);
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
                         <Link activeClassName="active" to={`/equipment/location/location_1`}><Icon type="check-circle-o" /> 基本信息</Link>
                         {
                             location1 ?
                              <Link activeClassName="active" to={`/equipment/location/location_2`}><Icon type="check-circle-o" /> 关联设备设施</Link>
                              :
                              null
                         }
                         {
                             location1 ?
                             <Link activeClassName="active" to={`/equipment/location/location_3`}><Icon type="check-circle-o" /> 维保记录</Link>
                             :
                             null
                         }
                     </div>
                 </div>
                 {children}
             </div>
         ) :
         (
             <div>
                 <div className="top-bar clearfix">
                     <ListTools
                        title="位置体系"
                        commonState={commonState}
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
                         <MoreOperations
                             style={{float: 'left'}}
                             ref={listMoreOperations => this.listMoreOperations = listMoreOperations}
                             menuData={[
                                 {
                                     icon: 'delete',
                                     text: '批量删除',
                                     confirmText: '确认删除'
                                 }
                             ]}
                             onChange={(key, showCheckbox) => {
                                 let rowSelection;

                                 if (showCheckbox) {
                                     this.setState({ selectedRows: [] }); // 清空选择
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
                             onOk={ ()=> {
                                 this.locationsDel();
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
                                             name: '位置体系',
                                             key: 'locations',
                                             param: {
                                                 orgId:  commonState.orgId,//'e0bc74c4f58611e58c2d507b9d28ddca',
                                                 siteId: commonState.siteId,
                                                 productArray: commonState.productArray,
                                             },
                                             actionsMethod: 'locationsGetTree',
                                             data: 'locationsTreeData',
                                         }
                                     ]
                                 }
                                 onSelect={(id, key) => {
                                     this.param.parentId = id;
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
     }
 }

 export default connect(mapStateToProps, buildActionDispatcher)(LocationComponent);
