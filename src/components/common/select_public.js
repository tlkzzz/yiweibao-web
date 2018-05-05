import React from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import actions from '../../actions/common.js';

import AsideTree from './aside_tree.js';

import { Modal, Button, Table, Pagination, Tag, Icon } from 'antd';

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
class SelectPublic extends React.Component {
    constructor (props) {
        super(props);
        this.state = {
            currentPage: 1,
            tableLoading: false,
        };


    }
    pageChange = (page, pageSize) => {
        const { fetch } = this.props;
        this.setState({ currentPage: page });
        fetch.data.pageNum = page;
        this.getList();
    }
    select = (record) => {
        this.props.onOk(record);
 +      this.props.modalHide();
    }
    getList = () => {
        const { actions, fetch } = this.props;
        this.setState({ tableLoading: true });
        actions.getSelectPublicList(fetch, () => {
            this.setState({ tableLoading: false });
        })

    }
    componentDidMount () {
        this.getList();
    }

    render() {

        const { multiple, state, stateAttr } = this.props;

        const data = state[stateAttr];
        const list = data.list ? data.list : data;


        let defaultRender = (text, record, key) => {
            return (
                <p>{text ? text : '-'}</p>
            )
        };

        const { columns } = this.props;

        columns.forEach((item, i) => {
            if (i === 0) {
                item.render = (text, record, key) => {
                    return (
                        <p><a href="javascript:;" onClick={() => { this.select(record) }} className="order-number">{text ? text : '-'}</a></p>
                    )
                };
            } else {
                if (!item.render) item.render = defaultRender;
            }

        })

        return (
            <Modal
                title={
                  <div>
                    <Pagination
                        total={data.total || data.length}
                        current={this.state.currentPage}
                        onChange={this.pageChange}
                        className="pull-right"
                    />
                    <span>单选</span>
                  </div>
                }
                width={this.props.width}
                visible={this.props.visible}
                onCancel={this.props.modalHide}
                footer={null}
            >
                <Table
                    loading={this.state.tableLoading}
                    rowKey="id"
                    pagination={false}
                    dataSource={list}
                    columns={this.props.columns}
                    bordered
                />
                <div className="modal-footer clearfix">
                    <Pagination
                        total={data.total || data.length}
                        className="pull-left"
                        showTotal={(total, range) => `当前第${range[0]}-${range[1]}条 / 共${total}条`}
                        current={this.state.currentPage}
                        onChange={this.pageChange}
                        style={{padding: 0}}
                    />
                    <Button type="primary" size="large" onClick={this.selectAsset} style={{visibility: multiple ? 'inherit' : 'hidden'}}>确定</Button>
                </div>
            </Modal>
        );
    }
}

function mapStateToProps (state) {
    return {
        state: state.common
    }
}

function buildActionDispatcher(dispatch) {
    return {
        actions: bindActionCreators(actions, dispatch),
    }
}

export default connect(mapStateToProps, buildActionDispatcher)(SelectPublic);
