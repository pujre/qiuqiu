
const {ccclass, property} = cc._decorator;

@ccclass
export default class spring extends cc.Component {

    // onLoad () {
    // }

    // start () {

    // }

    onBeginContact(contact: cc.PhysicsContact, selfCollider: cc.PhysicsCollider, otherCollider: cc.PhysicsCollider){
        //console.log ('_______',selfCollider,'  ',selfCollider.node.name,'  ',otherCollider,'  ',otherCollider.node.name);
        if(otherCollider.node.name=='player'){
            this.node.runAction(cc.sequence(cc.scaleTo(0.15,1.1),cc.scaleTo(0.2,0.95),cc.scaleTo(0.25,1)));
            
        }
    };

    // update (dt) {}
}
