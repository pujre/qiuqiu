import DataManage from "./DataManage";
import EventCenter from "./EventCenter";
import { DataKey, EventHead } from "../Game/DataKey";
import AnalyticsManager, { EAnalyticsSDKType } from "../ThirdPlugin/Manager/AnalyticsManager";
const { ccclass, property } = cc._decorator;

@ccclass
export default class GameManage extends cc.Component {
    /**物理引擎当前是否开启*/
    physicsisOn:boolean=false;

    /**初始化时是否开启物理引擎 */
    @property()
    isPhysics:boolean=false;
    
    /**初始化时是否开启碰撞绘制 */
    @property()
    physicsDraw:boolean=false;

    @property(cc.Graphics)
    Graphics:cc.Graphics=null;
    @property(cc.Prefab)
    Graphics_2Prefab=null;
    @property()
    isOride:boolean=false;
    /**当前关卡获得的钥匙 */
    HarvestKey=0;
    

    private static instance;
    /**获取单例 */
    public static getIns(): GameManage {
        return GameManage.instance;
    }

    onLoad() {
        GameManage.instance = this;
        AnalyticsManager.getInstance().init(EAnalyticsSDKType.CoCos);
        //this.Graphics=cc.find('Graphics').getComponent(cc.Graphics);
        this.InputTest();
        this.StartData();
        if (this.isPhysics){
           this.SetPhysics(true);
            if(this.physicsDraw){
                cc.director.getPhysicsManager().debugDrawFlags=1;
            }
        }
    }

    /**设置物理系统的开启和关闭*/
    SetPhysics(isOn:boolean):boolean{
        cc.director.getPhysicsManager().enabled = isOn;
        cc.director.getCollisionManager().enabled = isOn;
        cc.director.getCollisionManager().enabledDrawBoundingBox = true;
        this.physicsisOn=isOn;
        return this.physicsisOn;
    }

    /**初始化玩家数据 */
    StartData(){
        if(DataManage.getIns().GetItemData('UefOneDataKey')==null){
            DataManage.getIns().SetItemData('UefOneDataKey',1);

            DataManage.getIns().SetItemData(DataKey.Level,1); //玩家默认等级为1
            DataManage.getIns().SetItemData(DataKey.Coin,10);//默认金币为10
            DataManage.getIns().SetSkill(0,0,true);//默认皮肤
            DataManage.getIns().SetSkill(9,1,true);//默认皮肤
            DataManage.getIns().SetItemData(DataKey.SigininNumber,0);  /**累计登录天数 */
            DataManage.getIns().SetProp(1,100); /**游戏道具 */
            DataManage.getIns().SetItemData(DataKey.UnLockLevel+'1',1);//默认解锁第一关
        }
    }

    start() {
        //AnalyticsManager.getInstance().login(EAnalyticsEvent.Start);
        //AnalyticsManager.getInstance().login(EAnalyticsEvent.Success);
    }

    /**
     * 测试按键
     */
    InputTest() {
        if (cc.sys.platform != cc.sys.VIVO_GAME && cc.sys.platform != cc.sys.OPPO_GAME) {
            cc.systemEvent.on(cc.SystemEvent.EventType.KEY_DOWN, (event) => {
                switch (event.keyCode) {
                    case cc.macro.KEY.r:
                        console.log('开始游戏');
                        break
                    case cc.macro.KEY.u:
                        console.log('清空所有已存储的数据');
                        cc.sys.localStorage.clear();
                        break;
                    case cc.macro.KEY.m:
                        console.log('');
                        break;
                    case cc.macro.KEY.a:
                        break;
                    case cc.macro.KEY.d:
                        break;
                    case cc.macro.KEY.f:
                        EventCenter.getInst().fire(EventHead.PlayerSkillUpdate,'xiao');
                        EventCenter.getInst().fire(EventHead.ArmsSkillUpdate,'xiao');
                        break;
                    case cc.macro.KEY.space:
                        console.log('');
                        break;
                    case cc.macro.KEY.z:
                        break;
                    case cc.macro.KEY.p:
                        if (cc.game.isPaused()) {
                            cc.game.resume();
                            console.log('恢复游戏');
                        } else {
                            cc.game.pause();
                            console.log('暂停游戏');
                        }
                        break
                    case cc.macro.KEY["="]:
                        console.log('增加金币100');
                        DataManage.getIns().SetCoin(100);
                        break;
                }
            }, this);
        }
    }

}

