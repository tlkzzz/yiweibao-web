/** 
 * @Description 巡更管理
 */
import React from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import actions from '../../actions/index.js';

class GuardTourComponent extends React.Component {
    constructor(props) {
        super(props);
    }
    render () {
        return (
            <div>
                {this.props.children}
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

export default connect(mapStateToProps, buildActionDispatcher)(GuardTourComponent);