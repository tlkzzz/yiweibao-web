import React from 'react';
import { Dropdown, Icon } from 'antd';

class DropdownComponent extends React.Component {
    constructor (props) {
        super(props);
        this.state = {
            visible: false
        }
        this.num = 0;
    }
    menuShow = () => {

        const { onChange } = this.props;

        this.num++;

        let visible;

        if (this.num === 1) {
            visible = false;
            if (this.state.visible) onChange && onChange(visible);
        }
        else if (this.num === 2) {
            visible = true;
            onChange && onChange(visible);
        }

        this.setState({
            visible
        }, () => {
            this.num = 0;
        });
    }
    shouldComponentUpdate (nextProps, nextState) {
        return !nextState.visible === this.state.visible;
    }
    componentDidMount () {
        document.addEventListener('click', this.menuShow);
    }
    componentWillUnmount () {
        document.removeEventListener('click', this.menuShow);
    }
    render() {

        return (
            <Dropdown
                {...this.props}
                visible={this.state.visible}
                onClick={() => {
                    this.num++;
                }}
            >
                <div style={{visibility: this.props.disabled ? 'hidden': 'inherit'}} className={`form-item-wrap pull-left ${this.state.visible ? 'active' : ''}`}>
                    <span className="icon-bg pull-right">
                        <Icon type="caret-down" />
                    </span>
                    <span className="form-item-label">{this.props.children}</span>
                </div>
            </Dropdown>
        );
    }
}

export default DropdownComponent;