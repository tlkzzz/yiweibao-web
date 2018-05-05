/** 
 * @Description 报表
 */
import React from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import actions from '../../actions/report.js';

class ReportComponent extends React.Component {
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

export default connect(mapStateToProps, buildActionDispatcher)(ReportComponent);