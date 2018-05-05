/** 
 * @Description  二维码主界面
 */
import React from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { Link , browserHistory } from 'react-router';
import actions from '../../actions/main.js';
import LogoUpload from './logoUpload';

import { Form, Input, Tooltip, Icon,Upload, Cascader, Select, Row, Col, Checkbox, Button, AutoComplete,InputNumber,message } from 'antd';
const FormItem = Form.Item;
const Option = Select.Option;
const AutoCompleteOption = AutoComplete.Option;




class FormComponent extends React.Component {
	constructor(props) {
        super(props);

        this.state = {
            company :{},
             loading:false,
              defaultFileList : [],
              butUpload:false,
              upload_url:'',
        }
}
 

 handleSubmit = (e) => {
    e.preventDefault();
    this.props.form.validateFields((err, values) => {
      if (!err) {
       // console.log('Received values of form: ', values);
        this.setState({loading:true});
             let object = {};
              let company =this.state.company;
              //获取图片地址
              company.tcLogo=this.state.upload_url;

              Object.assign(object,company,values);
              console.log(object);
              // tcLogo:this.state.upload_url
            let { actions } = this.props;
          // actions.editCompany(object, (data) => {
          //     this.setState({loading:false});
          //       if(data.code==200){
          //            message.success('修改成功');
          //           // location.href = '/main/settings/company';
          //       }else {
          //             message.error(data.msg);
          //       }
          //   }); 
      }
    });
  }

 

     

    componentWillMount () {
         let { actions } = this.props;
          actions.getCompany('', (data) => {




            this.setState({company:data.result});
            if(data.result.tcLogo){
              this.setState({upload_url:data.result.tcLogo});
            }
            }); 

    }
    //上传
 //   handleChange = (info) => {
 //     console.log('info')
 //    console.log(info)
 //    let fileList = info.fileList;
 //    //当附件为0时设置可以编辑上传按钮
 //    if(fileList.length===0){
 //        this.setState({butUpload:false,upload_url:''});
 //    }

 //    // 1. Limit the number of uploaded files
 //    //    Only to show two recent uploaded files, and old ones will be replaced by the new
 //    // fileList = fileList.slice(-2);

 //    // 2. read from response and show file link
 //    fileList = fileList.map((file) => {
 //      if (file.response) {
 //        // Component will show file.url as link
 //        file.url = file.response.result;
 //      }
 //      return file;
 //    });

 //    // 3. filter successfully uploaded files according to response from server
 //    fileList = fileList.filter((file) => {
 //      console.log('files')
 //      console.log(file);
   
 // if (file.response) {
 //      if(file.response.code==200){
 //        console.log(200)
 //        file.status = 'success';
 //        //上传成功后设置按钮不可再继续上传必须先删除附件
 //          this.setState({butUpload:true,upload_url:file.url});
 //        return true;
 //      }else{
 //         console.log(100)
 //        // file.error=file.response.msg;
 //        file.status = 'error';
 //         message.error(file.response.msg);
 //        return false;
 //      }
 //      }

 //    });

 //   this.setState({ fileList });
 //  }
  //删除
  onRemoves=(str)=>{
    console.log(str);
    var url = str.tcLogo;
        var arr=[];
    if(url){

   var obj={
          uid: -1,
          name: url,
          status: 'done',
          url: url,
        };
        console.log(obj);
       arr.push(obj);
       console.log(arr);
       console.log('----------------')
    return arr;
    }else {
      console.log(arr);
      return arr;
    }

     
   
  }


// "error" done
    //新增ok弹出层回调
       ImgUploadBack = (e) => {
        console.log('addOKModelBack');
          console.log(e); 
          if(e.length>0){
               for(var i=0;i<e.length;i++){
                    if(e[i].response){//成功返回
                 if(e[i].response.code==200){//成功返回数据
                  console.log(e[i].response.result);
                  this.setState({upload_url:e[i].response.result});
                 } 
                }else{
                  this.setState({upload_url:e[i].url});
                } 
               }



          }else{
            this.setState({upload_url:''})
          }



        }

    render () {
    const { getFieldDecorator } = this.props.form;
    const {company} =this.state;

    const formItemLayout = {
      labelCol: {
        xs: { span: 24 },
        sm: { span: 4 },
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 10 },
      },
    };
    const tailFormItemLayout = {
      wrapperCol: {
        xs: {
          span: 24,
          offset: 0,
        },
        sm: {
          span: 8,
          offset: 4,
        },
      },
    };



   // const props = {
    //   action: 'http://localhost:8080/upload/uploadFile',
    //    // action: '//jsonplaceholder.typicode.com/posts/',
    //   listType: 'picture',
    //   // defaultFileList:  this.onRemoves(company),
    //   onChange: this.handleChange,
    //   name:'file',
  
  
    // };
        return (
                <div>
                	<div className="main-nav clearfix">
	                 
	                    <Link to="/main/settings/company" activeClassName="active">公司信息</Link>
                        <Link to="/main/settings/employee" >员工管理</Link>
                           <Link to="/main/settings/customer" >客户管理</Link>
                      
                        <Link to="/main/settings/servicePoints" >项目管理</Link>
                        <Link to="/main/settings/code" >二维码管理</Link>
                          <Link to="/main/settings/product" >商品管理</Link>
                         <Link to="/main/settings/item" >故障类型</Link>
                          <Link to="/main/settings/brand" >品牌管理</Link>
                           <Link to="/main/settings/serviceFees" >售后套餐</Link>
	                </div>
	                <div className="main-content clear ">
		              <div className="top-bar clearfix  eam-card ip-main-commonMargin">
                        <Form onSubmit={this.handleSubmit}>
        <FormItem
          {...formItemLayout}
          label="单位名称"
        >
          {getFieldDecorator('tcName', {
              initialValue: company.tcName,
              rules: [{
                          required: true, message: '单位名称',
                        }],
          })(
            <Input />
          )}
        </FormItem>
         <FormItem
          {...formItemLayout}
          label="地址"
        >
          {getFieldDecorator('tcAddress', {
             initialValue: company.tcAddress,
            rules: [],
          })(
            <Input />
          )}
        </FormItem>
         <FormItem
          {...formItemLayout}
          label="联系人"
        >
          {getFieldDecorator('tcContactName', {
             initialValue: company.tcContactName,
            rules: [],
          })(
            <Input />
          )}
        </FormItem>
         <FormItem
          {...formItemLayout}
          label="联系电话"
        >
          {getFieldDecorator('tcContactPhone', {
             initialValue: company.tcContactPhone,
            rules: [],
          })(
             <InputNumber   />
          )}

        </FormItem>
          <FormItem
          {...formItemLayout}
          label="LOGO"
        >
         <div>
     
        <LogoUpload
         ImgUploadBack={this.ImgUploadBack}
         strUrl="http://static.yiweibao.cn/image/20180503093946_1.png"
         ></LogoUpload>

        <br />
        <br />
      
      </div> 

        </FormItem>
        <FormItem {...tailFormItemLayout}>
          <Button loading={this.state.loading} type="primary" htmlType="submit">保存</Button>
        </FormItem>
      </Form>

                      </div>
                    </div>


                </div>
            )
      }
}

const CompanyComponent = Form.create()(FormComponent);

function mapStateToProps (state) {
    return {
        state: state.main,
       
    }
}

function buildActionDispatcher(dispatch) {
    return {
        actions: bindActionCreators(actions, dispatch),
      
    }
}

export default connect(mapStateToProps,buildActionDispatcher)(CompanyComponent);
