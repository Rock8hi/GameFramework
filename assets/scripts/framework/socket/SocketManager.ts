import { _decorator } from 'cc';
import { BaseManager } from '../base/BaseManager';
import { ICrypto } from './ICrypto';
import { SocketClient } from './SocketClient';
import { SocketState } from './SocketDefine';

const { ccclass, property } = _decorator;

/**
 * 长链接管理
 */
@ccclass
export class SocketManager extends BaseManager {
    /** 加密解密器 */
    private mCryptoHandler: ICrypto = null;

    /** 设置加密解密器 */
    public SetCryptoHandler(crypto: ICrypto) {
        this.mCryptoHandler = crypto;
    }

    protected OnDestroy(): void {
        // @ts-ignore
        this.mSocketDict.forEach(val => val.ForceClose());
        this.mSocketDict.clear();
        super.OnDestroy();
    }

    /** 支持多条链接 */
    private mSocketDict: Map<string, SocketClient> = new Map();

    /** 建立链接 */
    public Connect(key: string, url: string | URL, cb: (stat: SocketState, data?: any) => void) {
        // @ts-ignore
        this.mSocketDict.get(key)?.Close();
        this.mSocketDict.set(key, this.NewClient(url, cb));
    }

    /** 根据url创建链接 */
    private NewClient(url: string | URL, cb: (stat: SocketState, data?: any) => void) {
        const client = this.node.addComponent(SocketClient);
        // @ts-ignore
        client.Create(url, cb);
        // 设置加密解密器
        client.SetCryptoHandler(this.mCryptoHandler);
        return client;
    }

    /** 获取链接 */
    public GetClient(key: string) {
        return this.mSocketDict.get(key);
    }

    /** 检查链接 */
    public HasClient(key: string) {
        return this.mSocketDict.has(key);
    }

    /** 断开链接 */
    public Close(key: string) {
        const val = this.mSocketDict.get(key);
        if (val) {
            // @ts-ignore
            val.Close();
            this.mSocketDict.delete(key);
        }
    }

    /** 断开所有链接 */
    public CloseAll() {
        // @ts-ignore
        this.mSocketDict.forEach(val => val.Close());
        this.mSocketDict.clear();
    }
}
