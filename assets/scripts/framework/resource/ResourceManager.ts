import { __private, _decorator, Asset, AssetManager, assetManager, js } from 'cc';
import { BaseManager } from '@framework/base/BaseManager';
import { BaseComponent } from '@framework/base/BaseComponent';

const { ccclass } = _decorator;

function normalize(url: string): string {
    if (url) {
        if (url.charCodeAt(0) === 46 && url.charCodeAt(1) === 47) {
            // strip './'
            url = url.slice(2);
        } else if (url.charCodeAt(0) === 47) {
            // strip '/'
            url = url.slice(1);
        }
    }
    return url;
}

declare module 'cc' {
    interface Asset {
        // decRef(autoRelease?: boolean): Asset;
        // addRef(): Asset;

        cached: boolean;
    }
}

// 重写addRef和decRef，以禁止业务层增减引用计数
// @ts-ignore
/*if (!Asset.prototype.__extended && !EDITOR_NOT_IN_PREVIEW) {
    const _addRef = Asset.prototype.addRef;
    const _decRef = Asset.prototype.decRef;
    Object.defineProperties(Asset.prototype, {
        addRef: {
            value: function () {
                if (this.cached) {
                    console.warn('禁止使用Asset.addRef, ResourceManager负责管理资源的引用');
                } else {
                    _addRef.call(this);
                }
                return this;
            },
        },
        decRef: {
            value: function (autoRelease?: boolean) {
                if (this.cached) {
                    console.warn('禁止使用Asset.decRef, ResourceManager负责管理资源的引用');
                } else {
                    _decRef.call(this, autoRelease);
                }
                return this;
            },
        },
        cached: {
            get: function () {
                return !!this._cached;
            },
            set: function (val) {
                if (val) {
                    !this._cached && (this._cached = 1);
                } else {
                    !!this._cached && delete this._cached;
                }
            },
        },
        __extended: {
            value: true,
        },
    });
}*/

/**
 * 资源管理
 */
@ccclass('ResourceManager')
export class ResourceManager extends BaseManager {
    private mAssetCache: Map<string, Map<string, Asset>> = new Map();

    /**
     * 预加载Bundle内的多个资源，但不展开数据，仅把资源原数据从磁盘(或远端)拷贝到内存中
     * 适用于后台静默加载批量资源数据到内存中
     * @param name Bundle名称
     * @param paths 资源路径数组
     * @param onComplete
     */
    public PreloadBuffer(name: string, paths: string[], onComplete: (err: Error | null) => void) {
        this.LoadBundle(name, (err: Error, bundle: AssetManager.Bundle) => {
            if (err) {
                console.warn(err);
                onComplete && onComplete(err);
                return;
            }
            bundle.preload(paths, (err: Error | null) => {
                if (err) {
                    console.warn(err);
                    onComplete && onComplete(err);
                    return;
                }
                onComplete && onComplete(null);
            });
        });
    }

    /**
     * 预加载Bundle内的多个资源，一般适用于进度条方式加载资源
     * @param group 资源分组，可以是字符串名称，或BaseView的实例
     * @param name Bundle名称
     * @param paths 资源路径数组
     * @param onProgress 进度回调
     * @param onComplete 完成回调
     */
    public PreloadAssets(
        group: string | BaseComponent,
        name: string,
        paths: string[],
        onProgress: (finished: number, total: number) => void,
        onComplete: (err: Error | null) => void
    ): void;

    /**
     * 预加载Bundle内的多个资源
     * @param group 资源分组，可以是字符串名称，或BaseView的实例
     * @param name Bundle名称
     * @param paths 资源路径数组
     * @param onComplete 完成回调
     */
    public PreloadAssets(
        group: string | BaseComponent,
        name: string,
        paths: string[],
        onComplete: (err: Error | null) => void
    ): void;

    /**
     * 预加载Bundle内的多个资源
     * @param group 资源分组，可以是字符串名称，或BaseView的实例
     * @param name Bundle名称
     * @param paths 资源路径数组
     */
    public PreloadAssets(group: string | BaseComponent, name: string, paths: string[]): void;

    /** 预加载Bundle内的多个资源 */
    public PreloadAssets(
        group: string | BaseComponent,
        name: string,
        paths: string[],
        onProgress?: ((finished: number, total: number) => void) | ((err: Error | null) => void),
        onComplete?: (err: Error | null) => void
    ): void {
        if (!!onProgress && !onComplete) {
            onComplete = onProgress as (err: Error | null) => void;
            onProgress = null;
        }
        this.LoadBundle(name, (err: Error, bundle: AssetManager.Bundle) => {
            if (err) {
                console.warn(err);
                onComplete && onComplete(err);
                return;
            }
            bundle.load(
                paths,
                (finished: number, total: number) => {
                    onProgress && (onProgress as (finished: number, total: number) => void)(finished, total);
                },
                (err: Error | null, assets: Asset[]) => {
                    if (err) {
                        console.warn(err);
                        onComplete && onComplete(err);
                        return;
                    }
                    const _group = typeof group === 'string' ? group : js.getClassName(group);
                    if (!_group) {
                        console.warn('group is null');
                        onComplete && onComplete(new Error('group is null'));
                        return;
                    }
                    if (!this.mAssetCache.has(_group)) {
                        this.mAssetCache.set(_group, new Map());
                    }
                    const map = this.mAssetCache.get(_group);
                    assets.forEach((val, idx) => {
                        const _path = normalize(paths[idx]);
                        const key = `${name}:${_path}:${js.getClassName(val)}`;
                        if (!map.has(key)) {
                            map.set(key, val);
                            val.addRef();
                            val.cached = true;
                        }
                    });
                    onComplete && onComplete(null);
                }
            );
        });
    }

    /**
     * 加载Bundle内的一个资源
     * @param group 资源分组，可以是字符串名称，或BaseView的实例
     * @param name Bundle名称
     * @param path 资源路径
     * @param type 资源类型
     * @param onComplete 完成回调
     */
    public LoadAsset<T extends Asset>(
        group: string | BaseComponent,
        name: string,
        path: string,
        type: __private.__types_globals__Constructor<T>,
        onComplete?: (err: Error | null, data: T) => void
    ): void {
        const _group = typeof group === 'string' ? group : js.getClassName(group);
        if (!_group) {
            console.warn('group is null');
            onComplete && onComplete(new Error('group is null'), null);
            return;
        }
        const _path = normalize(path);
        const key = `${name}:${_path}:${js.getClassName(type)}`;
        if (this.mAssetCache.has(_group)) {
            const map = this.mAssetCache.get(_group);
            if (map.has(key)) {
                onComplete && onComplete(null, map.get(key) as T);
                return;
            }
        }
        this.LoadBundle(name, (err: Error, bundle: AssetManager.Bundle) => {
            if (err) {
                console.warn(err);
                onComplete && onComplete(err, null);
                return;
            }
            bundle.load(_path, type, (err: Error | null, asset: T) => {
                if (err) {
                    console.warn(err);
                    onComplete && onComplete(err, null);
                    return;
                }
                if (!this.mAssetCache.has(_group)) {
                    this.mAssetCache.set(_group, new Map());
                }
                const map = this.mAssetCache.get(_group);
                if (!map.has(key)) {
                    map.set(key, asset);
                    asset.addRef();
                    asset.cached = true;
                }
                onComplete && onComplete(null, asset);
            });
        });
    }

    /**
     * 加载Bundle内的多个相同类型的资源
     * @param group 资源分组，可以是字符串名称，或BaseView的实例
     * @param name Bundle名称
     * @param paths 资源路径数组
     * @param type 资源类型
     * @param onComplete 完成回调
     */
    public LoadAssets<T extends Asset>(
        group: string | BaseComponent,
        name: string,
        path: string[],
        type: __private.__types_globals__Constructor<T>,
        onComplete?: (err: Error | null, data: T[]) => void
    ): void {
        this.LoadBundle(name, (err: Error, bundle: AssetManager.Bundle) => {
            if (err) {
                console.warn(err);
                onComplete && onComplete(err, null);
                return;
            }
            const paths = path;
            bundle.load(paths, type, (err: Error | null, assets: T[]) => {
                if (err) {
                    console.warn(err);
                    onComplete && onComplete(err, null);
                    return;
                }
                const _group = typeof group === 'string' ? group : js.getClassName(group);
                if (!_group) {
                    console.warn('group is null');
                    onComplete && onComplete(new Error('group is null'), null);
                    return;
                }
                if (!this.mAssetCache.has(_group)) {
                    this.mAssetCache.set(_group, new Map());
                }
                const _type = js.getClassName(type);
                const map = this.mAssetCache.get(_group);
                assets.forEach((val, idx) => {
                    const _path = normalize(paths[idx]);
                    const key = `${name}:${_path}:${_type}`;
                    if (!map.has(key)) {
                        map.set(key, val);
                        val.addRef();
                        val.cached = true;
                    }
                });
                onComplete && onComplete(null, assets);
            });
        });
    }

    /** 释放单个资源 */
    public ReleaseAsset<T extends Asset>(
        group: string | BaseComponent,
        name: string,
        path: string,
        type: __private.__types_globals__Constructor<T>
    ) {
        const _group = typeof group === 'string' ? group : js.getClassName(group);
        if (!_group) {
            console.warn('group is null');
            return;
        }
        if (!this.mAssetCache.has(_group)) {
            return;
        }
        const _path = normalize(path);
        const key = `${name}:${_path}:${js.getClassName(type)}`;
        const map = this.mAssetCache.get(_group);
        if (!map.has(key)) {
            return;
        }
        const asset = map.get(key);
        map.delete(key);
        if (map.size === 0) {
            this.mAssetCache.delete(_group);
        }
        if (!asset.isValid) {
            console.warn(`该资源被异常释放, name: ${name}; path: ${_path}; type: ${js.getClassName(type)};`);
            return;
        }
        /**
         * 这里会有多种情况
         * 情况1. 仅在一个分组下被引用，这里会减到0，并触发释放资源
         * 情况2. 在多个分组下被引用，这里会减一，在另外的分组继续正常使用
         * 情况3. 异常情况，在此脚本之外的业务代码被加一，这里会无法正常触发释放
         * 必须通过技术手段，禁止触发情况3
         */
        asset.cached = false;
        asset.decRef();
        const bundle = assetManager.getBundle(name);
        if (bundle) {
            bundle.release(_path, type);
        }
    }

    /** 根据分组释放资源 */
    public ReleaseGroup(group: string | BaseComponent) {
        const _group = typeof group === 'string' ? group : js.getClassName(group);
        if (!_group) {
            console.warn('group is null');
            return;
        }
        if (!this.mAssetCache.has(_group)) {
            return;
        }
        const map = this.mAssetCache.get(_group);
        map.forEach((val, key) => {
            const arr = key.split(':');
            const _name = arr[0];
            const _path = arr[1];
            if (!val.isValid) {
                console.warn(`该资源被异常释放, name: ${_name}; path: ${_path}; type: ${arr[2]};`);
                return;
            }
            val.cached = false;
            val.decRef();
            const bundle = assetManager.getBundle(_name);
            if (bundle) {
                const _type = js.getClassByName(arr[2]) as __private.__types_globals__Constructor<Asset>;
                bundle.release(_path, _type);
            }
        });
        map.clear();
        this.mAssetCache.delete(_group);
    }

    /** 释放此包中的所有资源，并移除此包 */
    public ClearBundle(name: string): void {
        this.ReleaseBundle(name);
        this.RemoveBundle(name);
    }

    /** 移除此包 */
    public RemoveBundle(name: string): void {
        const bundle = assetManager.getBundle(name);
        if (bundle) {
            assetManager.removeBundle(bundle);
        }
    }

    /** 释放此包中的所有资源 */
    public ReleaseBundle(name: string): void {
        const groupsToDelete: string[] = [];
        this.mAssetCache.forEach((map, group) => {
            const keysToDelete: string[] = [];
            map.forEach((asset, key) => {
                const arr = key.split(':');
                const _name = arr[0];
                if (name === _name) {
                    keysToDelete.push(key);
                }
            });
            keysToDelete.forEach(key => map.delete(key));
            if (map.size === 0) {
                groupsToDelete.push(group);
            }
        });
        groupsToDelete.forEach(key => this.mAssetCache.delete(key));

        const bundle = assetManager.getBundle(name);
        if (bundle) {
            bundle.releaseAll();
        }
    }

    /** 获取或加载一个Bundle */
    public LoadBundle(name: string, onComplete?: (err: Error, data: AssetManager.Bundle) => void): void {
        if (!name) {
            onComplete(new Error('name is null'), null);
            return;
        }
        const bundle = assetManager.getBundle(name);
        if (bundle) {
            onComplete(null, bundle);
            return;
        }
        assetManager.loadBundle(name, onComplete);
    }

    public Dump() {
        console.debug('================1================');
        this.mAssetCache.forEach((val, key) => {
            console.debug(`group: ${key}`);
            val.forEach((v, k) => console.debug(k, v));
        });
        console.debug('================2================');
        assetManager.assets.forEach((val, key) => console.debug(key, val));
        console.debug('================3================');
        console.debug(`当前资源总数:${assetManager.assets.count}`);
        console.debug('================4================');
    }
}
