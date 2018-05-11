/**
 * app 主容器组件 
 */
import React from 'react';
import ReactDOM from 'react-dom';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { browserHistory, Link } from 'react-router';

import { addLocaleData, IntlProvider } from 'react-intl';
import cnLocale from '../locale/zh-CN';
import twLocale from '../locale/zh-TW';
import enLocale from '../locale/en-US.js';
import enUS from 'antd/lib/locale-provider/en_US';
import zhTW from 'antd/lib/locale-provider/zh_TW';

import actions from '../actions/common.js';

import { LocaleProvider, Layout, Menu, Icon, BackTop, message } from 'antd';
const { SubMenu } = Menu;
const { Content, Sider } = Layout;

import { getClass, getCss } from '../tools/';

import moment from 'moment';
import 'moment/locale/zh-cn';
moment.locale('zh-cn');

import Head from './common/header.js';

message.config({ //message 全局配置
    duration: 5,
});

class App extends React.Component {
    constructor (props) {
        super(props);

        let appLocale, antdLocale;
        let lang = this.props.location.query.lang;

        lang = lang ? lang.toLowerCase() : '';
        switch (lang) {
            case 'zh_cn':
                appLocale = cnLocale;
                antdLocale = null;
                break;
            case 'zh_tw':
                appLocale = twLocale;
                antdLocale = zhTW;
                break;
            case 'en_us':
                appLocale = enLocale;
                antdLocale = enUS;
                break;
            default:
                appLocale = cnLocale;
                antdLocale = null;
        }
        addLocaleData(appLocale.data);

        this.state = {
            appLocale,
            antdLocale,
            scrollDom: null,
            openKeys: ['dashboard'],
            selectedKeys: 'home',
        }

        this.barTimer = null;
    }
    // 菜单点击
    menuClick = (e) => {
        this.setState({ selectedKeys: e.key });
    }
    siteNameClick = (e) => {
        e.nativeEvent.stopImmediatePropagation();
        let siteTabShow = this.state.siteTabShow ? false : true;
        this.setState({ siteTabShow });
    }
    subMenuClick = (e) => {
        let target = e.domEvent.target;
        if (target.className === 'ant-menu-submenu-title') {
            target = target.children[0];
        }

        setTimeout(() => {
            if (this.state.openKeys.length) {
                const defaultLink = target.getAttribute('data-defaultLink');
                browserHistory.push(defaultLink);
                this.setState({
                    selectedKeys: defaultLink.split('/')[2]
                })
            }
        },0)
    }
    menuOpenChange = (openKeys, b) => {
        const state = this.state;
        const latestOpenKey = openKeys.find(key => !(state.openKeys.indexOf(key) > -1));
        let nextOpenKeys = [];
        if (latestOpenKey) nextOpenKeys = [latestOpenKey]
        this.setState({ openKeys: nextOpenKeys }, () => {
            setTimeout(this.resetBarPosition, 500);
        });
    }

    // 侧边菜单滚轮事件
    wheelHandler = (ev) => {
        if (!this.isScroll) return false;
        let e = ev || event;
        let bDown = null;
        let t = parseInt(getCss(this.scrollBar, 'top')) || 0;

        this.scrollWrap.style.display = 'block';
        clearTimeout(this.barTimer);
        this.hideScrollBar();

        if (e.wheelDelta) {
            bDown = e.wheelDelta < 0 ? true : false;
        } else {
            bDown = e.detail > 0 ? true : false;
        }

        if (bDown) {
            this.setTop(t + 6);
        } else {
            this.setTop(t - 6);
        }

        e.preventDefault && e.preventDefault();
        return false;
    }
    // 设置菜单Top值
    setTop = (t) => {
        if (t < 0) {
            t = 0;
        } else if (t > this.scrollMax) {
            t = this.scrollMax;
        }

        const tScale = t / this.scrollMax;
        this.scrollBar.style.top = t + 'px'; //其他地方需要bar的offsetTop 所以没用css3

        const listBoxTranslateY = this.isScroll ? `translateY(${this.listMax * tScale + 'px'})` : 'translateY(0px)';
        this.listBox.style.webkitTransform = listBoxTranslateY;
        this.listBox.style.MozTransform = listBoxTranslateY;
        this.listBox.style.msTransform = listBoxTranslateY;
        this.listBox.style.OTransform = listBoxTranslateY;
        this.listBox.style.transform = listBoxTranslateY;
    }
    // 控制滚动范围、计算滚动条手柄高度
    setScrollBarValues = () => {
        let that = this;
        that.listWarpH = that.listWarp.offsetHeight;
        that.scrollWrapH  = that.scrollWrap.offsetHeight || that.listWarpH;
        that.listBoxH = that.listBox.offsetHeight;
        that.hScale = that.listWarpH / that.listBoxH;
        that.scrollBarH = that.hScale * that.scrollWrapH;
        that.scrollMax = that.scrollWrapH - that.scrollBarH;
        that.listMax = that.listWarpH - that.listBoxH;
        
        if (that.hScale < 1) {
            this.isScroll = true;
            that.scrollBar.style.height = that.scrollBarH + 'px';
        } else {
            this.isScroll = false;
        }
    }
    // 重置滚动范围、滚动条高度
    resetBarPosition = () => {
        if (this.isMac) return;
        this.setScrollBarValues();
        this.setTop(parseInt(getCss(this.scrollBar, 'top')) || 0);
    }
    hideScrollBar = () => {
        let that = this;
        that.barTimer = setTimeout(() => {
            that.scrollWrap.style.display = 'none';
            that.scrollBar.style.width = '8px';
            that.scrollWrap.style.backgroundColor = 'rgba(255, 255, 255, 0)';
            that.scrollWrap.style.borderLeft = '0 none';
        }, 600);
    }
    scrollBarInit = () => {
        let that = this;
        that.sideMenu = getClass(document, 'ant-layout-sider')[0];
        that.scrollWrap = document.createElement('div');
        that.scrollWrap.className = 'scroll-bar';
        that.scrollWrap.innerHTML = '<span></span>';
        that.scrollWrap.style.display = 'none';
        that.sideMenu.appendChild(that.scrollWrap);

        that.scrollBar = that.scrollWrap.children[0];
        that.listWarp = that.scrollWrap.parentNode;
        that.listBox = that.listWarp.children[0];

        this.setScrollBarValues();

        that.scrollBar.onmousedown = function (e) {
            var e = e || event;
            var disY = e.clientY - this.offsetTop;
            clearTimeout(that.barTimer);
            document.onmousemove = function (e) {
                var e = e || event;
                var t = e.clientY - disY;
                clearTimeout(that.barTimer);
                that.setTop(t);
            }
            document.onmouseup = function () {
                document.onmousemove = document.onmouseup = null;
                that.hideScrollBar();
            }

            return false;
        }
        that.scrollWrap.onmouseenter = function () {
            clearTimeout(that.barTimer);
            that.hideScrollBar();
            that.scrollBar.style.width = '12px';
            this.style.backgroundColor = 'rgba(255, 255, 255, .8)';
            this.style.borderLeft = '1px solid #e9e9e9';
        }

        if(this.listWarp.addEventListener){
            this.listWarp.addEventListener('DOMMouseScroll', this.wheelHandler, false);
        }
        this.listWarp.onmousewheel = this.wheelHandler;
    }
    componentWillMount () {
        const { location, actions } = this.props;
        const pathname = location.pathname;
        if (pathname === '/sign_in') return;

        const findCurMenu = pathname.split('/');

        const openKeys = [findCurMenu[1]];
        const selectedKeys = findCurMenu[2];

        this.setState({
            openKeys,
            selectedKeys
        })

       /* const uInfos = JSON.parse(localStorage.getItem('uInfos'));

        uInfos.orgs.forEach((item, i) => {
            if (item.id === uInfos.defaultOrg) {
                item.default = true;
                uInfos.defaultOrgName = item.name;
            } else {
                item.default = false;
            }
        });
        uInfos.sites.forEach((item, i) => {
            if (item.id === uInfos.defaultSite) {
                item.default = true;
                uInfos.defaultSiteName = item.name;
            } else {
                item.default = false;
            } 
        });*/
        /*uInfos.productsList = JSON.parse(JSON.stringify(uInfos.products));*/
        /*uInfos.products = uInfos.products.filter(item => item.code === 'EAM');
        uInfos.products = uInfos.products.map(item => item.id);

        actions.setIds(uInfos);*/


        const siteLevelSearch = location.query.site_level;
        if (siteLevelSearch) {  // 从总部跳转过来
            sessionStorage.setItem('LEVEL', 'SITE_LEVEL');
            const findSite = uInfos.sites.filter(item => item.id === siteLevelSearch);

            if (findSite.length) {
                const curItem = findSite[0];
                actions.setIds(
                    [
                        {
                            id: curItem.id,
                            name: curItem.name
                        },
                        {
                            id: curItem.orgId,
                            name: curItem.orgName
                        }
                    ]
                );

                browserHistory.push(`/main/`);
                browserHistory.push(pathname);
            } else {
                message.error('不存在此项目')
            }
        }
    }
    componentDidMount () {
        let { location } = this.props;
        const pathname = location.pathname;

        this.isMac = (navigator.platform == 'Mac68K') || (navigator.platform == 'MacPPC') || (navigator.platform == 'Macintosh') || (navigator.platform == 'MacIntel');
        this.setState({scrollDom: document.getElementById('scroll-wrap')});

        if (pathname !== '/sign_in' && !this.isMac) {
            this.scrollBarInit();
            window.onresize = this.resetBarPosition;
        }
    }
    render () {

        let { location } = this.props;
        let thisState = this.state;
        let today = thisState.today;

        const pathname = location.pathname;

        const appLocale = thisState.appLocale;
        const antdLocale = thisState.antdLocale;

        let isMainModule = pathname.split('/')[1] === 'main';

        if (pathname === '/') isMainModule = true;

        return (
            <IntlProvider locale={appLocale.locale} messages={appLocale.messages}>
                <LocaleProvider locale={antdLocale}>
                    {
                        pathname === '/sign_in' ?
                        <div>{this.props.children}</div> :
                        <div id="root">
                            <Layout style={{ height: '100vh', minWidth: 979 }}>
                                <Head location={location} />
                                <Layout>
                                    <Sider width={200} style={{display: isMainModule ? 'none' : 'inherit' ,background: '#fff', overflowY: this.isMac ? 'auto' : 'hidden'}}>
                                        {
                                            isMainModule ?
                                            null :
                                            <Menu
                                                mode="inline"
                                                openKeys={this.state.openKeys}
                                                selectedKeys={[this.state.selectedKeys]}
                                                style={{height: '100%', borderRight: 0}}
                                                onOpenChange={this.menuOpenChange}
                                                onClick={this.menuClick}
                                            >
                                                {/*<SubMenu*/}
                                                    {/*onTitleClick={this.subMenuClick}*/}
                                                    {/*key="task"*/}
                                                    {/*title={<div data-defaultLink="/task/backlog/backlog_tab1"><span data-defaultLink="/task/backlog/backlog_tab1">我的任务</span></div>}*/}
                                                {/*>*/}
                                                    {/*<Menu.Item key="backlog"><Link to="/task/backlog/backlog_tab1">待办任务</Link></Menu.Item>*/}
                                                    {/*<Menu.Item key="handle"><Link to="/task/handle/handle_tab1">经办任务</Link></Menu.Item>*/}
                                                {/*</SubMenu>*/}
                                                <SubMenu
                                                    onTitleClick={this.subMenuClick}
                                                    key="equipment"
                                                    title={<div data-defaultLink="/equipment/asset"><span data-defaultLink="/equipment/asset">设备台账</span></div>}
                                                >
                                                    <Menu.Item key="asset"> <Link to="/equipment/asset">设备设施台账</Link></Menu.Item>
                                                    <Menu.Item key="location"> <Link to="/equipment/location">分类体系</Link></Menu.Item>                                                    
                                                </SubMenu>
                                                <SubMenu
                                                    onTitleClick={this.subMenuClick}
                                                    key="order"
                                                    title={<div data-defaultLink="/order/work_order" ><span data-defaultLink="/order/work_order">报修管理</span></div>}
                                                >
                                                    <Menu.Item key="work_order"> <Link to="/order/work_order">维保工单</Link></Menu.Item>
                                                    <Menu.Item key="dispatch"> <Link to="/order/work_order_dfp">派工工单</Link></Menu.Item>
                                                </SubMenu>
                                                <SubMenu
                                                    onTitleClick={this.subMenuClick}
                                                    key="matter_repair"
                                                    title={<div data-defaultLink="/after_sale/after_sale_order"><span data-defaultLink="/after_sale/after_sale_order">售后管理</span></div>}
                                                >
                                                       <Menu.Item key="after_sale_order"> <Link to="/after_sale/after_sale_order">售后订单</Link></Menu.Item>
                                                    <Menu.Item key="after_sale_treatment"> <Link to="/after_sale/after_sale_treatment">订单处理</Link></Menu.Item>
                                                </SubMenu>
                                                <SubMenu
                                                    onTitleClick={this.subMenuClick}
                                                    key="sales_order"
                                                    title={<div data-defaultLink="/sales_order/sales_orders"><span data-defaultLink="/sales_order/sales_orders">销售管理</span></div>}
                                                >
                                                    <Menu.Item key="sales_orders"> <Link to="/sales_order/sales_orders">销售订单</Link></Menu.Item>
                                                    <Menu.Item key="sales_order_ing"> <Link to="/sales_order/sales_order_ing">订单处理</Link></Menu.Item>
                                                </SubMenu>
                                                <SubMenu
                                                    onTitleClick={this.subMenuClick}
                                                    key="patrol"
                                                    title={<div data-defaultLink="/patrol/point"><span data-defaultLink="/patrol/point">巡检管理</span></div>}
                                                >
                                                    <Menu.Item key="point"> <Link to="/patrol/point">巡检点台账</Link></Menu.Item>
                                                    <Menu.Item key="route"> <Link to="/patrol/route">巡检路线</Link></Menu.Item>
                                                    <Menu.Item key="plan"> <Link to="/patrol/plan">巡检计划</Link></Menu.Item>
                                                    <Menu.Item key="order"> <Link to="/patrol/order">巡检工单</Link></Menu.Item>
                                                </SubMenu>
                                                <SubMenu
                                                    onTitleClick={this.subMenuClick}
                                                    key="archives_managent"
                                                    title={<div data-defaultLink="/archives_managent/archives"><span data-defaultLink="/archives_managent/archives">档案管理</span></div>}
                                                >
                                                    <Menu.Item key="archives">
                                                        <Link to="/archives_managent/archives">档案管理</Link>
                                                    </Menu.Item>
                                                </SubMenu>
                                                <SubMenu
                                                    onTitleClick={this.subMenuClick}
                                                    key="contract"
                                                    title={<div data-defaultLink="/contract/manage"><span data-defaultLink="/contract/manage">合同管理</span></div>}
                                                >
                                                    <Menu.Item key="manage"> <Link to="/contract/manage">合同管理</Link></Menu.Item>
                                                    <Menu.Item key="construction"><Link to="/contract/construction">施工单</Link></Menu.Item>
                                                </SubMenu>
 
                                                <SubMenu
                                                    onTitleClick={this.subMenuClick}
                                                    key="headquarters"
                                                    title={<div data-defaultLink="/headquarters/work_plan"><span data-defaultLink="/report/data_report">报表管理</span></div>}
                                                >
                                                    <Menu.Item key="work_plan">
                                                        <Link to="/report/kpi_report">KPI分析</Link>
                                                    </Menu.Item>                                                     
                                                </SubMenu>
                                                
                                            </Menu>
                                        }
                                    </Sider>
                                    
                                    <Layout id="scroll-wrap" style={{padding: '0 0 24px', overflow: 'auto'}}>
                                        <Content style={{margin: 0, minHeight: 280}}>
                                            {this.props.children}
                                            {
                                                this.state.scrollDom ?
                                                <BackTop target={() => this.state.scrollDom}>
                                                    <b></b>
                                                    <Icon type="arrow-up" />
                                                </BackTop> :
                                                null
                                            }
                                        </Content>
                                    </Layout>
                                </Layout>
                            </Layout>
                        </div>
                    }
                </LocaleProvider>
            </IntlProvider>
        )
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
export default connect(mapStateToProps, buildActionDispatcher)(App);