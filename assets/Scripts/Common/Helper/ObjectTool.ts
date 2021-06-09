


/**
 * @example
 * ObjectTool.getInstance().createNode(name,sprite,parentNode);
 * ObjectTool.getInstance().InstanceWithPrefab(name,prefab,parent);
 */
export class ObjectTool
{

    private constructor() { }

    // onLoad () {}

    start()
    {

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

    /**
     * 复制对象节点，指定其父对象
     * @param _name 名字
     * @param _node 复制的节点
     * @param _parent 父对象
     * @param _pos 位置
     */
    public static createNodeWithParent(_name: string, _node: cc.Node, _parent: cc.Node, _pos: cc.Vec2 = new cc.Vec2(0, 0)): cc.Node
    {
        var _node = cc.instantiate(_node);
        _node.name = _name;
        if (_parent != null) _parent.addChild(_node);
        else cc.director.getScene().addChild(_node);
        _node.setPosition(_pos);
        return _node;
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
     * 实例化预制体节点对象
     * @param _name 实例化的命名
     * @param _prefab 实例化的预制体
     * @param _parent(可选) 要挂载到的父节点
     * @param _pos(可选) 位置
     */
    public static instanceWithPrefab(_name: string, _prefab: cc.Prefab, _parent?: cc.Node, _pos: cc.Vec2 = new cc.Vec2(0, 0)): cc.Node
    {
        var _node = cc.instantiate(_prefab);
        if (_node == null) console.error('the _prefab ' + _name + ',_prefab name:' + _prefab + ' is null!!!');
        _node.name = _name;
        if (_parent != null) _parent.addChild(_node);
        else cc.director.getScene().addChild(_node);
        _node.setPosition(_pos);
        return _node;
    }

    /**
     * 实例化节点对象
     * @param _name 实例化的命名
     * @param _prefab 实例化的节点
     * @param _parent(可选) 要挂载到的父节点
     * @param _pos(可选) 位置
     */
    public static instanceWithNode(_name: string, _prefab: cc.Node, _parent?: cc.Node, _pos: cc.Vec2 = new cc.Vec2(0, 0)): cc.Node
    {
        var _node = cc.instantiate(_prefab);
        if (_node == null) console.error('the _prefab ' + _name + ',_prefab name:' + _prefab + ' is null!!!');
        _node.name = _name;
        if (_parent != null) _parent.addChild(_node);
        else cc.director.getScene().addChild(_node);
        _node.setPosition(_pos);
        return _node;
    }

    /**
     * 全局查找节点
     * 从Canvas开始
     * @param _url 路径不包含'Canvas/'
     */
    public static GlobalFindObj(_url: string): cc.Node
    {
        let _node: cc.Node = cc.find('Canvas/' + _url);
        if (_node == null) console.error('！！！the find node is null------------------------');
        return _node;
    }

    /**
     * 根据父节点向下查找节点
     * @param _url 节点路径
     * @param _parent 节点父对象
     * @example 在Panel节点下有a->a1->a2,b->b1,c->c1。要获得a2则传入路径: 'a/a1/a2'
     */
    public static FindObjWithParent(_url: string, _parent: cc.Node): cc.Node
    {
        let _node: cc.Node = cc.find(_url, _parent);
        if (_node == null) console.error('！！！the find ' + _url + ' node is null------------------------');
        return _node;
    }

    public static GetCanvas(): cc.Node
    {
        return cc.find('Canvas');
    }

    public static GetMainCamera(): cc.Node
    {
        return cc.find('Canvas/Main Camera');
    }

    /**
     * 等比例缩放icon 
     * @param obj1 要缩放的节点
     * @param sprite icon
     * @param _w 原始宽
     * @param _h 原始高
     */
    public static setScale(obj1: cc.Node, sprite: cc.SpriteFrame, _w: number = 0, _h: number = 0)
    {
        if (_w != 0 && _h != 0)
        {
            obj1.setScale(1);
            obj1.width = _w;
            obj1.height = _h;
        }
        let scale: number = 0;
        if (sprite.getRect().width > sprite.getRect().height)
        {
            scale = obj1.width / sprite.getRect().width;
        }
        else
        {
            scale = obj1.height / sprite.getRect().height;
        }
        obj1.width = sprite.getRect().width;
        obj1.height = sprite.getRect().height;

        obj1.setScale(scale);
    }

    public static SetRoleScale(obj1: cc.Node, sprite: cc.SpriteFrame, _w: number = 0, _h: number = 0)
    {
        if (_w != 0 && _h != 0)
        {
            obj1.setScale(1);
            obj1.width = _w;
            obj1.height = _h;
        }
        let scale: number = 0;

        if (sprite.getRect().width > sprite.getRect().height)
        {
            scale = obj1.width / sprite.getRect().width;

        }
        else
        {
            scale = obj1.height / sprite.getRect().height;
        }
        if (obj1.width >= sprite.getRect().width && obj1.height >= sprite.getRect().height) 
        {
            scale = 1;
            obj1.width = sprite.getRect().width;
            obj1.height = sprite.getRect().height;
            return;
        }
        //console.log(obj1.width, obj1.height, scale, sprite.getRect().width, sprite.getRect().height);
        obj1.width = sprite.getRect().width;
        obj1.height = sprite.getRect().height;

        obj1.setScale(scale);
    }

    public static createText(_name: string, _parent: cc.Node, _content: string, _pos: cc.Vec2 = new cc.Vec2(0, 0))
    {
        var _node = new cc.Node(_name);
        _node.setPosition(_pos);
        _node.addComponent(cc.Label);
        _node.getComponent(cc.Label).string = _content;
        _node.getComponent(cc.Label).fontSize = 20;
        _node.getComponent(cc.Label).lineHeight = 23;
        _node.color = new cc.Color(93, 236, 60);
        let moveUpTo = cc.moveBy(0.5, cc.v2(0, 40));
        _node.runAction(cc.sequence(moveUpTo, cc.callFunc(function () { _node.destroy(); }.bind(this))));
        if (_parent != null) _parent.addChild(_node);
        else cc.director.getScene().addChild(_node);
        return _node;
    }

    static finish()
    {
        console.log('动作完成----------');
    }

    /**
     * 遍历对象的各个属性及其值
     * @param obj 对象
     */
    public static forEachObject(obj: any)
    {
        for (const key in obj)
        {
            if (obj.hasOwnProperty(key))
            {
                const element = obj[key];
                console.log('obj key:' + key + ',value :' + element);
            }
        }
    }

    /**
     * 解析{11:22,33:3333,444:4434}，类型的字符串为以逗号分开为key-value对的二维数组
     * @param obj 
     */
    public static parseKeyValue(obj: string): any
    {
        obj = obj.replace('{', '').replace('}', '');
        let keyValueLine: string[] = obj.split(',');
        let arr: any = [];
        for (let i = 0; i < keyValueLine.length; i++)
        {
            const element = keyValueLine[i];
            arr.push([element.split(':')[0], element.split(':')[1]]);
        }
        return arr;
    }

    // update (dt) {}
}
