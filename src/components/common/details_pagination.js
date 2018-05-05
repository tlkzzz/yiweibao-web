/**
 * DetailsPagination
 * 详情页分页组件
 *
   示例：
        <DetailsPagination
            state={state} // 此模块state
            listDataName="workOrderListData" // 列表数据state名 -> data = state.workOrderListData
            localStorageName="workOrder" // onChang 方法内设置的存储名
            onChange={(record)=>{
                let status = record.status;
                status = this.workOrderCorrJson[status];

                let json = {};
                json.id = record.id;
                json.process = status.process;
                json.status = record.status;
                json.workOrderNum = record.workOrderNum;
                json.description = record.description;

                // *跳转前存相关数据 和列表页跳详情页做同样处理 (这个存储是必要的操作并且必须包含id)
                localStorage.setItem('workOrder', JSON.stringify(json));
                // *根据自己的模块做跳转
                browserHistory.push('/maintenance/');
                browserHistory.push(`/maintenance/work_order/${status.path}`);
            }}
            getList={(pageNum, cb) => { // *分页是根据列表页数据切换数据 本业列表数据用完 这里请求上|下一页数据
                // *列表页跳详情页必须本地存储列表页请求数据参数 全局统一用LIST_PARAM 防止详情页刷新请求的数据与列表跳详情的数据不一致
                this.param = JSON.parse(localStorage.getItem('LIST_PARAM'));
                if (pageNum) this.param.pageNum = pageNum;
                this.getList(cb);
            }}
        />
    关键点：
        1. jumpTodetail要存 LIST_PARAM
        2. onChange方法执行jumpTodetail的逻辑
        3. getList方法要加callback
 */
import React from 'react';
import { notification } from 'antd'; 

class DetailsPagination extends React.Component {
    constructor (props) {
        super(props);
        this.state = {
            prevClassName: 'ant-pagination-prev',
            nextClassName: 'ant-pagination-next',
        }

        this.curIndex = undefined;
        this.curItem = {};
        this.listPageNum = 0;
    }
    backList = () => {
        notification.warning({
            message: '提示',
            description: '数据出现错误 :('
        });
        setTimeout(() => {
            const folderPath = window.location.pathname.split('/');
            window.location.href = `/${folderPath[1]}/${folderPath[2]}/`;
        }, 3000)
    }
    prev = () => {
        const { onChange, getList } = this.props;

        if (typeof this.curIndex === 'undefined') {
            this.backList();
            return false;
        }

        this.curIndex--;
        this.curItem = this.dataList[this.curIndex]; 

        if (this.state.nextClassName === 'ant-pagination-disabled ant-pagination-next') {
            this.setState({nextClassName: 'ant-pagination-next'});
        }

        if (this.curItem) {
            onChange(this.curItem)
        } else {
            if (this.listPageNum === 1) {
                this.curIndex = 0;
                this.setState({prevClassName: 'ant-pagination-disabled ant-pagination-prev'});
                notification.warning({
                    message: '提示',
                    description: '已经是第一条数据 前面没了 :）'
                });
            } else {
               
                const pageNum = this.listPageNum - 1;

                this.localStorageParam.pageNum = pageNum;
                localStorage.setItem('LIST_PARAM', JSON.stringify(this.localStorageParam));
                getList(pageNum, () => {
                    const { state, listDataName } = this.props;
                    const data = state[listDataName];
                    this.dataList = data.list;

                    this.curIndex = this.dataList.length - 1;

                    this.curItem = this.dataList[this.curIndex];
                    onChange(this.curItem);
                })
            }
        }
       
    }
    next = () => {
        const { onChange, getList } = this.props;

        if (typeof this.curIndex === 'undefined') {
            this.backList();
            return false;
        }

        this.curIndex++;
        this.curItem = this.dataList[this.curIndex];

        if (this.state.prevClassName === 'ant-pagination-disabled ant-pagination-prev') {
            this.setState({prevClassName: 'ant-pagination-prev'});
        }

        if (this.curItem) {
            onChange(this.curItem)
        } else {

            if (this.listPageNum === this.listPages) {
                this.curIndex = (this.listTotal % this.listPageSize === 0) ? this.listPageSize - 1 : (this.listTotal % this.listPageSize) - 1;
                this.setState({nextClassName: 'ant-pagination-disabled ant-pagination-next'});
                notification.warning({
                    message: '提示',
                    description: '已经是第最后一条数据 后面没了 :）'
                });
            } else {
                const pageNum = this.listPageNum + 1;

                this.localStorageParam.pageNum = pageNum;
                localStorage.setItem('LIST_PARAM', JSON.stringify(this.localStorageParam));
                getList(pageNum, () => {
                    const { state, listDataName } = this.props;
                    const data = state[listDataName];
                    this.dataList = data.list;

                    this.curIndex = 0;
                    this.curItem = this.dataList[this.curIndex];
                    onChange(this.curItem);
                })
            }
        }
    }

    componentDidUpdate () {
        const { state, listDataName, localStorageName } = this.props;
        const data = state[listDataName];

        if (data.list && !this.id) {
            this.localStorageParam = JSON.parse(localStorage.getItem('LIST_PARAM'));
            this.id = JSON.parse(localStorage.getItem(localStorageName)).id;
            this.dataList = data.list;

            this.dataList.forEach((item, i) => {
                if (item.id === this.id) {
                    this.curIndex = i;
                    return false;
                }
            })

            this.listPageNum = data.pageNum;
            this.listPages = data.pages;
            this.listTotal = data.total;
            this.listPageSize = data.pageSize;
        }
    }
    componentWillMount () {
        const { state, listDataName, getList } = this.props;
        const data = state[listDataName];

        if (Array.isArray(data) && !data.length) getList();
    }
    render() {

        const { state, listDataName, getList } = this.props;

        return (
            <ul className="ant-pagination pull-left">
                <li title="上一页" onClick={this.prev} className={this.state.prevClassName}>
                    <a></a>
                </li>
                <li title="下一页" onClick={this.next} className={this.state.nextClassName}>
                    <a></a>
                </li>
            </ul>
        );
    }
}

export default DetailsPagination;