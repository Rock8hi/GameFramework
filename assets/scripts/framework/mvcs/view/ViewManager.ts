import { _decorator, js, Node, Camera } from 'cc';
import { BaseManager } from '@framework/base/BaseManager';
import { ViewInfo, ViewStat, ViewType } from './ViewDefine';
import { ViewPool } from './ViewPool';
import { BaseView } from './BaseView';

const { ccclass, property } = _decorator;

@ccclass('ViewManager')
export class ViewManager extends BaseManager {
    @property({ type: Camera, displayName: '2D相机' })
    private mCamera2D: Camera = null;

    @property({ type: Node, displayName: '根渲染节点' })
    private mRootNode: Node = null;

    @property({ type: Node, displayName: '全屏场景层' })
    private mSceneNode: Node = null;

    @property({ type: Node, displayName: '全屏界面层' })
    private mLayerNode: Node = null;

    @property({ type: Node, displayName: '弹框层' })
    private mPopUpNode: Node = null;

    @property({ type: Node, displayName: 'Toast层' })
    private mToastNode: Node = null;

    @property({ type: Node, displayName: '引导层' })
    private mGuideNode: Node = null;

    /** 2D渲染相机 */
    public get Camera2D() {
        return this.mCamera2D;
    }

    /** 多个渲染层级的根节点 */
    public get RootNode() {
        return this.mRootNode;
    }

    /** Toast渲染层级 */
    public get ToastNode() {
        return this.mToastNode;
    }

    /** 节点池，被回收的预制体对象放在这里 */
    private mViewPool: ViewPool = null;
    /** 已经实例化的预制体的状态数据列表 */
    private mViewInfoList: Array<ViewInfo> = new Array();

    /**
     * 获取一个已经实例化的预制体的状态数据
     * @param arg 支持4种类型参数，BaseView子类的类名、原型、实例、节点
     */
    private GetViewInfoIndex(arg: any) {
        // 支持类名查询
        if (typeof arg === 'string') {
            return this.mViewInfoList.findIndex(val => val.name == arg);
        }
        // 支持实例和原型查询
        if (arg instanceof BaseView || js.isChildClassOf(arg, BaseView)) {
            const name = js.getClassName(arg);
            return this.mViewInfoList.findIndex(val => val.name == name);
        }
        // 支持节点查询
        if (arg instanceof Node) {
            return this.mViewInfoList.findIndex(val => val.node == arg);
        }
        return -1;
    }

    protected OnLoad(): void {
        super.OnLoad();
        this.mViewPool = this.getComponent(ViewPool) || this.addComponent(ViewPool);
    }

    protected OnDestroy(): void {
        super.OnDestroy();
    }

    /**
     * 打开界面
     * @param view 支持2种类型参数，BaseView子类的类名或原型
     * @param args 传递给被打开界面的参数
     * @returns 界面编号，可用来关闭界面
     */
    public Show(view: any, ...args: any): Promise<void> {
        return new Promise(async (resolve, reject) => {
            let name: string;
            let clazz: any;
            if (typeof view === 'string') {
                name = view;
                clazz = js.getClassByName(name);
                if (!js.isChildClassOf(clazz, BaseView)) {
                    reject('尝试使用类名打开界面，但类名错误 class: ' + name);
                    return;
                }
            } else if (js.isChildClassOf(view, BaseView)) {
                name = js.getClassName(view);
                clazz = view;
            } else {
                reject('打开界面时使用了不支持的参数');
                return;
            }
            if (!clazz.prototype.IsRepeatableView() && this.mViewInfoList.some(val => val.name == name)) {
                console.warn('禁止重复加载同一个预制体界面');
                resolve();
                return;
            }

            const info = { name: name, node: null, stat: ViewStat.load };
            this.mViewInfoList.push(info);

            const node = await this.mViewPool.Get(clazz);
            if (!node) {
                reject('获取预制体实例失败');
                return;
            }
            const comp = node.getComponent(BaseView);
            if (!comp) {
                reject('获取BaseView派生类组件失败');
                return;
            }
            // @ts-ignore
            node.parent = this.GetParent(comp.GetDrawLevel());
            info.node = node;
            // @ts-ignore
            !!comp.OnShow && comp.OnShow(...args);
            info.stat = ViewStat.fadein;
            // @ts-ignore
            await comp.OnFadeShow();
            info.stat = ViewStat.show;
            resolve();
        });
    }

    /**
     * 关闭界面 多实例的情况只支持传入node来关闭界面
     * @param view 支持4种类型参数，BaseView子类的类名、原型、实例、节点
     */
    public Hide(view: any): Promise<void> {
        return new Promise(async (resolve, reject) => {
            const idx = this.GetViewInfoIndex(view);
            if (idx < 0) {
                resolve();
                return;
            }
            const info = this.mViewInfoList[idx];
            if (info.stat === ViewStat.destroyed || info.stat === ViewStat.fadeout) {
                // 防止重复关闭同一个界面
                resolve();
                return;
            }
            const comp = info.node.getComponent(BaseView);
            if (!comp) {
                info.stat = ViewStat.destroyed;
                this.isValid && info.node.destroy();
                this.mViewInfoList.splice(idx, 1);
                reject('获取BaseView派生类组件失败');
                return;
            }
            // @ts-ignore
            if (comp.IsRepeatableView() && !(view instanceof Node)) {
                console.warn(`支持多实例的界面(${comp.name}), 仅支持传入Node的方式关闭`);
                resolve();
                return;
            }
            info.stat = ViewStat.fadeout;
            // @ts-ignore
            !!comp.OnHide && comp.OnHide();
            // @ts-ignore
            await comp.OnFadeHide();
            info.stat = ViewStat.destroyed;
            this.mViewInfoList.splice(this.mViewInfoList.indexOf(info), 1);
            this.mViewPool.Put(info);
            resolve();
        });
    }

    public Has(view: any): boolean {
        const idx = this.GetViewInfoIndex(view);
        if (idx < 0) {
            return false;
        }
        const info = this.mViewInfoList[idx];
        return !!info && info.stat !== ViewStat.destroyed;
    }

    public Get(view: any): Node {
        const idx = this.GetViewInfoIndex(view);
        if (idx < 0) {
            return;
        }
        const info = this.mViewInfoList[idx];
        if (info && info.stat !== ViewStat.destroyed) {
            return info.node;
        }
    }

    public Clear() {
        this.mViewInfoList.forEach(val => {
            val.stat = ViewStat.destroyed;
            // val.node && val.node.destroy();
            this.mViewPool.Put(val);
        });
        this.mViewInfoList.splice(0, this.mViewInfoList.length);
    }

    private GetParent(type: number) {
        switch (type) {
            case ViewType.scene:
                return this.mSceneNode;
            case ViewType.layer:
                return this.mLayerNode;
            case ViewType.popup:
                return this.mPopUpNode;
            case ViewType.toast:
                return this.mToastNode;
            case ViewType.guide:
                return this.mGuideNode;
            default:
                console.warn(`层级错误 type: ${type}`);
                return this.mRootNode;
        }
    }
}
