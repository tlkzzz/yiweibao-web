/** 
 * @Description 经办任务
 */
import React from 'react';
import {bindActionCreators} from 'redux';
import {Link} from 'react-router';
import {connect} from 'react-redux';
import PubSub  from 'pubsub-js';
import { pubTopic } from '../../tools/constant';
import commonActions from '../../actions/common.js';
import actions from '../../actions/main.js';
import SearchInp from '../../components/common/search_inp.js';

import {Icon, Button, Table, Pagination, Menu, Modal, message,Badge} from 'antd';

class HandleComponent extends React.Component {
    constructor(props) {
        super(props);

    }

    // 模糊查询
    fuzzyQuery = (keywords) => {
        const { state} = this.props;
        switch(state.currentTab)
        {
            case "ALL":
                PubSub.publish(pubTopic.task.HANDILING_TASK.ALL,keywords);
                break;
            case "patrolOrder"://巡检
                PubSub.publish(pubTopic.task.HANDILING_TASK.PATROLORDER,keywords);
                break;
            case "workOrder"://维保
                PubSub.publish(pubTopic.task.HANDILING_TASK.WORKODER,keywords);
                break;
            case "headquartersDaliyTask"://例行工作单
                PubSub.publish(pubTopic.task.HANDILING_TASK.DAILYTASK,keywords);
                break;
            case "dispatchOrder"://派工单
                PubSub.publish(pubTopic.task.HANDILING_TASK.DISPACHORDER,keywords);
                break;
            case "repairOrder"://报修
                PubSub.publish(pubTopic.task.HANDILING_TASK.REPAIRORDER,keywords);
                break;
        }
       // PubSub.publish(pubTopic.task.HANDLE_QUERY_KEYWORD,keywords);
    }

    renderChildren=(props)=> {
        // console.log("-------renderChildren-------",props);
        //遍历所有子组件
        return React.Children.map(props.children, child => {
                return React.cloneElement(child, {
                    //把父组件的props.name赋值给每个子组件
                    name: props.keywords
                })
        })
    }
    //显示全部
    getAll=(data)=>{



        console.info(data);

        const { state} = this.props;
        const buttonStatus=state.getAllStatus;
        let button;
        if(buttonStatus){//true
            state.getAllStatus=false;
            button="GET_ALL"
        }else{//false
            state.getAllStatus=true;
            button="GET_NO_CLOSE"
        }
        switch(state.currentTab)
        {
            case "ALL":
                PubSub.publish(pubTopic.task.HANDILING_TASK.ALL,button);
                break;
            case "patrolOrder"://巡检
                PubSub.publish(pubTopic.task.HANDILING_TASK.PATROLORDER,button);
                break;
            case "workOrder"://维保
                PubSub.publish(pubTopic.task.HANDILING_TASK.WORKODER,button);
                break;
            case "headquartersDaliyTask"://例行工作单
                PubSub.publish(pubTopic.task.HANDILING_TASK.DAILYTASK,button);
                break;
            case "dispatchOrder"://派工单
                PubSub.publish(pubTopic.task.HANDILING_TASK.DISPACHORDER,button);
                break;
            case "repairOrder"://报修
                PubSub.publish(pubTopic.task.HANDILING_TASK.REPAIRORDER,button);
                break;
        }
    }

    getMyTaskLogo=()=>{

        const { state,actions,commonState} = this.props;
        // let param={
        //     siteId:commonState.siteId
        // }
        actions.repairStatistics({},(json)=>{
            console.log(json)


        })
    }

    componentWillMount() {


        this.getMyTaskLogo();
    }

    render() {

        const {children, state} = this.props;
        const buttonStatus=state.getAllStatus;
        const myTaskLogo=state.myTaskLogo
            // getAllStatus:true,//获取全部按钮，true:获取非关闭，false：全部
        // console.log("---handle-----render-----", this.props);
        return (
            <div>
                <div className="top-bar clearfix">
                    <div className="details-title pull-left">
                        <h3>报修统计</h3>
                        <div className="fuzzy-query"><SearchInp onEnter={(text) => {
                            this.fuzzyQuery(text)
                        }}/></div>
                        <p></p>
                    </div>
                    <div className="eam-tab-nav">
                        <Link activeClassName="active" to="/task/handle/handle_tab1">全部</Link>
                        <Badge count={myTaskLogo?myTaskLogo.repairOrder:0} overflowCount={100}>
                            <Link activeClassName="active" to="/task/handle/handle_tab2">报修工单</Link>
                        </Badge>
                        <Badge count={myTaskLogo?myTaskLogo.workOrder:0} overflowCount={100}>
                            <Link activeClassName="active" to="/task/handle/handle_tab3">维保工单</Link>
                        </Badge>
                        <Badge count={myTaskLogo?myTaskLogo.dispatchOrder:0} overflowCount={100}>
                            <Link activeClassName="active" to="/task/handle/handle_tab4">派工工单</Link>
                        </Badge>
                        <Badge count={myTaskLogo?myTaskLogo.patrolOrder:0} overflowCount={100}>
                            <Link activeClassName="active" to="/task/handle/handle_tab5">巡检工单</Link>
                        </Badge>
                        <Badge count={myTaskLogo?myTaskLogo.headquartersDaliyTask:0} overflowCount={100}>
                            <Link activeClassName="active" to="/task/handle/handle_tab6">例行工作单</Link>
                        </Badge>
                        <Button type="primary" className="pull-right" onClick={this.getAll}> {buttonStatus?"显示全部":"取现显示全部"} </Button>
                    </div>
                </div>
                {children}
            </div>
        )
    }
}


function mapStateToProps (state) {
    return {
        state: state.main,
        // commonState: state.common,
    }
}



function buildActionDispatcher(dispatch) {
    return {
        actions: bindActionCreators(actions, dispatch),
        // commonActions:bindActionCreators(commonActions, dispatch),
    }
}

export default connect(mapStateToProps, buildActionDispatcher)(HandleComponent);