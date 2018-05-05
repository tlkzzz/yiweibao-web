/** 
 * @Description 施工进度
 */
import React from 'react';
import {bindActionCreators} from 'redux';
import {browserHistory} from 'react-router';
import {connect} from 'react-redux';
import actions from '../../actions/contract.js';
import {createForm} from 'rc-form';
import commonActions from '../../actions/common.js';
import ShowImg from '../../components/common/show_img.js';

import {correspondenceJson} from '../../tools/';

import {
    Icon,
    Button,
    Table,
    Pagination,
    Collapse,
    Form,
    Input,
    Row,
    Col,
    Select,
    Radio,
    DatePicker,
    Menu,
    message
} from 'antd';
const Panel = Collapse.Panel;

class ManageTwoComponent extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            modalShow: false,
            currentPage: 1,
            recordLoading: false,
            imgArr:[],
            imgModalShow:false,
        }

        this.customPanelStyle = {
            background: '#fff',
            borderRadius: 2,
            marginBottom: 24,
            border: 0,
            boxShadow: '0 1px 6px rgba(0, 0, 0, 0.2)'
        };
        this.recordDate = null;

        let defaultRender = (text, record, key) => {
            return (
                <p>{text ? text : '-'}</p>
            )
        };
        // 施工信息表格字段
        this.recordColumns = [
            {
                title: '编号',
                dataIndex: 'constructionNum',
                key: 'constructionNum',
                sorter: true,
                render: (text, record, key) => {
                    return (
                        <p><a className="order-number" onClick={() => {
                            this.jumpToConstruction(record)
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
                key: 'contractId',
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
                                    this.showDeleteConfirm(record.id, record.description)
                                }}
                            />
                        </div>
                    )
                }
            },
        ];
        const {location} = this.props;


        this.recordParam = {
            contractId: JSON.parse(localStorage.getItem('manage')).id,
            pageNum: 1,
            pageSize: 998,
        }
        this.localManage = JSON.parse(localStorage.getItem('manage'));
    }

    pageChange = () => {

    }
    // 任务分派列表（巡检项、所需物料）
    manageConstructionGetList = () => {
        const {actions} = this.props;
        this.setState({
            recordLoading: true,
        });
        actions.constructionGetList(this.recordParam, () => {
            this.setState({
                recordLoading: false,
            });
        });
    }

    //跳转到施工单详情页
    jumpToConstruction = (record, isAdd) => {
        const {actions} = this.props;

        if (isAdd) {
            localStorage.removeItem('construction');
            actions.clearList('CONSTRUCTION_INFO_GET_LIST');
            browserHistory.push('/contract/');
            browserHistory.push('/contract/construction/construction_info?add_construction=1&contract=1');
        }else{
            let json = {};
            json.id = record.id;
            json.status = record.status;
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
            const images = json.data.images,
                httpPath = json.data.httpPath;

            images.forEach((item, i) => {
                item.uid = i * -1;
                item.url = httpPath + item.path;
                item.name = item.fileName;
            })

            this.setState({
                imgModalShow: true,
                imgArr: images
            })

        })
    }

    componentWillMount() {
        const {actions, location} = this.props;
        if (this.localManage) {
            this.manageConstructionGetList();
            this.setState({editable: false});
        }
    }

    //弹出删除确认框
    showDeleteConfirm = (id, arg) => {
        if (Array.isArray(id) && !id.length) {
            message.error('请选择要删除的数据。')
        } else {
            confirm({
                title: `删除 ${typeof arg !== 'function' ? arg : (id.length + '条数据')}?`,
                okText: '删除',
                onOk: () => {
                    if (Array.isArray(id)) id = id.join(',')
                    this.deleteConstruction(id);
                    arg(); // 隐藏复选框
                }
            });
        }
    }

    //删除
    deleteConstruction = (id) => {
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

    render() {
        const {state, location} = this.props;

        const recordData = state.constructionListData;
        const recordList = recordData.list;

        return (
            <div className="eam-tab-page">
                <div className="eam-content">
                    <Collapse bordered={false} defaultActiveKey={['1', '2', '3']}>
                        <Panel header={<span className="label">施工信息<Icon type="caret-down"/></span>} key="2"
                               style={this.customPanelStyle}>
                            <Table
                                rowKey="id"
                                loading={this.state.recordLoading}
                                pagination={{
                                    showTotal: (total, range) => `当前第${range[0]}-${range[1]}条 / 共${total}条`,
                                    defaultPageSize: 5,
                                }}
                                dataSource={recordList}
                                columns={this.recordColumns}
                                bordered
                            />
                            <div className="panel-tools-right">
                                <Button type="primary" size="large" onClick={() => {
                                    this.jumpToConstruction('', true)
                                }}>新建</Button>
                            </div>
                        </Panel>
                    </Collapse>
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

export default connect(mapStateToProps, buildActionDispatcher)(ManageTwoComponent);