import { _decorator, Node, Sprite, SpriteFrame } from 'cc';
import { BaseComponent } from '@framework/base/BaseComponent';
import { Entry } from '@framework/Entry';
import { I18nModel } from './I18nModel';

const { ccclass, property, requireComponent, disallowMultiple } = _decorator;

/** 多语言精灵 */
@ccclass('I18nSprite')
@requireComponent(Sprite)
@disallowMultiple(true)
export class I18nSprite extends BaseComponent {
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
        const text = Entry.Model.Get(I18nModel).GetText(this.mItemKey);
        const arr = text.split(':');
        if (!arr || arr.length == 0) {
            console.warn('多语言内容为空');
            return;
        }
        let bundle: string, url: string;
        if (arr.length == 1) {
            bundle = 'resources';
            url = arr[0];
        } else {
            bundle = arr[0];
            url = arr[1];
        }
        Entry.Res.LoadAsset(this, bundle, `${url}/spriteFrame`, SpriteFrame, (err, res) => {
            if (err) {
                console.warn(err);
                return;
            }
            this.getComponent(Sprite).spriteFrame = res;
        });
    }
}
