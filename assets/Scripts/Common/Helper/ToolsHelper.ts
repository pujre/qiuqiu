
/**
 ** 创建人: zhibin
 ** 日  期: 2019.11.19
 ** 版  本: 1.0
 ** 描  述: 静态函数
        辅助工具类：
        通用工具的静态方法, 主要是扩展已有的引擎和系统函数
*/


export default class ToolsHelper {
    
    // --递归获取节点
    public static getChild(node: cc.Node, path: string): cc.Node {
        let list = path.split("/");
        let ret = node;
        for (let i = 0; i < list.length; i++) {
            if (!ret) {
                return null;
            }
            ret = ret.getChildByName(list[i]);
        }
        return ret;
    }

    // -- 移动一个节点到另一个节点下
    public static moveNode(node: cc.Node, newParent: cc.Node, changeBrotherZOrder = false): cc.Node {
        if (!node || !newParent) {
            return null;
        }
        let oldParent = node.parent;
        if (cc.isValid(oldParent)) {
            if (changeBrotherZOrder) {
                let children = oldParent.children;
                let before = true;
                for (let index = 0; index < children.length; index++) {
                    let child = children[index];
                    if ((before && child.zIndex > node.zIndex) || !before) {
                        child.zIndex += node.zIndex + 1;
                    }
                    if (child == node) {
                        before = false;
                    }
                }
            }

            let oldPos = node.getPosition();
            let worldPos = oldParent.convertToWorldSpaceAR(oldPos);
            let newPos = newParent.convertToNodeSpaceAR(worldPos);
            node.removeFromParent(false);
            node.parent = newParent;
            node.position = newPos;

        }
        return oldParent;
    }

    /** 获取相对节点之间位置转换 */
    static nodeConvertToNodeSpaceAR(oldNode: cc.Node, newNode: cc.Node, oldNodePos = cc.Vec2.ZERO) {
        let finalPos = oldNode.convertToWorldSpaceAR(oldNodePos);
        finalPos = newNode.convertToNodeSpaceAR(finalPos);
        return finalPos;
    }

    //将颜色c3b十进制转为十六进制
    public static c3bToHex(rOrColor: number | cc.Color, g?: number, b?: number): string {
        let color: cc.Color = new cc.Color();
        if (typeof (rOrColor) == "number") {
            let color = new cc.Color(rOrColor, g, b);
            return color.toHEX("#rrggbb");
        } else {
            return rOrColor.toHEX("rrggbb")
        }
    }

    /**
     * 获取本地数据
     * @param key 键值
     * @param defaultValue 默认值，如果本地没有key，就返回defaultValue
     */
    public static getStorageItem(key:string , defaultValue: string): string;
    public static getStorageItem(key:string , defaultValue: number): number;
    public static getStorageItem(){
        let key = arguments[0];
        let defaultValue = arguments[1];
        let item = cc.sys.localStorage.getItem(key);
        if (item == null && defaultValue != null) {
            item = defaultValue;
        }

        return item;
    }

    /**
     * setItem的封装
     * @param key 
     * @param value 
     */
    public static setStorageItem(key: string , value: string): string;
    public static setStorageItem(key: string , value: number): number;
    public static setStorageItem(){
        let key = arguments[0];
        let value = arguments[1];
        cc.sys.localStorage.setItem(key , value);
        
        return value;
    }


    /****************** 数学类 *********************/
    /** 获取两点的角度 */
    public static getAngle(vec1: cc.Vec2 , vec2 :cc.Vec2){
        let rad = this.GetRadian(vec1 ,vec2);
        return 180 / Math.PI * rad;
    }

    /** 获取两点的弧度 */
    public static GetRadian(vec1: cc.Vec2 , vec2: cc.Vec2){
        let x = vec1.x - vec2.x;
        let y = vec2.y - vec1.y;
        
        let angle = Math.atan2(y , x);
        return angle;
    }

    /**
     * 返回两个线段的是否交叉 
     * @param A 
     * @param B 
     * @param C 
     * @param D 
     * @param retP out 返回A、B交叉点的比例
     */
    public static pLineIntersect(A: cc.Vec2, B :cc.Vec2, C: cc.Vec2, D: cc.Vec2, retP: cc.Vec2) {
        if ((A.x === B.x && A.y === B.y) || (C.x === D.x && C.y === D.y)) {
            return false;
        }
        var BAx = B.x - A.x;
        var BAy = B.y - A.y;
        var DCx = D.x - C.x;
        var DCy = D.y - C.y;
        var ACx = A.x - C.x;
        var ACy = A.y - C.y;
    
        var denom = DCy * BAx - DCx * BAy;
    
        retP.x = DCx * ACy - DCy * ACx;
        retP.y = BAx * ACy - BAy * ACx;
    
        if (denom === 0) {
            if (retP.x === 0 || retP.y === 0) {
                return true;
            }
            return false;
        }
    
        retP.x = retP.x / denom;
        retP.y = retP.y / denom;
    
        return true;
    };
}
