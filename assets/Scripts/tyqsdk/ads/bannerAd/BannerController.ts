import SdkTools, { Game_Platform } from "../../tools/SdkTools"
import BannerOppo from "./BannerOppo"
import BannerVivo from "./BannerVivo"
import BannerTest from "./BannerTest";
import NativeController from "../nativeAd/NativeController";
import NativeOppo from "../nativeAd/NativeOppo";
import NativeVivo from "../nativeAd/NativeVivo";
import NavigateController from "../../navigate/NavigateController";
import BannerTiktok from "./BannerTiktok";
import BannerQQ from "./BannerQQ";
import CocosUI from "../../ui/CocosUI";
import BannerWX from "./BannerWX";
import NativeHW from "../nativeAd/NativeHW";
import BannerBL from "./BannerBL";

class BannerController {
    private static instance: BannerController

    /**
     * 系统BannerId
     */
    //public ID_BannerId = "2cc6af26a2fb4fe7ab40f81ed346d3de";//vivo
    //public ID_BannerId = "6325d6b238612d5f5a3a0be7bcaef199";//qq
    /**
     * 系统Banner开关
     */
    public SW_SystemBannerSwitch = true;

    /**
     * 系统banner优先开关
     */
    public SW_SystemBannerFirst = true;

    /**
     * 系统banner是否加载成功
     */
    public isLoadSystemeBanner = false;

    /**
     * banner刷新时间 
     */
    public NUM_BannerUpdateTime = 30;

    /**
     * banner最大展示次数
    */
    public NUM_BannerMostShowTimes = 10000;

    /**
     * 原生banner开关
    */
    public SW_NativeBannerSwitch = true;

    /**
     * 刷新广告条的计时器
    */
    public bannerUpdateInterval: any = null;

    /**
     * banner关闭的次数
    */
    private bannerCloseTime = 0;

    /**
     * 是否加载完Banner
     */
    private isLoadBanner = false;

    /**
     * 查询banner加载定时器
     */
    private loadBannerCheck = null;

    /**
     * 是否已经调用showBanner
     */
    public hasShowBanner: boolean = false;

    /**
     * 是否已经调用测试showBanner
     */
    public testBannerShow: boolean = false;

    /**
     * 是否加载完成原生banner的所有资源
     */
    public isLoadNativeBanner: boolean = false;

    /**
    * BannerController 单例
    */
    public static getInstance(): BannerController {
        if (!BannerController.instance) {
            BannerController.instance = new BannerController()
        }
        return BannerController.instance
    }


    /**
     * 创建系统Banner
     */
    public createSystemBanner() {
        if (!this.SW_SystemBannerSwitch) {
            console.log("TYQSDK", "系统Banner开关关闭");
            return;
        }
        switch (SdkTools.getPlatform()) {
            case Game_Platform.GP_Oppo:
                BannerOppo.getInstance().createSystemBanner('350397');
                break;
            case Game_Platform.GP_Vivo:
                //BannerVivo.getInstance().createSystemBanner(this.ID_BannerId);
                BannerVivo.getInstance().createSystemBanner("2cc6af26a2fb4fe7ab40f81ed346d3de");
                break;
            case Game_Platform.GP_Tiktok:
                BannerTiktok.getInstance().createSystemBanner('8h9f9732722dia01o4');
                break;
            case Game_Platform.GP_QQ:
                //BannerQQ.getInstance().createSystemBanner(this.ID_BannerId);
                BannerQQ.getInstance().createSystemBanner("6325d6b238612d5f5a3a0be7bcaef199");
                break;
            case Game_Platform.GP_WX:
                //BannerWX.getInstance().createSystemBanner(this.ID_BannerId);
                break;
            case Game_Platform.GP_BL:
                BannerBL.getInstance().createSystemBanner();
                break;
            default:
                break;
        }

    }


    /**
     * 获取系统Banner是否加载成功
     */
    public getSystemBannerFlag(): boolean {
        return this.isLoadSystemeBanner;
    }

    checkLoadSucc() {
        console.log("TYQSDK", "查询banner是否加载完成.");
        this.isLoadNativeBanner = (NativeController.getInstance().getIconNativeFlag() || NativeController.getInstance().getImageNativeFlag()) && CocosUI.getInstance().isLoadNativeBannerUI;
        if (SdkTools.getPlatform() == Game_Platform.GP_HW) this.isLoadNativeBanner = CocosUI.getInstance().isLoadNativeBannerUI;
        if (this.loadBannerCheck) {
            clearTimeout(this.loadBannerCheck);
        }
        if (this.SW_SystemBannerSwitch && this.SW_NativeBannerSwitch && (this.getSystemBannerFlag() || this.isLoadNativeBanner)) {
            this.isLoadBanner = true;
            this.showBanner();
        } else if (this.SW_SystemBannerSwitch && !this.SW_NativeBannerSwitch && this.getSystemBannerFlag()) {
            this.isLoadBanner = true;
            this.showBanner();
        } else if (!this.SW_SystemBannerSwitch && this.SW_NativeBannerSwitch && this.isLoadNativeBanner) {
            this.isLoadBanner = true;
            this.showBanner();
        } else {
            console.log("TYQSDK", "banner未加载完成");
            this.loadBannerCheck =
                setTimeout(() => {
                    this.checkLoadSucc();
                }, 5 * 1000)
        }
    }

    /**
     * 展示banner
     */
    public showBanner() {
        if (SdkTools.getPlatform() == Game_Platform.GP_Test) {
            if (NavigateController.getInstance().isNavigateSettleShow) {
                console.log("TYQSDK", "测试结算互推正在展示,请先关闭再showBanner");
                return;
            }
            this.testBannerShow = true;
            BannerTest.getInstance().showBanner();
            return;
        }
        if (SdkTools.getPlatform() == Game_Platform.GP_Android) {
            jsb.reflection.callStaticMethod("com/asc/sdk/ndk/AndroidNDKHelper", "ReceiveCppMessage", "(Ljava/lang/String;)V", `{"calling_method_name":"showBanner","calling_method_params":0}`);
            return;
        }
        if (SdkTools.getPlatform() == Game_Platform.GP_IOS) {
            //jsb.reflection.callStaticMethod("DJADManagerVC", "showBanner");
            return;
        }
        if (!this.isLoadBanner) {
            this.checkLoadSucc();
            return;
        }
        if (this.NUM_BannerMostShowTimes <= this.bannerCloseTime) {
            if (this.bannerUpdateInterval) {
                clearInterval(this.bannerUpdateInterval);
            };
            console.log("TYQSDK", "banner展示次数(最大关闭次数)已达上限 return");
            return;
        }
        switch (SdkTools.getPlatform()) {
            case Game_Platform.GP_Oppo:
            case Game_Platform.GP_Vivo:
                if (NavigateController.getInstance().isNavigateSettleShow) {
                    console.log("TYQSDK", "结算互推正在展示,请先关闭再showBanner");
                    return;
                }
                this.hasShowBanner = true;
                if (this.SW_SystemBannerSwitch && this.SW_NativeBannerSwitch) {//两个开关都打开的情况
                    this.isLoadNativeBanner = (NativeController.getInstance().getIconNativeFlag() || NativeController.getInstance().getImageNativeFlag()) && CocosUI.getInstance().isLoadNativeBannerUI;
                    if (this.SW_SystemBannerFirst)//系统Banner优先
                    {
                        console.log("TYQSDK", "系统banner优先");
                        if (this.getSystemBannerFlag()) {
                            console.log("TYQSDK", "系统Banner可以展示");
                            this.showSystemBanner();
                        }
                        else {
                            console.log("TYQSDK", "系统Banner没有加载完成");
                            if (this.isLoadNativeBanner) {
                                console.log("TYQSDK", "改为展示原生Banner");
                                this.showNativeBanner();
                            } else {
                                console.log("TYQSDK", "原生banner也没有加载完成");
                            }
                        }
                    }
                    else {
                        console.log("TYQSDK", "原生banner优先");
                        if (this.isLoadNativeBanner) {
                            console.log("TYQSDK", "原生Banner可以展示");
                            this.showNativeBanner();
                        }
                        else {
                            console.log("TYQSDK", "原生Banner没有加载完成");
                            if (this.getSystemBannerFlag()) {
                                console.log("TYQSDK", "改为展示系统banner");
                                this.showSystemBanner();
                            } else {
                                console.log("TYQSDK", "系统banner也没有加载完成");
                            }
                        }
                    }
                }
                else if (this.SW_SystemBannerSwitch)//只打开了系统banner开关的情况
                {
                    console.log("TYQSDK", "只打开了系统Banner");
                    this.showSystemBanner();
                }
                else if (this.SW_NativeBannerSwitch)//只打开了原生banner的情况
                {
                    console.log("TYQSDK", "只打开了原生Banner");
                    this.showNativeBanner();
                }
                else //两个banner开关都没有打开
                {
                    console.log("TYQSDK", "系统banner开关和原生banner开关都没有打开");
                    return;
                }
                // 刷新Banner
                this.updateBanner();
                break;
            case Game_Platform.GP_Tiktok:
                {
                    if (this.SW_SystemBannerSwitch) {
                        this.showSystemBanner();
                        this.updateBanner();
                    }
                    break;
                }
            case Game_Platform.GP_QQ:
                {
                    if (this.SW_SystemBannerSwitch) {
                        this.showSystemBanner();
                        this.updateBanner();
                    }
                }
                break;
            case Game_Platform.GP_WX:
                {
                    if (this.SW_SystemBannerSwitch) {
                        this.showSystemBanner();
                        this.updateBanner();
                    }
                }
                break;
            case Game_Platform.GP_HW:
                {
                    if (this.SW_NativeBannerSwitch) {
                        this.showNativeBanner();
                        this.updateBanner();
                    }
                }
                break;
            case Game_Platform.GP_BL:
                {
                    if (this.SW_SystemBannerSwitch) {
                        this.showSystemBanner();
                        this.updateBanner();
                    }
                }
                break;
            default:
                break;
        }
    }


    /**
     * 展示系统Banner
    */
    public showSystemBanner() {
        switch (SdkTools.getPlatform()) {
            case Game_Platform.GP_Oppo:
                BannerOppo.getInstance().showSystemBanner();
                break;
            case Game_Platform.GP_Vivo:
                BannerVivo.getInstance().showSystemBanner();
                break;
            case Game_Platform.GP_Tiktok:
                BannerTiktok.getInstance().showSystemBanner();
                break;
            case Game_Platform.GP_QQ:
                BannerQQ.getInstance().showSystemBanner();
                break;
            case Game_Platform.GP_WX:
                BannerWX.getInstance().showSystemBanner();
                break;
            case Game_Platform.GP_BL:
                BannerBL.getInstance().showSystemBanner();
                break;
            default:
                break;
        }
    }


    /**
     * 刷新banner
     */
    public updateBanner() {
        if (this.NUM_BannerMostShowTimes <= this.bannerCloseTime) {
            if (this.bannerUpdateInterval) {
                clearInterval(this.bannerUpdateInterval);
            };
            console.log("TYQSDK", "banner展示次数(最大关闭次数)已达上限 return");
            return;
        }
        switch (SdkTools.getPlatform()) {
            case Game_Platform.GP_Oppo:
            case Game_Platform.GP_Vivo:
                if (this.bannerUpdateInterval) {
                    clearInterval(this.bannerUpdateInterval);
                };
                // 刷新广告条
                this.bannerUpdateInterval = setInterval(() => {
                    if (this.NUM_BannerMostShowTimes <= this.bannerCloseTime) {
                        if (this.bannerUpdateInterval) {
                            clearInterval(this.bannerUpdateInterval);
                        };
                        console.log("TYQSDK", "banner展示次数(最大关闭次数)已达上限 return");
                        return;
                    }
                    if (this.SW_SystemBannerSwitch && this.SW_NativeBannerSwitch) {//两个开关都打开的情况
                        if (this.SW_SystemBannerFirst)//系统Banner优先
                        {
                            console.log("TYQSDK", "系统banner优先");
                            if (this.getSystemBannerFlag()) {
                                console.log("TYQSDK", "刷新系统Banner");
                                CocosUI.getInstance().hideNativeBannerUI();
                                this.updateSystemBanner();
                            }
                            else {
                                console.log("TYQSDK", "系统Banner没有加载完成");
                                if (NativeController.getInstance().getIconNativeFlag() || NativeController.getInstance().getImageNativeFlag()) {
                                    console.log("TYQSDK", "改为刷新原生Banner");
                                    if (BannerOppo.getInstance().bannerAd) {
                                        BannerOppo.getInstance().hideSystemBanner();
                                    }
                                    if (BannerVivo.getInstance().bannerAd) {
                                        BannerVivo.getInstance().hideSystemBanner();
                                    }
                                    this.updateNativeBanner();
                                }
                            }
                        }
                        else {
                            console.log("TYQSDK", "原生banner优先");
                            if (NativeController.getInstance().getIconNativeFlag() || NativeController.getInstance().getImageNativeFlag()) {
                                console.log("TYQSDK", "刷新原生Banner");
                                if (BannerOppo.getInstance().bannerAd) {
                                    BannerOppo.getInstance().hideSystemBanner();
                                }
                                if (BannerVivo.getInstance().bannerAd) {
                                    BannerVivo.getInstance().hideSystemBanner();
                                }
                                this.updateNativeBanner();
                            }
                            else {
                                console.log("TYQSDK", "原生Banner没有加载到");
                                if (this.getSystemBannerFlag()) {
                                    console.log("TYQSDK", "改为刷新系统banner");
                                    CocosUI.getInstance().hideNativeBannerUI();
                                    this.updateSystemBanner();
                                }
                            }
                        }
                    }
                    else if (this.SW_SystemBannerSwitch)//只打开了系统banner开关的情况
                    {
                        console.log("TYQSDK", "只打开了系统Banner");
                        this.updateSystemBanner();
                    }
                    else if (this.SW_NativeBannerSwitch)//只打开了原生banner的情况
                    {
                        console.log("TYQSDK", "只打开了原生Banner");
                        this.updateNativeBanner();
                    }
                    else //两个banner都没有打开
                    {
                        console.log("TYQSDK", "系统banner开关和原生banner开关都没有打开");
                    }
                }, this.NUM_BannerUpdateTime * 1000);
                break;
            case Game_Platform.GP_Tiktok:
                if (this.SW_SystemBannerSwitch) {
                    this.updateSystemBanner();
                }
                break;
            case Game_Platform.GP_QQ:
                if (this.SW_SystemBannerSwitch) {
                    this.updateSystemBanner();
                }
                break;
            case Game_Platform.GP_WX:
                if (this.SW_SystemBannerSwitch) {
                    this.updateSystemBanner();
                }
                break;
            case Game_Platform.GP_HW:
                if (this.bannerUpdateInterval) {
                    clearInterval(this.bannerUpdateInterval);
                };
                // 刷新广告条
                this.bannerUpdateInterval = setInterval(() => {
                    if (this.NUM_BannerMostShowTimes <= this.bannerCloseTime) {
                        if (this.bannerUpdateInterval) {
                            clearInterval(this.bannerUpdateInterval);
                        };
                        console.log("TYQSDK", "banner展示次数(最大关闭次数)已达上限 return");
                        return;
                    }
                    if (this.SW_NativeBannerSwitch) {
                        this.updateNativeBanner();
                    }
                }, this.NUM_BannerUpdateTime * 1000);
                break;
            case Game_Platform.GP_BL:
                if (this.SW_SystemBannerSwitch) {
                    this.updateSystemBanner();
                }
                break;
            default:
                break;
        }
    }


    /**
     * 刷新系统banner
    */
    public updateSystemBanner() {
        switch (SdkTools.getPlatform()) {
            case Game_Platform.GP_Oppo:
                BannerOppo.getInstance().updateSytemBanner();
                break;
            case Game_Platform.GP_Vivo:
                BannerVivo.getInstance().updateSytemBanner();
                break;
            case Game_Platform.GP_Tiktok:
                BannerTiktok.getInstance().updateSytemBanner();
                break;
            case Game_Platform.GP_QQ:
                BannerQQ.getInstance().updateSytemBanner();
                break;
            case Game_Platform.GP_WX:
                BannerWX.getInstance().updateSytemBanner();
                break;
            case Game_Platform.GP_BL:
                BannerBL.getInstance().updateSytemBanner();
                break;
            default:
                break;
        }

    }


    /**
     * 刷新原生banner
     */
    public updateNativeBanner() {
        switch (SdkTools.getPlatform()) {
            case Game_Platform.GP_Oppo:
                NativeOppo.getInstance().updateNativeBanner();
                break;
            case Game_Platform.GP_Vivo:
                NativeVivo.getInstance().updateNativeBanner();
                break;
            case Game_Platform.GP_HW:
                NativeHW.getInstance().updateNativeBanner();
                break;
            default:
                break;
        }
    }

    /**
     * 隐藏Banner
     */
    public hideBanner() {
        if (SdkTools.getPlatform() == Game_Platform.GP_Test) {
            this.testBannerShow = false;
            BannerTest.getInstance().hideBanner();
            return;
        }
        if (SdkTools.getPlatform() == Game_Platform.GP_Android) {
            jsb.reflection.callStaticMethod("com/asc/sdk/ndk/AndroidNDKHelper", "ReceiveCppMessage", "(Ljava/lang/String;)V", `{"calling_method_name":"hideBanner",'calling_method_params':0}`);
            return;
        }
        if (SdkTools.getPlatform() == Game_Platform.GP_IOS) {
            //jsb.reflection.callStaticMethod("DJADManagerVC", "hideBanner");
            return;
        }
        if (this.loadBannerCheck) {
            clearTimeout(this.loadBannerCheck);
        }
        switch (SdkTools.getPlatform()) {
            case Game_Platform.GP_Oppo:
                this.hasShowBanner = false;
                // 存在则清除 banner刷新定时器
                if (this.bannerUpdateInterval) {
                    clearInterval(this.bannerUpdateInterval);
                    this.bannerUpdateInterval = null;
                }
                BannerOppo.getInstance().hideSystemBanner();
                NativeOppo.getInstance().hideNativeBaner();
                break;
            case Game_Platform.GP_Vivo:
                // 存在则清除 banner刷新定时器
                if (this.bannerUpdateInterval) {
                    clearInterval(this.bannerUpdateInterval);
                    this.bannerUpdateInterval = null;
                }
                BannerVivo.getInstance().hideSystemBanner();
                NativeVivo.getInstance().hideNativeBaner();
                break;
            case Game_Platform.GP_Tiktok:
                BannerTiktok.getInstance().hideSystemBanner();
                break;
            case Game_Platform.GP_QQ:
                BannerQQ.getInstance().hideSystemBanner();
                break;
            case Game_Platform.GP_WX:
                BannerWX.getInstance().hideSystemBanner();
                break;
            case Game_Platform.GP_HW:
                // 存在则清除 banner刷新定时器
                if (this.bannerUpdateInterval) {
                    clearInterval(this.bannerUpdateInterval);
                    this.bannerUpdateInterval = null;
                }
                NativeHW.getInstance().hideNativeBaner();
                break;
            case Game_Platform.GP_BL:
                BannerBL.getInstance().hideSystemBanner();
                break;
            default:
                break;
        }
    }

    /**
     * 展示原生Banner广告
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
     * Banner广告关闭统计
    */
    public bannerClose() {
        this.bannerCloseTime++;
        // var date = new Date();
        // var day = String(date.getFullYear()) + String(date.getDay() + 'banner');
        // SdkTools.saveData(day, String(this.bannerCloseTime));
    }

}

export default BannerController