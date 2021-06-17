import DataManage from "../Manage/DataManage";
import PureHelper from "../Common/Helper/PureHelper";
import AnimManage from "../Manage/AnimManage";
import UIManage from "../Manage/UIManage";
import LevelMode from "../Game/LevelMode";
import PureAdManage from "../Manage/PureAdManage";

const {ccclass, property} = cc._decorator;

@ccclass
export default class StorePanel extends cc.Component {
    @property([cc.Material])
    C2dma:cc.Material[]=[];
    isSelection:boolean=false;
    @property(cc.Node)
    PlayerGou:cc.Node=null;
    @property(cc.Node)
    PlayerGou_2:cc.Node=null;
    Price:number=300;
    @property(cc.Label)
    PriceLabel:cc.Label=null;
    onLoad () {
        var Btns: cc.Button[] = this.node.getComponentsInChildren(cc.Button);
        for (let i = 0; i < Btns.length; i++) {
            var clickEventHandler = new cc.Component.EventHandler();
            clickEventHandler.target = this.node; // 这个 node 节点是你的事件处理代码组件所属的节点
            clickEventHandler.component = this.node.name;//这个脚本的名子（如果不能和该节点重名，则手动输入）
            clickEventHandler.handler = "OnClick";//这是注册得方法
            clickEventHandler.customEventData = Btns[i].node.name;
            Btns[i].clickEvents.push(clickEventHandler);
        }

        var ski = this.node.getChildByName('Node').getChildByName('skin').getChildByName('skin_014').children;
        var ski_2 = this.node.getChildByName('Node').getChildByName('skin').getChildByName('skin_015').children;
        for (let i = 0; i < ski.length; i++) {
            ski[i].on(cc.Node.EventType.TOUCH_START,()=>{
                if(DataManage.getIns().GetSkill(i)){
                    DataManage.getIns().SetNowSkillId(0,i);
                    this.UpdateUI();
                }else{
                   
                }
            },ski[i]);
        }
        for (let i = 0; i < ski_2.length; i++) {
            ski_2[i].on(cc.Node.EventType.TOUCH_START,()=>{
                if(DataManage.getIns().GetSkill(i+9)){
                    DataManage.getIns().SetNowSkillId(1,i+9);
                    this.UpdateUI();
                }else{
                   
                }
            },ski[i]);
        }
    }

    /**按钮点击事件 */
    OnClick(enevt: cc.Event.EventTouch, customEventData: string) {
        switch (enevt.target.name) {
            case 'Close':
                this.node.active=false;
                PureAdManage.getIns().ShowBanner();
                this.scheduleOnce(()=>{ PureAdManage.getIns().ShowInters(); },1)
        
                if(UIManage.GetGamePanel().LevelNode){
                    UIManage.GetGamePanel().LevelNode.getComponent(LevelMode).TranformSkill();
                }

                break;
            case 'skinSelection':
                if (!this.isSelection) {
                    if(DataManage.getIns().GetCoin()>=this.Price){
                        this.isSelection = true;
                        var CnodeArr:cc.Node[]=[];
                        var skill = this.node.getChildByName('Node').getChildByName('skin').getChildByName('skin_014').children;
                        for (let i = 0; i < skill.length; i++) {
                            if (!DataManage.getIns().GetSkill(i)) {
                                CnodeArr.push(skill[i]);
                            }
                        }
                        var Skill_2=this.node.getChildByName('Node').getChildByName('skin').getChildByName('skin_015').children;
                        for (let i = 0; i < Skill_2.length-1; i++) {
                            if (!DataManage.getIns().GetSkill(i+9)) {
                                CnodeArr.push(Skill_2[i]);
                            }
                        }
                        if(CnodeArr.length>0){
                            DataManage.getIns().SetCoin(-this.Price);
                            var ko:cc.Node=CnodeArr[PureHelper.Range(0,CnodeArr.length)];
                            DataManage.getIns().SetSkill(Number(ko.name),Number(ko.name)<9?0:1,true);
                            this.UpdateUI();
                            AnimManage.getIns().ScaleRebound(ko,1.3,0.85,()=>{
                                AnimManage.getIns().ScaleRebound(ko,1.2,0.85,()=>{
                                    ko.scale=1;
                                    this.isSelection = false;
                                })
                            })
                        }
                    }else{
                        UIManage.getIns().ShowTip('金币不足');
                    }
                }
                break;
            case 'skin_watch_videos':
                break;
            case '':
                break;
        }
    }

    /**更新商店UI */
    UpdateUI(){
        var skill  =this.node.getChildByName('Node').getChildByName('skin').getChildByName('skin_014').children;
        var Skill_2=this.node.getChildByName('Node').getChildByName('skin').getChildByName('skin_015').children;
        var index=0;
        let printnum=0;
        for (let i = 0; i < skill.length; i++) {
            var kio=DataManage.getIns().GetSkill(i)
            //cc.log (kio);
            if(kio){
                index++;
                if(i!=0){
                    printnum++;
                }
                skill[i].getComponent(cc.Button).enabled=true;
                skill[i].getComponent(cc.Sprite).setMaterial(0,this.C2dma[0])
            }
            else{
                skill[i].getComponent(cc.Button).enabled=false;
                skill[i].getComponent(cc.Sprite).setMaterial(0,this.C2dma[1])
            }
            
            if(DataManage.getIns().GetNowSkillId(0)==i){
                this.PlayerGou.setParent(skill[i]);
                this.PlayerGou.position=cc.v2(30,-15);
            }
        }
        //console.log('左：',DataManage.getIns().GetNowSkillId(0));
        for (let i = 0; i < Skill_2.length; i++) {
            var fuk=DataManage.getIns().GetSkill(i+9);
            //cc.log (fuk);
            if(fuk){
                index++;
                if(i!=0&&i!=9){
                    printnum++;
                }
                Skill_2[i].getComponent(cc.Button).enabled=true;
                Skill_2[i].getComponent(cc.Sprite).setMaterial(0,this.C2dma[0]);
            }
            else{
                Skill_2[i].getComponent(cc.Button).enabled=false;
                Skill_2[i].getComponent(cc.Sprite).setMaterial(0,this.C2dma[1]);
            }
            
            if(DataManage.getIns().GetNowSkillId(1)==i+9){
                this.PlayerGou_2.setParent(Skill_2[i]);
                this.PlayerGou_2.position=cc.v2(30,-15);
            }
        }
        console.log ('价格————',300,'    ',(printnum*200));
        this.Price=300+(printnum*200);
        this.PriceLabel.string=this.Price.toString();
        //console.log('右：',DataManage.getIns().GetNowSkillId(1));
        if(index==skill.length+Skill_2.length-1){
            this.node.getChildByName('Node').getChildByName('skin').getChildByName('skinSelection').active=false;//
            this.node.getChildByName('Node').getChildByName('skin').getChildByName('skin_watch_videos').position=cc.v2(14.5,-190);
        }
    }


    /**
     * 随机选择皮肤
     */
    RandomSelection(From:number,CnodeArr:[],times:number,index=0){
            From--
            index=index==CnodeArr.length-1?0:index++;
            if(From<=0){
                var ko:cc.Node=CnodeArr[index];
                DataManage.getIns().SetSkill(Number(ko.name));
                DataManage.getIns().SetNowSkillId(0,Number(ko.name))
                ko.getComponent(cc.Button).interactable=true;
                AnimManage.getIns().ScaleRebound(ko,1.5,1,()=>{
                    ko.scale=1;
                })
            }else{
                times+=PureHelper.Range(5,20)/100;
                this.scheduleOnce(()=>{this.RandomSelection(From-1,CnodeArr,times,index)},times);
            }
    }


    onEnable(){
        this.UpdateUI();
    }
    start () {

    }

    // update (dt) {}
}
