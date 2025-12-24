import { _decorator, Component } from 'cc';
import { view, Vec3 } from 'cc';

const { ccclass, property } = _decorator;

const DesignWidth: number = 1366;
const DesignHeight: number = 768;

/**
 * 等比缩放节点，使精灵的宽高与屏幕的尺寸匹配。常用于缩放界面的背景层。
 * 目标是在保证精灵不变形的情况下，使宽或高的其中一个方向撑满屏幕，另一个方向刚好撑满或出屏。
 */
@ccclass('ViewAdapter')
export class ViewAdapter extends Component {
    protected start(): void {
        this.Init();
    }

    private Init() {
        const visibleSize = view.getVisibleSize();
        const wRatio = visibleSize.width / DesignWidth;
        const hRatio = visibleSize.height / DesignHeight;
        // 等比缩放，宽或高都不留黑边，宽或高的某一方向会被部分裁剪
        const ratio = Math.max(wRatio, hRatio);
        this.node.scale = new Vec3(ratio, ratio, 1);
    }
}
