import { _decorator } from 'cc';
import { BaseManager } from '@framework/base/BaseManager';
import { BaseComponent } from '@framework/base/BaseComponent';
import { BaseController } from '@framework/mvcs/controller/BaseController';
import { DEBUG } from 'cc/env';
import { EventName, EventDict } from '@config/EventDefine';

const { ccclass } = _decorator;

type EventThis = BaseComponent | BaseController;
type EventInfo = { listener: (...args: any) => void; target: EventThis; once?: boolean };

/**
 * 事件管理，此实现主要区别是，添加了调用接口时的提醒功能，方便知道调用Emit时有哪些参数
 */
@ccclass('EventManager2')
export class EventManager extends BaseManager {
    private mEventDict: Map<EventName, EventInfo[]> = new Map();

    /** 一次性注册监听事件 */
    public Once<K extends keyof EventDict>(name: K, listener: EventDict[K], target?: EventThis): void {
        if (!this.mEventDict.has(name)) {
            this.mEventDict.set(name, [{ listener: listener, target: target, once: true }]);
            return;
        }
        const list = this.mEventDict.get(name);
        if (DEBUG) {
            const idx = list.findIndex(val => val.listener === listener && val.target === target);
            if (idx >= 0) {
                console.log('禁止重复注册', name, listener, target);
                return;
            }
        }
        list.push({ listener: listener, target: target, once: true });
    }

    /** 注册监听事件 */
    public On<K extends keyof EventDict>(name: K, listener: EventDict[K], target?: EventThis): void {
        if (!this.mEventDict.has(name)) {
            this.mEventDict.set(name, [{ listener: listener, target: target }]);
            return;
        }
        const list = this.mEventDict.get(name);
        if (DEBUG) {
            const idx = list.findIndex(val => val.listener === listener && val.target === target);
            if (idx >= 0) {
                console.error('禁止重复注册', name, listener, target);
                return;
            }
        }
        list.push({ listener: listener, target: target });
    }

    /** 取消所有name的事件监听 */
    public Off<K extends keyof EventDict>(name: K): void;
    /** 取消某个事件监听 */
    public Off<K extends keyof EventDict>(name: K, listener: EventDict[K]): void;
    /** 取消事件监听 */
    public Off<K extends keyof EventDict>(name: K, listener: EventDict[K], target: EventThis): void;

    /** 取消事件监听 */
    public Off<K extends keyof EventDict>(name: K, listener?: EventDict[K], target?: EventThis): void {
        const list = this.mEventDict.get(name);
        if (!list || list.length == 0) {
            return;
        }
        if (!listener) {
            this.mEventDict.delete(name);
            return;
        }
        const idx = list.findIndex(val => val.listener === listener && val.target === target);
        if (idx < 0) {
            return;
        }
        list.splice(idx, 1);
        list.length == 0 && this.mEventDict.delete(name);
    }

    /** 移除在某个对象上的监听 */
    public TargetOff(target: EventThis) {
        // this.mEventHandler.targetOff(target);
    }

    /** 触发事件 */
    public Emit<K extends keyof EventDict>(name: K, ...args: Parameters<EventDict[K]>): void {
        const list = this.mEventDict.get(name);
        if (!list || list.length == 0) {
            return;
        }
        for (let i = 0; i < list.length; i++) {
            const val = list[i];
            val.listener.apply(val.target, args);
            val.once && (list.splice(i, 1), i--);
        }
        list.length == 0 && this.mEventDict.delete(name);
    }
}
