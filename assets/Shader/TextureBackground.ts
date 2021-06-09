
const {ccclass, property} = cc._decorator;

@ccclass
export default class NewClass extends cc.Component {
    _Sprite:cc.Sprite=null;
    _Material=null;
    private _dt:number=0;

    onLoad () {
        this._Sprite=this.node.getComponent(cc.Sprite);
        this._Material=this._Sprite.getMaterial(0);
    }

    start () {
    }

    update (dt) {
        this._dt+=dt;
        this._Material.setProperty("time",this._dt);
    }
}
