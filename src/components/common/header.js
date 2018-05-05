/**
 * header
 */
import React from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { browserHistory } from 'react-router';
import { runActionsMethod } from '../../tools/';

import { Layout, Tabs, Icon, Popover } from 'antd';
const { Header } = Layout;
const TabPane = Tabs.TabPane;

import actions from '../../actions/common.js';

import logoImg from '../../images/logo.png';
import logoActiveImg from '../../images/logo-active.png';

import SearchInp from './search_inp.js';
import DropdownMenu from './dropdown_menu.js';
import Today from './today.js';
import EamModal from '../../components/common/modal.js';
import Upload from './upload.js';

import { NewUserInfoForm, NewChangePasswordForm } from './form/header.js';
import { getLevel } from '../../tools/';

class HeaderComponent extends React.Component {
    constructor (props) {
        super(props);

        const pathname = props.location.pathname;
        const pathnameArr = pathname.split('/');
        const isMainModule = pathnameArr[1] === 'main';

        let navIndex = 0;

        this.navData = [
            {
                className: 'dashboard',
                linkTo: '/main/dashboard',
                title: 'Dashboard',
            },
            {
                className: 'task',
                linkTo: '/main/task/backlog_tab1',
                title: '任务',
            },
            {  
                className: 'manager',
                linkTo: '/equipment/asset',
                title: '管理',
            },
            {  
                className: 'message',
                linkTo: '/main/message',
                title: '消息',
            },
            {
                className: 'settings',
                linkTo: '/main/settings/company',
                title: '设置',
            },
        ]


        let navClass = [];
        if (isMainModule) {
            this.navData.forEach((item, i) => {
                if (pathnameArr[2] === item.className) {
                    navIndex = i;
                }
            })
            navClass[navIndex] = 'active';
        }

        this.state = {
            logoClass: 'logo',
            tabIconClass: ['environment', 'appstore-o'],
            orgOrSiteListResults: [],
            navClass
        }
    }    
    logoClick = () => {
        /*let logoClass = '';
        logoClass = this.state.logoClass === 'logo' ? 'logo active' : 'logo';
        this.setState({ logoClass });*/
    }
    // 选择项目tab点击
    tabClick = (key) => {
        let tabIconClass = key === '0' ? ['environment', 'appstore-o'] : ['environment-o', 'appstore'];
        this.setState({ tabIconClass });
    }
    changeLang = (lang) => {
        const { actions } = this.props;
        actions.changeLang(lang);
        location.href = lang === 'zh_CN' ? '/' : `/?lang=${lang}`;
    }
    signOut = () => {
        const { actions } = this.props;
        actions.signOut((response) => {
            if (response.ok) {
                localStorage.removeItem('token');
                localStorage.removeItem('uInfos');
                localStorage.removeItem('loglevel');
                browserHistory.push('/sign_in');
            }
        });
    }
    // 切换
    changeSite = (index) => {
        const { state, actions, location } = this.props,
              { pathname } = location,
              { siteList, orgList } = state;

        const isOrgLevel = getLevel() === 'ORG_LEVEL';
        const orgListOrSiteList = isOrgLevel ? orgList : siteList;
        

        const { orgOrSiteListResults } = this.state;
        const curItem = orgOrSiteListResults.length ? orgOrSiteListResults[index] : orgListOrSiteList[index];

        actions.setIds(
            isOrgLevel ? 
            [
                {
                    id: '',
                    name: ''
                },
                {
                    id: curItem.id,
                    name: curItem.name
                }
            ] :
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

        browserHistory.push(`/${pathname.split('/')[1]}/`);
        browserHistory.push(pathname); 
    }
    // 设为默认
    setAsDefaultSite = (e, index) => {
        e.stopPropagation();
        const { actions, state, location } = this.props,
              { siteList } = state,
              { pathname } = location;

        const { orgOrSiteListResults } = this.state;
        const curSite = orgOrSiteListResults.length ? orgOrSiteListResults[index] : siteList[index];
        
        const param = {
            personId: state.personId,
            orgId: curSite.orgId,
            siteId: curSite.id,
        }
        runActionsMethod(actions, 'setAsDefaultSite', param, () => {
            actions.getInfo({}, (json) => {
                const uInfos = json.data;
                localStorage.setItem('uInfos', JSON.stringify(uInfos));

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
                });
                uInfos.products = uInfos.products.filter(item => item.code === 'EAM');
                uInfos.products = uInfos.products.map(item => item.id);

                actions.setIds(uInfos);
                browserHistory.push(`/${pathname.split('/')[1]}/`);
                browserHistory.push(pathname); 
            })
        })
    }
    siteListSearch = (val) => {
        const { state } = this.props,
              { siteList, orgList } = state;

        const isOrgLevel = getLevel() === 'ORG_LEVEL';

        this.listKeywords = val;

        let orgOrSiteListResults = JSON.parse(JSON.stringify(isOrgLevel ? orgList : siteList));

        let valArr = val.split(' ');

        valArr.forEach((valItem, i) => {
            if (!valItem) return false;

            orgOrSiteListResults = orgOrSiteListResults.filter(item => 
                item.name.indexOf(valItem) !== -1 || (item.orgName && item.orgName.indexOf(valItem) !== -1)
            );
        })

        this.setState({ orgOrSiteListResults });
    }
    // header导航切换
    navClick = (item, index) => {
        let navClass = [];
        let temp = false;
        const navClassState = this.state.navClass;

        if (getLevel() === 'ORG_LEVEL') { // 总部有侧边列表页时 删除此判断和执行代码
            navClass[index] = 'active';
        } else {
            navClass[index] = navClassState[index] ? '' : 'active';
        }
        
        navClassState.forEach(item => {
            if (item) temp = true;
            return false;
        });

        if (!temp) { // 数组内不存在active
            sessionStorage.setItem('ORIGINAL_URL', window.location.pathname);
        } 
           
        this.setState({ navClass }, () => {

            const originalPageUrl = sessionStorage.getItem('ORIGINAL_URL');

            if (this.state.navClass[index]) {
                browserHistory.push(item.linkTo)
            } else {
                browserHistory.push(originalPageUrl ? originalPageUrl : '/equipment/asset');
            }

        })
    }
    render() {
        const { state, actions } = this.props
        const thisState = this.state;

        const { siteList, orgList, productList } = state;
        const isOrgLevel = getLevel() === 'ORG_LEVEL';

        const orgListOrSiteList = isOrgLevel ? orgList : siteList;

        let orgOrSiteListResults = (thisState.orgOrSiteListResults.length || this.listKeywords) ? thisState.orgOrSiteListResults : orgListOrSiteList;

        const tabDom = (
            <div className="eam-tab">
                <Tabs
                    type="card"
                    onTabClick={this.tabClick}
                >
                    <TabPane tab={<span><Icon type={this.state.tabIconClass[0]} />{isOrgLevel ? '总部' : '项目'} <i className="badge-num">{orgListOrSiteList.length}</i></span>} key="0">
                        <div className="site-search">
                            <SearchInp
                                ref={searchSiteInp => this.searchSiteInp = searchSiteInp}
                                onKeyUp={this.siteListSearch}
                            />
                        </div>
                        {
                            orgOrSiteListResults.length ?
                            <ul className="site-list">
                                {
                                    orgOrSiteListResults.map((item, i) => {
                                        return (
                                            <li
                                                key={i}
                                                title={(isOrgLevel ? '' : (item.orgName + '-')) + item.name}
                                                className={item.default ? 'default-site' : ''}
                                                onClick={() => { this.changeSite(i) }}
                                            >
                                                <span
                                                    className="pull-right"
                                                    onClick={item.default ? () => {} : (e) => { this.setAsDefaultSite(e, i) }}
                                                >
                                                    <i>设为</i><i>默认</i>
                                                </span>
                                                {
                                                    isOrgLevel ?
                                                    <span>{item.name}</span> : 
                                                    <span>{item.orgName}-{item.name}</span>
                                                }
                                            </li>
                                        )
                                    })
                                }
                            </ul> :
                            <div style={{textAlign: 'center', fontSize: 14, lineHeight: '100px'}}>没找到该项目 : )</div>
                        }
                        
                    </TabPane>
                    <TabPane tab={<span><Icon type={this.state.tabIconClass[1]} />其他应用</span>} key="1">
                        <div className="app-list">
                            {
                                productList.map(
                                    (item, i) => (
                                        <div className="app-item" key={i}>
                                            <a href="#" title={item.name}>
                                                <img className="app-logo" src="http://images/user_top.jpg" alt=""/>
                                                <span className="app-name">{item.code}</span>
                                            </a>
                                        </div>
                                    )
                                )
                            }
                        </div>
                    </TabPane>
                </Tabs>
            </div>
        );

        const userMenu = (
            <div className="user-list">
                <div>
                    <h2>{state.loginName}xianjun</h2>
                    <h3>{state.personName}夏军</h3>
                </div>
                <ul className="eam-list">
                    <li onClick={() => { this.userInfoModal.modalShow(); this.userMenu.hide(); }}><Icon type="edit" /> 编辑个人信息</li>
                </ul>
                <ul className="eam-list">
                    <li onClick={this.signOut}><Icon type="logout" /> 退出登录</li>
                </ul>
            </div>
        );

        return (
            <Header className="header" ref={headerDom => this.headerDom = headerDom}>
                <div
                    className={thisState.logoClass}
                    onClick={this.logoClick}
                >
                    
                    <img width="117" className="eam-text" src={logoImg} alt=""/>                     
                    <span>付费版</span>
                     
                </div>
                <DropdownMenu overlay={tabDom} ref={siteTab => this.siteTab = siteTab}>
                    <span className="site-name"><span className="site-text"><Icon style={{float: 'right', fontSize: 12, margin: '29px 0 0 5px'}} type="down" />湖南省博物馆</span></span>
                </DropdownMenu>
                <Today className="today pull-right" />
                <DropdownMenu
                    overlay={userMenu}
                    ref={userMenu => this.userMenu = userMenu}
                    placement="bottomRight"
                >
                    <div className="user-name pull-right">
                        <Icon style={{float: 'right', fontSize: 12, margin: '29px 0 0 5px'}} type="down" />{state.loginName}xianjun
                    </div>
                </DropdownMenu>
                <ul className="header-nav">
                    {
                        this.navData.map((item, i) => {
                            const curClass = this.state.navClass[i];
                            return (
                                <li title={item.title} key={i} onClick={() => { this.navClick(item, i) }} className={`${item.className} ${curClass ? curClass : ''}`}><i></i></li>
                            )
                        })
                    }
                </ul>
                {/*<a style={{marginLeft: 20}} onClick={() => {this.changeLang('zh_CN')}}>简体中文</a>
                <a style={{marginLeft: 20}} onClick={() => {this.changeLang('zh_TW')}}>繁体中文</a>
                <a style={{marginLeft: 20}} onClick={() => {this.changeLang('en_US')}}>English</a>*/}
                <EamModal
                    title={null}
                    wrapClassName="user-info-modal"
                    ref={userInfoModal => this.userInfoModal = userInfoModal}
                    afterClose={() => {
                        this.newUserInfoForm && this.newUserInfoForm.props.form.resetFields();
                        this.newChangePasswordForm && this.newChangePasswordForm.props.form.resetFields();
                    }}
                >
                    <div className="user-info">
                        <Tabs
                            type="card"
                            // onTabClick={this.tabClick}
                        >
                            <TabPane tab='账号信息' key="0">
                                <div className="user-info-tab-inner">
                                    <NewUserInfoForm
                                        actions={actions}
                                        state={state}
                                        wrappedComponentRef={newUserInfoForm => this.newUserInfoForm = newUserInfoForm}
                                    />
                                </div>
                            </TabPane>
                            <TabPane tab='修改头像' key="1">
                                <div className="user-info-tab-inner">
                                    <Upload
                                        multiple={false}
                                        quoteId={state.personId}
                                        quoteType="userInfoImg"
                                        commonActions={actions}
                                        commonState={state}
                                    />
                                </div>
                            </TabPane>
                            <TabPane tab='修改密码' key="2">
                                <div className="user-info-tab-inner">
                                    <NewChangePasswordForm
                                        actions={actions}
                                        state={state}
                                        wrappedComponentRef={newChangePasswordForm => this.newChangePasswordForm = newChangePasswordForm}
                                    />
                                </div>
                            </TabPane>
                        </Tabs>
                    </div>
                </EamModal>
            </Header>
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
export default connect(mapStateToProps, buildActionDispatcher)(HeaderComponent);