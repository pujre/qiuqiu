
import EventCenter from "../Manage/EventCenter";
import DataManage from "../Manage/DataManage";
import { EventHead } from "../Game/DataKey";


const {ccclass, property} = cc._decorator;

@ccclass
export default class PropStr extends cc.Component {
    /**道具/商品 id */
    @property()
    propId:number=0;

    label: cc.Label = null;
    onLoad () {
        this.label=this.node.getComponent(cc.Label);
    }

    start(){
        EventCenter.getInst().register(EventHead.UpDateProp,(context: any, ...args: any[])=>{
            this.label.string=DataManage.getIns().GetProp(this.propId).toString();
           },this)
    }

    onEnable(){
        if(this.label)this.label.string=DataManage.getIns().GetProp(this.propId).toString();
    }
}
