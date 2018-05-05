/** 
 * @Description 图纸资料
 */
import React from 'react';
import { bindActionCreators } from 'redux';
import { Link } from 'react-router';
import { connect } from 'react-redux';
import actions from '../../actions/equipment.js';
import commonActions from '../../actions/common';
import Upload from '../../components/common/upload.js';
import { filterArrByAttr , runActionsMethod } from '../../tools';

import Dropdown from '../../components/common/dropdown.js';
import NumInp from '../../components/common/num_inp.js';
import Modal from '../../components/common/modal.js';

import { Icon, Button, Table, Pagination, Collapse, Form, Input, Row, Col, Select, DatePicker, Menu, Timeline } from 'antd';
const Panel = Collapse.Panel;
const FormItem = Form.Item;
const Option = Select.Option;

class WorkOrderTwoComponent extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            drawLoading: false,
            materialsLoading: false,
            currentPage: 1,
        }

        this.customPanelStyle = {
            background: '#fff',
            borderRadius: 2,
            marginBottom: 24,
            border: 0,
            boxShadow: '0 1px 6px rgba(0, 0, 0, 0.2)'
        };

        this.recordDate = null;

        let defaultRender = (text, record, key) => {
            return (
                <p>{text ? text : '-'}</p>
            )
        };

        // 设备图纸表格字段
        this.drawColumns = [
            {
                title: '附件名称',
                dataIndex: 'fileName',
                key: 'fileName',
                render: defaultRender
            },
            {
                title: '大小',
                dataIndex: 'fileSize',
                key: 'fileSize',
                render: defaultRender
            },
            {
                title: '上传人',
                dataIndex: 'createUser',
                key: 'createUser',
                render: defaultRender
            },
            {
                title: '上传时间',
                dataIndex: 'createDate',
                key: 'createDate',
                render: defaultRender
            }
        ];

        const { location } = this.props;

        const isAdd = location.query.add_asset;
        this.asset = localStorage.getItem('asset');

        this.taskParam = {
            quoteId: isAdd ? '' : (this.asset && JSON.parse(this.asset).id),
            quoteType: "assetData",
        }
    }
    // 分页事件
    pageChange = (page, pageSize) => {
        this.setState({ currentPage: page });
        this.param.pageNum = page; //*** 需要修改参数 在方法内单独修改
        this.getList();
    }
    //表格多选
   rowSelection = {
        onChange: (selectedRowKeys, selectedRows) => {
            this.setState({
                selectedRows : selectedRows
            })
        },
        onSelect: (record, selected, selectedRows) => {
            console.log(record, selected, selectedRows);
        },
        onSelectAll: (selected, selectedRows, changeRows) => {
            console.log(selected, selectedRows, changeRows);
        },
    };
    // 任务分派列表（任务步骤、所需物料）
    getList = () => {
        const { actions } = this.props;
        this.setState({
            drawLoading: true,
            materialsLoading: true
        });
        actions.drawGetList(this.taskParam, () => {
            this.setState({
                drawLoading: false,
                materialsLoading: false
            });
        });
    }
    drawAdd = () => {
        this.drawAddModal.modalShow();
    }

    drawAddSave = () => {
        this.drawAddModal.modalHide();
        this.getList();
    }
    // 删除技术参数
    drawDel = () => {
        const { actions } = this.props;
        const selectedRows = this.state.selectedRows;
        const taskParam = {
            ids: [filterArrByAttr(selectedRows,'id').join(',')]
        }
        console.log(taskParam);
        runActionsMethod(actions, 'drawDel', taskParam);
        this.getList();
    }
    componentWillMount () {
        this.getList();
    }
    render () {
        const { state, location , commonActions , commonState } = this.props;

        const taskData = state.drawListData.images;
        const isAdd = location.query.add_asset;
        let  asset = localStorage.getItem('asset');
        let id = isAdd ? '' : (asset && JSON.parse(this.asset).id);

        return (
            <div className="eam-tab-page">
                <div className="eam-content">
                    <Collapse bordered={false} defaultActiveKey={['1']}>
                        <Panel header={<span className="label">设备图纸 <Icon type="caret-down" /></span>} key="1" style={this.customPanelStyle}>
                            <Table
                                rowKey="id"
                                loading={this.state.drawLoading}
                                pagination={{
                                    showTotal: (total, range) => `当前第${range[0]}-${range[1]}条 / 共${total}条`,
                                    defaultPageSize: 5,
                                }}
                                dataSource={taskData}
                                columns={this.drawColumns}
                                rowSelection={this.rowSelection}
                                bordered
                            />
                            <div className="panel-tools-right">
                                <Button type="primary" size="large" onClick={this.drawAdd}>上传</Button>
                                <Button type="primary" size="large" onClick={this.drawDel}>删除</Button>
                            </div>
                            <Modal
                                title={`上传图片`}
                                ref={drawAddModal => this.drawAddModal = drawAddModal}
                                onOk={this.technologyAddSave}
                                afterClose={this.technologyAfterClose}
                            >
                                <Upload
                                    quoteId={id}
                                    quoteType="assetData"
                                    commonActions={commonActions}
                                    commonState={commonState}
                                />
                                <div className="modal-footer clearfix">
                                    <Button type="primary" size="large" onClick={this.drawAddSave}>确定</Button>
                                    <Button size="large" onClick={() => { this.drawAddModal.modalHide() }}>取消</Button>
                                </div>
                            </Modal>
                        </Panel>
                    </Collapse>
                </div>
            </div>
        )
    }
}


function mapStateToProps (state) {
    return {
        state: state.equipment,
        commonState: state.common
    }
}

function buildActionDispatcher(dispatch) {
    return {
        actions: bindActionCreators(actions, dispatch),
        commonActions: bindActionCreators(commonActions, dispatch),
    }
}

export default connect(mapStateToProps, buildActionDispatcher)(WorkOrderTwoComponent);
