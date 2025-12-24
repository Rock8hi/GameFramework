import { _decorator, JsonAsset } from 'cc';
import { BaseEntry } from '@framework/BaseEntry';
import { BaseContext } from '@framework/BaseContext';
import { I18nManager } from '@extension/i18n/I18nManager';
import { Entry } from '@extension/Entry';

const { ccclass, property } = _decorator;

@ccclass
export class Context extends BaseContext {
    @property(I18nManager)
    private mLocalMgr: I18nManager = null;

    protected OnLoad(): void {
        super.OnLoad();
        Entry.I18n = this.mLocalMgr;
    }

    protected OnStart(): void {
        super.OnStart();

        // BaseEntry.Res.LoadAsset('hello', 'game1', 'config/prefabs', JsonAsset, (err, res) => {
        //     if (err) {
        //         console.warn('err', err);
        //         return;
        //     }
        //     BaseEntry.Model.Dump();
        // });
        BaseEntry.View.Show('TestView');
    }
}
