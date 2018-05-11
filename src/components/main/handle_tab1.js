/** 
 * @Description 经办任务-全部
 */
import React from 'react';
import {bindActionCreators} from 'redux';
import { Link,browserHistory } from 'react-router';
import {connect} from 'react-redux';
import PubSub  from 'pubsub-js';
import { pubTopic } from '../../tools/constant';
import repairactions from '../../actions/matter_repair.js';
import commonActions from '../../actions/common.js';
import actions from '../../actions/main.js';
import { correspondenceJson } from '../../tools/';

import {Icon, Button, Table, Form, Pagination, Row, Col, Menu, Modal, message,Badge} from 'antd';
import SearchInp from '../../components/common/search_inp.js';//模糊查询
import Multiselect from '../../components/common/multiselect.js';

class AllHandleWorkOrderComponent extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            tableLoading: false,
            currentPage: 1,
            data:{},
        }
        // PubSub.subscribe(pubTopic.task.HANDLE_QUERY_KEYWORD, this.queryKeyword );
        // PubSub.subscribe(pubTopic.task.HANDILING_TASK.ALL, this.getPush );
        //表格多选

 

        this.param = {
            pageNum: 1,
            pageSize: 10,
            state:1,
            keywords:'',
        };

      
        //表格字段
        this.columns = [
            {
                title: '工单编号',
                dataIndex: 'tso_number',
                key: 'tso_number',
                // sorter: true,
                render: (text, record, key) => {
                    return (
                        <p><span className="order-number" onClick={() => {this.jumpToTabPage(record)}}>{text ? text : '-'}</span></p>
                    )
                }
            },
            {
                title: '报修人(单位)',
                dataIndex: 'tc_person',
                key: 'tc_person',
                // sorter: true,
                //render: defaultRender
            },
            {
                title: '报修产品',
                dataIndex: 'tso_good_name',
                key: 'tso_good_name',
                // sorter: true,
                
            },

            {
                title: '客户地址',
                dataIndex: 'tc_address',
                key: 'tc_address',
                sorter: true,
                // render: defaultRender
            },
            {
                title: '报修时间',
                dataIndex: 'tso_add_date',
                key: 'tso_add_date',
                sorter: true,
                // render: defaultRender
            }
            ,
            {
                title: '状态',
                dataIndex: 'tso_status',
                key: 'tso_status',
                sorter: true,
                render:val => <span>{this.customer_state(val)}</span>
            }
        ];
    }

customer_state =(e)=>{
        if(e==1){
            return '客户报修'
        }else if(e==2){
            return '已派工'
        }else if(e==3){
            return '待维修'
        }else if(e==4){
            return '维修中'
        }else if(e==5 ||e==7 ||e==6){
            return '维修完成'
        }else if(e==6){
            return '已取消'
        }
    }



    //跳转
    jumpToTabPage = (record) => {
        browserHistory.push(`/patrol/order/${status.path}?from=/task/handle/handle_tab1`);
    }
    //获取推送
    getPush=(mag,data)=>{
  
     if(data!=null&&data!=undefined){//模糊查询
       this.queryKeyword(null,data)
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
            this.param.sorts = 'sorts:createTime desc';
        }
        this.queryAction.myTaskHandleGetAllList(this.param);
    }
    // 分页事件
    pageChange = (page, pageSize) => {
        this.setState({currentPage: page});
        this.param.pageNum = page;
        this.queryAction.myTaskHandleGetAllList(this.param);
    }
    
    //获取状态数据
    getStatusData=()=>{//获取数据
        const {actions} = this.props.parentProps;
      
     this.setState({tableLoading:true})
        actions.repairStatisticsList(this.param,(json)=>{
            console.log(json)

            this.setState({data:json.result,tableLoading:false})
        })


    }
    componentWillMount () {
        // const { parentProps } = this.props;
        // const { state } = parentProps
        // this.param.word=parentProps.state.keyword;
        // this.queryAction.myTaskHandleGetAllList(this.param );
        this.getStatusData();
        // state.currentTab="ALL";
    }
    queryKeyword = (ss,keywords) =>{
          this.param.keywords = keywords;
           this.getStatusData();
        // console.info("1")
        // if(data){
        //     this.param.word = data;
        // }else{
        //     this.param.word = '';
        // }
        // this.queryAction.myTaskHandleGetAllList(this.param);
    }
   
    render() {
        const { parentProps } = this.props;
        const { state } = parentProps;
        const data = this.state.data;
        const list =  data==null?[]:data.rows;
        return (
                <div className="eam-content-inner">
                    <Table
                        rowKey="tso_id"
                        loading={this.state.tableLoading}
                        pagination={false}
                        dataSource={list}
                        columns={this.columns}
                        bordered
                        onChange={this.tableChange}
                        className="task-eam-card"
                    />
                    <Pagination
                        total={data.rowcount}
                        showTotal={(total, range) => `当前第${range[0]}-${range[1]}条 / 共${total}条`}
                        current={this.state.currentPage}
                        showQuickJumper
                        onChange={this.pageChange}
                    />
                </div>
        )
    }
}


class HandleOneComponent extends React.Component {
	 constructor(props) {
        super(props);
        const {state, actions, commonState,parentProps} = this.props;
        this.state = {
            number :{},

       }
   }
     
 
    //获取小标数量
	getTaskMiniNum = () => {
		const {actions, commonState} = this.props;
		
	
         actions.repairStatistics({},(json)=>{
            console.log(json)
                    this.setState({number:json.result});
        })
	}

    componentWillMount() {
      
		this.getTaskMiniNum();
    }
    render () {
    	const {children,state} = this.props;
        const {number} =this.state;
      
        return (
            <div>   
           		 <div className="main-nav clearfix">
                  
                    <Link to="/main/task/handle_tab1" activeClassName="active">经办任务</Link>
                </div>  
                    
                <div className="main-content clear">
                    <div className="eam-tab-page">
		                <div className="eam-content">
		                	<div className="eam-card eam-task-condition clearfix">
			                    <div className="eam-task-tab-nav">
			                    	<Link activeClassName="active" className="eam-task-tab-nav-a"  to="/main/task/handle_tab1">全部<span>{number.repairAll ? number.repairAll>99?'99+':number.repairAll : 0}</span></Link>
			                    	
			                    	<Link activeClassName="active" className="eam-task-tab-nav-a"  to="/main/task/handle_tab2">今日报修<span>{number.repairToday ? number.repairToday>99?'99+':number.repairToday : 0}</span></Link>
			                    	
			                    	<Link activeClassName="active" className="eam-task-tab-nav-a"  to="/main/task/handle_tab3">待派工<span>{number.strWaitAssign ? number.strWaitAssign>99?'99+':number.strWaitAssign : 0}</span></Link>
			                    	
			                    	<Link activeClassName="active" className="eam-task-tab-nav-a"  to="/main/task/handle_tab4">已完成<span>{number.strTodayComplete ? number.strTodayComplete>99?'99+':number.strTodayComplete : 0}</span></Link>
			                    	
			                    	<Link activeClassName="active" className="eam-task-tab-nav-a"  to="/main/task/handle_tab5">未完成<span>{number.strTodayNoComplete ? number.strTodayNoComplete>99?'99+':number.strTodayNoComplete : 0}</span></Link>
			                    	
			                    	
			                 </div>   
		                	</div>   
		                	<div >
			                    <div style={{paddingLeft: 12, background: 'white',position:'relative'}} className="eam-card task-eam-card">
			                        <div style={{height:55}}>
			                           
			                        </div>
			                        <div className="fuzzy-query handle-fuzzy-query">
			                        	<SearchInp onEnter={(text) => {this.fuzzyQuery(text)}}/>
			                        </div>
				                    <p></p>
			                    </div>
		                    	<AllHandleWorkOrderComponent parentProps={this.props} />
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
        //commonState: state.common,
    }
}



function buildActionDispatcher(dispatch) {
    return {
        actions: bindActionCreators(actions, dispatch),
       // commonActions:bindActionCreators(commonActions, dispatch),
      //  repairactions:bindActionCreators(repairactions, dispatch),
    }
}

export default connect(mapStateToProps, buildActionDispatcher)(HandleOneComponent);