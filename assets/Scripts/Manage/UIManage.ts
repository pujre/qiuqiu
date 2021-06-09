import GamePanel from "../Panel/GamePanel";
import HomePanel from "../Panel/HomePanel";
import StorePanel from "../Panel/StorePanel";
import TaskPanel from "../Panel/TaskPanel";
import SiginPanel from "../Panel/SiginPanel";
import MapPanel from "../Panel/MapPanel";

const {ccclass, property} = cc._decorator;

@ccclass
export default class UIManage extends cc.Component {

    @property(cc.Node)
    Tip:cc.Node=null;
    
    private static instance;
    public static getIns(): UIManage {
        return UIManage.instance;
    }
    onLoad () {
        UIManage.instance=this;
    }

    start () {

    }

    static GetGamePanel():GamePanel{
        return cc.find('Canvas/Main Camera/GamePanel').getComponent(GamePanel);
    }
    static GetHomePanel():HomePanel{
        return cc.find('Canvas/Main Camera/HomePanel').getComponent(HomePanel);
    }
    static GetStorePanel():StorePanel{
        return cc.find('Canvas/Main Camera/StorePanel').getComponent(StorePanel);
    }
    static GetTaskPanel():TaskPanel{
        return cc.find('Canvas/Main Camera/TaskPanel').getComponent(TaskPanel);
    }
    static GetSiginPanel():SiginPanel{
        return cc.find('Canvas/Main Camera/SiginPanel').getComponent(SiginPanel)
    }
    static GetMapPanel():MapPanel{
        return cc.find('Canvas/Main Camera/MapPanel').getComponent(MapPanel)
    }



    /**
    * 小弹窗文字提示
    * @param str 
    */
   ShowTip(str: string) {
    this.Tip.stopAllActions();
    this.Tip.runAction(cc.fadeTo(0.1, 255))
    this.Tip.color = cc.Color.WHITE;
    this.Tip.position = new cc.Vec2(0, -280);
    this.Tip.getChildByName('sprite').setContentSize(str.length * 38, 40);
    this.Tip.getChildByName('label').getComponent(cc.Label).string = str;
    this.Tip.runAction(cc.sequence(cc.moveTo(1, new cc.Vec2(0, -240)), cc.fadeTo(1, 0)));
}

    // update (dt) {}
}

