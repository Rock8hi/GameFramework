import { js } from 'cc';

export class ClassUtils {
    /**
     * 检测两个类是不是派生关系
     */
    private static IsChildClassOf(subclass: any, superclass: any) {
        return Object.getPrototypeOf(subclass) === superclass;
        // return js.isChildClassOf(subclass, superclass) && subclass.prototype != superclass.prototype;
    }

    /**
     * 获取派生类列表
     */
    public static GetDerivedClasses(clazz: any) {
        const rec = js?._nameToClass;
        const ret = [];
        if (!rec) {
            return ret;
        }
        for (const key in rec) {
            if (
                key.startsWith('cc.') ||
                key.startsWith('sp.') ||
                key.startsWith('dragonBones.') ||
                key.startsWith('internal.')
            ) {
                continue;
            }
            const val = rec[key];
            if (this.IsChildClassOf(val, clazz)) {
                ret.push(val);
            }
        }
        return ret;
    }
}
