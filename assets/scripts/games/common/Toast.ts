import { _decorator, Node, Label, UITransform, Size, UIOpacity, tween, view, Vec3 } from 'cc';
import { BaseView } from '@framework/mvcs/view/BaseView';
import { Entry } from '@framework/Entry';
import { ViewType } from '@framework/mvcs/view/ViewDefine';
import { BundleName } from '@config/Config';
import { I18nModel } from '@extension/models/I18nModel';

const { ccclass, property } = _decorator;

const MAX_WIDTH: number = 650;

@ccclass('Toast')
export class Toast extends BaseView {
    @property({ type: Node })
    private mBack: Node = null;

    @property({ type: Label })
    private mText: Label = null;

    // 控制下一个toast的高度
    private static mHeight: number = 0;

    protected GetPrefabURL(): { bundle: string; prefab: string } {
        return { bundle: BundleName.DEFAULT, prefab: 'prefabs/Toast' };
    }

    protected GetDrawLevel(): ViewType {
        return ViewType.toast;
    }

    protected IsRepeatableView(): boolean {
        return true;
    }

    protected OnLoad(): void {
        super.OnLoad();
    }

    protected OnShow(text: string) {
        super.OnShow();
        const transform = this.mText.getComponent(UITransform);
        this.mText.overflow = Label.Overflow.NONE;
        this.mText.enableWrapText = false;
        this.mText.string = text;
        this.mText.updateRenderData();
        if (transform.width + 50 < MAX_WIDTH) {
            this.mBack.getComponent(UITransform).contentSize = new Size(transform.width + 50, 76);
            this.DelayShow();
            return;
        }
        this.mText.overflow = Label.Overflow.RESIZE_HEIGHT;
        this.mText.enableWrapText = true;
        this.mText.getComponent(UITransform).width = MAX_WIDTH - 50;
        this.mText.updateRenderData();
        this.mBack.getComponent(UITransform).contentSize = new Size(MAX_WIDTH, transform.height + 30);
        this.DelayShow();
    }

    private DelayShow() {
        const opa = this.mBack.getComponent(UIOpacity) || this.mBack.addComponent(UIOpacity);
        tween(opa).set({ opacity: 0 }).to(0.2, { opacity: 255 }).start();

        const screenSize = view.getVisibleSize();
        const bgHeight = this.mBack.getComponent(UITransform).height;
        const screenTop = screenSize.height * 0.5;
        tween(this.mBack)
            // 将toast框起点设定在屏幕顶部之外
            .set({ position: new Vec3(0, screenTop + bgHeight * 0.5 + 100, 0) })
            .to(0.2, { position: new Vec3(0, screenTop - (Toast.mHeight + bgHeight * 0.5), 0) })
            .start();
        // 累加下一个toast的高度
        Toast.mHeight += bgHeight + 5;

        this.scheduleOnce(() => {
            tween(opa)
                .to(0.3, { opacity: 0 })
                .call(() => Entry.View.Hide(this.node))
                .start();
        }, 3);
    }

    public static Show(text: string) {
        // 若当前没有其他toast在展示，则此值指向顶部
        !Entry.View.Has(Toast) && (Toast.mHeight = 100);
        if (text.startsWith('#')) {
            Entry.View.Show(Toast, Entry.Model.Get(I18nModel).GetText(text.substring(1)));
        } else {
            Entry.View.Show(Toast, text);
        }
    }
}
