import { _decorator } from 'cc';
import { BaseComponent } from './base/BaseComponent';
import { AudioManager } from './audio/AudioManager';
import { CacheManager } from './cache/CacheManager';
import { EventManager } from './event/EventManager';
import { ControllerManager } from './mvcs/controller/ControllerManager';
import { ModelManager } from './mvcs/model/ModelManager';
import { ServiceManager } from './mvcs/service/ServiceManager';
import { ViewManager } from './mvcs/view/ViewManager';
import { ResourceManager } from './resource/ResourceManager';
import { StorageManager } from './storage/StorageManager';
import { WebManager } from './web/WebManager';
import { PoolManager } from './pool/PoolManager';
import { BaseEntry } from './BaseEntry';

const { ccclass, property } = _decorator;

@ccclass
export class BaseContext extends BaseComponent {
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
    private mStorageMgr: StorageManager = null;

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

    protected OnLoad(): void {
        super.OnLoad();
        BaseEntry.Model = this.mModelMgr;
        BaseEntry.View = this.mViewMgr;
        BaseEntry.Ctrl = this.mCtrlMgr;
        BaseEntry.Serv = this.mServMgr;
        BaseEntry.Pool = this.mPoolMgr;
        BaseEntry.Storage = this.mStorageMgr;
        BaseEntry.Res = this.mResMgr;
        BaseEntry.Event = this.mEventMgr;
        BaseEntry.Audio = this.mAudioMgr;
        BaseEntry.Cache = this.mCacheMgr;
        BaseEntry.Web = this.mWebMgr;
    }
}
