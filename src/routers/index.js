/**
 * 路由配置 
 */
import {browserHistory} from 'react-router';
import App from '../components/app.js';

const onEnter = () => {
    if (
        //(!localStorage.getItem('token') || !localStorage.getItem('uInfos') ||  (!localStorage.getItem('LEVEL') && !sessionStorage.getItem('LEVEL')) ) &&
        ( (!localStorage.getItem('LEVEL') && !sessionStorage.getItem('LEVEL')) ) &&
        location.pathname !== '/sign_in'
    ) {
        browserHistory.push('/sign_in');
    }
};

export default [
    {
        path: '/',
        component: App,
        onEnter,
        indexRoute: {
            getComponent(location, cb) {
                require.ensure([], require => {
                    cb(null, require('../components/index/').default);
                }, 'index');
            }
        },
        childRoutes: [
            // 用户登录
            {
                path: 'sign_in',
                getComponent(location, cb) {
                    require.ensure([], require => {
                        cb(null, require('../components/sign_in/').default);
                    }, 'sign_in');
                }
            },
            // 头部导航所有模块
            {
                path: 'main',
                getComponent(location, cb) {
                    require.ensure([], require => {
                        cb(null, require('../components/main/').default);
                    }, 'main');
                },
                childRoutes: [
                    {
                        path: 'dashboard',
                        onEnter,
                        getComponent(location, cb) {
                            require.ensure([], require => {
                                cb(null, require('../components/main/dashboard.js').default);
                            }, 'dashboard');
                        }
                    },
                    
                    {
                        path: 'site_list',
                        onEnter,
                        getComponent(location, cb) {
                            require.ensure([], require => {
                                cb(null, require('../components/main/site_list.js').default);
                            }, 'site_list');
                        }
                    },
                    
                    {
                        path: 'task/backlog_tab1',
                        onEnter,
                        getComponent(location, cb) {
                            require.ensure([], require => {
                                cb(null, require('../components/main/backlog_tab1.js').default);
                            }, 'backlog_tab1');
                        }
                    },
                    {
                        path: 'task/backlog_tab2',
                        onEnter,
                        getComponent(location, cb) {
                            require.ensure([], require => {
                                cb(null, require('../components/main/backlog_tab2.js').default);
                            }, 'backlog_tab2');
                        }
                    },
                    
                    {
                        path: 'task/backlog_tab3',
                        onEnter,
                        getComponent(location, cb) {
                            require.ensure([], require => {
                                cb(null, require('../components/main/backlog_tab3.js').default);
                            }, 'backlog_tab3');
                        }
                    },
                    {
                        path: 'task/backlog_tab4',
                        onEnter,
                        getComponent(location, cb) {
                            require.ensure([], require => {
                                cb(null, require('../components/main/backlog_tab4.js').default);
                            }, 'backlog_tab4');
                        }
                    },
                    {
                        path: 'task/backlog_tab5',
                        onEnter,
                        getComponent(location, cb) {
                            require.ensure([], require => {
                                cb(null, require('../components/main/backlog_tab5.js').default);
                            }, 'backlog_tab5');
                        }
                    },
                    {
                        path: 'task/backlog_tab6',
                        onEnter,
                        getComponent(location, cb) {
                            require.ensure([], require => {
                                cb(null, require('../components/main/backlog_tab6.js').default);
                            }, 'backlog_tab6');
                        }
                    },
                    {
                        path: 'task/handle_tab1',
                        onEnter,
                        getComponent(location, cb) {
                            require.ensure([], require => {
                                cb(null, require('../components/main/handle_tab1.js').default);
                            }, 'handle_tab1');
                        }
                    },
                    {
                        path: 'task/handle_tab2',
                        onEnter,
                        getComponent(location, cb) {
                            require.ensure([], require => {
                                cb(null, require('../components/main/handle_tab2.js').default);
                            }, 'handle_tab2');
                        }
                    },
                    {
                        path: 'task/handle_tab3',
                        onEnter,
                        getComponent(location, cb) {
                            require.ensure([], require => {
                                cb(null, require('../components/main/handle_tab3.js').default);
                            }, 'handle_tab3');
                        }
                    },
                    {
                        path: 'task/handle_tab4',
                        onEnter,
                        getComponent(location, cb) {
                            require.ensure([], require => {
                                cb(null, require('../components/main/handle_tab4.js').default);
                            }, 'handle_tab4');
                        }
                    },
                    {
                        path: 'task/handle_tab5',
                        onEnter,
                        getComponent(location, cb) {
                            require.ensure([], require => {
                                cb(null, require('../components/main/handle_tab5.js').default);
                            }, 'handle_tab5');
                        }
                    },
                    {
                        path: 'task/handle_tab6',
                        onEnter,
                        getComponent(location, cb) {
                            require.ensure([], require => {
                                cb(null, require('../components/main/handle_tab6.js').default);
                            }, 'handle_tab6');
                        }
                    },
                    {
                        path: 'message',
                        onEnter,
                        getComponent(location, cb) {
                            require.ensure([], require => {
                                cb(null, require('../components/main/message.js').default);
                            }, 'message');
                        }
                    },
                    {
                        path: 'bulletin',
                        onEnter,
                        getComponent(location, cb) {
                            require.ensure([], require => {
                                cb(null, require('../components/main/bulletin.js').default);
                            }, 'bulletin');
                        }
                    },
                    
                    {
                        path: 'settings/ip',
                        onEnter,
                        getComponent(location, cb) {
                            require.ensure([], require => {
                                cb(null, require('../components/main/ip.js').default);
                            }, 'ip');
                        }
                    },
                    //二维码管理
                    {
                        path: 'settings/code',
                        onEnter,
                        getComponent(location, cb) {
                            require.ensure([], require => {
                                cb(null, require('../components/main/code.js').default);
                            }, 'code');
                        }
                    },

                    {
                        path: 'settings/code/code_detail',
                        onEnter,
                        getComponent(location, cb) {
                            require.ensure([], require => {
                                cb(null, require('../components/main/code_detail.js').default);
                            }, 'code');
                        }
                    },
                     //公司管理
                    {
                        path: 'settings/company',
                        onEnter,
                        getComponent(location, cb) {
                            require.ensure([], require => {
                                cb(null, require('../components/main/company.js').default);
                            }, 'company');
                        }
                    },     //员工管理
                    {
                        path: 'settings/employee',
                        onEnter,
                        getComponent(location, cb) {
                            require.ensure([], require => {
                                cb(null, require('../components/main/employee.js').default);
                            }, 'employee');
                        }
                    },
                    {//员工新增
                        path: 'settings/employee_add',
                        onEnter,
                        getComponent(location, cb) {
                            require.ensure([], require => {
                                cb(null, require('../components/main/employee_add.js').default);
                            }, 'employee_add');
                        }
                    },
                    {   //客户管理
                        path: 'settings/customer',
                        onEnter,
                        getComponent(location, cb) {
                            require.ensure([], require => {
                                cb(null, require('../components/main/customer.js').default);
                            }, 'customer');
                        }
                    },
                    {   //客户新增
                        path: 'settings/customer_add',
                        onEnter,
                        getComponent(location, cb) {
                            require.ensure([], require => {
                                cb(null, require('../components/main/customer_add.js').default);
                            }, 'customer_add');
                        }
                    },
                    {   //故障分类管理
                        path: 'settings/item',
                        onEnter,
                        getComponent(location, cb) {
                            require.ensure([], require => {
                                cb(null, require('../components/main/item.js').default);
                            }, 'item');
                        }
                    },
                    {   //故障分类新增
                        path: 'settings/item_add',
                        onEnter,
                        getComponent(location, cb) {
                            require.ensure([], require => {
                                cb(null, require('../components/main/item_add.js').default);
                            }, 'item_add');
                        }
                    },
                    {
                        //商品管理
                        path: 'settings/product',
                        onEnter,
                        getComponent(location, cb) {
                            require.ensure([], require => {
                                cb(null, require('../components/main/product.js').default);
                            }, 'product');
                        }
                    },
                    {
                        //商品新增
                        path: 'settings/product_add',
                        onEnter,
                        getComponent(location, cb) {
                            require.ensure([], require => {
                                cb(null, require('../components/main/product_add.js').default);
                            }, 'product_add');
                        }
                    },
                    {
                        //品牌管理
                        path: 'settings/brand',
                        onEnter,
                        getComponent(location, cb) {
                            require.ensure([], require => {
                                cb(null, require('../components/main/brand.js').default);
                            }, 'brand');
                        }
                    },
                     {
                        //品牌新增
                        path: 'settings/brand_add',
                        onEnter,
                        getComponent(location, cb) {
                            require.ensure([], require => {
                                cb(null, require('../components/main/brand_add.js').default);
                            }, 'brand_add');
                        }
                    },
                    {
                        //售后套餐管理
                        path: 'settings/serviceFees',
                        onEnter,
                        getComponent(location, cb) {
                            require.ensure([], require => {
                                cb(null, require('../components/main/serviceFees.js').default);
                            }, 'serviceFees');
                        }
                    },
                     {
                        //售后新增
                        path: 'settings/serviceFees_add',
                        onEnter,
                        getComponent(location, cb) {
                            require.ensure([], require => {
                                cb(null, require('../components/main/serviceFees_add.js').default);
                            }, 'serviceFees_add');
                        }
                    },
                    {
                        //项目管理
                        path: 'settings/servicePoints',
                        onEnter,
                        getComponent(location, cb) {
                            require.ensure([], require => {
                                cb(null, require('../components/main/servicePoints.js').default);
                            }, 'servicePoints');
                        }
                    },
                    {
                        //项目新增
                        path: 'settings/servicePoints_add',
                        onEnter,
                        getComponent(location, cb) {
                            require.ensure([], require => {
                                cb(null, require('../components/main/servicePoints_add.js').default);
                            }, 'servicePoints_add');
                        }
                    },
                ]
            },
            // 总部事务
            {
                path: 'headquarters',
                getComponent(location, cb) {
                    require.ensure([], require => {
                        cb(null, require('../components/headquarters/').default);
                    }, 'headquarters');
                },
                childRoutes: [

                    {
                        path: 'work_plan',
                        onEnter,
                        getComponent(location, cb) {
                            require.ensure([], require => {
                                cb(null, require('../components/headquarters/work_plan.js').default);
                            }, 'work_plan');
                        },
                        childRoutes: [
                            {
                                path: 'work_1',
                                onEnter,
                                getComponent(location, cb) {
                                    require.ensure([], require => {
                                        cb(null, require('../components/headquarters/work_1.js').default);
                                    }, 'work_1');
                                }
                            },
                            {
                                path: 'prevention_plan_1',
                                onEnter,
                                getComponent(location, cb) {
                                    require.ensure([], require => {
                                        cb(null, require('../components/headquarters/prevention_plan.js').default);
                                    }, 'prevention_plan');
                                }
                            },
                            {
                                path: 'prevention_plan_2',
                                onEnter,
                                getComponent(location, cb) {
                                    require.ensure([], require => {
                                        cb(null, require('../components/headquarters/prevention_plan.js').default);
                                    }, 'prevention_plan');
                                }
                            }

                        ]
                    },
                    {
                        path: 'routine_work',
                        onEnter,
                        getComponent(location, cb) {
                            require.ensure([], require => {
                                cb(null, require('../components/headquarters/routine_work.js').default);
                            }, 'routine_work');
                        },
                        childRoutes: [
                            {
                                path: 'routine_work_form',
                                onEnter,
                                getComponent(location, cb) {
                                    require.ensure([], require => {
                                        cb(null, require('../components/headquarters/routine_work_form.js').default);
                                    }, 'routine_work_form');
                                }
                            }
                        ]
                    },
                    {
                        path: 'routine_work_order',
                        onEnter,
                        getComponent(location, cb) {
                            require.ensure([], require => {
                                cb(null, require('../components/headquarters/routine_work_order.js').default);
                            }, 'routine_work_order');
                        },
                        childRoutes: [
                            {
                                path: 'routine_work_order_form',
                                onEnter,
                                getComponent(location, cb) {
                                    require.ensure([], require => {
                                        cb(null, require('../components/headquarters/routine_work_order_form.js').default);
                                    }, 'routine_work_order_form');
                                }
                            }
                        ]
                    }
                ]
            },
            // 酒店管理
            {
                path: 'hotel_management',
                getComponent(location, cb) {
                    require.ensure([], require => {
                        cb(null, require('../components/hotel_management/').default);
                    }, 'hotel_management');
                },
                childRoutes: [
                    {
                        path: 'hotel',
                        onEnter,
                        getComponent(location, cb) {
                            require.ensure([], require => {
                                cb(null, require('../components/hotel_management/hotel.js').default);
                            }, 'hotel');
                        },
                        childRoutes: [
                            {
                                path: 'hotel_1',
                                onEnter,
                                getComponent(location, cb) {
                                    require.ensure([], require => {
                                        cb(null, require('../components/hotel_management/hotel_1.js').default);
                                    }, 'hotel_1');
                                }
                            }
                        ]
                    }
                ]
            },
            // 系统管理
            {
                path: 'system',
                getComponent(location, cb) {
                    require.ensure([], require => {
                        cb(null, require('../components/system/').default);
                    }, 'system');
                },
                childRoutes: [
                    {
                        path: 'domain',
                        onEnter,
                        getComponent(location, cb) {
                            require.ensure([], require => {
                                cb(null, require('../components/system/domain.js').default);
                            }, 'domain');
                        }
                    },
                    {
                        path: 'ip',
                        onEnter,
                        getComponent(location, cb) {
                            require.ensure([], require => {
                                cb(null, require('../components/system/ip.js').default);
                            }, 'ip');
                        },
                        childRoutes: [
                            {
                                path: 'ip_1',
                                onEnter,
                                getComponent(location, cb) {
                                    require.ensure([], require => {
                                        cb(null, require('../components/system/ip_1.js').default);
                                    }, 'ip_1');
                                }
                            }
                        ]
                    },
                    {
                        path: 'code',
                        onEnter,
                        getComponent(location, cb) {
                            require.ensure([], require => {
                                cb(null, require('../components/system/code.js').default);
                            }, 'code');
                        },
                        childRoutes: [
                            {
                                path: 'code_detail',
                                onEnter,
                                getComponent(location, cb) {
                                    require.ensure([], require => {
                                        cb(null, require('../components/system/code_detail.js').default);
                                    }, 'code_detail');
                                }
                            }
                        ]
                    }
                ]
            },
            // 我的任务
            {
                path: 'task',
                getComponent(location, cb) {
                    require.ensure([], require => {
                        cb(null, require('../components/task/').default);
                    }, 'task');
                },
                childRoutes: [
                    {
                        path: 'backlog',
                        onEnter,
                        getComponent(location, cb) {
                            require.ensure([], require => {
                                cb(null, require('../components/task/backlog.js').default);
                            }, 'backlog');
                        },
                        childRoutes: [
                            {
                                path: 'backlog_tab1',
                                onEnter,
                                getComponent(location, cb) {
                                    require.ensure([], require => {
                                        cb(null, require('../components/task/backlog_tab1.js').default);
                                    }, 'backlog_tab1');
                                }
                            },
                            {
                                path: 'backlog_tab2',
                                onEnter,
                                getComponent(location, cb) {
                                    require.ensure([], require => {
                                        cb(null, require('../components/task/backlog_tab2.js').default);
                                    }, 'backlog_tab2');
                                }
                            },
                            {
                                path: 'backlog_tab3',
                                onEnter,
                                getComponent(location, cb) {
                                    require.ensure([], require => {
                                        cb(null, require('../components/task/backlog_tab3.js').default);
                                    }, 'backlog_tab3');
                                }
                            },
                            {
                                path: 'backlog_tab4',
                                onEnter,
                                getComponent(location, cb) {
                                    require.ensure([], require => {
                                        cb(null, require('../components/task/backlog_tab4.js').default);
                                    }, 'backlog_tab4');
                                }
                            },
                            {
                                path: 'backlog_tab5',
                                onEnter,
                                getComponent(location, cb) {
                                    require.ensure([], require => {
                                        cb(null, require('../components/task/backlog_tab5.js').default);
                                    }, 'backlog_tab5');
                                }
                            },
                            {
                                path: 'backlog_tab6',
                                onEnter,
                                getComponent(location, cb) {
                                    require.ensure([], require => {
                                        cb(null, require('../components/task/backlog_tab6.js').default);
                                    }, 'backlog_tab5');
                                }
                            }
                        ]
                    },
                    {
                        path: 'handle',
                        onEnter,
                        getComponent(location, cb) {
                            require.ensure([], require => {
                                cb(null, require('../components/task/handle.js').default);
                            }, 'handle');
                        },
                        childRoutes: [
                            {
                                path: 'handle_tab1',
                                onEnter,
                                getComponent(location, cb) {
                                    require.ensure([], require => {
                                        cb(null, require('../components/task/handle_tab1.js').default);
                                    }, 'handle_tab1');
                                }
                            },
                            {
                                path: 'handle_tab2',
                                onEnter,
                                getComponent(location, cb) {
                                    require.ensure([], require => {
                                        cb(null, require('../components/task/handle_tab2.js').default);
                                    }, 'handle_tab2');
                                }
                            },
                            {
                                path: 'handle_tab3',
                                onEnter,
                                getComponent(location, cb) {
                                    require.ensure([], require => {
                                        cb(null, require('../components/task/handle_tab3.js').default);
                                    }, 'handle_tab3');
                                }
                            },
                            {
                                path: 'handle_tab4',
                                onEnter,
                                getComponent(location, cb) {
                                    require.ensure([], require => {
                                        cb(null, require('../components/task/handle_tab4.js').default);
                                    }, 'handle_tab4');
                                }
                            },
                            {
                                path: 'handle_tab5',
                                onEnter,
                                getComponent(location, cb) {
                                    require.ensure([], require => {
                                        cb(null, require('../components/task/handle_tab5.js').default);
                                    }, 'handle_tab5');
                                }
                            },
                            {
                                path: 'handle_tab6',
                                onEnter,
                                getComponent(location, cb) {
                                    require.ensure([], require => {
                                        cb(null, require('../components/task/handle_tab6.js').default);
                                    }, 'handle_tab6');
                                }
                            },
                        ]
                    }
                ]
            },
            // 设备设施台账
            {
                path: 'equipment',
                getComponent(location, cb) {
                    require.ensure([], require => {
                        cb(null, require('../components/equipment/').default);
                    }, 'equipment');
                },
                childRoutes: [
                    {
                        path: 'asset',
                        onEnter,
                        getComponent(location, cb) {
                            require.ensure([], require => {
                                cb(null, require('../components/equipment/asset.js').default);
                            }, 'asset');
                        },
                        childRoutes: [
                            {
                                path: 'tab_1',
                                onEnter,
                                getComponent (location, cb) {
                                    require.ensure([], require => {
                                        cb(null, require('../components/equipment/tab_1.js').default);
                                    }, 'tab_1');
                                }
                            },
                            {
                                path: 'tab_2',
                                onEnter,
                                getComponent (location, cb) {
                                    require.ensure([], require => {
                                        cb(null, require('../components/equipment/tab_2.js').default);
                                    }, 'tab_2');
                                }
                            },
                            {
                                path: 'tab_3',
                                onEnter,
                                getComponent (location, cb) {
                                    require.ensure([], require => {
                                        cb(null, require('../components/equipment/tab_3.js').default);
                                    }, 'tab_3');
                                }
                            },
                            {
                                path: 'tab_4',
                                onEnter,
                                getComponent (location, cb) {
                                    require.ensure([], require => {
                                        cb(null, require('../components/equipment/tab_4.js').default);
                                    }, 'tab_4');
                                }
                            },
                            {
                                path: 'tab_5',
                                onEnter,
                                getComponent (location, cb) {
                                    require.ensure([], require => {
                                        cb(null, require('../components/equipment/tab_5.js').default);
                                    }, 'tab_5');
                                },
                            },
                            {
                                path: 'tab_6',
                                onEnter,
                                getComponent (location, cb) {
                                    require.ensure([], require => {
                                        cb(null, require('../components/equipment/tab_6.js').default);
                                    }, 'tab_6');
                                }
                            },
                            {
                                path: 'tab_7',
                                onEnter,
                                getComponent (location, cb) {
                                    require.ensure([], require => {
                                        cb(null, require('../components/equipment/tab_7.js').default);
                                    }, 'tab_7');
                                }
                            },
                            {
                                path: 'tab_8',
                                onEnter,
                                getComponent (location, cb) {
                                    require.ensure([], require => {
                                        cb(null, require('../components/equipment/tab_8.js').default);
                                    }, 'tab_8');
                                }
                            }
                        ]
                    },
                    {
                        path: 'location',
                        onEnter,
                        getComponent(location, cb) {
                            require.ensure([], require => {
                                cb(null, require('../components/equipment/location.js').default);
                            }, 'location');
                        },
                        childRoutes: [
                            {
                                path: 'location_1',
                                onEnter,
                                getComponent (location, cb) {
                                    require.ensure([], require => {
                                        cb(null, require('../components/equipment/location_1.js').default);
                                    }, 'location_1');
                                }
                            },
                            {
                                path: 'location_2',
                                onEnter,
                                getComponent (location, cb) {
                                    require.ensure([], require => {
                                        cb(null, require('../components/equipment/location_2.js').default);
                                    }, 'location_2');
                                }
                            },
                            {
                                path: 'location_3',
                                onEnter,
                                getComponent (location, cb) {
                                    require.ensure([], require => {
                                        cb(null, require('../components/equipment/location_3.js').default);
                                    }, 'location_3');
                                }
                            }
                        ]
                    },
                    {
                        path: 'meter',
                        onEnter,
                        getComponent(location, cb) {
                            require.ensure([], require => {
                                cb(null, require('../components/equipment/meter.js').default);
                            }, 'meter');
                        },
                        childRoutes: [
                            {
                                path: 'meter_1',
                                onEnter,
                                getComponent (location, cb) {
                                    require.ensure([], require => {
                                        cb(null, require('../components/equipment/meter_1.js').default);
                                    }, 'meter_1');
                                }
                            },
                            {
                                path: 'meter_2',
                                onEnter,
                                getComponent (location, cb) {
                                    require.ensure([], require => {
                                        cb(null, require('../components/equipment/meter_2.js').default);
                                    }, 'meter_2');
                                }
                            }
                        ]
                    },
                    {
                        path: 'energy_price',
                        onEnter,
                        getComponent(location, cb) {
                            require.ensure([], require => {
                                cb(null, require('../components/equipment/energy_price.js').default);
                            }, 'energy_price');
                        },
                    }
                ]
            },
            // 维保工单
            {
                path: 'maintenance',
                getComponent(location, cb) {
                    require.ensure([], require => {
                        cb(null, require('../components/maintenance/').default);
                    }, 'maintenance');
                },
                childRoutes: [
                    {
                        path: 'work_order',
                        onEnter,
                        getComponent(location, cb) {
                            require.ensure([], require => {
                                cb(null, require('../components/maintenance/work_order.js').default);
                            }, 'work_order');
                        },
                        childRoutes: [
                            {
                                path: 'tab_1',
                                onEnter,
                                getComponent(location, cb) {
                                    require.ensure([], require => {
                                        cb(null, require('../components/maintenance/tab_1.js').default);
                                    }, 'tab_1');
                                }
                            },
                            {
                                path: 'tab_2',
                                onEnter,
                                getComponent(location, cb) {
                                    require.ensure([], require => {
                                        cb(null, require('../components/maintenance/tab_2.js').default);
                                    }, 'tab_2');
                                }
                            },
                            {
                                path: 'tab_3',
                                onEnter,
                                getComponent(location, cb) {
                                    require.ensure([], require => {
                                        cb(null, require('../components/maintenance/tab_3.js').default);
                                    }, 'tab_3');
                                }
                            },
                            {
                                path: 'tab_4',
                                onEnter,
                                getComponent(location, cb) {
                                    require.ensure([], require => {
                                        cb(null, require('../components/maintenance/tab_4.js').default);
                                    }, 'tab_4');
                                }
                            },
                             {
                                path: 'dispatch_details',
                                onEnter,
                                getComponent(location, cb) {
                                    require.ensure([], require => {
                                        cb(null, require('../components/maintenance/dispatch_details.js').default);
                                    }, 'dispatch_details');
                                }
                            },
                        ]
                    },
                    //派工工单
                        {
                        path: 'dispatch',
                        onEnter,
                        getComponent(location, cb) {
                            require.ensure([], require => {
                                cb(null, require('../components/maintenance/dispatch.js').default);
                            }, 'dispatch');
                        },
                        childRoutes: [
                            {
                                path: 'dispatch_details',
                                onEnter,
                                getComponent(location, cb) {
                                    require.ensure([], require => {
                                        cb(null, require('../components/maintenance/dispatch_details.js').default);
                                    }, 'dispatch_details');
                                }
                            },
                            
                        ]
                    },




                    {
                        path: 'job_plan',
                        onEnter,
                        getComponent(location, cb) {
                            require.ensure([], require => {
                                cb(null, require('../components/maintenance/job_plan.js').default);
                            }, 'job_plan');
                        },
                        childRoutes: [
                            {
                                path: 'job_plan_details',
                                onEnter,
                                getComponent(location, cb) {
                                    require.ensure([], require => {
                                        cb(null, require('../components/maintenance/job_plan_details.js').default);
                                    }, 'job_plan_details');
                                }
                            },
                        ]
                    },
                    {
                        path: 'maintenance_plan',
                        onEnter,
                        getComponent(location, cb) {
                            require.ensure([], require => {
                                cb(null, require('../components/maintenance/maintenance_plan.js').default);
                            }, 'maintenance_plan');
                        },
                        childRoutes: [
                            {
                                path: 'mp_tab_1',
                                onEnter,
                                getComponent(location, cb) {
                                    require.ensure([], require => {
                                        cb(null, require('../components/maintenance/mp_tab_1.js').default);
                                    }, 'mp_tab_1');
                                }
                            },
                            {
                                path: 'mp_tab_2',
                                onEnter,
                                getComponent(location, cb) {
                                    require.ensure([], require => {
                                        cb(null, require('../components/maintenance/mp_tab_1.js').default);
                                    }, 'mp_tab_1');
                                }
                            },
                            {
                                path: 'mp_tab_3',
                                onEnter,
                                getComponent(location, cb) {
                                    require.ensure([], require => {
                                        cb(null, require('../components/maintenance/mp_tab_3.js').default);
                                    }, 'mp_tab_3');
                                }
                            },
                        ]
                    }
                ]
            },

          // 售后管理
            {
                path: 'after_sale',
                getComponent(location, cb) {
                    require.ensure([], require => {
                        cb(null, require('../components/after_sale/').default);
                    }, 'after_sale');
                },
                childRoutes: [
                    {
                        path: 'after_sale_order',//售后订单
                        onEnter,
                        getComponent(location, cb) {
                            require.ensure([], require => {
                                cb(null, require('../components/after_sale/after_sale_order.js').default);
                            }, 'after_sale_order');
                        },
                       
                    },
                    {
                        path: 'after_sale_treatment',//售后待处理订单
                        onEnter,
                        getComponent(location, cb) {
                            require.ensure([], require => {
                                cb(null, require('../components/after_sale/after_sale_treatment.js').default);
                            }, 'after_sale_treatment');
                        },
                    },
                ]
            },

             // 工单处理
            {
                path: 'order',
                getComponent(location, cb) {
                    require.ensure([], require => {
                        cb(null, require('../components/order/').default);
                    }, 'order');
                },
                childRoutes: [
                    {
                        path: 'work_order',//
                        onEnter,
                        getComponent(location, cb) {
                            require.ensure([], require => {
                                cb(null, require('../components/order/work_order.js').default);
                            }, 'work_order');
                        },
                       
                    },
                    {
                        path: 'work_order_dfp',//待分配订单
                        onEnter,
                        getComponent(location, cb) {
                            require.ensure([], require => {
                                cb(null, require('../components/order/work_order_dfp.js').default);
                            }, 'work_order_dfp');
                        },
                    },
                     {
                        path: 'work_order_dfp_details',//待分配订单详情
                        onEnter,
                        getComponent(location, cb) {
                            require.ensure([], require => {
                                cb(null, require('../components/order/work_order_dfp_details.js').default);
                            }, 'work_order_dfp_details');
                        },
                    },
                ]
            },
     // 销售管理
            {
                path: 'sales_order',
                getComponent(location, cb) {
                    require.ensure([], require => {
                        cb(null, require('../components/sales_order/').default);
                    }, 'sales_order');
                },
                childRoutes: [
                    {
                        path: 'sales_orders',//售后订单
                        onEnter,
                        getComponent(location, cb) {
                            require.ensure([], require => {
                                cb(null, require('../components/sales_order/sales_order.js').default);
                            }, 'after_sale_order');
                        },
                       
                    },
                    {
                        path: 'sales_order_ing',//售后待处理订单
                        onEnter,
                        getComponent(location, cb) {
                            require.ensure([], require => {
                                cb(null, require('../components/sales_order/sales_order_ing.js').default);
                            }, 'sales_order_ing');
                        },
                    },
                ]
            },


            // 巡检管理
            {
                path: 'patrol',
                getComponent(location, cb) {
                    require.ensure([], require => {
                        cb(null, require('../components/patrol/').default);
                    }, 'patrol');
                },
                childRoutes: [
                    {
                        path: 'point',
                        getComponent(location, cb) {
                            require.ensure([], require => {
                                cb(null, require('../components/patrol/point.js').default);
                            }, 'point');
                        },
                        childRoutes: [
                            {
                                path: 'point_info',
                                getComponent(location, cb) {
                                    require.ensure([], require => {
                                        cb(null, require('../components/patrol/point_info.js').default);
                                    }, 'point_info');
                                }
                            },
                            {
                                path: 'point_record',
                                getComponent(location, cb) {
                                    require.ensure([], require => {
                                        cb(null, require('../components/patrol/point_record.js').default);
                                    }, 'point_record');
                                }
                            }
                        ]
                    }, {
                        path: 'route',
                        getComponent (location, cb) {
                            require.ensure([], require => {
                                cb(null, require('../components/patrol/route.js').default);
                            }, 'route');
                        },
                        childRoutes: [
                            {
                                path: 'route_info',
                                getComponent(location, cb) {
                                    require.ensure([], require => {
                                        cb(null, require('../components/patrol/route_info.js').default);
                                    }, 'route_info');
                                }
                            }
                        ]
                    }, {
                        path: 'plan',
                        getComponent(location, cb) {
                            require.ensure([], require => {
                                cb(null, require('../components/patrol/plan.js').default);
                            }, 'plan');
                        },
                        childRoutes: [
                            {
                                path: 'plan_info',
                                getComponent(location, cb) {
                                    require.ensure([], require => {
                                        cb(null, require('../components/patrol/plan_info.js').default);
                                    }, 'plan_info');
                                }
                            },
                            {
                                path: 'plan_record',
                                getComponent(location, cb) {
                                    require.ensure([], require => {
                                        cb(null, require('../components/patrol/plan_record.js').default);
                                    }, 'plan_record');
                                }
                            }
                        ]
                    }, {
                        path: 'order',
                        getComponent(location, cb) {
                            require.ensure([], require => {
                                cb(null, require('../components/patrol/order.js').default);
                            }, 'order');
                        },
                        childRoutes: [
                            {
                                path: 'order_commit',
                                getComponent(location, cb) {
                                    require.ensure([], require => {
                                        cb(null, require('../components/patrol/order_commit.js').default);
                                    }, 'order_commit');
                                }
                            }, {
                                path: 'order_assign',
                                getComponent(location, cb) {
                                    require.ensure([], require => {
                                        cb(null, require('../components/patrol/order_assign.js').default);
                                    }, 'order_assign');
                                }
                            }, {
                                path: 'order_excute',
                                getComponent(location, cb) {
                                    require.ensure([], require => {
                                        cb(null, require('../components/patrol/order_excute.js').default);
                                    }, 'order_excute');
                                }
                            },
                        ]
                    }, {
                        path: 'standard',
                        getComponent(location, cb) {
                            require.ensure([], require => {
                                cb(null, require('../components/patrol/standard.js').default);
                            }, 'standard');
                        },
                        childRoutes: [
                            {
                                path: 'standard_info',
                                getComponent(location, cb) {
                                    require.ensure([], require => {
                                        cb(null, require('../components/patrol/standard_info.js').default);
                                    }, 'standard_info');
                                }
                            }
                        ]
                    }
                ]
            },
            //缺陷管理
            {
                path: 'defect_document',
                getComponent(location, cb) {
                    require.ensure([], require => {
                        cb(null, require('../components/defect_document/').default);
                    }, 'defect_document');
                },
                childRoutes: [
                    //缺陷单管理
                    {
                        path: 'defect_data',
                        onEnter,
                        getComponent(location, cb) {
                            require.ensure([], require => {
                                cb(null, require('../components/defect_document/defect_data.js').default);
                            }, 'defect_data');
                        },
                        childRoutes: [
                            {
                                path: 'defect_from_tab1',
                                onEnter,
                                getComponent(location, cb) {
                                    require.ensure([], require => {
                                        cb(null, require('../components/defect_document/defect_from_tab1.js').default);
                                    }, 'defect_from_tab1');
                                }
                            },
                            {
                                path: 'defect_from_tab2',
                                onEnter,
                                getComponent(location, cb) {
                                    require.ensure([], require => {
                                        cb(null, require('../components/defect_document/defect_from_tab2.js').default);
                                    }, 'defect_from_tab2');
                                }
                            },
                        ]
                    },
                    {
                        path: 'rectification_data',
                        onEnter,
                        getComponent(location, cb) {
                            require.ensure([], require => {
                                cb(null, require('../components/defect_document/rectification_data.js').default);
                            }, 'rectification_data');
                        },
                        childRoutes: [
                            {
                                path: 'rectification_tab1',
                                onEnter,
                                getComponent(location, cb) {
                                    require.ensure([], require => {
                                        cb(null, require('../components/defect_document/rectification_tab1.js').default);
                                    }, 'rectification_tab1');
                                }
                            },
                            {
                                path: 'rectification_tab2',
                                onEnter,
                                getComponent(location, cb) {
                                    require.ensure([], require => {
                                        cb(null, require('../components/defect_document/rectification_tab2.js').default);
                                    }, 'defect_rectification_tab2');
                                }
                            },
                            {
                                path: 'rectification_tab3',
                                onEnter,
                                getComponent(location, cb) {
                                    require.ensure([], require => {
                                        cb(null, require('../components/defect_document/rectification_tab3.js').default);
                                    }, 'rectification_tab3');
                                }
                            },
                            {
                                path: 'rectification_tab4',
                                onEnter,
                                getComponent(location, cb) {
                                    require.ensure([], require => {
                                        cb(null, require('../components/defect_document/rectification_tab4.js').default);
                                    }, 'rectification_tab4');
                                }
                            },
                        ]
                    }
                ]
            },
            // 日常运行
            {
                path: 'daily',
                getComponent(location, cb) {
                    require.ensure([], require => {
                        cb(null, require('../components/daily/').default);
                    }, 'daily');
                },
                childRoutes: [
                    {
                        path: 'copymeter',
                        onEnter,
                        getComponent(location, cb) {
                            require.ensure([], require => {
                                cb(null, require('../components/daily/copymeter.js').default);
                            }, 'construction');
                        },
                        childRoutes: [
                            {
                                path: 'copymeter_detail',
                                onEnter,
                                getComponent (location, cb) {
                                    require.ensure([], require => {
                                        cb(null, require('../components/daily/copymeter_detail.js').default);
                                    }, 'item_detail');
                                }
                            }
                        ]
                    }
                ]
            },//物资管理
            //物资管理
            {
                path: 'material',
                getComponent(location, cb) {
                    require.ensure([], require => {
                        cb(null, require('../components/material/').default);
                    }, 'material');
                },
                childRoutes: [
                    //物资台账
                    {
                        path: 'item',
                        onEnter,
                        getComponent(location, cb) {
                            require.ensure([], require => {
                                cb(null, require('../components/material/item.js').default);
                            }, 'item');
                        },
                        childRoutes: [
                            {
                                path: 'item_detail',
                                onEnter,
                                getComponent (location, cb) {
                                    require.ensure([], require => {
                                        cb(null, require('../components/material/item_detail.js').default);
                                    }, 'item_detail');
                                }
                            },
                            {
                                path: 'item_detail_2',
                                onEnter,
                                getComponent (location, cb) {
                                    require.ensure([], require => {
                                        cb(null, require('../components/material/item_detail_2.js').default);
                                    }, 'item_detail_2');
                                }
                            }
                        ]
                    },
                    //物资库存
                    {
                        path: 'inventory',
                        onEnter,
                        getComponent(location, cb) {
                            require.ensure([], require => {
                                cb(null, require('../components/material/inventory.js').default);
                            }, 'inventory');
                        },
                        childRoutes: [
                            {
                                path: 'inventory_detail',
                                onEnter,
                                getComponent (location, cb) {
                                    require.ensure([], require => {
                                        cb(null, require('../components/material/inventory_detail.js').default);
                                    }, 'inventory_detail');
                                }
                            }
                        ]
                    },
                    //物资接收
                    {
                        path: 'receive',
                        onEnter,
                        getComponent(location, cb) {
                            require.ensure([], require => {
                                cb(null, require('../components/material/receive.js').default);
                            }, 'receive');
                        },
                        childRoutes: [
                            {
                                path: 'receive_detail',
                                onEnter,
                                getComponent (location, cb) {
                                    require.ensure([], require => {
                                        cb(null, require('../components/material/receive_detail.js').default);
                                    }, 'receive_detail');
                                }
                            }
                        ]
                    },
                    //物资发放
                    {
                        path: 'release',
                        onEnter,
                        getComponent(location, cb) {
                            require.ensure([], require => {
                                cb(null, require('../components/material/release.js').default);
                            }, 'release');
                        },
                        childRoutes: [
                            {
                                path: 'release_detail',
                                onEnter,
                                getComponent (location, cb) {
                                    require.ensure([], require => {
                                        cb(null, require('../components/material/release_detail.js').default);
                                    }, 'release_detail');
                                }
                            }
                        ]
                    },
                    //库房管理
                    {
                        path: 'storeroom',
                        onEnter,
                        getComponent(location, cb) {
                            require.ensure([], require => {
                                cb(null, require('../components/material/storeroom.js').default);
                            }, 'storeroom');
                        },
                        childRoutes: [
                            {
                                path: 'storeroom_detail',
                                onEnter,
                                getComponent (location, cb) {
                                    require.ensure([], require => {
                                        cb(null, require('../components/material/storeroom_detail.js').default);
                                    }, 'storeroom_detail');
                                }
                            },
                            {
                                path: 'storeroom_detail_2',
                                onEnter,
                                getComponent (location, cb) {
                                    require.ensure([], require => {
                                        cb(null, require('../components/material/storeroom_detail_2.js').default);
                                    }, 'storeroom_detail_2');
                                }
                            }
                        ]
                    },
                    //库存盘点
                    {
                        path: 'check',
                        onEnter,
                        getComponent(location, cb) {
                            require.ensure([], require => {
                                cb(null, require('../components/material/check.js').default);
                            }, 'check');
                        },
                        childRoutes: [
                            {
                                path: 'check_detail',
                                onEnter,
                                getComponent (location, cb) {
                                    require.ensure([], require => {
                                        cb(null, require('../components/material/check_detail.js').default);
                                    }, 'check_detail');
                                }
                            }
                        ]
                    }
                ]
            },
            // 报表管理
            {
                path: 'report',
                getComponent(location, cb) {
                    require.ensure([], require => {
                        cb(null, require('../components/report/').default);
                    }, 'report');
                },
                childRoutes: [
                    {
                        path: 'data_report',
                        onEnter,
                        getComponent(location, cb) {
                            require.ensure([], require => {
                                cb(null, require('../components/report/data_report.js').default);
                            }, 'data_report');
                        }
                    },
                    {
                        path: 'kpi_report',
                        onEnter,
                        getComponent(location, cb) {
                            require.ensure([], require => {
                                cb(null, require('../components/report/kpi_report.js').default);
                            }, 'kpi_report');
                        }
                    }
                ]
            },
            //环境监测
            {
                path: 'environmental',
                getComponent(location, cb) {
                    require.ensure([], require => {
                        cb(null, require('../components/environmental/').default);
                    }, 'environmental');
                },
                childRoutes: [
                    {
                        path: 'environment_asset',
                        onEnter,
                        getComponent(location, cb) {
                            require.ensure([], require => {
                                cb(null, require('../components/environmental/environment_asset.js').default);
                            }, 'environment_asset');
                        },
                        childRoutes: [
                            {
                                path: 'detail',
                                onEnter,
                                getComponent (location, cb) {
                                    require.ensure([], require => {
                                        cb(null, require('../components/environmental/environment_asset_detail.js').default);
                                    }, 'detail');
                                }
                            }
                        ]


                    }
                ]
            },
            // 报事报修
            {
                path: 'matter_repair',
                getComponent(location, cb) {
                    require.ensure([], require => {
                        cb(null, require('../components/matter_repair/').default);
                    }, 'matter_repair');
                },
                childRoutes: [
                    {
                        path: 'repair',
                        onEnter,
                        getComponent(location, cb) {
                            require.ensure([], require => {
                                cb(null, require('../components/matter_repair/repair.js').default);
                            }, 'repair');
                        },
                        childRoutes: [
                            {
                                path: 'repair_tab1',
                                onEnter,
                                getComponent(location, cb) {
                                    require.ensure([], require => {
                                        cb(null, require('../components/matter_repair/repair_tab1.js').default);
                                    }, 'repair_tab1');
                                }
                            },
                            {
                                path: 'repair_tab2',
                                onEnter,
                                getComponent(location, cb) {
                                    require.ensure([], require => {
                                        cb(null, require('../components/matter_repair/repair_tab2.js').default);
                                    }, 'repair_tab2');
                                }
                            }, {
                                path: 'repair_tab3',
                                onEnter,
                                getComponent(location, cb) {
                                    require.ensure([], require => {
                                        cb(null, require('../components/matter_repair/repair_tab3.js').default);
                                    }, 'repair_tab3');
                                }
                            },
                            {
                                path: 'repair_tab4',
                                onEnter,
                                getComponent(location, cb) {
                                    require.ensure([], require => {
                                        cb(null, require('../components/matter_repair/repair_tab4.js').default);
                                    }, 'repair_tab4');
                                }
                            }
                        ]
                    },
                    {
                        path: 'dispatch',
                        onEnter,
                        getComponent(location, cb) {
                            require.ensure([], require => {
                                cb(null, require('../components/matter_repair/dispatch.js').default);
                            }, 'dispatch');
                        },

                        childRoutes: [
                            {
                                path: 'dispatch_tab1',
                                onEnter,
                                getComponent(location, cb) {
                                    require.ensure([], require => {
                                        cb(null, require('../components/matter_repair/dispatch_tab1.js').default);
                                    }, 'dispatch_tab1');
                                }
                            },
                             {
                                path: 'dispatch_tab',
                                onEnter,
                                getComponent(location, cb) {
                                    require.ensure([], require => {
                                        cb(null, require('../components/matter_repair/dispatch_tab.js').default);
                                    }, 'dispatch_tab');
                                }
                            },
                            {
                                path: 'dispatch_tab2',
                                onEnter,
                                getComponent(location, cb) {
                                    require.ensure([], require => {
                                        cb(null, require('../components/matter_repair/dispatch_tab2.js').default);
                                    }, 'dispatch_tab2');
                                }
                            }, {
                                path: 'dispatch_tab3',
                                onEnter,
                                getComponent(location, cb) {
                                    require.ensure([], require => {
                                        cb(null, require('../components/matter_repair/dispatch_tab3.js').default);
                                    }, 'dispatch_tab3');
                                }
                            },
                            {
                                path: 'dispatch_tab4',
                                onEnter,
                                getComponent(location, cb) {
                                    require.ensure([], require => {
                                        cb(null, require('../components/matter_repair/dispatch_tab4.js').default);
                                    }, 'dispatch_tab4');
                                }
                            }
                        ]
                    }
                ]
            },
            //安全管理
            {
                path: 'security',
                getComponent(location, cb) {
                    require.ensure([], require => {
                        cb(null, require('../components/security/').default);
                    }, 'security');
                },
                childRoutes: [
                    //安全检查标准库
                    {
                        path: 'library',
                        onEnter,
                        getComponent(location, cb) {
                            require.ensure([], require => {
                                cb(null, require('../components/security/library.js').default);
                            }, 'library');
                        },
                        childRoutes: [
                            {
                                path: 'library_detail',
                                onEnter,
                                getComponent (location, cb) {
                                    require.ensure([], require => {
                                        cb(null, require('../components/security/library_detail.js').default);
                                    }, 'library_detail');
                                }
                            }
                        ]
                    },
                    //安全检查单
                    {
                        path: 'check_list',
                        onEnter,
                        getComponent(location, cb) {
                            require.ensure([], require => {
                                cb(null, require('../components/security/check_list.js').default);
                            }, 'check_list');
                        },
                        childRoutes: [
                            {
                                path: 'check_list_detail',
                                onEnter,
                                getComponent (location, cb) {
                                    require.ensure([], require => {
                                        cb(null, require('../components/security/check_list_detail.js').default);
                                    }, 'check_list_detail');
                                }
                            }
                        ]
                    },
                    //安全检查计划
                    {
                        path: 'check_plan',
                        onEnter,
                        getComponent(location, cb) {
                            require.ensure([], require => {
                                cb(null, require('../components/security/check_plan.js').default);
                            }, 'check_plan');
                        },
                        childRoutes: [
                            {
                                path: 'check_plan_detail',
                                onEnter,
                                getComponent (location, cb) {
                                    require.ensure([], require => {
                                        cb(null, require('../components/security/check_plan_detail.js').default);
                                    }, 'check_plan_detail');
                                }
                            }
                        ]
                    },
                    //安全整改单
                    {
                        path: 'rectification',
                        onEnter,
                        getComponent(location, cb) {
                            require.ensure([], require => {
                                cb(null, require('../components/security/rectification.js').default);
                            }, 'rectification');
                        },
                        childRoutes: [
                            {
                                path: 'rectification_detail',
                                onEnter,
                                getComponent (location, cb) {
                                    require.ensure([], require => {
                                        cb(null, require('../components/security/rectification_detail.js').default);
                                    }, 'rectification_detail');
                                }
                            }
                        ]
                    },
                    //安全库存台账
                    {
                        path: 'stock_ledger',
                        onEnter,
                        getComponent(location, cb) {
                            require.ensure([], require => {
                                cb(null, require('../components/security/stock_ledger.js').default);
                            }, 'stock_ledger');
                        },
                        childRoutes: [
                            {
                                path: 'stock_ledger_detail',
                                onEnter,
                                getComponent (location, cb) {
                                    require.ensure([], require => {
                                        cb(null, require('../components/security/stock_ledger_detail.js').default);
                                    }, 'stock_ledger_detail');
                                }
                            }
                        ]
                    },
                    //安全库存检查单
                    {
                        path: 'stock_list',
                        onEnter,
                        getComponent(location, cb) {
                            require.ensure([], require => {
                                cb(null, require('../components/security/stock_list.js').default);
                            }, 'stock_list');
                        },
                        childRoutes: [
                            {
                                path: 'stock_list_detail',
                                onEnter,
                                getComponent (location, cb) {
                                    require.ensure([], require => {
                                        cb(null, require('../components/security/stock_list_detail.js').default);
                                    }, 'stock_list_detail');
                                }
                            }
                        ]
                    }
                ]
            },
            //钥匙管理
            {
                path: 'key',
                getComponent(location, cb) {
                    require.ensure([], require => {
                        cb(null, require('../components/key/').default);
                    }, 'key');
                },
                childRoutes: [
                    //锁管理
                    {
                        path: 'lock',
                        onEnter,
                        getComponent(location, cb) {
                            require.ensure([], require => {
                                cb(null, require('../components/key/lock.js').default);
                            }, 'lock');
                        },
                        childRoutes: [
                            {
                                path: 'lock_detail',
                                onEnter,
                                getComponent (location, cb) {
                                    require.ensure([], require => {
                                        cb(null, require('../components/key/lock_detail.js').default);
                                    }, 'lock_detail');
                                }
                            }
                        ]
                    },
                    //钥匙管理
                    {
                        path: 'manage',
                        onEnter,
                        getComponent(location, cb) {
                            require.ensure([], require => {
                                cb(null, require('../components/key/manage.js').default);
                            }, 'manage');
                        },
                        childRoutes: [
                            {
                                path: 'manage_detail',
                                onEnter,
                                getComponent (location, cb) {
                                    require.ensure([], require => {
                                        cb(null, require('../components/key/manage_detail.js').default);
                                    }, 'manage_detail');
                                }
                            },
                            {
                                path: 'manage_detail_2',
                                onEnter,
                                getComponent (location, cb) {
                                    require.ensure([], require => {
                                        cb(null, require('../components/key/manage_detail_2.js').default);
                                    }, 'manage_detail_2');
                                }
                            },
                            {
                                path: 'manage_detail_3',
                                onEnter,
                                getComponent (location, cb) {
                                    require.ensure([], require => {
                                        cb(null, require('../components/key/manage_detail_3.js').default);
                                    }, 'manage_detail_3');
                                }
                            }
                        ]
                    },
                    //钥匙申请单
                    {
                        path: 'application',
                        onEnter,
                        getComponent(location, cb) {
                            require.ensure([], require => {
                                cb(null, require('../components/key/application.js').default);
                            }, 'application');
                        },
                        childRoutes: [
                            {
                                path: 'application_detail',
                                onEnter,
                                getComponent (location, cb) {
                                    require.ensure([], require => {
                                        cb(null, require('../components/key/application_detail.js').default);
                                    }, 'application_detail');
                                }
                            }
                        ]
                    },
                ]
            },
            //培训管理
            {
                path: 'train_manage',
                getComponent(location, cb) {
                    require.ensure([], require => {
                        cb(null, require('../components/train_manage/').default);
                    }, 'train_manage');
                },
                childRoutes: [
                    {
                        path: 'train',
                        onEnter,
                        getComponent(location, cb) {
                            require.ensure([], require => {
                                cb(null, require('../components/train_manage/train.js').default);
                            }, 'train');
                        },
                        childRoutes: [
                            {
                                path: 'train_detail',
                                onEnter,
                                getComponent (location, cb) {
                                    require.ensure([], require => {
                                        cb(null, require('../components/train_manage/train_detail.js').default);
                                    }, 'train_detail');
                                }
                            },
                            {
                                path: 'train_detail_2',
                                onEnter,
                                getComponent (location, cb) {
                                    require.ensure([], require => {
                                        cb(null, require('../components/train_manage/train_detail_2.js').default);
                                    }, 'train_detail_2');
                                }
                            },
                            {
                                path: 'train_detail_3',
                                onEnter,
                                getComponent (location, cb) {
                                    require.ensure([], require => {
                                        cb(null, require('../components/train_manage/train_detail_3.js').default);
                                    }, 'train_detail_3');
                                }
                            }
                        ]
                    },
                ]
            },
            //档案管理
            {
                path: 'archives_managent',
                onEnter,
                getComponent(location, cb) {
                    require.ensure([], require => {
                        cb(null, require('../components/archives_managent/').default);
                    }, 'archives_managent');
                },
                childRoutes: [
                    {
                        path: 'archives',
                        onEnter,
                        getComponent (location, cb) {
                            require.ensure([], require => {
                                cb(null, require('../components/archives_managent/archives.js').default);
                            }, 'archives');
                        },
                        childRoutes: [
                            {
                                path: 'archives_detail',
                                onEnter,
                                getComponent (location, cb) {
                                    require.ensure([], require => {
                                        cb(null, require('../components/archives_managent/archives_detail.js').default);
                                    }, 'archives_detail');
                                }
                            },
                        ]
                    }
                ]
            },
            //合同管理
            {
                path: 'contract',
                onEnter,
                getComponent(location, cb) {
                    require.ensure([], require => {
                        cb(null, require('../components/contract/').default);
                    }, 'contract');
                },
                childRoutes: [
                    {
                        path: 'manage',
                        onEnter,
                        getComponent (location, cb) {
                            require.ensure([], require => {
                                cb(null, require('../components/contract/manage.js').default);
                            }, 'manage');
                        },
                        childRoutes: [
                            {
                                path: 'manage_info',
                                onEnter,
                                getComponent (location, cb) {
                                    require.ensure([], require => {
                                        cb(null, require('../components/contract/manage_info.js').default);
                                    }, 'manage_info');
                                }
                            },
                            {
                                path: 'manage_construction',
                                onEnter,
                                getComponent (location, cb) {
                                    require.ensure([], require => {
                                        cb(null, require('../components/contract/manage_construction.js').default);
                                    }, 'manage_construction');
                                }
                            },
                            {
                                path: 'manage_plan',
                                onEnter,
                                getComponent (location, cb) {
                                    require.ensure([], require => {
                                        cb(null, require('../components/contract/manage_plan.js').default);
                                    }, 'manage_plan');
                                }
                            },
                            {
                                path: 'manage_order',
                                onEnter,
                                getComponent (location, cb) {
                                    require.ensure([], require => {
                                        cb(null, require('../components/contract/manage_order.js').default);
                                    }, 'manage_order');
                                }
                            },
                            {
                                path: 'manage_order2',
                                onEnter,
                                getComponent (location, cb) {
                                    require.ensure([], require => {
                                        cb(null, require('../components/contract/manage_order2.js').default);
                                    }, 'manage_order2');
                                }
                            }
                        ]
                    },
                    {
                        path: 'construction',
                        onEnter,
                        getComponent(location, cb) {
                            require.ensure([], require => {
                                cb(null, require('../components/contract/construction.js').default);
                            }, 'construction');
                        },
                        childRoutes: [
                            {
                                path: 'construction_info',
                                getComponent(location, cb) {
                                    require.ensure([], require => {
                                        cb(null, require('../components/contract/construction_info.js').default);
                                    }, 'construction_info');
                                }
                            }
                        ]
                    }
                ]
            },
        ]
    },
    {
        path: '*',
        getComponent(location, cb) {
            require.ensure([], require => {
                cb(null, require('../components/404.js').default);
            }, '404');
        }
    }
];
