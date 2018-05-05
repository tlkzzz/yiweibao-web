/** 
 * @Description 位置体系-基本信息
 */
import React from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import actions from '../../actions/equipment.js';
import { createForm } from 'rc-form';

import Dropdown from '../../components/common/dropdown.js';
import SelectAsset from '../common/select_asset';
import { runActionsMethod } from '../../tools';

import { Icon, Button, Modal, Table, Pagination, Collapse, Form, Input, Row, Col, Select} from 'antd';
const Panel = Collapse.Panel;
const FormItem = Form.Item;
const Option = Select.Option;

class FormComponent extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            currentPage: 1,
            parentLocation: {},
            locationModalShow: false,
        }
    }

    locationsAdd = () => {
        this.setState({ locationModalShow: true });
    }

    render () {
        const { getFieldDecorator } = this.props.form;
        const { data , commonState , location , state} = this.props;
        const isAdd = location.query.add_location;

        return (
            <Form layout="vertical">
                <Row gutter={32} justify="start">
                    <Col className="gutter-row" xs={{ span:6}}>
                        <FormItem
                            label="位置编码"
                        >
                            {
                                getFieldDecorator('code',{
                                    initialValue: isAdd ?  state.getCodeData : (data ? data.code : ''),
                                    rules: [{ required: true, message: '文本不能为空' }],
                                })(
                                    <Input disabled/>
                                )
                            }
                        </FormItem>
                    </Col>
                    <Col className="gutter-row" xs={{ span: 9}}>
                        <FormItem
                            label="描述"
                        >
                            {
                                getFieldDecorator('description',{
                                    initialValue: data ? data.description : '',
                                    rules: [{ required: true, message: '文本不能为空' }],
                                })(
                                    <Input />
                                )
                            }
                        </FormItem>
                    </Col>
                </Row>
                <Row gutter={32} justify="start">
                    <Col className="gutter-row" xs={{ span: 6}}>
                        <FormItem
                            label="父级位置"
                        >
                            {
                                getFieldDecorator('parentLocation.code', {
                                    initialValue: this.state.parentLocation.code ? this.state.parentLocation.code : data && data.parentLocation ? data.parentLocation.code : ''
                                })(
                                    <Input  onClick={this.locationsAdd} suffix={<Icon type="plus" /> } />
                                )
                            }
                            <SelectAsset
                                treeData = {
                                    [
                                        {
                                            name: '位置查询',
                                            key: 'locations',
                                            param: {
                                                orgId:  commonState.orgId,//'e0bc74c4f58611e58c2d507b9d28ddca',
                                                siteId: commonState.siteId,
                                                productArray: commonState.productArray
                                            },
                                            actionsMethod: 'locationsGetTree',
                                            data: 'locationsTreeData',
                                        }
                                    ]
                                }
                                getLocationList //获取位置列表
                                selectAssetModalHide={() => { this.setState({ locationModalShow: false }) }}
                                visible={this.state.locationModalShow}
                                onOk={(record) => {
                                    this.setState({
                                        parentLocation: record[0],
                                    },() => { this.props.changeParent(this.state.parentLocation)})
                                }}
                            />
                        </FormItem>
                    </Col>
                    <Col className="gutter-row" xs={{ span: 9}}>
                        <FormItem
                            label="父级描述"
                        >
                            {
                                getFieldDecorator('parentLocation.description',{
                                    initialValue: this.state.parentLocation.description ? this.state.parentLocation.description : data && data.parentLocation ? data.parentLocation.description : ''
                                })(
                                    <Input  disabled/>
                                )
                            }
                        </FormItem>
                    </Col>
                </Row>
            </Form>
        )
    }
}
const NewFormComponent = Form.create()(FormComponent)


class WorkOrderOneComponent extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            locationDetailLoading: false,
            locationLoading: false,
            currentPage: 1,
            parentLocation: {},
        }

        this.customPanelStyle = {
            background: '#fff',
            borderRadius: 2,
            marginBottom: 24,
            border: 0,
            boxShadow: '0 1px 6px rgba(0, 0, 0, 0.2)'
        };
        const { location } = this.props;

        const isAdd = location.query.add_location;
        this.location = localStorage.getItem('locations');
        this.taskParam = {
            id: isAdd ? '' : (this.location && JSON.parse(this.location).id),
            pageNum: 1,
            pageSize: 10,
        }

        let defaultRender = (text, record, key) => {
            return (
                <p>{text ? text : '-'}</p>
            )
        };

        // 子位置表格字段
        this.locationDetailColumns = [
            {
                title: '位置编码',
                dataIndex: 'code',
                key: 'code',
                render: defaultRender
            },
            {
                title: '描述',
                dataIndex: 'description',
                key: 'description',
                render: defaultRender
            },
            {
                title: '组织',
                dataIndex: 'qualityStandard',
                key: 'qualityStandard',
                render: defaultRender
            },
            {
                title: '站点',
                dataIndex: 'duration',
                key: 'duration',
                render: defaultRender
            },
        ];
    }

    // 分页事件
    pageChange = (page, pageSize) => {
        this.setState({ currentPage: page });
        this.param.pageNum = page; //*** 需要修改参数 在方法内单独修改
        this.getList();
    }

    // 位置基本信息
    getList = () => {
        const { actions } = this.props;
        this.setState({
            locationDetailLoading: true,
        });
        actions.locationDetailGetList(this.taskParam, () => {
            this.setState({
                locationDetailLoading: false,
                parentLocation: this.props.state.locationDetailListData ? this.props.state.locationDetailListData.parentLocation : '',
            });
        });
    }
//位置体系详情页面保存
    locationDetailSave = () => {
        const  { actions, state , commonState, location } = this.props;
        const isAdd = location.query.add_location;
        const id = isAdd ? '' : (JSON.parse(localStorage.getItem('locations')).id);
        const orgId = commonState.orgId;
        const siteId = commonState.siteId;
        let parentLocation = this.state.parentLocation;
        let parentId = parentLocation.id;

        this.locationDetailAddForm.props.form.validateFields((err, values) => {
            if (!id) {
                if (values["code"] != '' && values["description"] != '') {
                    const taskParam = {
                        ...values,
                        orgId,
                        siteId,
                        parentLocation,
                        parentId,
                        productArray: commonState.productArray,
                    }
                    runActionsMethod(actions, 'locationDetailAdd', taskParam, (json) => {
                        const data = json.data;
                        const obj = {};
                        obj.id = data.id;
                        obj.status = data.status;
                        obj.code = data.code;
                        obj.description = data.description;

                        localStorage.setItem('location', JSON.stringify(obj));
                        this.getList();
                        this.subGetList();
                   });
               } else {
                   return;
               }
            } else {
                const param = {
                    ...values,
                    orgId,
                    siteId,
                    parentLocation,
                    parentId,
                    id,
                }
                runActionsMethod(actions, 'locationDetailUpdate', param, () => {
                     this.getList();
                     this.subGetList();
                });
            }
       })
    }
//位置体系的子位置列表
    subGetList = () => {
        const { actions, commonState, location } = this.props;
        this.setState({
            locationLoading: true,
        });
        const isAdd = location.query.add_location;
        const id = isAdd ? '' : (JSON.parse(localStorage.getItem('locations')).id);
		console.log(actions)
        if (id) {
            const param = {
                orgId: commonState.orgId,
                siteId: commonState.siteId,
                productArray: commonState.productArray,
                fatherId: id,
                pageNum: 1,
                pageSize: 998,
            }
            actions.locationsGetList(param, (json) => {
                this.setState({
                    locationLoading: false,
                });
            });
       //则不查询子位置列表
        } else {
            this.setState({
                locationLoading: false,
            });
        }
    }


    componentWillMount () {
        const { actions, location , commonState } = this.props;
        const isAdd = location.query.add_location;

        this.location && this.getList();
        this.location && this.subGetList();
        if (isAdd || !this.location) {
            actions.codeGetList({modelKey: 'location', siteId : commonState.siteId});
        }
    }
    render () {
        const { state, commonState, location } = this.props;
        const list = state.locationDetailListData;
        const getCodeData = state.getCodeData;

        const isAdd = location.query.add_location;
        const subList = isAdd ? '' : state.subListData.list;
        console.log(subList);

        return (
            <div className="eam-tab-page">
                <div className="eam-content">
                    <Collapse bordered={false} defaultActiveKey={['1', '2']}>
                        <Panel header={<span className="label">基本信息 <Icon type="caret-down" /></span>} key="1" style={this.customPanelStyle}>
                            <div className="panel-tools-right">
                                <Button size="large" type="primary" onClick={this.locationDetailSave}>保存</Button>
                            </div>
                            <NewFormComponent
                                data={list}
                                state={state}
                                location={location}
                                commonState={commonState}
                                changeParent={(value) => {
                                    let { parentLocation } = this.state;
                                    parentLocation = value;
                                    this.setState({ parentLocation });
                                }}
                                wrappedComponentRef={locationDetailAddForm => this.locationDetailAddForm = locationDetailAddForm}
                            />
                        </Panel>
                        <Panel header={<span className="label">子位置列表 <Icon type="caret-down" /></span>} key="2" style={this.customPanelStyle}>
                            <Table
                                rowKey="id"
                                loading={this.state.locationLoading}
                                pagination={{
                                    showTotal: (total, range) => `当前第${range[0]}-${range[1]}条 / 共${total}条`,
                                    defaultPageSize: 5,
                                }}
                                dataSource={subList}
                                columns={this.locationDetailColumns}
                                bordered
                            />
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
    }
}

export default connect(mapStateToProps, buildActionDispatcher)(WorkOrderOneComponent);
