import EventCenter from "./EventCenter";
import { DataKey, EventHead } from "../Game/DataKey";

const {ccclass, property} = cc._decorator;

@ccclass
/**数据管理 */
export default class DataManage extends cc.Component {
    private static instance;
    /**获取单例 */
    public static getIns(): DataManage {
        return DataManage.instance;
    }

    onLoad () {
        DataManage.instance=this;
    }

    
    /**获取指定id的道具数量 */
    GetProp(propId:number):number{
        var f=this.GetItemData(DataKey.Prop+propId.toString());
        return f==null?null:Number(f);
    }
    

    /**
     * 设置指定id的道具数量
     * @param propId 
     * @param num 
     */
    SetProp(propId: number, num: number) {
        var f = this.GetProp(propId);
        f = f != null ? f += num : num;
        this.SetItemData(DataKey.Prop + propId.toString(), f);
        EventCenter.getInst().fire(EventHead.UpDateProp, f);
    }

    /**是否拥有指定id的皮肤 */
    GetSkill(SkillId:number):boolean{
        return DataManage.getIns().GetItemData(DataKey.SkillId+SkillId)==null?false:true;
    }

    /**
     * 解锁指定的皮肤
     * @param SkillId 皮肤id
     * @param playerId 角色id
     * @param isOn 是否使用
     */
    SetSkill(SkillId:number,playerId:number=0,isOn=false){
        DataManage.getIns().SetItemData(DataKey.SkillId+SkillId,1);
        if(isOn){
            DataManage.getIns().SetItemData(DataKey.NowSkillId+playerId.toString(),SkillId);
        }
    }

    /**获取当前使用的皮肤id */
    GetNowSkillId(id:number=0):number{
        return DataManage.getIns().GetItemDataNum(DataKey.NowSkillId+id.toString());
    }

    /**设置当前使用的皮肤id */
    SetNowSkillId(id:number=0,SkillId:number){
        DataManage.getIns().SetItemData(DataKey.NowSkillId+id.toString(),SkillId);
    }



    /**获取当前金币数量 */
    GetCoin(): number {
        return Number((this.GetItemData(DataKey.Coin)));
    }


    SetisDesktop(){
        DataManage.getIns().SetItemData(DataKey.addDeskTopIsOn,1);
    }


    GetisDesktop():boolean{
        return DataManage.getIns().GetItemData(DataKey.addDeskTopIsOn)==null?false:true;
    }


    /**
     * 加上或者减去金币的数量 
     * @param num 正数为加负数为减
     */
    SetCoin(num: number): number {
        var Coin: number = this.GetCoin();
        Coin = Coin != null ? Coin += num : num;
        this.SetItemData(DataKey.Coin, Coin);
        EventCenter.getInst().fire(EventHead.UpDateCoin, Coin);
        return Coin;
    }

    /**
     * 查询本地持久化数据并转为number类型
     * @param key 
     */
    GetItemDataNum(key: any):number{
        var f=this.GetItemData(key);
        return f==null?null:Number(f);
    }
    /**
     * 查询本地持久化数据
     * @param key 
     */
    GetItemData(key: any): any {
        var data = cc.sys.localStorage.getItem(key);
        return data == undefined || data == '' || data == null ? null : data;
    }

    /**
     * 设置本地持久化数据
     * @param key 
     * @param value 
     */
    SetItemData(key: any, value: any) {
        cc.sys.localStorage.setItem(key, value);
    }


    /**获取已解锁的最高关卡 */
    GetHightLevel():number{
        var level=1;
        for (let i = 1; i < 100; i++) {
            const element = this.GetItemDataNum(DataKey.UnLockLevel+i.toString());
            if(element!=null){
                level=i;
            }else{
                break;
            }
        }
        return level;
    }

    /**获取指定关卡是否解锁 */
    GetLevelisLock(level:number):boolean{
        return this.GetItemDataNum(DataKey.UnLockLevel+level)==null?false:true;
    }
    /**设置指定关卡为解锁 */
    SetLevelLock(level:number){
        cc.log(level,'设置解锁');
        this.SetItemData(DataKey.UnLockLevel+level,1);
    }

    
}
