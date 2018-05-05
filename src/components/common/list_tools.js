/**
 *  模糊查询、高级筛选、只显示收藏 
 * 
 *  需要从属性传入 commonActions、commonState

 *  调用方法：

    <ListTools
        title="维保工单"                                  // 标题
        commonState={commonState}                       // 传入公用state
        commonActions={commonActions}                   // 传入公用actions
        collectionChange                                // 只显示收藏配勾选
        seniorFilter = {{
            data: [
                {
                    type: 'DOMAIN_VALUE',               // 选择类型 -> 域值
                    key: 'workOrderStatusData',         // key 域值的key用作取state数据
                    label: '工单状态',                    // 标题
                    actionsType: 'WORK_ORDER_STATUS',   // 域值actions type
                    actionsParam: 'workOrder',           // 域值actions 参数
                },
                {
                    type: 'SELECT_PERSON',              // 选择类型 -> 人
                    key: 'reportName',
                    label: '提报人',                     // 标题
                },
                {
                    type: 'SELECT_TIME',                // 选择类型 -> 时间
                    key: 'acceptionDate',
                    label: '验收时间',                   // 标题
                },
            ],
            onOk: result => {                          // 确定回调 参数为选择结果
                console.log(result)
            }
        }}
        onEnter={(text) => {                           // 模糊查询 参数为输入的关键字
            this.fuzzyQuery(text);
        }}
    />

 */
import React from 'react';

import { Icon, Checkbox, Modal, Button, DatePicker, Tag } from 'antd';
import moment from 'moment';
const { RangePicker } = DatePicker;

import { filterArrByAttr } from '../../tools/';

import Multiselect from './multiselect.js';
import SearchInp from './search_inp.js';
import DropdownMenu from './dropdown_menu.js';
import SelectPerson from './select_person.js';

class ListTools extends React.Component {
    constructor (props) {
        super(props);
        this.state = {
            modalShow: false,
            selectPersonModalShow: false,
            allPersonSelectedArr: [], // 所有选择人员结果状态
            resultArr: [], // 筛选结果状态
        }

        this.allPersonSelectedArr = []; // 所有选择人员结果
        this.resultArr = []; // 筛选结果
        this.allSelectDateArr = []; // 所有选择日期结果
    }
    // 高级筛选点击
    seniorFilterClick = () => {
        this.setState({ modalShow: true })
        this.dropdownSeniorFilter && this.dropdownSeniorFilter.hide();
    }
    // 高级筛选弹窗隐藏
    modalHide = () => {
        this.setState({ modalShow: false });
    }
    // 选择人员显示
    selectPersonModalShow = (i) => {
        const { seniorFilter } = this.props;
        if (!seniorFilter) return;
        this.curSelectPersonIndex = i; // 当前触发选择人员组件的索引;
        this.setState({ selectPersonModalShow: true });
    }
    // 清除选择人员
    deselectPerson = (record, i) => {
        const { seniorFilter } = this.props;
        if (!seniorFilter) return;
        this.curSelectPersonIndex = i; // 当前触发选择人员组件的索引;
        const { allPersonSelectedArr } = this.state;
        let personSelectedArr = allPersonSelectedArr[this.curSelectPersonIndex];
        personSelectedArr = personSelectedArr.filter((item, i) => {
            return item.personId !== record.personId;
        });
        allPersonSelectedArr[this.curSelectPersonIndex] = personSelectedArr;
        this.setState({ allPersonSelectedArr });
    }
    // 筛选弹窗确认
    confirmFilter = () => {
        const { seniorFilter } = this.props;
        if (!seniorFilter) return;
        let selectedNum = 0;
        seniorFilter.data.forEach((item, i) => {
            if (this[`multiselect${i}`]) { // 多选域值
                this.resultArr[i] = {
                    key: item.type,
                    label: item.label,
                    data: this[`multiselect${i}`].getSelected(),
                }
                
            }
            if (this.state.allPersonSelectedArr[i]) { // 选人
                this.resultArr[i] = {
                    key: item.type,
                    label: item.label,
                    data: this.state.allPersonSelectedArr[i],
                }
            }
            if (this.allSelectDateArr[i]) { // 选时间
                this.resultArr[i] = {
                    key: item.type,
                    label: item.label,
                    data: this.allSelectDateArr[i],
                }
            }
        });

        this.resultArr = this.resultArr.map((item, i) => {
            if (item.key === 'DOMAIN_VALUE' && !item.data.length) {
                return false;
            }
            else if (item.key === 'SELECT_PERSON' && !this.state.allPersonSelectedArr[i].length) {
                return false;
            }
            else if (item.key === 'SELECT_TIME' && JSON.stringify(this.allSelectDateArr[i]) === '["",""]') {
                return false;
            }
            else {
                selectedNum += 1;
                return item;
            }
        })

        if (!selectedNum) this.resultArr = [];

        this.setState({ resultArr: this.resultArr }, () => {
            seniorFilter.onOk(this.state.resultArr);
            this.modalHide();
        });
    }
    clearItem = (type, i) => {
        switch (type) {
            case 'DOMAIN_VALUE':
                this[`multiselect${i}`].clearSelected();
                break;
            case 'SELECT_PERSON':
                this.allPersonSelectedArr = [];
                this.setState({ allPersonSelectedArr: this.allPersonSelectedArr });
                break;
            case 'SELECT_TIME':
                // 重置日期
                break;
        }
    }
    // 清除选择
    clearFilter = () => {
        const { seniorFilter } = this.props;
        const { resultArr } = this.state;

        if (!seniorFilter) return;
        
        resultArr.forEach((item, i) => {
            if (!item) return false;
            this.clearItem(item.key, i);
        })

        this.resultArr = [];
        this.setState({ resultArr: this.resultArr }, () => {
            seniorFilter.onOk(this.state.resultArr);
        });
    }
    // 重置选项
    resetSelected = () => {
        const { seniorFilter } = this.props;
        seniorFilter.data.forEach((item, i) => {
            this.clearItem(item.type, i);
        })
    }
    // 渲染筛选内容
    seniorFilterItemRender = (item, i) => {
        const { commonState } = this.props;
        let itemDOM;

        const allPersonSelectedArr = this.state.allPersonSelectedArr;

        switch (item.type) {
            case 'DOMAIN_VALUE':
                const data = commonState[item.key];
                itemDOM = <Multiselect data={data} ref={select => this[`multiselect${i}`] = select} />
                break;
            case 'SELECT_PERSON':
                itemDOM = (
                    <div>
                        {
                            allPersonSelectedArr[i] && allPersonSelectedArr[i].map((item, j) => {
                                return <Tag key={j}>{item.name} <Icon type="close" onClick={() => { this.deselectPerson(item, i) }} /></Tag>
                            })
                        }
                    </div>
                )
                break;
            case 'SELECT_TIME':
                itemDOM = (
                    <RangePicker
                        format='YYYY-MM-DD'
                        onChange={(a, b) => {
                            this.allSelectDateArr[i] = b;
                        }}
                    />
                )
                break;
        }
        return itemDOM;
    }
    resultRender = (item, i) => {
        let resultDOM;

        const data = item.data;

        switch (item.key) {
            case 'DOMAIN_VALUE':
                resultDOM = (
                    <div key={i} className="item clearfix">
                        <span className="pull-left">{item.label}：</span>
                        <span className="pull-left">
                            {
                                data.map((item, i) => {
                                    return item.description
                                }).join('、')
                            }
                        </span>
                    </div>
                );
                break;
            case 'SELECT_PERSON':
                resultDOM = (
                    <div key={i} className="item clearfix">
                        <span className="pull-left">{item.label}：</span>
                        <span className="pull-left">
                            {
                                data.map((item, i) => {
                                    return item.name
                                }).join('、')
                            }
                        </span>
                    </div>
                );
                break;
            case 'SELECT_TIME':
                resultDOM = (
                    <div key={i} className="item clearfix">
                        <span className="pull-left">{item.label}：</span>
                        <span className="pull-left">
                            {
                                data.join(' > ')
                            }
                        </span>
                    </div>
                );
                break;
        }
    
        return resultDOM;
    }
    componentWillMount () {
        const { commonActions, commonState, seniorFilter, listToolsComponentWillMount } = this.props;
        listToolsComponentWillMount && listToolsComponentWillMount();
        if (!seniorFilter) return;
        const domainValueParam = {
            orgId: commonState.orgId,
            siteId: commonState.siteId,
            prodId: 'EAM'
        }
        // 获取域值
        seniorFilter.data.forEach((item, i) => {
            if (item.actionsType) {
                commonActions.getDomainValue(domainValueParam, item.actionsParam, item.actionsType);
            }
        });
    }
    render() {
        const { seniorFilter, collectionChange } = this.props;
        const { resultArr } = this.state;
        
        //高级筛选当前选项dom
        const seniorFilterHTML = (
            <div className="senior-filter-menu">
                <h2>
                    <span className="pull-right" onClick={this.clearFilter}>
                        <Icon type="delete" />
                        清除条件
                    </span>
                    已选条件
                </h2>
                <div className="senior-filter-inner">
                    {
                        this.state.resultArr.map((item, i) => {
                            return this.resultRender(item, i);
                        })
                    }
                </div>
            </div>
        );

        return (
            <div className="pull-left">
                <h2>{this.props.title}</h2>
                <div className="list-tools">
                    <div className="fuzzy-query">
                        <SearchInp onEnter={(text) => {
                            this.props.onEnter(text)
                        }} />
                    </div>

                    {
                        seniorFilter ?
                        <DropdownMenu
                            overlay={seniorFilterHTML}
                            trigger="hover"
                            ref={dropdownSeniorFilter => this.dropdownSeniorFilter = dropdownSeniorFilter}
                        >
                            <div className={resultArr.length ? 'senior-filter pull-left active' : 'senior-filter pull-left'}>
                                <Icon type="filter" />
                                <span onClick={this.seniorFilterClick}>高级筛选</span>
                            </div>
                        </DropdownMenu> :
                        null
                    }
                    {
                        collectionChange ?
                        <Checkbox
                            onChange={(e) => {
                                let { checked } = e.target;
                                checked = checked === true ? checked : '';
                                collectionChange(checked);
                            }}
                        >
                            只显示收藏
                        </Checkbox> :
                        null
                    }
                </div>
                {
                    seniorFilter ? 
                    <Modal
                        title="高级筛选"
                        visible={this.state.modalShow}
                        width={800}
                        footer={null}
                        onCancel={this.modalHide}
                    >
                        {
                            seniorFilter.data.map((item, i) => {
                                return (
                                    <div key={i} className="senior-filter-item">
                                        <h2>
                                            {item.label}
                                            {item.type === 'SELECT_PERSON' ? <Icon type="plus" onClick={() => {this.selectPersonModalShow(i)}} /> : ''}
                                        </h2>
                                        {this.seniorFilterItemRender(item, i)}
                                    </div>
                                )
                            })
                        }
                        
                        <div className="modal-footer clearfix">
                            <Button size="large" onClick={this.resetSelected}>重置</Button>
                            <Button type="primary" size="large" onClick={this.confirmFilter}>确定</Button>
                        </div>
                    </Modal> :
                    null
                }
                {
                    seniorFilter ?
                    <SelectPerson
                        visible={this.state.selectPersonModalShow}
                        selectPersonModalHide={() => { this.setState({selectPersonModalShow: false}) }}
                        multiple
                        onOk={(selectedArr) => {
                            this.allPersonSelectedArr[this.curSelectPersonIndex] = selectedArr;
                            this.setState({ allPersonSelectedArr: this.allPersonSelectedArr })
                        }}
                        setSelected={() => (this.state.allPersonSelectedArr[this.curSelectPersonIndex] || [])}
                    /> :
                    null
                }
                
            </div>
        );
    }
}

export default ListTools;