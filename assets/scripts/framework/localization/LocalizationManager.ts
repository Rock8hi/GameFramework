import { _decorator, Enum } from 'cc';
import { BaseManager } from '@framework/base/BaseManager';
import { LocalType } from './LocalizationDefine';
// import { LanguageLabel } from '@IL8/views/others/LanguageLabel';
// import { LanguageSprite } from '@IL8/views/others/LanguageSprite';

const { ccclass, property } = _decorator;

/**
 * 多语言管理
 */
@ccclass('LocalizationManager')
export class LocalizationManager extends BaseManager {
    @property({ type: Enum(LocalType), displayName: '默认语言' })
    private mLocalType: LocalType = LocalType.zh_CN;

    public get LangType() {
        return this.mLocalType;
    }

    protected OnLoad() {
        super.OnLoad();
        // this.mLocalType = IL8.Disk.GetNumber('language', this.mLocalType);
        // Entry.Model.Languages.SetLangType(LangType[this.mLocalType]);
    }

    public ChangeLanguage(ty: LocalType) {
        if (ty === this.mLocalType) {
            return;
        }
        this.mLocalType = ty;
        // Entry.Model.Languages.SetLangType(LangType[this.mLocalType]);
        // IL8.Disk.Set('language', ty);
        // const labels = IL8.View.RootNode.getComponentsInChildren(LanguageLabel);
        // labels.forEach(val => val.UpdateView());
        // const sprites = IL8.View.RootNode.getComponentsInChildren(LanguageSprite);
        // sprites.forEach(val => val.UpdateView());
        // TODO
        // game.restart();
    }
}
