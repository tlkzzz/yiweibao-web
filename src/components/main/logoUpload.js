import React from 'react';
import { Upload, Button, Icon ,Modal } from 'antd';

class LogoUpload extends React.Component {



 state = {
    previewVisible: false,
    previewImage: '',
    fileList: [{
      uid: -1,
      name: 'xxx.png',
      status: 'success',
      url: this.props.strUrl,
    }],
  };



  handleCancel = () => this.setState({ previewVisible: false })

  handlePreview = (file) => {
    this.setState({
      previewImage: file.url || file.thumbUrl,
      previewVisible: true,
    });
  }

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



	this.props.ImgUploadBack(fileList);

   this.setState({ fileList });
  }

  render() {
    const { previewVisible, previewImage, fileList } = this.state;
    const {strUrl}=this.props;
     console.log('strUrl');
    console.log(strUrl);
    const uploadButton = (
      <div>
        <Icon type="plus" />
        <div className="ant-upload-text">Upload</div>
      </div>
    );
    return (
      <div className="clearfix">
        <Upload
          action="http://localhost:8080/upload/uploadFile"
          listType="picture-card"
          fileList={fileList}
          onPreview={this.handlePreview}
          onChange={this.handleChange}
          
        >
          {fileList.length >= 1 ? null : uploadButton}
        </Upload>
        <Modal visible={previewVisible} footer={null} onCancel={this.handleCancel}>
          <img alt="example" style={{ width: '100%' }} src={previewImage} />
        </Modal>
      </div>
    );
  }


}

export default LogoUpload;