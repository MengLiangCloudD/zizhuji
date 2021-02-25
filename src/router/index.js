import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: "/",
      name: "indexPage",
      redirect: "/indux",
    },
    //首页
    {
      path: "/home",
      name: "homePage",
      component: resolve=>(require(["@/components/index/home"],resolve)),
    },
    {
      path: "/indux",
      name: "indux",
      component: resolve=>(require(["@/components/index/indux"],resolve)),
    },
    {
      path: "/selectKeepCard",
      name: "selectKeepCard",
      component: resolve=>(require(["@/components/registration/selectKeepCard"],resolve)),
    },
    {
      path: "/readCard",
      name: "readCard",
      component: resolve=>(require(["@/components/registration/readCard"],resolve)),
    },

    //挂号
    {
      path: "/registration",
      name: "registration",
      component: resolve=>(require(["@/components/registration/registration"],resolve)),
    },
    //科室列表
    {
      path: "/depList",
      name: "depList",
      component: resolve=>(require(["@/components/registration/depList"],resolve)),

    },
    //号源列表
    {
      path: "/clinicList",
      name: "clinicList",
      component: resolve=>(require(["@/components/registration/clinicList"],resolve)),
    },
    //确认信息
    {
      path: "/registrationInfo",
      name: "registrationInfo",
      component: resolve=>(require(["@/components/registration/registrationInfo"],resolve)),
    },
    //支付完成
    {
      path: "/payOver",
      name: "payOver",
      component: resolve=>(require(["@/components/registration/payOver"],resolve)),
    },
    //医保结算
    {
      path: "/insurance",
      name: "insurance",
      component: resolve=>(require(["@/components/registration/insurance"],resolve)),
    },
    //自助缴费
    {
      path: "/selfHelpHome",
      name: "selfHelpHome",
      component: resolve=>(require(["@/components/selfHelp/selfHelpHome"],resolve)),
    },
    //支付
    {
      path: "/payFees",
      name: "payFees",
      component: resolve=>(require(["@/components/selfHelp/payFees"],resolve)),
    },
    //收费清单打印
    {
      path: "/inventoryFee",
      name: "inventoryFee",
      component: resolve=>(require(["@/components/inventoryFee/inventoryFee"],resolve)),
    },
    //收费清单打印
    {
      path: "/printFeeInfo",
      name: "printFeeInfo",
      component: resolve=>(require(["@/components/inventoryFee/printFeeInfo"],resolve)),
    },
    //打印完成
    {
      path: "/printOver",
      name: "printOver",
      component: resolve=>(require(["@/components/inventoryFee/printOver"],resolve)),
    },
    //读卡页面
    {
      path: "/readCard",
      name: "readCard",
      component: resolve=>(require(["@/components/registration/readCard"],resolve)),
    },
    //个人信息确认页
    {
      path: "/personalInfo",
      name: "personalInfo",
      component: resolve=>(require(["@/components/registration/personalInfo"],resolve)),
    },
  ]
})
