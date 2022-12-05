import PureHelper from "../Common/Helper/PureHelper";
import GameManage from "../Manage/GameManage";
import bj from "./bj";
import UIManage from "../Manage/UIManage";
import LevelMode from "../Game/LevelMode";
import AudioManager from "../Common/Manager/AudioManager";
import DataManage from "../Manage/DataManage";
import { DataKey, EventHead } from "../Game/DataKey";
import PureAdManage from "../Manage/PureAdManage";
import TaskManage from "../Manage/TaskManage";
import EventCenter from "../Manage/EventCenter";
import AnalyticsManager, { EAnalyticsEventType, EAnalyticsEvent } from "../ThirdPlugin/Manager/AnalyticsManager";
import SdkTools, { Game_Platform } from "../tyqsdk/tools/SdkTools";

const {ccclass, property} = cc._decorator;

@ccclass
export default class GamePanel extends cc.Component {
    NowLevelId:number=0;
    @property()
    MaxDistance:number=100;
    Power:number=1;
    TouchNode:cc.Node=null;
    TouchPos:cc.Vec2=null;
    LevelNode:cc.Node=null;
    /**射出方向 */
    DirectionVector:cc.Vec2=cc.v2(0,0);
    bj:cc.Node=null;
    @property(cc.Node)
    RotateNode:cc.Node=null;
    @property(cc.Node)
    keyus:cc.Node=null;
    @property(cc.Node)
    LookAd:cc.Node=null;
    /**是否记录位置 */
    isPos:boolean=false;
    SinginBall:cc.Node=null;

    reference1Btn:cc.Node=null;

    isTweenisOn:boolean=true;//是否允许点击
    @property(cc.Node)
    key_1:cc.Node=null;

    dit:cc.Node;


    onLoad () {
        var Btns: cc.Button[] = this.node.getComponentsInChildren(cc.Button);
        for (let i = 0; i < Btns.length; i++) {
            var clickEventHandler = new cc.Component.EventHandler();
            clickEventHandler.target = this.node; // 这个 node 节点是你的事件处理代码组件所属的节点
            clickEventHandler.component = this.node.name;//这个脚本的名子（如果不能和该节点重名，则手动输入）
            clickEventHandler.handler = "OnClick";//这是注册得方法
            clickEventHandler.customEventData = Btns[i].node.name;
            Btns[i].clickEvents.push(clickEventHandler);
            if(Btns[i].node.name=='Music'){
                if(AudioManager.getEffectVolume()==1){
                    Btns[i].node.getChildByName('on').active=true
                    Btns[i].node.getChildByName('off').active=false;
                   
                }else{
                    Btns[i].node.getChildByName('on').active=false
                    Btns[i].node.getChildByName('off').active=true;
                }
            }
            if(Btns[i].node.name=='Sigin'){
                this.SinginBall=Btns[i].node.getChildByName('sign_in_cue_ball');
                this.SinginBall.active=!TaskManage.getIns().GetIsSiginin();
            }
            if(Btns[i].node.name=='reference1'){
                this.reference1Btn=Btns[i].node;
            }
            if(Btns[i].node.name=='LookAD'){
                let blop=SdkTools.getPlatform()==Game_Platform.GP_Vivo;
                Btns[i].node.active=blop;
            }
            if(Btns[i].node.name=='ShareGame'){
                let qqs=SdkTools.getPlatform()==Game_Platform.GP_QQ;
                Btns[i].node.active=qqs;
            }
            if(Btns[i].node.name=='Dit'){
                this.dit=Btns[i].node;
                if(DataManage.getIns().GetItemData("isDit")!=null){
                    this.dit.active=false;
                }
            }
            if(Btns[i].node.name=='Dit'&&SdkTools.getPlatform()!=Game_Platform.GP_Vivo){
                Btns[i].node.active=false;
            }
        }

        this.TouchNode=this.node.getChildByName('TouchMove');
        console.log('开始注册按钮事件：'+this.TouchNode.name)
        this.TouchNode.on(cc.Node.EventType.TOUCH_START, (enevt: cc.Event.EventTouch) => {
            this.TouchStart(enevt);
        }, this.TouchNode)
        this.TouchNode.on(cc.Node.EventType.TOUCH_CANCEL, (enevt: cc.Event.EventTouch) => {
            this.TouchEnd(enevt);
        }, this.TouchNode)
        this.TouchNode.on(cc.Node.EventType.TOUCH_END, (enevt: cc.Event.EventTouch) => {
            this.TouchEnd(enevt);
        }, this.TouchNode)
        this.TouchNode.on(cc.Node.EventType.TOUCH_MOVE, (enevt: cc.Event.EventTouch) => {
            this.TouchMoveUs(enevt);
        }, this.TouchNode)
        switch (SdkTools.getPlatform()) {
            case Game_Platform.GP_QQ:
                break
            case Game_Platform.GP_Vivo:
                this.LookAd.active=true;
                break;
            case Game_Platform.GP_Tiktok:
                break;
            default:
                break;
        }
    }

    TouchStart(enevt:cc.Event.EventTouch){
        if(!this.LevelNode||!this.isTweenisOn)return;
        var rigi=this.LevelNode.getChildByName('player').getComponent(cc.RigidBody);
        if(rigi.type!=cc.RigidBodyType.Dynamic){
            cc.log('点击：');
            this.GameStatus(true);
            this.LevelNode.getComponent(LevelMode).SetPlayerFace('Shock');
            this.TouchPos=enevt.getStartLocation().sub(cc.find('Canvas').position);
            this.bj=this.LevelNode.getComponent(LevelMode).Bj;
            this.bj.position=rigi.node.position;
            this.bj.active=true;
        }
    }

    /**松手 */
    TouchEnd(enevt:cc.Event.EventTouch){
        if(this.TouchPos==null)return;
        this.isTweenisOn=false;
        console.log('松手'+(this.DirectionVector.mul(this.Power))+' 倍数为：'+this.Power);
        this.bj.active=false;
        var rigi=this.LevelNode.getChildByName('player').getComponent(cc.RigidBody);
        this.LevelNode.getComponent(LevelMode).SetPlayerFace('cry');
        UIManage.GetGamePanel().LevelNode.getComponent(LevelMode).Setaimsface('cry');
        if(this.isPos){
            UIManage.GetGamePanel().LevelNode.getComponent(LevelMode).SetPos(this.LevelNode.getChildByName('player').position);
        }
        UIManage.GetGamePanel().LevelNode.getComponent(LevelMode).onclose();
        var v0=this.DirectionVector.mul(this.Power);
        let Speed=Math.sqrt(Math.pow(v0.x,2)+Math.pow(v0.y,2));
        let Distance=PureHelper.Distance(this.bj.position,rigi.node.position);
        rigi.node.runAction(cc.sequence(cc.moveTo(Distance/Speed,this.bj.position),cc.callFunc(()=>{
            //cc.log('xxx');
            rigi.type=cc.RigidBodyType.Dynamic;
            rigi.applyLinearImpulse(v0,rigi.getWorldCenter(),true);
        })))
        
        this.TouchPos=null;
        this.schedule(this.getPos,0.08,10);
    }

    getPos(){
        //cc.log(this.LevelNode.getChildByName('player').position);
    }

    /**手指滑动 */
    TouchMoveUs(enevt:cc.Event.EventTouch){
        if(this.TouchPos==null)return;
        var player=this.LevelNode.getChildByName('player');
        var NowLocation=enevt.getLocation().sub(cc.find('Canvas').position);
        var dis=PureHelper.Distance(this.TouchPos,NowLocation)>this.MaxDistance?this.MaxDistance:PureHelper.Distance(this.TouchPos,NowLocation);
        var post=PureHelper.getPosOuter(this.bj.position,this.bj.position.add(NowLocation.sub(this.TouchPos).normalize().clone()),dis);
        player.position=post.add(this.bj.position);
        this.Power=dis*10;
        this.DirectionVector=this.bj.position.sub(player.position).normalizeSelf();
        this.bj.getComponent(bj).setOrder(player.position,dis/3,this.DirectionVector.mul(this.Power));
    }
   
    key_1Move(pos:cc.Vec2){
        this.key_1.stopAllActions();
        this.key_1.runAction(cc.fadeTo(0.1, 255))
        this.key_1.color = cc.Color.WHITE;
        this.key_1.position = new cc.Vec2(pos.x, pos.y+20);
        this.key_1.runAction(cc.sequence(cc.moveTo(1, new cc.Vec2(pos.x, pos.y+50)), cc.fadeTo(1, 0)));
    }

    /**按钮点击事件 */
    OnClick(enevt: cc.Event.EventTouch, customEventData: string) {
        switch (enevt.target.name) {
            case 'receive'://双倍领取
            PureAdManage.getIns().ShowVideo(()=>{
                DataManage.getIns().SetCoin(100);
                if(GameManage.getIns().HarvestKey>0){
                    DataManage.getIns().SetProp(1,GameManage.getIns().HarvestKey*2)
                }
                UIManage.getIns().ShowTip('双倍奖励');
                this.Nextlevel();
            })
                break;
            case 'rigihtAD':
                //PureAdManage.getIns().ShowInters();
                PureAdManage.getIns().ShowPrimeval();
                //console.log("点击查看原生广告按钮，待加入查看原生广告");
                break;
            case 'LookAD':
                //PureAdManage.getIns().ShowInters();
                PureAdManage.getIns().ShowPrimeval();
                //console.log("点击查看原生广告按钮，待加入查看原生广告");
                break;
            case 'Music':
                AudioManager.setEffectVolume(AudioManager.getEffectVolume()==1?0:1);
                if(AudioManager.getEffectVolume()==1){
                    enevt.target.getChildByName('on').active=true
                    enevt.target.getChildByName('off').active=false;
                   
                }else{
                    enevt.target.getChildByName('on').active=false
                    enevt.target.getChildByName('off').active=true;
                }
                cc.find('Canvas/AudioManager').getComponent(cc.AudioSource).volume=AudioManager.getEffectVolume();
                break;
            case 'Map':
                UIManage.GetMapPanel().node.active=true;
                break;
            case 'Key':
                DataManage.getIns().SetProp(1,1);
                break;
            case 'playAgain'://重玩当前关卡
                this.node.getChildByName('Overs').active=false;
                this.LoadLevel(this.NowLevelId);
                //this.scheduleOnce(()=>{PureAdManage.getIns().ShowInters();},1)
                break;
            case 'reference1':
            case 'nextLevel'://下一关
                this.Nextlevel();
                break;
            case 'Dit':
                PureAdManage.getIns().showDit((isOn)=>{
                    if(isOn){
                        this.dit.active=false;
                        DataManage.getIns().SetItemData("isDit",1);
                    }
                });
                break;
            case'Sigin':
                UIManage.GetSiginPanel().node.active=true;
                this.scheduleOnce(()=>{PureAdManage.getIns().ShowInters();},1)
                break;
            case 'Transform':
            case 'Skill':
                UIManage.GetStorePanel().node.active=true;
                PureAdManage.getIns().HideBanner();
                break;
            case 'Pos':
                if(!this.isPos){
                    if(DataManage.getIns().GetProp(1)>1){
                        DataManage.getIns().SetProp(1,-1);
                        this.key_1Move(enevt.target.position)
                        this.isPos=true;
                        UIManage.getIns().ShowTip('使用一个钥匙开启记录位置');
                    }else{
                        UIManage.getIns().ShowTip('钥匙不足');
                    }
                }else{
                    if(this.isPos)UIManage.getIns().ShowTip('已开启记录位置功能');
                }
                break;
            case 'BoxBig':
                cc.log (this.RotateNode.scale);
                if(this.RotateNode.scale>3.3){
                    UIManage.getIns().ShowTip('已为最大魔力');
                }else
                if(DataManage.getIns().GetProp(1)>0){
                    DataManage.getIns().SetProp(1,-1);
                    this.key_1Move(enevt.target.position)
                    var aims:cc.PhysicsCircleCollider=this.LevelNode.getChildByName('aims').getComponent(cc.PhysicsCircleCollider);
                    aims.radius=aims.radius*1.5;
                    this.RotateNode.position=this.RotateNode.parent.convertToNodeSpaceAR(aims.node.parent.convertToWorldSpaceAR(aims.node.position))
                    this.RotateNode.scale=this.RotateNode.scale*1.5;
                    console.log (aims.radius, this.RotateNode.scale)
                    aims.apply();
                }else {
                    if(DataManage.getIns().GetProp(1)<1){
                        UIManage.getIns().ShowTip('钥匙不足');
                    }
                }
                break;
            case 'Jump':
                if (this.NowLevelId < 30) {
                    PureAdManage.getIns().ShowVideo(() => {
                        this.node.getChildByName('Overs').active = false;
                        if (this.NowLevelId + 1 < 31) {
                            DataManage.getIns().SetLevelLock(this.NowLevelId + 1);
                            this.LoadLevel(this.NowLevelId + 1);
                        } else {
                            this.LoadLevel(1);
                        }
                    });
                } else {
                    UIManage.getIns().ShowTip('无法跳关，是最后一关')
                }
                break;
            case 'GameoverLostBtn':
                this.node.getChildByName('Overs').active=false;
                this.LoadLevel(this.NowLevelId);
                break;
            case 'KeyBtn':
                this.node.getChildByName('ADPanel').active=true;
                this.node.getChildByName('ADPanel').getChildByName('prompt_01').active=true;
                this.node.getChildByName('ADPanel').getChildByName('label').getComponent(cc.Label).string='是否观看视频跳过此关。';
                break;
            case 'ShareGame':
                PureAdManage.getIns().ShareGame();
                break;
            case 'moreGame':
                PureAdManage.getIns().Moregame();
                break;
            case 'AD':
                PureAdManage.getIns().ShowVideo(() => {
                    console.log("播放广告成功");
                    this.node.getChildByName('ADPanel').active = false;
                    DataManage.getIns().SetProp(1, 3);
                    UIManage.getIns().ShowTip('获得3枚钥匙')
                })
                break;
            case 'Close':
                this.node.getChildByName('ADPanel').active=false;
                break;
        }
    }

    Nextlevel(){
        this.node.getChildByName('Overs').active=false;
        if(this.NowLevelId+1<31){
            this.LoadLevel(this.NowLevelId+1);
            
        }else{
            this.LoadLevel(1);
        }
    }

    private isMenuBool:boolean=false;//ui状态
    private isRun:boolean=false;//动画是否正在进行
    /**
     * 游戏UI状态
     * @param uiStatus 
     */
    GameStatus(uiStatus: boolean, times: number = 0.25) {
        if (!this.isRun && this.isMenuBool != uiStatus) {
            this.isRun = true;
            this.isMenuBool = uiStatus;
            var LevelLabel: cc.Node = this.LevelNode.getChildByName('LevelLabel');
            var LevelLabelpos = LevelLabel.position;
            var Menu = this.node.getChildByName('Menu');
            var Menupos = Menu.position;
            var RightMenu = this.node.getChildByName('RightMenu');
            var RightMenupos = RightMenu.position;
            var dic = uiStatus == true ? 200 : -200;
            if (uiStatus) LevelLabel.runAction(cc.moveTo(times, cc.v2(LevelLabelpos.x, LevelLabelpos.y + dic)));
            RightMenu.runAction(cc.moveTo(times, cc.v2(RightMenupos.x + (dic * 2), RightMenupos.y)));
            Menu.runAction(cc.sequence(
                cc.moveTo(times, cc.v2(Menupos.x, Menupos.y + dic)),
                cc.callFunc(() => {
                    this.isRun = false;
                })
            ));
            this.node.getChildByName('GameoverLostBtn').active = uiStatus;
        }
    }


    /**
     * 加载游戏关卡
     * @param uiStatus 
     */ 
    LoadLevel(levelId:number,isStatus:boolean=true){
        AnalyticsManager.getInstance().raiseLevelEvent(EAnalyticsEvent.Start,{level:levelId.toString()});
        PureHelper.EventTimes('LevelsOStar',10000);
        PureAdManage.getIns().HideBlockad();
        PureAdManage.getIns().HideBanner();
        var pose=null;
        if(this.LevelNode){
            if(this.isPos&&levelId==this.LevelNode.getComponent(LevelMode).Level){
                pose=this.LevelNode.getComponent(LevelMode).posNode.position;
            }
            this.LevelNode.destroy();
        }
        cc.loader.loadRes("prefab/Level/Level_"+levelId.toString(), cc.Prefab, (err, prefab)=>{
            if (err) {
                cc.log(err.message || err);
                return;
            }else{
                this.isTweenisOn=true;
                GameManage.getIns().HarvestKey=0;
                this.LevelNode = cc.instantiate(prefab);
                this.LevelNode.name='KK'
                //cc.log( this.LevelNode)
                this.LevelNode.setParent(UIManage.GetGamePanel().node);
                this.LevelNode.setSiblingIndex(3);
               
                if(this.isPos){
                    this.LevelNode.getComponent(LevelMode).SetPos(pose);
                }
                if(levelId!= this.NowLevelId)this.isPos=false;
                this.NowLevelId=levelId;
                GameManage.getIns().Graphics.node.setParent(this.node);
                GameManage.getIns().Graphics.node.scale=1;
                GameManage.getIns().Graphics.clear();
                GameManage.getIns().Graphics.node.setSiblingIndex(0);
                GameManage.getIns().SetPhysics(true);
                GameManage.getIns().Graphics.node.position=cc.v2(0,0);
                this.RotateNode.scale=1;
                this.RotateNode.position=cc.v2(-5000,0);
                if(isStatus)this.GameStatus(false,0.01);
                if(levelId==2&&!TaskManage.getIns().GetIsSiginin()){
                    UIManage.GetSiginPanel().node.active=true;
                }
                // if(levelId==2){
                //     PureAdManage.getIns().InterAndDeskTop(true);
                // }
            }
        });
    }

    GameOver(isOn:boolean){
        EventCenter.getInst().fire(EventHead.GameOver);
        //if(this.NowLevelId!=1){
            this.scheduleOnce(()=>{ PureAdManage.getIns().ShowInters(); },1)  
        //}
        PureAdManage.getIns().ShowBlockad();
        PureAdManage.getIns().ShowBanner();
        if(this.NowLevelId==3&&DataManage.getIns().GetItemData("isDit")==null){
            PureAdManage.getIns().showDit((isOn)=>{
                if(isOn){
                    this.dit.active=false;
                    DataManage.getIns().SetItemData("isDit",1);
                }
            });
        }
        let Overs:cc.Node=this.node.getChildByName('Overs');
        let Win:cc.Node=Overs.getChildByName('Win');
        let Lose:cc.Node=Overs.getChildByName('Lose');
        //this.reference1Btn.active=false;
        AnalyticsManager.getInstance().raiseLevelEvent(isOn?EAnalyticsEvent.Success:EAnalyticsEvent.Fail,{level:this.NowLevelId.toString()});
        if(isOn){   
            AnalyticsManager.getInstance().raiseCustomEvent(EAnalyticsEvent.Start,{name:'单关通关时长',info:{levelId:this.NowLevelId,Time:10000-PureHelper.EventTimes('LevelsOStar')}});
        }
        Overs.active=true;
        if(isOn){
            Win.active=true;
            Lose.active=false;
            //this.scheduleOnce(()=>{this.reference1Btn.active=true;},1.5)
            Win.getChildByName('prompt_01').active=GameManage.getIns().HarvestKey>0?true:false;
            Win.getChildByName('coin').active=true;
            DataManage.getIns().SetCoin(50);
            DataManage.getIns().SetLevelLock(this.NowLevelId<20?this.NowLevelId+1:1)
            var Rigis: cc.RigidBody[] = this.LevelNode.getComponentsInChildren(cc.RigidBody);
            for (let i = 0; i < Rigis.length; i++) {
                Rigis[i].active=false;
            }
            this.scheduleOnce(()=>{
                if(this.LevelNode){
                    this.LevelNode.setParent(Win.getChildByName('bk'));
                    this.LevelNode.position=cc.v2(15,0);
                    this.LevelNode.scale=0.45;
                    this.LevelNode.getChildByName('LevelLabel').scale=2;
                    this.LevelNode.getChildByName('LevelLabel').position=cc.v2(0,380);
                    GameManage.getIns().Graphics.node.setParent(Win.getChildByName('bk'));
                    GameManage.getIns().Graphics.node.scale=0.45;
                    GameManage.getIns().Graphics.node.position=cc.v2(18,-34)
                }
            },0.1)
        }else{
            Win.active=false;
            Lose.active=true;
        }
        let obj=isOn?Win:Lose;
        switch (SdkTools.getPlatform()) {
            case Game_Platform.GP_QQ:
                obj.getChildByName("ShareGame").active = true;
                obj.getChildByName("moreGame").active = true;
                obj.getChildByName("LookAD").active = false;
                break
            case Game_Platform.GP_Vivo:
                obj.getChildByName("ShareGame").active = false;
                obj.getChildByName("moreGame").active = false;
                obj.getChildByName("LookAD").active = true;
                break;
            case Game_Platform.GP_Tiktok:
                break;
            default:
                break;
        }
    }

    start () {
        var level=DataManage.getIns().GetHightLevel();
        cc.find('Canvas/AudioManager').getComponent(cc.AudioSource).volume=AudioManager.getEffectVolume();
        this.LoadLevel(level,false);
        // if(!TaskManage.getIns().GetIsSiginin()){
        //     UIManage.GetSiginPanel().node.active=true;
        // }
    }

    //  update (dt) {
    //     //  if(this.LevelNode){
            
    //     //  }
    //  }
}
