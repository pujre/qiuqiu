import CocosUI from "../../ui/CocosUI";
import NativeController from "./NativeController";

class NativeHW {

    private static instance: NativeHW

    /**
     * HW原生广告对象
     */
    public nativeAd: any = null;

    /**
     * HW原生广告资源
     */
    public nativeInfo: any = null;

    /**
     * 是否加载到原生1:1图片
    */
    public isLoadIconNative: boolean = false;

    /**
     * 是否加载到原生2:1大图
    */
    public isLoadImageNative: boolean = false;

    /**
     * 是否已创建华为原生广告
     */
    public hasCreateHWNative: boolean = false;

    /**
     * 上次拉取原生广告的时间间隔
     */
    public loadNativeIntervalTime: number = 0;
    /**
     * 拉取原生广告定时器
     */
    public loadNativeInterval: any = null;


    /**
     * NativeHW 单例
     */
    public static getInstance(): NativeHW {
        if (!NativeHW.instance) {
            NativeHW.instance = new NativeHW()
        }
        return NativeHW.instance
    }


    /**
    * 展示原生Banner
    */
    public showNativeBanner() {
        if (this.hasCreateHWNative) {
            this.reLoadNative();
            setTimeout(() => {
                this.nativeInfo = this.nativeInfo;
                CocosUI.getInstance().showNativeBannerUI(this.nativeInfo);
            }, 1500);
        } else {
            this.createNativeAd(NativeController.getInstance().ID_NativeID);
            setTimeout(() => {
                this.reLoadNative();
                setTimeout(() => {
                    this.nativeInfo = this.nativeInfo;
                    CocosUI.getInstance().showNativeBannerUI(this.nativeInfo);
                }, 1500);
            }, 300);
        }
    }

    /**
     * 刷新原生banner
     */
    public updateNativeBanner() {
        CocosUI.getInstance().hideNativeBannerUI();
        this.reLoadNative();
        setTimeout(() => {
            this.nativeInfo = this.nativeInfo;
            CocosUI.getInstance().showNativeBannerUI(this.nativeInfo);
        }, 1500);
    }

    /**
     * 隐藏原生Banner 
    */
    public hideNativeBaner() {
        CocosUI.getInstance().hideNativeBannerUI();
    }

    /**
     * 创建HW原生广告
     */
    public createNativeAd(ID) {

        console.log("TYQSDK", "HW 加载原生广告", ID);

        this.nativeAd = hbs.createNativeAd({
            adUnitId: ID
        })

        if (!this.hasCreateHWNative) {
            this.loadNativeIntervalTime = 30;
        }
        this.hasCreateHWNative = true;

        this.nativeInfo = {
            adId: null,
            title: '特别惊喜',
            desc: "",
            Native_icon: null,
            Native_BigImage: null
        };

        var self = this;

        this.nativeAd.onLoad(function (res) {

            console.log("TYQSDK", "HW 原生广告加载成功", JSON.stringify(res.adList[0]));

            self.loadNativeIntervalTime = 0;
            if (self.loadNativeInterval) {
                clearInterval(self.loadNativeInterval);
                self.loadNativeInterval = null;
            }
            self.loadNativeInterval =
                setInterval(() => {
                    self.loadNativeIntervalTime++;
                }, 1000)

            let ad = res.adList[0];

            self.nativeInfo.adId = String(ad.adId);
            if (ad.title != undefined && ad.title != "") self.nativeInfo.title = String(ad.title);
            if (ad.desc != undefined && ad.desc != "") self.nativeInfo.desc = String(ad.desc);

            if (ad && ad.imgUrlList != undefined && ad.imgUrlList.length > 0) {
                cc.loader.load(String(ad.imgUrlList[0]), (err, texture) => {
                    console.log("TYQSDK", "HW 原生大图加载成功");
                    self.nativeInfo.Native_BigImage = texture;
                    self.isLoadImageNative = true;
                });
            } else {
                self.nativeInfo.Native_BigImage = null;
                self.isLoadImageNative = false;
            }

            // if (ad && ad.icon != undefined && ad.icon != "") {
            //     cc.loader.load(String(ad.icon), (err, texture) => {
            //         console.log("TYQSDK", "HW 原生ICON加载成功");
            //         self.nativeInfo.Native_icon = texture;
            //         self.isLoadIconNative = true;
            //     });
            // } else {
            //     self.nativeInfo.Native_icon = null;
            //     self.isLoadIconNative = false;
            // }

        });


        //监听原生广告加载错误
        this.nativeAd.onError(err => {
            console.log("TYQSDK", "HW 原生广告加载失败：" + JSON.stringify(err))
        });

        // this.nativeAd.load();
    }


    /**
     * 再次拉取原生广告
     */
    public reLoadNative() {
        if (this.loadNativeIntervalTime >= 30) {
            this.nativeUpdate();
        }
    }


    /**
     * 定时刷新原生广告
    */
    public nativeUpdate() {
        this.nativeAd && this.nativeAd.load();
    }

    /**
     * 是否加载到原生1:1图片
     */
    public getIconNativeFlag(): boolean {
        return this.isLoadIconNative;
    }

    /**
     * 是否加载到原生2:1大图
     */
    public getImageNativeFlag(): boolean {
        return this.isLoadImageNative;
    }


    /**
     * 展示原生插屏
     */
    public showNativeInters(NativeIntersReportFrequency) {
        if (this.hasCreateHWNative) {
            this.reLoadNative();
            setTimeout(() => {
                this.nativeInfo = this.nativeInfo;
                //上报次数
                this.reportNativeShow(this.nativeInfo.adId);
                CocosUI.getInstance().showNativeIntersUI(this.nativeInfo)
            }, 1500);
        } else {
            this.createNativeAd(NativeController.getInstance().ID_NativeID);
            setTimeout(() => {
                this.reLoadNative();
                setTimeout(() => {
                    this.nativeInfo = this.nativeInfo;
                    //上报次数
                    this.reportNativeShow(this.nativeInfo.adId);
                    CocosUI.getInstance().showNativeIntersUI(this.nativeInfo)
                }, 1500);
            }, 300);
        }
    }


    /**
     * 展示原生Icon
     */
    public showNativeIcon(width, height, x, y) {
        this.reportNativeShow(this.nativeInfo.adId);
        CocosUI.getInstance().showNativeIconUI(width, height, x, y, this.nativeInfo)
    }

    /**
     * 展示原生大图
     */
    public showNativeImage(width, height, x, y) {
        this.reportNativeShow(this.nativeInfo.adId);
        CocosUI.getInstance().showNativeImageUI(width, height, x, y, this.nativeInfo)
    }

    /**
     * 上报原生广告展示
     */
    public reportNativeShow(ID) {
        console.log("TYQSDK", "HW 原生广告上报展示", "广告ID为:" + ID);
        this.nativeAd.reportAdShow({
            adId: ID
        })
    }
    /**
     * 上报原生广告点击
     */
    public reportNativeClick(ID) {
        console.log("TYQSDK", "HW 原生广告上报点击", "广告ID为:" + ID);
        this.nativeAd.reportAdClick({
            adId: ID
        })
    }
}

export default NativeHW