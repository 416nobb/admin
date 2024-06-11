import { defineConfig, loadEnv } from 'vite'
import vue from '@vitejs/plugin-vue'
import { viteMockServe } from 'vite-plugin-mock'
import path from "path"
// https://vitejs.dev/config/

export default defineConfig(({ command, mode }) => {
  let env = loadEnv(mode, process.cwd());
  return {
    plugins: [vue(),
    viteMockServe({
      // default
      // mockPath: 'mock',
      localEnabled: command === 'serve',
      // enable: true,
    }),
    ],
    resolve: {
      alias: {
        "@": path.resolve("./src")
      }
    },
    //scss全局变量
    css: {
      preprocessorOptions: {
        scss: {
          additionalData: `@import "@/styles/variable.scss";`
        }
      }
    },
    server: {
      proxy: {
        [env.VITE_APP_BASE_API]: {
          //获取服务器地址设置
          target: env.VITE_SERVE,
          //是否需要代理跨域
          changeOrigin: true,
          //路径重写
          rewrite: (path) => path.replace(/^\/api/, ''),
        }
      },
      host:'0.0.0.0'
    }
  }
})

// export default defineConfig({
//   plugins: [vue(),
//   viteMockServe({
//     // default
//     mockPath: 'mock',
//     // localEnabled:command ==='serve',
//     enable: true,
//   }),
//   ],
//   resolve: {
//     alias: {
//       "@": path.resolve("./src")
//     }
//   },
//   //scss全局变量
//   css: {
//     preprocessorOptions: {
//       scss: {
//         additionalData: `@import "@/styles/variable.scss";`
//       }
//     }
//   }
// })
