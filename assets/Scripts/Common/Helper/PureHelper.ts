
const {ccclass, property} = cc._decorator;

/**
 ** 创建人: zt
 ** 日  期: 2020.1.6
 ** 版  本: 1.0
 ** 描  述: 静态函数
        通用辅助类：
        通用的静态方法扩充, 不涉及到引擎,
*/
@ccclass
export default class PureHelper {

    /**
     * 从给定的字符数组,max]里随机一个字符，
     * @param args 
     */
    static getRandomString(...args: any[]):string{
        return args[PureHelper.Range(0,args.length)];
    }

     /**
     * 产生随机整数，包括下限数字(lower)不包括上限数字(upper)
     * @param lower 下限数字
     * @param upper 上限数字
     */
    static Range(lower, upper): number {
        return Math.floor(Math.random() * (upper - lower)) + lower;
    }

    /**
     * 将当前值current移向目标target,maxDistanceDelta就是每次移动的最大距离。
     * @param current 当前值
     * @param target 目标值
     * @param maxDistanceDelta 每次移动的最大距离, 
     */
    static moveTowards(current: cc.Vec2 , target: cc.Vec2 , maxDistanceDelta: number):cc.Vec2{
        let toVector_x = target.x - current.x;
        let toVector_y = target.y - current.y;
        let sqdist = toVector_x * toVector_x + toVector_y * toVector_y;
        if (sqdist == 0 || (maxDistanceDelta >= 0 && sqdist <= maxDistanceDelta * maxDistanceDelta))
            return target;
        var dist = Math.sqrt(sqdist);
        return cc.v2(current.x + toVector_x / dist * maxDistanceDelta,
            current.y + toVector_y / dist * maxDistanceDelta);
    }

    /**返回 点a 和 点b 之间的距离。 */
    static Distance(a: cc.Vec2, b: cc.Vec2): number {
        var diff_x: number = a.x - b.x;
        var diff_y: number = a.y - b.y;
        return Math.sqrt(diff_x * diff_x + diff_y * diff_y);
    }
    
    /**返回两点连线的与x轴夹角 */
    static Angle_X(pos1:cc.Vec2,pos2:cc.Vec2):number{
        return (Math.atan2(pos2.y-pos1.y,pos2.x-pos1.x))*(180/Math.PI)
    }
    
    /**返回两点连线的与Y轴夹角 */
    static Angle_Y(pos1:cc.Vec2,pos2:cc.Vec2):number{
        return (Math.atan2(pos2.x-pos1.x,pos2.y-pos1.y))*(180/Math.PI)
    }

     /**
      * 根据点a与点b获得两点之间延长指定距离点 (a到b点延长线距离d的坐标）
      * @param a 点a
      * @param b 点b
      * @param d 距离d
      */
     public static getTailPosOuter(a:cc.Vec2,b:cc.Vec2,d:number):cc.Vec2{
        var r =Math.sqrt((a.x- b.x)*(a.x- b.x) +(a.y- b.y)*(a.y- b.y));
        return new cc.Vec2((d*(b.x-a.x))/r + b.x, (d*(b.y-a.y))/r + b.y);
    }

     /**
      * 根据点a与点b获得两点之间延长指定距离点 (a到b方向距离d（a点距离d的坐标））的坐标
      * @param a 点a
      * @param b 点b
      * @param d 距离d
      */
     public static getPosOuter(a:cc.Vec2,b:cc.Vec2,d:number):cc.Vec2{
        var r =Math.sqrt((a.x- b.x)*(a.x- b.x) +(a.y- b.y)*(a.y- b.y));
        return new cc.Vec2((d*(b.x-a.x))/r , (d*(b.y-a.y))/r);
    }


    /**
     * 获取当前本地时间
     * @param isOn 为true时包含时分秒，false则不包含
     */
    public static getNowDate(isOn: Boolean = true): string {
        const date = new Date();
        let month: string | number = date.getMonth() + 1;
        let strDate: string | number = date.getDate();
        if (month <= 9) {month = "0" + month;}
        if (strDate <= 9) {strDate = "0" + strDate;}
        if (isOn){
            return date.getFullYear() + "-" + month + "-" + strDate + " "
            + date.getHours() + ":" + date.getMinutes() + ":" + date.getSeconds();
        }else{
            return date.getFullYear() + "-" + month + "-" + strDate;
        }
    }

    /**
     * 时间格式转换为（xx:xx:xx或者xx小时xx分钟xx秒（true））
     * @param s 秒数
     * @param isOn 是否转换为格式xx小时xx分钟xx秒
     */
    public static ConTimeUnit(s: number, isOn: boolean = false): string
    {
        let hours = Math.round((s - 30 * 60) / (60 * 60));
        let minutes = Math.round((s - 30) / 60) % 60;
        let seconds = s % 60;
        if (isOn == false)
        {
            return (hours > 0 ? hours : "00") + (minutes > 0 ? (minutes >= 10 ? 
            (":" + minutes) : (":0" + minutes)) : ":00") + (seconds > 0 ? (seconds >= 10 ? ":" + seconds : ":0" + seconds) : ":00");
        } else{
            return (hours > 0 ? (hours + "小时") : "") + (minutes > 0 ? 
            (minutes + "分钟") : "") + (seconds > 0 ? (seconds + "秒") : "");
        }
    }

    /**
     * 设置或者获取基于时间的任务，(返回类型：null表示未进行过该任务，0则表示任务完成，否则返回任务完成剩余时间（秒数）)
     * @param ID 任务Id，string类型
     * @param time 任务时间
     */
    public static EventTimes(ID: string, time: number=undefined): number
    {
        var toke = Date.parse(new Date().toString());
        if (time == undefined)
        {
            var times=cc.sys.localStorage.getItem(ID);
            var datatime: number =times==null||times==''||times==undefined?null: Number(times);
            return datatime == null ? null :  datatime - toke <= 0 ? 0 : (datatime - toke) / 1000;//返回秒数
        } else{
            cc.sys.localStorage.setItem(ID,  toke + (time * 1000));
            return  toke + time;
        }
    }
    
}
