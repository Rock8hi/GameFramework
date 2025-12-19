import { _decorator } from 'cc';

const { ccclass } = _decorator;

/** 对象基类 */
@ccclass('BaseObject')
export abstract class BaseObject {
    protected get Priority(): number {
        return 0;
    }

    protected OnInit() {}

    protected OnStep(dt: number) {}

    protected OnFree() {}
}
