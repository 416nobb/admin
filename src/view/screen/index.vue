<template>
  <el-button type="primary" @click="tag = 1">第一组</el-button>
  <el-button type="primary" @click="tag = 2">第二组</el-button>
  <el-button type="primary" @click="tag = 3">第三组</el-button>

  <el-card>
    <span>第一组</span>
  </el-card>
  <el-card v-if="tag == 1" title="0203/0303" v-for="(item, index) in name1" :key="index" class="playerBox">
    <video :src="`/public/legend_clover_CG/${item}_mo_0203.usm_40534656.mp4`" controls loop class="player"></video>
    <video :src="`/public/legend_clover_CG/${item}_mo_0303.usm_40534656.mp4`" controls loop class="player"></video>
  </el-card>
  <el-card v-if="tag == 3" title="0203/0303" v-for="(item, index) in name3" :key="index" class="playerBox">
    <video :src="`/public/legend_clover_CG/${item}_mo_0203.usm_40534656.mp4`" controls loop class="player"></video>
    <video :src="`/public/legend_clover_CG/${item}_mo_0303.usm_40534656.mp4`" controls loop class="player"></video>
  </el-card>

  <el-card>
    <span>第2组</span>
  </el-card>

  <el-card v-if="tag == 2" title="0203/0302" v-for="(item, index) in name2" :key="index" class="playerBox">
    <video :src="`/public/legend_clover_CG/${item}_mo_0203.usm_40534656.mp4`" controls loop class="player"></video>
    <video :src="`/public/legend_clover_CG/${item}_mo_0302.usm_40534656.mp4`" controls loop class="player"></video>
  </el-card>

  <el-card>
    <span>单走</span>
  </el-card>

  <el-card v-if="true" title="单走" v-for="(item, index) in name_one" :key="index" class="playerBox">
    <video :src="`/public/legend_clover_CG/${item}_mo_0203.usm_40534656.mp4`" controls loop class="player"
      type="video/mp4"></video>
  </el-card>

  <!-- <video controls>
    <source :src="`/public/legend_clover_CG/hs_gilles_de_rais_mo_0203.usm_40534656.mp4`" type="video/mp4">
    您的浏览器不支持视频播放。
  </video> -->
  

</template>

<script setup>
import { ref, reactive } from "vue"

//显示分组
let tag = ref(0);

//1组 0303-0203
let name1 = ref(
  ["hs_nero_wedding", "hs_siegfried_wedding", "hs_siegfried_anniversary", "hs_siegfried", "hs_arthur_valentine", "hs_arthur_christmas", "hs_arthur", "hs_jeanne_2nd", "hs_jeanne_anniversary", "hs_jeanne_mizugi", "hs_nero", "hs_cu_chulainn_halloween", "hs_cu_chulainn", "hs_yamatotakeru_shogatsu", "hs_yamatotakeru", "hs_yamatotakeru_future", "hs_yamatotakeru_half", "hs_marie_antoinette", "hs_yamatotakeru_gakuen", "hs_solomon", "hs_marie_antoinette_yukata", "hs_solomon_link", "hs_solomon_halloween", "hs_ryofu", "hs_ryofu_yukata",
    "hs_okita_souji", "hs_ryofu_halloween", "hs_elizabeth_bathory_valentine", "hs_elizabeth_bathory", "hs_elizabeth_bathory_christmas", "hs_richard_i_onehalf", "hs_richard_i", "hs_tristan_valentine",
    "hs_anastasia_gakuen", "hs_anastasia_christmas", "hs_gilles_de_rais_christmas",
    "hs_gilles_de_rais_future", "hs_charlotte_corday_christmas",
    "hs_artemis_2nd", "hs_apollon_2nd", "hs_michael_2nd", "hs_amaterasu_link", "hs_nightingale", "hs_nightingale_christmas", "hs_beethoven", "hs_nightingale_link", "hs_tsukuyomi_link", "hs_beethoven_little", "hs_enma", "hs_nise_dimitri", "hs_richelieu", "hs_enma_onehalf", "hs_mansa_musa_halloween", "hs_mansa_musa", "hs_katsushika_hokusai_mizugi", "hs_katsushika_hokusai", "hs_tetsuwan_goetzens", "hs_spartacus_yukata", "hs_caesar_gakuen", "hs_spartacus", "hs_hattorihanzou", "hs_shirakawananaka", "hs_amaterasu_shikigami", "hs_sol_kamihime", "hs_khatia_valentine",


  ]
);
//单个文件
let name_one = ref(["hs_gilles_de_rais", "hs_hades_gakuen", "hs_brunhild_china", "hs_shirayukimishiro", "hs_charlotte_corday", "hs_rasputin",

])
//2组 规则不同  0203-0302
let name2 = ref([
  "hs_hades", "hs_valkyrie", "hs_valkyrie_wedding", "hs_konohanasakuyahime", "hs_seiryu", "hs_asakuraotome", "hs_baphomet", "hs_nymue_valentine", "hs_odin", "hs_michael_mizugi", "hs_michael_shogatsu", "hs_sariel_mizugi", "hs_poseidon", "hs_nyarlathotep", "hs_amorounagu_hinamatsuri", "hs_brunhild", "hs_pandora_onehalf", "hs_sol", "hs_joka_yukata", "hs_nike", "hs_artemis_half", "hs_gabriel_christmas", "hs_nymue", "hs_sariel", "hs_odin_valentine", "hs_shiva", "hs_sol_halloween", "hs_uriel_christmas", "hs_brunhild_wedding", "hs_apollon_christmas", "hs_amaterasu", "hs_izanami", "hs_isis", "hs_joka",
  "hs_pandora", "hs_kannon_bosatsu", "hs_marduk", "hs_nyarlathotep_christmas", "hs_parvati", "hs_konohanasakuyahime_onehalf", "hs_raphael", "hs_richard_i1", "hs_byakko", "hs_rusalka_christmas", "hs_nemesis_onehalf", "hs_amaterasu_shogatsu", "hs_apollon", "hs_uriel", "hs_gembu",
  "hs_sariel_half", "hs_thor_mizugi", "hs_artemis", "hs_nemesis", "hs_michael", "hs_sol_kamihimeishou", "hs_gabriel", "hs_michael_anniversary",
])
//3组 name1分name
let name3 = ref([
  "hs_claudette_china", "hs_khatia_legend", "hs_claudette_legend", "hs_astaroth", "hs_hohenheim_origin", "hs_asakurayume", "hs_nadir_valentine", "hs_nadir", "hs_zenith", "hs_origin", "hs_yato", "hs_juno", "hs_snegurochka", "hs_himiko", "hs_scathach", "hs_andromeda_onehalf", "hs_taikobo_cheerleader", "hs_taikobo", "hs_hijikatatoshizo_china", "hs_alexander_little", "hs_hijikatatoshizou", "hs_alexander", "hs_williamtell_link", "hs_williamtell", "hs_hammurabi", "hs_hattorihanzou_mizugi", "hs_saji_onehalf", "hs_saji", "hs_ishikawagoemon", "hs_mastersaint_shogatsu", "hs_mastersaint", "hs_mastershooter", "hs_masterlancer", "hs_masterrider", "hs_mastersoldier_shogatsu", "hs_mastersoldier", "hs_sanada_yukimura", "hs_donquixote", "hs_caesar", "hs_fafnir", "hs_siegfried_2nd", "hs_hermy_angel", "hs_juno_angel", "hs_arthur_angel", "hs_joka_halloween", "hs_nyarlathotep_gakuen", "hs_uriel_gakuen", "hs_gabriel_halloween", "hs_hades_taisouhuku", "hs_morrigan_angel", "hs_morrigan", "hs_hermy", "hs_baphomet_valentine", "hs_huyou_kaede", "hs_leana", "hs_rllu", "hs_tsukishimakoko",
  "hs_andromeda_maid", "hs_michael_maid", "hs_pandora_maid",
  "hs_hades_2nd", "hs_sol_2nd", "hs_tsukuyomi",
])

</script>

<style lang="scss" scoped>
.player {
  width: 45%;
  height: 100%;
  margin: 3px;
}

.playerBox {
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  // border: 1px solid black;
}
</style>