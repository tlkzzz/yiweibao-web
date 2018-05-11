/** 
 * @Description 设备设施信息
 */
import React from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import actions from '../../actions/equipment.js';
import commonActions from '../../actions/common';
import { createForm } from 'rc-form';
import { browserHistory } from 'react-router';
import Dropdown from '../../components/common/dropdown.js';
import SelectAsset from '../common/select_asset';
import SelectPerson from '../common/select_person';
import SelectPublic from '../common/select_public';
// import Upload from '../common/upload.js';

import { runActionsMethod } from '../../tools/';
import moment from 'moment';

import { Icon, Button, Modal, Table, Pagination,Upload, InputNumber , Collapse, Form, Input, Row, Col, Select, DatePicker, message } from 'antd';
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
            selectPersonModalShow: false, //选择负责人
            servicePointsAssetType:[],//设备分类
              fileList: [],
               previewVisible: false,
            person: {  //负责人
                id: '',
                value: '',
            },
        }
       this.currentInp = '';
    }


   //选择负责人
    personInputFocus = (e) => {
        this.currentInp = e.target.getAttribute('data-name');
        this.setState({
            selectPersonModalShow: true
        })
    }

    //根据站点查询设备分类
    stChange =(e)=>{
        // console.log(actions);
           const { actions} = this.props;
            actions.getCompanyAsset({ids:e}, (json) => {
            console.log(0);
            console.log(json);
                this.setState({servicePointsAssetType:json.result})
          });
    }





                //预览图片
                  handleCancel = () => this.setState({ previewVisible: false })
                  //预览图片
                  handlePreview = (file) => {
                    this.setState({
                      previewImage: file.url || file.thumbUrl,
                      previewVisible: true,
                    });
                  }
                 // 图片上传回调
                 handleChange = ({fileList }) => {
                         console.log(fileList);

                         if(fileList.length!=0){
                            // console.log(fileList.length)

                            
                         fileList.forEach(function(value,key,arr){
                              console.log(value)    // 结果依次为1，2，3

                              if(value.response){
                                if(value.response.code==200){
                                     value.status = 'success';
                                    console.log('result');
                                    console.log(value.response.result);
                                    
                                }else{
                                     value.status = 'error';
                                     message.error(value.response.msg);
                                }
                              }
                            })
                         }

                        this.props.getTabReult(fileList);

                       this.setState({ fileList });
                      }

    render () {
        const { getFieldDecorator } = this.props.form;
        const { data , commonState , state , location,servicePoints } = this.props;
        const isAdd = location.query.add_asset;
        const servicePointsAssetType = this.state.servicePointsAssetType.map(p => <Option key={p.id}>{p.name}</Option>);
             const uploadButton = (
                            <div>
                              <Icon type="plus" />
                              <div className="ant-upload-text">Upload</div>
                            </div>
                           );


        return (
            <Form layout="vertical">
                <Row gutter={16} justify="start">
                   <Col className="gutter-row" xs={{ span: 6}}>
                        <FormItem
                            label="所属站点"
                        >
                            {
                                getFieldDecorator('mtseUnitid', {
                                   rules: [
                                  { required: true, message: '请选择站点!' },
                                 ],
                               })(
                                    <Select size="large" style={{ width: '100%' }}   onChange={(v)=>{this.stChange(v)}}   placeholder="请选择站点" >
                                       {servicePoints}
                                    </Select>
                                )
                            }
                        </FormItem>
                    </Col>
                    <Col className="gutter-row" xs={{ span: 6}}>
                        <FormItem
                            label="设备分类"
                        >
                            {
                                getFieldDecorator('assetType', {
                                  rules: [
                                  { required: true, message: '请选择站点!' },
                                 ], 
                                })(
                                    <Select size="large" style={{ width: '100%' }}  placeholder="请先选择站点再选择分类">
                                      {servicePointsAssetType}
                                    </Select>
                                )
                            }
                        </FormItem>
                    </Col>
                   
                    <Col className="gutter-row" xs={{ span: 8}}>
                        <FormItem
                            label="设备名称"
                        >
                            {
                                getFieldDecorator('tbName', {
                                 rules: [
                                  { required: true, message: '请选择站点!' },
                                 ],
                                })(
                                    <Input />
                                )
                            }
                        </FormItem>
                    </Col>
                </Row>





                <Row gutter={16} justify="start">
                    


                    <Col className="gutter-row" xs={{ span: 6}}>
                        <FormItem
                            label="设备简称"
                        >
                            {
                                getFieldDecorator('sname',{
                                  
                                })(
                                    <Input />
                                )
                            }
                        </FormItem>
                    </Col>
                    <Col className="gutter-row" xs={{ span: 6}}>
                        <FormItem
                            label="位置体系"
                        >
                            {
                                getFieldDecorator('position',{
                                   rules: [
                                  { required: true, message: '请选择站点!' },
                                 ],
                                })(
                                    <Input  />
                                )
                            }
                        </FormItem>
                    </Col>
                    <Col className="gutter-row" xs={{ span: 8}}>
                        <FormItem
                            label="描述"
                        >
                            {
                                getFieldDecorator('tbDesp', {
                                 
                                })(
                                  <Input  />
                                )
                            }
                        </FormItem>
                    </Col>
                </Row>

                   <Row gutter={16} justify="start">
                             <Col className="gutter-row" xs={{ span: 8}}>
                                <FormItem
                                    label="图片"
                                >
                                   {getFieldDecorator('upload')(
                                             <div className="clearfix">
                                        <Upload
                                          action="http://localhost:8080/upload/uploadFile"
                                          listType="picture-card"
                                          fileList={this.state.fileList}
                                          onPreview={this.handlePreview}
                                          onChange={this.handleChange}
                                          
                                        >
                                          {this.state.fileList.length >= 5 ? null : uploadButton}
                                        </Upload>
                                        <Modal visible={this.state.previewVisible} footer={null} onCancel={this.handleCancel}>
                                          <img alt="example" style={{ width: '100%' }} src={this.state.previewImage} />
                                        </Modal>
                                      </div>
                                       )}
                                </FormItem>
                            </Col>



              </Row>
            </Form>
        )
    }
}
const NewFormComponent = Form.create()(FormComponent);

class WorkOrderOneComponent extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            currentPage: 1,
            location: {},
            classification: {},
            parentAsset: {},
            servicePoints:[],
            fileList:[],
           saveLoadings:false,
        }

        this.customPanelStyle = {
            background: '#fff',
            borderRadius: 2,
            marginBottom: 24,
            border: 0,
            boxShadow: '0 1px 6px rgba(0, 0, 0, 0.2)'
        };
        // const { location } = this.props;

        // const isAdd = location.query.add_asset;
        // this.asset = localStorage.getItem('asset');
        // this.taskParam = {
        //     id: isAdd ? '' : (this.asset && JSON.parse(this.asset).id),
        //     pageNum: 1,
        //     pageSize: 10,
        // }
    }

    // 设备设施信息
    getList = () => {
         const { actions} = this.props;
            //查询公司下面所有的站点
         actions.getCompanyServicePoints('', (json) => {
                this.setState({servicePoints:json.result})
          });
    }

    getTabReult=(e) =>{
        console.log(e);
        this.setState({fileList:e});
    }  

//点击保存
    informationSave = () => {

        const  { actions, commonState ,state, location } = this.props;
        // const isAdd = location.query.add_asset;
        // const id = isAdd ? '' : (JSON.parse(localStorage.getItem('asset')).id);
        // let buyParam = {};
        // this.BuyAddForm.props.form.validateFields((err, values) => {


            // console.log(values)
            // if (err) {
            //     message.error("采购价格是数字类型");
            //     return;
            // } else {
            //     const installDate = values['installDate'] ? moment(values['installDate']).format('YYYY-MM-DD HH:mm:ss') : '';
            //     const acceptanceDate = values['acceptanceDate'] ? moment(values['acceptanceDate']).format('YYYY-MM-DD HH:mm:ss') : '';
            //     const warrantyEndDate = values['warrantyEndDate'] ? moment(values['warrantyEndDate']).format('YYYY-MM-DD HH:mm:ss') : '';
            //     buyParam = {
            //         ...values,
            //         installDate,
            //         acceptanceDate,
            //         warrantyEndDate
            //     };
            // }
        // })
        this.informationsAddForm.props.form.validateFields((err, values) => {

            if(err) {
                message.error("*是必填数据,使用年限是数字类型");
                return;
            } else {
                console.log(values)  
                     let to = this.state.fileList;
                        let logo='';
                        // if(to.length>0){
                        //     to.map(p => {
                        //     if(p.response && p.response.code==200){
                        //        logo+=p.response.result+',';
                        //     }else{
                        //       logo=''  
                        //     }
                        //     })
                        // }
                             let object =  Object.assign({},{tcLogo:logo},values);
                             console.log(object);
                               this.setState({saveLoadings:true});
                   actions.saveAsset(object, (json) => {
                      this.setState({saveLoadings:false});
                        if(json.code==200){
                            message.success(json.msg);
                           browserHistory.push(`/equipment/asset`);
                        }else{
                            message.error(json.msg);
                        }
                    });  


            }
        })
        // this.getList();
    }

    componentWillMount () {
        // const { actions, location , commonState } = this.props;
        
        // const isAdd = location.query.add_asset;

        // this.asset && this.getList();
        // if (isAdd || !this.asset) {
        //     actions.codeGetList({modelKey: 'asset', siteId : commonState.siteId});
        //     actions.informationGetList({id: ''}, () => {
        //         this.setState({
        //             informationsLoading: false,
        //         })
        //     });
        // }
       this.getList();
    }
    

    render () {
        const { state, commonState , location ,commonActions ,actions} = this.props;
         const servicePoints = this.state.servicePoints.map(p => <Option key={p.tspId}>{p.tspName}</Option>);
        

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
                                <Button size="large" type="primary" loading={this.state.saveLoadings} onClick={ this.informationSave }>保存</Button>
                            </div>
                            <NewFormComponent
                                data={list}
                                servicePoints={servicePoints}
                                location={location}
                                actions={actions}
                                commonState={commonState}
                                state={state}
                                getTabReult={this.getTabReult}
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
                       
                    </Collapse>
                </div>
            </div>
        )
    }
}


function mapStateToProps (state) {
    return {
        state: state.equipment,
        // commonState: state.common
    }
}

function buildActionDispatcher(dispatch) {
    return {
        actions: bindActionCreators(actions, dispatch),
        // commonActions: bindActionCreators(commonActions, dispatch),
    }
}

export default connect(mapStateToProps, buildActionDispatcher)(WorkOrderOneComponent);
