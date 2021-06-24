import MiniGameSDK from "../ThirdPlugin/MiniGameSDK";
import DataManage from "./DataManage";
import { DataKey } from "../Game/DataKey";
import UIManage from "./UIManage";
import TYQAd from "../tyqsdk/TYQAd";

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
        //this.ADicon()
        this.InterAndDeskTop();
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
        
        //#region   
        
        // let nativeAdInfo = TYQAd.getInstance().getNativeInfo();

        // // 1、判断是否正常获取自定义原生广告
        // if (nativeAdInfo != null && typeof nativeAdInfo.adId != "undefined" && nativeAdInfo.adId != null) {

        //     // 2、如果运营要求使用原生大图的样式则判断是否拉取到原生大图,因为原生广告是广告主投放的,会存在拉取不到某些参数的情况
        //     if (nativeAdInfo.Native_BigImage == null) {
        //         console.log("该原生广告中不存在大图 return");
        //         return;
        //     }
        //     PureAdManage.getIns().HideBanner();
        //     // 3、加载nativeAdInfo中的图片
        //     // 我这边cocos封装了一个加载图片数组方法 用cc.loader.load循环加载
        //     let resUrlArray = [];
        //     resUrlArray[0] = nativeAdInfo.Native_BigImage; //大图
        //     resUrlArray[1] = nativeAdInfo.NativeAdTip; //广告角标
        //     resUrlArray[2] = nativeAdInfo.NativeClose; //关闭按钮
        //     // 如果运营要求外部还要有一个查看广告按钮之类的样式,则找美术人员做一个按钮样式
        //     resUrlArray[3] = "https://tencentcnd.minigame.xplaymobile.com/Other/SDK/SDKImage4/Native/NativeBannerButton.png"; //关闭按钮

        //     cc.loader.loadResArray(resUrlArray, (err, texture) => {
        //         let scene = cc.director.getScene();

        //         // 3、使用--按要求调整好图片位置和大小并上报原生广告展示
        //         // 上报原生广告展示
        //         TYQAd.getInstance().reportNative(nativeAdInfo.adId);

        //         // 大图节点
        //         let image = new cc.Node("image");
        //         // 将其放在某个节点下,这里直接放在场景节点下,与Canvas同级, 该图锚点默认为中点,左下角为(0,0)
        //         scene.addChild(image);
        //         image.addComponent(cc.Sprite);
        //         image.getComponent(cc.Sprite).spriteFrame = new cc.SpriteFrame(texture[0]); //资源索引与上面数组索引对应
        //         image.addComponent(cc.Widget);
        //         image.getComponent(cc.Widget).isAlignHorizontalCenter = true;
        //         image.getComponent(cc.Widget).isAlignBottom = true;
        //         image.getComponent(cc.Widget).bottom = 0;//这样大图会贴近铺满场景底部
        //         image.width = cc.winSize.width;
        //         image.height = image.width / 2; //建议大小默认2:1

        //         // 广告角标
        //         let adTip = new cc.Node("adTip");
        //         image.addChild(adTip);
        //         adTip.addComponent(cc.Sprite);
        //         adTip.getComponent(cc.Sprite).spriteFrame = new cc.SpriteFrame(texture[1]);
        //         // 广告角标位置贴近左上
        //         adTip.addComponent(cc.Widget);
        //         adTip.getComponent(cc.Widget).isAlignLeft = true;
        //         adTip.getComponent(cc.Widget).left = 0;
        //         adTip.getComponent(cc.Widget).isAlignTop = true;
        //         adTip.getComponent(cc.Widget).top = 0;
        //         adTip.width = image.width / 5;
        //         adTip.height = adTip.width / 70 * 34; //设置广告角标大小

        //         // 关闭按钮
        //         let close = new cc.Node("close");
        //         image.addChild(close);
        //         close.addComponent(cc.Sprite);
        //         close.getComponent(cc.Sprite).spriteFrame = new cc.SpriteFrame(texture[2]);
        //         // 关闭按钮位置贴近右上
        //         close.addComponent(cc.Widget);
        //         close.getComponent(cc.Widget).isAlignRight = true;
        //         close.getComponent(cc.Widget).right = 0;
        //         close.getComponent(cc.Widget).isAlignTop = true;
        //         close.getComponent(cc.Widget).top = 0;
        //         close.width = 50;
        //         close.height = 50; //设置关闭按钮大小

        //         // 查看广告按钮
        //         let button = new cc.Node("button");
        //         image.addChild(button);
        //         button.addComponent(cc.Sprite);
        //         button.getComponent(cc.Sprite).spriteFrame = new cc.SpriteFrame(texture[3]);
        //         button.width = 300;
        //         button.height = 200; //设置查看广告按钮大小
        //         button.y = cc.winSize.height / 2 - image.height / 2; //这里我随意设置了他的位置在屏幕中间
        //         image.setSiblingIndex(100);
        //         // 4、监听--使用的大图和查看广告按钮需要监听触摸事件,触摸事件回调必须上报原生广告点击
        //         image.on(cc.Node.EventType.TOUCH_START, () => {
        //             // 上报原生广告点击
        //             TYQAd.getInstance().nativeClick(nativeAdInfo.adId);
        //         })
        //         button.on(cc.Node.EventType.TOUCH_START, () => {
        //             // 上报原生广告点击
        //             TYQAd.getInstance().nativeClick(nativeAdInfo.adId);
        //         })

        //         // 5、关闭按钮
        //         close.on(cc.Node.EventType.TOUCH_START, (event) => {
        //             // 销毁大图节点
        //             image.removeFromParent();
        //             // 防止触摸冒泡
        //             event.stopPropagation();
        //             PureAdManage.getIns().ShowBanner();
                    
        //         })
        //     })

        // }
        // else { // 不正常,打印日志查看
        //     console.log("nativeAdInfo:", JSON.stringify(nativeAdInfo))
        // }
        //#endregion
    }

    

    // update (dt) {}
}
