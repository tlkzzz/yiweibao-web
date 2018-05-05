/**
 * @Description 档案管理
 */
import React from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import actions from '../../actions/archives_managent.js';

class ArchivesComponent extends React.Component {
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

export default connect(mapStateToProps, buildActionDispatcher)(ArchivesComponent);