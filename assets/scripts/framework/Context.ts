import { _decorator } from 'cc';
import { BaseComponent } from './base/BaseComponent';
import { AudioManager } from './audio/AudioManager';
import { CacheManager } from './cache/CacheManager';
import { EventManager } from './event/EventManager';
import { ControllerManager } from './mvcs/controller/ControllerManager';
import { ServiceManager } from './mvcs/service/ServiceManager';
import { ModelManager } from './mvcs/model/ModelManager';
import { ViewManager } from './mvcs/view/ViewManager';
import { ResourceManager } from './resource/ResourceManager';
import { StorageManager } from './storage/StorageManager';
import { WebManager } from './web/WebManager';
import { SocketManager } from './socket/SocketManager';
import { PoolManager } from './pool/PoolManager';
import { I18nManager } from './i18n/I18nManager';
import { Entry } from './Entry';

const { ccclass, property } = _decorator;

@ccclass
export class Context extends BaseComponent {
    @property(ModelManager)
    private mModelMgr: ModelManager = null;

    @property(ViewManager)
    private mViewMgr: ViewManager = null;

    @property(ControllerManager)
    private mCtrlMgr: ControllerManager = null;

    @property(ServiceManager)
    private mServMgr: ServiceManager = null;

    @property(PoolManager)
    private mPoolMgr: PoolManager = null;

    @property(StorageManager)
    private mStoreMgr: StorageManager = null;

    @property(ResourceManager)
    private mResMgr: ResourceManager = null;

    @property(EventManager)
    private mEventMgr: EventManager = null;

    @property(AudioManager)
    private mAudioMgr: AudioManager = null;

    @property(CacheManager)
    private mCacheMgr: CacheManager = null;

    @property(WebManager)
    private mWebMgr: WebManager = null;

    @property(SocketManager)
    private mSockMgr: SocketManager = null;

    @property(I18nManager)
    private mI18nMgr: I18nManager = null;

    protected OnLoad(): void {
        super.OnLoad();
        Entry.Model = this.mModelMgr;
        Entry.View = this.mViewMgr;
        Entry.Ctrl = this.mCtrlMgr;
        Entry.Serv = this.mServMgr;
        Entry.Pool = this.mPoolMgr;
        Entry.Store = this.mStoreMgr;
        Entry.Res = this.mResMgr;
        Entry.Event = this.mEventMgr;
        Entry.Audio = this.mAudioMgr;
        Entry.Cache = this.mCacheMgr;
        Entry.Web = this.mWebMgr;
        Entry.Sock = this.mSockMgr;
        Entry.I18n = this.mI18nMgr;
    }
}
