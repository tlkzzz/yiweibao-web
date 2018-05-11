/** 
 * @Description 设备设施信息
 */
import React from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import actions from '../../actions/equipment.js';
import commonActions from '../../actions/common';
import { createForm } from 'rc-form';

import Dropdown from '../../components/common/dropdown.js';
import SelectAsset from '../common/select_asset';
import SelectPerson from '../common/select_person';
import SelectPublic from '../common/select_public';
import Upload from '../common/upload.js';

import { runActionsMethod } from '../../tools/';
import moment from 'moment';

import { Icon, Button, Modal, Table, Pagination, InputNumber , Collapse, Form, Input, Row, Col, Select, DatePicker, message } from 'antd';
const Panel = Collapse.Panel;
const FormItem = Form.Item;
const Option = Select.Option;

class FormComponent extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            currentPage: 1,
            parentAsset: {},
          //位置编码
            location: {},
            classification: {},
            locationModalShow: false,
            classificationModalShow: false,
            parentCodeModalShow: false,
            selectPersonModalShow: false,
            person: {  //负责人
                id: '',
                value: '',
            },
        }
       this.currentInp = '';
    }

    locationAdd = () => {
        this.setState({ locationModalShow: true });
    }
    classificationAdd = () => {
        this.setState({ classificationModalShow: true });
    }
    parentAdd = () => {
        this.setState({ parentCodeModalShow: true });
    }
   //选择负责人
    personInputFocus = (e) => {
        this.currentInp = e.target.getAttribute('data-name');
        this.setState({
            selectPersonModalShow: true
        })
    }

    render () {
        const { getFieldDecorator } = this.props.form;
        const { data , commonState , state , location } = this.props;
        const isAdd = location.query.add_asset;
        return (
            <Form layout="vertical">
                <Row gutter={16} justify="start">
                    <Col className="gutter-row" xs={{ span: 4}}>
                        <FormItem
                            label="设备设施编码"
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
                    <Col className="gutter-row" xs={{ span: 8}}>
                        <FormItem
                            label="设备设施名称"
                        >
                            {
                                getFieldDecorator('name',{
                                    initialValue: data ? data.name : '',
                                    rules: [{ required: true, message: '文本不能为空' }],
                                })(
                                    <Input />
                                )
                            }
                        </FormItem>
                    </Col>
                    <Col className="gutter-row" xs={{ span: 6}}>
                        <FormItem
                            label="启动日期"
                        >
                            {
                                getFieldDecorator('startDate',{
                                    initialValue: (data && data.startDate) && moment( data.startDate, 'YYYY-MM-DD HH:mm:ss'),
                                })
                                (
                                    <DatePicker
                                      showTime
                                      format="YYYY-MM-DD HH:mm:ss"
                                      placeholder=""
                                      onChange={(onChange) => {}}
                                      onOk={(onOk) => {}}
                                    />
                                )
                            }
                        </FormItem>
                    </Col>
                    <Col className="gutter-row" xs={{ span: 6}}>
                        <FormItem
                            label="规格型号"
                        >
                            {
                                getFieldDecorator('specificationModel', {
                                    initialValue: data ? data.specificationModel : ''
                                })(
                                    <Input />
                                )
                            }
                        </FormItem>
                    </Col>
                </Row>
                <Row gutter={16} justify="start">
                    <Col className="gutter-row" xs={{ span: 4}}>
                        <FormItem
                            label="位置编码"
                        >
                            {
                                getFieldDecorator('locationCode', {
                                    initialValue:  this.state.location.code ? this.state.location.code : data && data.location ? data.location.code : '',
                                    rules: [{ required: true, message: '文本不能为空' }],
                                })(
                                    <Input  onClick={this.locationAdd} suffix={<Icon type="plus" /> }/>
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
                                                productArray: commonState.productArray,
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
                                        location: record[0],
                                    }, () => { this.props.changeLocation(this.state.location)})
                                 }
                              }
                            />
                        </FormItem>
                    </Col>


                    <Col className="gutter-row" xs={{ span: 8}}>
                        <FormItem
                            label="位置描述"
                        >
                            {
                                getFieldDecorator('location.description',{
                                    initialValue:  this.state.location.description ? this.state.location.description : data && data.location ? data.location.description : '',
                                })(
                                    <Input  disabled/>
                                )
                            }
                        </FormItem>
                    </Col>
                    <Col className="gutter-row" xs={{ span: 6}}>
                        <FormItem
                            label="使用日期"
                        >
                            {
                                getFieldDecorator('usedate',{
                                    initialValue: (data && data.usedate) && moment( data.usedate, 'YYYY-MM-DD HH:mm:ss'),
                                })
                                (
                                    <DatePicker
                                      showTime
                                      format="YYYY-MM-DD HH:mm:ss"
                                      placeholder=""
                                      onChange={(onChange) => {}}
                                      onOk={(onOk) => {}}
                                    />
                                )
                            }
                        </FormItem>
                    </Col>
                    <Col className="gutter-row" xs={{ span: 6}}>
                        <FormItem
                            label="状态"
                        >
                            {
                                getFieldDecorator('status', {
                                    initialValue: isAdd ? 'free' : data.status
                                })(
                                    <Select size="large" style={{ width: '100%' }} >
                                        <Option value="enable">使用中</Option>
                                        <Option value="free">闲置</Option>
                                        <Option value="disable">废弃</Option>
                                    </Select>
                                )
                            }
                        </FormItem>
                    </Col>
                </Row>
                <Row gutter={16} justify="start">
                    <Col className="gutter-row" xs={{ span: 4}}>
                        <FormItem
                            label="分类编码"
                        >
                            {
                                getFieldDecorator('classificationCode',{
                                    initialValue:  this.state.classification.code ? this.state.classification.code : data && data.classification ? data.classification.code : '',
                                    rules: [{ required: true, message: '文本不能为空' }],
                                })(
                                    <Input  onClick={this.classificationAdd}  suffix={<Icon type="plus" /> }/>
                                )
                            }
                            <SelectAsset
                                treeData = {
                                    [
                                        {
                                            name: '分类查询',
                                            key: 'classifications',
                                            actionsMethod: 'classifiGetTree',
                                            data: 'classifiTreeData',
                                        }
                                    ]
                                }
                                getClassifiList //获取分类列表
                                selectAssetModalHide={() => { this.setState({ classificationModalShow: false }) }}
                                visible={this.state.classificationModalShow}
                                onOk={(record) => {
                                    this.setState({
                                        classification: record[0],
                                    },() => { this.props.changeClassification(this.state.classification)})
                                }}
                            />
                        </FormItem>
                    </Col>
                    <Col className="gutter-row" xs={{ span: 8}}>
                        <FormItem
                            label="分类描述"
                        >
                            {
                                getFieldDecorator('classification.name',{
                                    initialValue:  this.state.classification.name ? this.state.classification.name : data && data.classification ? data.classification.name : '',
                                })(
                                    <Input  disabled/>
                                )
                            }
                        </FormItem>
                    </Col>
                    <Col className="gutter-row" xs={{ span: 6}}>
                        <FormItem
                            label="使用年限"
                        >
                            {
                                getFieldDecorator('servicelife',{
                                    initialValue: data ? data.servicelife  : '',
                                    rules: [{ pattern: /\d/, message: '请输入数字类型' }],
                                })
                                (
                                    <InputNumber precision={2} min={1} style={{ width: '100%' }} suffix="年" />
                                )
                            }
                        </FormItem>
                    </Col>
                    <Col className="gutter-row" xs={{ span: 6}}>
                        <FormItem
                            label="备注"
                        >
                            {
                                getFieldDecorator('memo',{
                                    initialValue: data ? data.memo   : ''
                                })(
                                    <Input />
                                )
                            }
                        </FormItem>
                    </Col>
                </Row>
                <Row gutter={16} justify="start">
                    <Col className="gutter-row" xs={{ span: 4}}>
                        <FormItem
                            label="父级编码"
                        >
                            {
                                getFieldDecorator('parentAsset.code',{
                                    initialValue:   this.state.parentAsset.code ? this.state.parentAsset.code :  data && data.parentAsset ? data.parentAsset.code : ''
                                })(
                                    <Input  onClick={this.parentAdd} suffix={<Icon type="plus" /> }/>
                                )
                            }
                            <SelectAsset
                                treeData = {
                                    [
                                        {
                                            name: '分类查询',
                                            key: 'classifications',
                                            actionsMethod: 'classifiGetTree',
                                            data: 'classifiTreeData',
                                        },
                                        {
                                            name: '位置体系',
                                            key: 'locations',
                                            param: {
                                                orgId: 'e0bc74c4f58611e58c2d507b9d28ddca',
                                                siteId: '8aaf4fb85474172c01547990053f00be',
                                            },
                                            actionsMethod: 'locationsGetTree',
                                            data: 'locationsTreeData',
                                        },
                                    ]
                                }
                                selectAssetModalHide={() => { this.setState({ parentCodeModalShow: false }) }}
                                visible={this.state.parentCodeModalShow}
                                onOk={(record) => {
                                    this.setState({
                                        parentAsset: record[0],
                                    },() => { this.props.changeParent(this.state.parentAsset)})
                                }}
                            />
                        </FormItem>
                    </Col>
                    <Col className="gutter-row" xs={{ span: 8}}>
                        <FormItem
                            label="父级描述"
                        >
                            {
                                getFieldDecorator('parentAsset.name',{
                                    initialValue:   this.state.parentAsset.name ? this.state.parentAsset.name :  data && data.parentAsset ? data.parentAsset.name : ''
                                })(
                                    <Input  disabled/>
                                )
                            }
                        </FormItem>
                    </Col>
                    <Col className="gutter-row" xs={{ span: 6}}>
                        <FormItem
                            label="负责部门"
                        >
                            {
                                getFieldDecorator('department',{
                                    initialValue: data ? data.department   : ''
                                })
                                (
                                  <Select size="large" style={{ width: '100%' }}>
                                      <Option value="请选择">请选择</Option>
                                      <Option value="工程部">工程部</Option>
                                      <Option value="安保部">安保部</Option>
                                  </Select>
                                )
                            }
                        </FormItem>
                    </Col>
                    <Col className="gutter-row" xs={{ span: 6}}>
                        <FormItem
                            label="负责人"
                        >
                            {
                                getFieldDecorator('lead',{
                                    initialValue:  this.state.person.value ? this.state.person.value :  data ? data.lead : ''
                                })
                                (
                                    <Input id={this.state.person.id} data-name="person" onClick={this.personInputFocus}  suffix={<Icon type="plus"/> } />
                                )
                            }
                            <SelectPerson
                                visible={this.state.selectPersonModalShow}
                                selectPersonModalHide={() => { this.setState({selectPersonModalShow: false}) }}
                                onOk={(selected) => {
                                    this.setState({
                                        [this.currentInp]: {
                                            id: selected.id,
                                            value: selected.name,
                                        }
                                    })
                                }}
                            />
                        </FormItem>
                    </Col>
                </Row>
                <Row gutter={16} justify="start">
                    <Col className="gutter-row" xs={{ span: 4}}>
                        <FormItem
                            label="状态时间"
                        >
                            {
                                getFieldDecorator('statusDate', {
                                    initialValue: moment( new Date(), 'YYYY-MM-DD HH:mm:ss'),
                              })(
                                    <DatePicker
                                      showTime
                                      disabled
                                      format="YYYY-MM-DD HH:mm:ss"
                                      placeholder=""
                                      onChange={(onChange) => {}}
                                      onOk={(onOk) => {}}
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
const NewFormComponent = Form.create()(FormComponent);
//采购信息
class BuyFormComponent extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            vendorModalShow: false,
        }
        this.vendorColumns = [
            {
                title: '姓名',
                dataIndex: 'name',
                key: 'name',
            },
        ];
    }
    applicationAdd = (stateAttr) => {
        this.setState({ [stateAttr]: true });
    }
    render () {
        const { getFieldDecorator } = this.props.form;
        const { data ,commonState } = this.props;
        return (
            <Form layout="vertical">
                <Row gutter={16} justify="start">
                    <Col className="gutter-row" xs={{ span: 6}}>
                        <FormItem
                            label="供应商"
                        >
                            {
                                getFieldDecorator('vendorName',{
                                    initialValue : this.state.name ? this.state.name : data ? data.vendorName : ''
                                })(
                                    <Input  onClick={() => {this.applicationAdd('vendorModalShow')}}  suffix={<Icon type="plus"/>}/>
                                )
                            }
                        </FormItem>
                        <SelectPublic
                            fetch={{
                                url: "/ams/open/companies/findPage",
                                type: 'post',
                                data: {
                                    pageNum:1,
                                    pageSize:5,
                                    orgId: commonState.orgId,
                                },
                                actionsType: 'VENDOR_GET_LIST'
                            }}
                            stateAttr="vendorListData"
                            width={800}
                            modalHide={() => { this.setState({ vendorModalShow: false }) }}
                            columns={this.vendorColumns}
                            visible={this.state.vendorModalShow}
                            onOk={record => {
                                this.setState({
                                     name: record.name,
                                     vendorId: record.id,
                                })
                            }}
                        />
                    </Col>
                    <Col className="gutter-row" style={{display: 'none'}}>
                        <FormItem
                            label="供应商id"
                        >
                            {
                                getFieldDecorator('vendorId',{
                                    initialValue: this.state.vendorId ? this.state.vendorId : data ? data.vendorId : '',
                                })(
                                    <Input />
                                )
                            }
                        </FormItem>
                    </Col>
                    <Col className="gutter-row" xs={{ span: 6}}>
                        <FormItem
                            label="制造商"
                        >
                            {
                              getFieldDecorator('manufacturer',{
                                  initialValue : data ? data.manufacturer  : ''
                              })(
                                    <Input  />
                               )
                            }
                        </FormItem>
                    </Col>
                    <Col className="gutter-row" xs={{ span: 6}}>
                        <FormItem
                            label="出厂编号"
                        >
                            {
                              getFieldDecorator('serialNum',{
                                  initialValue : data ? data.serialNum  : ''
                              })(
                                  <Input  />
                               )
                            }
                        </FormItem>
                    </Col>
                    <Col className="gutter-row" xs={{ span: 6}}>
                        <FormItem
                            label="采购价格"
                        >
                            {
                              getFieldDecorator('purchasePrice',{
                                  initialValue : data ? data.purchasePrice   : '',
                                  rules: [{ pattern: /\d/, message: '请输入数字类型' }],
                              })(
                                  <InputNumber precision={2} min={1} style={{ width: '100%' }} suffix="元" />
                               )
                            }
                        </FormItem>
                    </Col>
                </Row>
                <Row gutter={16} justify="start">
                    <Col className="gutter-row" xs={{ span: 6}}>
                        <FormItem
                            label="安装日期"
                        >
                            {
                              getFieldDecorator('installDate',{
                                  initialValue: (data && data.installDate) && moment( data.usedate, 'YYYY-MM-DD HH:mm:ss'),
                              })(
                                  <DatePicker
                                    showTime
                                    format="YYYY-MM-DD HH:mm:ss"
                                    placeholder=""
                                    onChange={(onChange) => {}}
                                    onOk={(onOk) => {}}
                                  />
                                )
                            }
                        </FormItem>
                    </Col>
                    <Col className="gutter-row" xs={{ span: 6}}>
                        <FormItem
                            label="验收日期"
                        >
                            {
                              getFieldDecorator('acceptanceDate',{
                                  initialValue: (data && data.acceptanceDate) && moment( data.usedate, 'YYYY-MM-DD HH:mm:ss'),
                              })(
                                  <DatePicker
                                    showTime
                                    format="YYYY-MM-DD HH:mm:ss"
                                    placeholder=""
                                    onChange={(onChange) => {}}
                                    onOk={(onOk) => {}}
                                  />
                                )
                            }
                        </FormItem>
                    </Col>
                    <Col className="gutter-row" xs={{ span: 6}}>
                        <FormItem
                            label="保修截止日期"
                        >
                            {
                              getFieldDecorator('warrantyEndDate',{
                                  initialValue: (data && data.warrantyEndDate) && moment( data.usedate, 'YYYY-MM-DD HH:mm:ss'),
                              })(
                                  <DatePicker
                                    showTime
                                    format="YYYY-MM-DD HH:mm:ss"
                                    placeholder=""
                                    onChange={(onChange) => {}}
                                    onOk={(onOk) => {}}
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
const BFormComponent = Form.create()(BuyFormComponent);

class WorkOrderOneComponent extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            currentPage: 1,
            location: {},
            classification: {},
            parentAsset: {},
        }

        this.customPanelStyle = {
            background: '#fff',
            borderRadius: 2,
            marginBottom: 24,
            border: 0,
            boxShadow: '0 1px 6px rgba(0, 0, 0, 0.2)'
        };
        const { location } = this.props;

        const isAdd = location.query.add_asset;
        this.asset = localStorage.getItem('asset');
        this.taskParam = {
            id: isAdd ? '' : (this.asset && JSON.parse(this.asset).id),
            pageNum: 1,
            pageSize: 10,
        }
    }

    // 设备设施信息
    getList = () => {
        const { actions,state } = this.props;
        this.setState({
            informationsLoading: true,
        });
        actions.informationGetList(this.taskParam, () => {
            this.setState({
                informationsLoading: false,
                location: this.props.state.informationListData ? this.props.state.informationListData.location : '',
                classification: this.props.state.informationListData ? this.props.state.informationListData.classification : '',
                parentAsset: this.props.state.informationListData ? this.props.state.informationListData.parentAsset : '',
            });
            console.log(this.props.state.informationListData.location,1)
            console.log(this.props.state.informationListData.classification,1)
            console.log(this.props.state.informationListData.parentAsset,1)
            //获取父级的位置
              let location = this.state.location;
              let classification = this.state.classification;
              let parentAsset = this.state.parentAsset;
              let locationId = this.state.location.id;
              let classificationId = this.state.classification.id;

              const ll = this.informationsAddForm.props.form.getFieldsValue();
              const structureParam = {
                  ll,
                  classification,
                  locationId,
                  classificationId,
                  location,
                  parentAsset,
              }
              const param = JSON.stringify(structureParam);
              localStorage.setItem("param",param);
        });
    }

//点击保存
    informationSave = () => {

        const  { actions, commonState ,state, location } = this.props;
        const isAdd = location.query.add_asset;
        const id = isAdd ? '' : (JSON.parse(localStorage.getItem('asset')).id);
        let buyParam = {};
        this.BuyAddForm.props.form.validateFields((err, values) => {
            if (err) {
                message.error("采购价格是数字类型");
                return;
            } else {
                const installDate = values['installDate'] ? moment(values['installDate']).format('YYYY-MM-DD HH:mm:ss') : '';
                const acceptanceDate = values['acceptanceDate'] ? moment(values['acceptanceDate']).format('YYYY-MM-DD HH:mm:ss') : '';
                const warrantyEndDate = values['warrantyEndDate'] ? moment(values['warrantyEndDate']).format('YYYY-MM-DD HH:mm:ss') : '';
                buyParam = {
                    ...values,
                    installDate,
                    acceptanceDate,
                    warrantyEndDate
                };
            }
        })
        this.informationsAddForm.props.form.validateFields((err, values) => {
            if(err) {
                message.error("*是必填数据,使用年限是数字类型");
                return;
            } else {
                const siteId = commonState.siteId;
                const orgId = commonState.orgId;
                const startDate = values['startDate'] ? moment(values['startDate']).format('YYYY-MM-DD HH:mm:ss') : '';
                const usedate = values['usedate'] ? moment(values['usedate']).format('YYYY-MM-DD HH:mm:ss'): '';
                const statusDate = values['statusDate'] ? moment(values['statusDate']).format('YYYY-MM-DD HH:mm:ss') : '';
                const status = values['status'];
                let location = this.state.location;
                let locationId = location.id;
                let parentAsset = this.state.parentAsset;
                let parentId = parentAsset ? parentAsset.id : '';

                let classification = this.state.classification;
                let classificationId = classification.id;

                let param = {
                    ...values,
                    ...buyParam,
                    locationId,
                    location,
                    siteId,
                    orgId,
                    classificationId,
                    classification,
                    startDate,
                    status,
                    usedate,
                    statusDate,
                    parentId,
                    parentAsset,
                    products: commonState.productArray,
                    id,
                }
                if(values["locationCode"] != '' && values["classificationCode"] != '' && values["code"] !='' && values["name"] !='') {
                    const taskParam = {
                        ...values,
                        ...buyParam,
                        parentId,
                        parentAsset,
                        location,
                        locationId,
                        classificationId,
                        classification,
                        startDate,
                        orgId,
                        status,
                        siteId,
                        usedate,
                        statusDate,
                        products: commonState.productArray,
                    }
                    if(id) {
                        runActionsMethod(actions, 'informationUpdate', param, () => {
                            this.getList();
                        });
                    }else {
                        runActionsMethod(actions, 'informationAdd', taskParam, (json) => {
                            const data = json.data;
                            const obj = {};
                            obj.id = data.id;
                            obj.status = data.status;
                            obj.code = data.code;
                            obj.description = data.description;

                            localStorage.setItem('asset', JSON.stringify(obj));
                            this.getList();
                        });
                    }
                }
            }
        })
        this.getList();
    }

    componentWillMount () {
        const { actions, location , commonState } = this.props;
        const isAdd = location.query.add_asset;

        this.asset && this.getList();
        if (isAdd || !this.asset) {
            actions.codeGetList({modelKey: 'asset', siteId : commonState.siteId});
            actions.informationGetList({id: ''}, () => {
                this.setState({
                    informationsLoading: false,
                })
            });
        }
    }

    render () {
        const { state, commonState , location ,commonActions } = this.props;
        const list = state.informationListData;
        const isAdd = location.query.add_asset;
        const getCodeData = state.getCodeData;

        localStorage.setItem('getCodeData', getCodeData);

        let  asset = localStorage.getItem('asset');
        let id = isAdd ? '' : (asset && JSON.parse(this.asset).id);
        return (
            <div className="eam-tab-page">
                <div className="eam-content">
                    <Collapse bordered={false} defaultActiveKey={['1','2','3']}>
                        <Panel header={<span className="label">基本信息 <Icon type="caret-down" /></span>} key="1" style={this.customPanelStyle}>
                            <div className="panel-tools-right">
                                <Button size="large" type="primary" onClick={ this.informationSave }>保存</Button>
                            </div>
                            <NewFormComponent
                                data={list}
                                location={location}
                                commonState={commonState}
                                state={state}
                                changeLocation={(value) => {
                                    let { location } = this.state;
                                    location = value;
                                    this.setState({ location });
                                }}
                                changeClassification={(value) => {
                                    let { classification } = this.state;
                                    classification = value;
                                    this.setState({ classification });
                                }}
                                changeParent={(value) => {
                                    let { parentAsset } = this.state;
                                    parentAsset = value;
                                    this.setState({ parentAsset });
                                }}
                                wrappedComponentRef={informationsAddForm => this.informationsAddForm = informationsAddForm}
                            />
                        </Panel>
                        <Panel header={<span className="label">采购信息 <Icon type="caret-down" /></span>} key="2" style={this.customPanelStyle}>
                            <BFormComponent  data={list} commonState={commonState}  wrappedComponentRef={BuyAddForm => this.BuyAddForm = BuyAddForm}/>
                        </Panel>
                        <Panel header={<span className="label">图片信息 <Icon type="caret-down" /></span>} key="3" style={this.customPanelStyle}>
                        {
                            isAdd ?
                            <span>请保存后再上传图片</span>
                            :
                            <Upload
                                quoteId={id}
                                quoteType="assetImg"
                                commonActions={commonActions}
                                commonState={commonState}
                            />
                        }
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

export default connect(mapStateToProps, buildActionDispatcher)(WorkOrderOneComponent);
