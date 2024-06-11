//权限管理-用户管理模块
import request from '@/utils/request.js';

const API = {
  //获取全部已有用户账号信息
  ALLUSER_URL: '/admin/acl/user/',
  //添加一个新的用户账号
  ADDUSER_URL: '/admin/acl/user/save',
  //更新已有的用户账号
  UPDATEUSER_URL: '/admin/acl/user/update',
  //获取全部职位
  ALLROLE_URL: '/admin/acl/user/toAssign/',
  //用户分配
  SETROLE_URL: '/admin/acl/user/doAssignRole',
  //用户删除
  DELETEUSER_URL: '/admin/acl/user/remove/',
  //批量删除
  DELETESELECTEDUSER_URL: '/admin/acl/user/batchRemove/',
}

//获取用户信息
export const reqUserInfo = (page, limit, username) => request.get(API.ALLUSER_URL + `${page}/${limit}/?username=${username}`);
//添加用户与更新已有用户的接口
export const reqAddOrUpdateUser = (data) => {
  //携带参数有ID更新
  if (data.id) {
    return request.put(API.UPDATEUSER_URL, data);
  } else {
    return request.post(API.ADDUSER_URL, data);
  }
}
//获取全部职位
export const reqAllRole = (userId) => request.get(API.ALLROLE_URL + userId);
//分配角色
export const reqSetRole = (data) => request.post(API.SETROLE_URL, data);
//单独删除
export const reqRemoveUser = (userId) => request.delete(API.DELETEUSER_URL + userId);
//批量删除
export const reqRemoveSelectedUser = (userList) => request.delete(API.DELETESELECTEDUSER_URL, { data: userList });
