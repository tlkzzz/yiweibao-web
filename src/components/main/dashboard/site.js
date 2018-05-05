 /**
 * Dashboard-项目（site）
 */
import React from 'react';
import { Row, Col, Table, Icon } from 'antd';

import pie from '../../../images/site-pie.png';
import line from '../../../images/site-line.png';
import bar from '../../../images/site-bar.png';

const columns = [
    {
         title: '项目',
         dataIndex: 'name',
         key: 'name',
    },
    {
        title: '年份',
        dataIndex: 'address',
        key: 'address',
    },
    {
        title: '工单数',
        dataIndex: 'action',
        key: 'action',
    },
    {
        title: '环比',
        dataIndex: 'action2',
        key: 'action2',
        render: (text, record) => {
            return record.action2 === '10%' ? <span className="green">{text} <Icon type="caret-up" /></span> : <span className="red">{text} <Icon type="caret-down" /></span>
        }
    }
];

const data = [
    {
        key: '1',
        name: '湖南省博物馆',
        age: '95%',
        address: 100000,
        action: 70,
        action2: '10%',
    },
    {
        key: '2',
        name: '湖南省博物馆',
        age: '95%',
        address: 100000,
        action: 70,
        action2: '10%',
    },
    {
        key: '3',
        name: '湖南省博物馆',
        age: '95%',
        address: 100000,
        action: 70,
        action2: '33%',
    },
];

const columns2 = [
    {
         title: '业务功能',
         width: '33.33%',
         className: 'text-center',
         dataIndex: 'name',
         key: 'name',
    },
    {
        title: '待办数',
        width: '33.33%',
        className: 'text-center',
        dataIndex: 'address',
        key: 'address',
    },
    {
        title: '经手未关闭数',
        width: '33.33%',
        className: 'text-center',
        dataIndex: 'action',
        key: 'action',
    },
];

const data2 = [
    {
        key: '1',
        name: '湖南省博物馆',
        age: '95%',
        address: 100000,
        action: 70,
        action2: '10%',
    },
    {
        key: '2',
        name: '湖南省博物馆',
        age: '95%',
        address: 100000,
        action: 70,
        action2: '10%',
    },
    {
        key: '3',
        name: '湖南省博物馆',
        age: '95%',
        address: 100000,
        action: 70,
        action2: '33%',
    },
    {
        key: '13',
        name: '湖南省博物馆',
        age: '95%',
        address: 100000,
        action: 70,
        action2: '10%',
    },
    {
        key: '23',
        name: '湖南省博物馆',
        age: '95%',
        address: 100000,
        action: 70,
        action2: '10%',
    },
    {
        key: '33',
        name: '湖南省博物馆',
        age: '95%',
        address: 100000,
        action: 70,
        action2: '33%',
    },
];

class SiteDashboard extends React.Component {
    constructor(props) {
        super(props);
    }
    componentWillMount () {
        const { commonState, actions } = this.props;
        const param = {
            siteId: commonState.siteId,
        }

        actions.historyToday(param);
        actions.todoStatistics(param);
    }
    render () {

        const { state } = this.props;
        console.log(state.historyTodayList)
        return (
            <Row gutter={16}>
                <Col className="gutter-row" span={7}>
                    <div className="gutter-box">
                        <div className="eam-card">
                            <h2>历史今日工单数</h2>
                            <div className="clearfix totals site-totals">
                                <div>
                                    <h3>15</h3>
                                    <h4>今日总工单数</h4>
                                </div>
                                <div>
                                    <h3>20</h3>
                                    <h4>完成数</h4>
                                </div>
                                <div>
                                    <h3>66</h3>
                                    <h4>未完成数</h4>
                                </div>
                            </div>
                            <Table
                                size="small"
                                columns={columns}
                                dataSource={data}
                                pagination={false}
                            />
                        </div>
                        <div className="eam-card">
                            <h2>工单统计分析</h2>
                            <img src={pie} width="70%" style={{display: 'block', margin: '20px auto 0'}} alt=""/>
                        </div>
                    </div>
                </Col>
                <Col className="gutter-row" span={10}>
                    <div className="gutter-box">
                        <div className="eam-card">
                            <h2>待办任务统计</h2>
                            <Table
                                size="small"
                                columns={columns2}
                                dataSource={data2}
                                pagination={false}
                            />
                        </div>
                        <div className="eam-card">
                            <h2>性能优势</h2>
                            <img src={line} width="90%" style={{display: 'block', margin: '35px auto 0'}} alt=""/>
                        </div>
                    </div>
                </Col>
                <Col className="gutter-row" span={7}>
                    <div className="gutter-box">
                        <div className="eam-card">
                            <h2>总部消息</h2>
                            <ul className="org-msg">
                                <li>
                                    <p>总部消息内容消息内容总部消息内容消息内内容消息内消息</p>
                                    <div className="clearfix">
                                        <span className="pull-left">2017-09-22</span>
                                        <span className="pull-right">有附件</span>
                                    </div>
                                </li>
                                <li>
                                    <p>总部消息内容消息内容总部消息内容消息内内容消息内消息</p>
                                    <div className="clearfix">
                                        <span className="pull-left">2017-09-22</span>
                                        <span className="pull-right">有附件</span>
                                    </div>
                                </li>
                                <li>
                                    <p>总部消息内容消息内容总部消息内容消息内内容消息内消息</p>
                                    <div className="clearfix">
                                        <span className="pull-left">2017-09-22</span>
                                        <span className="pull-right">有附件</span>
                                    </div>
                                </li>
                                <li>
                                    <p>总部消息内容消息内容总部消息内容消息内内容消息内消息</p>
                                    <div className="clearfix">
                                        <span className="pull-left">2017-09-22</span>
                                        <span className="pull-right">有附件</span>
                                    </div>
                                </li>
                                <li>
                                    <p>总部消息内容消息内容总部消息内容消息内内容消息内消息</p>
                                    <div className="clearfix">
                                        <span className="pull-left">2017-09-22</span>
                                        <span className="pull-right">有附件</span>
                                    </div>
                                </li>
                            </ul>
                        </div>
                        <div className="eam-card">
                            <h2>产品异常总览</h2>
                            <img src={bar} width="90%" style={{display: 'block', margin: '20px auto 0'}} alt=""/>
                        </div>
                    </div>
                </Col>
            </Row>
        )
    }
}

export default SiteDashboard;