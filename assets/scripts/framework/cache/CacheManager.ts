import { _decorator, Node, Component } from 'cc';
import { DEVELOP } from 'cc/userland/macro';
import { BaseManager } from '@framework/base/BaseManager';

const { ccclass } = _decorator;

@ccclass('CacheManager')
export class CacheManager extends BaseManager {
    private mDataDict: Map<string, unknown> = new Map();

    public Dump() {
        if (DEVELOP) {
            console.log('=======================CacheManager=======================');
            this.mDataDict.forEach((val, key) => console.log(key, val));
            console.log('=======================CacheManager=======================');
        }
    }

    public GetData(key: string) {
        if (typeof key != 'string') {
            console.warn('GetData, key类型错误:', key);
            return;
        }
        return this.mDataDict.get(key);
    }

    /**
     * CacheManager.GetList(/^.*$/) // 获取所有数据
     * CacheManager.GetList(/^test/) // 获取以bottom-bar开头的数据
     */
    public GetList(regex: RegExp) {
        const ret: unknown[] = [];
        for (const val of this.mDataDict!) {
            if (regex && regex.test(val[0])) {
                ret.push(val[1]);
            }
        }
        return ret;
    }

    public DelData(key: string) {
        if (typeof key != 'string') {
            console.warn('DelData, key类型错误:', key);
            return;
        }
        return this.mDataDict.delete(key);
    }

    public DelList(regex: RegExp) {
        for (const val of this.mDataDict!) {
            if (regex && regex.test(val[0])) {
                this.mDataDict.delete(val[0]);
            }
        }
    }

    public Clear() {
        this.mDataDict.clear();
    }

    public SetData(key: string, val: unknown) {
        if (typeof key != 'string') {
            console.warn('SetData, key类型错误:', key);
            return;
        }
        if (this.mDataDict.has(key)) {
            console.warn('SetData, 重复key:', key);
            return;
        }
        this.mDataDict.set(key, val);
    }

    public SetBool(key: string, val: boolean) {
        if (typeof val != 'boolean') {
            console.warn('SetBool, 类型错误:', key, val);
        }
        this.SetData(key, val);
    }

    public SetNumber(key: string, val: number) {
        if (typeof val != 'number') {
            console.warn('SetNumber, 类型错误:', key, val);
        }
        this.SetData(key, val);
    }

    public SetString(key: string, val: string) {
        if (typeof val != 'string') {
            console.warn('SetString, 类型错误:', key, val);
        }
        this.SetData(key, val);
    }

    public SetNode(key: string, val: Node) {
        if (!(typeof val == 'object' && Node.prototype.isPrototypeOf(val))) {
            console.warn('SetNode, 类型错误:', key, val);
        }
        this.SetData(key, val);
    }

    public SetComp<T extends Component>(key: string, val: T) {
        if (!(val instanceof Component)) {
            console.warn('SetComp, 类型错误:', key, val);
        }
        this.SetData(key, val);
    }

    public GetBool(key: string): boolean | undefined {
        const val = this.GetData(key);
        if (val == undefined) {
            return;
        }
        if (typeof val != 'boolean') {
            console.warn('GetBool, 类型错误:', key, val);
            return;
        }
        return val;
    }

    public GetNumber(key: string): number | undefined {
        const val = this.GetData(key);
        if (val == undefined) {
            return;
        }
        if (typeof val != 'number') {
            console.warn('GetNumber, 类型错误:', key, val);
            return;
        }
        return val;
    }

    public GetString(key: string): string | undefined {
        const val = this.GetData(key);
        if (val == undefined) {
            return;
        }
        if (typeof val != 'string') {
            console.warn('GetString, 类型错误:', key, val);
            return;
        }
        return val;
    }

    public GetNode(key: string): Node | undefined {
        const val = this.GetData(key);
        if (val == undefined) {
            return;
        }
        if (!(val instanceof Node)) {
            console.warn('GetNode, 类型错误:', key, val);
            return;
        }
        return val as Node;
    }

    public GetComp<T extends Component>(key: string): T | undefined {
        const val = this.GetData(key);
        if (val == undefined) {
            return;
        }
        if (!(val instanceof Component)) {
            console.warn('GetComp, 类型错误:', key, val);
            return;
        }
        return val as T;
    }

    public DelBool(key: string) {
        this.DelData(key);
    }

    public DelNumber(key: string) {
        this.DelData(key);
    }

    public DelString(key: string) {
        this.DelData(key);
    }

    public DelNode(key: string) {
        this.DelData(key);
    }

    public DelComp(key: string) {
        this.DelData(key);
    }
}
