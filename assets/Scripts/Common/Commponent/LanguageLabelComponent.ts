import ConfigManger from "../Manager/ConfigManager";


const { ccclass, property, requireComponent, menu } = cc._decorator;

@ccclass
@menu("自定义/语言配置文本")
export default class LanguageLabelComponent extends cc.Component {

    @property
    localizationId: number = -1;


    // LIFE-CYCLE CALLBACKS:

    onLoad () {
        let label:cc.Label |cc.RichText = this.getComponent(cc.Label);
        if(!label){
            label = this.getComponent(cc.RichText);
        }
        if(label){
            label.string = ConfigManger.xlangStr(this.localizationId);
        }
          
    }



    // update (dt) {},
}
