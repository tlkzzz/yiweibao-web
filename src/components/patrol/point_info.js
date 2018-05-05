/** 
 * @Description
 */
import React from 'react';
import {bindActionCreators} from 'redux';
import {browserHistory} from 'react-router';
import {connect} from 'react-redux';
import actions from '../../actions/patrol.js';
import commonActions from '../../actions/common.js';
import {createForm} from 'rc-form';
import SelectAsset from '../../components/common/select_asset.js';
import moment from 'moment';
import EAMModal from '../../components/common/modal.js';

import {
    Icon,
    Button,
    Table,
    Pagination,
    Collapse,
    Form,
    Input,
    Row,
    Col,
    Select,
    Radio,
    DatePicker,
    Menu,
    notification,
    message,
    Modal
} from 'antd';
const Panel = Collapse.Panel;
const FormItem = Form.Item;
const Option = Select.Option;

class FormComponent extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            selectLocationShow: false,
            img: ''
        }

    }

    selectCode = (stateAttr) => {
        this.setState({[stateAttr]: true});
    }

    componentDidUpdate() {
        const {form, parentProps} = this.props;
        const {state, actions} = parentProps;
        if (!state.getFormValues) {
            actions.getFormValues(true);
            form.validateFields((err, values) => {
                if (err) {
                    for (let attr in err) {
                        /*notification.warning({
                         message: '提示',
                         description: err[attr].errors[0].message
                         });*/
                        message.warning(err[attr].errors[0].message)
                        break;
                    }
                } else {
                    actions.getFormValues(values);
                }
            });
        }
    }

    componentWillMount() {
        const {parentProps} = this.props;
        const {commonActions, commonState} = parentProps;
        const domainValueParam = {
            orgId: commonState.orgId,
            siteId: commonState.siteId,
            prodId: 'EAM'
        }
        commonActions.getDomainValue(domainValueParam, 'patrolType', 'PATROL_TYPE');
        commonActions.getDomainValue(domainValueParam, 'patrolPointStatus', 'PATROL_POINT_STATUS');

    }

    render() {
        let {data, editable, parentProps} = this.props;
        let {state, commonState, location} = parentProps;
        const {getFieldDecorator} = this.props.form;
        const isAddPoint = location.query.add_point;
        const patrolTypeData = commonState.patrolTypeData,
            pointStatusData = commonState.pointStatusData
        if (JSON.stringify(data) === '[]') data = {};
        return (
            <div>
                <Form layout="vertical">
                    <Row gutter={16}>
                        <Col className="gutter-row" xs={{span: 18}}>
                            <Row gutter={16} justify="start">
                                <Col className="gutter-row" xs={{span: 0}}>
                                    <FormItem
                                        label="巡检点id"
                                    >
                                        {
                                            getFieldDecorator('id', {
                                                initialValue: data.id
                                            })(
                                                <Input disabled/>
                                            )
                                        }
                                    </FormItem>
                                </Col>
                                <Col className="gutter-row" xs={{span: 0}}>
                                    <FormItem
                                        label="组织id"
                                    >
                                        {
                                            getFieldDecorator('orgid', {
                                                initialValue: isAddPoint ? commonState.orgId : data.orgid
                                            })(
                                                <Input />
                                            )
                                        }
                                    </FormItem>
                                </Col>
                                <Col className="gutter-row" xs={{span: 0}}>
                                    <FormItem
                                        label="站点id"
                                    >
                                        {
                                            getFieldDecorator('siteid', {
                                                initialValue: isAddPoint ? commonState.siteId : data.siteid
                                            })(
                                                <Input />
                                            )
                                        }
                                    </FormItem>
                                </Col>
                                <Col className="gutter-row" style={{display: 'none'}}>
                                    <FormItem
                                        label="位置id"
                                    >
                                        {
                                            getFieldDecorator('lochierarchyid', {
                                                initialValue: this.state.locationId ? this.state.locationId : data.lochierarchyid
                                            })(
                                                <Input readOnly disabled={!editable}/>
                                            )
                                        }
                                    </FormItem>
                                </Col>
                                <Col className="gutter-row" xs={{span: 5}}>
                                    <FormItem
                                        label="巡检点编号"
                                    >
                                        {
                                            getFieldDecorator('patrolnum', {
                                                initialValue: isAddPoint ? state.pointCode : data.patrolnum
                                            })(
                                                <Input disabled/>
                                            )
                                        }
                                    </FormItem>
                                </Col>
                                <Col className="gutter-row" xs={{span: 9}}>
                                    <FormItem
                                        label="巡检点描述"
                                    >
                                        {
                                            getFieldDecorator('description', {
                                                initialValue: data.description,
                                                rules: [{
                                                    required: true,
                                                    message: '巡检点描述不能为空!'
                                                }],
                                            })(
                                                <Input />
                                            )
                                        }
                                    </FormItem>
                                </Col>
                                <Col className="gutter-row" xs={{span: 6}}>
                                    <FormItem
                                        label="状态"
                                    >
                                        {
                                            getFieldDecorator('status', {
                                                initialValue: data.status ? data.status : (pointStatusData[0] && pointStatusData[0].value)
                                            })(
                                                <Select size="large" style={{width: '100%'}} disabled={!editable}>
                                                    {
                                                        pointStatusData.map((item, i) => <Option key={i}
                                                                                                 value={item.value}>{item.description}</Option>)
                                                    }
                                                </Select>
                                            )
                                        }
                                    </FormItem>
                                </Col>
                            </Row>
                            <Row gutter={16} justify="start">
                                <Col className="gutter-row" xs={{span: 5}}>
                                    <FormItem
                                        label="位置编码"
                                    >
                                        {
                                            getFieldDecorator('locationNum', {
                                                initialValue: this.state.locationCode ? this.state.locationCode : data.locationNum,
                                                rules: [{required: true, message: '请选择位置!'}]
                                            })(
                                                <Input
                                                    onClick={() => {
                                                        this.selectCode('selectLocationShow')
                                                    }} readOnly/>
                                            )
                                        }
                                    </FormItem>
                                </Col>
                                <Col className="gutter-row" xs={{span: 9}}>
                                    <FormItem
                                        label="位置描述"
                                    >
                                        {
                                            getFieldDecorator('locationDsr', {
                                                initialValue: this.state.locationDesc ? this.state.locationDesc : data.locationDsr
                                            })(
                                                <Input disabled/>
                                            )
                                        }
                                    </FormItem>
                                </Col>
                                <Col className="gutter-row" xs={{span: 6}}>
                                    <FormItem
                                        label="组织"
                                    >
                                        {
                                            getFieldDecorator('org', {
                                                initialValue: isAddPoint ? commonState.orgName : data.org
                                            })(
                                                <Input disabled/>
                                            )
                                        }
                                    </FormItem>
                                </Col>
                            </Row>
                            <Row gutter={16} justify="start">
                                <Col className="gutter-row" xs={{span: 5}}>
                                    <FormItem
                                        label="巡检点类型"
                                    >
                                        {
                                            getFieldDecorator('type', {
                                                initialValue: data.type ? data.type : (patrolTypeData[0] && patrolTypeData[0].value)
                                            })(
                                                <Select size="large" style={{width: '100%'}}>
                                                    {
                                                        patrolTypeData.map((item, i) => <Option key={i}
                                                                                                value={item.value}>{item.description}</Option>)
                                                    }
                                                </Select>
                                            )
                                        }
                                    </FormItem>
                                </Col>
                                <Col className="gutter-row" xs={{span: 9}}>
                                    <FormItem
                                        label="备注"
                                    >
                                        {
                                            getFieldDecorator('remark', {
                                                initialValue: data.remark
                                            })(
                                                <Input />
                                            )
                                        }
                                    </FormItem>
                                </Col>
                                <Col className="gutter-row" xs={{span: 6}}>
                                    <FormItem
                                        label="站点"
                                    >
                                        {
                                            getFieldDecorator('site', {
                                                initialValue: isAddPoint ? commonState.siteName : data.site
                                            })(
                                                <Input disabled/>
                                            )
                                        }
                                    </FormItem>
                                </Col>

                            </Row>
                        </Col>
                        <Col className="gutter-row" xs={{span: 5}}>
                            <FormItem
                                label=""
                            >
                                <img width="200px" height="200px" id="qrCode"/>

                            </FormItem>
                        </Col>
                    </Row>
                </Form>
                <SelectAsset
                    treeData={
                        [
                            {
                                name: '位置查询',
                                key: 'locations',
                                actionsMethod: 'locationsGetTree',
                                data: 'locationsTreeData',
                            }
                        ]
                    }
                    getLocationList //获取位置列表
                    selectAssetModalHide={() => {
                        this.setState({selectLocationShow: false})
                    }}
                    visible={this.state.selectLocationShow}
                    onOk={(selected) => {
                        console.log(selected)
                        this.setState({
                            locationCode: selected[0].code,
                            locationId: selected[0].id,
                            locationDesc: selected[0].description,
                        })
                    }}
                />
            </div>
        )
    }
}
const NewForm = Form.create({
    onValuesChange: (props, values) => {
        for (let attr in values) {
            if (values[attr] instanceof moment) {
                values[attr] = moment(values[attr]).format('YYYY-MM-DD HH:mm:ss');
            }
        }
        //标记表单数据已更新
        localStorage.setItem('point_edit_flag', true);
        let tmp = Object.assign({}, JSON.parse(localStorage.getItem('point_edit')), values);
        localStorage.setItem('point_edit', JSON.stringify(tmp));
    }
})(FormComponent)

// 巡检项新建表单
class TermFormComponent extends React.Component {
    constructor(props) {
        super(props);
        this.formItemLayout = {
            labelCol: {
                xs: {span: 24},
                sm: {span: 6},
            },
            wrapperCol: {
                xs: {span: 24},
                sm: {span: 14},
            },
        };
    }

    render() {
        const {form, data} = this.props;
        const {getFieldDecorator} = form;

        return (
            <Form>
                <FormItem
                    {...this.formItemLayout}
                    label="巡检项"
                >
                    {
                        getFieldDecorator('description', {
                            initialValue: data ? data.description : '',
                            rules: [{required: true, message: '文本不能为空'}],
                        })(
                            <Input style={{width: '100%'}}/>
                        )
                    }
                </FormItem>
            </Form>
        )
    }
}
const NewTermForm = Form.create()(TermFormComponent);
class PointOneComponent extends React.Component {
    constructor(props) {
        super(props);
        this.props.router.setRouteLeaveHook(
            this.props.route,
            this.routerWillLeave.bind(this)
        );
        this.onBeforeUnload = (event) => {
            const isEdited = JSON.parse(localStorage.getItem('point_edit_flag'));
            if (isEdited) {
                let confirmationMessage = '当前页面已修改，是否确认离开？';

                (event || window.event).returnValue = confirmationMessage; // Gecko and Trident
                return confirmationMessage; // Gecko and WebKit
            }
            return "\o/";
        };

        //注册刷新事件，当页面刷新时，缓存页面数据
        window.addEventListener('beforeunload', this.onBeforeUnload);

        this.state = {
            modalShow: false,
            currentPage: 1,
            termLoading: false,
            termEditData: '',
            img: '',
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

        // 巡检项表格字段
        this.termColumns = [
            {
                title: '序号',
                dataIndex: 'step',
                key: 'step',
                render: (text, record, key) => {
                    const step = parseInt(key) + 1
                    record.step = step;
                    return (
                        <p>{step}</p>
                    )
                }
            },
            {
                title: '巡检项',
                dataIndex: 'description',
                key: 'description',
                render: defaultRender
            },
            {
                title: '操作',
                dataIndex: '4',
                key: '4',
                width: 120,
                render: (text, record, key) => {
                    return (
                        <div className="table-icon-group">
                            <Icon
                                type="delete"
                                onClick={() => {
                                    this.termDel(record);
                                }}
                            />
                            <Icon type="edit"
                                  onClick={() => {
                                      this.termEdit(record);
                                  }}
                            />
                        </div>
                    )
                }
            },
        ];
        const {location} = this.props;

        const isAddPoint = location.query.add_point;

        this.termParam = {
            id: isAddPoint ? '' : JSON.parse(localStorage.getItem('point')).id,
            pageNum: 1,
            pageSize: 998,
        }
        this.localPoint = JSON.parse(localStorage.getItem('point'));
    }

    pageChange = () => {

    }
    // 任务分派列表（巡检项、所需物料）
    termGetList = () => {
        const {actions, commonState} = this.props;
        this.setState({
            termLoading: true,
        });
        actions.updateList(this.termParam, () => {
            this.setState({
                termLoading: false,
            });
        });
        let param = {
            id: this.termParam.id,
            applicationValue: 'patrol',
            siteId: commonState.siteId
        }
        actions.getQrCode(param, (data) => {
            this.setState({
                img: data,
            });
        })
    }
    // 新建巡检项
    termAdd = () => {
        this.setState({termEditData: ''});
        this.termAddModal.modalShow();
    }

    // 保存新建/编辑巡检项
    termAddSave = () => {
        let {actions} = this.props;
        let editJson = this.state.termEditData;

        this.termAddForm.validateFields((err, values) => {
            if (err) return;
            values.id = editJson.id;
            actions.updateList([editJson ? 'TERM_EDIT' : 'TERM_ADD', [values]]);
        });
        this.termAddModal.modalHide();
    }
    // 编辑巡检项
    termEdit = (record) => {
        this.setState({termEditData: record});
        this.termAddModal.modalShow();
    }
    // 删除巡检项
    termDel = (record) => {
        let {actions} = this.props;
        actions.updateList(['TERM_DEL', record]);
    }
    termAfterClose = () => {
        this.termAddForm.resetFields();
    }
    //表格事件
    tableChange = (pagination, filters, sorter) => {
        if (sorter.order) {
            let sorterOrder = sorter.order;
            let endIndex = sorterOrder.indexOf('end');
            sorterOrder = sorterOrder.slice(0, endIndex);
            this.termParam.sorts = `${sorter.columnKey} ${sorterOrder}`;
            this.termGetList();
        } else {
            this.termParam.sorts = '';
        }
    }

    componentWillMount() {
        const {actions, location, commonState} = this.props;
        const isAddPoint = location.query.add_point;
        if (this.localPoint) {
            this.termGetList();
            this.setState({editable: false});
        }
        //新建空白页面
        if (isAddPoint || !this.localPoint) {
            this.setState({editable: true});
            actions.getCode({
                modelKey: 'patrolpoint',
                siteId: commonState.siteId
            }, "GET_POINT_CODE")
        }
    }

    routerWillLeave(nextLocation) {
        const {location} = this.props;
        if (!nextLocation.pathname.startsWith(location.pathname.substring(0, location.pathname.length - 1))) {
            //切换其它页面
            const isEdited = JSON.parse(localStorage.getItem('point_edit_flag'));
            if (isEdited) {
                const confirm = Modal.confirm;
                confirm({
                    title: '提示',
                    content: '当前页面已修改，是否确认离开？',
                    onOk() {
                        localStorage.removeItem('point_edit_flag');
                        localStorage.removeItem('point_edit');
                        browserHistory.push(nextLocation.pathname);
                    }
                });
                return false;
            } else {
                localStorage.removeItem('point_edit_flag');
                localStorage.removeItem('point_edit');
            }
        }
    }

    render() {
        const {state} = this.props;

        const termData = state.termListData;
        termData.img = state.img;
        // 检查项数据
        const termList = termData.patrolTermVolist;

        console.log('===========================');
        console.log('巡检项-新增的数据。。 -> ', termData.newTermList);
        console.log('巡检项-删除的原数据。 -> ', termData.delOriginalDataId);
        console.log('===========================');

        return (
            <div className="eam-tab-page">
                <div className="eam-content">
                    <Collapse bordered={false} defaultActiveKey={['1', '2', '3']}>
                        <Panel header={<span className="label">基本信息 <Icon type="caret-down"/></span>} key="1"
                               style={this.customPanelStyle}>
                            <NewForm data={termData}
                                     editable={this.state.editable}
                                     parentProps={{...this.props}}/>
                        </Panel>
                        <Panel header={<span className="label">检查项 <Icon type="caret-down"/></span>} key="2"
                               style={this.customPanelStyle}>
                            <Table
                                rowKey="id"
                                loading={this.state.termLoading}
                                pagination={{
                                    showTotal: (total, range) => `当前第${range[0]}-${range[1]}条 / 共${total}条`,
                                    defaultPageSize: 5,
                                }}
                                dataSource={termList}
                                columns={this.termColumns}
                                bordered
                            />
                            <div className="panel-tools-right">
                                <Button type="primary" size="large" onClick={this.termAdd}>新建</Button>
                            </div>
                        </Panel>
                    </Collapse>
                </div>
                <EAMModal
                    title={`${this.state.termEditData ? '编辑' : '新建'}巡检项`}
                    ref={termAddModal => this.termAddModal = termAddModal}
                    afterClose={this.termAfterClose}
                >
                    <NewTermForm data={this.state.termEditData} ref={termAddForm => this.termAddForm = termAddForm}/>
                    <div className="modal-footer clearfix">
                        <Button size="large" onClick={() => {
                            this.termAddModal.modalHide()
                        }}>取消</Button>
                        <Button type="primary" size="large" onClick={this.termAddSave}>确定</Button>
                    </div>
                </EAMModal>
            </div>
        )
    }
}


function mapStateToProps(state) {
    return {
        state: state.patrol,
        commonState: state.common
    }
}

function buildActionDispatcher(dispatch) {
    return {
        actions: bindActionCreators(actions, dispatch),
        commonActions: bindActionCreators(commonActions, dispatch),
    }
}

export default connect(mapStateToProps, buildActionDispatcher)(PointOneComponent);