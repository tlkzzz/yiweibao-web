import React from 'react';
import { Link } from 'react-router';
/*
    返回列表按钮
 */

class BackList extends React.Component {
    constructor (props) {
        super(props);
    }
    link = () => {
        const { location } = this.props;
        const isFromOther = location.query.from;

        let pathname = location.pathname;
        let directoryArr = pathname.split('/');

        return isFromOther ? isFromOther : `/${directoryArr[1]}/${directoryArr[2]}`;
    }
    handleClick = (event) => {
        if (this.props.onClick) this.props.onClick(event);

    };
    render() {
        return <Link className="pull-left eam-btn" style={{marginLeft: 15}} to={this.link()} onClick={this.handleClick}>返回列表</Link>
    }
}

export default BackList;