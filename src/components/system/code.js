/** 
 * @Description  二维码主界面
 */
import React from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { Link , browserHistory } from 'react-router';
import actions from '../../actions/system.js';
import commonActions from '../../actions/common';

import Collection from '../../components/common/collection.js';
import Dropdown from '../../components/common/dropdown.js';
import ListTools from '../../components/common/list_tools.js';
import DetailsPagination from '../common/details_pagination.js';
import BackList from '../common/back_list';
import MoreOperations from '../../components/common/more_operations.js';

import { runActionsMethod ,filterArrByAttr , correspondenceJson } from '../../tools/';

import { Icon, Checkbox, Modal, Button, Table, Form, Input, Pagination, Menu, message} from 'antd';
const confirm = Modal.confirm;

class CodeComponent extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            currentPage: 1,
            tableLoading: false,
            rowSelection: null, // 表格多选
            selectedRows: [],
        }

        let defaultRender = (text, record, key) => {
            return (
                <p>{text ? text : '-'}</p>
            )
        };


        //表格字段
        this.columns = [
            {
                title: '二维码',
                dataIndex: 'quickResponseCodeNum',
                key: 'quickResponseCodeNum',
                sorter: true,
                render: (text, record, key) => {
                    return (
                        <p><Link className="order-number" onClick={() => { this.jumpToTabPage(record) }}>{text ? text : '-'}</Link></p>
                    )
                }
            },
            {
                title: '描述',
                dataIndex: 'description',
                key: 'description',
                sorter: true,
                width: '30%',
                render: defaultRender
            },
            {
                title: '应用程序',
                dataIndex: 'applicationName',
                key: 'applicationName',
                sorter: true,
                render: defaultRender
            },
            {
                title: '上次生成时间',
                dataIndex: 'lastGenerateDate',
                key: 'lastGenerateDate',
                sorter: true,
                render: defaultRender
            },
            {
                title: '有数据更新？',
                dataIndex: 'dataUpdate',
                key: 'dataUpdate',
                sorter: true,
                render: (text, record, key) => {
                    return (
                        <div className="table-icon-group">
                            <Checkbox checked={text}  disabled />
                        </div>
                    )
                }
            },
            {
                title: '操作',
                dataIndex: '4',
                key: '4',
                width: 120,
                render: (text, record, key) => {
                    return (
                        <div className="table-icon-group">
                            <Icon  className="icon-right"
                                type="delete"
                                onClick={() => {
                                    this.showConfirm(record.id, record.quickResponseCodeNum)
                                }}
                            />
                        </div>
                    )
                }
            },
        ];

        //*** 初始化列表参数 需要到处改参数的请求 把参数定义到这里 严禁把参数用state管理 因为参数变化不需要触发render来渲染页面
        this.param = {
            pageNum: 1,
            pageSize: 10,
        }
    }

// 表格事件---排序部分
    tableChange = (pagination, filters, sorter) => {
        if (sorter.order) {
            let sorterOrder = sorter.order;
            let endIndex = sorterOrder.indexOf('end');
            sorterOrder = sorterOrder.slice(0, endIndex);
            this.param.sorts = `${sorter.field} ${sorterOrder}`;
        } else {
            this.param.sorts = '';
        }
        this.getList();
     }
    tableSelectChange = (selectedRows) => {
        this.setState({ selectedRows });
    }

    jumpToTabPage = (record , isAdd) => {
        if (isAdd) {
            this.listMoreOperations.cancel();
            localStorage.removeItem("code");
            browserHistory.push(`/system/code/code_detail?add_code=1`);
        } else {
            localStorage.removeItem("getCodeData");
            let json = {};
            json.id = record.id;
            json.code = record.quickResponseCodeNum;
            json.description = record.description;
            json.statusName = correspondenceJson.code[record.status].text;

            localStorage.setItem('LIST_PARAM', JSON.stringify(this.param));
            localStorage.setItem('code', JSON.stringify(json));
            browserHistory.push(`/system/code/code_detail`);
            this.setState({
                rowSelection: null,
            })
        }
    //    localStorage.removeItem("getCodeData");
    //    browserHistory.push(`/system/code/code_detail?id=${record.id}&code=${record.quickResponseCodeNum}&description=${record.description}&statusName=${correspondenceJson.code[record.status].text}`);
    }
// 分页事件
    pageChange = (page, pageSize) => {
        this.setState({ currentPage: page });
        this.param.pageNum = page; //*** 需要修改参数 在方法内单独修改
        this.getList();
    }

    onShowSizeChange = (page, pageSize) => {
        this.setState({ currentPage: page });
        this.param.pageNum = page;
        this.param.pageSize = pageSize;//*** 需要修改参数 在方法内单独修改
        this.getList();
    }
// 获取列表数据
    getList = (cb) => {
        const { actions } = this.props;
        this.setState({ tableLoading: true });
        actions.qrCodeGetList(this.param, () => {
            cb && cb();
            this.setState({ tableLoading: false });
        });
    }
    // 删除二维码管理
    moreClick = () => {
        if(this.state.selectedRows) {
            this.showConfirm(this.state.selectedRows)
        }else{
            message.error('请选择要删除的数据。')
        }
    }
    // 删除确认
    showConfirm = (id, text) => {
        console.log(id);
        if(!id){
            message.error('请选择要删除的数据。')
        } else {
            confirm({
                title: `删除 ${text ? text : '数据' }?`,
                okText: '删除',
                onOk: () => {
                    this.del(id);
                }
            });
        }

    }
    // 列表删除
    del = (id) => {
        const { actions } = this.props;
        let param = {ids: id};
        runActionsMethod(actions, 'qrCodeDel', param, () => {
            this.setState({
                selectedRows: []
            })
            this.getList();
        });
    }
    // 模糊查询
    fuzzyQuery = (keywords) => {
        this.param.words = keywords;
        this.getList();
    }

    //保存二维码管理
    qrCodeSave = () => {
        const { location, actions , commonState } = this.props;

        const isAdd = location.query.add_code;
        this.code = localStorage.getItem('code');
        actions.getFormValues(false);

        clearTimeout(this.timer);
        this.timer = setTimeout(() => {

            const { state } = this.props;
            const ids = {
                orgId: commonState.orgId,
                siteId: commonState.siteId,
                id: isAdd ? '' : (this.code && JSON.parse(this.code).id),
            }

            const data = state.codeByIdListData,
                qrcodeApplicationPropertyVoList = data.newPropertyList || [],
                deleteQRCodeApplicationPropertyVoList = [data.materialDelOriginalDataId] || [];
            if(state.getFormValues.description != null && state.getFormValues.applicationName != null) {
                const param = {
                    ...ids,
                    ...state.getFormValues,
                    qrcodeApplicationPropertyVoList,
                    deleteQRCodeApplicationPropertyVoList,
                }
                runActionsMethod(actions, 'qrCodeSave', param, () => {
                    localStorage.removeItem("getCodeData");
                    this.getList();
                });
            }else{
                message.error('*是必填信息,请填写完整 ！');
            }

        },0);
    }

    componentWillMount () {
        this.getList();
    }
    render () {

        const { children , state , location } = this.props;
        const data = state.qrCodeListData //*** 拿到请求返回的数据
        const list = data ? data.list : [];
        const getCodeData = state.getCodeData;

        // 高级筛选选项数据
        const seniorFilterSelectArr = [
            [],
            [],
        ];
        const code = JSON.parse(localStorage.getItem('code'));
        const isAdd = location.query.add_code;

        const rowSelection = this.state.rowSelection ?
                            {
                                selectedRows: this.state.selectedRows,
                                onChange: this.tableSelectChange,
                            } :
                            null;
        return children ?
            (
              <div>
                  <div className="top-bar clearfix">
                      <div className="details-title pull-left">
                          <h3>{isAdd ? getCodeData : code.code}</h3>
                          <span className="eam-tag">{code && code.statusName}</span>
                          <p>{code && code.description}</p>
                      </div>
                      <div className="list-tools-right pull-right">
                          {
                              isAdd ?
                              null :
                              <DetailsPagination
                                  state={state} // 列表数据的state
                                  listDataName="qrCodeListData" // 列表数据state名 -> data = state.workOrderListData
                                  localStorageName="code" // onChang 方法内设置的存储名
                                  onChange={(record)=>{
                                      let json = {};
                                      json.id = record.id;
                                      json.code = record.quickResponseCodeNum;
                                      json.description = record.description;
                                      json.statusName = correspondenceJson.code[record.status].text;

                                      localStorage.setItem('code', JSON.stringify(json));
                                      browserHistory.push('/system/');
                                      browserHistory.push(`/system/code/code_detail`);
                                  }}
                                  getList={(pageNum, cb) => {
                                        // *分页是根据列表页数据切换数据 本业列表数据用完 这里请求上|下一页数据
                                        // *列表页跳详情页必须本地存储列表页请求数据参数 全局统一用LIST_PARAM 防止详情页刷新请求的数据与列表跳详情的数据不一致
                                      this.param = JSON.parse(localStorage.getItem('LIST_PARAM'));
                                      if (pageNum) this.param.pageNum = pageNum;
                                      this.getList(cb);
                                  }}
                             />
                          }
                          <BackList location={location}/>
                          <Button type="primary" size="large" onClick={this.qrCodeSave}>保存</Button>
                      </div>
                  </div>
                  {children}
              </div>
            ) :
            (
                <div>
                    <div className="top-bar clearfix">
                        <ListTools
                            title="二维码管理"
                            onEnter={(text) => {
                                this.fuzzyQuery(text);
                            }}
                            conditionList={seniorFilterSelectArr}
                        />
                        <div className="list-tools-right pull-right">
                            <Pagination
                                total={data.total}
                                className="pull-left"
                                current={this.state.currentPage}
                                onChange={this.pageChange}
                            />
                            <MoreOperations
                                style={{float: 'left'}}
                                ref={listMoreOperations => this.listMoreOperations = listMoreOperations}
                                menuData={[
                                    {
                                        icon: 'delete',
                                        text: '批量删除',
                                        confirmText: '确认删除'
                                    }
                                ]}
                                onChange={(key, showCheckbox) => {
                                    let rowSelection;

                                    if (showCheckbox) {
                                        this.setState({ selectedRows: [] }); // 清空选择
                                        rowSelection = true
                                    } else {
                                        rowSelection = false;
                                    }

                                    this.setState({
                                        rowSelection,
                                    }, () => {
                                        this.setState({
                                            moreOperationsKey: key,
                                        })
                                    })
                                }}
                                onOk={ ()=> {
                                    this.moreClick();
                                }}
                            />
                            <Button type="primary" size="large" onClick={() => {this.jumpToTabPage('',true)}}>新建</Button>
                        </div>
                    </div>
                    <div className="eam-content">
                        <div className="eam-content-inner">
                            <Table
                                loading={this.state.tableLoading}
                                rowKey="id"
                                pagination={false}
                                dataSource={list} // ***渲染数据
                                columns={this.columns}
                                rowSelection={rowSelection}
                                bordered
                                onChange={this.tableChange}
                            />
                            <Pagination
                                total={data.total}
                                showTotal={(total, range) => `当前第${range[0]}-${range[1]}条 / 共${total}条`}
                                current={this.state.currentPage}
                                showQuickJumper
                                showSizeChanger
                                onChange={this.pageChange}
                                onShowSizeChange={this.onShowSizeChange}
                            />
                        </div>
                    </div>
                </div>
            )
      }
}


function mapStateToProps (state) {
    return {
        state: state.system,
        commonState: state.common
    }
}

function buildActionDispatcher(dispatch) {
    return {
        actions: bindActionCreators(actions, dispatch),
        commonActions: bindActionCreators(commonActions, dispatch),
    }
}

export default connect(mapStateToProps, buildActionDispatcher)(CodeComponent);
