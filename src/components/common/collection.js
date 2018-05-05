import React from 'react';
import { Icon } from 'antd';

// 收藏

class Collection extends React.Component {
    constructor (props) {
        super(props);
        //是否收藏
        const { isCollect } = props;
        this.state = {
            type: isCollect ? 'star' : 'star-o'
        }
    }
    starClick = () => {
        let type = this.state.type === 'star' ? 'star-o' : 'star';
        this.setState({type});
        this.props.onChange(type === 'star' ? 1 : 0);
    }
    render() {
        return (
            <Icon
                style={this.props.style}
                onClick={this.starClick}
                type={this.state.type}
            />
        );
    }
}

export default Collection;