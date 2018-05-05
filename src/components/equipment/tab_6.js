/** 
 * @Description 关联测点
 */
import React from 'react';
import { bindActionCreators } from 'redux';
import { Link } from 'react-router';
import { connect } from 'react-redux';
import actions from '../../actions/equipment.js';
import commonActions from '../../actions/common';

import { filterArrByAttr , runActionsMethod } from '../../tools';
import Dropdown from '../../components/common/dropdown.js';
import NumInp from '../../components/common/num_inp.js';
import MyModal from '../../components/common/modal.js';
import { createForm } from 'rc-form';
import moment from 'moment';

import ReactEcharts from 'echarts-for-react';

import { Icon, Button, Table, Pagination, Collapse, Modal, Tabs, Form, Input, Row, Col, Select, DatePicker, Menu, Timeline } from 'antd';
const Panel = Collapse.Panel;
const FormItem = Form.Item;
const TabPane = Tabs.TabPane;
const Option = Select.Option;
const confirm = Modal.confirm;
const { MonthPicker, YearPicker } = DatePicker;

// 测点新建表单
class MeterFormComponent extends React.Component {
    constructor(props) {
        super(props);
        this.formItemLayout = {
            labelCol: {
                xs: { span: 24 },
                sm: { span: 6 },
            },
            wrapperCol: {
                xs: { span: 24 },
                sm: { span: 14 },
            },
        };
    }
    render() {
        const { form, data } = this.props;
        const { getFieldDecorator } = form;

        return (
            <Form>
                <FormItem
                    {...this.formItemLayout}
                    label="测点名称"
                >
                    {
                        getFieldDecorator('name', {
                            initialValue: data ? data.name : '',
                            rules: [{ required: true, message: '文本不能为空' }],
                        })(
                            <Input style={{ width: '100%' }} />
                            )
                    }
                </FormItem>
                <FormItem
                    {...this.formItemLayout}
                    label="测点编码"
                >
                    {
                        getFieldDecorator('code', {
                            initialValue: data ? data.code : '',
                            rules: [{ required: true, message: '文本不能为空' }],
                        })(
                            <Input style={{ width: '100%' }} />
                            )
                    }
                </FormItem>
                <FormItem
                    {...this.formItemLayout}
                    label="测点描述"
                >
                    {
                        getFieldDecorator('description', {
                            initialValue: data ? data.description : '',
                            rules: [{ required: true, message: '文本不能为空' }],
                        })(
                            <Input style={{ width: '100%' }} />
                            )
                    }
                </FormItem>
            </Form>
        )
    }
}
const MeterForm = Form.create()(MeterFormComponent);
//测量点信息
class DateFormComponent extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            currentPage: 1,
        }
    }

    render() {
        const { getFieldDecorator } = this.props.form;
        const { data, commonState } = this.props;

        return (
            <Form layout="horizontal">
                <Row gutter={16} justify="start">
                    <Col className="gutter-row meter-point" xs={{ span: 9 }}>
                        <FormItem
                            label="开始时间"
                        >
                            {
                                getFieldDecorator('bt')(
                                    <DatePicker
                                        showTime
                                        format="YYYY-MM-DD"
                                        placeholder="Select Time"
                                        onChange={(onChange) => { }}
                                        onOk={(value) => { }}
                                    />
                                )
                            }
                        </FormItem>
                    </Col>
                    <Col className="gutter-row meter-point" xs={{ span: 9 }}>
                        <FormItem
                            label="结束时间"
                        >
                            {
                                getFieldDecorator('et')(
                                    <DatePicker
                                        showTime
                                        format="YYYY-MM-DD"
                                        placeholder="Select Time"
                                        onChange={(onChange) => { }}
                                        onOk={(value) => { }}
                                    />
                                )
                            }
                        </FormItem>
                    </Col>
                </Row>
            </Form>
        )
    }
}
const NewDateFormComponent = createForm()(DateFormComponent);

class WorkOrderTwoComponent extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            metersLoading: false,
            modalShow: false,
            currentPage: 1,
            meterEditData: '',
            assetId: '',
            what: '',
            etype: 'bar',
            type: 'primary',
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
        // 测量点表格字段
        this.metersColumns = [
            {
                title: '测点名称',
                dataIndex: 'name',
                key: 'name',
                render: defaultRender
            },
            {
                title: '测量结果',
                dataIndex: 'pointValue',
                key: 'pointValue',
                render: defaultRender
            },
            {
                title: '上限值',
                dataIndex: 'qualityStandard',
                key: 'qualityStandard',
                render: defaultRender
            },
            {
                title: '下限值',
                dataIndex: 'durat',
                key: 'durat',
                render: defaultRender
            },
            {
                title: '状态',
                dataIndex: 'ration',
                key: 'ration',
                render: defaultRender
            },
            {
                title: '测量时间',
                dataIndex: 'time',
                key: 'time',
                render: defaultRender
            },
            {
                title: '',
                dataIndex: '4',
                key: '4',
                width: 120,
                render: (text, record, key) => {
                    return (
                        <div className="table-icon-group">
                        <Link type="edit"
                            onClick={() => {
                                this.meterDetail(record);
                            }}
                        >详细信息</Link>
                        </div>
                    )
                }
            },
        ];

        //详细信息列表
        this.meterDetailColumns = [
            {
                title: '更新时间',
                dataIndex: 'timestamp',
                key: 'timestamp',
                sorter: true,
                render: (text, record, key) => {
                    return (
                        <p>{moment(new Date(parseInt(text))).format("YYYY-MM-DD HH:mm:ss")}</p>
                    )
                }
            },
            {
                title: '检测值',
                dataIndex: 'value',
                key: 'value',
                render: defaultRender
            },
            {
                title: '状态',
                dataIndex: 'qualityStandard',
                key: 'qualityStandard',
                render: defaultRender
            },
            {
                title: '工单编码',
                dataIndex: 'duration',
                key: 'duration',
                render: defaultRender
            },
            {
                title: '工单状态',
                dataIndex: 'duratio',
                key: 'duratio',
                render: defaultRender
            },
        ];

        const { location } = this.props;

        const isAdd = location.query.add_asset;
        this.asset = localStorage.getItem('asset');
        this.taskParam = {
            id: isAdd ? '' : (this.asset && JSON.parse(this.asset).id),
            pageNum: 1,
            pageSize: 10,
        }
    }
    // 分页事件
    pageChange = (page, pageSize) => {
        this.setState({ currentPage: page });
        this.param.pageNum = page; //*** 需要修改参数 在方法内单独修改
        this.getList();
    }
    //获取关联测点信息
    getMeterList = () => {
        const { actions } = this.props;
        this.setState({
            metersLoading: true,
        });
        if (this.taskParam.id) {
            let param = {
                assetId : this.taskParam.id,
            }
            actions.meterGetList(param, () => {
                this.setState({
                    metersLoading: false,
                });
            });
        } else {
            this.setState({
                metersLoading: false,
            });
        }
    }
    // 新建测点弹框
    meterAdd = () => {
        this.setState({ meterEditData: '' });
        this.meterAddModal.modalShow();
    }
    // 保存新建/编辑 meter步骤
    meterAddSave = () => {
        let { actions, commonState } = this.props;
        let editJson = this.state.meterEditData;
        let assetId = JSON.parse(localStorage.getItem('asset')).id;
        this.meterAddForm.validateFields((err, values) => {
            values.orgId = commonState.orgId;
            values.siteId = commonState.siteId;
            values.assetId = assetId;
            if (err) return;
            values.id = editJson.id;
            actions.meterAdd(values, (data) => {
                if (data.success) {
                    this.getMeterList();
                }
            });
        });
        this.meterAddModal.modalHide();
    }
    meterDetail = (record) => {
        console.log(111);
        this.setState({
            what: record.what,
            tagid: record.id,
        })
        this.detailModal.modalShow();
    }

    //表格多选
   rowSelection = {
        onChange: (selectedRowKeys, selectedRows) => {
            this.setState({ selectedRows : selectedRows });
        },
        onSelect: (record, selected, selectedRows) => {
        },
        onSelectAll: (selected, selectedRows, changeRows) => {
        },
    };

    metersAfterClose = () => {
        this.meterAddForm.resetFields();
    }
    // 删除关联测点
    meterDel = () => {
        const { actions } = this.props;
        const selectedRows = this.state.selectedRows;
        const taskParam = {
            ids: [filterArrByAttr(selectedRows,'id').join(',')]
        }
        runActionsMethod(actions, 'metersDel', taskParam);
        this.getMeterList();
    }
    componentWillMount () {
        this.getMeterList();
    }
    //日视图
    dayChange = (value) => {
        const { actions, state, commonState } = this.props;
        let time1 = moment(value._d).format('YYYY-MM-DD');
        let time = Date.parse(new Date(time1));
        const et = '1496869947875';
        const bt = '1496783547875';
        const tagid = 'pt1001';
        const site = 'value_site';
        const param = {
            tagid,
            site,
            bt,
            et,
        }
        actions.pointGetList(param, (json) => {
        });
    }
    //月视图
    monthChange = (value) => {
        const { actions, state, commonState } = this.props;
        let time1 = moment(value._d).format('YYYY-MM');
        let time = Date.parse(new Date(time1));
        const et = '1496869947875';
        const bt = '1496783547875';
        const tagid = 'pt1001';
        const site = 'value_site';
        const param = {
            tagid,
            site,
            bt,
            et,
        }
        actions.pointGetList(param, (json) => {
        });
    }
    //年视图
    yearChange = (value) => {
        const { actions, state, commonState } = this.props;
        let time1 = moment(value._d).format('YYYY');
        let time = Date.parse(new Date(time1));
        const et = '1496869947875';
        const bt = '1496783547875';
        const tagid = 'pt1001';
        const site = 'value_site';
        const param = {
            tagid,
            site,
            bt,
            et,
        }
        actions.pointGetList(param, (json) => {
        });
    }
    getPoint = () => {
        const { actions, state, commonState } = this.props;

        this.DateForm.props.form.validateFields((err, values) => {
            const bt1 = moment(values['bt']).format('YYYY-MM-DD HH:mm:ss');
            const et1 = moment(values['et']).format('YYYY-MM-DD HH:mm:ss');
            // const bt = Date.parse(new Date(bt1));
            // const et = Date.parse(new Date(et1));
            const et = '1496869947875';
            const bt = '1496783547875';
            const tagid = 'pt1001';
            const site = 'value_site';
            const param = {
                tagid,
                site,
                bt,
                et,
                paging: { "page": 1, "per": "998" },
            }
            actions.pointGetList(param, (json) => {
            });
        })
    }

    //bar line sline的转换
    BarChange = () => {
        this.setState({
            etype: 'bar',
            type: 'primary',
            lineType: '',
            SLineType: '',
        });
    }

    LineChange = () => {
        this.setState({
            etype: 'line',
            lineType: 'primary',
            type: '',
            SLineType: '',
        });
    }

    SLineChange = () => {
        this.setState({
            etype: 'sline',
            SLineType: 'primary',
            type: '',
            lineType: '',
        });
    }
    //测量图表配置项
    getOption = (datas) => {
        let param = {
            emunit: '',
            infoConfig: '',
            dataList: [],
            text: '',
            seriesname: ''
        }
        let xData = [];
        let yData = [];
        if (datas) {
            let timestamp = datas && datas.map((item) => {
                let timestamp = moment(new Date(parseInt(item.timestamp))).format("YYYY-MM-DD HH:mm:ss").substr(11);
                xData.push(timestamp);
                yData.push(item.value);
            })
        }

        if (this.state.what == "temperature") {
            param = {
                emunit: "℃",
                infoConfig: "温度配置",
                dataList: ['最高温度', '最低温度'],
                text: '温度传输日志',
                seriesname: '气温'
            }

        } else if (this.state.what == "battery") {
            param = {
                emunit: "%",
                infoConfig: "电量配置",
                dataList: ['最大电量', '最小电量'],
                text: '电量传输日志',
                seriesname: '电量'
            }
        } else if (this.state.what == "light") {
            param = {
                emunit: "Lx",
                infoConfig: "光照度配置",
                dataList: ['最强光照', '最弱光照'],
                text: '光照传输日志',
                seriesname: '光照'
            }

        } else if (this.state.what == "humidity") {
            param = {
                emunit: "RH",
                infoConfig: "湿度配置",
                dataList: ['最大湿度', '最小湿度'],
                text: '湿度传输日志',
                seriesname: '湿度'
            }
        }

        const option = {
            tooltip: {
                trigger: 'axis'
            },
            title: {
                x: 13,
                top: 20,
                text: param.text,
                textStyle: {
                    fontFamily: '"FZLanTing","Microsoft YaHei","helvetica","simsun"',
                    fontSize: 18,
                    fontWeight: 'bold',
                    color: '#000'
                }
            },
            color: ['#34A3EC'],
            legend: {
            },
            calculable: true,
            toolbox: {
                show: false,
            },
            calculable: true,
            grid: {
                left: '3%',
                right: '4%',
                containLabel: true
            },
            xAxis: {
                type: 'category',
                axisLabel: {
                    //interval: '$scope.step',
                    rotate: 0
                },
                axisLine: {
                    lineStyle: {
                        width: 2
                    }
                },
                splitLine: {//终于找到了，背景图的内置表格中“边框”的颜色线条  这个是x跟y轴轴的线
                    show: true,
                    lineStyle: {
                        color: "#E2E2E2",
                        type: "solid",
                        width: 2
                    }
                },
                data: xData,
            },
            yAxis: {
                lineWidth: 3,
                type: 'value',
                axisLabel: {
                    formatter: '{value} ' + param.emunit
                },
                axisLine: {
                    lineStyle: {
                        width: 2
                    }
                },
                splitLine: {//终于找到了，背景图的内置表格中“边框”的颜色线条  这个是x跟y轴轴的线
                    show: false
                },
            },
            dataZoom: [
                {
                    show: true,
                    start: 94,
                    end: 100
                },
                {
                    type: 'inside',
                    start: 94,
                    end: 100
                },
                {
                    show: false,
                    yAxisIndex: 0,
                    filterMode: 'empty',
                    width: 30,
                    height: '80%',
                    showDataShadow: false,
                    left: '93%'
                }
            ],
        };
        if (this.state.etype == 'bar') {
            option.series = [
                {
                    name: param.seriesname,
                    type: 'bar',
                    data: yData,
                    barWidth: 10,
                    markPoint: {
                        data: [
                            { type: 'max', name: '最大值' },
                            { type: 'min', name: '最小值' }
                        ]
                    },
                    markLine: {
                        data: [
                            { type: 'average', name: '平均值' }
                        ]
                    }
                }
            ];
        } else if (this.state.etype == 'line') {
            option.xAxis.boundaryGap = false;
            /* boundaryGap : false,*/
            option.series = [
                {
                    name: param.seriesname,
                    type: 'line',
                    data: yData,
                    markPoint: {
                        data: [
                            { type: 'max', name: '最大值' },
                            { type: 'min', name: '最小值' }
                        ]
                    },
                    markLine: {
                        data: [
                            { type: 'average', name: '平均值' }
                        ]
                    }
                }
            ];
        } else if (this.state.etype == 'sline') {
            option.xAxis.boundaryGap = false;
            option.series = [
                {
                    name: param.seriesname,
                    type: 'line',
                    data: yData,
                    areaStyle: { normal: {} },
                    markPoint: {
                        data: [
                            { type: 'max', name: '最大值' },
                            { type: 'min', name: '最小值' }
                        ],
                        label: {
                            normal: {
                                show: true,
                                formatter: '{b}: {c}'
                            }
                        }
                    },
                    markLine: {
                        data: [
                            { type: 'average', name: '平均值' }
                        ]
                    }
                }
            ];
        }
        return option;
    }
    render () {
        const { state, location, commonState } = this.props;

        const meterListData = state.meterListData;
        const list = meterListData.list;

        const pointList = state.pointListData;
        const datas = pointList.datas;

        const isAdd = location.query.add_asset;
        const assetId = isAdd ? '' : (this.asset && JSON.parse(this.asset).id);

        return (
            <div className="eam-tab-page">
                <div className="eam-content">
                    <Collapse bordered={false} defaultActiveKey={['1']}>
                        <Panel header={<span className="label">相关测点 <Icon type="caret-down" /></span>} key="1" style={this.customPanelStyle}>
                            <Table
                                rowKey="id"
                                loading={this.state.metersLoading}
                                pagination={{
                                    showTotal: (total, range) => `当前第${range[0]}-${range[1]}条 / 共${total}条`,
                                    defaultPageSize: 5,
                                }}
                                dataSource={list}
                                columns={this.metersColumns}
                                rowSelection={this.rowSelection}
                                bordered
                            />
                            {assetId ?
                                <div className="panel-tools-right">
                                    <Button type="primary" size="large" onClick={this.meterAdd}>新建</Button>
                                    <Button type="primary" size="large" onClick={this.meterDel}>删除</Button>
                                </div>
                            :
                               ''
                            }
                        </Panel>
                    </Collapse>
                </div>
                <MyModal
                    title='详细信息'
                    ref={detailModal => this.detailModal = detailModal}
                    width={1200}
                >
                    <Tabs defaultActiveKey="1">
                        <TabPane tab="测点数据查询" key="1">
                            <div>
                                <div className="top-bar clearfix">
                                    <div className="list-tools-left pull-left">
                                        <NewDateFormComponent wrappedComponentRef={DateForm => this.DateForm = DateForm} />
                                    </div>
                                    <div className="list-tools-right pull-right" >
                                        <Button type="primary" size="large" onClick={this.getPoint}>运行</Button>
                                    </div>
                                </div>
                                <div className="eam-content">
                                    <Table
                                        rowKey="id"
                                        className="point-echarts"
                                        pagination={false}
                                        dataSource={datas}
                                        columns={this.meterDetailColumns}
                                        scroll={{ y: 240 }}
                                    />
                                </div>
                            </div>
                        </TabPane>
                        <TabPane tab="测点数据图表" key="2">
                            <div>
                                <div className="top-bar clearfix">
                                    <div className="list-tools-left pull-left">
                                        <DatePicker
                                            showTime
                                            format="YYYY-MM-DD"
                                            placeholder="日视图"
                                            onChange={(value) => {
                                            }}
                                            onOk={(value) => {
                                                this.dayChange(value)
                                            }}
                                        />
                                        <MonthPicker
                                            showTime
                                            format="YYYY-MM"
                                            placeholder="月视图"
                                            onChange={(value) => {
                                                this.monthChange(value)
                                            }}
                                            onOk={(value) => {

                                            }}
                                        />
                                        <DatePicker
                                            showTime
                                            format="YYYY"
                                            placeholder="年视图"
                                            onChange={(onChange) => { }}
                                            onOk={(value) => {
                                                this.yearChange(value)
                                            }}
                                        />
                                    </div>
                                    <div className="list-tools-right pull-right">
                                        <Button type="primary" size="large" >下载图表</Button>
                                        <Button size="small" onClick={this.BarChange} type={this.state.type}>bar</Button>
                                        <Button size="small" onClick={this.LineChange} type={this.state.lineType}>line</Button>
                                        <Button size="small" onClick={this.SLineChange} type={this.state.SLineType}>sline</Button>
                                    </div>
                                </div>
                                <div className="eam-content">
                                    <ReactEcharts
                                        option={this.getOption(datas)}
                                        notMerge={true}
                                        lazyUpdate={true}
                                        theme={"theme_name"}
                                    />
                                </div>
                            </div>
                        </TabPane>
                    </Tabs>
                </MyModal>
                <MyModal
                    title={`${this.state.meterEditData ? '编辑' : '新建'}关联测点`}
                    ref={meterAddModal => this.meterAddModal = meterAddModal}
                    onOk={this.metersAddSave}
                    afterClose={this.metersAfterClose}
                >
                    <MeterForm data={this.state.meterEditData} ref={meterAddForm => this.meterAddForm = meterAddForm} />
                    <div className="modal-footer clearfix">
                        <Button type="primary" size="large" onClick={this.meterAddSave}>确定</Button>
                        <Button size="large" onClick={() => { this.meterAddModal.modalHide() }}>取消</Button>
                    </div>
                </MyModal>
            </div>
        )
    }
}


function mapStateToProps (state) {
    return {
        state: state.equipment,
        commonState: state.common
    }
}

function buildActionDispatcher(dispatch) {
    return {
        actions: bindActionCreators(actions, dispatch),
        commonActions: bindActionCreators(commonActions, dispatch),
    }
}

export default connect(mapStateToProps, buildActionDispatcher)(WorkOrderTwoComponent);
