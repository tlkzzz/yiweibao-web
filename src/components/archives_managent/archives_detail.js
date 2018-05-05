/** 
 * @Description  档案管理---详情页
 */
import React from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import actions from '../../actions/archives_managent.js';
import commonActions from '../../actions/common.js';

import SelectAsset from '../common/select_asset';

import Dropdown from '../common/dropdown.js';
import BackList from '../common/back_list';
import moment from 'moment';
import { randomString, getSuffix } from '../../tools/index.js';

import { Icon, Button, Upload, Modal, Table, Pagination, Collapse, Form, Input, Row, Col, Select, DatePicker, Checkbox, Menu, Timeline, Message} from 'antd';
const Panel = Collapse.Panel;
const FormItem = Form.Item;
const Option = Select.Option;


class FormComponent extends React.Component {
  constructor(props) {
      super(props);

      this.state = {
        currentPage: 1,
        selectAssetModalShow: false,
          confirmDirty: false,
          uploadAction: '',
          ossParam: {
              'key' : '',
              'policy': '',
              'OSSAccessKeyId': '',
              'success_action_status' : '',
              'callback' : '',
              'signature': '',
          },
          uploadLoading: false,
      }
  }
    componentDidUpdate() {
        const {state, actions, form} = this.props;
        if (!state.getFormValues) {
            actions.getFormValues(form.getFieldsValue());
        }
    }
  taskStepsAdd = () => {
    this.setState({ selectAssetModalShow: true });
  }

    render () {
        const { getFieldDecorator } = this.props.form;
        //const { data } = this.props;
        const {entity, state, code} = this.props;  
        //const list = data.list;
        return (
            <Form layout="vertical">
                <Row gutter={16} justify="start">
                    <Col className="gutter-row" xs={{span: 0}}>
                        <FormItem
                            >
                            {
                                getFieldDecorator('id', {
                                initialValue: entity ? entity.id : ''
                            })(
                            <Input type="hidden" disabled/>
                            )
                            }
                        
                        </FormItem>
                </Col>
                    <Col className="gutter-row" xs={{ span: 4}}>
                        <FormItem
                            label="*资料编号"
                        >
                            {
                              getFieldDecorator('materialNum',{
                                  initialValue: entity ? entity.materialNum : code
                                })(
                                    <Input />
                                )
                            }
                        </FormItem>
                    </Col>
                    <Col className="gutter-row" xs={{ span: 6}}>
                        <FormItem
                            label="档案编码"
                        >
                            {
                              getFieldDecorator('archivesNum',{
                                  initialValue: entity ? entity.archivesNum : ''
                                })(
                                    <Input />
                                )
                            }
                        </FormItem>
                    </Col> 
                    <Col className="gutter-row" xs={{ span: 6}}>
                        <FormItem
                            label="档案名称"
                                >
                                {
                                    getFieldDecorator('materialName',{
                                    initialValue: entity ? entity.materialName : ''
                                    })(
                                    <Input />
                                )
                            }
                        </FormItem>
                    </Col>
                    <Col className="gutter-row" xs={{ span: 6}}>
                        <FormItem
                            label="状态"
                                >
                                {
                                    getFieldDecorator('status',{
                                initialValue: entity ? entity.status : ''
                            })(
                            <Select size="large" style={{ width: '100%' }}>
                            <Option value="活动">活动</Option>
                                    <Option value="不活动">不活动</Option>
                                    </Select>
                            )
                        }
                        </FormItem>
                    </Col>
                </Row>
                <Row gutter={16} justify="start">
                    <Col className="gutter-row" xs={{ span: 4}}>
                        <FormItem
                            label="*分类编码"
                        >
                            {
                                getFieldDecorator('typeName',{
                                    initialValue: entity ? entity.typeName : ''
                                })
                                (
                                    <Input  suffix={<Icon type="plus"  onClick={ this.taskStepsAdd } /> } />
                                )
                            }
                            <SelectAsset
                                selectAssetModalHide={() => { this.setState({ selectAssetModalShow: false }) }}
                                visible={this.state.selectAssetModalShow}
                            />
                        </FormItem>
                    </Col>
                    <Col className="gutter-row" xs={{ span: 6}}>
                        <FormItem
                            label="资料版本"
                        >
                            {
                                getFieldDecorator('materialVersion',{
                                    initialValue: entity ? entity.materialVersion : ''
                                })
                                (
                                    <Input />
                                )
                            }
                        </FormItem>
                    </Col>
                    <Col className="gutter-row" xs={{ span: 6}}>
                        <FormItem
                            label="核发日期"
                                >
                                {
                                    getFieldDecorator('createDate', {
                                    initialValue: entity ?   moment( entity.createDate ?  entity.createDate: new Date(), 'YYYY-MM-DD HH:mm:ss') :  moment(new Date(), 'YYYY-MM-DD HH:mm:ss')
                                    })
                                    (
                                        <DatePicker 
                                        showTime
                                        format="YYYY-MM-DD HH:mm:ss"
                                        placeholder="Select Time"
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
                <Row gutter={16} justify="start">
                    <Col className="gutter-row" xs={{ span: 4}}>
                        <FormItem
                            label="*位置编码"
                        >
                            {
                                getFieldDecorator('position',{
                                    initialValue: entity ? entity.position : ''
                                })
                                (
                                    <Input  suffix={<Icon type="plus"  onClick={ this.taskStepsAdd } /> } />
                                )
                            }
                            <SelectAsset
                                selectAssetModalHide={() => { this.setState({ selectAssetModalShow: false }) }}
                                visible={this.state.selectAssetModalShow}
                            />
                        </FormItem>
                    </Col>
                    
                    <Col className="gutter-row" xs={{ span: 6}}>
                        <FormItem
                            label="创建人"
                        >
                            {
                                getFieldDecorator('creator',{
                                    initialValue: entity ? entity.creator : ''
                                })
                                (
                                    <Input />
                                )
                            }
                        </FormItem>
                    </Col>
                    <Col className="gutter-row" xs={{ span: 4}}>
                        <FormItem
                            label="发证部门"
                                >
                                {
                                    getFieldDecorator('department',{
                                initialValue: entity ? entity.department : ''
                            })
                            (
                            <Select size="large" style={{ width: '100%' }}>
                        <Option value="供电局">供电局</Option>
                                <Option value="劳动局">劳动局</Option>
                                <Option value="卫生局">卫生局</Option>
                                <Option value="消防局">消防局</Option>
                                <Option value="环保局">环保局</Option>
                                </Select>
                        )
                        }
                        </FormItem>
                    </Col>
                </Row>
                <Row gutter={16} justify="start">
                    <Col className="gutter-row" xs={{span: 6}}>
                        <FormItem
                            label="有效开始时间"
                                >
                                {
                                    getFieldDecorator('validStartTime', {
                                    initialValue: entity ?   moment( entity.validStartTime ?  entity.validStartTime: new Date(), 'YYYY-MM-DD HH:mm:ss') :  moment(new Date(), 'YYYY-MM-DD HH:mm:ss')
                                })
                                (
                                    <DatePicker 
                                    showTime
                                    format="YYYY-MM-DD HH:mm:ss"
                                    placeholder="Select Time"
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
                            label="有效结束时间"
                                >
                                {
                                    getFieldDecorator('validEndTime', {
                                initialValue: entity ?   moment( entity.validEndTime ?  entity.validEndTime: new Date(), 'YYYY-MM-DD HH:mm:ss') :  moment(new Date(), 'YYYY-MM-DD HH:mm:ss')
                            })
                                (
                                <DatePicker
                                showTime
                                    format="YYYY-MM-DD HH:mm:ss"
                                    placeholder="Select Time"
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
const NewFormComponent = Form.create()(FormComponent);
//上传图片
class PicturesWall extends React.Component {
    constructor(props) {
      super(props);
    this.state = {
        previewVisible: false,
        previewImage: '',
        fileList: [{
            uid: -1,
            entityId:'',
            name: 'xxx.png',
            status: 'done',
            url: 'https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png',
        }],
    };
}

    handleCancel = () => this.setState({ previewVisible: false });

    handlePreview = (file) => {
        this.setState({
            previewImage: file.url || file.thumbUrl,
            previewVisible: true,
        });
    };
handleChange = ({ fileList }) => this.setState({ fileList });
 componentDidMount() {
    const {actions ,state,entity } = this.props ;  
   let  quoteParam ={
    "quoteId":entity.id,
    "quoteType" : "workOrderImg",
   };
     actions.showAvatar(quoteParam,(data) => {
                const {fileList} = this.state ; 
                for (var i = 0 ; i  < data.images.length ;i++) {
                    
                    let filePath = {
                        uid :i  ,
                        entityId :data.images[i].id,
                        status:'done',
                        url:data.httpPath+data.images[i].path, 
                    } ;
                    fileList.push(filePath) ; 
                } ;
                actions.setImgPathList(fileList) ; 
            });
   } ;
render() {
    const { previewVisible,previewImage,fileList } = this.state;
   
    const  imgPathList  =  this.props.state.imgPathList;
    const uploadButton = (
        <div>
        <Icon type="plus" />
        <div className="ant-upload-text">上传文件</div>
        </div>
);
   
    
    return (
        <div className="clearfix">
        <Upload
    action={this.state.uploadAction}
    listType="picture-card"
    fileList={fileList}
    onPreview={this.handlePreview}
    beforeUpload={this.beforeUpload}
     data={this.state.ossParam}
    onChange={this.uploadChange}
    onRemove={this.uploadRemove} 
>
    {fileList.length >= 15 ? null : uploadButton}
    
</Upload>
    <Modal visible={previewVisible} footer={null} onCancel={this.handleCancel}>
<img alt="example" style={{ width: '100%' }} src={previewImage} />
            
        </Modal>
        </div>
);
}
// 上传头像
beforeUpload = (file) => {

    let { actions } = this.props;
    this.setState({
        uploadLoading: true
    });
    return new Promise((resolve, reject) => {
            actions.getOssType((json) => {
            if (json.type === "oss") {
        actions.getOssInfo((json) => {
            if (!json.error) {
            resolve(json);

            this.avatarDir = json.dir;
            this.randomName = randomString(10);
            this.suffix = getSuffix(file.name);
            this.setState({
                uploadAction: json.host,
                ossParam: {
                    'key' : this.avatarDir + this.randomName + this.suffix,
                    'policy': json.policy,
                    'OSSAccessKeyId': json.accessid,
                    'success_action_status' : '200',
                    'callback' : json.callback,
                    'signature': json.signature,
                }
            })
        } else {
            reject(json);
            Message.error('上传失败');
        }

    })
    }
else if(json.error) {
        Message.error('上传失败');
    }
});
})
}
uploadChange = (json) => {

    let file = json.file;
    
     //if (json.Status === 'OK') { //上传成功 
    
        let { commonState, actions,state,entity,avatarParam } = this.props;
        // let ids = layoutState.ids;
    
        let param = [{
            ...avatarParam,
            fileName: file.name,
            fileDescription: 'Avatar',
            fileSize: file.size,
            path: this.avatarDir + this.randomName + this.suffix,
            orgId: commonState.orgId,
            siteId: commonState.siteId,
            quoteType:"workOrderImg",
            quoteId:entity.id
        }];
    
        actions.saveAvatar(param, (json) => {
             //if (json.success) {
            const quoteParam = {quoteType:"workOrderImg",
            quoteId:entity.id}
            Message.success(json.msg);
            actions.showAvatar(quoteParam,(json) => {
              console.log(json);
            })
            this.setState({
                uploadLoading: false
            });
         //} else {
         //    Message.error(json.msg);
         //}
        });
    //}
}
    uploadRemove = (json) =>{
        const param = {ids:json.entityId};
        if (json.status == 'removed') {    //删除的方法
            actions.delAvatar(param,(json) => {
            if (json.success) {
                location=location;
            } else {
                message.error(json.msg);
            }
            })
        }
    }
}
class ArchivesDetailComponent extends React.Component {
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
      

        let defaultRender = (text, record, key) => {
            return (
                <p>{text ? text : '-'}</p>
            )
        };

        // 表格字段
        this.taskStepsColumns = [
            {
                title: '执行日期',
                dataIndex: 'createDate',
                key: 'createDate',
                render: defaultRender
            },
            {
                title: '任务描述',
                dataIndex: 'description',
                key: 'description',
                render: defaultRender
            },
            {
                title: '负责人',
                dataIndex: 'principal',
                key: 'principal',
                render: defaultRender
            },
        ];
    }

//日志记录自己测试
    taskGetList = () => {
    let id = this.props.location.query.id;
        const { actions } = this.props;
        this.setState({
            taskstepsLoading: true,
        });
    if (id == undefined) {
        id = "";
    }
    let taskParam = {
        archivesId:id,
        pageNum: 0,
        pageSize: 10,
    };
        actions.archivesLogList(taskParam, () => {
            this.setState({
                taskstepsLoading: false,
            });
        });
    }
    componentWillMount () {
        this.taskGetList();
        this.getArchivesEntity();
    }
    getArchivesEntity = () => {
        let id = this.props.location.query.id;
        this.param = {id: id};
        const {actions, commonActions,commonState} = this.props;
    
        if (id == '' || id == undefined) {
            actions.findArchivesDetail(this.param, () => {
                this.setState({tableLoading: false});
        });
            this.param = {modelKey: "archives",siteId:commonState.siteId}
            commonActions.codeGenerator(this.param, () => {
                this.setState({tableLoading: false});
        });
    
        } else {
            actions.findArchivesDetail(this.param, () => {
                this.setState({tableLoading: false});
        });
        }
    }

    render () {
        const { state,commonState,actions,commonActions } = this.props;
        const list = [{"name":'哈哈哈'} , {"name":'哈哈哈'} ,{"name":'哈哈哈'} , {"name":'哈哈哈'}];
        const archivesLogList = state.archivesLogList;
        const archives = state.findArchivesDetail;
        // 执行记录数据
        const recordList = archivesLogList.list || [];
        const code = commonState.codeEntity;
        const relaseDetaildata = state.releasedetailListData;
        // 执行记录日期
        //const recordDateArr = workOrderCommitData.dateArr;

        return (
            <div className="eam-tab-page">
                <div className="eam-content">
                    <Collapse bordered={false} defaultActiveKey={['1', '2','3']}>
                        <Panel header={<span className="label">基本信息 <Icon type="caret-down" /></span>} key="1" style={this.customPanelStyle}>
                            <NewFormComponent  
                            commonActions={commonActions}
                            commonState={commonState} entity={archives}
                            state={state} actions={actions} code={code}/>
                        </Panel>
                        <Panel header={<span className="label">文件 <Icon type="caret-down" /></span>} key="2" style={this.customPanelStyle}>
                            <div className="panel-tools-right">
                                <p className="eam-upload">只允许上传pdf、jpg、png</p>
                            </div>
                            <PicturesWall actions={actions} commonState={commonState} state={state} entity={archives}/>
                        </Panel>
                   
                            <Panel header={<span className="label">日志<Icon type="caret-down"/></span>} key="3"
                            style={this.customPanelStyle}>
                                    <Table
                                    rowKey="id"
                                    loading={this.state.taskstepsLoading}
                                    pagination={{
                                        showTotal: (total, range) => `当前第${range[0]}-${range[1]}条 / 共${total}条`,
                                            defaultPageSize: 5,
                                    }}
                                    dataSource={recordList}
                                    columns={this.taskStepsColumns}
                                    //rowSelection={this.rowSelection}
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
        state: state.archives_managent,
        commonState: state.common,
    }
}

function buildActionDispatcher(dispatch) {
    return {
        actions: bindActionCreators(actions, dispatch),
        commonActions: bindActionCreators(commonActions, dispatch),
    }
}

export default connect(mapStateToProps, buildActionDispatcher)(ArchivesDetailComponent);
