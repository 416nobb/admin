//对外暴露配置路由(常量路由)
export const constantRoute = [
    //登录
    {
        path: '/login',
        component: () => import('@/view/login/index.vue'),
        name: 'login',//命名路由
        meta: {
            title: '登录',//菜单标题
            icon: 'Lock',
            hidden: true,
        },
    },
    //首页
    {
        path: '/',
        component: () => import('@/layout/index.vue'),
        name: 'layout',//命名路由
        meta: {
            title: '',
            icon: '',
            hidden: false,

        },
        redirect: '/home',
        children: [
            {
                path: '/home',
                component: () => import('@/view/home/index.vue'),
                meta: {
                    title: '首页',//菜单标题
                    icon: 'Lock',
                    hidden: false,

                },
            }
        ]
    },
    
    //ACL管理（用户、菜单、角色）
    {
        path: '/acl',
        component: () => import('@/layout/index.vue'),
        name: 'Acl',//命名路由
        meta: {
            title: '权限管理',
            hidden: false,
            icon: 'Lock',
        },
        redirect: '/acl/user',
        children: [
            {
                path: '/acl/user',
                component: () => import('@/view/acl/user/index.vue'),
                name: 'Acl',
                meta: {
                    title: '用户管理',//菜单标题
                    hidden: false,
                    icon: 'User',
                },
            },
            {
                path: '/acl/role',
                component: () => import('@/view/acl/role/index.vue'),
                name: 'Role',
                meta: {
                    title: '角色管理',//菜单标题
                    hidden: false,
                    icon: 'User',
                },
            },
            {
                path: '/acl/menu',
                component: () => import('@/view/acl/menu/index.vue'),
                name: 'menu',
                meta: {
                    title: '菜单管理',//菜单标题
                    hidden: false,
                    icon: 'Monitor',
                },
            },

        ]
    },
    //商品管理
    {
        path: '/product',
        component: () => import('@/layout/index.vue'),
        name: 'Product',//命名路由
        redirect:'/product/attr',
        meta: {
            title: '商品管理',
            hidden: false,
            icon: 'Goods',

        },
        children: [
            {
                path: '/product/attr',
                component: () => import('@/view/product/attr/index.vue'),
                name: 'Attr',
                meta: {
                    title: '属性管理',//菜单标题
                    hidden: false,
                    icon: 'ChromeFilled',
                },
            },
            {
                path: '/product/sku',
                component: () => import('@/view/product/sku/index.vue'),
                name: 'Sku',
                meta: {
                    title: 'SKU管理',//菜单标题
                    hidden: false,
                    icon: 'User',
                },
            },
            {
                path: '/product/spu',
                component: () => import('@/view/product/spu/index.vue'),
                name: 'Spu',
                meta: {
                    title: 'SPU管理',//菜单标题
                    hidden: false,
                    icon: 'Calendar',
                },
            },
            {
                path: '/product/trademark',
                component: () => import('@/view/product/trademark/index.vue'),
                name: 'Trademark',
                meta: {
                    title: '品牌管理',//菜单标题
                    hidden: false,
                    icon: 'ShoppingCartFull',
                },
            },

        ]
    },
    //404
    {
        path: '/404',
        component: () => import('@/view/404/index.vue'),
        name: '404',//命名路由
        meta: {
            title: '404',//菜单标题
            icon: 'Lock',
            hidden: true,

        },
    },
    //重定向
    {
        path: '/:pathMatch(.*)*',
        redirect: '/404',
        name: 'Any',
        meta: {
            title: '不存在页面',//菜单标题
            hidden: true,
            icon: 'Lock',

        },
    },
]