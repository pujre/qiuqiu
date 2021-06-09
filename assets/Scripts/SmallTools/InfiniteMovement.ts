
const {ccclass, property} = cc._decorator;

/**背景无线移动，两张图 */
@ccclass
export default class InfiniteMovement extends cc.Component {

    @property([cc.Node])
    BackNode:cc.Node[] =[];
    /**背景是否移动 */
    IsMove:boolean=false;
    /**移动速度 */
    Speed:number=200;
    
    
    onLoad(){
        this.Restore();
    }

    /**初始化背景资源 */
    Restore(){
        this.node.setAnchorPoint(cc.v2(0,0.5));
        this.node.position=new cc.Vec2(-cc.winSize.width/2,0);
        for (let i = 0; i < this.BackNode.length; i++) {
            const element =  this.BackNode[i];
            element.setAnchorPoint(cc.v2(0,0.5));//设置锚点为最左边
            element.position=new cc.Vec2(i*element.width);
        }
    }

    /**移动背景 */
    StarTBackMove(isOn:boolean=true,speed:number=200){
        this.Speed=speed;
        this.IsMove=isOn;
    }


    update (dt) {
        if (this.IsMove){
            for (let i = 0; i < this.BackNode.length; i++) {
                const element = this.BackNode[i];
                element.x -= dt * this.Speed;
            }
            if (this.BackNode[0].x <= -(this.BackNode[0].getContentSize().width)) { // 地图切换
                this.BackNode[0].position=new cc.Vec2(this.BackNode[1].position.x+this.BackNode[1].getContentSize().width,0);
            }else
            if (this.BackNode[1].x <= -(this.BackNode[1].getContentSize().width)) { // 地图切换
                this.BackNode[1].position=new cc.Vec2(this.BackNode[0].position.x+this.BackNode[0].getContentSize().width,0);
            }
        }
    }
}
