/** 
 * 封装上传组件 
 *
 *
 *

    实例：

    <Upload
        beforeUpload={() => {                              // 上传之前触发的方法 返回 Promise对象 用于上传之前的其他请求
            return new Promise((resolve, reject) => {
                actions.getData(param, (json) => {
                    resolve(json)
                })
            })
        }}
        quoteId={this.localWorkOrder.id} 
        quoteType="assetImg"
        commonActions={commonActions}
        commonState={commonState}
    />
 */
import React from 'react';
import { Upload, Icon, Modal, notification, Button } from 'antd';
import { randomString, getSuffix, runActionsMethod } from '../../tools/index.js';

class UploadComponent extends React.Component {
    
    constructor(props) {
        super(props);

        this.state = {
            previewVisible: false, // 查看大图躺床显示隐藏状态
            previewImage: '',
            fileList: [],
            uploadAction: '', //getOssInfo方法返回的接口地址
            uploadParam: {},
        };

        this.filePathList = [];
        this.isRemove = false;
    }

    handleCancel = () => this.setState({ previewVisible: false })

    handlePreview = (file) => {
        this.setState({
            previewImage: file.url || file.thumbUrl,
            previewVisible: true,
        });
    }

    uploadChange = (json) => {
        let { fileList } = json;
        this.setState({ fileList });

        let temp = false;

        const status = fileList.map(item => item.status).join(',');

        if ( // 除done之外的三个状态
            status.indexOf('uploading') !== -1 ||
            status.indexOf('error') !== -1 || 
            status.indexOf('removed') !== -1 
        ) {
            temp = false;
        } else {
            temp = true;
        }

        if (temp && !this.isRemove) {
            this.saveFiles(fileList)
        }
        
    }
    // 字节转兆
    byteToMb = (byte) => {
        let isMac = (navigator.platform == 'Mac68K') || (navigator.platform == 'MacPPC') || (navigator.platform == 'Macintosh') || (navigator.platform == 'MacIntel');
        const MB = isMac ? 1000 : 1024;
        return (Math.round(byte * 100 / (MB * MB)) / 100).toString();
    }
    // 上传之前
    beforeUpload = (file) => {
        let { commonActions, commonState, fileType, beforeUpload } = this.props;
        this.isRemove = false;

        if (!fileType) fileType = 'Images';
        fileType = fileType.toLowerCase();

        let fileTypeIsRight = true;

        const fileSize = this.byteToMb(file.size);
        const maxSize = 10;

        if (fileSize > maxSize) {
            notification.warning({
                message: '提示',
                description: `文件大小不能超过${maxSize}MB！`
            });
            return false;
        }

        switch (fileType) {
            case 'pdf':
                if (file.type !== 'application/pdf') {
                    notification.warning({
                        message: '提示',
                        description: '请上传PDF格式文件！'
                    });
                    fileTypeIsRight = false;
                }
                break;
            default: // image
                if (file.name.search(/\.(jpeg|png|jpg|gif)$/) === -1) {
                    notification.warning({
                        message: '提示',
                        description: '请上传JPG、PNG、GIF格式文件！'
                    });
                    fileTypeIsRight = false;
                }
        }

        if (!fileTypeIsRight) return false;

        const getInfo = new Promise((resolve, reject) => {
            commonActions.getOssInfo({productId: Date.now()}, (json) => {
                resolve(json);
                const avatarDir = json.dir;
                const randomName = randomString(10);
                const suffix = getSuffix(file.name);
                const filePath = avatarDir + randomName + suffix;

                this.setState({
                    uploadAction: json.host,
                    uploadParam: {
                        'key' : filePath,
                        'policy': json.policy,
                        'OSSAccessKeyId': json.accessid,
                        'success_action_status' : '200',
                        'callback' : json.callback,
                        'signature': json.signature,
                    }
                })

                this.filePathList.push(filePath);
            })
        });

        return typeof beforeUpload === 'function' ? Promise.all([beforeUpload(), getInfo]) : getInfo
    }
    removeFile = (file) => {
        const { commonActions } = this.props;
        const param = {
            ids: [file.id]
        }

        return new Promise((resolve, reject) => {
            runActionsMethod(commonActions, 'delFile', param, json => {
                if (json.success) {
                    resolve(json);
                    this.isRemove = true;
                    this.newFileList = this.newFileList ? this.newFileList.filter(item => item.uid !== file.uid) : [];
                    this.filePathList = this.newFileList.map(item => item.path);
                } else {
                    reject(json);
                }
            });

        });
    }
    saveFiles = (fileList) => {
        const { commonActions, commonState, quoteId, quoteType } = this.props;

        this.newFileList = [...fileList];


        this.newFileList = this.newFileList.filter(item => typeof item.type !== 'undefined');

        let param = [];

        this.newFileList.forEach((item, i) => {
            param.push({
                fileName: item.name,
                fileDescription: 'defaultDesc',
                fileSize: item.size,
                path: this.filePathList[i],
                orgId: commonState.orgId,
                siteId: commonState.siteId,
                quoteType,
                quoteId,
            })
            item.path = this.filePathList[i];
        })

        /*console.log('==========================')
        console.log('save-> ', this.filePathList)
        console.log(param)*/

        commonActions.saveFiles(param)
    }
    componentWillMount () {
        const { commonActions, quoteId, quoteType } = this.props;
        const param = {
            quoteId,
            quoteType,
        };
        commonActions.getFilesList(param, json => {
            const images = json.data.images,
                  httpPath = json.data.httpPath;

            images.forEach((item, i) => {
                item.uid = i * -1;
                item.url = httpPath + item.path;
                item.name = item.fileName;
            })

            this.setState({
                fileList: images
            })
        });
    }
    render() {
        const { previewVisible, previewImage, fileList, uploadAction, uploadParam } = this.state;

        let { fileType, hideButton } = this.props;
        if (!fileType) fileType = 'Images';
        fileType = fileType.toLowerCase();

        return (
            <div className="clearfix">
                <Upload
                    action={this.state.uploadAction}
                    data={this.state.uploadParam}
                    listType={fileType === 'pdf' ? 'text' : 'picture-card'}
                    fileList={fileList}
                    multiple={this.props.multiple === false ? false : true}
                    beforeUpload={this.beforeUpload}
                    onPreview={fileType === 'pdf' ? null : this.handlePreview}
                    onChange={this.uploadChange}
                    onRemove={this.removeFile}
                >
                    {
                        hideButton ?
                        null :
                        (
                            fileType === 'pdf' ?
                            <Button>
                                <Icon type="upload" /> 点击上传
                            </Button> :
                            <div>
                                <Icon type="plus" />
                                <div className="ant-upload-text">点击上传</div>
                            </div>
                        )
                        
                    }
                    
                </Upload>
                {
                    fileType === 'pdf' ?
                    null :
                    <Modal visible={previewVisible} footer={null} onCancel={this.handleCancel}>
                        <img alt="example" style={{ width: '100%' }} src={previewImage} />
                    </Modal>
                }
                
          </div>
        );
    }
}

export default UploadComponent;