import { DEBUG } from 'cc/env';

/** 二进制数据转换工具 */
export class BytesUtils {
    /** 二进制数据转十六进制字符串，方便打印调试 */
    public static Bin2Hex(bytes: Uint8Array) {
        if (DEBUG) {
            if (!(bytes instanceof Uint8Array)) {
                console.warn('参数类型错误，请传入Uint8Array数据');
                return;
            }
        }
        const arr = Array.from(bytes).map(val => '0x' + (val + 0x100).toString(16).slice(1));
        return `[${arr.join(',')}]`;
    }

    /** 将字符串转换为二进制数据 */
    public static String2Buffer(data: string): Uint8Array {
        if (typeof data !== 'string') {
            return;
        }
        if (typeof TextEncoder !== 'undefined') {
            try {
                return new TextEncoder().encode(data);
            } catch (err) {
                throw new Error(`编码异常, error: ${err}`);
            }
        }
        // 微信小程序等不支持TextEncoder
        // 兼容方案A
        // const array = unescape(encodeURIComponent(data))
        //     .split('')
        //     .map(v => v.charCodeAt(0));
        // return new Uint8Array(array);
        // 兼容方案B
        let code: number;
        const utf8 = [];
        for (let i = 0; i < data.length; i++) {
            code = data.charCodeAt(i);
            if (code < 0x80) {
                utf8.push(code);
            } else if (code < 0x800) {
                utf8.push(0xc0 | (code >> 6), 0x80 | (code & 0x3f));
            } else if (code < 0xd800 || code > 0xdfff) {
                utf8.push(0xe0 | (code >> 12), 0x80 | ((code >> 6) & 0x3f), 0x80 | (code & 0x3f));
            } else {
                // 处理代理对(四字节UTF-8)
                i++;
                code = 0x10000 + (((code & 0x3ff) << 10) | (data.charCodeAt(i) & 0x3ff));
                utf8.push(
                    0xf0 | (code >> 18),
                    0x80 | ((code >> 12) & 0x3f),
                    0x80 | ((code >> 6) & 0x3f),
                    0x80 | (code & 0x3f)
                );
            }
        }
        return new Uint8Array(utf8);
    }

    /** 将二进制数据转换为字符串 */
    public static Buffer2String(data: Uint8Array): string {
        if (data === undefined) {
            return;
        }
        if (DEBUG) {
            if (!(data instanceof Uint8Array)) {
                console.warn('参数类型错误，请传入Uint8Array数据');
                return;
            }
        }
        if (typeof TextDecoder !== 'undefined') {
            try {
                return new TextDecoder('utf-8').decode(data);
            } catch (err) {
                throw new Error(`解码异常, error: ${err}`);
            }
        }
        // 微信小程序不支持TextDecoder
        let b1: number, b2: number, b3: number, b4: number;
        let code: number;
        let str = '';
        let i = 0;
        while (i < data.length) {
            b1 = data[i++];
            if ((b1 & 0x80) === 0) {
                // 0xxxxxxx, 单字节字符
                str += String.fromCharCode(b1);
            } else if ((b1 & 0xe0) === 0xc0) {
                // 110xxxxx 10xxxxxx, 双字节字符
                b2 = data[i++];
                code = ((b1 & 0x1f) << 6) | (b2 & 0x3f);
                str += String.fromCharCode(code);
            } else if ((b1 & 0xf0) === 0xe0) {
                // 1110xxxx 10xxxxxx 10xxxxxx, 三字节字符
                b2 = data[i++];
                b3 = data[i++];
                code = ((b1 & 0x0f) << 12) | ((b2 & 0x3f) << 6) | (b3 & 0x3f);
                str += String.fromCharCode(code);
            } else if ((b1 & 0xf8) === 0xf0) {
                // 11110xxx 10xxxxxx 10xxxxxx 10xxxxxx, 四字节字符
                b2 = data[i++];
                b3 = data[i++];
                b4 = data[i++];
                // 由于 JavaScript 的 String.fromCharCode() 不支持大于 0xFFFF 的码点，需要使用其他方式处理，例如使用 ES6 的 code point 方式
                code = ((b1 & 0x07) << 18) | ((b2 & 0x3f) << 12) | ((b3 & 0x3f) << 6) | (b4 & 0x3f);
                str += String.fromCodePoint(code);
            } else {
                throw new Error('invalid UTF-8 sequence');
            }
        }
        return str;
    }
}
