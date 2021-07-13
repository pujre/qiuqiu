import PureHelper from "../Common/Helper/PureHelper";

const {ccclass, property} = cc._decorator;

@ccclass
export default class AnimManage extends cc.Component {

    private static instance;
    public static getIns(): AnimManage {
        return AnimManage.instance;
    }
    onLoad () {
        AnimManage.instance=this;
    }

    /**
     * 节点缩放动画(无回弹)
     * @param cnode 缩放的节点
     * @param scale 缩放的大小
     * @param time 动画的时长
     * @param callfunc 动画完成后回调
     */
    Scale(cnode:cc.Node,scale:number,time:number,callfunc:any=null){
        cnode.runAction(cc.sequence(cc.scaleTo(time,scale,scale),cc.callFunc(()=>{
            if (callfunc){
                callfunc();
            }
        })))
    }
    
    

    /**
     * 节点缩放动画(有回弹)
     * @param cnode 缩放的节点
     * @param scale 缩放的大小
     * @param time 动画的时长
     * @param callfunc 动画完成后回调
     */
    ScaleRebound(cnode:cc.Node,scale:number,time:number,callfunc:any=null){
        cnode.runAction(cc.sequence(cc.scaleTo(time*0.7,scale*1.15,scale*1.15),cc.scaleTo(time*0.15,scale*0.85,scale*0.85),cc.scaleTo(time*0.15,scale,scale),cc.callFunc(()=>{
            if (callfunc){
                callfunc();
            }
        })))
    }

    /**跳跃移动到指定点（抛物线曲线） */
    // BezierMoveTo(cnode: cc.Node, endpos: cc.Vec2, coefficient: number, time: number, callfunc: any = null):cc.Action{
    //     var pos1: cc.Vec2 = cnode.position;
    //     var pos3: cc.Vec2 = endpos;
    //     var plrs = 700;
    //     var pos2: cc.Vec2 = new cc.Vec2((pos1.x + pos3.x) / 2, plrs * coefficient);//曲率
    //     var arr: cc.Vec2[] = [pos1, pos2, pos3];
    //     var que=cnode.runAction(
    //         cc.sequence(cc.bezierTo(time, arr),
    //             cc.callFunc(() => {
    //                 if (callfunc) {
    //                     callfunc();
    //                 }
    //             })
    //         ));
    //     return que;
    // }

    /**原地跳跃 */
    JumpInPlace(cnode: cc.Node,height:number,times:number, callfunc: any = null){
        cnode.runAction(cc.sequence(cc.moveTo(times/2,new cc.Vec2(cnode.position.x,cnode.position.y+height)),cc.moveTo(times/2,new cc.Vec2(cnode.position.x,cnode.position.y-height)),cc.callFunc(()=>{
            if (callfunc) {
                callfunc();
            }
        })))
    }
    
}
