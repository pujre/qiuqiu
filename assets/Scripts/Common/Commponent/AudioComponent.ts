const {ccclass, property , menu} = cc._decorator;

/**
 ** 创建人: zhibin
 ** 日  期: 2019.11.19
 ** 版  本: 1.0
 ** 描  述:
    添加组件到"Canvas/AudioManager"节点
    配合AudioManager使用

    声明需要定义的属性名
*/

@ccclass
@menu("自定义/Audio组件")
export default class AudioComp extends cc.Component {

    // 例子：拖拽音乐文件到此   name属性名
    // 使用： AudioManager.playerMusic("name");
    // 使用： AudioManager.playerEffect("name");
    @property({
        type: cc.AudioClip,
    })
    private mainClip: cc.AudioClip = null; 

    /******************  end  *****************/


    bgmVolume: number = 1.0;
    sfxVolume: number = 1.0;
    bgmAudioID: number = -1;

    private curBgmAudioID: number = -1;

    onLoad() {
        this.init();
    }

    init() {
        let t = cc.sys.localStorage.getItem("bgmVolume");
        if(t != null&&t != ''&&t != undefined){
            this.bgmVolume = parseFloat(t.toString());
        }
        
        t = cc.sys.localStorage.getItem("sfxVolume");
        if(t != null&&t != ''&&t != undefined){
            this.sfxVolume = parseFloat(t.toString());
        }
    }

    playMusic(name) {
        if (this[name]) {
            if (this.curBgmAudioID >= 0) {
                cc.audioEngine.stop(this.curBgmAudioID);
            }
            this.bgmAudioID = cc.audioEngine.play(this[name], true, this.bgmVolume);
            this.curBgmAudioID = this.bgmAudioID;
        }
    }

    pauseMusic(audioId) {
        cc.audioEngine.pause(audioId);
    }

    resumeMusic(audioId) {
        cc.audioEngine.resume(audioId);
    }

    stopMusic() {
        if (this.curBgmAudioID != null)
            cc.audioEngine.stop(this.curBgmAudioID);
    }

    setMusicVolume(volume, isSaveLocal) {
        if (this.bgmVolume != volume || isSaveLocal === true) {
            this.bgmVolume = volume;
            cc.audioEngine.setVolume(this.bgmAudioID, volume);

            if (isSaveLocal === true) {
                cc.sys.localStorage.setItem("bgmVolume", this.bgmVolume);
            }
        }
    }

    _playSFX(clip) {
        //cc.log("_playSFX start");
        cc.audioEngine.play(clip, false, this.sfxVolume);
    }

    playEffect(name) {
        if (this[name])
            this._playSFX(this[name]);
        else{
            this.playEffectURL(name);
        }
    }

    getUrl(url) {
        // return cc.url.raw("audio/" + url);
        return "audio/" + url;
    }

    playEffectURL(url) {
        var audioUrl = this.getUrl(url);
        if (this.sfxVolume > 0) {
            cc.loader.loadRes( audioUrl , cc.AudioClip , (err, res)=>{
                cc.audioEngine.play(res, false, this.sfxVolume);
            });
        }
    }

    setSFXVolume(volume, isSaveLocal) {
        if (this.sfxVolume != volume || isSaveLocal === true) {
            this.sfxVolume = volume;

            if (isSaveLocal === true) {
                cc.sys.localStorage.setItem("sfxVolume", this.sfxVolume);
            }
        }
    }
}
