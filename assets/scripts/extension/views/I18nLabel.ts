import { _decorator, Node, Label } from 'cc';
import { BaseComponent } from '@framework/base/BaseComponent';
import { Entry } from '@framework/Entry';
import { I18nModel } from '@extension/models/I18nModel';

const { ccclass, property, requireComponent, disallowMultiple } = _decorator;

/** 多语言文本 */
@ccclass('I18nLabel')
@requireComponent(Label)
@disallowMultiple(true)
export class I18nLabel extends BaseComponent {
    @property({ displayName: '翻译表中的key' })
    private mItemKey: string = '';

    protected OnLoad(): void {
        super.OnLoad();
    }

    protected OnStart(): void {
        super.OnStart();
        if (!this.mItemKey) {
            console.warn('多语言key是空');
            return;
        }
        this.getComponent(Label).string = Entry.Model.Get(I18nModel).GetText(this.mItemKey);
    }
}
