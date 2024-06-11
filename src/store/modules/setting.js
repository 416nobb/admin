//layout组件配置
import { defineStore } from 'pinia';

let useLayOutSettingStore = defineStore('SettingStore', {
    state: () => {
        return {
            fold: false,//控制菜单折叠
        }
    }
})

export default useLayOutSettingStore;