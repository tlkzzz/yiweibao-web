import React from 'react';

import {Modal} from 'antd';

class ModalComponent extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            visible: false,
        }
    }

    handleOk = () => {
        this.props.onOk();
    }
    handleCancel = () => {
        this.modalHide();
    }
    modalShow = () => {
        this.setState({
            visible: true
        })
    }
    modalHide = () => {
        this.setState({
            visible: false
        })
    }

    render() {
        return (
            <Modal
                {...this.props}
                width={this.props.width || 520}
                visible={this.state.visible}
                onOk={this.handleOk}
                onCancel={this.handleCancel}
                footer={null}
                
            >
                {this.props.children}
            </Modal>
        )
    }
}

export default ModalComponent;
