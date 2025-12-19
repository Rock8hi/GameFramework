import { _decorator, Component } from 'cc';

const { ccclass } = _decorator;

/**
 * 生命周期方法
 */
@ccclass('BaseComponent')
export abstract class BaseComponent extends Component {
    protected onLoad(): void {
        this.OnLoad();
    }

    protected start(): void {
        this.OnStart();
    }

    protected update(dt: number): void {
        this.OnUpdate(dt);
    }

    protected lateUpdate(dt: number): void {
        this.OnLateUpdate(dt);
    }

    protected onEnable(): void {
        this.OnEnable();
    }

    protected onDisable(): void {
        this.OnDisable();
    }

    protected onDestroy(): void {
        this.OnDestroy();
    }

    // region 重新定义声明周期方法

    protected OnLoad(): void {}

    protected OnStart(): void {}

    protected OnUpdate(dt: number): void {}

    protected OnLateUpdate(dt: number): void {}

    protected OnEnable(): void {}

    protected OnDisable(): void {}

    protected OnDestroy(): void {}
}
