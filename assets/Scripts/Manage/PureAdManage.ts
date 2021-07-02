import MiniGameSDK from "../ThirdPlugin/MiniGameSDK";
import DataManage from "./DataManage";
import { DataKey } from "../Game/DataKey";
import UIManage from "./UIManage";
import TYQAd from "../tyqsdk/TYQAd";
import SdkTools, { Game_Platform } from "../tyqsdk/tools/SdkTools";

/**广告管理脚本*/
const {ccclass, property} = cc._decorator;
@ccclass
export default class PureAdManage extends cc.Component {
    private static instance;
    @property()
    isBanner:boolean=false;

    
    /**获取单例 */
    public static getIns(): PureAdManage {
        return PureAdManage.instance;
    }

    

    onLoad () {
        PureAdManage.instance=this;
        
    }


    start() {
        console.log('初始化广告')
        TYQAd.getInstance().initAd((isOn) => {
            if (isOn && this.isBanner) {
                if (cc.sys.platform === cc.sys.VIVO_GAME || cc.sys.platform === cc.sys.OPPO_GAME) {
                    TYQAd.getInstance().showBanner();
                }
            }
        })
        switch (SdkTools.getPlatform()) {
            case Game_Platform.GP_Vivo:
                this.ADicon()
                break
        }
        this.InterAndDeskTop();
    }

    //展示积木广告
    ShowBlockad(){
        switch (SdkTools.getPlatform()) {
            case Game_Platform.GP_QQ:
                if(TYQAd.getInstance().getBlockFlag()){
                    TYQAd.getInstance().showBlock("landscape", 32, 32, 5);
                }
                break
        }
    }

    //隐藏积木广告
    HideBlockad() {
        switch (SdkTools.getPlatform()) {
            case Game_Platform.GP_QQ:
                TYQAd.getInstance().hideBlock();
                break
        }
    }

    ShareGame(){
        switch (SdkTools.getPlatform()) {
            case Game_Platform.GP_QQ:
                let share=qq.shareAppMessage({
                    title:'',
                    imageUrl:'',
                    query:'',
                    shareAppType:'',
                    entryDataHash:'',
                    success:function(){

                    },
                    fail:function(){

                    },
                    complete:function(){

                    }
                } )
                break
        }
    }

    Moregame(){
        this.ShowBox();
    }

    ShowBox(){
        switch (SdkTools.getPlatform()) {
            case Game_Platform.GP_QQ:
                if(TYQAd.getInstance().getBoxFlag()){
                    TYQAd.getInstance().showAppBox();
                }
                break
        }
    }
    

    ADicon(){
        TYQAd.getInstance().showNativeIcon(100,100,60,cc.winSize.height-(cc.winSize.height/3));
    }

    ShowBanner(){
        TYQAd.getInstance().showBanner();
    }

    HideBanner(){
        TYQAd.getInstance().hideBanner();
    }

    InterAndDeskTop(isOn=false){
        // if (cc.sys.platform === cc.sys.VIVO_GAME || cc.sys.platform === cc.sys.OPPO_GAME) {
        //     MiniGameSDK.getNetworkType((result) => {
        //         if (result) {
        //             //桌面快捷方式
        //             if (isOn&&DataManage.getIns().GetItemData(DataKey.addDeskTopIsOn) != 1) {
        //                 ASCAd.getInstance().getDeskTopFlag(
        //                     (res) => {
        //                         if (res == true) {
        //                             ASCAd.getInstance().addDeskTop((IsOn) => {
        //                                 if (IsOn == true) {
        //                                     DataManage.getIns().SetItemData(DataKey.addDeskTopIsOn, 1);
        //                                 }
        //                             })
        //                         }
        //                     }
        //                 )
        //             }
        //         }
        //         else {
        //             MiniGameSDK.showDialog('提示', '无网络，请退出游戏重启网络', () => {
        //                 MiniGameSDK.exitApplication();
        //             });
        //         }
        //     });
        // }
    }

    ShowVideo(callback:any=null){
        if(TYQAd.getInstance().getVideoFlag()){
            var t:cc.AudioSource[] = cc.find('Canvas').getComponentsInChildren(cc.AudioSource);
            var p:cc.AudioSource[]=[];
            //关闭背景音乐
            t.forEach((val, idx, array)=> {// val: 当前值  idx：当前index  array: Array
                if( val.volume==1){
                    val.volume=0;
                    p.push(val)
                }
            });
            TYQAd.getInstance().showVideo((isOn)=>{
                p.forEach((val, idx, array)=> {// val: 当前值  idx：当前index  array: Array
                    val.volume=1;
                });
                if (isOn){
                    if(callback)callback();
                }else{
                    UIManage.getIns().ShowTip('广告播放失败')
                }
            })
        }else{
            UIManage.getIns().ShowTip('暂无广告')
        }
    }

    //展示插屏
    ShowInters(callback:any=null){
        //return
        //#region 插屏广告
        if (TYQAd.getInstance().getIntersFlag()){
            TYQAd.getInstance().showInters();
        }
        //#endregion
    }

    

    // update (dt) {}
}
