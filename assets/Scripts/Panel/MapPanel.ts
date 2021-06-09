import PureHelper from "../Common/Helper/PureHelper";
import PureAdManage from "../Manage/PureAdManage";

const {ccclass, property} = cc._decorator;

@ccclass
export default class MapPanel extends cc.Component {

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
    }

    /**按钮点击事件 */
    OnClick(enevt: cc.Event.EventTouch, customEventData: string) {
        switch (enevt.target.name) {
            case 'Close':
                this.node.active=false;
                this.scheduleOnce(()=>{ PureAdManage.getIns().ShowInters(); },PureHelper.Range(1,5)*0.1)
                break;
            case '':
                break;
            case '':
                break;
            case '':
                break;
            case '':
                break;
        }
    }

    start () {

    }

    // update (dt) {}
}
