import { _decorator } from 'cc';
import { BaseManager } from '@framework/base/BaseManager';
import { WebCallback, WebOptions, WebState } from './WebDefine';

const { ccclass, property } = _decorator;

/**
 * http管理
 */
@ccclass('WebManager')
export class WebManager extends BaseManager {
    private mUrlMap: Map<string, XMLHttpRequest> = new Map();

    @property({ displayName: '超时时间(秒)', min: 1, step: 1, max: 60 })
    private mDefaultTimeout: number = 10;

    /**
     * GET请求
     * @param url 请求地址
     */
    public Get(url: string): void;
    /**
     * GET请求
     * @param url 请求地址
     * @param callback 请求回调
     */
    public Get(url: string, callback: WebCallback): void;
    /**
     * GET请求
     * @param url 请求地址
     * @param options 请求参数，请求头，超时等
     * @param callback 请求回调
     */
    public Get(url: string, options: WebOptions, callback: WebCallback): void;

    public Get(url: string, options?: WebOptions | WebCallback, callback?: WebCallback): void {
        if (!url) {
            console.warn('请求地址是空');
            callback && callback(WebState.ERR_EMPTY_URL);
            return;
        }
        if (!url.startsWith('http://') && url.startsWith('https://')) {
            console.warn('请求地址格式错误');
            callback && callback(WebState.ERR_URL_FORMAT);
            return;
        }
        if (url.indexOf('?') > -1) {
            console.warn('请使用第二形参options中的params传递参数');
            callback && callback(WebState.ERR_INVALID_PARAMS);
            return;
        }
        if (this.mUrlMap.has(url)) {
            console.warn(`地址[${url}]正在请求中，禁止重复请求`);
            callback && callback(WebState.ERR_REPEAT_REQUEST);
            return;
        }
        if (typeof options == 'function') {
            callback = options as WebCallback;
            options = undefined;
        }
        options = options && (options as WebOptions);
        // 将参数键值对转换为字符串
        let params = '';
        if (options && options.params) {
            for (const key in options.params) {
                params += `${key}=${options.params[key]}&`;
            }
            if (params.length !== 0) {
                params = params.slice(0, params.length - 1);
            }
        }
        // 创建请求
        const xhr = new XMLHttpRequest();
        // 保存起来方便后续使用
        this.mUrlMap.set(url, xhr);
        // 打开请求
        const _url = params.length > 0 ? `${url}?${params}` : url;
        // console.log('url:', _url);
        xhr.open('GET', _url, true);
        // 添加请求头
        if (options && options.headers) {
            for (const key in options.headers) {
                xhr.setRequestHeader(key, options.headers[key]);
            }
        }
        if (!options || !options.headers || !options.headers['Content-Type']) {
            xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded;charset=utf-8');
        }
        // 处理超时
        if (options && options.timeout && options.timeout > 0) {
            xhr.timeout = options.timeout;
        } else {
            xhr.timeout = this.mDefaultTimeout * 1000;
        }
        xhr.ontimeout = () => {
            this.mUrlMap.delete(url);
            callback && callback(WebState.ERR_TIMEOUT);
        };
        // 处理异常
        xhr.onloadend = () => {
            if (xhr.status == 500) {
                this.mUrlMap.delete(url);
                callback && callback(WebState.ERR_NOT_NETWORK);
            }
        };
        // 处理异常
        xhr.onerror = () => {
            this.mUrlMap.delete(url);
            if (
                xhr.readyState === XMLHttpRequest.UNSENT ||
                xhr.readyState === XMLHttpRequest.OPENED ||
                xhr.status === 0
            ) {
                callback && callback(WebState.ERR_NOT_NETWORK);
            } else {
                callback && callback(WebState.ERR_UNKNOWN);
            }
        };
        // 收到回复
        xhr.onreadystatechange = () => {
            if (xhr.readyState !== XMLHttpRequest.DONE) {
                return;
            }
            this.mUrlMap.delete(url);
            if (xhr.status >= 200 && xhr.status < 400) {
                callback && callback(null, xhr.response);
            } else {
                callback && callback(WebState.ERR_UNKNOWN);
            }
        };
        // 发送请求
        xhr.send();
    }

    /** 使用POST请求文本或键值对 */
    public PostForm(url: string, options: WebOptions, callback: WebCallback) {
        options = options || {};
        if (options.params) {
            let params = '';
            for (const key in options.params) {
                params += `${key}=${options.params[key]}&`;
            }
            if (params.length !== 0) {
                params = params.slice(0, params.length - 1);
            }
            if (options.body) {
                console.warn('禁止params和body同时有数据');
            }
            options.body = params;
        }
        options.headers = options.headers || {};
        options.headers['Content-Type'] = 'application/x-www-form-urlencoded;charset=utf-8';
        this.Post(url, options, callback);
    }

    /** 使用POST请求JSON */
    public PostJson(url: string, options: WebOptions, callback: WebCallback) {
        options = options || {};
        if (options.body instanceof ArrayBuffer || options.body instanceof Blob) {
            console.log(`地址[${url}]的body不是JSON数据`);
            callback && callback(WebState.ERR_PAYLOAD, null);
            return;
        }
        if (typeof options.body !== 'string') {
            try {
                options.body = JSON.stringify(options.body);
            } catch (e) {
                console.log(`地址[${url}]的body不是JSON数据`);
                callback && callback(WebState.ERR_PAYLOAD, null);
                return;
            }
        }
        options.headers = options.headers || {};
        options.headers['Content-Type'] = 'application/json;charset=utf-8';
        this.Post(url, options, callback);
    }

    /** 使用POST请求二进制数据 */
    public PostBinary(url: string, options: WebOptions, callback: WebCallback) {
        options = options || {};
        if (!(options.body instanceof ArrayBuffer)) {
            console.log(`地址[${url}]的body不是二进制数据`);
            callback && callback(WebState.ERR_PAYLOAD, null);
            return;
        }
        options.headers = options.headers || {};
        options.headers['Content-Type'] = 'application/octet-stream';
        this.Post(url, options, callback);
    }

    /**
     * POST请求
     * @param url 请求地址
     */
    public Post(url: string): void;
    /**
     * POST请求
     * @param url 请求地址
     * @param callback 请求回调
     */
    public Post(url: string, callback: WebCallback): void;
    /**
     * POST请求
     * @param url 请求地址
     * @param options 请求参数，请求头，超时等
     * @param callback 请求回调
     */
    public Post(url: string, options: WebOptions, callback: WebCallback): void;

    public Post(url: string, options?: WebOptions | WebCallback, callback?: WebCallback): void {
        if (!url) {
            console.warn('请求地址是空');
            callback && callback(WebState.ERR_EMPTY_URL);
            return;
        }
        if (!url.startsWith('http://') && url.startsWith('https://')) {
            console.warn('请求地址格式错误');
            callback && callback(WebState.ERR_URL_FORMAT);
            return;
        }
        if (url.indexOf('?') > -1) {
            console.warn('请使用第二形参body传递参数');
            callback && callback(WebState.ERR_INVALID_PARAMS);
            return;
        }
        if (this.mUrlMap.has(url)) {
            console.warn(`地址[${url}]正在请求中，禁止重复请求`);
            callback && callback(WebState.ERR_REPEAT_REQUEST, null);
            return;
        }
        if (typeof options == 'function') {
            callback = options as WebCallback;
            options = undefined;
        }
        options = options && (options as WebOptions);
        // 将参数键值对转换为字符串
        let params = '';
        if (options && options.params) {
            for (const key in options.params) {
                params += `${key}=${options.params[key]}&`;
            }
            if (params.length !== 0) {
                params = params.slice(0, params.length - 1);
            }
        }
        // 创建请求
        const xhr = new XMLHttpRequest();
        // 保存起来方便后续使用
        this.mUrlMap.set(url, xhr);
        // 打开请求
        // console.log('url:', url);
        xhr.open('POST', url, true);
        // 添加请求头
        if (options && options.headers) {
            for (const key in options.headers) {
                xhr.setRequestHeader(key, options.headers[key]);
            }
        }
        // 处理超时
        if (options && options.timeout && options.timeout > 0) {
            xhr.timeout = options.timeout;
        } else {
            xhr.timeout = this.mDefaultTimeout * 1000;
        }
        xhr.ontimeout = () => {
            this.mUrlMap.delete(url);
            callback && callback(WebState.ERR_TIMEOUT);
        };
        // 处理异常
        xhr.onloadend = () => {
            if (xhr.status == 500) {
                this.mUrlMap.delete(url);
                callback && callback(WebState.ERR_NOT_NETWORK);
            }
        };
        // 处理异常
        xhr.onerror = () => {
            this.mUrlMap.delete(url);
            if (
                xhr.readyState === XMLHttpRequest.UNSENT ||
                xhr.readyState === XMLHttpRequest.OPENED ||
                xhr.status === 0
            ) {
                callback && callback(WebState.ERR_NOT_NETWORK);
            } else {
                callback && callback(WebState.ERR_UNKNOWN);
            }
        };
        // 收到回复
        xhr.onreadystatechange = () => {
            if (xhr.readyState !== XMLHttpRequest.DONE) {
                return;
            }
            this.mUrlMap.delete(url);
            if (xhr.status >= 200 && xhr.status < 400) {
                callback && callback(WebState.SUCCESS, xhr.response);
            } else {
                callback && callback(WebState.ERR_UNKNOWN);
            }
        };
        // 发送请求
        if (options && options.body) {
            xhr.send(options.body);
        } else {
            xhr.send();
        }
    }

    /** 取消请求 */
    public Abort(url: string) {
        if (!url || !this.mUrlMap.has(url)) {
            return;
        }
        this.mUrlMap.get(url)?.abort();
        this.mUrlMap.delete(url);
    }
}
