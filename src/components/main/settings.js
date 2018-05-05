/**
 * 设置 
 */
import React from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import actions from '../../actions/main.js';

class InnerComponent extends React.Component {
    constructor(props) {
        super(props);
    }
    render () {
        return (
            <div>
                设置
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