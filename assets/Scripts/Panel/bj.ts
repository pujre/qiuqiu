import PureHelper from "../Common/Helper/PureHelper";
import UIManage from "../Manage/UIManage";

const {ccclass, property} = cc._decorator;

@ccclass
export default class bj extends cc.Component {

    @property([cc.Node])
    LittleBit:cc.Node[]=[];
    @property(cc.Node)
    BOil:cc.Node=null;

    onLoad () {
        for (let i = 0; i < this.LittleBit.length; i++) {
            const element = this.LittleBit[i];
            element.setContentSize(4,4);
            
        }
    }

    start () {

    }

    setOrder(v2:cc.Vec2,d:number,v0:cc.Vec2){
        this.BOil.setContentSize(this.BOil.getContentSize().width,PureHelper.Distance(this.node.position,v2));
        this.BOil.angle=PureHelper.Angle_X(this.node.position,v2)+90;
        var pos=UIManage.GetGamePanel().LevelNode.getChildByName('player').position;
        for (let i = 0; i < this.LittleBit.length; i++) {
            const element = this.LittleBit[i];
            var iop=PureHelper.getPosOuter(v2,this.node.position,i*d);//PureHelper.Distance(cc.v2(0,pos.y),cc.v2(0,this.node.position.y))
            element.position=this.GetPos(v0,i*(0.04));
        }
    }

    GetPos(v:cc.Vec2,t:number):cc.Vec2{
        var y=v.y*t-(0.5*1500*t*t);
        var x=v.x*t;
        //cc.log('V:',v,"element",x,y);
        return cc.v2(x,y)//.add(UIManage.GetGamePanel().LevelNode.getChildByName('player').position.subSelf(this.node.position));


    }

    // update (dt) {}
}
