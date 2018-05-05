/**
 * Dashboard-总部（org） 
 */
import React from 'react';
import { Row, Col, Table, Icon } from 'antd';

import ReactEchartsCore from 'echarts-for-react/lib/core';
import echarts from 'echarts/lib/echarts';
import 'echarts/lib/chart/pie';
import 'echarts/lib/component/tooltip';
import 'echarts/lib/component/legend';

import enerbosLogo from '../../../images/enerbos.jpg';
import eisLogo from '../../../images/eis_logo.png';
import emsLogo from '../../../images/ems_logo.png';
import adcLogo from '../../../images/adc_logo_active.png';
import titleLogo from '../../../images/dashboard_tit_icon.png';
import sun from '../../../images/sun.png';

const columns = [{
  title: '项目',
  dataIndex: 'a',
  key: 'a',
}, {
  title: '及时率',
  dataIndex: 'b',
  key: 'b',
}, {
  title: '总数',
  dataIndex: 'c',
  key: 'c',
}, {
  title: '工单耗时',
  dataIndex: 'd',
  key: 'd',
}, {
  title: '响应耗时',
  dataIndex: 'e',
  key: 'e',
},{
  title: '用户',
  dataIndex: 'f',
  key: 'f',
}, /*{
  title: '效率比',
  dataIndex: 'action2',
  key: 'action2',
  render: (text, record) => {
    return record.action2 === '10%' ? <span className="green">{text}</span> : <span className="red">{text}</span>
  }
}*/];

const columns2 = [{
  title: '项目',
  dataIndex: 'a',
  key: 'a',
}, {
  title: '及时率',
  dataIndex: 'b',
  key: 'b',
}, {
  title: '总数',
  dataIndex: 'c',
  key: 'c',
}, {
  title: '工单耗时',
  dataIndex: 'd',
  key: 'd',
}, {
  title: '分派耗时',
  dataIndex: 'e',
  key: 'e',
},{
  title: '用户',
  dataIndex: 'f',
  key: 'f',
}];

const data = [
    {
        key: '1',
        a: '中国馆',
        b: '95%',
        c: 1000,
        d: 70,
        e: 90,
        f: '10%',
    },
    {
        key: '2',
        a: '科博馆',
        b: '95%',
        c: 1000,
        d: 70,
        e: 90,
        f: '10%',
    },
    {
        key: '3',
        a: '区政府',
        b: '95%',
        c: 1000,
        d: 70,
        e: 90,
        f: '10%',
    },
    {
        key: '4',
        a: '深圳会展中心',
        b: '95%',
        c: 1000,
        d: 70,
        e: 90,
        f: '10%',
    },
  
];

class OrgDashboard extends React.Component {
    constructor (props) {
        super(props);

        this.pieOpt = {
            tooltip : {
                trigger: 'item',
                formatter: "{a} <br/>{b} : {c} ({d}%)"
            },
            legend: {
                bottom: 30,
                left: 'center',
                data: ['报修工单','巡检工单','保养工单','维修工单','派工工单','环境监测工单']
            },
            series : [
                {
                    type: 'pie',
                    radius : '55%',
                    center: ['50%', '40%'],
                    selectedMode: 'single',
                    data:[
                
                        {value:510, name: '报修工单'},
                        {value:634, name: '巡检工单'},
                        {value:735, name: '保养工单'},
                        {value:535, name: '维修工单'},
                        {value:510, name: '派工工单'},
                        {value:634, name: '环境监测工单'},
                    ],
                    itemStyle: {
                        emphasis: {
                            shadowBlur: 10,
                            shadowOffsetX: 0,
                            shadowColor: 'rgba(0, 0, 0, 0.5)'
                        }
                    }
                }
            ]
        };
    }

    getDataStatistics = () => {
        const { actions, commonState } = this.props;
        const param = {
            orgId: commonState.orgId
        }
        actions.getDataStatistics(param);
    }
    getOrgPieData = () => {
        const { actions, commonState } = this.props;
        const param = {
            orgId: commonState.orgId,
            startDate: '2017-01-01',
            endDate: '2017-02-01',
        }
        actions.getOrgPieData(param);
    }
    componentDidMount () {
        this.getDataStatistics();
        this.getOrgPieData();
    }
    render () {

        const { state } = this.props;

        return (
            <Row gutter={16}>
                <Col className="gutter-row" span={7}>
                    <div className="gutter-box">
                        <div className="eam-card">
                            <div className="site_info">
                                <img src={enerbosLogo} alt=""/>
                                <p className="company-name">北京翼虎能源科技有限公司</p>
                                <p className="address">北京市朝阳区安慧里三区6号楼辰润大厦2层</p>
                                <p className="website"><a target="_black" style={{color: 'inherit'}} href="http://www.enerbos.cn/">www.enerbos.cn</a></p>
                            </div>
                            <div className="totals">
                                <div>
                                    <h3>10</h3>
                                    <h4>管理项目</h4>
                                </div>
                                <div>
                                    <h3>4</h3>
                                    <h4>运行项目</h4>
                                </div>
                                <div>
                                    <h3>20</h3>
                                    <h4>总用户数</h4>
                                </div>
                            </div>
                        </div>
                        {/*<div className="eam-card" style={{height: 118}}>
                            <ul className="product-list">
                                <li>
                                    <img src={eisLogo} />
                                </li>
                                <li>
                                    <img src={emsLogo} />
                                </li>
                                <li>
                                    <img src={adcLogo} />
                                </li>
                            </ul>  
                        </div>
                        <div className="eam-card" style={{height: 192}}>
                            <div className="weather">
                                <ul>
                                    <li className="pull-left">
                                        <span className="temp">-5℃</span>
                                        <span className="temp_temp">-5℃-3℃</span>
                                    </li>
                                    <li className="pull-right">
                                        <span>晴</span>
                                        <span className="humidity">湿度：25%</span>
                                    </li>
                                    <li className="pull-right"><img src={sun} alt=""/></li>
                                </ul>
                                <dl>
                                    <dt>鸿祥大厦6层</dt>
                                    <dd>空气质量：36（优）</dd>
                                    <dd>室内湿度：60%</dd>
                                    <dd>室内温度：20℃</dd>
                                    <dd>室内照度：300lux</dd>
                                </dl>
                            </div>
                        </div>*/}
                        <div className="eam-card">
                            <h2>
                                <Icon className="pull-right" type="ellipsis" />
                                维保完成及时率
                            </h2>
                            <Table
                                size="small"
                                columns={columns2}
                                dataSource={data}
                                pagination={false}
                            />
                        </div>
                    </div>
                </Col>
                <Col className="gutter-row" span={10}>
                    <div className="gutter-box">
                        <div className="eam-card">
                            <h2>
                                <Icon className="pull-right" type="calendar" />
                                <img src={titleLogo} style={{float: 'left', margin: '17px 12px 0 0'}} alt=""/>
                                本月数据统计
                            </h2>
                            <div className="this-month">
                                {
                                    /*state.dataStatisticsList.map((item, i) => (
                                        <dl key={i}>
                                            <dt>{item.maxTotal}</dt>
                                            <dd>{item.orderName}</dd>
                                        </dl>
                                    ))*/
                                }
                                <dl>
                                    <dt>3</dt>
                                    <dd>最大外委维修工单</dd>
                                </dl>
                                <dl>
                                    <dt>4</dt>
                                    <dd>最大内部保养工单</dd>
                                </dl>
                                <dl>
                                    <dt>5</dt>
                                    <dd>最大外委保养工单</dd>
                                </dl>
                                <dl>
                                    <dt>6</dt>
                                    <dd>最大内部维修工单</dd>
                                </dl>
                                <dl>
                                    <dt>7</dt>
                                    <dd>最大报修工单数</dd>
                                </dl>
                                <dl>
                                    <dt>8</dt>
                                    <dd>最大派工工单数</dd>
                                </dl>
                                <dl>
                                    <dt>9</dt>
                                    <dd>最大巡检工单数</dd>
                                </dl>
                                <dl>
                                    <dt>10</dt>
                                    <dd>最高平均维修完成耗时</dd>
                                </dl>
                                <dl>
                                    <dt>11</dt>
                                    <dd>最高平均报修完成耗时</dd>
                                </dl>
                                <dl>
                                    <dt>12</dt>
                                    <dd>最高报修响应平均耗时</dd>
                                </dl>
                                <dl>
                                    <dt>13</dt>
                                    <dd>最高维修分派平均耗时</dd>
                                </dl>
                            </div>
                        </div>
                        <div className="eam-card" style={{overflow: 'hidden'}}>
                            <h2>
                                智能工单数量占比
                            </h2>
                            <ReactEchartsCore
                                echarts={echarts}
                                option={this.pieOpt}
                                notMerge={true}
                                lazyUpdate={true}
                                // theme={"theme_name"}
                                // onChartReady={this.onChartReadyCallback}
                                // onEvents={EventsDict}
                            />
                        </div>
                    </div>
                </Col>
                <Col className="gutter-row" span={7}>
                    <div className="gutter-box">
                        <div className="eam-card">
                            <h2>
                                <Icon className="pull-right" type="ellipsis" />
                                报修响应及时率
                            </h2>
                            <Table
                                size="small"
                                columns={columns}
                                dataSource={data}
                                pagination={false}
                            />
                        </div>
                    </div>
                </Col>
            </Row>
        )
    }
}

export default OrgDashboard;