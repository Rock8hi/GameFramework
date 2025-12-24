import { _decorator, Node, AudioSource, AudioClip, sys, math, game, Game } from 'cc';
import { BaseManager } from '@framework/base/BaseManager';
import { BaseEntry } from '@framework/BaseEntry';

const { ccclass, property } = _decorator;

/**
 * 音频管理类
 */
@ccclass('AudioManager')
export class AudioManager extends BaseManager {
    @property({ type: AudioSource, displayName: '背景音频' })
    private mMusicSource: AudioSource = null;

    @property({ type: AudioSource, displayName: '音效音频' })
    private mSoundSource: AudioSource = null;

    private mMusicVolume: number = 1;
    private mMusicVolumeChanged: boolean = false;
    private mSoundVolume: number = 1;
    private mSoundVolumeChanged: boolean = false;

    private mMusicMute: boolean = false;
    private mMusicMuteChanged: boolean = false;
    private mSoundMute: boolean = false;
    private mSoundMuteChanged: boolean = false;

    protected OnLoad(): void {
        super.OnLoad();
        // 初始化音量大小
        const regex = /^([1-9]|[1-9]\d|100)$/;
        const mv = sys.localStorage.getItem('MusicVolume') as string;
        this.mMusicVolume = !!mv && regex.test(mv) ? parseInt(mv) / 100 : 1;
        const sv = sys.localStorage.getItem('SoundVolume') as string;
        this.mSoundVolume = !!sv && regex.test(sv) ? parseInt(sv) / 100 : 1;
        // 初始化是否静音
        const mm = sys.localStorage.getItem('MusicMute') as string;
        this.mMusicMute = !!mm && /^0|1$/.test(mm) ? !!parseInt(mm) : false;
        const sm = sys.localStorage.getItem('SoundMute') as string;
        this.mSoundMute = !!sm && /^0|1$/.test(sm) ? !!parseInt(sm) : false;

        this.InitListeners();
    }

    protected OnDestroy(): void {
        this.FreeListeners();
        super.OnDestroy();
    }

    private mTimeStep: number = 1;
    protected OnUpdate(dt: number): void {
        super.OnUpdate(dt);

        this.mTimeStep -= dt;
        if (this.mTimeStep > 0) {
            return;
        }
        this.mTimeStep = 1;

        if (this.mMusicVolumeChanged) {
            sys.localStorage.setItem('MusicVolume', Math.ceil(this.mMusicVolume * 100));
            this.mMusicVolumeChanged = false;
        }
        if (this.mMusicMuteChanged) {
            sys.localStorage.setItem('MusicMute', this.mMusicMute ? 1 : 0);
            this.mMusicMuteChanged = false;
        }
        if (this.mSoundVolumeChanged) {
            sys.localStorage.setItem('SoundVolume', Math.ceil(this.mSoundVolume * 100));
            this.mSoundVolumeChanged = false;
        }
        if (this.mSoundMuteChanged) {
            sys.localStorage.setItem('SoundMute', this.mSoundMute ? 1 : 0);
            this.mSoundMuteChanged = false;
        }
    }

    /** 预加载音频 */
    public Preload(list: string[]) {
        if (!list) {
            return;
        }
        list.forEach(path => {
            const urls = path.split(':');
            BaseEntry.Res.LoadAsset(
                this.node.name,
                urls.length == 2 ? urls[0] : 'resources',
                urls.length == 2 ? urls[1] : urls[0],
                AudioClip,
                (err: Error | null) => !!err && console.warn(err)
            );
        });
    }

    /** 播放背景音乐 */
    public PlayMusic(path: string, loop?: boolean) {
        if (!path) {
            return;
        }
        const urls = path.split(':');
        if (urls.length == 0 || urls.length > 2) {
            console.warn(`path error, path: ${path}`);
            return;
        }
        BaseEntry.Res.LoadAsset(
            this.node.name,
            urls.length == 2 ? urls[0] : 'resources',
            urls.length == 2 ? urls[1] : urls[0],
            AudioClip,
            (err: Error | null, data: AudioClip) => {
                if (!!err) {
                    console.warn(err);
                    return;
                }
                this.mMusicSource.stop();
                this.mMusicSource.clip = data;
                this.mMusicSource.loop = typeof loop == 'boolean' ? loop : true;
                this.mMusicSource.volume = this.mMusicMute ? 0 : this.mMusicVolume;
                this.mMusicSource.play();
            }
        );
    }

    /** 停止背景音乐 */
    public StopMusic() {
        if (!this.mMusicSource.clip) {
            return;
        }
        this.mMusicSource.stop();
        this.mMusicSource.clip = null;
    }

    /** 暂停背景音乐 */
    public PauseMusic() {
        if (!this.mMusicSource.clip || !this.mMusicSource.playing) {
            return;
        }
        this.mMusicSource.pause();
    }

    /** 恢复背景音乐 */
    public ResumeMusic() {
        if (!this.mMusicSource.clip || this.mMusicSource.playing) {
            return;
        }
        this.mMusicSource.play();
    }

    /** 播放音效 scale: 在volume基础上再次缩放音量 */
    public async PlaySound(path: string, scale?: number) {
        if (this.mSoundMute) {
            return;
        }
        const urls = path?.split(':') || [];
        if (urls.length == 0 || urls.length > 2) {
            console.warn(`path error, path: ${path}`);
            return;
        }
        BaseEntry.Res.LoadAsset(
            this.node.name,
            urls.length == 2 ? urls[0] : 'resources',
            urls.length == 2 ? urls[1] : urls[0],
            AudioClip,
            (err: Error | null, data: AudioClip) => {
                if (!!err) {
                    console.warn(err);
                    return;
                }
                this.mSoundSource.volume = this.mSoundVolume;
                // playOneShot允许同时多次调用，因此较适合短时的音效播放
                // 且使用playOneShot时playing,stat,duration,currentTime等失效
                this.mSoundSource.playOneShot(data, scale);
            }
        );
    }

    /** 背景音声音大小 */
    public get MusicVolume() {
        return this.mMusicVolume;
    }

    /** 背景音声音大小 */
    public set MusicVolume(val: number) {
        this.mMusicVolume = math.clamp01(val);
        this.mMusicVolumeChanged = true;
        !this.mMusicMute && (this.mMusicSource.volume = this.mMusicVolume);
    }

    /** 背景音开关 */
    public get MusicMute() {
        return this.mMusicMute;
    }

    /** 背景音开关 */
    public set MusicMute(val: boolean) {
        this.mMusicMute = val;
        this.mMusicMuteChanged = true;
        this.mMusicSource.volume = this.mMusicMute ? 0 : this.mMusicVolume;
    }

    /** 音效声音大小 */
    public get SoundVolume() {
        return this.mSoundVolume;
    }

    /** 音效声音大小 */
    public set SoundVolume(val: number) {
        this.mSoundVolume = math.clamp01(val);
        this.mSoundVolumeChanged = true;
        !this.mSoundMute && (this.mSoundSource.volume = this.mSoundVolume);
    }

    /** 音效开关 */
    public get SoundMute() {
        return this.mSoundMute;
    }

    /** 音效开关 */
    public set SoundMute(val: boolean) {
        this.mSoundMute = val;
        this.mSoundMuteChanged = true;
        this.mSoundSource.volume = this.mSoundMute ? 0 : this.mSoundVolume;
    }

    /** 恢复播放所有音频 */
    public ResumeAll() {
        this.ResumeMusic();
    }

    /** 暂停播放所有音频 */
    public PauseAll() {
        this.PauseMusic();
        // 一般情况，不需要停止短时的音效
        // 这里调用stop停止音效是无效的，如有需求可以尝试移除AudioSource，再创建新的AudioSource
        // this.mSoundSource.stop();
    }

    /** 停止播放所有音频 */
    public StopAll() {
        this.StopMusic();
        // this.mSoundSource.stop();
    }

    private InitListeners(): void {
        game.on(Game.EVENT_SHOW, this.ResumeAll, this);
        game.on(Game.EVENT_HIDE, this.PauseAll, this);
    }

    private FreeListeners(): void {
        game.off(Game.EVENT_SHOW, this.ResumeAll, this);
        game.off(Game.EVENT_HIDE, this.PauseAll, this);
    }
}
