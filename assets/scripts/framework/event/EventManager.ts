import { _decorator, EventTarget } from 'cc';
import { BaseManager } from '@framework/base/BaseManager';
import { BaseComponent } from '@framework/base/BaseComponent';
import { BaseController } from '@framework/mvcs/controller/BaseController';

const { ccclass } = _decorator;

export type EventName = string | number;
export type EventListener = (...args: any) => void;
export type EventObject = BaseComponent | BaseController;

/**
 * 事件管理
 */
@ccclass('EventManager')
export class EventManager extends BaseManager {
    private readonly mEventHandler: EventTarget = new EventTarget();

    /** 一次性注册监听事件 */
    public Once(name: EventName, listener: EventListener, target?: EventObject): void {
        this.mEventHandler!.once(name, listener, target);
    }

    /** 注册监听事件 */
    public On(name: EventName, listener: EventListener, target?: EventObject): void {
        this.mEventHandler!.on(name, listener, target);
    }

    /** 取消所有name的事件监听 */
    public Off(name: EventName): void;
    /** 取消某个事件监听 */
    public Off(name: EventName, listener: EventListener): void;
    /** 取消事件监听 */
    public Off(name: EventName, listener: EventListener, target: EventObject): void;

    /** 取消事件监听 */
    public Off(name: EventName, listener?: EventListener, target?: EventObject): void {
        this.mEventHandler!.off(name, listener, target);
    }

    /** 移除在某个对象上的监听 */
    public TargetOff(target: EventObject) {
        this.mEventHandler!.targetOff(target);
    }

    /** 触发事件 */
    public Emit(name: EventName, arg0?: any, arg1?: any, arg2?: any, arg3?: any): void {
        this.mEventHandler!.emit(name, arg0, arg1, arg2, arg3);
    }
}
