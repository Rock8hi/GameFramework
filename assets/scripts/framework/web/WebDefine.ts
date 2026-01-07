/**
 * Web请求错误状态枚举
 */
export enum WebState {
    /** 成功 */
    SUCCESS = 0,
    /** 空URL错误 */
    ERR_EMPTY_URL,
    /** URL格式错误 */
    ERR_URL_FORMAT,
    /** 参数错误 */
    ERR_INVALID_PARAMS,
    /** 重复请求 */
    ERR_REPEAT_REQUEST,
    /** 请求超时 */
    ERR_TIMEOUT,
    /** 无网络连接 */
    ERR_NOT_NETWORK,
    /** 未知错误 */
    ERR_UNKNOWN,
    /** 请求体格式错误 */
    ERR_PAYLOAD,
}

export type WebCallback = (stat: WebState, data?: any) => void;

export interface WebOptions {
    params?: Record<string, string>;
    headers?: Record<string, string>;
    timeout?: number;
    body?: string | ArrayBuffer | Blob;
}
