import { _decorator, Node, NodePool } from 'cc';
import { DEVELOP } from 'cc/userland/macro';
import { BaseManager } from '@framework/base/BaseManager';

const { ccclass } = _decorator;

/**
 * 节点池管理器
 * 如果加入精灵节点，建议置空spriteFrame，以避免纹理计数异常而无法释放资源
 */
@ccclass('PoolManager')
export class PoolManager extends BaseManager {
    private mPoolDict: Map<string, NodePool> = new Map();

    protected OnDestroy(): void {
        this.mPoolDict.forEach(val => {
            let cnt = val.size();
            while (cnt-- > 0) {
                val.get()?.destroy();
            }
        });
        this.mPoolDict.clear();
        super.OnDestroy();
    }

    public Dump() {
        if (DEVELOP) {
            console.log('=======================PoolManager=======================');
            this.mPoolDict!.forEach((val, key) => console.log(key, val));
            console.log('=======================PoolManager=======================');
        }
    }

    public GetOrNewPool(key: string) {
        if (!key) {
            console.warn('GetOrNewPool, empty key');
            return;
        }
        return this.mPoolDict.get(key) || this.mPoolDict.set(key, new NodePool()).get(key);
    }

    public GetPool(key: string) {
        if (!key) {
            console.warn('GetPool, empty key');
            return;
        }
        return this.mPoolDict.get(key) || null;
    }

    public DelPool(key: string) {
        if (!key) {
            console.warn('DelPool, empty key');
            return;
        }
        if (!this.mPoolDict.has(key)) {
            return;
        }
        const val = this.mPoolDict.get(key);
        let cnt = val.size();
        while (cnt-- > 0) {
            val.get()?.destroy();
        }
        this.mPoolDict.delete(key);
    }
}
