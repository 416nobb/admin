//角色管理-用户管理模块
import request from '@/utils/request.js';

const API = {
    //获取全部的职位接口
    ALLROLE_URL: '/admin/acl/role/',
    //新增岗位的接口地址
    ADDROLE_URL: '/admin/acl/role/save',
    //更新已有的职位
    UPDATEROLE_URL: '/admin/acl/role/update',
    //获取全部的菜单与按钮的数据
    ALLPERMISSTION: '/admin/acl/permission/toAssign/',
    //给相应的职位分配权限
    SETPERMISTION_URL: '/admin/acl/permission/doAssign/?',
    //删除已有的菜单
    DELETEMENU_URL: '/admin/acl/role/remove/',
};

//获取全部的角色
export const reqAllRoleList = (page, limit, roleName) => request.get(API.ALLROLE_URL + `${page}/${limit}/?roleName=${roleName}`);
//添加职位与更新已有职位接口
export const reqAddOrUpdateRole = (data) => {
    if (data.id) {
        return request.put(API.UPDATEROLE_URL, data);
    } else {
        return request.post(API.ADDROLE_URL, data);
    }
};
//获取全部菜单与按钮权限数据
export const reqAllMenuList = (roleId) => {
    return request.get(API.ALLPERMISSTION + roleId)
};
//给相应的职位下发权限
export const reqSetPermisstion = (roleId, permissionId) => request.post(API.SETPERMISTION_URL + `roleId=${roleId}&permissionId=${permissionId}`);
//删除某一个已有的菜单
export const reqRemoveRole = (id) => request.delete(API.DELETEMENU_URL + id);