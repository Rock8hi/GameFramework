/** 字符串辅助接口 */
export class StringUtils {
    /** 解析道具配置列表 格式为"1,2,3;4,5,6" */
    public static ParseProps(str: string): number[][] {
        const ret = [];
        if (!str) {
            return ret;
        }
        str = str.trim();
        if (!str) {
            return ret;
        }
        str.split(';').forEach(val => {
            if (!val.trim()) {
                return;
            }
            ret.push(this.ParseProp(val));
        });
        return ret;
    }

    /** 解析单个道具配置 格式为"1,2,3" */
    public static ParseProp(str: string): number[] {
        const ret = [];
        if (!str) {
            return ret;
        }
        str = str.trim();
        if (!str) {
            return ret;
        }
        let tmp: any;
        str.split(',').forEach(val => {
            tmp = val.trim();
            if (!tmp) {
                return;
            }
            tmp = parseFloat(tmp);
            if (isNaN(tmp)) {
                return;
            }
            ret.push(tmp);
        });
        return ret;
    }
}
