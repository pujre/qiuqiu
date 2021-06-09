/**
 ** 创建人: zhibin
 ** 日  期: 2019.12.11
 ** 版  本: 1.0
 *  帧动画播放
 * 
 *  传入一组SpirteFrame 或者拖拽一组动画 调用play操作开始执行帧动画
 */

const {ccclass, property , menu} = cc._decorator;

@ccclass
@menu("自定义/帧动画")
export default class FrameAniCom extends cc.Component{
    @property({
        type: cc.Float,
        tooltip: "速度"
    })
    private speed: number = 0.1;

    @property({
        type: cc.Sprite,
        tooltip: "目标节点"
    })
    private target: cc.Sprite = null;

    @property({
        type: [cc.SpriteFrame],
        tooltip: "精灵帧列表"
    })
    private sequenceList: cc.SpriteFrame[] = [];

    @property({
        type: cc.Integer,
        tooltip: "播放次数， 0代表无限"
    })
    private times: number = 0;

    /** 播放完毕的回调 */
    private finishCb : ()=>void = null;
    private index: number = 0;

    public isPlaying: boolean = false;

    /** 初始化序列帧 */
    initSequeceFrame( target: cc.Sprite , frame: cc.SpriteFrame[] ){
        this.target = target;
        this.sequenceList = frame;
    }

    setAnimationListen( cb ?: ()=>void){
        this.finishCb = cb;
    }

    /** 播放次数 和 播放速度,  不传则是面板配置 */
    play( times ?: number , speed ?: number){

        this.times = times != undefined ? times : this.times;
        this.speed = speed != undefined ? speed : this.speed;
        
        this.isPlaying = true;
        this.index = 0;

        this._startTimer();
    }

    stop(){
        this.isPlaying = false;

        this._stopTimer();
    }

    resume(){
        this.isPlaying = true;

        this._startTimer();
    }

    private _playAni(){
        let frame = this.sequenceList[this.index];
        this.target.spriteFrame = frame;

        if(this.index == this.sequenceList.length - 1){
            this.finishCb && this.finishCb();

            this.times--;
            if(this.times == 0){
                this.stop();
            }
        }
        this.index = (++this.index) % this.sequenceList.length;
    }

    private _startTimer(){
        this.unschedule( this._playAni );
        this.schedule( this._playAni , this.speed );
    }

    private _stopTimer(){
        this.unschedule( this._playAni );
    }
}
