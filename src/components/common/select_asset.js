import React from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import actions from '../../actions/common.js';

import AsideTree from './aside_tree.js';

import { Modal, Button, Row, Col, Table, Pagination, Tag, Icon } from 'antd';

/**
 * SelectAsset
 * 选择设备组件
 


 * @props  multiple                 true为多选 false 单选
 * @props  visible                  弹窗显示/隐藏
 * @props  selectAssetModalHide     关闭弹窗方法 方法内设置visible->false
 * @props  onOk                     多选人员确认方法 onOk={selected => selected} selected参数: 多选为数组，单选为对象

 */
class SelectAsset extends React.Component {
    constructor (props) {
        super(props);
        this.state = {
            currentPage: 1,
            tableLoading: false,
            selectedRowKeys: [],
            parentId: false,
        }


        let defaultRender = (text, record, key) => {
            return (
                <p>{text ? text : '-'}</p>
            )
        };

        const { multiple, getLocationList, getClassifiList } = this.props;

        if (this.props.getLocationList) {
            this.columns = [
                {
                    title: '位置编码',
                    dataIndex: 'code',
                    key: 'code',
                    sorter: true,
                    render: multiple ? defaultRender : (text, record, key) => {
                        return (
                            <p><a href="javascript:;" onClick={() => { this.selectAsset(record) }} className="order-number">{text ? text : '-'}</a></p>
                        )
                    }
                },
                {
                    title: '位置描述',
                    dataIndex: 'description',
                    key: 'description',
                    sorter: true,
                    render: defaultRender
                },

            ];
        }
        else if (this.props.getClassifiList) {
            this.columns = [
                {
                    title: '分类编码',
                    dataIndex: 'code',
                    key: 'code',
                    sorter: true,
                    render: multiple ? defaultRender : (text, record, key) => {
                        return (
                            <p><a href="javascript:;" onClick={() => { this.selectAsset(record) }} className="order-number">{text ? text : '-'}</a></p>
                        )
                    }
                },
                {
                    title: '分类描述',
                    dataIndex: 'description',
                    key: 'description',
                    sorter: true,
                    render: defaultRender
                },

            ];
        }
        else {
            this.columns = [
                {
                    title: '设备编码',
                    width: '25%',
                    dataIndex: 'code',
                    key: 'code',
                    sorter: true,
                    render: multiple ? defaultRender : (text, record, key) => {
                        return (
                            <p><a href="javascript:;" onClick={() => { this.selectAsset(record) }} className="order-number">{text ? text : '-'}</a></p>
                        )
                    }
                },
                {
                    title: '设备描述',
                    width: '25%',
                    dataIndex: 'description',
                    key: 'description',
                    sorter: true,
                    render: defaultRender
                },
                {
                    title: '设备位置',
                    width: '25%',
                    dataIndex: 'locationName',
                    key: 'locationName',
                    sorter: true,
                    render: defaultRender
                },
                {
                    title: '设备分类',
                    width: '25%',
                    dataIndex: 'classificationName',
                    key: 'classificationName',
                    sorter: true,
                    render: defaultRender
                },

            ];
        }

        const { state } = this.props

        this.param = {
            orgId: state.orgId,
            pageNum: 1,
            pageSize: 10,
            productArray: state.productArray,
        }
        this.classificationParam = {
            orgId: state.orgId,
            pageNum: 1,
            pageSize: 10,
            productArray: state.productArray,
            parentId: 'ea9a6ad4662d11e79308aaf2bfe747ac',
        }
        //环境监测的树
        this.meterParam = {
            orgId: state.orgId,
            pageNum: 1,
            pageSize: 10,
            productArray: state.productArray,
            parentId: 'c6519b4e612711e79a2890d370b53e17',
        }

        this.startGetList = true;
    }

    pageChange = (page, pageSize) => {
        this.setState({ currentPage: page });
        this.param.pageNum = page;
        this.getList();
    }

    selectTreeNode = (id, key) => {
        const { getLocationList, getClassifiList, state } = this.props;
        let methodName;
        let method;

        if (getLocationList) {
            this.param.parentId = id;
            this.param.orgId = state.orgId;
            this.param.siteId = state.siteId;
            methodName = 'locationsGetList';
        }
        else if (getClassifiList) {
            this.classificationParam.parentId = id;
            method = 'classifiGetList';
        }
        else {
            if (key === 'classifications') {
                this.param.classificationId = id;
            } else {
                this.param.locationId = id;
            }
        }
        this.getList();
    }
    selectAsset = (record) => {

        const { selectAssetModalHide, onOk, multiple, state, getLocationList, getClassifiList } = this.props;

        if(!this.state.selectedRowKeys.length) this.multiselectArr = this.state.selectedRowKeys;

        onOk(multiple ? this.multiselectArr : [record]);
        selectAssetModalHide();
    }
    tableSelectChange = (selectedRowKeys) => {
        this.setState({ selectedRowKeys });
    }
    getList = () => {
        const { actions, getLocationList, getClassifiList , state, meterClassification } = this.props;
        this.setState({ tableLoading: true });

        let methodName;
        let method;

        if (getLocationList) {
            this.param.orgId = state.orgId;
            this.param.siteId = state.siteId;
            methodName = 'locationsGetList';
            actions[methodName](this.param, () => {
                this.setState({
                    tableLoading: false,
                    selectedRowKeys: [],
                });
            });
        }
        else if (getClassifiList) {
            method = 'classifiGetList';
            if (meterClassification) {
                actions[method](this.meterParam, () => {
                    this.setState({
                        tableLoading: false,
                        selectedRowKeys: [],
                    });
                });
            } else {
                actions[method](this.classificationParam, () => {
                    this.setState({
                        tableLoading: false,
                        selectedRowKeys: [],
                    });
                });
            }

        }
        else {
            methodName = 'assetsGetList';
            actions[methodName](this.param, () => {
                this.setState({
                    tableLoading: false,
                    selectedRowKeys: [],
                });
            });
        }
    }

    componentDidUpdate () {
        const { visible } = this.props;

        if (visible && this.startGetList) {
            this.param.assetIgnoreIds = this.props.ignoreIds;
            this.startGetList = false;
            this.getList();
        }
    }

    render() {

        const { multiple, state, getLocationList, getClassifiList, meterClassification } = this.props;
        let data;
        if (getLocationList) {
            data = state.locationListData;
        }
        else if (getClassifiList) {
            data = state.classifiListData;
        }
        else {
            data = state.assetsListData;
        }
        const list = data ? data.list : [];

        //表格多选
        const rowSelection =  multiple ? {
            selectedRowKeys: this.state.selectedRowKeys,
            onChange: this.tableSelectChange,
            onSelect: (record, selected, selectedRows) => {
                this.multiselectArr = selectedRows;


            },
            onSelectAll: (selected, selectedRows, changeRows) => {
                this.multiselectArr = selectedRows;

            },
        } :
        null

        return (
            <Modal
                title={
                  <div>
                      <Pagination
                          total={data && data.total}
                          current={this.state.currentPage}
                          onChange={this.pageChange}
                          className="pull-right"
                      />
                     <span>{ multiple ? "多选设备" : '单选设备' }</span>
                  </div>
                  }
                width={800}
                onCancel={this.props.selectAssetModalHide}
                visible={this.props.visible}
                footer={null}
                afterClose={() => { this.startGetList = true }}
            >
                <Row gutter={16}>
                    <Col className="gutter-row" span={6}>
                        <AsideTree
                            data={this.props.treeData}
                            onSelect={this.selectTreeNode}
                        />
                    </Col>
                    <Col className="gutter-row" span={18}>
                        <Table
                            rowKey="id"
                            loading={this.state.tableLoading}
                            pagination={false}
                            dataSource={list}
                            columns={this.columns}
                            rowSelection={rowSelection}
                            bordered
                            // onChange={this.tableChange}
                        />
                    </Col>
                </Row>
                <div className="modal-footer clearfix">
                    <Pagination
                        total={data && data.total}
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

export default connect(mapStateToProps, buildActionDispatcher)(SelectAsset);
