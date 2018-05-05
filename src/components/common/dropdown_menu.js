import React from 'react';
import { Popover } from 'antd';

class PopoverComponent extends React.Component {
    state = {
        visible: false,
    }
    hide = () => {
        this.setState({ visible: false });
    }
    handleVisibleChange = (visible) => {
        this.setState({ visible });
    }
    render() {
        return (
            <Popover
                className={this.props.className}
                content={this.props.overlay}
                trigger={this.props.trigger || 'click'}
                visible={this.state.visible}
                onVisibleChange={this.handleVisibleChange}
                placement={this.props.placement || 'bottomLeft'}
            >
                {this.props.children}
            </Popover>
        );
    }
}

export default PopoverComponent;