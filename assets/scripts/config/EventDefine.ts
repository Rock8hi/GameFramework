/** 事件声明 */
export enum EventName {
    /** 界面打开 */
    VIEW_OPENED = 101,
    /** 界面关闭 */
    VIEW_CLOSED,

    /** 自定义事件 */
    // TODO
}

/** 声明事件在派发和回调处的参数数量和类型 */
export interface EventDict {
    [EventName.VIEW_OPENED]: (name?: string) => void;
    [EventName.VIEW_CLOSED]: (name?: string) => void;

    // TODO
}
