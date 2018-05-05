/** 
 * @Description  二维码主界面
 */
import React from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { Link , browserHistory } from 'react-router';
import actions from '../../actions/main.js';
import commonActions from '../../actions/common';

import Collection from '../../components/common/collection.js';
import Dropdown from '../../components/common/dropdown.js';
import ListTools from '../../components/common/list_tools.js';
import DetailsPagination from '../common/details_pagination.js';
import MoreOperations from '../../components/common/more_operations.js';
import BackList from '../common/back_list';

import { Icon, Checkbox, Modal, Button, Table, Form, Input, Pagination, Menu, message,Avatar} from 'antd';
const confirm = Modal.confirm;

class CustomerComponent extends React.Component {
	constructor(props) {
        super(props);
        this.state = {
            currentPage: 1,
            tableLoading: false,
            rowSelection: null, // 表格多选
            selectedRows: [],
            list:{},
        }
         this.param = {
            pageNum: 1,
            pageSize: 10,
            keywords:'',
        }
}
//页面初始化事件
componentWillMount () {
        this.getList();
    }

// 获取列表数据
    getList = () => {
        const { actions } = this.props;
        this.setState({ tableLoading: true });
        actions.getCustomer(this.param, (json) => {
            this.setState({ tableLoading: false,list:json.result });
            console.log(json);

        });
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
    // 表格事件---排序部分
    tableChange = (pagination, filters, sorter) => {
        // if (sorter.order) {
        //     let sorterOrder = sorter.order;
        //     let endIndex = sorterOrder.indexOf('end');
        //     sorterOrder = sorterOrder.slice(0, endIndex);
        //     this.param.sorts = `${sorter.field} ${sorterOrder}`;
        // } else {
        //     this.param.sorts = '';
        // }
        // this.getList();
     }
   // 删除二维码管理
    moreClick = () => {
        if(this.state.selectedRows) {
            this.showConfirm(this.state.selectedRows)
        }else{
            message.error('请选择要删除的数据。')
        }
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
          actions.delCustomer(param, (json) => {
            if(json.code==200){
                   message.success('删除成功');
                    this.getList();
            }else{
                  message.error(json.msg);
            }

        });



    }
    // 模糊查询
    fuzzyQuery = (keywords) => {
        this.param.keywords = keywords;
        this.getList();
    }  
    jumpToTabPage = (record , isAdd) => {
        // if (isAdd) {
        //     this.listMoreOperations.cancel();
        //     localStorage.removeItem("code");
            browserHistory.push(`/main/settings/customer_add`);
        // } else {
        //     localStorage.removeItem("getCodeData");
        //     let json = {};
        //     json.id = record.id;
        //     json.code = record.quickResponseCodeNum;
        //     json.description = record.description;
        //     json.statusName = correspondenceJson.code[record.status].text;

        //     localStorage.setItem('LIST_PARAM', JSON.stringify(this.param));
        //     localStorage.setItem('code', JSON.stringify(json));
        //     browserHistory.push(`/main/settings/code/code_detail`);
        //     this.setState({
        //         rowSelection: null,
        //     })
        // }
    //    localStorage.removeItem("getCodeData");
    //    browserHistory.push(`/main/code/code_detail?id=${record.id}&code=${record.quickResponseCodeNum}&description=${record.description}&statusName=${correspondenceJson.code[record.status].text}`);
    }

    customer_state =(e)=>{
        if(e==1){
            return '正常'
        }else if(e==2){
            return '暂停'
        }else if(e==3){
            return '未审核'
        }else if(e==4){
            return '审核不通过'
        }
    }

    render () {
        // 高级筛选选项数据
        const seniorFilterSelectArr = [ [],[],];

        const rowSelection = this.state.rowSelection ? {selectedRows: this.state.selectedRows,onChange: this.tableSelectChange,} :null;
        const  list = this.state.list;



 const columns  = [
            {
                title: '头像',
                dataIndex: 'tcPhoto',
                key: 'tcPhoto',
                sorter: true,
                render: val =><Avatar src={val} />
            },
            {
                title: '客户昵称',
                dataIndex: 'tcName',
                key: 'tcName',
                sorter: true,
            },
            {
                title: '网点名称',
                dataIndex: 'tspName',
                key: 'tspName',
                sorter: true,
            },
            {
                title: '登录账号',
                dataIndex: 'tcLoginUser',
                key: 'tcLoginUser',
                sorter: true,
            },{
                title: '联系人',
                dataIndex: 'tcPerson',
                key: 'tcPerson',
                sorter: true,
            },{
                title: '联系电话',
                dataIndex: 'tcMobile',
                key: 'tcMobile',
                sorter: true,
            },
             {
                title: '联系地址',
                dataIndex: 'address',
                key: 'address',
                sorter: true,
            },{
                title: '注册时间',
                dataIndex: 'tcAddDate',
                key: 'tcAddDate',
                sorter: true,
            },
            {
                title: '状态',
                dataIndex: 'tcStatus',
                key: 'tcStatus',
                sorter: true,
                render:val => <span>{this.customer_state(val)}</span>
            },
            {
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
                                    this.showConfirm(record.tcId, record.tcName)
                                }}
                            />
                        </div>
                    )
                }
            },
        ];


        return (
             <div>
             <div className="main-nav clearfix">
                        {/*<Link to="/main/settings/ip" activeClassName="active">IP管理</Link>*/}
                        <Link to="/main/settings/company" >公司信息</Link>
                        <Link to="/main/settings/employee" >员工管理</Link>
                         <Link to="/main/settings/customer" activeClassName="active">客户管理</Link>
                        <Link to="/main/settings/servicePoints" >项目管理</Link>
                        <Link to="/main/settings/code" >二维码管理</Link>
                             <Link to="/main/settings/product" >商品管理</Link>
                         <Link to="/main/settings/item" >故障类型</Link>
                          <Link to="/main/settings/brand" >品牌管理</Link>
                           <Link to="/main/settings/serviceFees" >售后套餐</Link>
                    </div>
                    <div className="main-content clear ">
                    <div>
                        <div className="top-bar clearfix  eam-card ip-main-commonMargin">
                                <ListTools
                                    title="客户管理"
                                    onEnter={(text) => {
                                        this.fuzzyQuery(text);
                                    }}
                                    conditionList={seniorFilterSelectArr}
                                />
                                <div className="list-tools-right pull-right">
                                    <Pagination
                                        total={list.total}
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
                                            this.moreClick();
                                        }}
                                    />
                                    <Button type="primary" size="large" onClick={this.jumpToTabPage}>新建</Button>
                                </div>
                            </div>
                            <div className=" eam-card eam-content ip-main-commonMargin">
                                <div className="eam-content-inner">
             
                                    <Table
                                        loading={this.state.tableLoading}
                                        rowKey="tcId"
                                        pagination={false}
                                        dataSource={list.rows} // ***渲染数据
                                        columns={columns}
                                        rowSelection={rowSelection}
                                        bordered
                                        onChange={this.tableChange}
                                    />
                                     <Pagination
                                        total={list.total}
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
                </div>
            )
      }
}


function mapStateToProps (state) {
    return {
        state: state.main,
    }
}

function buildActionDispatcher(dispatch) {
    return {
        actions: bindActionCreators(actions, dispatch),
    }
}

export default connect(mapStateToProps, buildActionDispatcher)(CustomerComponent);
