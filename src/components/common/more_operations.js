import React from 'react';
import Dropdown from './dropdown.js';
import { Icon, Menu, Button } from 'antd';
const ButtonGroup = Button.Group;
/** 
 * MoreOperations
 * 更多操作
 * 
 * @style
 * props    menuData 菜单显示的图标和文字
 * props    onChange 用于隐藏或显示复选框 参数: (key, showCheckbox：是否显示复选框)
 * props    onOk     某菜单的确认方法  参数: (key, hideCheckBox: 隐藏复选框方法) 根据key 判断执行某个方法

   调用：
            <MoreOperations
                style={{float: 'left'}}
                menuData={[
                    {
                        icon: 'edit',
                        text: '变更状态'
                    },
                    {
                        divider: 'divider' // 分隔线
                    },
                    {
                        icon: 'delete',
                        text: '批量删除'
                    }
                ]}
                onChange={(key, showCheckbox) => {
                    console.log(showCheckbox ? '显示多选框' : '隐藏多选框');
                }}
                onOk={(key, hideCheckBox) => {
                    console.log(key, '执行确认方法');

                    setTimeout(() => {
                        console.log('其他方法执行的隐藏按钮(复选框) 比如回调函数内执行的')
                        hideCheckBox && hideCheckBox();
                    }, 3000);
                }}
            />

 */

class MoreOperations extends React.Component {
    constructor (props) {
        super(props);
        this.state = {
            btnShow: false,
            btnText: '',
        }
        this.key = '';
    }
    btnShow = (e) => {
        this.key = e.key;

        const { onChange } = this.props;

        this.setState({ 
            btnShow: true,
            btnText: e.item.props.confirmText,
        }, () => {
            onChange && onChange(this.key, this.state.btnShow);
        });
    }
    btnHide = () => {
        const { onChange } = this.props;
        this.setState({ 
            btnShow: false,
            btnText: '',
        }, () => {
            onChange && onChange(this.key, this.state.btnShow);
        });
    }
    confirm = () => {
        const { onOk } = this.props;
        onOk && onOk(this.key, () => {
            this.btnHide();
        })
    }
    cancel = () => {
        this.btnHide();
    }
    render() {

        const { menuData, style } = this.props;

        return (
            <div style={style}>
                {
                    this.state.btnShow ?
                    <ButtonGroup>
                        <Button onClick={this.confirm} type="primary" size="large">{this.state.btnText}</Button>
                        <Button onClick={this.cancel} size="large">取消</Button>
                    </ButtonGroup> :
                    <Dropdown
                        overlay={(
                            <Menu onClick={this.btnShow}>
                                {
                                    menuData.map((item, i) => {
                                        return item.divider ? <Menu.Divider key={i} /> : <Menu.Item key={i} confirmText={item.confirmText}><Icon type={item.icon} /> {item.text}</Menu.Item>
                                    })
                                }
                            </Menu>
                        )}
                        trigger={['click']}
                    >
                        更多操作
                    </Dropdown>
                }
            </div>
        );
    }
}

export default MoreOperations;