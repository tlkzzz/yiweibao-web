/** 
 * 变更状态表单
 * @props     statusData [array] 状态数据  
 */

import React from 'react';
import { Form, Input, Select } from 'antd';

const FormItem = Form.Item;
const Option = Select.Option;

class FormComponent extends React.Component {
    constructor (props) {
        super(props);
    }
    render () {

        const { form, statusData } = this.props;
        const { getFieldDecorator } = form;
        return (
            <div>
                <Form layout="vertical">
         
                    <FormItem
                        label="新状态"
                    >
                        {
                            getFieldDecorator('status', {
                                initialValue: statusData && statusData[0].value
                            })(
                                <Select size="large" style={{ width: '100%' }}>
                                    {
                                        statusData.map((item, i) => <Option key={i} value={item.value}>{item.description}</Option>)
                                    }
                                </Select>
                            )
                        }
                    </FormItem>
          
                    <FormItem
                        label="变更说明"
                    >
                        {
                            getFieldDecorator('description', {
                                // initialValue: 'a'
                            })(
                                <Input type="textarea" className="eam-textarea" />
                            )
                        }
                    </FormItem>
                  
                </Form>
            </div>
        )
    }
}

export default Form.create()(FormComponent);

