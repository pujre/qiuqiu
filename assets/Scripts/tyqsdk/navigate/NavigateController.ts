import SdkTools, { Game_Platform } from "../tools/SdkTools"
import CocosUI from "../ui/CocosUI"
import NavigateTest from "./NavigateTest"
import BannerController from "../ads/bannerAd/BannerController";
import NavigateWX from "./NavigateWX";

class NavigateController {

    private static instance: NavigateController

    /**
     * 互推盒子开关
     */
    public SW_BoxSwitch: boolean = false;

    /**
     * 互推盒子横幅广告实例
     */
    public gameBannerAd: any = null;
    /**
     * 是否加载到互推盒子横幅广告
     */
    public isLoadNavigateBoxBanner: boolean = false;

    /**
     * 互推盒子九宫格广告实例
     */
    public gamePortalAd: any = null;
    /**
     * 是否加载到互推盒子九宫格广告
     */
    public isLoadNavigateBoxPortal: boolean = false;
    /**
     * 存储bannerController的是否展示banner变量
     */
    public hasShowBanner: boolean = false;

    /**
     * 互推ICON开关
     */
    public SW_NavigateIconSwitch: boolean = false;

    /**
     * 互推列表开关
     */
    public SW_NavigateGroupSwitch: boolean = false;

    /**
     * 结算互推开关
     */
    public SW_NavigateSettleSwitch: boolean = false;

    /**
     * 互推游戏列表
     */
    public navigateList: any = [];

    /**
     * 互推ICON是否正在展示
     */
    public isNavigateIconShow: boolean = false;

    /**
     * 互推列表是否正在展示
     */
    public isNavigateGroupShow: boolean = false;

    /**
     * 结算互推是否正在展示
     */
    public isNavigateSettleShow: boolean = false;


    /**
     * NavigateController 单例
     */
    public static getInstance(): NavigateController {
        if (!NavigateController.instance) {
            NavigateController.instance = new NavigateController()
        }
        return NavigateController.instance
    }


    /**
     * 创建互推ICON
     */
    public createNavigateIcon() {
        if (!this.SW_NavigateIconSwitch) {
            console.log("TYQSDK", "互推ICON开关未开启")
            return;
        }
        CocosUI.getInstance().loadNavigateIconRes();
    }
    /**
     * 获取互推ICON是否可以展示标志
     */
    public getNavigateIconFlag() {
        switch (SdkTools.getPlatform()) {
            case Game_Platform.GP_Test:
            case Game_Platform.GP_Android:
            case Game_Platform.GP_IOS:
                return true;
            case Game_Platform.GP_Oppo:
            case Game_Platform.GP_WX:
                return CocosUI.getInstance().isLoadNavigateIcon && !this.isNavigateIconShow && CocosUI.getInstance().isLoadNavigateList;
            // return CocosUI.getInstance().isLoadNavigateIcon && CocosUI.getInstance().isLoadNavigateList;
            default:
                return false;
        }
    }
    /**
     * 展示互推ICON
     */
    public showNavigateIcon(width, height, x, y) {
        switch (SdkTools.getPlatform()) {
            case Game_Platform.GP_Test:
                NavigateTest.getInstance().showNavigateIcon(width, height, x, y);
                break;
            case Game_Platform.GP_Oppo:
            case Game_Platform.GP_WX:
                if (!this.SW_NavigateIconSwitch) {
                    console.log("TYQSDK", "互推ICON开关未开启");
                    return;
                }
                this.isNavigateIconShow = true;
                CocosUI.getInstance().showNavigateIcon(width, height, x, y);
                break;
            case Game_Platform.GP_Android:
                {
                    let winSize = cc.winSize;
                    let size = width / winSize.width;
                    let posX = (x - width / 2) / winSize.width;
                    let posY = (winSize.height - (y + width / 2)) / winSize.height;
                    jsb.reflection.callStaticMethod("com/asc/sdk/ndk/AndroidNDKHelper", "ReceiveCppMessage", "(Ljava/lang/String;)V", `{"calling_method_name":"showNavigateIcon","calling_method_params":{"icon_size":${size},"icon_x":${posX},"icon_y":${posY}}}`);
                }
                break;
            case Game_Platform.GP_IOS:
                {
                    let winSize = cc.winSize;
                    let size = width / winSize.width;
                    let posX = (x - width / 2) / winSize.width;
                    let posY = (winSize.height - (y + width / 2)) / winSize.height;
                    jsb.reflection.callStaticMethod("DJADManagerVC", "showNavigateIcon:withX:withY:", size.toString(), posX.toString(), posY.toString());
                }
                break;
                // NavigateWX.getInstance().showNavigateIcon(width, height, x, y);
                break;
            default:
                break;
        }
    }
    /**
     * 隐藏互推ICON
     */
    public hideNavigateIcon() {
        switch (SdkTools.getPlatform()) {
            case Game_Platform.GP_Test:
                NavigateTest.getInstance().hideNavigateIcon();
                return;
            case Game_Platform.GP_Oppo:
            case Game_Platform.GP_WX:
                this.isNavigateIconShow = false;
                CocosUI.getInstance().hideNavigateIcon();
                return;
            case Game_Platform.GP_Android:
                jsb.reflection.callStaticMethod("com/asc/sdk/ndk/AndroidNDKHelper", "ReceiveCppMessage", "(Ljava/lang/String;)V", `{"calling_method_name":"hideNavigateIcon",'calling_method_params':0}`);
                return;
            case Game_Platform.GP_IOS:
                jsb.reflection.callStaticMethod("DJADManagerVC", "hideNavigateIcon");
                return;
            // case Game_Platform.GP_WX:
            // NavigateWX.getInstance().hideNavigateIcon();
            // return;
        }
    }


    /**
     * 创建互推列表
     */
    public createNavigateGroup() {
        if (!this.SW_NavigateGroupSwitch) {
            console.log("TYQSDK", "互推列表开关未开启")
            return;
        }
        CocosUI.getInstance().loadNavigateGroup();
    }
    /**
     * 获取互推列表是否可以展示标志
     */
    public getNavigateGroupFlag() {
        switch (SdkTools.getPlatform()) {
            case Game_Platform.GP_Test:
            case Game_Platform.GP_Android:
            case Game_Platform.GP_IOS:
                return true;
            case Game_Platform.GP_Oppo:
            case Game_Platform.GP_WX:
                return CocosUI.getInstance().isLoadNavigateGroup && !this.isNavigateGroupShow && CocosUI.getInstance().isLoadNavigateList;
            default:
                return false;
        }
    }
    /**
     * 展示互推列表
     */
    public showNavigateGroup(type: string, side: string, size: number, y: number) {
        switch (SdkTools.getPlatform()) {
            case Game_Platform.GP_Test:
                NavigateTest.getInstance().showNavigateGroup(type, side, size, y);
                return;
            case Game_Platform.GP_Android:
                jsb.reflection.callStaticMethod("com/asc/sdk/ndk/AndroidNDKHelper", "ReceiveCppMessage", "(Ljava/lang/String;)V", `{"calling_method_name":"showNavigateGroup","calling_method_params":{"type":${type},"slide":${side}}}`);
                return;
            case Game_Platform.GP_IOS:
                jsb.reflection.callStaticMethod("DJADManagerVC", "showNavigateGroup:withSide:", type, side);
                return;
            case Game_Platform.GP_Oppo:
            case Game_Platform.GP_WX:
                if (!this.SW_NavigateGroupSwitch) {
                    console.log("TYQSDK", "互推列表开关未开启")
                    return;
                }
                this.isNavigateGroupShow = true;
                CocosUI.getInstance().showNavigateGroup(type, side, size, y);
                return;
            default:
                return;
        }
    }
    /**
     * 隐藏互推列表
     */
    public hideNavigateGroup() {
        switch (SdkTools.getPlatform()) {
            case Game_Platform.GP_Test:
                NavigateTest.getInstance().hideNavigateGroup();
                return;
            case Game_Platform.GP_Android:
                jsb.reflection.callStaticMethod("com/asc/sdk/ndk/AndroidNDKHelper", "ReceiveCppMessage", "(Ljava/lang/String;)V", `{"calling_method_name":"hideNavigateGroup",'calling_method_params':0}`);
                return;
            case Game_Platform.GP_IOS:
                jsb.reflection.callStaticMethod("DJADManagerVC", "hideNavigateGroup");
                return;
            case Game_Platform.GP_Oppo:
            case Game_Platform.GP_WX:
                this.isNavigateGroupShow = false;
                CocosUI.getInstance().hideNavigateGroup();
                return;
            default:
                return;
        }
    }



    /**
     * 创建结算互推
     */
    public createNavigateSettle() {
        if (!this.SW_NavigateSettleSwitch) {
            console.log("TYQSDK", "结算互推开关未开启")
            return;
        }
        CocosUI.getInstance().loadNavigateSettleRes();
    }
    /**
     * 获取结算互推是否可以展示标志
     */
    public getNavigateSettleFlag() {
        switch (SdkTools.getPlatform()) {
            case Game_Platform.GP_Test:
            case Game_Platform.GP_Android:
            case Game_Platform.GP_IOS:
                return true;
            case Game_Platform.GP_Oppo:
            case Game_Platform.GP_WX:
                return CocosUI.getInstance().isLoadNavigateSettle && !this.isNavigateSettleShow && CocosUI.getInstance().isLoadNavigateList;
            default:
                return false;
        }
    }
    /**
     * 展示结算互推
     */
    public showNavigateSettle(type: number, x: number, y: number) {
        switch (SdkTools.getPlatform()) {
            case Game_Platform.GP_Test:
                this.isNavigateSettleShow = true;
                NavigateTest.getInstance().showNavigateSettle(type, x, y);
                return;
            case Game_Platform.GP_Oppo:
            case Game_Platform.GP_WX:
                if (!this.SW_NavigateSettleSwitch) {
                    console.log("TYQSDK", "结算互推开关未开启")
                    return;
                }
                this.isNavigateSettleShow = true;
                CocosUI.getInstance().showNavigateSettle(type, x, y);
                return;
            case Game_Platform.GP_Android:
                {
                    let winSize = cc.winSize;
                    let posX = x / winSize.width;
                    let posY = (winSize.height - y) / winSize.height;
                    jsb.reflection.callStaticMethod("com/asc/sdk/ndk/AndroidNDKHelper", "ReceiveCppMessage", "(Ljava/lang/String;)V", `{"calling_method_name":"showNavigateSettle","calling_method_params":{"type":${type},"viewX":${posX},"viewY":${posY}}}`);
                }
                return;
            case Game_Platform.GP_IOS:
                let winSize = cc.winSize;
                let posX = x / winSize.width;
                let posY = (winSize.height - y) / winSize.height;
                jsb.reflection.callStaticMethod("DJADManagerVC", "showNavigateSettle:withX:withY:", type.toString(), posX.toString(), posY.toString());
                return;
            default:
                return;
        }
    }
    /**
     * 隐藏结算互推
     */
    public hideNavigateSettle() {
        this.isNavigateSettleShow = false;
        switch (SdkTools.getPlatform()) {
            case Game_Platform.GP_Test:
                NavigateTest.getInstance().hideNavigateSettle();
                return;
            case Game_Platform.GP_Android:
                jsb.reflection.callStaticMethod("com/asc/sdk/ndk/AndroidNDKHelper", "ReceiveCppMessage", "(Ljava/lang/String;)V", `{"calling_method_name":"hideNavigateSettle",'calling_method_params':0}`);
                return;
            case Game_Platform.GP_IOS:
                jsb.reflection.callStaticMethod("DJADManagerVC", "hideNavigateSettle");
                return;
            case Game_Platform.GP_Oppo:
            case Game_Platform.GP_WX:
                CocosUI.getInstance().hideNavigateSettle();
                return;
            default:
                return;
        }
    }


    /**
     * 加载互推list
    */
    public loadNavigateList() {
        if (!this.navigateList) {
            console.log("TYQSDK", "互推list加载出错")
            return;
        }
        CocosUI.getInstance().loadNavigateList();
    }


    /**
     * 创建互推盒子横幅广告
     */
    public createNavigateBoxBanner(ID) {

        if (!this.SW_BoxSwitch) {
            console.log("TYQSDK", "OPPO 互推盒子广告开关未开启");
            return;
        }

        if (qg.getSystemInfoSync().platformVersionCode < 1076) {
            console.log("TYQSDK", "OPPO 版本较低,不支持互推盒子广告");
            return;
        }

        console.log("TYQSDK", "OPPO 互推盒子横幅广告初始化", ID);

        // 创建互推盒子横幅广告
        this.gameBannerAd = qg.createGameBannerAd({
            adUnitId: ID
        })

        this.isLoadNavigateBoxBanner = true;

        let self = this;
        // 监听互推盒子横幅广告加载失败
        this.gameBannerAd.onError(function (err) {
            self.isLoadNavigateBoxBanner = false;
            console.log("TYQSDK", "OPPO 互推盒子横幅广告出错:", JSON.stringify(err));
        })

    }
    /**
     * 获取能否展示互推盒子横幅广告标志
     */
    public getNavigateBoxBannerFlag() {
        switch (SdkTools.getPlatform()) {
            case Game_Platform.GP_Test:
                return true;
            case Game_Platform.GP_Oppo:
                return this.isLoadNavigateBoxBanner;
            case Game_Platform.GP_WX:
                return NavigateWX.getInstance().isLoadNavigateBanner;
            default:
                return false;
        }
    }
    /**
     * 展示互推盒子横幅广告
     */
    public showNavigateBoxBanner() {
        if (SdkTools.getPlatform() == Game_Platform.GP_Test) {
            this.isNavigateSettleShow = true;
            NavigateTest.getInstance().showNavigateBoxBanner();
            return;
        }
        if (SdkTools.getPlatform() == Game_Platform.GP_WX) {
            this.isNavigateSettleShow = true;
            NavigateWX.getInstance().showNavigateBanner();
            return;
        }
        if (!this.SW_BoxSwitch) {
            console.log("TYQSDK", "OPPO 互推盒子广告开关未开启");
            return;
        }
        if (SdkTools.getPlatform() != Game_Platform.GP_Oppo) {
            console.log("TYQSDK", "非OPPO平台,不能展示互推盒子横幅广告");
            return;
        }
        if (!this.isLoadNavigateBoxBanner) {
            console.log("TYQSDK", "OPPO 互推盒子横幅广告未加载完成");
            return;
        }
        console.log("TYQSDK", "showNavigateBoxBanner=====================");

        this.isNavigateSettleShow = true;

        if (this.gameBannerAd) {
            BannerController.getInstance().hideBanner();
            this.gameBannerAd.show();
        } else {
            console.log("TYQSDK", "OPPO 不存在互推盒子横幅广告实例");
            return;
        }
    }
    /**
     * 隐藏互推盒子横幅广告
     */
    public hideNavigateBoxBanner() {
        this.isNavigateSettleShow = false;
        if (SdkTools.getPlatform() == Game_Platform.GP_Test) {
            NavigateTest.getInstance().hideNavigateBoxBanner();
            return;
        }
        if (SdkTools.getPlatform() == Game_Platform.GP_WX) {
            NavigateWX.getInstance().hideNavigateBanner();
            return;
        }
        if (this.gameBannerAd) {
            console.log("TYQSDK", "hideNavigateBoxBanner=====================");
            this.gameBannerAd.hide()
        } else {
            console.log("TYQSDK", "OPPO 不存在互推盒子横幅广告实例");
            return;
        }
    }


    /**
     * 创建互推盒子九宫格广告
     */
    public createNavigateBoxPortal(ID) {

        if (!this.SW_BoxSwitch) {
            console.log("TYQSDK", "OPPO 互推盒子广告开关未开启");
            return;
        }

        if (qg.getSystemInfoSync().platformVersionCode < 1076) {
            console.log("TYQSDK", "OPPO 版本较低,不支持互推盒子广告");
            return;
        }

        console.log("TYQSDK", "OPPO 互推盒子九宫格广告初始化", ID);

        // 创建互推盒子九宫格广告
        this.gamePortalAd = qg.createGamePortalAd({
            adUnitId: ID
        })

        let self = this;

        // 监听互推盒子九宫格广告加载成功
        this.gamePortalAd.onLoad(function () {
            console.log("TYQSDK", "OPPO 互推盒子九宫格广告加载完成");
            self.isLoadNavigateBoxPortal = true;
        })

        // 监听互推盒子九宫格广告加载失败
        this.gamePortalAd.onError(function (err) {
            console.log("TYQSDK", "OPPO 互推盒子九宫格广告出错:", JSON.stringify(err));
            self.isLoadNavigateBoxPortal = false;
            setTimeout(() => {
                self.gamePortalAd.load();
            }, 20 * 1000);
        })

        // 监听互推盒子九宫格广告关闭
        this.gamePortalAd.onClose(function () {
            console.log("TYQSDK", "OPPO 互推盒子九宫格广告关闭");
            self.gamePortalAd.load();
            self.hasShowBanner && BannerController.getInstance().showBanner();
        })

        this.gamePortalAd.load();
    }
    /**
     * 获取能否展示互推盒子九宫格广告标志
     */
    public getNavigateBoxPortalFlag() {
        switch (SdkTools.getPlatform()) {
            case Game_Platform.GP_Test:
                return true;
            case Game_Platform.GP_Oppo:
                return this.isLoadNavigateBoxPortal;
            case Game_Platform.GP_WX:
                return NavigateWX.getInstance().isLoadNavigatePortal;
            default:
                return false;
        }
    }
    /**
     * 展示互推盒子九宫格广告
     */
    public showNavigateBoxPortal() {
        if (SdkTools.getPlatform() == Game_Platform.GP_Test) {
            NavigateTest.getInstance().showNavigateBoxPortal();
            return;
        }
        if (SdkTools.getPlatform() == Game_Platform.GP_WX) {
            NavigateWX.getInstance().showNavigatePortal();
            return;
        }
        if (!this.SW_BoxSwitch) {
            console.log("TYQSDK", "OPPO 互推盒子广告开关未开启");
            return;
        }
        if (SdkTools.getPlatform() != Game_Platform.GP_Oppo) {
            console.log("TYQSDK", "非OPPO平台,不能展示互推盒子九宫格广告");
            return;
        }
        if (!this.isLoadNavigateBoxPortal) {
            console.log("TYQSDK", "OPPO 互推盒子九宫格广告未加载完成");
            return;
        }
        console.log("TYQSDK", "showNavigateBoxPortal=====================");

        if (this.gamePortalAd) {
            this.hasShowBanner = BannerController.getInstance().hasShowBanner;
            BannerController.getInstance().hideBanner();
            this.gamePortalAd.show();
        } else {
            console.log("TYQSDK", "OPPO 不存在互推盒子九宫格广告实例");
            return;
        }
    }

}
export default NavigateController  