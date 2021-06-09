import EventCenter from "../Manage/EventCenter";
import { EventHead } from "./DataKey";

const {ccclass, property} = cc._decorator;

@ccclass
export default class Blow extends cc.Component {
    onLoad(){
        
    }

    onEnable(){
        EventCenter.getInst().register(EventHead.GameOver,this.GameOver,this.node);
    }

    onDestroy(){
        EventCenter.getInst().removeListener(EventHead.GameOver,this.node);
    }

    onDisable(){
        EventCenter.getInst().removeListener(EventHead.GameOver,this.node);
    }

    GameOver(){
        console.log (this.node,'  ',this);
        //this.node.active=false;
    }

    onPreSolve(contact: cc.PhysicsContact, selfCollider: cc.PhysicsCollider, otherCollider: cc.PhysicsCollider){
        contact.disabledOnce=true;
        //console.log ('_______onPreSolve',selfCollider,'  ',selfCollider.node.name,'  ',otherCollider,'  ',otherCollider.node.name);
        if(otherCollider.node.name=='player'){
            let nv=this.node.parent.convertToWorldSpaceAR(this.node.position).sub(otherCollider.node.parent.convertToWorldSpaceAR(otherCollider.node.position)).normalize();
            nv=nv.mul(10);
            otherCollider.body.linearVelocity=otherCollider.body.linearVelocity.sub(nv);
        }
    };
    
    // update (dt) {}
}
