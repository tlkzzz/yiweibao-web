/**
 * Dashboard 
 */
import React from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import actions from '../../actions/index.js';
import { FormattedMessage } from 'react-intl';

import { Layout } from 'antd';

const { Content } = Layout;

class IndexComponent extends React.Component {
    constructor(props) {
        super(props);
    }
    componentWillMount () {
        window.location.href = '/main/dashboard';
    }
    render () {
        return (
            <div>
                页面加载中...
                {/*<FormattedMessage id="app.title" />*/}
            </div>
        )
    }
}

function mapStateToProps (state) {
    return {
        state: state
    }
}

function buildActionDispatcher(dispatch) {
    return {
        actions: bindActionCreators(actions, dispatch),
    }
}

export default connect(mapStateToProps, buildActionDispatcher)(IndexComponent);