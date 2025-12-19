import { Node } from 'cc';

export enum ViewStat {
    /** 正在加载资源 */
    load = 1,
    /** 正在显示中 */
    show,
    /** 进场动画 */
    fadein,
    /** 出场动画 */
    fadeout,
    /** 已销毁 */
    destroyed,
}

export interface ViewInfo {
    // vid: number; // 界面id
    name: string; // 预制体id
    stat: ViewStat;
    node: Node;
    life?: number;
}

export enum ViewType {
    /** 主场景，同一时间只能显示一个 */
    scene = 1,
    /** 全屏界面 */
    layer = 2,
    /** 游戏内弹框界面 */
    popup = 3,
    /** Toast */
    toast = 4,
    /** 引导界面 */
    guide = 5,
}

export interface IRecycleHandler {
    OnReuse(...args: any): void;
    OnUnuse(): void;
}
