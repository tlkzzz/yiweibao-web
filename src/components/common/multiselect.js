import React from 'react';
/** 
 * multiselect
 * 多选组件
 
 *
 * @method    clearSelected 清除
 * @method    getSelected 获取选择结果数组 用refs调取 
 */

class Multiselect extends React.Component {
    constructor (props) {
        super(props);
        this.state = {
            selected: this.props.selectedArr || []
        }
    }
    onSelect = (index, value) => {
        let arr = this.state.selected;
        arr[index] = arr[index] ? '' : value;
        this.setState({selected: arr});
    }
    getSelected = () => {
        return this.data.filter((item, i) => {
            if (this.state.selected[i]) return item
        })
    }
    clearSelected = () => {
        this.setState({selected: []});
    }
    render() {
        this.data = this.props.data ? this.props.data : [];
        return (
            <div className="eam-multiselect">
                {
                    this.data.map((item, i) =>
                        <span
                            key={i}
                            className={this.state.selected[i] ? 'active' : ''}
                            onClick={() => {
                                this.onSelect(i, item.value);
                            }}
                        >
                            {item.description}
                        </span>
                    )
                }
            </div>
        );
    }
}

export default Multiselect;