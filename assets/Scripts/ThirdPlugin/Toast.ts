
const {ccclass, property} = cc._decorator;

@ccclass
export default class Toast extends cc.Component {

    public static showNewToast(_msg:string,_color:cc.Color=cc.Color.BLACK)
    {
        let node:cc.Node=Toast.createSpriteNode('toast',null,cc.find("Canvas"));
        node.width=400;
        node.height=100;
        let txt:cc.Node=Toast.createNode('txt',node);
        txt.width=400;
        txt.height=100;
        txt.addComponent(cc.Label);
       
        txt.getComponent(cc.Label).overflow=cc.Label.Overflow.NONE;
        txt.getComponent(cc.Label).fontSize=40;
        txt.getComponent(cc.Label).string=_msg;
        txt.color=_color;
        node.position=cc.v2(0,-150);
        let tween=cc.moveBy(1,cc.v2(0,150));
        let seq=cc.sequence(tween,cc.callFunc(function(){
            node.destroy();
        }));
        node.runAction(seq);
    }

    /**
     * 创建精灵节点，设置图片
     * @param _name 实例化的命名
     * @param _sprite 图片资源spriteFrame object
     * @param _parent 要挂载到的父节点
     */
    public static createSpriteNode(_name: string, _sprite: cc.SpriteFrame, _parent?: cc.Node): cc.Node
    {
        var _node = new cc.Node(_name);
        var sp = _node.addComponent(cc.Sprite);
        sp.spriteFrame = _sprite;
        if (_parent != null) _parent.addChild(_node);
        else cc.director.getScene().addChild(_node);
        return _node
    }

     /**
     * 创建空节点
     * @param _name 节点名字
     * @param _parent 父节点
     */
    public static createNode(_name, _parent, _pos: cc.Vec2 = new cc.Vec2(0, 0)): cc.Node
    {
        var _node = new cc.Node(_name);
        if (_parent != null) _parent.addChild(_node);
        else cc.director.getScene().addChild(_node);
        return _node;
    }


}
