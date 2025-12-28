import { _decorator, Enum } from 'cc';
import { BaseManager } from '@framework/base/BaseManager';
import { LangType } from './I18nDefine';
import { Entry } from '@framework/Entry';
import { I18nModel } from '@framework/i18n/I18nModel';

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
        this.mLangType = Entry.Store.GetNumber('language', this.mLangType);
        Entry.Model.Get(I18nModel).SetLang(this.mLangType);
    }

    public ChangeLanguage(ty: LangType) {
        if (ty === this.mLangType) {
            return;
        }
        this.mLangType = ty;
        Entry.Model.Get(I18nModel).SetLang(this.mLangType);
        Entry.Store.SetNumber('language', this.mLangType);
        // TODO
        // const labels = Entry.View.RootNode.getComponentsInChildren(I18nLabel);
        // labels.forEach(val => val.UpdateView());
        // const sprites = Entry.View.RootNode.getComponentsInChildren(I18nSprite);
        // sprites.forEach(val => val.UpdateView());
        // TODO
        // game.restart();
    }
}
