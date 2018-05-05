/** 
 * @Description  培训管理---培训资料
 */
import React from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import actions from '../../actions/equipment.js';

import BackList from '../common/back_list';

import { Icon, Button, Upload, Modal, Table, Pagination, Collapse, Form, Input, Row, Col, Select, DatePicker, Checkbox, Menu } from 'antd';
const Panel = Collapse.Panel;
const FormItem = Form.Item;
const Option = Select.Option;

class WorkOrderOneComponent extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            currentPage: 1,
        }

        this.customPanelStyle = {
            background: '#fff',
            borderRadius: 2,
            marginBottom: 24,
            border: 0,
            boxShadow: '0 1px 6px rgba(0, 0, 0, 0.2)'
        };

        this.taskParam = {
            id: localStorage.assetId,
            pageNum: 1,
            pageSize: 10,
        };
    }

    // 设备设施信息
    taskGetList = () => {
        const { actions } = this.props;
        this.setState({
            taskstepsLoading: true,
            materialsLoading: true
        });
        actions.informationGetList(this.taskParam, () => {
            this.setState({
                taskstepsLoading: false,
                materialsLoading: false
            });
        });
    }

    componentWillMount () {
        this.taskGetList();
    }
    render () {
      const { state, commonState } = this.props;
      const list = [{"name":'哈哈哈'} , {"name":'哈哈哈'} ,{"name":'哈哈哈'} , {"name":'哈哈哈'}];

        return (
            <div className="eam-tab-page">
                <div className="eam-content">
                    <Collapse bordered={false} defaultActiveKey={['1']}>
                        <Panel header={<span className="label">文件<Icon type="caret-down" /></span>} key="1" style={this.customPanelStyle}>
                            <p>上传文件提示：</p>
                            <p className="train-top">A：培训签到记录表；B：培训相关材料；</p>
                            <div className="panel-tools-right">
                                <Button type="primary" size="large" ><Icon type="upload" />上传文件</Button>
                            </div>
                            <div>
                                <Row gutter={64} justify="start">
                                {
                                  list.map((item) => {
                                    return (
                                        <Col className="gutter-row" xs={{ span: 8}}>
                                            <div>
                                              <Icon type='link' className="link-left"/>{ item.name }<Icon type="close"  className="pull-right"/>
                                            </div>
                                        </Col>
                                  )
                                  })
                                }
                                </Row>
                            </div>
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
    }
}

function buildActionDispatcher(dispatch) {
    return {
        actions: bindActionCreators(actions, dispatch),
    }
}

export default connect(mapStateToProps, buildActionDispatcher)(WorkOrderOneComponent);
