/** 
 * @Description
 */

import React from 'react';
import {bindActionCreators} from 'redux';
import {browserHistory} from 'react-router';
import {connect} from 'react-redux';
import actions from '../../actions/contract.js';
import commonActions from '../../actions/common.js';
import {createForm} from 'rc-form';

import SelectPerson from '../../components/common/select_person.js';
import SelectPublic from '../../components/common/select_public.js';
import Upload from '../../components/common/upload.js';

import Modal from '../../components/common/modal.js';
import {filterArrByAttr, correspondenceJson,msFormat} from '../../tools/';

import {
    Icon,
    Button,
    Collapse,
    Form,
    Table,
    Input,
    Row,
    Col,
    Select,
    DatePicker,
    Timeline,
    notification
} from 'antd';
const Panel = Collapse.Panel;
const FormItem = Form.Item;

import moment from 'moment';

class FormComponent extends React.Component {
    constructor(props) {
        super(props)

        this.state = {
            selectContractShow: false,
        }

        this.selectContractColumns = [
            {
                title: '编码',
                dataIndex: 'contractNum',
                key: 'contractNum',
                sorter: true,
            },
            {
                title: '描述',
                dataIndex: 'description',
                key: 'description',
                sorter: true,
            },
            {
                title: '合同类型',
                dataIndex: 'typeDsr',
                key: 'contractType',
                sorter: true,
            },
            {
                title: '施工单位',
                dataIndex: 'contractCompany',
                key: 'contractCompany',
                sorter: true,
            },
            {
                title: '状态',
                dataIndex: 'statusDsr',
                key: 'status',
                sorter: true,
            },
            {
                title: '提报时间',
                dataIndex: 'createDate',
                key: 'create_date',
                sorter: true,
            }
        ];
    }

    selectCode = (stateAttr) => {
        this.setState({[stateAttr]: true});
    }

    personInputFocus = (e) => {
        this.currentInp = e.target.getAttribute('data-name');
        this.setState({
            selectPersonModalShow: true
        })
    }

    componentDidUpdate() {
        const {form, parentProps} = this.props;
        const {state, actions} = parentProps;
        if (!state.getFormValues) {
            actions.getFormValues(true);
            form.validateFields((err, values) => {
                if (err) {
                    for (let attr in err) {
                        notification.warning({
                            message: '提示',
                            description: err[attr].errors[0].message
                        });
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
        const {commonActions, commonState,location,actions} = parentProps;
        const domainValueParam = {
            orgId: commonState.orgId,
            siteId: commonState.siteId,
            prodId: 'EAM'
        }
        commonActions.getDomainValue(domainValueParam, 'constructionStatus', 'CONSTRUCTION_STATUS');

        const isAddConstruction = location.query.add_construction;
        const isFromContract = location.query.contract;

        if (isAddConstruction && isFromContract) {
            let contractParam = {
                id: JSON.parse(localStorage.getItem('manage')).id
            }
            actions.contractManageinfoUpdateList(contractParam, (json) => {
                let data = json.data;
                this.setState({
                    contractId: data.id,
                    contractNum: data.contractNum,
                    contractDesc: data.contractNum
                });
            });
        }
    }

    render() {

        let {data, editable, parentProps, form} = this.props;
        let {state, commonState, location} = parentProps;
        const {getFieldDecorator} = form;

        const isAddConstruction = location.query.add_construction;

        const constructionStatusData = commonState.constructionStatusData;

        if (JSON.stringify(data) === '[]') data = {};

        const nowDate = moment(moment().format('YYYY-MM-DD HH:mm:ss'));

        return (
            <div>
                <Form layout="vertical">
                    <Row gutter={16}>
                        <Col className="gutter-row" style={{display: 'none'}}>
                            <FormItem
                                label="施工单id"
                            >
                                {
                                    getFieldDecorator('id', {
                                        initialValue: data.id
                                    })(
                                        <Input  disabled/>
                                    )
                                }
                            </FormItem>
                        </Col>
                        <Col className="gutter-row" style={{display: 'none'}}>
                            <FormItem
                                label="组织id"
                            >
                                {
                                    getFieldDecorator('orgId', {
                                        initialValue: isAddConstruction ? commonState.orgId : data.orgId
                                    })(
                                        <Input />
                                    )
                                }
                            </FormItem>
                        </Col>
                        <Col className="gutter-row" style={{display: 'none'}}>
                            <FormItem
                                label="站点id"
                            >
                                {
                                    getFieldDecorator('siteId', {
                                        initialValue: isAddConstruction ? commonState.siteId : data.siteId
                                    })(
                                        <Input />
                                    )
                                }
                            </FormItem>
                        </Col>
                        <Col className="gutter-row" style={{display: 'none'}}>
                            <FormItem
                                label="监管人id"
                            >
                                {
                                    getFieldDecorator('supervisionId', {
                                        initialValue: data.supervisionId
                                    })(
                                        <Input  disabled/>
                                    )
                                }
                            </FormItem>
                        </Col>
                        <Col className="gutter-row" style={{display: 'none'}}>
                            <FormItem
                                label="合同id"
                            >
                                {
                                    getFieldDecorator('contractId', {
                                        initialValue: this.state.contractId ? this.state.contractId : data.contractId
                                    })(
                                        <Input  disabled/>
                                    )
                                }
                            </FormItem>
                        </Col>
                        <Col className="gutter-row" style={{display: 'none'}}>
                            <FormItem
                                label="创建人id"
                            >
                                {
                                    getFieldDecorator('createUser', {
                                        initialValue: data.createUser || commonState.personId
                                    })(
                                        <Input  disabled/>
                                    )
                                }
                            </FormItem>
                        </Col>
                        <Col className="gutter-row" xs={{span: 4}}>
                            <FormItem
                                label="施工单编码"
                            >
                                {
                                    getFieldDecorator('constructionNum', {
                                        initialValue: isAddConstruction ? state.constructionCode : data.constructionNum
                                    })(
                                        <Input  disabled/>
                                    )
                                }
                            </FormItem>
                        </Col>
                        <Col className="gutter-row" xs={{span: 8}}>
                            <FormItem
                                label="施工单描述"
                            >
                                {
                                    getFieldDecorator('description', {
                                        initialValue: data.description,
                                        rules: [{required: true, message: '施工单描述不能为空!'}]
                                    })(
                                        <Input  disabled={!editable}/>
                                    )
                                }
                            </FormItem>
                        </Col>
                        <Col className="gutter-row" xs={{span: 6}}>
                            <FormItem
                                label="监管人"
                            >
                                {
                                    getFieldDecorator('supervisionName', {
                                        initialValue: data.supervisionName,
                                        rules: [{required: true, message: '监管人不能为空!'}]

                                    })(
                                        <Input
                                            data-name="supervision"
                                            onClick={this.personInputFocus}
                                            readOnly
                                            disabled={!editable}
                                        />
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
                                        initialValue: data.status ? data.status : (constructionStatusData[0] && constructionStatusData[0].value)
                                    })(
                                        <Select size="large" style={{width: '100%'}} disabled>
                                            {
                                                constructionStatusData.map((item, i) => <Option key={i}
                                                                                                value={item.value}>{item.description}</Option>)
                                            }
                                        </Select>
                                    )
                                }
                            </FormItem>
                        </Col>
                        <Col className="gutter-row" xs={{span: 4}}>
                            <FormItem
                                label="合同编码"
                            >
                                {
                                    getFieldDecorator('contractNum', {
                                        initialValue: this.state.contractNum ? this.state.contractNum : data.contractNum,
                                        rules: [{required: true, message: '合同编码不能为空!'}]
                                    })(
                                        <Input readOnly disabled={!editable} onClick={() => {
                                            this.selectCode('selectContractShow')
                                        }}/>
                                    )
                                }
                            </FormItem>
                        </Col>
                        <Col className="gutter-row" xs={{span: 8}}>
                            <FormItem
                                label="合同描述"
                            >
                                {
                                    getFieldDecorator('contractDesc', {
                                        initialValue: this.state.contractDesc ? this.state.contractDesc : data.contractDesc,
                                    })(
                                        <Input  disabled/>
                                    )
                                }
                            </FormItem>
                        </Col>
                        <Col className="gutter-row" xs={{span: 6}}>
                            <FormItem
                                label="监管联系方式"
                            >
                                {
                                    getFieldDecorator('supervisionMobile', {
                                        initialValue: data.supervisionMobile,
                                    })(
                                        <Input  disabled/>
                                    )
                                }
                            </FormItem>
                        </Col>
                        <Col className="gutter-row" xs={{span: 6}}>
                            <FormItem
                                label="创建人"
                            >
                                {
                                    getFieldDecorator('createUserName', {
                                        initialValue: data.createUserName || commonState.personName
                                    })(
                                        <Input  disabled/>
                                    )
                                }
                            </FormItem>
                        </Col>
                        <Col className="gutter-row" xs={{span: 6}}>
                            <FormItem
                                label="安全员"
                            >
                                {
                                    getFieldDecorator('securityOfficerId', {
                                        initialValue: data.securityOfficerId,
                                        rules: [{required: true, message: '安全员不能为空!'}]
                                    })(
                                        <Input  disabled={!editable}/>
                                    )
                                }
                            </FormItem>
                        </Col>
                        <Col className="gutter-row" xs={{span: 4}}>
                            <FormItem
                                label="创建时间"
                            >
                                {
                                    getFieldDecorator('createtime', {
                                        initialValue: data.createDate ? moment(data.createDate, 'YYYY-MM-DD HH:mm') : nowDate,
                                        rules: [{
                                            type: 'object',
                                            required: true,
                                            message: '创建时间不能为空！',
                                        }],
                                    })(
                                        <DatePicker
                                            disabled
                                            showTime
                                            format="YYYY-MM-DD HH:mm"
                                            placeholder="Select Time"
                                            onChange={() => {
                                            }}
                                            onOk={() => {
                                            }}
                                        />
                                    )
                                }
                            </FormItem>
                        </Col>
                    </Row>
                </Form>
                <SelectPerson
                    visible={this.state.selectPersonModalShow}
                    selectPersonModalHide={() => {
                        this.setState({selectPersonModalShow: false})
                    }}
                    onOk={(selected) => {
                        let json = {
                            [this.currentInp + "Name"]: selected.name,
                            [this.currentInp + 'Id']: selected.personId,
                            [this.currentInp + 'Mobile']: selected.mobile,
                        }
                        form.setFieldsValue(json);
                    }}
                />
                <SelectPublic
                    fetch={{
                        url: "/eam/open/contract/findPage",
                        type: 'post',
                        data: {
                            pageNum: 1,
                            pageSize: 998,
                            orgId: commonState.orgId,
                            siteId: commonState.siteId,
                            personId: commonState.personId,
                        },
                        actionsType: 'MANAGE_GET_LIST'
                    }}
                    stateAttr="manageListData"
                    width={1200}
                    modalHide={() => {
                        this.setState({selectContractShow: false})
                    }}
                    columns={this.selectContractColumns}
                    visible={this.state.selectContractShow}
                    onOk={record => {
                        this.setState({
                            contractId: record.id,
                            contractNum: record.contractNum,
                            contractDesc: record.description,
                        })
                    }}
                />
            </div>
        )
    }
}
const NewForm = Form.create()(FormComponent)

// 监管记录新建表单
class RecordFormComponent extends React.Component {
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
                    label="监管情况说明"
                >
                    {
                        getFieldDecorator('superviseDesc', {
                            initialValue: data ? data.superviseDesc : '',
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
const NewRecordForm = Form.create()(RecordFormComponent);
class ConstructionOneComponent extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            currentPage: 1,
            editable: false,
        }

        this.customPanelStyle = {
            background: '#fff',
            bconstructionRadius: 2,
            marginBottom: 24,
            bconstruction: 0,
            boxShadow: '0 1px 6px rgba(0, 0, 0, 0.2)'
        };

        let defaultRender = (text, record, key) => {
            return (
                <p>{text ? text : '-'}</p>
            )
        };

        // 监管记录表格字段
        this.superviseRecordColumns = [
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
                title: '监管情况说明',
                dataIndex: 'superviseDesc',
                key: 'superviseDesc',
                render: defaultRender
            },
            {
                title: '监管时间',
                dataIndex: 'superviseDate',
                key: 'superviseDate',
                render: (text, record, key) => {
                    return (
                        <p>{text ? moment(text).format("YYYY-MM-DD HH:mm:ss") : moment(Date.now()).format("YYYY-MM-DD HH:mm:ss")}</p>
                    )
                }
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
                                    this.superviseRecordDel(record);
                                }}
                            />
                            <Icon type="edit"
                                  onClick={() => {
                                      this.superviseRecordEdit(record);
                                  }}
                            />
                        </div>
                    )
                }
            },
        ];
        const {location} = this.props;

        const isAddConstruction = location.query.add_construction;

        this.param = {
            id: isAddConstruction ? '' : (localStorage.getItem('construction') && JSON.parse(localStorage.getItem('construction')).id),
            pageNum: 1,
            pageSize: 998,
        }

        this.localConstruction = JSON.parse(localStorage.getItem('construction'));

    }

    // 施工单提报获取数据
    constructionInfoGetList = () => {
        const {actions} = this.props;
        this.setState({assetLoading: true});
        actions.constructionInfoUpdateList(this.param, () => {
            this.setState({assetLoading: false});
        });
    }

    // 任务分派列表（监管记录、所需物料）
    superviseRecordGetList = () => {
        const {actions} = this.props;
        this.setState({
            superviseRecordLoading: true,
        });
        actions.constructionInfoUpdateList(this.param, () => {
            this.setState({
                superviseRecordLoading: false,
            });
        });
    }
    // 新建监管记录
    superviseRecordAdd = () => {
        this.setState({superviseRecordEditData: ''});
        this.superviseRecordAddModal.modalShow();
    }

    // 保存新建/编辑监管记录
    superviseRecordAddSave = () => {
        let {actions} = this.props;
        let editJson = this.state.superviseRecordEditData;

        this.superviseRecordAddForm.validateFields((err, values) => {
            if (err) return;
            values.id = editJson.id;
            actions.constructionInfoUpdateList([editJson ? 'SUPERVISE_RECORD_EDIT' : 'SUPERVISE_RECORD_ADD', [values]]);
        });

        this.superviseRecordAddModal.modalHide();
    }
    // 编辑监管记录
    superviseRecordEdit = (record) => {
        this.setState({superviseRecordEditData: record});
        this.superviseRecordAddModal.modalShow();
    }
    // 删除监管记录
    superviseRecordDel = (record) => {
        let {actions} = this.props;
        actions.constructionInfoUpdateList(['SUPERVISE_RECORD_DEL', record]);
    }
    superviseRecordAfterClose = () => {
        this.superviseRecordAddForm.resetFields();
    }

    componentWillMount() {
        const {actions, location, commonState} = this.props;
        const isAddConstruction = location.query.add_construction;
        const isFromContract = location.query.contract;

        if (this.localConstruction) {
            if (this.localConstruction.status === 'XZ') {
                this.setState({editable: true});
            } else {
                this.setState({editable: false});
            }
            this.constructionInfoGetList();
        }
        if (isAddConstruction || !this.localConstruction) {
            this.setState({editable: true});
            actions.getCode({modelKey: 'construction', siteId: commonState.siteId}, "GET_CONSTRUCTION_CODE")
        }
    }

    render() {

        const {state, location, commonActions, commonState} = this.props;
        const constructionInfoData = state.constructionInfoListData || [];
        const superviseRecordList = constructionInfoData.constructionSuperviseVoList || [];
        // 执行记录数据
        const recordList = constructionInfoData.impleRecordVoVoList || [];
        // 执行记录日期
        const recordDateArr = constructionInfoData.dateArr;

        return (
            <div className="eam-tab-page">
                <div className="eam-content">
                    <Collapse bconstructioned={false} defaultActiveKey={['1', '2', '3']}>
                        <Panel header={<span className="label">基本信息 <Icon type="caret-down"/></span>} key="1"
                               style={this.customPanelStyle}>
                            <NewForm data={constructionInfoData} editable={this.state.editable}
                                     parentProps={{...this.props}}/>
                        </Panel>
                        <Panel header={<span className="label">监管记录 <Icon type="caret-down"/></span>} key="2"
                               style={this.customPanelStyle}>
                            <Table
                                rowKey="id"
                                loading={this.state.superviseRecordLoading}
                                pagination={{
                                    showTotal: (total, range) => `当前第${range[0]}-${range[1]}条 / 共${total}条`,
                                    defaultPageSize: 5,
                                }}
                                dataSource={superviseRecordList}
                                columns={this.superviseRecordColumns}
                                bordered
                            />
                            <div className="panel-tools-right">
                                <Button type="primary" size="large" onClick={this.superviseRecordAdd}>新建</Button>
                            </div>
                        </Panel>
                        <Panel header={<span className="label">上传图片 <Icon type="caret-down"/></span>} key="3"
                               style={this.customPanelStyle}>
                            {
                                this.localConstruction && this.localConstruction.id ?
                                    <Upload
                                        quoteId={this.localConstruction.id}
                                        quoteType="assetImg"
                                        commonActions={commonActions}
                                        commonState={commonState}
                                    /> :
                                    <span>请保存工单后上传图片</span>
                            }
                        </Panel>
                        <Panel header={<span className="label">执行记录 <Icon type="caret-down"/></span>} key="4"
                               style={this.customPanelStyle}>
                            <Timeline>
                                {
                                    recordList.map((item, i) => {

                                        let time = item.endTime ? item.endTime.split(' ')[1] : '';

                                        let iconType;
                                        if (i === 0) {
                                            iconType = item.endTime ? 'minus-circle-o' : 'clock-circle-o';
                                        } else {
                                            iconType = item.processType === 'reject' ? 'exclamation-circle-o' : 'check-circle-o';
                                        }

                                        return (
                                            <Timeline.Item
                                                key={i}
                                                dot={
                                                    <div>
                                                        <div
                                                            className={recordDateArr[i] ? 'date' : ''}>{recordDateArr[i] ? recordDateArr[i] : ''} {recordDateArr[i] ?
                                                            <i></i> : ''}</div>
                                                        <div>
                                                            <Icon
                                                                className={item.processType === 'reject' ? 'red pull-right' : 'pull-right'}
                                                                type={iconType} style={{fontSize: '16px'}}/>
                                                            <span className="pull-right time">{time.slice(0, 5)}</span>
                                                        </div>
                                                    </div>
                                                }
                                            >
                                                <h2>
                                                    <span
                                                        className={item.processType === 'reject' ? 'red name' : 'name'}>{item.name}</span>
                                                    <span>持续时间：{item.durationInMillis ? `${msFormat(item.durationInMillis, 'h')}小时${msFormat(item.durationInMillis, 'm')}分钟` : '-'}</span>
                                                    &nbsp;&nbsp;
                                                    <span>责任人：{item.personName}</span>
                                                </h2>
                                                <p>{item.description}</p>
                                            </Timeline.Item>
                                        )
                                    })
                                }
                            </Timeline>
                        </Panel>
                    </Collapse>
                </div>
                <Modal
                    title={`${this.state.superviseRecordEditData ? '编辑' : '新建'}监管记录`}
                    ref={superviseRecordAddModal => this.superviseRecordAddModal = superviseRecordAddModal}
                    afterClose={this.superviseRecordAfterClose}
                >
                    <NewRecordForm data={this.state.superviseRecordEditData}
                                   ref={superviseRecordAddForm => this.superviseRecordAddForm = superviseRecordAddForm}/>
                    <div className="modal-footer clearfix">
                        <Button size="large" onClick={() => {
                            this.superviseRecordAddModal.modalHide()
                        }}>取消</Button>
                        <Button type="primary" size="large" onClick={this.superviseRecordAddSave}>确定</Button>
                    </div>
                </Modal>
            </div>
        )
    }
}

function mapStateToProps(state) {
    return {
        state: state.contract,
        commonState: state.common,
    }
}

function buildActionDispatcher(dispatch) {
    return {
        actions: bindActionCreators(actions, dispatch),
        commonActions: bindActionCreators(commonActions, dispatch),
    }
}

export default connect(mapStateToProps, buildActionDispatcher)(ConstructionOneComponent);
