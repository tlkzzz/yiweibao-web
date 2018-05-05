/**
 * Dashboard
 */
import React from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { Link } from 'react-router';
import actions from '../../actions/main.js';


import OrgDashboard from './dashboard/org.js';
import SiteDashboard from './dashboard/site.js';

import { getLevel } from '../../tools/';

import fullScreen from '../../images/full-screen.png';
import quickProject from '../../images/plus.png';
import quickServiceOrder from '../../images/plus.png';

class InnerComponent extends React.Component {
    constructor(props) {
        super(props);
    }
    render () {

        const { state, commonState, actions } = this.props;

        return (
            <div className="dashboard">     
                <div className="main-nav clearfix">
                    {<span className="full-screen">
                        <img src={fullScreen} style={{marginTop: 10, marginRight: 10, float: 'left'}} alt=""/>大屏总览
                    </span>}
                    {<span className="quick-add-serviceorder">
                        <img src={quickProject} style={{marginTop: 10, marginRight: 10, float: 'left'}} alt=""/>添加报修
                    </span>}
                    {<span className="quick-add-project">
                        <img src={quickServiceOrder} style={{marginTop: 10, marginRight: 10, float: 'left'}} alt=""/>创建项目
                    </span>
                    }
                    <Link to="/main/dashboard" activeClassName="active">项目概览</Link>                     
                </div>         
                <div className="main-content clear">
                    {
                        getLevel() === 'ORG_LEVEL' ?
                        <OrgDashboard state={state} commonState={commonState} actions={actions} /> : 
                        <SiteDashboard state={state} commonState={commonState} actions={actions} />
                    }
                </div>
            </div>
        )
    }
}

function mapStateToProps (state) {
    return {
        state: state.main,
        commonState: state.common,
    }
}

function buildActionDispatcher(dispatch) {
    return {
        actions: bindActionCreators(actions, dispatch),
    }
}

export default connect(mapStateToProps, buildActionDispatcher)(InnerComponent);