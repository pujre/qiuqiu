import UIManage from "../Manage/UIManage";
import LevelItem from "../Game/LevelItem"
import Player from "./Player";
import DataManage from "../Manage/DataManage";
import EventCenter from "../Manage/EventCenter";
import { EventHead } from "./DataKey";
import PureHelper from "../Common/Helper/PureHelper";

const { ccclass, property } = cc._decorator;

@ccclass
export default class LevelMode extends cc.Component {
    @property()
    Level: number = 0;
    @property(cc.Node)
    Bj: cc.Node = null;
    @property(cc.Label)
    LevelLabel: cc.Label = null;
    posNode: cc.Node = null;

    PlayerFace: cc.Node = null;

    aimsface: cc.Node = null;
    aims: cc.Node = null;

    isMap:any;

    @property(cc.Node)//新手引导
    shou_1:cc.Node=null;

    onLoad() {

        //let cColor=cc.color(PureHelper.Range(0,255),PureHelper.Range(0,255),PureHelper.Range(0,255));
        this.isMap = this.node.parent.getComponent(LevelItem);
        if (!this.isMap) {
            UIManage.GetGamePanel().LevelNode = this.node;
            this.LevelLabel.string = 'Level:' + this.Level.toString();
            this.aims = this.node.getChildByName('aims');
            if (this.posNode == null) {
                this.posNode = new cc.Node('posNode');
                var pr = this.node.getChildByName('player').getChildByName('game_blue').getComponent(cc.Sprite).spriteFrame;
                this.posNode.addComponent(cc.Sprite).spriteFrame = pr;
                this.posNode.setParent(this.node);
                this.posNode.opacity = 255 * 0.6;
                this.posNode.setContentSize(pr.getRect().width, pr.getRect().height);
                this.posNode.active = false;
            }
        }

    }

    onEnable(){
        EventCenter.getInst().register(EventHead.PlayerSkillUpdate,(...args: any[])=>{
            if(!this.isMap){
                let SkillId=DataManage.getIns().GetNowSkillId(0);
                if(this.PlayerFace == null){
                    this.PlayerFace = new cc.Node('PlayerFace');
                    this.PlayerFace.setParent(this.node.getChildByName('player'));
                    this.PlayerFace.position = cc.v2(0, 0);
                    this.PlayerFace.addComponent(cc.Sprite);
                }
                if(SkillId==0){
                   
                    this.node.getChildByName('player').getChildByName('game_blue').active=true;
                }else{
                    this.node.getChildByName('player').getChildByName('game_blue').active=false;
                }
                cc.loader.loadRes('NewSkin/skin_'+(SkillId+1).toString()+'/'+args[0],cc.SpriteFrame,(err,sf)=>{
                    this.PlayerFace.getComponent(cc.Sprite).spriteFrame = sf;
                    if(sf.getRect().height<=50||sf.getRect().width<=50){
                        this.PlayerFace.setContentSize(sf.getRect().width,sf.getRect().height);
                    }else{
                        this.PlayerFace.setContentSize(50,50);
                    }
                })
            }
        },this)

        EventCenter.getInst().register(EventHead.ArmsSkillUpdate,(...args: any[])=>{
            if(!this.isMap){
                let aims=DataManage.getIns().GetNowSkillId(1);
                //console.log('aims:',aims)
                if(this.aimsface == null){
                    this.aimsface = new cc.Node('aimsface');
                    this.aimsface.setParent(this.node.getChildByName('aims'));
                    this.aimsface.position = cc.v2(0, 0);
                    this.aimsface.addComponent(cc.Sprite);
                }
                if(aims==9){
                    this.node.getChildByName('aims').getComponent(cc.Sprite).enabled=true;
                }else{
                    this.node.getChildByName('aims').getComponent(cc.Sprite).enabled=false;
                }
                cc.loader.loadRes('NewSkin/skin_'+(aims+1).toString()+'/'+args[0],cc.SpriteFrame,(err,sf)=>{
                    this.aimsface.getComponent(cc.Sprite).spriteFrame = sf;
                    if(sf.getRect().height<=50||sf.getRect().width<=50){
                        this.aimsface.setContentSize(sf.getRect().width,sf.getRect().height);
                    }else{
                        this.aimsface.setContentSize(50,50);
                    }
                })
            }
        },this)
    }


    onDisable(){
        EventCenter.getInst().removeListener(EventHead.PlayerSkillUpdate,this)
        EventCenter.getInst().removeListener(EventHead.ArmsSkillUpdate,this)
    }

    TranformSkill() {
        this.node.getChildByName('player').getComponent(Player).Skill();
    }

    SetPos(pos: cc.Vec2) {
        if(pos){
            this.posNode.active = true;
            this.posNode.position = pos;
        }
    }

    /**
     * 关闭新手引导
     */
    onclose(){
        if(this.shou_1!=null){
            this.shou_1.active=false;
        }
    }

    SetPlayerFace(names: string) {
       EventCenter.getInst().fire(EventHead.PlayerSkillUpdate,names);
    }

    Setaimsface(names: string) {
        EventCenter.getInst().fire(EventHead.ArmsSkillUpdate,names);
    }

    start() {
        EventCenter.getInst().fire(EventHead.PlayerSkillUpdate,'xiao');
        EventCenter.getInst().fire(EventHead.ArmsSkillUpdate,'xiao');
    }

    // update (dt) {}
}
