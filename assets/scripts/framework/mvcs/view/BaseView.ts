import { _decorator, Color, Node, Sprite, SpriteFrame, tween, Tween, Vec3, js } from 'cc';
import { BaseComponent } from '@framework/base/BaseComponent';
import { ViewType } from './ViewDefine';
import { BaseEntry } from '@framework/BaseEntry';
import { EventName } from '@config/EventDefine';

const { ccclass, property } = _decorator;

/**
 * 界面组件基类
 */
@ccclass('BaseView')
export abstract class BaseView extends BaseComponent {
    @property({ type: [SpriteFrame], displayName: '静态资源' })
    private mSpriteFrames: SpriteFrame[] = [];

    @property({ type: Node, displayName: '阴影节点', tooltip: '可为空，有值时用于统一设置阴影的透明度' })
    private mMask: Node = null;

    @property({ type: Node, displayName: '布局节点', tooltip: '可为空，有值时用于打开和关闭时缩放动画' })
    private mView: Node = null;

    private mOldScale: Vec3 = null;

    /** 界面预制体所在的bundle和路径 */
    protected abstract GetPrefabURL(): { bundle: string; prefab: string };

    /** 渲染层级 */
    protected abstract GetDrawLevel(): ViewType;

    /** 是否允许同时展示多个此界面 */
    protected IsRepeatableView() {
        return false;
    }

    /** 根据名称获取精灵帧 */
    protected GetSpriteFrame(name: string): SpriteFrame {
        return this.mSpriteFrames.find(val => val.name == name);
    }

    protected OnLoad(): void {
        super.OnLoad();
        this.mMask && (this.mMask.getComponent(Sprite).color = new Color('#000000AA'));
        this.mOldScale = this.node.scale.clone();
    }

    /**
     * 打开界面时触发此方法；首次打开此界面时，生命周期为OnLoad->OnShow->OnStart，被回收再次打开时只有OnShow
     * @param args 打开界面时传递的参数
     */
    protected OnShow(...args: any): void {
        BaseEntry.Event.Emit(EventName.VIEW_OPENED, js.getClassName(this));
    }

    /** 关闭界面时触发此方法 */
    protected OnHide() {
        BaseEntry.Event.Emit(EventName.VIEW_CLOSED, js.getClassName(this));
    }

    /** 关闭界面，常用于关闭按钮 */
    protected OnClose() {
        BaseEntry.View.Hide(this.node);
    }

    /** 入场动画 */
    protected OnFadeShow(): Promise<void> {
        return new Promise(resolve => {
            if (!this.mView) {
                resolve();
                return;
            }
            Tween.stopAllByTarget(this.mView);
            tween(this.mView)
                .set({ scale: new Vec3(0, 0, 1) })
                .to(0.3, { scale: this.mOldScale.clone() }, { easing: 'backOut' })
                .call(() => resolve())
                .start();
        });
    }

    /** 出场动画 */
    protected OnFadeHide(): Promise<void> {
        return new Promise(resolve => {
            if (!this.mView) {
                resolve();
                return;
            }
            Tween.stopAllByTarget(this.mView);
            tween(this.mView)
                .to(0.2, { scale: new Vec3(0, 0, 1) }, { easing: 'backIn' })
                .call(() => resolve())
                .start();
        });
    }
}
