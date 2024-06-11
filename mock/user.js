// test.ts
//返回数组
function createUserList() {
  return [
    {
      userId: 1,
      avatar: 'https://wpimg.wallstcn.com/f778738c-e4f8-4870-b634-56703b4acafe.gif',
      username: 'admin',
      password: '111111',
      desc: '平台管理员',
      roles: ['平台管理员'],
      buttons: ['cuser.detail'],
      routes: ['home'],
      token: 'Admin Token',
    },
    {
      userId: 2,
      avatar: 'https://wpimg.wallstcn.com/f778738c-e4f8-4870-b634-56703b4acafe.gif',
      username: 'system',
      password: '111111',
      desc: '系统管理员',
      roles: ['系统管理员'],
      buttons: ['cuser.detail', 'cuser.user'],
      routes: ['home'],
      token: 'System Token',
    },
  ]
}

export default [
  //用户登录接口
  {
    url: '/api/user/login',
    method: 'post',
    response: ({ body }) => {
      //获取请求体用户名密码
      const { username, password } = body;
      const checkUser = createUserList().find(
        (item) => item.username === username && item.password === password,
      )

      if (!checkUser) {
        return { code: 201, data: { message: "账号或密码错误" } }
      }

      const { token } = checkUser
      return { code: 200, data: { token } }
    },
  },
  //获取用户信息
  {
    url: '/api/user/info',
    method: 'get',
    response: (e) => {

      console.log(e.headers.token);

      //分支1,传参token的话，用  e.query.token
      // const token = e.query.token; // 使用 config 获取请求头中的 token
      // const user = createUserList().find((item) => item.token === token);

      //分支2，不传参，用 e.headers.token
      const token = e.headers.token; // 使用 config 获取请求头中的 token
      const checkUser = createUserList().find((item) => item.token === token);
  
      if (!checkUser) {
        return [201, { message: '获取用户信息失败' }];
      }
  
      return { code: 200, data: { checkUser } }
    },
  }
]