import React from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import actions from '../../actions/common.js';

import { Tabs, Tree, Spin, Icon } from 'antd';
const TabPane = Tabs.TabPane;
const TreeNode = Tree.TreeNode;

/**
 * asideTree
 * 设备设施、位置树

   @props data={    //可单独只传入设备设施或位置数据 显示对应的树
                    [
                        {
                            name: '设备设施体系',                 // tab标题文本
                            key: 'classifications',             // tabkey
                            param: {a: 1}
                            actionsMethod: 'classifiGetTree',   // action请求树Data方法名
                            data: 'classifiTreeData',           // state数据名
                        },
                        {
                            name: '位置体系',
                            key: 'locations',
                            actionsMethod: 'locationsGetTree',
                            data: 'locationsTreeData',
                        }
                    ]
                }

   @props onSelect={(id, key) => {}} id：当前选择的节点id; key: 当前tabkey
 */
class asideTree extends React.Component {
    constructor (props) {
        super(props);

        const { state } = this.props;

        this.treeParam = {
            parentId: 'ea9a6ad4662d11e79308aaf2bfe747ac',
            orgId: state.orgId,
            productArray: state.productArray,
        }

        this.state = {
            treeLoading: false,
        }
    }

    tabChange = (key) => {
        this.treeCurName = key == 'classifications' ? 'classifications' : 'locations';
    }

    // 递归遍历
    recursiveTree = (data, key) => {
        let tree = data.map((item, i) => {
            return  <TreeNode title={key === 'locations' ? item.description : item.name} key={item.id}>
                        {
                            item.children.length ?
                            this.recursiveTree(item.children, key) :
                            null
                        }
                    </TreeNode>
        });
        return tree;
    }

    // 获取树菜单
    getTree = (method, param) => {
        const { actions } = this.props;
        this.setState({ treeLoading: true });
        actions[method](param ? param : this.treeParam, () => {
            this.setState({ treeLoading: false });
        });
    }
    treeSelect = (keyArr) => {
        if (!keyArr.length) return;
        this.props.onSelect(keyArr[0], this.treeCurName);
    }
    componentDidMount () {

        const { data } = this.props;

        this.treeCurName = data[0].key;

        data.forEach(item => {
            this.getTree(item.actionsMethod, item.param);
        });
    }
    render() {

        const { state, data } = this.props;

        return (
            <Tabs onChange={this.tabChange}>
                {
                    data.map(item => {
                        return (
                            <TabPane tab={item.name} key={item.key}>
                                {this.state.treeLoading ? <Spin /> : ''}
                                <Tree
                                    showLine
                                    // defaultExpandedKeys={['0-0-0']}
                                    onSelect={this.treeSelect}
                                >
                                    {this.recursiveTree(state[item.data], item.key)}
                                </Tree>
                            </TabPane>
                        )
                    })
                }

            </Tabs>
        );
    }
}

function mapStateToProps (state) {
    return {
        state: state.common
    }
}

function buildActionDispatcher(dispatch) {
    return {
        actions: bindActionCreators(actions, dispatch),
    }
}

export default connect(mapStateToProps, buildActionDispatcher)(asideTree);
