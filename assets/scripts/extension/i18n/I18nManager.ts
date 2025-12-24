import { _decorator, Enum } from 'cc';
import { BaseManager } from '@framework/base/BaseManager';
import { LangType } from './I18nDefine';
import { BaseEntry } from '@framework/BaseEntry';
import { I18nModel } from '@extension/i18n/I18nModel';

const { ccclass, property } = _decorator;

/**
 * 多语言管理
 */
@ccclass('I18nManager')
export class I18nManager extends BaseManager {
    @property({ type: Enum(LangType), displayName: '默认语言' })
    private mLangType: LangType = LangType.zh_CN;

    public get LangType() {
        return this.mLangType;
    }

    protected OnLoad() {
        super.OnLoad();
        this.mLangType = BaseEntry.Storage.GetNumber('language', this.mLangType);
        BaseEntry.Model.Get(I18nModel).SetLang(this.mLangType);
    }

    public ChangeLanguage(ty: LangType) {
        if (ty === this.mLangType) {
            return;
        }
        this.mLangType = ty;
        BaseEntry.Model.Get(I18nModel).SetLang(this.mLangType);
        BaseEntry.Storage.SetNumber('language', this.mLangType);
        // TODO
        // const labels = BaseEntry.View.RootNode.getComponentsInChildren(I18nLabel);
        // labels.forEach(val => val.UpdateView());
        // const sprites = BaseEntry.View.RootNode.getComponentsInChildren(I18nSprite);
        // sprites.forEach(val => val.UpdateView());
        // TODO
        // game.restart();
    }
}
