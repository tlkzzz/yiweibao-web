/** 
 * @Description KPI报表
 */
import React from 'react';
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';
import actions from '../../actions/report.js';


import {Icon, Button, Tree, Menu, Input} from 'antd';
const TreeNode = Tree.TreeNode;
const Search = Input.Search;
const treeData = [];

class KpiReportComponent extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            treeData,
            treeShow: false,
            expandedKeys: [],
            searchValue: '',
            autoExpandParent: true,
        };
        this.showUrl = 'http://i.com';
    }

    onExpand = (expandedKeys) => {
        console.log("------onExpand----", expandedKeys);
        const {actions} = this.props;
        this.setState({treeShow: true});
        let param = {};
        param.parentId = expandedKeys[0];
        param.isRoot = false;
        param.type = 'REPORT_KPI';

        actions.reportMenuGetList(param, () => {
            // console.log("----onExpand--reportMenuGetList----");
            const child = this.props.state.menuTreeData;
            // console.log("------child----", child);
            const treeData = [...this.state.treeData];
            // console.log("------treeData----", treeData);
            treeData.forEach((item) => {
                item.children = child;
            });
            this.setState({
                treeShow: true,
                expandedKeys,
                autoExpandParent: false,
            });
        });

    };
//搜索关键字
    getParentKey = (key, tree) => {
        let parentKey;
        for (let i = 0; i < tree.length; i++) {
            const node = tree[i];
            if (node.children) {
                if (node.children.some(item => item.key === key)) {
                    parentKey = node.key;
                } else if (this.getParentKey(key, node.children)) {
                    parentKey = this.getParentKey(key, node.children);
                }
            }
        }
        return parentKey;
    };
    //搜索框的事件
    onChange = (e) => {
        console.log("------onChange----", e);
        const value = e.target.value;
        const expandedKeys = treeData.map((item) => {
            if (item.key.indexOf(value) > -1) {
                return this.getParentKey(item.key, treeData);
            }
            return null;
        }).filter((item, i, self) => item && self.indexOf(item) === i);
        this.setState({
            expandedKeys,
            searchValue: value,
            autoExpandParent: true,
        });
    };

    onSelect = (selectedKeys, info) => {
        //选择的节点，此节点的URL
        this.setState({treeShow: false});
        let showUrl = info.node.props.url;
        this.showUrl = showUrl;
        this.setState({treeShow: true});
        console.log('selected', selectedKeys, info, info.node.props.url);
    };
    // 获取列表数据
    getList = (id) => {
        const {actions} = this.props;
        this.setState({treeShow: true});
        let param = {};
        param.parentId = 'REPORT_KPI';
        if (id) {
            param.parentId = id;
        }
        param.isRoot = false;
        param.type = 'REPORT_KPI';

        actions.reportMenuGetList(param, () => {
            console.log("------reportMenuGetList----");
            this.setState({treeShow: false});
            this.setState({treeData: this.props.state.menuTreeData});
        });
    };

    componentWillMount() {
        this.getList();
    }

    render() {

        const {searchValue, expandedKeys, autoExpandParent} = this.state;
        const loop = data => data.map((item) => {
            const index = item.title.search(searchValue);
            const beforeStr = item.title.substr(0, index);
            const afterStr = item.title.substr(index + searchValue.length);
            const title = index > -1 ? (
                <span>
          {beforeStr}
                    <span style={{color: '#f50'}}>{searchValue}</span>
                    {afterStr}
        </span>
            ) : <span>{item.title}</span>;
            if (item.children) {
                return (
                    <TreeNode key={item.key} title={title} url={item.url}>
                        {loop(item.children)}
                    </TreeNode>
                );
            }
            return <TreeNode key={item.key} title={title} url={item.url}/>;
        });
        return (
            <div>
                <div className="top-bar clearfix">
                    <h2>KPI报表</h2>
                    <div className="list-tools">
                    </div>
                </div>
                <div className="eam-content">
                    <div style={{background: '#FFFFFF', width: '20%', height: '100%', float: 'left'}}>
                        <Search style={{width: '50%', marginLeft: '12px', marginTop: '12px'}} placeholder="搜索内容"
                                onChange={this.onChange}/>
                        <Tree
                            onExpand={this.onExpand}
                            expandedKeys={expandedKeys}
                            onSelect={this.onSelect}
                            autoExpandParent={autoExpandParent}
                        >
                            {loop(this.state.treeData)}
                        </Tree>
                    </div>
                    <div style={{background: '#FFFFFF', float: 'left', width: '80%', height: '900px'}}>
                        <iframe style={{frameborder: '0', border: '0', width: '100%', height: '100%'}} id="reportIframe"
                                scrolling="no" src={this.showUrl}></iframe>
                    </div>
                </div>
            </div>
        )
    }
}


function mapStateToProps(state) {
    return {
        state: state.report
    }
}

function buildActionDispatcher(dispatch) {
    return {
        actions: bindActionCreators(actions, dispatch),
    }
}

export default connect(mapStateToProps, buildActionDispatcher)(KpiReportComponent);