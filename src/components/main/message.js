/**
 * 项目列表 
 */
import React from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { Link } from 'react-router';
import actions from '../../actions/main.js';

import { Row, Col } from 'antd';

class InnerComponent extends React.Component {
    constructor(props) {
        super(props);
    }
    render () {
        return (
            <div>     
                <div className="main-nav clearfix">
                    <Link to="/main/message" activeClassName="active">消息通知</Link>
                    <Link to="/main/bulletin" activeClassName="active">组织公告</Link>
                </div>         
                <div className="main-content clear">
                    <ul className="eam-card">
                        <li>
                            <h3>管理员：</h3>
                            <h2>湖南省博物馆项目通知</h2>
                            <p>这里是通知内容通知内容通知内容通知内容通知内容通，知内容通知内容通知内容通，知内容通知，内容通知内容通知内容通知内容通知内容通知内容通知内容通知内容通知内容通容通知内容通知知内容。</p>
                            <div>
                                <span>2017-06-20 09:00</span>
                                <span className="blue">有效期：1个月</span>
                            </div>
                        </li>
                        <li>
                            <h3>管理员：</h3>
                            <h2>湖南省博物馆项目通知</h2>
                            <p>这里是通知内容通知内容通知内容通知内容通知内容通，知内容通知内容通知内容通，知内容通知，内容通知内容通知内容通知内容通知内容通知内容通知内容通知内容通知内容通容通知内容通知知内容。</p>
                            <div>
                                <span>2017-06-20 09:00</span>
                                <span className="blue">有效期：1个月</span>
                            </div>
                        </li>
                        <li>
                            <h3>管理员：</h3>
                            <h2>湖南省博物馆项目通知</h2>
                            <p>这里是通知内容通知内容通知内容通知内容通知内容通，知内容通知内容通知内容通，知内容通知，内容通知内容通知内容通知内容通知内容通知内容通知内容通知内容通知内容通容通知内容通知知内容。</p>
                            <div>
                                <span>2017-06-20 09:00</span>
                                <span className="blue">有效期：1个月</span>
                            </div>
                        </li>
                        <li>
                            <h3>管理员：</h3>
                            <h2>湖南省博物馆项目通知</h2>
                            <p>这里是通知内容通知内容通知内容通知内容通知内容通，知内容通知内容通知内容通，知内容通知，内容通知内容通知内容通知内容通知内容通知内容通知内容通知内容通知内容通容通知内容通知知内容。</p>
                            <div>
                                <span>2017-06-20 09:00</span>
                                <span className="blue">有效期：1个月</span>
                            </div>
                        </li>
                        <li>
                            <h3>管理员：</h3>
                            <h2>湖南省博物馆项目通知</h2>
                            <p>这里是通知内容通知内容通知内容通知内容通知内容通，知内容通知内容通知内容通，知内容通知，内容通知内容通知内容通知内容通知内容通知内容通知内容通知内容通知内容通容通知内容通知知内容。</p>
                            <div>
                                <span>2017-06-20 09:00</span>
                                <span className="blue">有效期：1个月</span>
                            </div>
                        </li>
                    </ul>
                </div>
            </div>
        )
    }
}

function mapStateToProps (state) {
    return {
        state: state.main
    }
}

function buildActionDispatcher(dispatch) {
    return {
        actions: bindActionCreators(actions, dispatch),
    }
}

export default connect(mapStateToProps, buildActionDispatcher)(InnerComponent);