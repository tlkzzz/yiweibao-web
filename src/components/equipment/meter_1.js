/**
 * @Description 仪表台账
 */
import React from 'react';
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';
import actions from '../../actions/equipment.js';
import commonActions from '../../actions/common.js';

import SelectAsset from '../common/select_asset';
import SelectPerson from '../common/select_person';
import moment from 'moment';

import Dropdown from '../../components/common/dropdown.js';

import {
    Icon,
    Button,
    Upload,
    Modal,
    Checkbox,
    Table,
    Pagination,
    Collapse,
    Form,
    Input,
    Row,
    Col,
    Select,
    Radio,
    DatePicker
} from 'antd';
const Panel = Collapse.Panel;
const FormItem = Form.Item;
const Option = Select.Option;

class FormComponent extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            currentPage: 1,
            locationModalShow: false,
            selectPersonModalShow: false,
        }
    }

    selectCode = (stateAttr) => {
        this.setState({[stateAttr]: true});
    }

    componentDidUpdate() {
        const {state, actions, paramArr} = this.props;
        if (state.getFormValues) {
            actions.getFormValues(false);
            this.props.form.validateFields((err, values) => {
                if (!err) {
                    for (let attr in values) {
                        if (values[attr] === null || values[attr] == "") delete values[attr];
                    }
                    paramArr[0] = values;
                }
            });
        }
    }

    render() {
        const {getFieldDecorator} = this.props.form;
        const {data} = this.props;
        const {codeEntity} = this.props;
        const {commonState} = this.props;
        console.log(data,22);
        return (
        <div>	
            <Form layout="vertical" className="meter1-form1-code-parent">
            <img alt="code" className="meter1-code-img" src=''/>
                <Row gutter={12} justify="start">
                    <Col className="gutter-row" xs={{span: 0}}>
                        <FormItem
                        >
                            {
                                getFieldDecorator("id", {
                                    initialValue: data ? data.id : ''
                                })(
                                    <Input />
                                )
                            }
                        </FormItem>
                    </Col>
                    <Col className="gutter-row" xs={{span: 4}}>
                        <FormItem
                            label="仪表编码"
                        >
                            {
                                getFieldDecorator('code', {
                                    rules: [{required: true, message: ' '}],
                                    initialValue: data ? data.code : codeEntity
                                })(
                                    <Input disabled/>
                                )
                            }
                        </FormItem>
                    </Col>
                    <Col className="gutter-row" xs={{span: 6}}>
                        <FormItem
                            label="仪表型号"
                        >
                            {
                                getFieldDecorator('name', {
                                    rules: [{required: true, message: ' '}],
                                    initialValue: data ? data.name : ''
                                })(
                                    <Input />
                                )
                            }
                        </FormItem>
                    </Col>
                    <Col className="gutter-row" xs={{span: 5}}>
                        <FormItem
                            label="仪表类型"
                        >
                            {
                                getFieldDecorator('classificationId ', {
                                    rules: [{required: true, message: ' '}],
                                    initialValue: data ? data.classificationId : ''
                                })
                                (
                                    <Select size="large" style={{width: '100%'}}>
                                        <Option value="水表">水表</Option>
                                        <Option value="电表">电表</Option>
                                        <Option value="燃气表">燃气表</Option>
                                    </Select>
                                )
                            }
                        </FormItem>
                    </Col>
                    <Col className="gutter-row" xs={{span: 5}}>
                        <FormItem
                            label="启动时间"
                        >
                            {
                                getFieldDecorator('startDate', {
                                    initialValue: data ? data.startDate : ''
                                })
                                (
                                    <Input disabled/>
                                )
                            }
                        </FormItem>
                    </Col>
                </Row>
                <Row gutter={12} justify="start">

                    <Col className="gutter-row" xs={{span: 0}}>
                        <FormItem
                        >
                            {
                                getFieldDecorator('locationId', {
                                    initialValue: data ? data.locationId : this.state.locationId
                                })(
                                    <Input />
                                )
                            }
                        </FormItem>
                    </Col>

                    <Col className="gutter-row" xs={{span: 4}}>
                        <FormItem
                            label="位置编码"
                        >
                            {
                                getFieldDecorator('locationCode', {
                                    initialValue: data ? data.code : this.state.locationCode
                                })(
                                    <Input
                                        suffix={
                                            <Icon style={{cursor: 'pointer'}} type="plus" onClick={() => {
                                                this.selectCode('selectLocationShow')
                                            }}/>}
                                        onClick={() => {
                                            this.selectCode('selectLocationShow')
                                        }} readOnly
                                    />
                                )
                            }
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
                                    this.setState({
                                        locationCode: selected[0].code,
                                        locationId: selected[0].id,
                                        locationDesc: selected[0].description,
                                    })
                                }}
                            />
                        </FormItem>
                    </Col>


                    <Col className="gutter-row" xs={{span: 6}}>
                        <FormItem
                            label="位置描述"
                        >
                            {
                                getFieldDecorator('locationdescription', {
                                    initialValue: data ? data.locationdescription : this.state.locationDesc
                                })(
                                    <Input disabled/>
                                )
                            }
                        </FormItem>
                    </Col>
                    <Col className="gutter-row" xs={{span: 5}}>
                        <FormItem
                            label="仪表层级"
                        >
                            {
                                getFieldDecorator('meterLevel', {
                                    initialValue: data ? data.meterLevel : ''
                                })
                                (
                                    <Select size="large" style={{width: '100%'}}>
                                        <Option value="first_level">一级总表</Option>
                                        <Option value="second_level">二级分项</Option>
                                        <Option value="third_level">三级末端</Option>
                                    </Select>
                                )
                            }
                        </FormItem>
                    </Col>
                    <Col className="gutter-row" xs={{span: 5}}>
                        <FormItem
                            label="使用年限"
                        >
                            {
                                getFieldDecorator('servicelife ', {
                                    initialValue: data ? data.servicelife : ''
                                })
                                (
                                    <Input suffix="年"/>
                                )
                            }
                        </FormItem>
                    </Col>
                </Row>
                <Row gutter={12} justify="start">
                    <Col className="gutter-row" xs={{span: 10}}>
                        <FormItem
                            label="备注"
                        >
                            {
                                getFieldDecorator('memo', {
                                    initialValue: data ? data.memo : ''
                                })(
                                    <Input />
                                )
                            }
                        </FormItem>
                    </Col>
                    <Col className="gutter-row" xs={{span: 5}}>
                        <FormItem
                            label="能耗类型"
                        >
                            {
                                getFieldDecorator('consumeEnergyType', {
                                    initialValue: data ? data.consumeEnergyType : ''
                                })(
                                    <Select size="large" style={{width: '100%'}}>
                                        <Option value="cold_water">冷水</Option>
                                        <Option value="hot_water">热水</Option>
                                        <Option value="mid_water">中水</Option>
                                    </Select>
                                )
                            }
                        </FormItem>
                    </Col>
                    <Col className="gutter-row" xs={{span: 5}}>
                        <FormItem
                            label="状态"
                        >
                            {
                                getFieldDecorator('status ', {
                                    initialValue: data ? data.status : ''
                                })
                                (
                                    <Select size="large" style={{width: '100%'}}>
                                        <Option value="active">活动</Option>
                                        <Option value="noactive">不活动</Option>
                                    </Select>
                                )
                            }
                        </FormItem>
                    </Col>
                </Row>
                <Row gutter={12} justify="start">
                    <Col className="gutter-row" xs={{span: 10}}>
                        <FormItem
                            label="  "
                        >
                            {
                                getFieldDecorator('parentId', {
                                    initialValue: data ? data.parentId : ''
                                })(
                                    <Checkbox >
                                        是否需手动抄表？
                                    </Checkbox>
                                )
                            }
                        </FormItem>
                    </Col>
                    <Col className="gutter-row" xs={{span: 5}}>
                        <FormItem
                            label="用能种类"
                        >
                            {
                                getFieldDecorator('energyTypeId', {
                                    initialValue: data ? data.energyTypeId : ''
                                })
                                (
                                    <Select size="large" style={{width: '100%'}}>
                                        <Option value="生活用水">生活用水</Option>
                                        <Option value="工程用水">工程用水</Option>
                                        <Option value="商业用水">商业用水</Option>
                                        <Option value="工区用水">工区用水</Option>
                                        <Option value="厨房用水">厨房用水</Option>
                                        <Option value="三联用水">三联用水</Option>
                                    </Select>
                                )
                            }
                        </FormItem>
                    </Col>
                    <Col className="gutter-row" xs={{span: 5}}>
                        <FormItem
                            label="创建人"
                        >
                            {
                                getFieldDecorator('createUser', {
                                    initialValue: data ? data.createUser : commonState.loginName
                                })(
                                    <Input disabled/>
                                )
                            }
                        </FormItem>
                    </Col>
                </Row>
                <Row gutter={12} justify="start">
                    <Col className="gutter-row" xs={{span: 5}}>
                        <FormItem
                            label="日常价格"
                        >
                            {
                                getFieldDecorator('test17', {
                                    initialValue: '2.3'
                                })(
                                    <Input suffix="元/度" disabled/>
                                )
                            }
                        </FormItem>
                    </Col>
                    <Col className="gutter-row" xs={{span: 5}}>
                        <FormItem
                            label="波峰价格"
                        >
                            {
                                getFieldDecorator('memo', {
                                    initialValue: '2.3'
                                })(
                                    <Input suffix="元/度" disabled/>
                                )
                            }
                        </FormItem>
                    </Col>
                    <Col className="gutter-row" xs={{span: 5}}>
                        <FormItem
                            label="波谷价格"
                        >
                            {
                                getFieldDecorator('lead', {
                                    initialValue: '2.3'
                                })
                                (
                                    <Input suffix="元/度" disabled/>
                                )
                            }
                        </FormItem>
                    </Col>
                    <Col className="gutter-row" xs={{span: 5}}>
                        <FormItem
                            label="当前时间"
                        >
                            {
                                getFieldDecorator('statusDate ', {
                                    initialValue: data ? data.statusDate : new Date().toLocaleTimeString()
                                })(
                                    <Input  />
                                )
                            }
                        </FormItem>
                    </Col>
                </Row>
            </Form>
            	
         
        </div>    
        )
    }
}
const NewFormComponent = Form.create()(FormComponent)
//采购信息
class BuyFormComponent extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            currentPage: 1,
        }
    }

    componentDidUpdate() {
        const {state, actions, paramArr, commonState} = this.props;

        if (state.getFormValues) {
            actions.getFormValues(false);
            this.props.form.validateFields((err, values) => {
                if (!err) {
                    for (let attr in values) {
                        if (values[attr] === null || values[attr] == "") delete values[attr];
                    }
                    paramArr[1] = values;
                    const FormValuesArr = paramArr;
                    if (FormValuesArr != null) {
                        const param = Object.assign(FormValuesArr[0], FormValuesArr[1]);
                        param.installDate = moment(param.installDate).format('YYYY-MM-DD HH:mm:ss');
                        param.warrantyEndDate = moment(param.warrantyEndDate).format('YYYY-MM-DD HH:mm:ss');
                        param.siteId = commonState.siteId;
                        param.orgId = commonState.orgId;


                        const listParam = {
                            pageNum: 1,
                            pageSize: 10,
                            siteId: commonState.siteId,
                            orgId: commonState.orgId,
                        }
                        const id = param.id;
                        console.log(param);
                        if (id == undefined || id == '') {
                            actions.informationAdd(param, (json) => {
                                if (json.success) {
                                    // actions.inventoryGetList(listParam);
                                    browserHistory.push('/equipment/meter');
                                } else {
                                    message.error(json.msg);
                                }
                            });
                        } else {
                            actions.informationUpdate(param, (json) => {
                                if (json.success) {
                                    // actions.inventoryGetList(listParam);
                                    browserHistory.push('/equipment/meter');
                                } else {
                                    message.error(json.msg);
                                }
                            });
                        }
                    }
                }
            });
        }
    }

    render() {
        const {getFieldDecorator} = this.props.form;
        const {data} = this.props;
        console.log(getFieldDecorator);
        return (
            <Form layout="vertical">
                <Row gutter={16} justify="start">
                    <Col className="gutter-row" xs={{span: 6}}>
                        <FormItem
                            label="供应商"
                        >
                            {
                                getFieldDecorator('vendorId', {
                                    rules: [{required: true, message: ' '}],
                                    initialValue: data ? data.vendorId : ''
                                })(
                                    <Input  />
                                )
                            }
                        </FormItem>
                    </Col>
                    <Col className="gutter-row" xs={{span: 6}}>
                        <FormItem
                            label="制造商"
                        >
                            {
                                getFieldDecorator('manufacturer', {
                                    rules: [{required: true, message: ' '}],
                                    initialValue: data ? data.manufacturer : ''
                                })(
                                    <Input  />
                                )
                            }
                        </FormItem>
                    </Col>
                    <Col className="gutter-row" xs={{span: 6}}>
                        <FormItem
                            label="出厂编号"
                        >
                            {
                                getFieldDecorator('serialNum', {
                                    rules: [{required: true, message: ' '}],
                                    initialValue: data ? data.serialNum : ''
                                })(
                                    <Input  />
                                )
                            }
                        </FormItem>
                    </Col>
                    <Col className="gutter-row" xs={{span: 6}}>
                        <FormItem
                            label="采购价格"
                        >
                            {
                                getFieldDecorator('purchasePrice', {
                                    rules: [{required: true, message: ' '}],
                                    initialValue: data ? data.purchasePrice : ''
                                })(
                                    <Input  />
                                )
                            }
                        </FormItem>
                    </Col>
                </Row>
                <Row gutter={16} justify="start">
                    <Col className="gutter-row" xs={{span: 6}}>
                        <FormItem
                            label="安装日期"
                        >
                            {
                                getFieldDecorator('installDate', {
                                    rules: [{required: true, message: ' '}],
                                    // initialValue: data ? moment(data.installDate).format('YYYY-MM-DD HH:mm:ss') : moment(new Date()).format('YYYY-MM-DD HH:mm:ss')
                                })(
                                    <DatePicker
                                        format="YYYY-MM-DD HH:mm:ss"
                                        placeholder=""
                                        onChange={(onChange) => {
                                        }}
                                        onOk={(onOk) => {
                                        }}
                                    />
                                )
                            }
                        </FormItem>
                    </Col>
                    <Col className="gutter-row" xs={{span: 6}}>
                        <FormItem
                            label="保修截止日期"
                        >
                            {
                                getFieldDecorator('warrantyEndDate', {
                                    rules: [{required: true, message: ' '}],
                                    // initialValue: data ? moment(data.warrantyEndDate).format('YYYY-MM-DD HH:mm:ss') : moment(new Date()).format('YYYY-MM-DD HH:mm:ss')
                                })(
                                    <DatePicker
                                        showTime
                                        format="YYYY-MM-DD HH:mm:ss"
                                        placeholder=""
                                        onChange={(onChange) => {
                                        }}
                                        onOk={(onOk) => {
                                        }}
                                    />
                                )
                            }
                        </FormItem>
                    </Col>
                </Row>
            </Form>
        )
    }
}
const BFormComponent = Form.create()(BuyFormComponent)
//图片信息
class PicturesWall extends React.Component {
    state = {
        previewVisible: false,
        previewImage: '',
        fileList: [{
            uid: -1,
            name: 'xxx.png',
            status: 'done',
            url: 'https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png',
        }],
    };

    handleCancel = () => this.setState({previewVisible: false})

    handlePreview = (file) => {
        this.setState({
            previewImage: file.url || file.thumbUrl,
            previewVisible: true,
        });
    }

    handleChange = ({fileList}) => this.setState({fileList})

    render() {
        const {previewVisible, previewImage, fileList} = this.state;
        const uploadButton = (
            <div>
                <Icon type="plus"/>
                <div className="ant-upload-text">上传</div>
            </div>
        );
        return (
            <div className="clearfix">
                <Upload
                    action="//jsonplaceholder.typicode.com/posts/"
                    listType="picture-card"
                    fileList={fileList}
                    onPreview={this.handlePreview}
                    onChange={this.handleChange}
                >
                    {fileList.length >= 3 ? null : uploadButton}
                </Upload>
                <Modal visible={previewVisible} footer={null} onCancel={this.handleCancel}>
                    <img alt="example" style={{width: '100%'}} src={previewImage}/>
                </Modal>
            </div>
        );
    }
}

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
            id: localStorage.meterId,
            pageNum: 1,
            pageSize: 10,
        }
    }

    // 设备设施信息
    taskGetList = () => {
        const {commonActions, actions, commonState} = this.props;
        // this.setState({
        //     taskstepsLoading: true,
        //     materialsLoading: true
        // });
        const id = localStorage.meterId;

        if (id == undefined) {

            const param = {modelKey: "item", siteId: commonState.siteId, orgId: commonState.orgId};

            commonActions.codeGenerator(param, (json) => {
                if (json.success) {

                } else {
                    message.error(json.msg);
                }
            });
        }
        actions.informationEntity(this.taskParam, () => {
        });
    }

    componentWillMount() {
        this.taskGetList();
    }

    render() {

        const {state, commonState, actions} = this.props;
        const data = state.meterEntity;
        const code = commonState.codeEntity;
        const paramArr = [];

        return (
            <div className="eam-tab-page">
                <div className="eam-content">
                    <Collapse bordered={false} defaultActiveKey={['1', '2', '3']}>
                        <Panel header={<span className="label">基本信息 <Icon type="caret-down"/></span>} key="1"
                               style={this.customPanelStyle}>
                            <NewFormComponent data={data} codeEntity={code} commonState={commonState} state={state}
                                              actions={actions}
                                              paramArr={paramArr}/>
                        </Panel>
                        <Panel header={<span className="label">采购信息 <Icon type="caret-down"/></span>} key="2"
                               style={this.customPanelStyle}>
                            <BFormComponent data={data} commonState={commonState} state={state}
                                            actions={actions}
                                            paramArr={paramArr}/>
                        </Panel>
                        <Panel header={<span className="label">图片信息 <Icon type="caret-down"/></span>} key="3"
                               style={this.customPanelStyle} commonState={commonState}>
                            <PicturesWall />
                        </Panel>
                    </Collapse>
                </div>
            </div>
        )
    }
}


function mapStateToProps(state) {
    return {
        state: state.equipment,
        commonState: state.common,
    }
}

function buildActionDispatcher(dispatch) {
    return {
        actions: bindActionCreators(actions, dispatch),
        commonActions: bindActionCreators(commonActions, dispatch),
    }
}

export default connect(mapStateToProps, buildActionDispatcher)(WorkOrderOneComponent);
