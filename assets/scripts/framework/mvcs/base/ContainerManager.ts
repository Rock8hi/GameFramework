import { _decorator, __private, js } from 'cc';
import { BaseManager } from '@framework/base/BaseManager';
import { BaseObject } from '../base/BaseObject';
import { Utils } from '../../utils/Utils';

const { ccclass, property } = _decorator;

/**
 * model、controller、service管理
 */
@ccclass('ContainerManager')
export abstract class ContainerManager<Cell extends BaseObject> extends BaseManager {
    // @property({ type: [BaseObject], displayName: 'Model列表' })
    /** 存放model、controller、service实例的字典型容器 */
    protected mCellDict: Map<string, Cell> = new Map();

    protected abstract OnInit(): void;

    protected OnLoad() {
        super.OnLoad();
        this.OnInit();
        this.mCellDict!.forEach(val => val['OnInit']());
    }

    protected OnUpdate(dt: number): void {
        super.OnUpdate(dt);
        this.mCellDict!.forEach(val => val['OnStep'](dt));
    }

    protected OnDestroy() {
        this.mCellDict!.forEach(val => val['OnFree']());
        this.mCellDict!.clear();
        super.OnDestroy();
    }

    /**
     * 通过类构造函数或类名获取对应的实例
     * @param clazz 类构造函数或类名
     * @returns 实例对象
     */
    public Get<T extends Cell>(clazz: string | __private.__types_globals__Constructor<T>): T | null {
        const name = typeof clazz === 'string' ? clazz : js.getClassName(clazz);
        return this.mCellDict!.has(name) ? (this.mCellDict!.get(name) as T) : null;
    }

    public Dump() {
        console.debug(js.getClassName(this), this.mCellDict!.size);
        this.mCellDict!.forEach((val, key) => console.debug(key, val));
    }

    /**
     * 根据类名列表实例化并存放到容器内
     * @param list 类名列表
     */
    protected HandInitContainer(list: Array<any>) {
        list.forEach(name_or_clazz => {
            if (typeof name_or_clazz == 'string') {
                this.InitCellByClassName(name_or_clazz);
            } else {
                this.InitCellByClass(name_or_clazz);
            }
        });
    }

    /**
     * 实现自动抓取superclass的派生类列表
     * @param superclass 被派生的父类
     */
    protected AutoInitContainer(superclass: any) {
        Utils.GetDerivedClasses(superclass)
            .sort((a, b) => a.prototype.Priority - b.prototype.Priority)
            .forEach(clazz => this.InitCellByClass(clazz));
    }

    /**
     * 根据类名称实例化
     * @param clazz 类名称
     */
    private InitCellByClassName(name: string) {
        const clazz = js.getClassByName(name);
        if (!clazz) {
            // 未查找对应的类，可能是类名错误
            console.warn('class is not existed. class:', name);
            return;
        }
        if (this.mCellDict!.has(name)) {
            // 禁止重复实例化，一个类仅支持一个实例
            console.warn('class has already been instantiated. class:', name);
            return;
        }
        this.mCellDict!.set(name, new clazz() as Cell);
    }

    /**
     * 根据类原型实例化
     * @param clazz 类原型
     */
    private InitCellByClass(clazz: any) {
        const name = js.getClassName(clazz);
        if (!name) {
            console.warn('class is unregistered. class:', clazz);
            return;
        }
        if (this.mCellDict!.has(name)) {
            // 禁止重复实例化，一个类仅支持一个实例
            console.warn('class has already been instantiated. class:', name);
            return;
        }
        this.mCellDict!.set(name, new clazz() as Cell);
    }
}
