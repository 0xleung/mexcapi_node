"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const crypto_1 = __importDefault(require("crypto"));
const axios_1 = __importDefault(require("axios"));
class MEXCAPI {
    constructor(param) {
        this.baseUrl = 'https://www.mexc.com';
        this.accessKey = param.accessKey;
        this.secretKey = param.secretKey;
        this.instance = axios_1.default.create({
            baseURL: this.baseUrl,
            timeout: 1000,
            headers: {
                'ApiKey': this.accessKey,
                'Content-Type': 'application/json'
            }
        });
    }
    queryStringify(obj) {
        const ks = Object.keys(obj);
        return ks.sort().map(k => `${k}=${encodeURIComponent(obj[k])}`).join('&');
    }
    request(url, method, data) {
        return __awaiter(this, void 0, void 0, function* () {
            let _conf = {
                method: method,
                url: `${this.baseUrl}${url}`,
                headers: { 'Request-Time': Date.now() + '', },
            };
            let params = {};
            if (method === 'post') {
                _conf.data = data;
            }
            else {
                params = data || {};
            }
            let sigData = '';
            if (_conf.method === 'get' || _conf.method === 'delete') {
                // sigData = _conf.url.split('?')[1] || '';
                sigData = this.queryStringify(params);
                console.log(sigData, '>');
            }
            else if (_conf.method === 'post' || _conf.method === 'put') {
                sigData = JSON.stringify(data);
            }
            if (data) {
                _conf.headers.Signature = this.sign(_conf.headers['Request-Time'], sigData);
            }
            else {
                _conf.headers.Signature = '';
                _conf.params.sign = '';
            }
            _conf.url += `?${this.queryStringify(params)}`;
            return yield this.instance(_conf);
        });
    }
    sign(reqTime, paramsString) {
        return crypto_1.default.createHmac('sha256', this.secretKey).update(`${this.accessKey}${reqTime}${paramsString}`).digest("hex");
    }
}
exports.default = MEXCAPI;
//# sourceMappingURL=mexcapi.js.map