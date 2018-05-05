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
import Upload from '../../components/common/upload.js';
import {msFormat} from '../../tools/';

import {Icon, Collapse, Form, Input, Row, Col, Select, DatePicker, Timeline, notification, InputNumber} from 'antd';
const Panel = Collapse.Panel;
const FormItem = Form.Item;

import moment from 'moment';

class FormComponent extends React.Component {
    constructor(props) {
        super(props)

        this.state = {
            selectPlanShow: false,
        }
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
        const {commonActions, commonState} = parentProps;
        const domainValueParam = {
            orgId: commonState.orgId,
            siteId: commonState.siteId,
            prodId: 'EAM'
        }
        commonActions.getDomainValue(domainValueParam, 'contractType', 'CONTRACT_TYPE');
    }

    render() {

        let {data, editable, parentProps, form} = this.props;
        let {state, commonState, location} = parentProps;
        const {getFieldDecorator} = form;

        const isAddManage = location.query.add_manage;

        const contractTypeData = commonState.contractTypeData;

        const nowDate = moment(moment().format('YYYY-MM-DD HH:mm:ss'));

        return (
            <div>
                <Form layout="vertical">
                    <Row gutter={16}>
                        <Col className="gutter-row" sm={{span: 0}}>
                            <FormItem
                                label="巡检合同id"
                            >
                                {
                                    getFieldDecorator('id', {
                                        initialValue: data.id
                                    })(
                                        <Input placeholder="" disabled/>
                                    )
                                }
                            </FormItem>
                        </Col>
                        <Col className="gutter-row" sm={{span: 0}}>
                            <FormItem
                                label="组织id"
                            >
                                {
                                    getFieldDecorator('orgId', {
                                        initialValue: isAddManage ? commonState.orgId : data.orgId
                                    })(
                                        <Input placeholder=""/>
                                    )
                                }
                            </FormItem>
                        </Col>
                        <Col className="gutter-row" sm={{span: 0}}>
                            <FormItem
                                label="站点id"
                            >
                                {
                                    getFieldDecorator('siteId', {
                                        initialValue: isAddManage ? commonState.siteId : data.siteId
                                    })(
                                        <Input placeholder=""/>
                                    )
                                }
                            </FormItem>
                        </Col>
                        <Col className="gutter-row" xs={{span: 0}}>
                            <FormItem
                                label="分派人id"
                            >
                                {
                                    getFieldDecorator('assignPersonId', {
                                        initialValue: data.assignPersonId || commonState.personId
                                    })(
                                        <Input placeholder="" disabled/>
                                    )
                                }
                            </FormItem>
                        </Col>
                        <Col className="gutter-row" xs={{span: 0}}>
                            <FormItem
                                label="物业单位负责人id"
                            >
                                {
                                    getFieldDecorator('propertyManagerId', {
                                        initialValue: data.propertyManagerId
                                    })(
                                        <Input placeholder="" disabled/>
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
                                        initialValue: isAddManage ? state.manageCode : data.contractNum
                                    })(
                                        <Input placeholder="" disabled/>
                                    )
                                }
                            </FormItem>
                        </Col>
                        <Col className="gutter-row" xs={{span: 8}}>
                            <FormItem
                                label="合同描述"
                            >
                                {
                                    getFieldDecorator('description', {
                                        initialValue: data.description,
                                        rules: [{required: true, message: '合同描述不能为空!'}],
                                    })(
                                        <Input placeholder="" disabled={!editable}/>
                                    )
                                }
                            </FormItem>
                        </Col>
                        <Col className="gutter-row" xs={{span: 5}}>
                            <FormItem
                                label="合同类型"
                            >
                                {
                                    getFieldDecorator('contractType', {
                                        initialValue: data.contractType ? data.contractType : (contractTypeData[0] && contractTypeData[0].value)
                                    })(
                                        <Select size="large" style={{width: '100%'}} disabled={!editable}>
                                            {
                                                contractTypeData.map((item, i) => <Option key={i}
                                                                                          value={item.value}>{item.description}</Option>)
                                            }
                                        </Select>
                                    )
                                }
                            </FormItem>
                        </Col>
                        <Col className="gutter-row" xs={{span: 6}}>
                            <FormItem
                                label="状态"
                            >
                                {
                                    getFieldDecorator('statusDsr', {
                                        initialValue: isAddManage ? '新增' : data && data.statusDsr
                                    })(
                                        <Input placeholder="" disabled/>
                                    )
                                }
                            </FormItem>
                        </Col>
                        <Col className="gutter-row" style={{display: 'none'}}>
                            <FormItem
                                label="状态值"
                            >
                                {
                                    getFieldDecorator('status', {
                                        initialValue: isAddManage ? 'XZ' : data && data.status
                                    })(
                                        <Input placeholder="" disabled/>
                                    )
                                }
                            </FormItem>
                        </Col>
                        <Col className="gutter-row" xs={{span: 4}}>
                            <FormItem
                                label="施工单位"
                            >
                                {
                                    getFieldDecorator('contractCompany', {
                                        initialValue: data.contractCompany,
                                        rules: [{required: true, message: '施工单位不能为空!'}]
                                    })(
                                        <Input placeholder="" disabled={!editable}/>
                                    )
                                }
                            </FormItem>
                        </Col>
                        <Col className="gutter-row" xs={{span: 8}}>
                            <FormItem
                                label="合同金额"
                            >
                                {
                                    getFieldDecorator('contractValue', {
                                        initialValue: data.contractValue,
                                    })(
                                        <InputNumber style={{width: '100%'}} min={0} step={0.01} disabled={!editable}/>
                                    )
                                }
                            </FormItem>
                        </Col>
                        <Col className="gutter-row" xs={{span: 5}}>
                            <FormItem
                                label="施工负责人"
                            >
                                {
                                    getFieldDecorator('chargePerson', {
                                        initialValue: data.chargePerson,
                                        rules: [{required: true, message: '施工负责人不能为空!'}]
                                    })(
                                        <Input placeholder="" disabled={!editable}/>
                                    )
                                }
                            </FormItem>
                        </Col>
                        <Col className="gutter-row" xs={{span: 6}}>
                            <FormItem
                                label="施工联系方式"
                            >
                                {
                                    getFieldDecorator('chargePersonPhone', {
                                        initialValue: data.chargePersonPhone,
                                        rules: [{required: true, message: '文本不能为空'},
                                            {pattern: /^1[3|4|5|8][0-9]\d{4,8}$/, message: '请输入正确的手机号码'}],
                                    })(
                                        <Input placeholder="" disabled={!editable}/>
                                    )
                                }
                            </FormItem>
                        </Col>
                        <Col className="gutter-row" xs={{span: 4}}>
                            <FormItem
                                label="合同生效日期"
                            >
                                {
                                    getFieldDecorator('effectiveDate', {
                                        initialValue: data.effectiveDate ? moment(data.effectiveDate, 'YYYY-MM-DD HH:mm') : nowDate,
                                        rules: [{
                                            type: 'object',
                                            required: true,
                                            message: '合同生效日期不能为空！',
                                        }],
                                    })(
                                        <DatePicker
                                            disabled={!editable}
                                            showTime
                                            format="YYYY-MM-DD"
                                            onChange={() => {
                                            }}
                                            onOk={() => {
                                            }}
                                        />
                                    )
                                }
                            </FormItem>
                        </Col>
                        <Col className="gutter-row" xs={{span: 8}}>
                            <FormItem
                                label="合同截止日期"
                            >
                                {
                                    getFieldDecorator('closingDate', {
                                        initialValue: data.closingDate ? moment(data.closingDate, 'YYYY-MM-DD HH:mm') : nowDate,
                                        rules: [{
                                            type: 'object',
                                            required: true,
                                            message: '合同截止日期不能为空！',
                                        }],
                                    })(
                                        <DatePicker
                                            disabled={!editable}
                                            showTime
                                            format="YYYY-MM-DD"
                                            onChange={() => {
                                            }}
                                            onOk={() => {
                                            }}
                                        />
                                    )
                                }
                            </FormItem>
                        </Col>
                        <Col className="gutter-row" xs={{span: 5}}>
                            <FormItem
                                label="监理单位负责人"
                            >
                                {
                                    getFieldDecorator('supervisorPerson', {
                                        initialValue: data.supervisorPerson,
                                        rules: [{required: true, message: '监理单位负责人不能为空!'}]
                                    })(
                                        <Input  disabled={!editable}/>
                                    )
                                }
                            </FormItem>
                        </Col>
                        <Col className="gutter-row" xs={{span: 6}}>
                            <FormItem
                                label="监理联系方式"
                            >
                                {
                                    getFieldDecorator('supervisorPersonPhone', {
                                        initialValue: data.supervisorPersonPhone,
                                        rules: [{required: true, message: '文本不能为空'},
                                            {pattern: /^1[3|4|5|8][0-9]\d{4,8}$/, message: '请输入正确的手机号码'}],
                                    })(
                                        <Input placeholder="" disabled={!editable}/>
                                    )
                                }
                            </FormItem>
                        </Col>
                        <Col className="gutter-row" xs={{span: 4}}>
                            <FormItem
                                label="工程名称"
                            >
                                {
                                    getFieldDecorator('projectName', {
                                        initialValue: data.projectName,
                                        rules: [{
                                            required: true,
                                            message: '工程名称不能为空！',
                                        }],
                                    })(
                                        <Input placeholder="" disabled={!editable}/>
                                    )
                                }
                            </FormItem>
                        </Col>
                        <Col className="gutter-row" xs={{span: 8}}>
                            <FormItem
                                label="工期(天)"
                            >
                                {
                                    getFieldDecorator('projectLimit', {
                                        initialValue: data.projectLimit,
                                        rules: [{
                                            required: true,
                                            message: '工期不能为空！',
                                        }],
                                    })(
                                        <InputNumber min={0} step={0.01} style={{width: '100%'}} disabled={!editable}/>
                                    )
                                }
                            </FormItem>
                        </Col>
                        <Col className="gutter-row" xs={{span: 5}}>
                            <FormItem
                                label="物业单位负责人"
                            >
                                {
                                    getFieldDecorator('propertyManager', {
                                        initialValue: data.propertyManager,
                                        rules: [{
                                            required: true,
                                            message: '物业单位负责人不能为空！',
                                        }],
                                    })(
                                        <Input data-name="propertyManager" placeholder="" readOnly
                                               onClick={this.personInputFocus} disabled={!editable}/>
                                    )
                                }
                            </FormItem>
                        </Col>
                        <Col className="gutter-row" xs={{span: 6}}>
                            <FormItem
                                label="物业联系方式"
                            >
                                {
                                    getFieldDecorator('propertyManagerPhone', {
                                        initialValue: data.propertyManagerPhone
                                    })(
                                        <Input placeholder="" disabled/>
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
                            [this.currentInp]: selected.name,
                            [this.currentInp + 'Id']: selected.personId,
                            [this.currentInp + 'Phone']: selected.mobile,
                        }
                        form.setFieldsValue(json);
                    }}
                />
            </div>
        )
    }
}
const NewForm = Form.create()(FormComponent)

class ManageOneComponent extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            currentPage: 1,
            editable: false,
        }

        this.customPanelStyle = {
            background: '#fff',
            bmanageRadius: 2,
            marginBottom: 24,
            bmanage: 0,
            boxShadow: '0 1px 6px rgba(0, 0, 0, 0.2)'
        };

        const {location} = this.props;

        const isAddManage = location.query.add_manage;

        this.param = {
            id: isAddManage ? '' : (localStorage.getItem('manage') && JSON.parse(localStorage.getItem('manage')).id),
            pageNum: 1,
            pageSize: 998,
        }

        this.localContractManage = JSON.parse(localStorage.getItem('manage'));

    }

    // 合同提报获取数据
    contractManageinfoGetList = () => {
        const {actions} = this.props;
        this.setState({assetLoading: true});
        actions.contractManageinfoUpdateList(this.param, () => {
            this.setState({assetLoading: false});
        });
    }

    componentWillMount() {
        const {actions, location, commonState} = this.props;
        const isAddManage = location.query.add_manage;

        if (this.localContractManage) {
            if (this.localContractManage.status === 'XZ') {
                this.setState({editable: true});
            } else {
                this.setState({editable: false});
            }
            this.contractManageinfoGetList();
        }
        if (isAddManage || !this.localContractManage) {
            this.setState({editable: true});
            actions.getCode({modelKey: 'contract', siteId: commonState.siteId}, "GET_MANAGE_CODE")
        }

    }

    render() {

        const {state, commonActions, commonState} = this.props;
        const manageinfoData = state.manageInfoListData || [];

        // 执行记录数据
        const recordList = manageinfoData.eamImpleRecordVoVoList || [];
        // 执行记录日期
        const recordDateArr = manageinfoData.dateArr;

        return (
            <div className="eam-tab-page">
                <div className="eam-content">
                    <Collapse bmanageed={false} defaultActiveKey={['1', '2', '3']}>
                        <Panel header={<span className="label">基本信息 <Icon type="caret-down"/></span>} key="1"
                               style={this.customPanelStyle}>
                            <NewForm data={manageinfoData} editable={this.state.editable}
                                     parentProps={{...this.props}}/>
                        </Panel>
                        <Panel header={<span className="label">上传文件 <Icon type="caret-down"/></span>} key="2"
                               style={this.customPanelStyle}>
                            {
                                (this.localContractManage && this.localContractManage.id) ?
                                    <Upload
                                        quoteId={this.localContractManage.id}
                                        quoteType="assetImg"
                                        commonActions={commonActions}
                                        commonState={commonState}
                                        fileType="pdf"
                                    /> :
                                    <span>请保存工单后上传图片</span>
                            }
                        </Panel>
                        <Panel header={<span className="label">执行记录 <Icon type="caret-down"/></span>} key="3"
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

export default connect(mapStateToProps, buildActionDispatcher)(ManageOneComponent);
