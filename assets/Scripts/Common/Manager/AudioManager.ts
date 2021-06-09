import AudioComp from "../Commponent/AudioComponent";

/**
 ** 创建人: zhibin
 ** 日  期: 2019.11.19
 ** 版  本: 1.0
 ** 描  述: 单例
        音乐管理类（重点：配合AudioComponent组件）
            添加AudioComponent组件到"Canvas/AudioManager"节点
        使用方法分为两种 
            1. 动态加载
            2. 拖动使用
        音乐文件目录：
            "resources/audio/";
 ** 应  用: 
        AudioManager.playMusic(name)   播放背景音乐
        AudioManager.playEffect(name)  播放音效
 */

class CAudioManager{
    private static instance:CAudioManager = null;
    public static getInstance(){
        if (!this.instance) {
            this.instance = new CAudioManager();
        }
        return this.instance;
    }
    public sfxVolume: number = 0;
    public bgmVolume: number = 0;
    public bgmAudioID: number = 0;

    public componet:AudioComp = null;

    //每个场景必须要有AudioManager，而且在根节点下面
    private getComponent(){
        if (!cc.isValid(this.componet)) {
            let audio = cc.find("Canvas/AudioManager");
            this.componet = audio.getComponent(AudioComp);
        }
        return this.componet;
    }

    
    /**
     * 播放音乐
     * @param name 动态加载：音效目录下的名字 ， 拖拽：AudioComponent 的属性名
     */
    playMusic(name: string) {
        var audioManager = this.getComponent();
        if (audioManager) {
            audioManager.playMusic(name);
        }
    }

    /**
     * 播放音效
     * @param name 动态加载：音效目录下的名字 ， 拖拽：AudioComponent 的属性名
     */
    playEffect  (name: string) {
        var audioManager = this.getComponent();
        if (audioManager) {
            audioManager.playEffect(name);
        }
    }


    /**
     * 
     * @param vol 音量
     * @param isSaveLocal 是否存储本地
     */
    setMusicVolume  (vol:number, isSaveLocal: boolean = true) {
        var audioManager = this.getComponent();
        if (audioManager) {
            audioManager.setMusicVolume(vol, isSaveLocal);
        }
    }

    /**
     * 
     * @param vol 音量
     * @param isSaveLocal 是否存储本地
     */
    setEffectVolume  (vol:number, isSaveLocal: boolean = true) {
        var audioManager = this.getComponent();
        if (audioManager) {
            audioManager.setSFXVolume(vol, isSaveLocal);
        }
    }

    getMusicVolume  () {
        var audioManager = this.getComponent();
        if (audioManager) {
            return audioManager.bgmVolume;
        }

        return 1.0;
    }

    getEffectVolume  () {
        var audioManager = this.getComponent();
        if (audioManager) {
            return audioManager.sfxVolume;
        }

        return 1.0;
    }

    pauseAllAudio  () {
        cc.audioEngine.pauseAll();
    }

    resumeAllAudio  () {
        cc.audioEngine.resumeAll();
    }

    stopMusic  () {
        var audioManager = this.getComponent();
        if (audioManager !== undefined) {
            audioManager.stopMusic();
        }
    }
}

let AudioManager = CAudioManager.getInstance();
export default AudioManager;
