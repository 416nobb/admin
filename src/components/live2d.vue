<template>
    <canvas id="showbox" ref="liveCanvas"></canvas>
    <div ref="_name" v-show="false">{{ value }}</div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import * as PIXI from 'pixi.js';
import {
    // Live2DModel,
    MotionPreloadStrategy,
    InternalModel,
} from 'pixi-live2d-display';
import { Live2DModel } from 'pixi-live2d-display/cubism4';


window.PIXI = PIXI;

let app;
let model;
const liveCanvas = ref(null);


let _name = ref('');
//接收父组件传递的name
let prop = defineProps(['name']);
let value = ref(prop.name);

const name = [
  'nengdai_2'
    ];
const options = name.map((item)=>{
  return {
    value: item,
    label: item,
  }
})

const changeName = ()=>{
//   console.log(value.value);

}
onMounted(() => {
    const play_live2d = async(live2dName)=>{
        app = new PIXI.Application({
        view: liveCanvas.value || undefined,
        width:2400,
        height:1800,
        autoStart: true,
        transparent: true,
        autoDensity: true,
        // autoResize: true,
        // antialias: true,
        resizeTo: window,
        // backgroundColor: 0x111111,
    });
    function get_name(name) {
        return `./public/live2d/${name}/${name}.model3.json`
    };
    //加载模型地址
    model = await Live2DModel.from(get_name(live2dName));
    //添加模型
    app.stage.addChild(model);
    //缩放
    model.scale.set(0.09);
    // 模型的位置,x,y相较于窗口左上角
    model.x = -50
    model.y = -10
    //随机动作播放
    model.on('pointerdown', (hitAreas) => {
        // hitAreas:模型的一些上下文
        // 获取所有动作的数组
        var motions = Object.keys(model.internalModel.motionManager.motionGroups);
        console.log("所有动作为:"+motions);

        // 随机选择一个动作并播放
        var randomMotion = motions[Math.floor(Math.random() * motions.length)];
        //执行动作
        model.motion(randomMotion)
        console.log("执行动作为:"+randomMotion);

    });
    // 绑定模型点击事件动作
    // model.on('pointerdown', (hitAreas) => {
    //     // hitAreas:模型的一些上下文
    //     const { x, y } = hitAreas.data.global
    //     const point = model.hitTest(x, y)
    //     if (point.includes("body")) {
    //         model.motion("home");
    //     }
    // });
    draggable(model);
    // addFrame(model);

    // var hitAreas = model.internalModel.hitAreas;
    // model.addChild(hitAreas)
    }
    const live2dName = _name.value.textContent;

        
    play_live2d(live2dName);
    
    
    
})



//拖动模型
function draggable(model) {
    model.buttonMode = true;
    model.on("pointerdown", (e) => {
        model.dragging = true;
        model._pointerX = e.data.global.x - model.x;
        model._pointerY = e.data.global.y - model.y;
    });
    model.on("pointermove", (e) => {
        if (model.dragging) {
            model.position.x = e.data.global.x - model._pointerX;
            model.position.y = e.data.global.y - model._pointerY;
        }
    });
    model.on("pointerupoutside", () => (model.dragging = false));
    model.on("pointerup", () => (model.dragging = false));
}

function addFrame(model) {
    const foreground = PIXI.Sprite.from(PIXI.Texture.WHITE);
    foreground.width = model.internalModel.width;
    foreground.height = model.internalModel.height;
    foreground.alpha = 0.2;

    model.addChild(foreground);
    foreground.visible = true
}

</script>

<style lang="scss" scoped>
#showbox {
    position: relative;
    top: 20px;
    width: 100%;
    height: 100%;
    // border: 1px solid;
}
</style>