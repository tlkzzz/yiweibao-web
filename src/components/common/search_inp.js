import React from 'react';
import addons from 'react-addons';
import { Icon } from 'antd';

/** 
 * searchInp
 * 搜索框组件
 *
 *
 * @method    getVal 获取搜索框value 父组件内用ref调取 注：ref官方推荐用回掉函数代替字符串
 * @props     onEnter input获得焦点时回车事件 执行函数的参数为当前输入框value onEnter={(val) => { console.log(val) }}
 */
class SearchInp extends React.Component {
    constructor (props) {
        super(props);
        this.state = {
            searchIsFocus: false,
            rightIconType: 'enter'
        }
    }
    searchFocus = () => {
        this.setState({ searchIsFocus: true });
    }
    searchBlur = () => {
        this.setState({ searchIsFocus: false });
    }
    getVal = () => {
        return this.inp.value;
    }
    inpKeyUp = (e) => {
        const { onEnter, onKeyUp } = this.props;
        if (e.keyCode === 13 && typeof onEnter !== 'undefined') {
            onEnter(this.getVal());
        }
        else if (typeof onKeyUp !== 'undefined') {
            onKeyUp(this.getVal());
        }
    }
    delIconShow = () => {
        this.setState({
            rightIconType: 'close-circle'
        });
    }
    delIconHide = () => {
        this.setState({
            rightIconType: 'enter'
        });
    }
    iconFocus = () => {
        const { onEnter, onKeyUp } = this.props;
        if (this.inp.value === '') return;

        let parent = this.inp.parentNode;
        let parentClass = parent.className;

        if (!this.state.searchIsFocus) {
            this.setState({searchIsFocus: 'true'},() => {
                this.inp.focus();
            })
        }

        this.inp.value = '';
        onEnter ? onEnter('') : onKeyUp('');
    }
    render() {
        const { className, style } = this.props;
        const thisState = this.state;

        let cx = addons.classSet;

        let cxClass = cx({
            'search-wrap active': thisState.searchIsFocus === true,
            'search-wrap': thisState.searchIsFocus === false
        });

        return (
            <div className={className + ' ' + cxClass} style={style}>
                <Icon type="search"/>
                <Icon type={this.state.rightIconType}
                    tabIndex="0"
                    onMouseEnter={this.delIconShow}
                    onMouseLeave={this.delIconHide}
                    onFocus={this.iconFocus}
                />
                <input
                    ref={inp => this.inp = inp}
                    type="text"
                    value={this.props.value}
                    placeholder="模糊查询"
                    onFocus={this.searchFocus}
                    onBlur={this.searchBlur}
                    onKeyUp={this.inpKeyUp}
                />
            </div>
        );
    }
}

export default SearchInp;