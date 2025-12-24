import { _decorator, Node, Label } from 'cc';
import { BaseComponent } from '@framework/base/BaseComponent';
import { BaseEntry } from '@framework/BaseEntry';
import { I18nModel } from './I18nModel';

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
        this.getComponent(Label).string = BaseEntry.Model.Get(I18nModel).GetText(this.mItemKey);
    }
}
