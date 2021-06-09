
import EventCenter from "../Manage/EventCenter";
import DataManage from "../Manage/DataManage";
import { EventHead } from "../Game/DataKey";


const {ccclass, property} = cc._decorator;

@ccclass
export default class CoinStr extends cc.Component {
    label: cc.Label = null;
    onLoad(){
        this.label=this.node.getComponent(cc.Label);
    }
    start () {
       EventCenter.getInst().register(EventHead.UpDateCoin,(context: any, ...args: any[])=>{
        this.label.string=DataManage.getIns().GetCoin().toString();
       },this)
    }

    onEnable(){
        this.label.string=DataManage.getIns().GetCoin().toString();
    }


}
