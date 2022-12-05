import DataManage from "../Manage/DataManage";
import UIManage from "../Manage/UIManage";

const {ccclass, property} = cc._decorator;

@ccclass
export default class LevelItem extends cc.Component {
    @property()
    LevelId:number=0;
    onLoad () {
        var label=this.node.getChildByName("Level_"+this.LevelId.toString()).getChildByName('LevelLabel')
        if(label){
            //label.scale=2;
            //label.position=cc.v2(0,230)
        }
        for (let i = 0; i < this.node.children[0].childrenCount; i++) {
            const element = this.node.children[0].children[i];
            if(element.childrenCount>0){
                for (let j = 0; j < element.childrenCount; j++) {
                    const elet = element.children[j];
                    if(elet.getComponent(cc.PhysicsBoxCollider)){
                        elet.removeComponent(cc.PhysicsBoxCollider);
                    }
                    if(elet.getComponent(cc.PhysicsCircleCollider)){
                        elet.removeComponent(cc.PhysicsCircleCollider);
                    }
                    if(elet.getComponent(cc.RigidBody)){
                        elet.removeComponent(cc.RigidBody);
                    }
                }
            }
            if(element.getComponent(cc.PhysicsBoxCollider)){
                element.removeComponent(cc.PhysicsBoxCollider);
            }
            if(element.getComponent(cc.PhysicsCircleCollider)){
                element.removeComponent(cc.PhysicsCircleCollider);
            }
            if(element.getComponent(cc.RigidBody)){
                element.removeComponent(cc.RigidBody);
            }
        }
    }

    start () {
        var Btns= this.node.getChildByName('level').addComponent(cc.Button);
        var clickEventHandler = new cc.Component.EventHandler();
        clickEventHandler.target = this.node; // 这个 node 节点是你的事件处理代码组件所属的节点
        clickEventHandler.component = 'LevelItem';//这个脚本的名子（如果不能和该节点重名，则手动输入）
        clickEventHandler.handler = "OnClick";//这是注册得方法
        clickEventHandler.customEventData = Btns.node.name;
        Btns.clickEvents.push(clickEventHandler);
    }

    /**按钮点击事件 */
    OnClick(enevt: cc.Event.EventTouch, customEventData: string) {
        switch (enevt.target.name){
            case 'level':
                if(DataManage.getIns().GetLevelisLock(this.LevelId)){
                    UIManage.GetMapPanel().node.active=false;
                    UIManage.GetGamePanel().LoadLevel(this.LevelId);
                }else{
                    UIManage.getIns().ShowTip('未解锁')
                }
                break;
        }
    }


    onEnable(){
        this.UIUpdate();
    }

    UIUpdate(){
        var er=this.node.getChildByName('Level_'+this.LevelId.toString())
       
        if(er==null){ cc.log(this.LevelId.toString()); return};
        if(DataManage.getIns().GetLevelisLock(this.LevelId)){
            for (let i = 0; i < er.children.length; i++) {
                const element = er.children[i];
                if(element.name!='bj'){
                    element.active=true;
                }
            }
            this.node.getChildByName('level').getChildByName('level_02 copy').active=true;
            this.node.getChildByName('level').getChildByName('level_03 copy').active=true;
            
        }else{
            for (let i = 0; i < er.children.length; i++) {
                const element = er.children[i];
                if(element.name!='LevelLabel'){
                    element.active=false;
                }
            }
            this.node.getChildByName('level').getChildByName('level_02 copy').active=false;
            this.node.getChildByName('level').getChildByName('level_03 copy').active=false;
        }
    }

    // update (dt) {}
}
