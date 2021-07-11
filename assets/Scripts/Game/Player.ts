import GameManage from "../Manage/GameManage";
import ToolsHelper from "../Common/Helper/ToolsHelper";
import UIManage from "../Manage/UIManage";
import { DataKey, EventHead } from "./DataKey";
import AudioManager from "../Common/Manager/AudioManager";
import LevelMode from "./LevelMode";
import EventCenter from "../Manage/EventCenter";

const {ccclass, property} = cc._decorator;

@ccclass
export default class Player extends cc.Component {
    Rigibodys:cc.RigidBody=null;
    GraphicsTimes:number=0.05;
    G:number=0;
    
    
    onLoad () {
        this.Rigibodys=this.node.getComponent(cc.RigidBody);
        // var kno=new cc.Node('face');
        // kno.setParent(this.node.getChildByName('game_blue'))
        // kno.position=cc.v2(0,0);
        // kno.addComponent(cc.Sprite).spriteFrame=UIManage.getIns()
        if(!this.node.parent.parent.getChildByName('level'))this.Skill();
    }

    Skill(){
        EventCenter.getInst().fire(EventHead.PlayerSkillUpdate,'xiao');
        EventCenter.getInst().fire(EventHead.ArmsSkillUpdate,'xiao');
    }

    start () {

    }

    onBeginContact(contact: cc.PhysicsContact, selfCollider: cc.PhysicsCollider, otherCollider: cc.PhysicsCollider){
        //console.log (selfCollider+'  '+selfCollider.node.name+'  '+otherCollider+'  '+otherCollider.node.name);
        if(otherCollider.node.parent.name=='Back')AudioManager.playEffect('hjg');
        if(otherCollider.node.name=='aims'){
            GameManage.getIns().SetPhysics(false);
            this.node.runAction(cc.sequence(cc.moveTo(0.5,otherCollider.node.position.add(cc.v2(-40,0))),cc.callFunc(()=>{
                AudioManager.playEffect('bu');
                UIManage.GetGamePanel().LevelNode.getComponent(LevelMode).SetPlayerFace('kiss');
                UIManage.GetGamePanel().LevelNode.getComponent(LevelMode).Setaimsface('kiss');
                this.scheduleOnce(()=>{
                    UIManage.GetGamePanel().GameOver(true);
                },0.5)
            })))
        }else if(otherCollider.node.name=='Over'){
            GameManage.getIns().SetPhysics(false);
            UIManage.GetGamePanel().GameOver(false);
        }
        if(otherCollider.node.name=='HarvestKey'){
            GameManage.getIns().HarvestKey++;
            otherCollider.node.destroy();
        }
    };
    

    update (dt) {
        //var opo = this.Rigibodys.getLinearVelocityFromWorldPoint(this.Rigibodys.getWorldCenter(), cc.v2(0, 0));
        //var isOn=(opo.x != 0 && opo.y != 0)
        if (this.Rigibodys.type==cc.RigidBodyType.Dynamic) {
            this.G += dt;
            if (this.G >= this.GraphicsTimes) {
                this.G = 0;
                if (GameManage.getIns().isOride) {
                    var obj: cc.Node = cc.instantiate(GameManage.getIns().Graphics_2Prefab);
                    obj.setParent(UIManage.GetGamePanel().LevelNode);
                    ToolsHelper.moveNode(obj, UIManage.GetGamePanel().LevelNode.getChildByName('Back'));
                    obj.position = this.node.position;
                } else {
                    //cc.view.enableAntiAlias(true)
                    GameManage.getIns().Graphics.fillRect(this.node.position.x, this.node.position.y, 4, 4);
                    GameManage.getIns().Graphics.fill();
                }
            }
        }
    }
}
