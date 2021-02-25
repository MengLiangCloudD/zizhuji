'use strict'

import axios from 'axios'
import qs from 'qs'
axios.defaults.baseURL = '/api';
axios.interceptors.request.use(config => {
  // loading
  return config
}, error => {
  return Promise.reject(error)
})

axios.interceptors.response.use(response => {
  return response
}, error => {
  return Promise.resolve(error.response)
})

function checkStatus (response) {
  // loading
  // 如果http状态码正常，则直接返回数据
  if (response && (response.status === 200 || response.status === 304 || response.status === 400 || response.status === 401)) {
    // 如果不需要除了data之外的数据，可以直接 return response.data
    if(response.data.errcode==1003){
      
    }else{
      return response.data;
    }
  }else{
    
  }
  // 异常状态下，把错误信息返回去
  return {
    status: -404,
    errmsg: '请求异常'
  }
}

function checkCode (res) {
  // 如果code异常(这里已经包括网络错误，服务器错误，后端抛出的错误)，可以弹出一个错误提示，告诉用户
  if (res.status === -404) {
    return res
  }else{
    return res;
  }
  
}

export default {
  post (that,url, data) {
    var token  = localStorage.getItem('token')
    that.isshowloading = true;
    return axios({
      method: 'post',
      url,
      data: qs.stringify(data),
      timeout: 10000,
      headers: {
        'token':token,
        'X-Requested-With': 'XMLHttpRequest',
        'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
      }
    }).then(
      (response) => {
        that.isshowloading=false;
        that.isRefreshing = false;
        return checkStatus(response)
      }
    ).then(
      (res) => {
        that.isshowloading=false;
        that.isRefreshing = false;
        return checkCode(res)
      }
    )
  },
  get (that,url, params) {
    return axios({
      method: 'get',
      url,
      params, // get 请求时带的参数
      timeout: 10000,
      headers: {
        'X-Requested-With': 'application/json'
      }
    }).then(
      (response) => {
        return checkStatus(response)
      }
    ).then(
      (res) => {
        return checkCode(res)
      }
    )
  }
}
