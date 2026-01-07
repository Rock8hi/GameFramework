import { _decorator } from 'cc';
import { BaseComponent } from '../base/BaseComponent';
import { ICrypto } from './ICrypto';
import { SocketState } from './SocketDefine';

const { ccclass, property } = _decorator;

// const B2S = BytesUtils.Buffer2String;
// const S2B = BytesUtils.String2Buffer;

/**
 * WebSocket长链接
 */
@ccclass
export class SocketClient extends BaseComponent {
    // websocket链接
    private mSocket: WebSocket = null;
    /** 加密解密器 */
    private mCryptoHandler: ICrypto = null;

    /** 设置加密解密器 */
    public SetCryptoHandler(crypto: ICrypto) {
        this.mCryptoHandler = crypto;
    }

    /** 创建链接 */
    protected Create(url: string | URL, cb: (stat: SocketState, data?: any) => void) {
        try {
            // 创建链接
            this.mSocket = new WebSocket(url);
        } catch (err) {
            this.mSocket = null;
            console.warn(err);
            cb(SocketState.ERROR, `connect URL(${url}) failed.`);
            return;
        }
        // 设置传输二进制数据
        // this.mSocket.binaryType = 'arraybuffer';
        // 链接打开
        this.mSocket.onopen = (event: Event) => {
            console.debug('onopen, connection connected.');
            cb(SocketState.CONNECTED);
        };
        // 链接关闭
        this.mSocket.onclose = (event: CloseEvent) => {
            if (event.wasClean) {
                console.debug('onclose, connection closed cleanly.', event.code, event.reason);
            } else {
                console.debug('onclose, connection died.', event.code, event.reason);
            }
            this.Clear();
            /**
             * 1000: 正常关闭
             * 1001: 远端关闭
             * 1002: 协议错误
             * 1003: 数据类型错误
             * 1005: 没有状态码，通常只在关闭握手时出现
             * 1006: 链接被重置
             * 1011: 远端异常或远端重启
             * 1015: TLS握手失败
             */
            cb(SocketState.CLOSED, event.code);
        };
        // 链接异常
        this.mSocket.onerror = (event: Event) => {
            console.debug('onerror, connection error.');
            this.Clear();
            cb(SocketState.ERROR);
        };
        // 接收数据
        this.mSocket.onmessage = (event: MessageEvent) => {
            console.debug('onmessage, connection message.', event.data);
            try {
                // cb(SocketState.MESSAGE, JSON.parse(B2S(new Uint8Array(event.data))));
                let resp = JSON.parse(event.data);
                // 解密数据
                this.mCryptoHandler && this.mCryptoHandler.Decrypt(resp);
                cb(SocketState.MESSAGE, resp);
            } catch (err) {
                console.warn(err);
                cb(SocketState.ERROR, '解析接收的数据异常');
            }
        };
    }

    /** 优雅关闭链接 */
    protected Close() {
        if (!this.mSocket) {
            return;
        }
        if (this.mSocket.readyState === WebSocket.CLOSING) {
            console.warn('warn: connection closing');
            return;
        }
        if (this.mSocket.readyState === WebSocket.CLOSED) {
            console.warn('warn: connection closed');
            return;
        }
        this.mSocket.close();
        // 限定时间内完成清理动作，否则强制清理
        this.scheduleOnce(() => this.Clear(), 3);
    }

    /** 清理变量和回调 */
    private Clear() {
        if (this.mSocket) {
            this.mSocket.onopen = undefined;
            this.mSocket.onmessage = undefined;
            this.mSocket.onclose = undefined;
            this.mSocket.onerror = undefined;
            this.mSocket = null;
        }
        // 从节点树移除组件自己
        this.node.removeComponent(this);
    }

    /** 强制关闭链接 */
    protected ForceClose() {
        this.Close();
        this.Clear();
    }

    /** 是否已连接到服务器 */
    public IsConnected() {
        return this.mSocket && this.mSocket.readyState === WebSocket.OPEN;
    }

    /** 发送二进制数据 */
    /*public SendBuffer(data: ArrayBufferLike) {
        if (!this.IsConnected()) {
            console.warn('链接处于断开状态，无法发送数据');
            return;
        }
        try {
            data && this.mSocket.send(data);
        } catch (err) {
            console.warn(err);
        }
    }*/

    /** 发送字符串数据 */
    /*public SendString(data: string) {
        // try {
        //     data && this.SendBuffer(S2B(data).buffer);
        // } catch (err) {
        //     console.warn(err);
        // }
        if (!this.IsConnected()) {
            console.warn('链接处于断开状态，无法发送数据');
            return;
        }
        try {
            data && this.mSocket.send(data);
        } catch (err) {
            console.warn(err);
        }
    }*/

    /** 发送json对象 */
    public SendObject(method: string, data?: object) {
        if (!method) {
            console.warn('发送的方法名不能为空');
            return;
        }
        if (!this.IsConnected()) {
            console.warn('链接处于断开状态，无法发送数据');
            return;
        }
        const req = { method: method, data: data };
        // 加密数据
        this.mCryptoHandler && this.mCryptoHandler.Encrypt(req);
        try {
            this.mSocket.send(JSON.stringify(req));
        } catch (err) {
            console.warn(err);
        }
    }
}
