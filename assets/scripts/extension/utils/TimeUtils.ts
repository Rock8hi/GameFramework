export class TimeUtils {
    /** 获取当前时间戳 单位:秒 */
    public static GetNow(): number {
        return Math.floor(new Date().getTime() * 0.001);
    }
}
