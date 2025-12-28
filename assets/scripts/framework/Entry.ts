import { AudioManager } from './audio/AudioManager';
import { CacheManager } from './cache/CacheManager';
import { EventManager } from './event/EventManager';
import { ControllerManager } from './mvcs/controller/ControllerManager';
import { ModelManager } from './mvcs/model/ModelManager';
import { ViewManager } from './mvcs/view/ViewManager';
import { ResourceManager } from './resource/ResourceManager';
import { StorageManager } from './storage/StorageManager';
import { WebManager } from './web/WebManager';
import { ServiceManager } from './mvcs/service/ServiceManager';
import { PoolManager } from './pool/PoolManager';
import { I18nManager } from './i18n/I18nManager';

export class Entry {
    public static Model: ModelManager = null;

    public static View: ViewManager = null;

    public static Ctrl: ControllerManager = null;

    public static Serv: ServiceManager = null;

    public static Pool: PoolManager = null;

    /** 本地存储 */
    public static Store: StorageManager = null;

    /** 资源管理 */
    public static Res: ResourceManager = null;

    /** 事件管理 */
    public static Event: EventManager = null;

    /** 音频管理 */
    public static Audio: AudioManager = null;

    /** 数据缓存 */
    public static Cache: CacheManager = null;

    /** http交互 */
    public static Web: WebManager = null;

    /** 多语言 */
    public static I18n: I18nManager = null;
}
