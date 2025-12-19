import { _decorator, sys } from 'cc';
import { BaseManager } from '@framework/base/BaseManager';

const { ccclass } = _decorator;

/**
 * 存储管理
 */
@ccclass('StorageManager')
export class StorageManager extends BaseManager {
    public SetUser(user: string): void {
        if (!user || user === this.mUser) {
            return;
        }
        this.mUser = user;
    }

    public SetJson(key: string, val: any) {
        try {
            this.SetData(key, JSON.stringify(val));
        } catch (err) {
            return;
        }
    }

    public SetString(key: string, val: string): void {
        this.SetData(key, val);
    }

    public SetNumber(key: string, val: number): void {
        this.SetData(key, val + '');
    }

    public SetBoolean(key: string, val: boolean): void {
        this.SetData(key, val ? 'true' : 'false');
    }

    public GetJson(key: string, val: any = {}) {
        const dat = this.GetString(key);
        try {
            return JSON.parse(dat);
        } catch (err) {
            return val;
        }
    }

    public GetString(key: string, val: string = ''): string {
        const dat = this.GetData(key);
        if (!dat) {
            return val;
        }
        return dat;
    }

    public GetNumber(key: string, val: number = 0): number {
        const dat = this.GetData(key);
        if (!dat) {
            return val;
        }
        const num = Number(dat);
        if (isNaN(num)) {
            return val;
        }
        return num;
    }

    public GetBoolean(key: string, val: boolean = false): boolean {
        const dat = this.GetData(key);
        if (!dat) {
            return val;
        }
        if (dat === 'true') {
            return true;
        }
        if (dat === 'false') {
            return false;
        }
        return val;
    }

    public Remove(key: string): void {
        if (!key) {
            return;
        }
        this.mStorage.removeItem(this.GetFullKey(key));
    }

    public Clear(): void {
        const storage = this.mStorage;
        const keys: string[] = [];
        for (let i = 0; i < storage.length; i++) {
            const key = storage.key(i);
            if (!key) {
                continue;
            }
            if (!key.startsWith(`${this.mUser!}:`)) {
                continue;
            }
            keys.push(key);
        }
        keys.forEach(key => storage.removeItem(key));
    }

    public ClearAll(): void {
        this.mStorage.clear();
    }

    // #region ================ private region ================

    private mUser: string = 'default';

    private get mStorage(): Storage {
        return sys.localStorage;
    }

    private GetFullKey(key: string) {
        return `${this.mUser!}:${key}`;
    }

    private SetData(key: string, val: string): void {
        if (!key) {
            return;
        }
        this.mStorage.setItem(this.GetFullKey(key), val);
    }

    private GetData(key: string): string | null {
        if (!key) {
            return null;
        }
        return this.mStorage.getItem(this.GetFullKey(key));
    }
}
