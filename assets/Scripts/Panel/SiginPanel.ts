
import TaskManage from "../Manage/TaskManage";
import PureAdManage from "../Manage/PureAdManage";
import DataManage from "../Manage/DataManage";
import UIManage from "../Manage/UIManage";
import SdkTools, { Game_Platform } from "../tyqsdk/tools/SdkTools";
const { ccclass, property } = cc._decorator;

@ccclass
export default class SiginPanel extends cc.Component {
    @property(cc.Node)
    LookAd:cc.Node=null;
    doe: cc.Node = null;
    Reward: number[] = [100, 0, 200, 300, 500, 500, 1000];//奖励货币的值为
    pos:cc.Vec2=cc.v2(0,0);
    onLoad() {
        this.pos= this.node.getChildByName('SiginBtn').position;
        this.doe = this.node.getChildByName('doe');
        var Btns: cc.Button[] = this.node.getComponentsInChildren(cc.Button);
        for (let i = 0; i < Btns.length; i++) {
            var clickEventHandler = new cc.Component.EventHandler();
            clickEventHandler.target = this.node; // 这个 node 节点是你的事件处理代码组件所属的节点
            clickEventHandler.component = this.node.name;//这个脚本的名子（如果不能和该节点重名，则手动输入）
            clickEventHandler.handler = "OnClick";//这是注册得方法
            clickEventHandler.customEventData = Btns[i].node.name;
            Btns[i].clickEvents.push(clickEventHandler);
            if(Btns[i].node.name=='LookAD'){
                let ojbk=SdkTools.getPlatform()==Game_Platform.GP_QQ;
                Btns[i].node.active=ojbk;
            }
        }
    }

    onEnable() {
        this.updateUI();
    }

    /**更新当前UI */
    updateUI() {
        var rh = this.doe.children;
        var singinNum = TaskManage.getIns().GetSingininNumber();//当前累计已签到天数
        if (singinNum == 1 && !TaskManage.getIns().GetIsSiginin()) {
            this.node.getChildByName('SinginDoubleBtn').active=false;
            this.node.getChildByName('SiginBtn').active = true;
            //this.node.getChildByName('SiginBtn').position=cc.v2(0,this.node.getChildByName('SiginBtn').position.y);
        }else{
            //this.node.getChildByName('SiginBtn').position=this.pos;
        }
        for (let i = 0; i < rh.length; i++) {
            if (i < singinNum) {
                rh[i].getChildByName('sign_in_checkboxes').active = true;
                rh[i].getChildByName('sign_in_signed in').active = true;
                if (i == 1) {
                    rh[i].getChildByName('ball').active = false;
                }
            } else if (i == singinNum) {
                rh[i].getChildByName('sign_in_checkboxes').active = true;
            } else {
                rh[i].getChildByName('sign_in_checkboxes').active = false;
                rh[i].getChildByName('sign_in_signed in').active = false;
            }
        }
        if (TaskManage.getIns().GetIsSiginin()) {
            this.node.getChildByName('SiginBtn').active = false;
            this.node.getChildByName('SinginDoubleBtn').active=false;
        }
        UIManage.GetGamePanel().SinginBall.active=!TaskManage.getIns().GetIsSiginin();
    }

    /**按钮点击事件 */
    OnClick(enevt: cc.Event.EventTouch, customEventData: string) {
        switch (enevt.target.name) {
            case 'CloseBtn':
                this.node.active = false;
                //if(UIManage.GetGamePanel().NowLevelId==5)PureAdManage.getIns().InterAndDeskTop(true);
                PureAdManage.getIns().ShowInters();
                break;
            case 'SinginDoubleBtn'://看视频签到双倍奖励
            case 'SiginBtn':
                var warns = this.Reward[TaskManage.getIns().GetSingininNumber()];
                var callback = () => {
                    if (warns != 0) {
                        var coins = warns * (enevt.target.name == 'SiginBtn' ? 1 : 3);
                        DataManage.getIns().SetCoin(coins);
                        UIManage.getIns().ShowTip('获得签到奖励：金币+' + coins.toString());
                    } else {
                        DataManage.getIns().SetSkill(17,1,true);
                        UIManage.getIns().ShowTip('获得签到奖励：绝版皮肤');
                    }
                    TaskManage.getIns().SetIsSiginin();
                    this.updateUI();
                }
                if (enevt.target.name == 'SiginBtn') {
                    callback();
                } else {
                    PureAdManage.getIns().ShowVideo(() => {
                        callback();
                    });
                }
                break;
            case 'LookAD':
                //console.log("点击查看原生广告按钮，待加入查看原生广告");
                //PureAdManage.getIns().ShowInters();
                PureAdManage.getIns().ShowPrimeval();
                break;
            case '':
                break;
        }
    }
}
