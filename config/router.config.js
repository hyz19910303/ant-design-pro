export default[
  // user
  {
    path: '/user',
    component: '../layouts/UserLayout',
    routes: [{
        path: '/user',
        redirect: '/user/login'
      }, {
        path: '/user/login',
        component: './User/Login'
      }, {
        path: '/user/register',
        component: './User/Register'
      }, {
        path: '/user/register-result',
        component: './User/RegisterResult'
      },
    ],
  },
  // app
  {
    path: '/',
    component: '../layouts/BasicLayout',
    Routes: ['src/pages/Authorized'],
    //authority: ['admin', 'user'],
    routes: [
      // dashboard
      {
        path: '/',
        redirect: '/demo/dashboard/analysis'
      }, {
        path: '/system',
        icon: 'home',
        name: 'systemManager',
        routes: [{
            path: '/system/role/rolelist',
            name: 'rolelist',
            component: './Role/RoleList',
          }, {
            path: '/system/user/userlist',
            name: 'userlist',
            component: './User/UserList',
          }, {
            path: '/system/menu/menulist',
            name: 'menulist',
            component: './Menu/MenuList',
          },
        ]
      }, {
        path: '/demo',
        icon: 'home',
        name: 'demo',
        routes: [{
            path: 'dashboard',
            name: 'dashboard',
            icon: 'dashboard',
            routes: [{
                path: 'analysis',
                name: 'analysis',
                component: './Dashboard/Analysis',
              }, {
                path: 'monitor',
                name: 'monitor',
                component: './Dashboard/Monitor',
              }, {
                path: 'workplace',
                name: 'workplace',
                component: './Dashboard/Workplace',
              },
            ],
          },
          // forms
          {
            path: 'form',
            icon: 'form',
            name: 'form',
            routes: [{
                path: 'basic-form',
                name: 'basicform',
                component: './Forms/BasicForm',
              }, {
                path: 'step-form',
                name: 'stepform',
                component: './Forms/StepForm',
                hideChildrenInMenu: true,
                routes: [{
                    path: '/demo/form/step-form',
                    redirect: '/demo/form/step-form/info',
                  }, {
                    path: 'info',
                    name: 'info',
                    component: './Forms/StepForm/Step1',
                  }, {
                    path: 'confirm',
                    name: 'confirm',
                    component: './Forms/StepForm/Step2',
                  }, {
                    path: 'result',
                    name: 'result',
                    component: './Forms/StepForm/Step3',
                  },
                ],
              }, {
                path: 'advanced-form',
                name: 'advancedform',
                authority: ['admin'],
                component: './Forms/AdvancedForm',
              },
            ],
          }, {
            path: 'list',
            icon: 'table',
            name: 'list',
            routes: [{
                path: 'table-list',
                name: 'searchtable',
                component: './List/TableList',
              }, {
                path: 'basic-list',
                name: 'basiclist',
                component: './List/BasicList',
              }, {
                path: 'card-list',
                name: 'cardlist',
                component: './List/CardList',
              }, {
                path: 'search',
                name: 'searchlist',
                component: './List/List',
                routes: [{
                    path: 'search',
                    redirect: '/list/search/articles',
                  }, {
                    path: 'search/articles',
                    name: 'articles',
                    component: './List/Articles',
                  }, {
                    path: 'search/projects',
                    name: 'projects',
                    component: './List/Projects',
                  }, {
                    path: 'search/applications',
                    name: 'applications',
                    component: './List/Applications',
                  },
                ],
              },
            ],
          }, {
            path: 'profile',
            name: 'profile',
            icon: 'profile',
            routes: [
              // profile
              {
                path: 'basic',
                name: 'basic',
                component: './Profile/BasicProfile',
              }, {
                path: 'advanced',
                name: 'advanced',
                authority: ['admin'],
                component: './Profile/AdvancedProfile',
              },
            ],
          }, {
            name: 'result',
            icon: 'check-circle-o',
            path: 'result',
            routes: [
              // result
              {
                path: 'success',
                name: 'success',
                component: './Result/Success',
              }, {
                path: 'fail',
                name: 'fail',
                component: './Result/Error'
              },
            ],
          }, {
            name: 'exception',
            icon: 'warning',
            path: 'exception',
            routes: [
              // exception
              {
                path: '403',
                name: 'not-permission',
                component: './Exception/403',
              }, {
                path: '404',
                name: 'not-find',
                component: './Exception/404',
              }, {
                path: '500',
                name: 'server-error',
                component: './Exception/500',
              }, {
                path: 'trigger',
                name: 'trigger',
                hideInMenu: true,
                component: './Exception/TriggerException',
              },
            ],
          },
        ]
      }, {
        name: 'account',
        icon: 'user',
        path: '/account',
        routes: [{
            path: '/account/center',
            name: 'center',
            component: './Account/Center/Center',
            routes: [{
                path: '/account/center',
                redirect: '/account/center/articles',
              }, {
                path: '/account/center/articles',
                component: './Account/Center/Articles',
              }, {
                path: '/account/center/applications',
                component: './Account/Center/Applications',
              }, {
                path: '/account/center/projects',
                component: './Account/Center/Projects',
              },
            ],
          }, {
            path: '/account/settings',
            name: 'settings',
            component: './Account/Settings/Info',
            routes: [{
                path: '/account/settings',
                redirect: '/account/settings/base',
              }, {
                path: '/account/settings/base',
                component: './Account/Settings/BaseView',
              }, {
                path: '/account/settings/security',
                component: './Account/Settings/SecurityView',
              }, {
                path: '/account/settings/binding',
                component: './Account/Settings/BindingView',
              }, {
                path: '/account/settings/notification',
                component: './Account/Settings/NotificationView',
              },
            ],
          },
        ],
      }, {
        component: '404',
      },
    ],
  },
];