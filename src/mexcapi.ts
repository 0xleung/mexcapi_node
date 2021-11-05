import crypto from 'crypto';
import axios, { AxiosInstance, AxiosRequestConfig, Method } from 'axios';


class MEXCAPI {
  instance: AxiosInstance;
  baseUrl = 'https://www.mexc.com';
  secretKey;
  accessKey;
  constructor(param){
    this.accessKey = param.accessKey;
    this.secretKey = param.secretKey;
    this.instance = axios.create({
      baseURL: this.baseUrl,
      timeout: 1000,
      headers: {
        'ApiKey': this.accessKey,
        'Content-Type': 'application/json'
      }
    });
  }

  queryStringify(obj){
    const ks = Object.keys(obj);
    return ks.sort().map(k=>`${k}=${encodeURIComponent(obj[k])}`).join('&');
  }

  async request(url: string, method: Method, data: any){
    let _conf:AxiosRequestConfig<any> = {
      method: method,
      url: `${this.baseUrl}${url}`,
      headers: {'Request-Time': Date.now()+'',},
    };

    let params = {}

    if(method === 'post'){
      _conf.data = data;
    }else {
      params = data || {};
    }
    let sigData = '';
    if(_conf.method === 'get' || _conf.method === 'delete'){
      sigData = this.queryStringify(params);
      console.log(sigData, '>');
    }else if(_conf.method === 'post' || _conf.method === 'put'){
      sigData = JSON.stringify(data);
    }
    if(data){
      _conf.headers.Signature = this.sign(_conf.headers['Request-Time'], sigData);
    }else{
      _conf.headers.Signature = '';
    }
    _conf.url += `?${this.queryStringify(params)}`;
    return await this.instance(_conf)
  }

  sign(reqTime,
    paramsString){
    return crypto.createHmac('sha256', this.secretKey).update(`${this.accessKey}${reqTime}${paramsString}`).digest("hex");
  }
}

export default MEXCAPI;