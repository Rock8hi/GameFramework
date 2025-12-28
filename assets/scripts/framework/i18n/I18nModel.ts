import { _decorator, JsonAsset } from 'cc';
import { DEVELOP } from 'cc/userland/macro';
import { BaseModel } from '@framework/mvcs/model/BaseModel';
import { LangType } from '@framework/i18n/I18nDefine';
import { Entry } from '@framework/Entry';

const { ccclass } = _decorator;

interface JsonItem {
    id: string;
    lan_en: string;
    lan_zh: string;
}

export class I18nItem {
    id: string;
    lan_en: string;
    lan_zh: string;

    constructor(data: JsonItem) {
        for (const key in data) {
            if (data[key] == undefined) {
                continue;
            }
            this[key] = data[key];
        }
    }
}

/** 多语言数据表，一般都要根据自己需求和表结构做适当的代码修改 */
@ccclass('I18nModel')
export class I18nModel extends BaseModel {
    private _JsonData: object = null;
    private _ItemList: Map<string, I18nItem> = new Map();
    private _LangType: LangType = LangType.zh_CN;

    private mRegCache: Map<string, RegExp> = new Map();

    protected OnInit(): void {
        super.OnInit();
        const items = []; // Entry.Res.LoadAsset('i18n', 'resources', 'a/b/c', JsonAsset, (err, data) => {})
        for (const key in items) {
            if (this._ItemList.has(key)) {
                continue;
            }
            this._ItemList.set(key, new I18nItem(items[key]));
        }
    }

    public SetLang(ty: LangType) {
        this._LangType = ty;
    }

    public GetText(id: string, ...args: any[]) {
        const item = this._ItemList.get(id);
        if (!item) {
            return 'unknown';
        }
        let ret = item.lan_zh;
        if (!args || args.length == 0) {
            return ret;
        }
        const reg = (key: string) => {
            let ret = this.mRegCache.get(key);
            if (ret) {
                return ret;
            }
            ret = new RegExp(`\\{${key}\\}`, 'g');
            this.mRegCache.set(key, ret);
            return ret;
        };
        for (const key in args) {
            ret = ret.replace(reg(key), this._ItemList.get(args[key])?.lan_zh || args[key]);
        }
        return ret;
    }

    public Dump() {
        if (DEVELOP) {
            console.log('=======================I18nModel=======================');
            console.log('源数据:', this._JsonData);
            this._ItemList.forEach((val, idx) => console.log(idx, val));
            console.log('=======================I18nModel=======================');
        }
    }
}
