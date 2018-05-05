/** 
 * 批量表单 
 */

import React from 'react';
import { Form, Input, DatePicker, Icon } from 'antd';

import SelectPerson from '../../../components/common/select_person.js';
import { filterArrByAttr } from '../../../tools/';

const { RangePicker } = DatePicker;

const FormItem = Form.Item;

class FormComponent extends React.Component {
    constructor (props) {
        super(props);
        this.state = {
            selectPersonModalShow: false,
            setSelected: [],
        }
    }
    modalShow = () => {
        this.setState({ selectPersonModalShow: true })
    }
    render () {

        const { form, statusData } = this.props;
        const { getFieldDecorator } = form;
        return (
            <div>
                <Form layout="vertical">
         
                    <FormItem
                        label="执行人"
                    >
                        {
                            getFieldDecorator('executorPerson', {
                                rules: [{
                                    required: true,
                                    message: '请选择执行人！'
                                }]
                            })(
                                <Input
                                    suffix={<Icon style={{cursor: 'pointer'}} type="plus" onClick={this.modalShow} />}
                                    onClick={this.modalShow}
                                    readOnly
                                />
                            )
                        }
                    </FormItem>
                    <FormItem
                        label="执行人id"
                        style={{display: 'none'}}
                    >
                        {
                            getFieldDecorator('executorPersonId', {
                                
                            })(
                                <Input />
                            )
                        }
                    </FormItem>
          
                    <FormItem
                        label="任务时间"
                    >
                        {
                            getFieldDecorator('date', {
                                rules: [{
                                    required: true,
                                    message: '请选择任务时间！'
                                }]
                            })(
                                <RangePicker
                                    showTime
                                    format="YYYY-MM-DD HH:mm"
                                    onChange={a => {}}
                                />
                            )
                        }
                    </FormItem>

                    <FormItem
                        label="流程说明"
                    >
                        {
                            getFieldDecorator('description', {
                                
                            })(
                                <Input type="textarea" className="eam-textarea" />
                            )
                        }
                    </FormItem>
                  
                </Form>
                <SelectPerson
                    multiple
                    visible={this.state.selectPersonModalShow}
                    selectPersonModalHide={() => { this.setState({selectPersonModalShow: false}) }}
                    setSelected={() => this.state.setSelected}
                    onOk={(selected) => {
                        const id = filterArrByAttr(selected, 'personId').join(',');
                        const name = filterArrByAttr(selected, 'name').join(', ');

                        this.setState({ setSelected: selected })

                        form.setFieldsValue({
                            executorPerson: name,
                            executorPersonId: id
                        });
                    }}
                />
            </div>
        )
    }
}

export default Form.create()(FormComponent);

