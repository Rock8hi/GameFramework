import { Entry } from '@framework/Entry';
import { BaseObject } from '@framework/mvcs/base/BaseObject';

/** 将属性名转换为类名，如 mLoginCtrl -> LoginCtrl */
function key2name(key: string) {
    if (key[0] === 'm' || key[0] === '_') {
        return key.slice(1);
    }
    if (/^[a-z].+/.test(key)) {
        return key.charAt(0).toUpperCase() + key.slice(1);
    }
}

/** 绑定读取属性 */
function _bindprop(target: any, key: string, getter: () => any) {
    Object.defineProperty(target, key, {
        get: getter,
        set: function (val) {
            if (val) {
                throw new Error('不需要直接设置属性');
            }
        },
    });
}

/** 绑定读取属性，读取时调用getter函数 */
export function bindprop(getter: () => any) {
    return function (target: any, key: string) {
        _bindprop(target, key, getter);
    };
}

/** 绑定指定的model，无括号，无参数 */
export function bindmodel(target: any, key: string): void;

/** 绑定指定的model，有括号，指定model名称或原型，或为空 */
export function bindmodel(clazz?: string | { prototype: BaseObject }): (target: any, key: string) => void;

export function bindmodel(arg1?: any, arg2?: any) {
    if (arg2 && typeof arg1 === 'object') {
        return _bindprop(arg1, arg2, () => Entry.Model.Get(key2name(arg2)));
    }
    return function (target: any, key: string) {
        _bindprop(target, key, () => Entry.Model.Get(arg1 || key2name(key)));
    };
}

/** 绑定指定的controller，无括号，无参数 */
export function bindctrl(target: any, key: string): void;

/** 绑定指定的controller，有括号，指定controller名称或原型，或为空 */
export function bindctrl(clazz?: string | { prototype: BaseObject }): (target: any, key: string) => void;

export function bindctrl(arg1?: any, arg2?: any) {
    if (arg2 && typeof arg1 === 'object') {
        return _bindprop(arg1, arg2, () => Entry.Ctrl.Get(key2name(arg2)));
    }
    return function (target: any, key: string) {
        _bindprop(target, key, () => Entry.Ctrl.Get(arg1 || key2name(key)));
    };
}

/** 绑定指定的service，无括号，无参数 */
export function bindserv(target: any, key: string): void;

/** 绑定指定的service，有括号，指定service名称或原型，或为空 */
export function bindserv(clazz?: string | { prototype: BaseObject }): (target: any, key: string) => void;

export function bindserv(arg1?: any, arg2?: any) {
    if (arg2 && typeof arg1 === 'object') {
        return _bindprop(arg1, arg2, () => Entry.Serv.Get(key2name(arg2)));
    }
    return function (target: any, key: string) {
        _bindprop(target, key, () => Entry.Serv.Get(arg1 || key2name(key)));
    };
}
