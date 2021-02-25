import Vue from 'vue'
import Vuex from "vuex";

Vue.use(Vuex);


export default new Vuex.Store({
  state: {
    show: true,
    patientId: "",//患者id
    name: "",//姓名
    sex: "",//性别：0-男，1-女
    idCardNo: "",//身份证号码
    icCardNo: "",//医保卡卡号
    type: "",//卡类型：1-医保卡，2-身份证
    birthDate: "",//生日
  },
  mutations: {
    setPatientId(state, value) {
      state.patientId = value;
    },
    setName(state, value) {
      state.name = value;
    },
    setSex(state, value) {
      state.sex = value;
    },
    setIdCardNo(state, value) {
      state.idCardNo = value;
    },
    setIcCardNo(state, value) {
      state.icCardNo = value;
    },
    setType(state, value) {
      state.type = value;
    },
    setBirthDate(state, value) {
      state.birthDate = value;
    },
    clear(state) {
      state.patientId = "";
      state.name = "";
      state.sex = "";
      state.idCardNo = "";
      state.icCardNo = "";
      state.type = "";
      state.birthDate = "";
    },
  }
});
