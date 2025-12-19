import { Sprite, UITransform, Size, Vec3 } from 'cc';

/** 与界面相关的辅助接口 */
export class ViewUtils {
    /** 将精灵缩放到限定的尺寸内 fixContentSize: 修改contentSize，而非scale */
    public static ScaleSprite(sp: Sprite, w: number, h: number, fixContentSize?: boolean) {
        const size = sp.spriteFrame.originalSize;
        const k = Math.min(w / size.width, h / size.height);
        if (fixContentSize) {
            sp.getComponent(UITransform).contentSize = new Size(size.width * k, size.height * k);
        } else {
            sp.sizeMode = Sprite.SizeMode.TRIMMED;
            sp.trim = true;
            sp.node.scale = new Vec3(k, k, 1);
        }
    }
}
