import MiniGameSDK from "../ThirdPlugin/MiniGameSDK";
import DataManage from "./DataManage";
import { DataKey } from "../Game/DataKey";
import UIManage from "./UIManage";
import TYQAd from "../tyqsdk/TYQAd";
import SdkTools, { Game_Platform } from "../tyqsdk/tools/SdkTools";
import CocosUI from "../tyqsdk/ui/CocosUI";
import IntersQQ from "../tyqsdk/ads/IntersAd/IntersQQ";
import IntersTiktok from "../tyqsdk/ads/IntersAd/IntersTiktok";
import NativeController from "../tyqsdk/ads/nativeAd/NativeController";

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
        TYQAd.getInstance().initAd(() => {
            if (this.isBanner) {
                TYQAd.getInstance().showBanner();
            }
        })
        switch (SdkTools.getPlatform()) {
            case Game_Platform.GP_Vivo:
            case Game_Platform.GP_Oppo:
                this.ADicon()
                break
        }
    }

    //展示积木广告
    ShowBlockad(){
        switch (SdkTools.getPlatform()) {
            case Game_Platform.GP_QQ:
                if(TYQAd.getInstance().getBlockFlag()){
                    TYQAd.getInstance().showBlock("landscape", 32, 32, 5);
                }
                break
            case Game_Platform.GP_Vivo:
                this.ADicon();
                break;
        }
    }

    showDit(callback:any){
        TYQAd.getInstance().addDeskTop(callback);
    }

    //隐藏积木广告
    HideBlockad() {
        switch (SdkTools.getPlatform()) {
            case Game_Platform.GP_QQ:
                TYQAd.getInstance().hideBlock();
                break
            case Game_Platform.GP_Vivo:
                TYQAd.getInstance().hideNativeIcon();
                break;

        }
    }

    ShareGame(){
        switch (SdkTools.getPlatform()) {
            case Game_Platform.GP_QQ:
                let share=qq.shareAppMessage({
                    title:'',
                    imageUrl:'https://h5-1258069360.cos.ap-guangzhou.myqcloud.com/Game/jswr/shaderImage/189d46f49a34cc6b10cc5a542867bd6.png',
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
        TYQAd.getInstance().showNativeIcon(120,120,120,cc.winSize.height-(cc.winSize.height/3));
    }

    ShowBanner(){
        TYQAd.getInstance().showBanner();
    }

    HideBanner(){
        TYQAd.getInstance().hideBanner();
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
        switch (SdkTools.getPlatform()) {
            case Game_Platform.GP_QQ:
                if(IntersQQ.getInstance().getSystemIntersFlag()){
                    IntersQQ.getInstance().showSystemInters();
                }
                break

            case Game_Platform.GP_Vivo:
                if (TYQAd.getInstance().getIntersFlag()){
                    TYQAd.getInstance().showInters();
                }else{
                    NativeController.getInstance().showNativeInters();
                }
                break
            case Game_Platform.GP_Oppo:
                //this.ShowPrimeval();
                break;
            case Game_Platform.GP_Tiktok:
                if (IntersTiktok.getInstance().getSystemIntersFlag()){
                    IntersTiktok.getInstance().showSystemInters();
                }
                break;
        }

    }

    ShowPrimeval(){
        console.log("TYQSDK", "点击原生ICON");
        CocosUI.getInstance().ShowPrimeval();
    }

    

    // update (dt) {}
}
