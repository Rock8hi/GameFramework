import { _decorator } from 'cc';
import { BaseComponent } from './BaseComponent';

const { ccclass } = _decorator;

/**
 * 生命周期方法
 */
@ccclass('BaseManager')
export abstract class BaseManager extends BaseComponent {
    protected OnLoad(): void {
        super.OnLoad();
    }

    protected OnStart(): void {
        super.OnStart();
    }

    protected OnUpdate(dt: number): void {
        super.OnUpdate(dt);
    }

    protected OnLateUpdate(dt: number): void {
        super.OnLateUpdate(dt);
    }

    protected OnEnable(): void {
        super.OnEnable();
    }

    protected OnDisable(): void {
        super.OnDisable();
    }

    protected OnDestroy(): void {
        super.OnDestroy();
    }
}
