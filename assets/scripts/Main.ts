import { _decorator, JsonAsset } from 'cc';
import { Entry } from '@framework/Entry';
import { Context } from '@framework/Context';

const { ccclass, property } = _decorator;

@ccclass
export class Main extends Context {
    protected OnStart(): void {
        super.OnStart();

        // Entry.Res.LoadAsset('hello', 'game1', 'config/prefabs', JsonAsset, (err, res) => {
        //     if (err) {
        //         console.warn('err', err);
        //         return;
        //     }
        //     Entry.Model.Dump();
        // });
        Entry.View.Show('TestView');
    }
}
