// 销售订单   sales_order.js
// 
//售后订单 after_sale_order.js
/**
 * 维保保养-维保工单 
 */
import React from 'react';
import {bindActionCreators} from 'redux';
import {Link, browserHistory} from 'react-router';
import {connect} from 'react-redux';
import actions from '../../actions/maintenance.js';
import PubSub  from 'pubsub-js';
import moment from 'moment';
import {pubTopic} from '../../tools/constant';
import Collection from '../../components/common/collection.js';
import Dropdown from '../../components/common/dropdown.js';
import BackList from '../../components/common/back_list.js';
import ListTools from '../../components/common/list_tools.js';
import commonActions from '../../actions/common.js';
import EAModal from '../../components/common/modal.js';
import StatusChangeForm from '../../components/common/statusChange.js';
import SendProcess from '../../components/common/send_process_util.js';
import MoreOperations from '../../components/common/more_operations.js';
import DetailsPagination from '../../components/common/details_pagination.js';
import SelectPerson from '../../components/common/select_person.js';
import {correspondenceJson,businessJson,filterArrByAttr,runActionsMethod } from '../../tools/';
import {Icon, Button,Form,Table, Pagination,Select, Menu,Input, Modal, DatePicker,message,Avatar} from 'antd';
const confirm = Modal.confirm;
const Option = Select.Option;
const FormItem = Form.Item;

class SalesOrderComponent extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            tableLoading: false,
            visibleProcess:false,
            currentPage: 1,
            selectedRowKeys: [],
            rowSelection: null, // 表格多选
            moreOperationsKey: '',
             list:{},
             product:[],
             selectPersonModalShow:false,
             selectId:'',
        }
     


        //表格字段
        //表格字段
        this.columns = [
            {
                title: '工单编号',
                dataIndex: 'tsoNumber',
                key: 'tsoNumber',
                render: (text, record, key) => {
                    return (
                        <p><a className="order-number" onClick={() => { this.jumpToDetail(record) }}>{text ? text : '-'}</a></p>
                    )
                }
            },
            {
                title: '商品/设备名称',
                dataIndex: 'tpName',
                key: 'tpName',
                sorter: true,
            },
            // {
            //     title: '型号',
            //     dataIndex: 'specJsonValue',
            //     key: 'specJsonValue',
            // },
            {
                title: '报修人',
                dataIndex: 'tmName',
                key: 'tmName',
            },{
                title: '联系电话',
                dataIndex: 'tcMobile',
                key: 'tcMobile',
                sorter: true,
            },
            {
                title: '联系地址',
                dataIndex: 'tcAddress',
                key: 'tcAddress',
            },
            {
                title: '提报时间',
                dataIndex: 'tsoAddDate',
                key: 'tsoAddDate',
                sorter: true,
            },
            {
                title: '状态',
                dataIndex: 'tsoStatus',
                key: 'tsoStatus',
                sorter: true,
                render: val => <span>{this.workOrder_state(val)}</span>
            },
            {
                title: '操作',
                dataIndex: '4',
                key: '4',
                width: 120,
                render: (text, record, key) => {
                    return (
                        <div className="table-icon-group">
                          {/**  <Collection
                                isCollect={record.collect}
                                onChange={checked => {
                                    this.collect(checked, record.tsoId);
                                }}
                            /> */}
                            {
                                record.tsoStatus == 1 ?
                                <Icon
                                    type="user-add"
                                    onClick={() => {
                                        this.selectPerson(record.tsoId)
                                    }}
                                /> 
                                  
                                :
                                 <Icon
                                    type="search"
                                    onClick={() => {
                                        this.jumpToDetail(record)
                                    }}
                                /> 
                            }
                            
                        </div>
                    )
                }
            },
        ];
        //分页参数
        this.param = {
            pageNum: 1,
            pageSize: 10,
            tsoType : 1,//1:普通报修 2:售后报修
            tsoStatus : '',//所有工单状态
            keywords:'',
        };
    }
    //派工
    selectPerson = (v)=>{
        this.setState({selectPersonModalShow:true,selectId:v});
    }
    //选择人员回调
    setFieldsValue=(val)=>{
         //选择人员回调

          const { actions,location} = this.props;
            //获取工单详情
         actions.dispatch({tseId:val.Id,tsoId:this.state.selectId}, (json) => {
                console.log(json)
                // this.setState({detail:json.result})
               if(json.code==200){
                 message.success(json.msg);
                    this.getList();
               }else{
                    message.error(json.msg);


               }
          });

    }

    jumpToDetail =(e)=>{
             // browserHistory.push("/order/work_order_dfp_details",{ tsoId: e.tsoId });
             browserHistory.push({ pathname: '/order/work_order_dfp_details', state: { tsoId: e.tsoId}});
    }



    //状态
  workOrder_state=(e)=>{
          if(e==1){
            return '待派工'
        }else if(e==2){
            return '待确认'
        }else if(e==3){
            return '待维修'
        }else if(e==4){
            return '维修中'
        }else if(e==5){
            return '已维修'
        }else if(e==6){
            return '已支付'
        }else if(e==7){
            return '已完成'
        }

    }
    //列表状态操作
     stateOperation = (id,e,number)=>{
     	if(e==2){
     		return ( <div>  <Icon  type="export"/></div> );
     	}else if(e==1 || e==3){
     		return (<div></div>);

     	}else if(e==4 || e==5 ||e ==4){
     		return (<Icon type="delete" onClick={() => {this.showConfirm(id, number,e)}}/>);

     	}

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
        this.setState({currentPage: page});
        this.param.pageNum = page;
        this.getList();
    }
    // 获取列表数据
    getList = () => {
        const {actions, commonState} = this.props;
 
        this.setState({tableLoading: true});
      
         actions.getWorkOrderList(this.param, (json) => {
         
            this.setState({ tableLoading: false,list:json.result });

            // this.setState({product:json.result?json.result.product:[]})


            console.log(json);
        });
    }

 



  
    //获取选中值
    tableSelectChange = (selectedRowKeys) => {
        this.setState({selectedRowKeys});
    }
    // 更多操作
    moreClick = (e) => {
        // const {state} = this.props;
        // let rows=this.state.selectedRowKeys;
        // if (e=== '0') { //变更状态

        //     this.statusChangeModal.modalShow();
        // }
        // if (e=== '1') { //批量删除
        //     this.showConfirm(rows);
        // }
        // if (e === '2') {
        //     if (Array.isArray(rows) && !rows.length) {
        //         message.error('请选择要派工的数据。')
        //     } else {
        //         confirm({
        //             title: `是否将选中的 ${(rows.length + '条数据进行派工处理')}?`,
        //             okText: '批量派工',
        //             onOk: () => {
        //                 // if (Array.isArray(rows)) rows = rows.join(',')
        //                 // state.dispatchId=rows;
        //                 // this.dispatchModal.modalShow();
        //             }
        //         });
        //     }
        // }
    }

   

   
    // 列表删除
    del = (id,type) => {
        const {actions} = this.props;
        let param = {ids: id};
   
        actions.delSalesOrder(param, (json) => {
            // if (json.success) {
            //     this.state.selectedRowKeys = [];
            //     message.success(json.msg);
            //     this.getList()

            //     if(type){
            //         this.jumpToTabPage("",true);//详细页删，重新跳转为新建数据
            //     }
            // } else {
            //     message.error(json.msg);
            // }
            if(json.code==200){
  			    this.state.selectedRowKeys = [];
                message.success('删除成功');
                this.getList()
            }else {
            	message.error(json.msg);
            }



        });
    }
    // 删除确认
    showConfirm = (id, text,type) => {
        if (Array.isArray(id) && !id.length) {
            message.error('请选择要删除的数据。')
        } else {
            confirm({
                title: `删除 ${text ? text : (id.length + '条数据')}?`,
                okText: '删除',
                onOk: () => {
                    // if (Array.isArray(id)) {
                    //     id = id.join(',')
                    // }
                    this.del(id,type);

                }
            });
        }
    }
   
    
   

   
    // 模糊查询
    fuzzyQuery = (keywords) => {
        this.param.keywords = keywords;
        this.getList();
    }
  


    componentWillMount() {
        this.getList();
       
    }
    //数量*单价
    todPrices = (e)=>{
    	return e.todCount * e.todPrice;
    }

    expandedRowRender = (e)=>{
    	e.forEach((value,key,arr)=>{
		  value.tpId=key;
    	})

    	 const columns = [
      { title: '图片', dataIndex: 'tpLogo', key: 'tpLogo',render: (val) => <Avatar src={val} /> },
      { title: '商品名称', dataIndex: 'tpName', key: 'tpName' },
      { title: '型号',dataIndex: 'specJsonValue', key: 'specJsonValue'},
       { title: '数量', dataIndex: 'todCount',key: 'todCount'},
      { title: '金额', dataIndex: 'todPrice', key: 'todPrice',render :(text, record, key)=> this.todPrices(record) },
    ];
 		return (
		      <Table
		        rowKey="tpId"
		        columns={columns}
		        dataSource={e}
		        pagination={false}
		      />
  		  );
    }


    render() {
        const {children, state,location} = this.props;
        // 高级筛选选项数据
        const seniorFilterSelectArr = [ [],[],];
       const list = this.state.list;
       // const product = this.state.product;
      
          const rowSelection = this.state.rowSelection ? {selectedRows: this.state.selectedRows,onChange: this.tableSelectChange,} :null;
     
        return ( <div>
                    <div className="top-bar clearfix">
                        <ListTools
                            title="维保工单"
                  
                            onEnter={(text) => {
                                this.fuzzyQuery(text);
                            }}
                           
                            conditionList={seniorFilterSelectArr}
                        />
                        <div className="list-tools-right pull-right">
                            <Pagination
                                total={list.total}
                                className="pull-left"
                                defaultPageSize={this.param.pageSize}
                                current={this.state.currentPage}
                                onChange={this.pageChange}
                            />
                            <MoreOperations
                                style={{float: 'left'}}
                                menuData={[
                                    {
                                     icon: 'edit',
                                     text: '变更状态',
                                     confirmText: '确认变更'
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
                            <Button type="primary" size="large" onClick={() => { this.jumpToTabPage('', true) }}>新建</Button>
                          
                        </div>
                    </div>
                    <div className="eam-content">
                        <div className="eam-content-inner">
                                <Table
                            rowKey="tsoId"
                            loading={this.state.tableLoading}
                            pagination={false}
                            dataSource={list.rows}
                             columns={this.columns}
                            rowSelection={rowSelection}
                            bordered
                            onChange={this.tableChange}
                        />
                        <Pagination
                            total={list.total}
                            showTotal={(total, range) => `当前第${range[0]}-${range[1]}条 / 共${total}条`}
                            current={this.state.currentPage}
                            showQuickJumper
                            onChange={this.pageChange}
                        />
                        </div>
                    </div>
                 
                              <SelectPerson
                                    multiple={false}
                                    visible={this.state.selectPersonModalShow}
                                    selectPersonModalHide={() => {
                                        this.setState({selectPersonModalShow: false})
                                    }}
                                    onOk={(selected) => {
                                        let json = {
                                            ["Name"]: selected.tseName,
                                            [ 'Id']: selected.tseId,
                                            ['Mobile']: selected.tseMobile,
                                        }
                                        this.setFieldsValue(json);
                                    }}
                                   />






                </div>
            	)
               
}
}

function mapStateToProps(state) {
    return {
        state: state.maintenance,
    }
}

function buildActionDispatcher(dispatch) {
    return {
        actions: bindActionCreators(actions, dispatch),
    }
}

export default connect(mapStateToProps, buildActionDispatcher)(SalesOrderComponent);