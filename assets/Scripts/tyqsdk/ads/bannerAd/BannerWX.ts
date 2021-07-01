import BannerController from "./BannerController";

class BannerWX {

    private static instance: BannerWX

    private ID_BannerId;
    /**
     * banner广告对象
     */
    public bannerAd = null;

    /**
     * banner刷新定时器
     */
    private updateBanner: any = null;

    /**
     * 已经调用过showBanner?
     */
    public bannerShow: boolean = false;

    /**
     * BannerWX 单例
     */
    public static getInstance(): BannerWX {
        if (!BannerWX.instance) {
            BannerWX.instance = new BannerWX()
        }
        return BannerWX.instance
    }

    /**
     * 创建系统Banner
     */
    public createSystemBanner(ID) {

        console.log("TYQSDK", "WX 系统banner广告初始化", ID);

        this.ID_BannerId=ID;
        var windowWidth = Number(wx.getSystemInfoSync().windowWidth);
        var windowHeight = Number(wx.getSystemInfoSync().windowHeight);

        console.log("wx.getSystemInfoSync():", wx.getSystemInfoSync());


        this.bannerAd = wx.createBannerAd({
            adUnitId: ID,
            style: {
                left: 10,
                top: 76,
                height: windowHeight * 0.2,
                width: (windowHeight > windowWidth) ? windowWidth : 200
            },
        });

        let self = this;

        // 监听系统banner尺寸变化
        this.bannerAd.onResize(function (size) {
            if (windowHeight > windowWidth || cc.winSize.height > cc.winSize.width) {
                self.bannerAd.style.width = windowWidth;
                self.bannerAd.style.height = windowWidth;
            }
            else {
                self.bannerAd.style.height = windowHeight * 0.2;
            }
            self.bannerAd.style.top = windowHeight - size.height;
            self.bannerAd.style.left = (windowWidth - size.width) / 2;
            // console.log("size:", size);
            // console.log("self.bannerAd.style:", self.bannerAd.style);
        });

        // 监听系统banner加载
        this.bannerAd.onLoad(function () {
            console.log("TYQSDK", "WX banner加载成功");
            BannerController.getInstance().isLoadSystemeBanner = true;
            if (self.bannerShow) {
                self.showSystemBanner();
            }
        })

        // 监听系统banner错误
        this.bannerAd.onError(function (err) {
            console.log("TYQSDK", "WX banner加载失败" + JSON.stringify(err));
            setTimeout(() => {
                self.createSystemBanner(this.ID_BannerId);
            }, 10 * 1000);
        })

    }

    /**
     * 展示系统banner
     */
    public showSystemBanner() {
        if (this.bannerAd) {
            console.log("TYQSDK", 'WX showSystemBanner========================');
            this.bannerAd.show();
            this.bannerShow = true;
        } else {
            console.log("TYQSDK", "不存在系统banner广告实例");
        }
    }

    /**
     * 刷新系统banner
     */
    public updateSytemBanner() {
        // 关闭上一个showBanner产生的定时器
        if (this.updateBanner) {
            clearInterval(this.updateBanner);
        }
        this.updateBanner =
            setInterval(() => {
                console.log("TYQSDK", 'WX 刷新系统banner========================')
                this.bannerAd.offLoad();
                this.bannerAd.offError();
                this.bannerAd.destroy();
                this.createSystemBanner(this.ID_BannerId);
            }, BannerController.getInstance().NUM_BannerUpdateTime * 1000)
    }

    /**
     * 隐藏系统banner
     */
    public hideSystemBanner() {
        if (this.bannerAd) {
            console.log("TYQSDK", 'WX hideSystemBanner========================');
            this.bannerAd.hide();
            this.bannerShow = false;
        } else {
            console.log("TYQSDK", "不存在banner");
        }
    }

}
export default BannerWX