import SdkTools, { Game_Platform } from "../../tools/SdkTools"
import NativeController from "../nativeAd/NativeController"
import OtherFunctions from "../../tools/OtherFunctions"
import IntersTest from "./IntersTest"
import IntersVivo from "./IntersVivo"
import IntersTiktok from "./IntersTiktok"
import IntersQQ from "./IntersQQ"
import IntersWX from "./IntersWX"
import IntersXM from "./IntersXM"

class IntersController {
    private static instance: IntersController

    public ID_SystemIntersId: string = "e5076b3c3ec545408107620aefb95777";    //系统插屏ID

    /**
     * 系统插屏开关
     */
    public SW_SystemIntersSwitch: boolean = false;

    /**
     * 原生插屏开关
     */
    public SW_NativeIntersSwitch: boolean = true;

    /**
     * 插屏基本控制的开关
     */
    public SW_IntersBaseControlSwitch: boolean = false;

    /**
     * 原生插屏出现的概率
     */
    public NUM_NativeIntersPercent: number = 100;

    /**
     * 插屏间隔次数
     */
    public NUM_IntersIntervalNum: number = 0;

    /**
     * 插屏间隔最小时间
     */
    public NUM_IntersIntervalTime: number = 0;


    /**
     * 插屏延迟时间(ms)
     */
    public NUM_IntersDelayTime: number = 0.5;

    /**
     * 插屏延迟概率
     */
    public NUM_IntersDelayPercent: number = 45;

    /**
     * 插屏开始次数
     */
    public NUM_IntersStartNum: number = 0;

    /**
     * 调用展示插屏的次数
     */
    private intersShowTime: number = 0;

    /**
     * 插屏目前间隔的次数
     */
    private intersNowInterval: number = 0;

    /**
     * 插屏目前间隔的时间
     */
    public intersNowTime: number = 0;

    /**
     * IntersController 单例
     */
    public static getInstance(): IntersController {
        if (!IntersController.instance) {
            IntersController.instance = new IntersController()
        }
        return IntersController.instance
    }

    /**
     * 插屏变添加桌面次数
     */
    private deskTimes: number = 0;

    /**
     * 插屏间隔计时器
     */
    public runIntersInterval() {
        if (this.NUM_IntersIntervalTime > 0) {
            setInterval(() => {
                this.intersNowTime++;
            }, 1000);
        }
    }

    /** 
     * 获取插屏是否可以展示标志
     */
    public getIntersFlag() {
        switch (SdkTools.getPlatform()) {
            case Game_Platform.GP_Oppo:
                if (OtherFunctions.getInstance().SW_DesktopSwitch && OtherFunctions.getInstance().SW_IntersToDesktop
                    && OtherFunctions.getInstance().NUM_DeskAutoMostTimes != 0 && OtherFunctions.getInstance().NUM_IntersAddDesktopNumber != 0) {
                    return true;
                } else {
                    console.log("TYQSDK", "桌面开关未开启或次数未设置");
                    return false;
                }
            case Game_Platform.GP_Test:
                return true;
            case Game_Platform.GP_Android:
                return jsb.reflection.callStaticMethod("com/asc/sdk/ndk/AndroidNDKHelper", "SendMessageGetAdFlag", "(Ljava/lang/String;)Z", "getIntersFlag");
            case Game_Platform.GP_IOS:
                return jsb.reflection.callStaticMethod("DJADManagerVC", "getIntersFlag") == "1";
            default:
                if (!this.SW_SystemIntersSwitch && !this.SW_NativeIntersSwitch) {
                    console.log("TYQSDK", "插屏开关未开启");
                    return;
                }
                return this.getSystemIntersFlag() || NativeController.getInstance().getIconNativeFlag()
                    || NativeController.getInstance().getImageNativeFlag() || (OtherFunctions.getInstance().NUM_IntersAddDesktopNumber > 0)
                    || (SdkTools.getPlatform() == Game_Platform.GP_HW);
        }
    }

    /**
     * 创建系统插屏
     */
    public createSystemInters() {
        if (!this.SW_SystemIntersSwitch) {
            console.log("TYQSDK", "系统插屏开关未开启");
            return;
        }
        switch (SdkTools.getPlatform()) {
            case Game_Platform.GP_Oppo:
                console.log("TYQSDK", "OPPO 已关闭插屏广告");
                break;
            case Game_Platform.GP_Vivo:
                IntersVivo.getInstance().createSystemInters(this.ID_SystemIntersId);
                break;
            case Game_Platform.GP_Tiktok:
                IntersTiktok.getInstance().createSystemInters(this.ID_SystemIntersId);
                break;
            case Game_Platform.GP_QQ:
                IntersQQ.getInstance().createSystemInters(this.ID_SystemIntersId);
                break;
            case Game_Platform.GP_WX:
                IntersWX.getInstance().createSystemInters(this.ID_SystemIntersId);
                break;
            case Game_Platform.GP_XM:
                IntersXM.getInstance().createSystemInters(this.ID_SystemIntersId);
                break;
            default:
                break;
        }
    }

    /**
     * 获取系统插屏是否可以展示
     */
    public getSystemIntersFlag() {
        switch (SdkTools.getPlatform()) {
            case Game_Platform.GP_Vivo:
                return IntersVivo.getInstance().getSystemIntersFlag();
            case Game_Platform.GP_Tiktok:
                return IntersTiktok.getInstance().getSystemIntersFlag();
            case Game_Platform.GP_QQ:
                return IntersQQ.getInstance().getSystemIntersFlag();
            case Game_Platform.GP_WX:
                return IntersWX.getInstance().getSystemIntersFlag();
            case Game_Platform.GP_XM:
                return IntersXM.getInstance().getSystemIntersFlag();
            default:
                return false;
        }
    }


    /**
     * 展示插屏
     */
    public showInters() {
        switch (SdkTools.getPlatform()) {
            case Game_Platform.GP_Oppo:
                this.intersShowTime++;
                if (this.intersShowTime == OtherFunctions.getInstance().NUM_IntersAddDesktopNumber && this.deskTimes < OtherFunctions.getInstance().NUM_DeskAutoMostTimes) {
                    OtherFunctions.getInstance().getDeskTopFlag((suc) => {
                        if (suc) {
                            this.deskTimes++;
                            this.intersShowTime = 0;
                            console.log("TYQSDK", "插屏变添加桌面");
                            OtherFunctions.getInstance().addDeskTop((res) => { });
                        }
                    });
                } else {
                    console.log("TYQSDK", "插屏变添加桌面次数未达到或自动弹添加桌面次数已达上限或已成功添加桌面");
                }
                return;
            case Game_Platform.GP_Test:
                IntersTest.getInstance().showInters();
                return;
            case Game_Platform.GP_Android:
                jsb.reflection.callStaticMethod("com/asc/sdk/ndk/AndroidNDKHelper", "ReceiveCppMessage", "(Ljava/lang/String;)V", `{'calling_method_name':'showInters','calling_method_params':0}`);
                return;
            case Game_Platform.GP_IOS:
                jsb.reflection.callStaticMethod("DJADManagerVC", "showInters");
                return;
            default:
                if (!this.SW_SystemIntersSwitch && !this.SW_NativeIntersSwitch) {
                    console.log("TYQSDK", "插屏开关未开启");
                    return;
                }
        }

        var self = this;

        this.intersShowTime++;
        if (OtherFunctions.getInstance().SW_IntersToDesktop && this.intersShowTime <= OtherFunctions.getInstance().NUM_IntersAddDesktopNumber) {
            console.log("TYQSDK", "第" + OtherFunctions.getInstance().NUM_IntersAddDesktopNumber + "次插屏变添加桌面", "当前第" + this.intersShowTime + "个");
            if (this.intersShowTime == OtherFunctions.getInstance().NUM_IntersAddDesktopNumber) {
                OtherFunctions.getInstance().getDeskTopFlag((suc) => {
                    if (suc) {
                        console.log("TYQSDK", "插屏变添加桌面")
                        OtherFunctions.getInstance().addDeskTop((res) => { });
                    }
                });
                return;
            }
        }

        if (this.SW_IntersBaseControlSwitch) {
            if (this.intersShowTime < this.NUM_IntersStartNum) {
                console.log("TYQSDK", "插屏开始次数未达到", this.intersShowTime, "目标次数", this.NUM_IntersStartNum)
                return;
            }

            if (this.intersNowInterval < this.NUM_IntersIntervalNum) {
                console.log("TYQSDK", "插屏间隔次数未达到", this.intersNowInterval, "目标次数", this.NUM_IntersIntervalNum)
                this.intersNowInterval++;
                return;
            }

            if (this.intersNowTime < this.NUM_IntersIntervalTime) {
                console.log("TYQSDK", "插屏间隔时间未达到", this.intersNowTime, "目标时间", this.NUM_IntersIntervalTime);
                var self = this;
                if (OtherFunctions.getInstance().SW_DesktopSwitch && this.deskTimes < OtherFunctions.getInstance().NUM_DeskAutoMostTimes) {
                    OtherFunctions.getInstance().getDeskTopFlag(function (suc) {
                        if (suc) {
                            self.deskTimes++;
                            OtherFunctions.getInstance().addDeskTop(function () {
                                console.log("TYQSDK", "插屏间隔弹桌面")
                            });
                        }
                    });
                }
                return;
            }
        }

        this.intersNowInterval = 0;
        if (this.SW_SystemIntersSwitch && this.SW_NativeIntersSwitch) {//两个开关都打开的情况
            if (Math.floor(Math.random() * 100) >= this.NUM_NativeIntersPercent)//系统插屏优先
            {
                console.log("TYQSDK", "系统插屏优先");
                if (this.getSystemIntersFlag()) {
                    console.log("TYQSDK", "系统插屏可以展示");
                    this.showSystemInters();
                }
                else {
                    console.log("TYQSDK", "系统插屏没有加载完成");
                    if (NativeController.getInstance().getIconNativeFlag() || NativeController.getInstance().getImageNativeFlag()) {
                        console.log("TYQSDK", "改为展示原生插屏");
                        this.showNativeInters();
                    }
                }

            }
            else {
                console.log("TYQSDK", "原生插屏优先");
                if (NativeController.getInstance().getIconNativeFlag() || NativeController.getInstance().getImageNativeFlag()) {
                    console.log("TYQSDK", "原生插屏可以展示");
                    this.showNativeInters();
                }
                else {
                    console.log("TYQSDK", "原生插屏没有加载到");
                    if (this.getSystemIntersFlag()) {
                        console.log("TYQSDK", "改为展示系统插屏");
                        this.showSystemInters();
                    }
                }

            }
        }
        else if (this.SW_SystemIntersSwitch)//只打开了系统插屏开关的情况
        {
            console.log("TYQSDK", "只打开了系统插屏");
            this.showSystemInters();
        }
        else if (this.SW_NativeIntersSwitch)//只打开了原生插屏的情况
        {
            console.log("TYQSDK", "只打开了原生插屏");
            this.showNativeInters();
        }
        else //两个插屏都没有打开
        {
            console.log("TYQSDK", "系统插屏开关和原生插屏开关都没有打开");
        }

    }


    /**
     * showSystemInters 展示系统插屏
     */
    public showSystemInters() {
        //有插屏延迟的情况下延迟展示插屏
        if (this.NUM_IntersDelayTime > 0) {
            var random = Math.floor(Math.random() * 100);
            if (random < this.NUM_IntersDelayPercent) {
                console.log("TYQSDK", "插屏延迟时间(ms):" + this.NUM_IntersDelayTime);
                setTimeout(() => {
                    switch (SdkTools.getPlatform()) {
                        case Game_Platform.GP_Oppo:
                            console.log("TYQSDK", "OPPO 已关闭插屏广告");
                            break;
                        case Game_Platform.GP_Vivo:
                            IntersVivo.getInstance().showSystemInters();
                            break;
                        case Game_Platform.GP_Tiktok:
                            IntersTiktok.getInstance().showSystemInters();
                            break;
                        case Game_Platform.GP_QQ:
                            IntersQQ.getInstance().showSystemInters();
                            break;
                        case Game_Platform.GP_WX:
                            IntersWX.getInstance().showSystemInters();
                            break;
                        case Game_Platform.GP_XM:
                            IntersXM.getInstance().showSystemInters();
                            break;
                        default:
                            break;
                    }
                }, this.NUM_IntersDelayTime)
            } else {
                switch (SdkTools.getPlatform()) {
                    case Game_Platform.GP_Oppo:
                        console.log("TYQSDK", "OPPO 已关闭插屏广告");
                        break;
                    case Game_Platform.GP_Vivo:
                        IntersVivo.getInstance().showSystemInters();
                        break;
                    case Game_Platform.GP_Tiktok:
                        IntersTiktok.getInstance().showSystemInters();
                        break;
                    case Game_Platform.GP_QQ:
                        IntersQQ.getInstance().showSystemInters();
                        break;
                    case Game_Platform.GP_WX:
                        IntersWX.getInstance().showSystemInters();
                        break;
                    case Game_Platform.GP_XM:
                        IntersXM.getInstance().showSystemInters();
                        break;
                    default:
                        break;
                }
            }
        }
        else {
            switch (SdkTools.getPlatform()) {
                case Game_Platform.GP_Oppo:
                    console.log("TYQSDK", "OPPO 已关闭插屏广告");
                    break;
                case Game_Platform.GP_Vivo:
                    IntersVivo.getInstance().showSystemInters();
                    break;
                case Game_Platform.GP_Tiktok:
                    IntersTiktok.getInstance().showSystemInters();
                    break;
                case Game_Platform.GP_QQ:
                    IntersQQ.getInstance().showSystemInters();
                    break;
                case Game_Platform.GP_WX:
                    IntersWX.getInstance().showSystemInters();
                    break;
                case Game_Platform.GP_XM:
                    IntersXM.getInstance().showSystemInters();
                    break;
                default:
                    break;
            }
        }


    }


    /**
     * 展示原生插屏
    */
    public showNativeInters() {
        //有插屏延迟的情况下延迟展示插屏
        if (this.NUM_IntersDelayTime > 0) {
            var random = Math.floor(Math.random() * 100);
            if (random < this.NUM_IntersDelayPercent) {
                console.log("TYQSDK", "插屏延迟时间(ms):" + this.NUM_IntersDelayTime);
                setTimeout(() => {
                    NativeController.getInstance().showNativeInters();
                }, this.NUM_IntersDelayTime)
            } else {
                NativeController.getInstance().showNativeInters();
            }
        }
        else {
            NativeController.getInstance().showNativeInters();
        }
    }
}

export default IntersController