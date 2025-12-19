/**
 * bundle名称
 */
export enum BundleName {
    /** 系统默认 */
    DEFAULT = 'resources',
    COMMON = 'common',
    /** 合成(或消除)游戏部分 */
    GAME1 = 'game1',
}

/** 游戏配置 */
export class Config {
    /** 开发模式 */
    public static readonly IsDevelop: boolean = true;
    /** 发布模式 */
    public static readonly IsRelease: boolean = false;
    /** 服务器地址 */
    public static readonly IPAddress: string = 'https://www.baidu.com:443/';
}
