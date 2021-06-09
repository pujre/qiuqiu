
const {ccclass, property} = cc._decorator;

@ccclass
export default class NewClass extends cc.Component {
    @property()
    speed:number=-50;
    // onLoad () {}

    start () {

    }

    update (dt) {
        this.node.angle+=dt*this.speed;
    }
}
