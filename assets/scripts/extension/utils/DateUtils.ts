export class DateUtils {
    /** 前补零 */
    public static PadZero(num: number, len: number) {
        return Array(len + 1 - num.toString().length).join('0') + num;
    }

    /**
     * 格式化时间，单位(秒)，示例FormatDate(new Date(), 'yyyy-MM-dd HH:mm:ss')
     * @param date 时间
     * @param format 格式
     * @returns
     */
    public static FormatDate(date: string | number | Date, format?: string) {
        if (!date) return;
        !format && (format = 'yyyy-MM-dd');
        switch (typeof date) {
            case 'string':
                date = new Date(date.replace(/-/, '/'));
                break;
            case 'number':
                date = new Date(date * 1000);
                break;
        }
        if (date instanceof Date) {
            const dict = {
                yyyy: date.getFullYear(),
                // M: date.getMonth() + 1,
                // d: date.getDate(),
                // H: date.getHours(),
                // m: date.getMinutes(),
                // s: date.getSeconds(),
                MM: ('' + (date.getMonth() + 101)).substring(1),
                dd: ('' + (date.getDate() + 100)).substring(1),
                HH: ('' + (date.getHours() + 100)).substring(1),
                mm: ('' + (date.getMinutes() + 100)).substring(1),
                ss: ('' + (date.getSeconds() + 100)).substring(1),
            };
            // return strFormat.replace(/(yyyy|MM?|dd?|HH?|mm?|ss?)/g, function () {
            //     return dict[arguments[0]];
            // });
            return format.replace(/(yyyy|MM?|dd?|HH?|mm?|ss?)/g, match => dict[match]);
        }
    }
}
