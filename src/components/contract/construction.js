/** 
 * @Description  施工单
 */

import React from 'react';
import ReactDOM from 'react-dom';
import {bindActionCreators} from 'redux';
import {Link, browserHistory} from 'react-router';
import {connect} from 'react-redux';
import actions from '../../actions/contract.js';
import commonActions from '../../actions/common.js';

import Collection from '../common/collection.js';
import ShowImg from '../../components/common/show_img.js';

import MoreOperations from '../common/more_operations.js';
import BackList from '../common/back_list.js';
import ListTools from '../common/list_tools.js';
import EamModal from '../common/modal.js';


import {runActionsMethod, correspondenceJson, filterArrByAttr} from '../../tools/';
import {Icon, Checkbox, Modal, Button, Table, Pagination, Input, Radio, message, Carousel} from 'antd';
const confirm = Modal.confirm;
const RadioGroup = Radio.Group;

class ConstructionComponent extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            modalShow: false,
            currentPage: 1,
            sendProcessRadioValue: 'agree', // 发送流程默认同意
            sendProcessYTitle: '', // 同意显示标题
            sendProcessYName: '',  // 同意显示人名
            sendProcessNTitle: '',
            sendProcessNName: '',
            rowSelection: null, // 表格多选
            selectedRowKeys: [],
            imgArr: [],
            imgModalShow: false,
        }


        let defaultRender = (text, record, key) => {
            return (
                <p>{text ? text : '-'}</p>
            )
        };

        //表格字段
        this.columns = [
            {
                title: '编号',
                dataIndex: 'constructionNum',
                key: 'constructionNum',
                sorter: true,
                render: (text, record, key) => {
                    return (
                        <p><a className="order-number" onClick={() => {
                            this.jumpToDetail(record)
                        }}>{text ? text : '-'}</a></p>
                    )
                }
            },
            {
                title: '描述',
                dataIndex: 'description',
                key: 'description',
                sorter: true,
                render: defaultRender
            },
            {
                title: '合同描述',
                dataIndex: 'contractDesc',
                key: 'contract_id',
                sorter: true,
                render: defaultRender
            },
            {
                title: '监管人',
                dataIndex: 'supervisionName',
                key: 'supervisionId',
                sorter: true,
                render: defaultRender
            },
            {
                title: '状态',
                dataIndex: 'statusDsr',
                key: 'status',
                sorter: true,
                render: defaultRender
            },
            {
                title: '创建时间',
                dataIndex: 'createDate',
                key: 'create_date',
                sorter: true,
                render: defaultRender
            },
            {
                title: '图片信息',
                dataIndex: 'img',
                key: 'img',
                render: (text, record) => {
                    return (
                        <p><a className="order-number" onClick={() => {
                            this.showImg(record)
                        }}><img width="30px" height="30px"
                                src="http://img3.redocn.com/20131025/Redocn_2013102514143640.jpg"/></a></p>
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
                            <Icon
                                type="delete"
                                onClick={() => {
                                    console.log('执行删除->' + record.id)
                                    this.showConfirm(record.id, record.description)
                                }}
                            />
                        </div>
                    )
                }
            },
        ];
        //*** 初始化列表参数 需要到处改参数的请求 把参数定义到这里 严禁把参数用state管理 因为参数变化不需要触发render来渲染页面
        const {commonState} = this.props;
        this.param = {
            orgId: commonState.orgId,
            siteId: commonState.siteId,
            personId: commonState.personId,
            pageNum: 1,
            pageSize: 10,
        }
    }

    jumpToDetail = (record, isAdd) => {
        const {actions} = this.props;

        if (isAdd) {
            localStorage.removeItem('construction');
            actions.clearList('CONSTRUCTION_INFO_GET_LIST');
            browserHistory.push('/contract/');
            browserHistory.push('/contract/construction/construction_info?add_construction=1');
        } else {
            let json = {};
            json.id = record.id;
            json.status = record.status;
            json.statusDsr = record.statusDsr;
            json.constructionNum = record.constructionNum;
            json.description = record.description;

            localStorage.setItem('construction', JSON.stringify(json));
            browserHistory.push(`/contract/construction/construction_info`);
        }
    }
    showImg = (record, isAdd) => {
        const {commonActions} = this.props;
        let quoteId = record.id,
            quoteType = "assetImg"
        const param = {
            quoteId,
            quoteType,
        };
        commonActions.getFilesList(param, json => {
            let data = json.data;
            const images = data.images,
                httpPath = data.httpPath;
            if (images && images.length > 0) {
                images.forEach((item, i) => {
                    item.uid = i * -1;
                    item.url = httpPath + item.path;
                    item.name = item.fileName;
                })

                this.setState({
                    imgArr: images,
                    imgModalShow: true,
                })
            } else {
                message.info("该施工单未上传图片")
            }
        })
    }

    // 高级筛选点击
    seniorFilterClick = () => {
        this.setState({modalShow: true})
        this.dropdownSeniorFilter.hide();
    }
    // 高级筛选弹窗隐藏
    modalHide = () => {
        this.setState({modalShow: false});
    }
    // 表格事件
    tableChange = (pagination, filters, sorter) => {
        if (sorter.construction) {
            let sorterConstruction = sorter.construction;
            let endIndex = sorterConstruction.indexOf('end');
            sorterConstruction = sorterConstruction.slice(0, endIndex);
            this.param.sorts = `${sorter.columnKey} ${sorterConstruction}`;
        } else {
            this.param.sorts = '';
        }

        this.getList();
    }
    // 分页事件
    pageChange = (page, pageSize) => {
        this.setState({currentPage: page});
        this.param.pageNum = page; //*** 需要修改参数 在方法内单独修改
        this.getList();
    }
    // 获取列表数据
    getList = () => {
        const {actions} = this.props;
        this.setState({tableLoading: true});
        actions.constructionGetList(this.param, () => {
            this.setState({tableLoading: false});
        });
    };

    deleteContractConstruction = (id) => {
        const {actions} = this.props;
        let param = {ids: id};
        actions.constructionDel(param, (data) => {
            if (data.success) {
                this.getList();
            } else {
                message.error(data.msg)
            }
        });
    }
    //弹出删除确认框
    showConfirm = (id, arg) => {
        if (Array.isArray(id) && !id.length) {
            message.error('请选择要删除的数据。')
        } else {
            confirm({
                title: `删除 ${typeof arg !== 'function' ? arg : (id.length + '条数据')}?`,
                okText: '删除',
                onOk: () => {
                    if (Array.isArray(id)) id = id.join(',')
                    this.deleteContractConstruction(id);
                    if (typeof arg === 'function') arg(); // 隐藏复选框
                }
            });
        }
    }
    // 模糊查询
    fuzzyQuery = (keywords) => {
        this.param.words = keywords;
        this.getList();
    }

    tableSelectChange = (selectedRowKeys) => {
        this.setState({selectedRowKeys});
    }
    // 更多操作
    moreClick = (key, hideCheckBox) => {
        if (key === '0') { //批量删除
            this.showConfirm(this.state.selectedRowKeys, hideCheckBox)
        }
    }
    // 保存工单
    constructionSave = () => {
        const {actions, location} = this.props;
        actions.getFormValues(false);

        clearTimeout(this.timer);
        this.timer = setTimeout(() => {
            const {state, commonState} = this.props;
            if (state.getFormValues === true) return;
            const data = state.constructionInfoListData,
                constructionSuperviseVoList = data.constructionSuperviseVoList || [],
                deleteConstructionSuperviseVoList = data.delOriginalDataId || [];

            const param = {
                ...state.getFormValues,
                constructionSuperviseVoList,
                deleteConstructionSuperviseVoList
            }

            runActionsMethod(actions, 'constructionInfoSave', param, () => {
                setTimeout(() => {
                    this.getList();
                    browserHistory.push('/contract/construction');
                }, 500);
            });
        }, 0);
    }

    loadIsComplete = (isAdd) => {

        const {state, commonState} = this.props;

        let complete = false

        const constructionNum = isAdd ? state.constructionCode : true,
            constructionStatusData = commonState.constructionStatusData;

        if (
            constructionNum &&
            constructionStatusData.length
        ) complete = true;

        return complete;
    }
    // 发送流程
    sendProcess = (curStatus) => {

        const {state, actions} = this.props;
        const data = state.constructionInfoListData;
        if (curStatus === "XZ") { // 待提报
            confirm({
                title: '是否启动任务流程？',
                className: 'send-process-confirm',
                content: (
                    <p className="send-process-text">任务将会推送到 <span
                        className="blue">&lt;{`${data.supervisionName}`}&gt;</span> 进行处理。通过记录中“执行记录”进行实时查看！</p>
                ),
                iconType: 'smile-o',
                onOk: () => {
                    this.sendProcessConfirm(data.id);
                }
            });
        } else {

            let sendProcessYTitle, sendProcessYName, sendProcessNTitle, sendProcessNName;

            if (curStatus === "ZX") {

                sendProcessYTitle = '施工单确认';
                sendProcessYName = `${data.supervisionName}`;

                this.setState({sendProcessYTitle, sendProcessYName});
            }
            this.sendProcessModal.modalShow();
        }

    }
    sendProcessConfirm = (id) => {
        const {actions} = this.props;
        const param = {};
        param.id = id;
        param.processStatus = 'agree';
        param.description = '已启动任务流程';
        param.siteId = this.param.siteId;
        param.personId = this.param.personId;

        runActionsMethod(actions, 'sendConstructionProcess', param, (json) => {

/*
            const {state} = this.props;
            let dataName = 'constructionInfoListData';


            const data = state[dataName];

            const obj = {};
            obj.id = data.id; // 详情数据里取
            obj.status = json.data; // 保存成功返回数据里取保存后最新值
            obj.constructionNum = this.localStorageConstruction.constructionNum; // 本地存储取 因为有的返回数据没有编号和描述
            obj.description = this.localStorageConstruction.description; // 本地存储取 因为有的返回数据没有编号和描述

            localStorage.setItem('construction', JSON.stringify(obj));
*/

            setTimeout(() => {
                this.getList();
                browserHistory.push('/contract/construction');
            }, 500);
        });
    }

    resetListParam = () => {
        this.param.status = [];
        this.param.type = [];
    }


    listToolsComponentWillMount = () => { // 代替 componentWillMount
        this.resetListParam();
        this.getList();
    }

    render() {
        const {children, state, commonState, location, commonActions} = this.props;
        const data = state.constructionListData;
        const dataSource = data.list;


        const isAddConstruction = location.query.add_construction;
        const localStorageConstruction = JSON.parse(localStorage.getItem('construction'));
        this.localStorageConstruction = localStorageConstruction;

        const constructionInfoData = state.constructionInfoListData;
        const constructionNum = (localStorageConstruction && localStorageConstruction.constructionNum);
        const constructionCode = isAddConstruction ? state.constructionCode : constructionNum;

        let sendProcessId = constructionInfoData.id;
        let curStatus = constructionInfoData.status;

        const radioStyle = {
            display: 'block',
            height: '30px',
            lineHeight: '30px',
            fontSize: 14
        };

        const rowSelection = this.state.rowSelection ?
            {
                selectedRowKeys: this.state.selectedRowKeys,
                onChange: this.tableSelectChange,
                getCheckboxProps: record => ({
                    disabled: record.status !== 'XZ', // 不是待提报 全部disable
                }),
            } :
            null;
        return children ?
            (
                <div>
                    <div className="top-bar clearfix">
                        <div className="details-title pull-left">
                            <h3>{this.loadIsComplete(isAddConstruction) ? constructionCode :
                                <span><Icon type="loading"/> 数据加载中...</span>}</h3>
                            <span
                                className="eam-tag">{constructionInfoData.statusDsr ? constructionInfoData.statusDsr : (localStorageConstruction && localStorageConstruction.statusDsr)}</span>
                            <p>{constructionInfoData.description ? constructionInfoData.description : (localStorageConstruction && localStorageConstruction.description)}</p>
                        </div>
                        <div className="list-tools-right pull-right">
                            <Pagination
                                total={50}
                                className="pull-left"
                                current={this.state.currentPage}
                                onChange={this.pageChange}
                            />
                            <BackList  location={location}/>
                            <Button type="primary" size="large"
                                    onClick={() => {
                                        this.sendProcess(curStatus)
                                    }}>发送流程</Button>
                        </div>
                        <div className="eam-tab-nav">
                            <Link activeClassName="active" to="/contract/construction/construction_info"><Icon
                                type="check-circle-o"/>基本信息</Link>
                            <Button size="large" style={{position: 'absolute', right: 0, bottom: 10}}
                                    onClick={this.constructionSave}>保存</Button>
                        </div>
                    </div>
                    {children}
                    <EamModal
                        title="发送流程"
                        ref={sendProcessModal => this.sendProcessModal = sendProcessModal}
                    >
                        <RadioGroup onChange={e => {
                            this.setState({sendProcessRadioValue: e.target.value})
                        }} value={this.state.sendProcessRadioValue}>
                            <Radio
                                style={radioStyle}
                                value='agree'
                            >
                                {this.state.sendProcessYTitle}
                            </Radio>
                            <p
                                style={{marginBottom: 20, textIndent: 22}}
                                className="send-process-text"
                            >
                                任务将会推送到<span className="blue">&lt;{this.state.sendProcessYName}&gt;</span>进行处理。通过记录中“执行记录”进行实时查看！
                            </p>
                            {/*<Radio
                                style={radioStyle}
                                value='reject'
                            >
                                {this.state.sendProcessNTitle}
                            </Radio>
                            <p
                                style={{textIndent: 22}}
                                className="send-process-text"
                            >
                                驳回到<span className="blue">&lt;{this.state.sendProcessNName}&gt;</span>重新处理。
                            </p>*/}
                        </RadioGroup>
                        <p
                            style={{marginTop: 20}}
                            className="send-process-text"
                        >
                            备注说明：（填写驳回原因、审批意见等）
                        </p>
                        <Input type="textarea" rows={4}
                               ref={sendProcessTextarea => this.sendProcessTextarea = sendProcessTextarea}/>
                        <div className="modal-footer clearfix">
                            <Button size="large" onClick={() => {
                                this.sendProcessModal.modalHide()
                            }}>取消</Button>
                            <Button type="primary" size="large" onClick={() => {
                                this.sendProcessConfirm(sendProcessId)
                            }}>确定</Button>
                        </div>
                    </EamModal>
                </div>
            ) :
            (
                <div>
                    <div className="top-bar clearfix">
                        <ListTools
                            title="施工单"
                            commonState={commonState}
                            commonActions={commonActions}
                            onEnter={(text) => {
                                this.fuzzyQuery(text);
                            }}
                            listToolsComponentWillMount={this.listToolsComponentWillMount}
                            collectionChange={(checked) => {
                                this.param.collect = checked;
                                this.getList();
                            }}
                            seniorFilter={{
                                data: [
                                    {
                                        type: 'DOMAIN_VALUE',               // 选择项类型
                                        key: 'constructionStatusData',         // key 域值的key用作取state数据
                                        label: '状态',                    // 标题
                                        actionsType: 'PATROL_ORDER_STATUS',   // 域值actions type
                                        actionsParam: 'construction',           // 域值actions 参数
                                    },
                                ],
                                onOk: result => {
                                    this.setState({currentPage: 1});
                                    this.param.pageNum = 1;

                                    this.param.status = filterArrByAttr(result[0] && result[0].data || [], 'value');
                                    this.param.type = filterArrByAttr(result[1] && result[1].data || [], 'value');

                                    this.getList();
                                }
                            }}
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
                                menuData={[
                                    {
                                        icon: 'delete',
                                        text: '批量删除',
                                        confirmText: '确认删除'
                                    },
                                ]}
                                onChange={(key, showCheckbox) => {
                                    let rowSelection;

                                    if (showCheckbox) {
                                        this.setState({selectedRowKeys: []}); // 清空选择
                                        rowSelection = true
                                    } else {
                                        rowSelection = false;
                                    }

                                    this.setState({rowSelection})
                                }}
                                onOk={(key, hideCheckBox) => {
                                    this.moreClick(key, hideCheckBox);
                                }}
                            />
                            <Button type="primary" size="large" onClick={() => {
                                this.jumpToDetail('', true)
                            }}>新建</Button>
                        </div>
                    </div>
                    <div className="eam-content">
                        <div className="eam-content-inner">
                            <Table
                                loading={this.state.tableLoading}
                                rowKey="id"
                                pagination={false}
                                dataSource={dataSource} // ***渲染数据
                                columns={this.columns}
                                rowSelection={rowSelection}
                                bconstructioned
                                onChange={this.tableChange}
                            />
                            <Pagination
                                total={data.total}
                                showTotal={(total, range) => `当前第${range[0]}-${range[1]}条 / 共${total}条`}
                                current={this.state.currentPage}
                                showQuickJumper
                                onChange={this.pageChange}
                            />
                        </div>
                    </div>
                    <ShowImg
                        imgList={this.state.imgArr}
                        width={1000}
                        modalHide={() => {
                            this.setState({imgModalShow: false})
                        }}
                        visible={this.state.imgModalShow}
                    />
                </div>
            )
    }
}


function mapStateToProps(state) {
    return {
        state: state.contract,
        commonState: state.common
    }
}

function buildActionDispatcher(dispatch) {
    return {
        actions: bindActionCreators(actions, dispatch),
        commonActions: bindActionCreators(commonActions, dispatch),
    }
}

export default connect(mapStateToProps, buildActionDispatcher)(ConstructionComponent);