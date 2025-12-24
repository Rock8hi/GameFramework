import { _decorator, Node, Label, UITransform } from 'cc';
import { BaseView } from '@framework/mvcs/view/BaseView';
import { BaseEntry } from '@framework/BaseEntry';
import { ViewType } from '@framework/mvcs/view/ViewDefine';
import { BundleName } from '@config/Config';

type Params = {
    content: string;
    title?: string;
    okay?: string;
    cancel?: string;
    cb_okay?: boolean | Function;
    cb_cancel?: boolean | Function;
};

const { ccclass, property } = _decorator;

/**
 * 系统弹框
 * 1. 支持修改标题和按钮的文本
 * 2. 支持根据文本内容自动调整弹框高度
 * 3. 支持按钮回调
 *
 * 示例:
 *
 * SysBox.Show('Hello World');
 *
 * SysBox.Show({content: 'Hello World', title: 'Warn', okay: 'OK', cb_okay: () => {}, cb_cancel: true});
 */
@ccclass('SysBox')
export class SysBox extends BaseView {
    @property({ type: Node })
    private mBackground: Node = null;

    @property({ type: Label })
    private mLabelTitle: Label = null;

    @property({ type: Label })
    private mLabelContent: Label = null;

    @property({ type: Node })
    private mBtnOkay: Node = null;

    @property({ type: Node })
    private mBtnCancel: Node = null;

    @property({ type: Node })
    private mBtnCenter: Node = null;

    @property({ type: Label })
    private mLabelOkay: Label = null;

    @property({ type: Label })
    private mLabelCancel: Label = null;

    @property({ type: Label })
    private mLabelCenter: Label = null;

    private mOkayCallback: Function = null;
    private mCancelCallback: Function = null;

    protected GetPrefabURL(): { bundle: string; prefab: string } {
        return { bundle: BundleName.DEFAULT, prefab: 'prefabs/SysBox' };
    }

    protected GetDrawLevel(): ViewType {
        return ViewType.toast;
    }

    protected OnLoad(): void {
        super.OnLoad();
    }

    protected OnShow(text: string | Params) {
        super.OnShow();
        this.mOkayCallback = null;
        this.mCancelCallback = null;
        // 仅显示文本
        if (typeof text == 'string') {
            this.SetContent(text);
            this.UpdateButtons(false);
            return;
        }
        this.SetContent(text.content);
        text.title && (this.mLabelTitle.string = text.title);
        // 显示中间按钮，并自定义标题、按钮等
        if (!text.cb_cancel) {
            text.okay && (this.mLabelCenter.string = text.okay);
            this.UpdateButtons(false);
            typeof text.cb_okay == 'function' && (this.mOkayCallback = text.cb_okay);
            return;
        }
        // 双按钮
        text.okay && (this.mLabelOkay.string = text.okay);
        text.cancel && (this.mLabelCancel.string = text.cancel);
        this.UpdateButtons(true);
        typeof text.cb_okay == 'function' && (this.mOkayCallback = text.cb_okay);
        typeof text.cb_cancel == 'function' && (this.mCancelCallback = text.cb_cancel);
    }

    private SetContent(text: string) {
        this.mLabelContent.string = text;
        this.mLabelContent.updateRenderData();
        const height = this.mLabelContent.getComponent(UITransform).height;
        if (height > 180) {
            this.mBackground.getComponent(UITransform).height = height + 270;
        }
    }

    private UpdateButtons(istwo: boolean) {
        this.mBtnOkay.active = istwo;
        this.mBtnCancel.active = istwo;
        this.mLabelOkay.node.active = istwo;
        this.mLabelCancel.node.active = istwo;
        this.mBtnCenter.active = !istwo;
        this.mLabelCenter.node.active = !istwo;
    }

    private OnClickOkay() {
        this.mOkayCallback && this.mOkayCallback();
        this.OnClose();
    }

    private OnClickCancel() {
        this.mCancelCallback && this.mCancelCallback();
        this.OnClose();
    }

    public static Show(text: string | Params) {
        BaseEntry.View.Show(SysBox, text);
    }
}
