import SdkTools, { Game_Platform } from "../../tools/SdkTools"
import NativeOppo from "./NativeOppo";
import CocosUI from "../../ui/CocosUI"
import NativeTest from "./NativeTest"
import NativeVivo from "./NativeVivo";
import NativeWX from "./NativeWX";
import NativeHW from "./NativeHW";

class NativeController {
    private static instance: NativeController
    //public ID_NativeID = "";
    public SW_NativeMainSwitch = true;   //原生总开关

    /**
     * 原生插屏上报次数
     */
    public NUM_NativeIntersReportFrequency = 1;

    /**
     * 原生广告刷新时间
    */
    public NUM_NativeUpdateTime = 120;

    /**
     * 原生ICON正在展示中
    */
    public onNativeIconShow = false;

    /**
     * 原生大图正在展示中
     */
    public onNativeImageShow = false;

    /**
     * 上个版本的Icon尺寸
    */
    private oldNativeIconSize = null;

    /**
     * 原生ICON刷新定时器
     */
    private nativeIconUpdate = null;

    /**
     * 原生大图刷新定时器
     */
    private nativeImageUpdate = null;

    /**
     * 原生广告展示信息
     */
    public nativeAdShowInfo = ["", ""];

    /**
    * NativeController 单例
    */
    public static getInstance(): NativeController {
        if (!NativeController.instance) {
            NativeController.instance = new NativeController()
        }
        return NativeController.instance
    }

    /**
     * 创建原生广告
     */
    public createNativeAd() {
        if (!this.SW_NativeMainSwitch) {
            console.log("TYQSDK", "原生广告总开关没有开启");
            return;
        }

        switch (SdkTools.getPlatform()) {
            case Game_Platform.GP_Oppo:
                CocosUI.getInstance().loadNativeInstersRes();
                CocosUI.getInstance().loadNativeBannerRes();
                CocosUI.getInstance().loadNativeIconRes();
                NativeOppo.getInstance().createNativeAd("350399");
                break;
            case Game_Platform.GP_Vivo:
                CocosUI.getInstance().loadNativeInstersRes();
                CocosUI.getInstance().loadNativeBannerRes();
                CocosUI.getInstance().loadNativeIconRes();
                NativeVivo.getInstance().createNativeAd("c27fdbd67d014341886b53935b493d8a");
                break;
            case Game_Platform.GP_WX:
                NativeWX.getInstance().createNativeAd('');
                return;
            case Game_Platform.GP_HW:
                CocosUI.getInstance().loadNativeInstersRes();
                CocosUI.getInstance().loadNativeBannerRes();
                // NativeHW.getInstance().createNativeAd(this.ID_NativeID);
                break;
            default:
                break;
        }
        this.updateNativeAd();
    }

    /**
     * 是否加载到原生1:1图片
     */
    public getIconNativeFlag(): boolean {
        switch (SdkTools.getPlatform()) {
            case Game_Platform.GP_Oppo:
                return NativeOppo.getInstance().getIconNativeFlag();
            case Game_Platform.GP_Vivo:
                return NativeVivo.getInstance().getIconNativeFlag();
            case Game_Platform.GP_Test:
                return true;
            case Game_Platform.GP_Android:
                return jsb.reflection.callStaticMethod("com/asc/sdk/ndk/AndroidNDKHelper", "SendMessageGetAdFlag", "(Ljava/lang/String;)Z", "getIconNativeFlag");
            case Game_Platform.GP_WX:
                return NativeWX.getInstance().getIconNativeFlag();
            default:
                return false;
        }
    }

    /**
     * 是否加载到原生2:1大图
     */
    public getImageNativeFlag(): boolean {
        switch (SdkTools.getPlatform()) {
            case Game_Platform.GP_Oppo:
                return NativeOppo.getInstance().getImageNativeFlag();
            case Game_Platform.GP_Vivo:
                return NativeVivo.getInstance().getImageNativeFlag();
            case Game_Platform.GP_HW:
                return NativeHW.getInstance().getImageNativeFlag();
            case Game_Platform.GP_Android:
            case Game_Platform.GP_Test:
                return true;
            default:
                return false;
        }
    }

    /**
     * 展示原生Icon 
     */
    public showNativeIcon(width, height, x, y) {
        if (SdkTools.getPlatform() == Game_Platform.GP_Test) {
            NativeTest.getInstance().showNativeIcon(width, height, x, y);
            return;
        }
        if (SdkTools.getPlatform() == Game_Platform.GP_Android) {
            let winSize = cc.winSize;
            let size = width / winSize.width;
            let posX = (x - width / 2) / winSize.width;
            let posY = (winSize.height - (y + width / 2)) / winSize.height;
            jsb.reflection.callStaticMethod("com/asc/sdk/ndk/AndroidNDKHelper", "ReceiveCppMessage", "(Ljava/lang/String;)V",
                `{"calling_method_name":"showNativeIcon","calling_method_params":{"icon_size":${size},"viewX":${posX},"viewY":${posY}}}`);
            return;
        }
        if (!this.SW_NativeMainSwitch) {
            console.log("TYQSDK", "原生广告总开关没有开启");
            return;
        }
        if (!this.getIconNativeFlag()) {
            console.log("TYQSDK", "原生广告不存在ICON return");
            return;
        }
        if (this.onNativeIconShow) {
            console.log("TYQSDK", "原生ICON正在展示中,请勿多次showNativeIcon return");
            return;
        }
        this.onNativeIconShow = true;
        switch (SdkTools.getPlatform()) {
            case Game_Platform.GP_Oppo:
                NativeOppo.getInstance().showNativeIcon(width, height, x, y);
                break;
            case Game_Platform.GP_Vivo:
                NativeVivo.getInstance().showNativeIcon(width, height, x, y);
                break;
            case Game_Platform.GP_WX:
                NativeWX.getInstance().showNativeIcon(x, y);
                return;
            default:
                break;
        }
        this.oldNativeIconSize = {
            width: width,
            height: height,
            x: x,
            y: y
        }
        this.nativeIconUpdate =
            setTimeout(() => {
                console.log("TYQSDK", "原生ICON刷新======================");
                this.hideNativeIcon();
                this.showNativeIconAsOld();
            }, this.NUM_NativeUpdateTime * 1000);
    }
    /**
     * 隐藏原生ICON
     */
    public hideNativeIcon() {
        if (SdkTools.getPlatform() == Game_Platform.GP_Test) {
            NativeTest.getInstance().hideNativeIcon();
            return;
        }
        if (this.nativeIconUpdate) {
            clearTimeout(this.nativeIconUpdate);
        }
        this.onNativeIconShow = false;
        switch (SdkTools.getPlatform()) {
            case Game_Platform.GP_Oppo:
            case Game_Platform.GP_Vivo:
                CocosUI.getInstance().hideNativeIconUI()
                break;
            case Game_Platform.GP_Android:
                jsb.reflection.callStaticMethod("com/asc/sdk/ndk/AndroidNDKHelper", "ReceiveCppMessage", "(Ljava/lang/String;)V", `{"calling_method_name":"hideNativeIcon",'calling_method_params':0}`);
                return;
            case Game_Platform.GP_WX:
                NativeWX.getInstance().hideNativeIcon();
                return;
            default:
                break;
        }

    }

    /**
     * 以上次的参数展示原生Icon
     */
    public showNativeIconAsOld() {
        this.showNativeIcon(this.oldNativeIconSize.width, this.oldNativeIconSize.height, this.oldNativeIconSize.x, this.oldNativeIconSize.y)
    }


    /**
     * 展示原生大图
     */
    public showNativeImage(width, height, x, y) {
        if (SdkTools.getPlatform() == Game_Platform.GP_Test) {
            NativeTest.getInstance().showNativeImage(width, height, x, y);
            return;
        }
        if (SdkTools.getPlatform() == Game_Platform.GP_Android) {
            jsb.reflection.callStaticMethod("com/asc/sdk/ndk/AndroidNDKHelper", "showSettlePasterBanner", "()V");
            return;
        }
        if (!this.SW_NativeMainSwitch) {
            console.log("TYQSDK", "原生广告总开关没有开启");
            return;
        }
        if (!this.getImageNativeFlag()) {
            console.log("TYQSDK", "原生广告不存在大图 return");
            return;
        }
        if (this.onNativeImageShow) {
            console.log("TYQSDK", "原生大图正在展示中,请勿多次showNativeImage return");
            return;
        }
        this.onNativeImageShow = true;
        switch (SdkTools.getPlatform()) {
            case Game_Platform.GP_Oppo:
                NativeOppo.getInstance().showNativeImage(width, height, x, y);
                break;
            case Game_Platform.GP_Vivo:
                NativeVivo.getInstance().showNativeImage(width, height, x, y);
                break;
            default:
                break;
        }
        this.nativeImageUpdate =
            setTimeout(() => {
                console.log("TYQSDK", "原生大图刷新======================");
                this.hideNativeImage();
                this.showNativeImage(width, height, x, y);
            }, this.NUM_NativeUpdateTime * 1000);
    }
    /**
     * 隐藏原生大图
     */
    public hideNativeImage() {
        if (SdkTools.getPlatform() == Game_Platform.GP_Test) {
            NativeTest.getInstance().hideNativeImage();
            return;
        }
        if (SdkTools.getPlatform() == Game_Platform.GP_Android) {
            jsb.reflection.callStaticMethod("com/asc/sdk/ndk/AndroidNDKHelper", "hideSettlePasterBanner", "()V");
            return;
        }
        if (this.nativeImageUpdate) {
            clearTimeout(this.nativeImageUpdate);
        }
        this.onNativeImageShow = false;
        switch (SdkTools.getPlatform()) {
            case Game_Platform.GP_Oppo:
            case Game_Platform.GP_Vivo:
                CocosUI.getInstance().hideNativeImageUI()
                break;
            default:
                break;
        }
    }


    /**
     * 展示原生插屏
     */
    public showNativeInters() {
        switch (SdkTools.getPlatform()) {
            case Game_Platform.GP_Oppo:
                console.log("TYQSDK", "OPPO 暂不支持插屏");
                // NativeOppo.getInstance().showNativeInters(this.NUM_NativeIntersReportFrequency);
                break;
            case Game_Platform.GP_Vivo:
                NativeVivo.getInstance().showNativeInters(this.NUM_NativeIntersReportFrequency);
                break;
            case Game_Platform.GP_HW:
                NativeHW.getInstance().showNativeInters(this.NUM_NativeIntersReportFrequency);
                break;
            default:
                break;
        }
    }


    /**
     * 定时刷新原生广告
     */
    private updateNativeAd() {
        setInterval(() => {
            switch (SdkTools.getPlatform()) {
                case Game_Platform.GP_Oppo:
                    NativeOppo.getInstance().nativeUpdate();
                    break;
                case Game_Platform.GP_Vivo:
                    NativeVivo.getInstance().nativeUpdate();
                    break;
                // case Game_Platform.GP_HW:
                //     NativeHW.getInstance().nativeUpdate();
                //     break;
                default:
                    break;
            }
        }, this.NUM_NativeUpdateTime * 1000)
    }

    /**
     * 立刻刷新原生广告
     */
    private updateNativeAdNow(){
        switch (SdkTools.getPlatform()) {
            case Game_Platform.GP_Oppo:
                NativeOppo.getInstance().nativeUpdate();
                break;
            case Game_Platform.GP_Vivo:
                NativeVivo.getInstance().nativeUpdate();
                break;
            // case Game_Platform.GP_HW:
            //     NativeHW.getInstance().nativeUpdate();
            //     break;
            default:
                break;
        }
    }

    /**
     * 展示原生Banner
     */
    public showNativeBanner() {
        switch (SdkTools.getPlatform()) {
            case Game_Platform.GP_Oppo:
                NativeOppo.getInstance().showNativeBanner();
                break;
            case Game_Platform.GP_Vivo:
                NativeVivo.getInstance().showNativeBanner();
                break;
            case Game_Platform.GP_HW:
                NativeHW.getInstance().showNativeBanner();
                break;
            default:
                break;
        }
    }
    /**
     * 隐藏原生Banner
     */
    public hideNativeBanner() {
        switch (SdkTools.getPlatform()) {
            case Game_Platform.GP_Oppo:
                NativeOppo.getInstance().hideNativeBaner();
                break;
            case Game_Platform.GP_Vivo:
                NativeVivo.getInstance().hideNativeBaner();
                break;
            case Game_Platform.GP_HW:
                NativeHW.getInstance().hideNativeBaner();
                break;
            default:
                break;
        }
    }


    /**
     * 自由获取原生广告信息
     */
    public getNativeInfo() {
        switch (SdkTools.getPlatform()) {
            case Game_Platform.GP_Oppo:
                return NativeOppo.getInstance().getNativeInfo();
            case Game_Platform.GP_Vivo:
                return NativeVivo.getInstance().getNativeInfo();
            default:
                return {
                    adId: "88888888",
                    title: '测试标题',
                    desc: '测试详情',
                    Native_icon: "https://tencentcnd.minigame.xplaymobile.com/Other/SDK/SDKImage_3_0/TestRes/fakeNativeIcon.png",
                    Native_BigImage: "https://tencentcnd.minigame.xplaymobile.com/Other/SDK/SDKImage_3_0/TestRes/fakeNativeImage.png",
                    NativeAdTip: "https://tencentcnd.minigame.xplaymobile.com/Other/SDK/SDKImage_3_0/NativeIconRes/ICONAd.png",
                    NativeClose: "https://tencentcnd.minigame.xplaymobile.com/Other/SDK/SDKImage_3_0/NativeBannerRes/nativeBannerClose.png",
                };
        }
    }
    /**
     * 上报原生广告展示
     */
    public reportNativeShow(ID) {
        switch (SdkTools.getPlatform()) {
            case Game_Platform.GP_Oppo:
                NativeOppo.getInstance().reportNativeShow(ID);
                break;
            case Game_Platform.GP_Vivo:
                NativeVivo.getInstance().reportNativeShow(ID);
                break;
            case Game_Platform.GP_HW:
                NativeHW.getInstance().reportNativeShow(ID);
                break;
            default:
                break;
        }
    }
    /**
     * 上报原生广告点击
     */
    public reportNativeClick(ID) {
        switch (SdkTools.getPlatform()) {
            case Game_Platform.GP_Oppo:
                NativeOppo.getInstance().reportNativeClick(ID);
                break;
            case Game_Platform.GP_Vivo:
                NativeVivo.getInstance().reportNativeClick(ID);
                break;
            case Game_Platform.GP_HW:
                NativeHW.getInstance().reportNativeClick(ID);
                break;
            case Game_Platform.GP_Android:
                jsb.reflection.callStaticMethod("com/asc/sdk/ndk/AndroidNDKHelper", "onClickNativaAd", "()V");
                break;
            default:
                break;
        }
        this.updateNativeAdNow();
    }

    /**
     * 监听游戏进入前台(上报原生广告展示)
     */
    public onGameShow() {
        if (SdkTools.getPlatform() == Game_Platform.GP_HW) {
            hbs.onShow(() => {
                console.log("TYQSDK", "HW 游戏回到前台,是否有原生广告展示中:", this.nativeAdShowInfo[0] != "" || this.nativeAdShowInfo[1] != "");
                if (this.nativeAdShowInfo[0] != "") {
                    this.reportNativeShow(this.nativeAdShowInfo[0]);
                }
                if (this.nativeAdShowInfo[1] != "") {
                    this.reportNativeShow(this.nativeAdShowInfo[1]);
                }
            });
        }
    }


    /**
     * 展示原生广告
     */
    public showNativeAd(width, height, viewX, viewY) {
        switch (SdkTools.getPlatform()) {
            case Game_Platform.GP_Android:
                jsb.reflection.callStaticMethod("com/asc/sdk/ndk/AndroidNDKHelper", "ReceiveCppMessage", "(Ljava/lang/String;)V", `{"calling_method_name":"showNativeAd","calling_method_params":{"width":${width},"height":${height},"viewX":${viewX},"viewY":${viewY}}}`);
                break;
            default:
                break;
        }
    }

}

export default NativeController