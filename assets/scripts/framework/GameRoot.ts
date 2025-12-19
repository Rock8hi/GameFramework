import { _decorator } from 'cc';
import { BaseComponent } from './base/BaseComponent';
import { AudioManager } from './audio/AudioManager';
import { CacheManager } from './cache/CacheManager';
import { EventManager } from './event/EventManager';
import { LocalizationManager } from './localization/LocalizationManager';
import { ControllerManager } from './mvcs/controller/ControllerManager';
import { ModelManager } from './mvcs/model/ModelManager';
import { ServiceManager } from './mvcs/service/ServiceManager';
import { ViewManager } from './mvcs/view/ViewManager';
import { ResourceManager } from './resource/ResourceManager';
import { StorageManager } from './storage/StorageManager';
import { WebManager } from './web/WebManager';
import { PoolManager } from './pool/PoolManager';
import { Entry } from './Entry';

const { ccclass, property } = _decorator;

@ccclass('GameRoot')
export class GameRoot extends BaseComponent {
    @property(ModelManager)
    private mModelMgr: ModelManager = null!;

    @property(ViewManager)
    private mViewMgr: ViewManager = null!;

    @property(ControllerManager)
    private mCtrlMgr: ControllerManager = null!;

    @property(ServiceManager)
    private mServMgr: ServiceManager = null!;

    @property(PoolManager)
    private mPoolMgr: PoolManager = null!;

    @property(StorageManager)
    private mStorageMgr: StorageManager = null!;

    @property(ResourceManager)
    private mResMgr: ResourceManager = null!;

    @property(EventManager)
    private mEventMgr: EventManager = null!;

    @property(AudioManager)
    private mAudioMgr: AudioManager = null!;

    @property(LocalizationManager)
    private mLocalMgr: LocalizationManager = null!;

    @property(CacheManager)
    private mCacheMgr: CacheManager = null!;

    @property(WebManager)
    private mWebMgr: WebManager = null!;

    protected OnLoad(): void {
        super.OnLoad();
        Entry.Model = this.mModelMgr;
        Entry.View = this.mViewMgr;
        Entry.Ctrl = this.mCtrlMgr;
        Entry.Serv = this.mServMgr;
        Entry.Pool = this.mPoolMgr;
        Entry.Storage = this.mStorageMgr;
        Entry.Res = this.mResMgr;
        Entry.Event = this.mEventMgr;
        Entry.Audio = this.mAudioMgr;
        Entry.Local = this.mLocalMgr;
        Entry.Cache = this.mCacheMgr;
        Entry.Web = this.mWebMgr;
    }
}
