/**
 * 项目列表
 */
import React from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { Link } from 'react-router';
import actions from '../../actions/main.js';
import SearchInp from '../../components/common/search_inp.js';

import { Row, Col } from 'antd';
import map from '../../images/map.png';

class InnerComponent extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            resultList: []
        }
    }
    openSite = (id) => {
        window.open(`/main/dashboard?site_level=${id}`);
    }
    searchSite = (keywords) => {
        const { commonState } = this.props;

        const resultList = commonState.siteList.filter((item, i) => {
            return item.name.indexOf(keywords) !== -1
        })
        this.setState({ resultList });
    }
    render () {

        const { commonState } = this.props;

        const resultList = this.state.resultList.length ? this.state.resultList : commonState.siteList

        return (
            <div>     
                <div className="main-nav clearfix">
                    <Link to="/main/dashboard" activeClassName="active">Dashboard</Link>
                    <Link to="/main/site_list" activeClassName="active">项目列表</Link>
                </div>         
                <div className="main-content clear">
                    <div className="eam-card" style={{height: '75%', overflow: 'auto'}}>
                        <img src={map} style={{width: '80%', float: 'right', margin: '30px 30px 0 0'}} alt=""/>
                        <div className="sider-site-list">
                            <h2>项目列表</h2>
                            <div style={{margin: '0 10px'}}>
                                <SearchInp style={{marginTop: 10}} onEnter={keywords => { this.searchSite(keywords) }} />
                            </div>
                            <ul className="site-list">
                                {
                                    resultList.map((item, i) => {
                                        return  (
                                            <li
                                                key={i}
                                                title={item.name}
                                                onClick={() => { this.openSite(item.id) }}
                                            >
                                                <span className="pull-right">{item.city}</span>
                                                <span>{item.name}</span>
                                            </li>
                                        )
                                    })
                                }
                            </ul>
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
        commonState: state.common
    }
}

function buildActionDispatcher(dispatch) {
    return {
        actions: bindActionCreators(actions, dispatch),
    }
}

export default connect(mapStateToProps, buildActionDispatcher)(InnerComponent);