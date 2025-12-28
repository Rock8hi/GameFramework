import { _decorator, Node, Prefab, instantiate, js } from 'cc';
import { BaseComponent } from '@framework/base/BaseComponent';
import { IRecycleHandler, ViewInfo } from './ViewDefine';
import { Entry } from '@framework/Entry';

const { ccclass } = _decorator;

@ccclass('ViewPool')
export class ViewPool extends BaseComponent {
    private mNodePool: Array<ViewInfo> = new Array();

    private Pop(name: string) {
        for (let i = this.mNodePool.length - 1; i >= 0; i--) {
            if (this.mNodePool[i].name === name) {
                const ret = this.mNodePool[i];
                this.mNodePool.splice(i, 1);
                return ret.node;
            }
        }
    }

    protected OnLoad(): void {
        super.OnLoad();
    }

    protected OnDestroy(): void {
        for (let i = this.mNodePool.length - 1; i >= 0; i--) {
            this.mNodePool[i].node.destroy();
        }
        this.mNodePool.splice(0, this.mNodePool.length);
        super.OnDestroy();
    }

    protected OnUpdate(dt: number): void {
        super.OnUpdate(dt);
        for (let i = this.mNodePool.length - 1; i >= 0; i--) {
            this.mNodePool[i].life -= dt;
            if (this.mNodePool[i].life < 0) {
                this.mNodePool[i].node.destroy();
                this.mNodePool.splice(i, 1);
            }
        }
    }

    public Get(clazz: any, ...args: any): Promise<Node> {
        return new Promise((resolve, reject) => {
            const name = js.getClassName(clazz);
            const obj = this.Pop(name);
            if (obj) {
                const handlers = obj.components as unknown as IRecycleHandler[];
                handlers.forEach(val => val.OnReuse && val.OnReuse(...args));
                resolve(obj);
                return;
            }
            const { bundle, prefab } = clazz.prototype.GetPrefabURL();
            Entry.Res.LoadAsset(name, bundle, prefab, Prefab, (err: Error, data: Prefab) => {
                if (err) {
                    reject(err);
                    return;
                }
                const obj = instantiate(data);
                resolve(obj);
            });
        });
    }

    public Put(info: ViewInfo, life: number = 300) {
        const handlers = info.node.components as unknown as IRecycleHandler[];
        handlers.forEach(val => val.OnUnuse && val.OnUnuse());
        info.node.removeFromParent();
        const val = { ...info };
        val.life = life;
        this.mNodePool.push(val);
    }
}
