import DataManage from "./DataManage";
import PureHelper from "../Common/Helper/PureHelper";
import {  DataKey } from "../Game/DataKey";

const {ccclass, property} = cc._decorator;

/**
 * 奖励/任务/签到
 */
@ccclass
export default class TaskManage extends cc.Component {
    private static instance;

    /**获取单例 */
    public static getIns(): TaskManage {
        return TaskManage.instance;
    }
    
    onLoad () {
        TaskManage.instance=this;
    }

    start(){
        
    }

    /**获取今日是否已签到 */
    GetIsSiginin():boolean{
        var isOn:boolean=false;
        if (DataManage.getIns().GetItemData(DataKey.SigininTimeKey)==PureHelper.getNowDate(false)){
            isOn=true;
        }
        return isOn;
    }

    /**设置今日为已签到 */
    SetIsSiginin(){
        if (!this.GetIsSiginin()){
            DataManage.getIns().SetItemData(DataKey.SigininTimeKey,PureHelper.getNowDate(false));
            DataManage.getIns().SetItemData(DataKey.SigininNumber,this.GetSingininNumber()+1);
        }
    }

    /**获取当前累计已签到天数 */
    GetSingininNumber():number{
        var singinnum=DataManage.getIns().GetItemDataNum(DataKey.SigininNumber);
        return singinnum==null?0:singinnum;
    }


     /**
     * 获取某个任务类型当前任务的值
     * @param type 
     */
    GetTypeValue(type: number): number {
        var data=DataManage.getIns().GetItemData(DataKey.TaskType+'_'+type);
        return data==null?0:Number(data);
    }

    /**设置某个任务类型的当前进度值 */
    SetTypeValue(type: number,Valeu:number){
        DataManage.getIns().SetItemData(DataKey.TaskType+'_'+type,this.GetTypeValue(type)+Valeu);
    }

    /**
     * 获取某个类型的奖励是否已经领取
     * @param type 任务类型 
     * @param IsDaily 是否为每日任务
     */
    GetReward(type: number,IsDaily:boolean=false): boolean {
        var key= IsDaily?(PureHelper.getNowDate(false) +'_'+ type):(type+ '_')
        return DataManage.getIns().GetItemData(DataKey.TaskreWard +key) == null ? false : true;
    }

    /**
     * 设置某个类型的奖励为已领取
     * @param type 任务类型 
     * @param IsDaily 是否为每日任务
     * =
     */
    SetReward(type: number,IsDaily:boolean=false,){
        var key= IsDaily?(PureHelper.getNowDate(false) +'_'+ type):(type+ '_')
        DataManage.getIns().SetItemData(DataKey.TaskreWard +key, 1);
    }
}

