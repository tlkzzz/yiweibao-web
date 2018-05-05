import React from 'react';
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';
import actions from '../../actions/common.js';


import {Modal, Carousel} from 'antd';

/**
 * SelectPublic
 * 通用选择组件
 
 * @props fetch      传入fetch url data等参数 请求对应的数据
 * @props stateAttr  state数据名
 * @props width      表格宽度
 * @props modalHide  隐藏弹窗方法
 * @props columns    表格字段
 * @props visible    弹窗显示状态state
 */
class ShowImg extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            tableLoading: false
        }
    }

    render() {
        const {imgList} = this.props;
        console.log(imgList)
        return (
            <Modal
                width={this.props.width}
                visible={this.props.visible}
                onCancel={this.props.modalHide}
                footer={null}
            >
                <Carousel>
                    {
                        imgList.map((item, index) => (
                            <img key={index} src={item.url}></img>
                        ))
                    }
                </Carousel>
            </Modal>

        );
    }
}

function mapStateToProps(state) {
    return {
        state: state.common
    }
}

function buildActionDispatcher(dispatch) {
    return {
        actions: bindActionCreators(actions, dispatch),
    }
}

export default connect(mapStateToProps, buildActionDispatcher)(ShowImg);
