import { Node, UITransform } from 'cc';

// 声明扩展方法
declare module 'cc' {
    interface Node {
        /** 获取一个节点的矩形区域的上下左右的坐标 */
        getEdge(): {
            left: number;
            right: number;
            top: number;
            bottom: number;
        };
        zIndex: number;
    }
}

// @ts-ignore
if (!Node.prototype.__extended) {
    // 添加扩展方法
    Object.defineProperties(Node.prototype, {
        getEdge: {
            value: function () {
                const scale = this.scale;
                const trans = this.getComponent(UITransform);
                const contentSize = trans.contentSize;
                const anchorPoint = trans.anchorPoint;
                const pos = this.position;
                const w = contentSize.width * scale.x;
                const h = contentSize.height * scale.y;
                return {
                    left: pos.x - w * anchorPoint.x,
                    right: pos.x + w * (1 - anchorPoint.x),
                    top: pos.y + h * (1 - anchorPoint.y),
                    bottom: pos.y - h * anchorPoint.y,
                };
            },
        },
        zIndex: {
            get: function () {
                return this.getSiblingIndex();
            },
            set: function (val: number) {
                this.setSiblingIndex(val);
            },
        },
        __extended: {
            value: true,
        },
    });
}
