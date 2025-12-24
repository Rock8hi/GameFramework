import { _decorator } from 'cc';
import { BaseManager } from '@framework/base/BaseManager';
import { BaseComponent } from '@framework/base/BaseComponent';
import { BaseController } from '@framework/mvcs/controller/BaseController';
import { DEBUG } from 'cc/env';

const { ccclass } = _decorator;

export type EventName = string | number;
export type EventListener = (...args: any) => void;
export type EventObject = BaseComponent | BaseController;

/**
 * 事件管理，此实现是手动实现了各个接口，没有用cocos EventTarget
 */
@ccclass('EventManager1')
export class EventManager extends BaseManager {
    private mEventDict: Map<EventName, { listener: EventListener; target: EventObject; once?: boolean }[]> = new Map();

    /** 一次性注册监听事件 */
    public Once(name: EventName, listener: EventListener, target?: EventObject): void {
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
    public On(name: EventName, listener: EventListener, target?: EventObject): void {
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
    public Off(name: EventName): void;
    /** 取消某个事件监听 */
    public Off(name: EventName, listener: EventListener): void;
    /** 取消事件监听 */
    public Off(name: EventName, listener: EventListener, target: EventObject): void;

    /** 取消事件监听 */
    public Off(name: EventName, listener?: EventListener, target?: EventObject): void {
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
    public TargetOff(target: EventObject) {
        // this.mEventHandler.targetOff(target);
    }

    /** 触发事件 */
    public Emit(name: EventName, ...args: any): void {
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
