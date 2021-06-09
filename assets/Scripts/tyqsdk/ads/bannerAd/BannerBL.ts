import BannerController from "./BannerController";

class BannerBL {

    private static instance: BannerBL

    /**
     * banner广告对象
     */
    public bannerAd = null;

    /**
     * 已经调用过showBanner?
     */
    public bannerShow: boolean = false;

    /**
     * banner刷新定时器
     */
    private updateBanner: any = null;


    /**
     * BannerBL 单例
     */
    public static getInstance(): BannerBL {
        if (!BannerBL.instance) {
            BannerBL.instance = new BannerBL()
        }
        return BannerBL.instance
    }

    /**
     * 创建系统Banner
     */
    public createSystemBanner() {

        console.log('TYQSDK', 'BL Banner广告初始化');

        let self = this;

        // var windowWidth = Number(bl.getSystemInfoSync().windowWidth);
        // var windowHeight = Number(bl.getSystemInfoSync().windowHeight);

        this.bannerAd = bl.createBannerAd({
            style: {
                left: 30,
                top: 663,
                width: 300,
                height: 88
            },
        })

        this.bannerAd.onResize((size) => {
            // self.bannerAd.style.top = windowHeight - size.height;
            // self.bannerAd.style.left = (windowWidth - size.width) / 2;
            console.log("TYQSDK", "BL banner真实宽高:", JSON.stringify(size));
        })

        this.bannerAd.onLoad(() => {
            console.log("TYQSDK", "BL banner加载成功");
            BannerController.getInstance().isLoadSystemeBanner = true;
            if (self.bannerShow) {
                self.showSystemBanner();
                // if (windowHeight > windowWidth) {
                //     self.bannerAd.style.width = windowWidth;
                // }
                // else {
                //     self.bannerAd.style.width = windowWidth / 2;
                // }
                // self.bannerAd.style.top = windowHeight - self.bannerAd.style.realHeight;
                // self.bannerAd.style.left = (windowWidth - self.bannerAd.style.width) / 2;
            }
        })

        this.bannerAd.onError((err) => {
            console.log("TYQSDK", "BL banner加载失败" + JSON.stringify(err))
        })

        this.bannerAd.onClose(() => {
            console.log("TYQSDK", "BL banner被用户主动关闭", BannerController.getInstance().NUM_BannerUpdateTime + "S后再次刷新");
            this.updateSytemBanner();
        })

    }

    /**
     * 展示系统banner
     */
    public showSystemBanner() {
        if (this.bannerAd) {
            console.log("TYQSDK", 'BL showSystemBanner========================')
            this.bannerShow = true;
            this.bannerAd.show()
        }
    }

    /**
     * 刷新系统banner
     */
    public updateSytemBanner() {
        // 关闭上一个showBanner产生的定时器
        if (this.updateBanner) clearInterval(this.updateBanner);
        this.updateBanner =
            setInterval(() => {
                console.log("TYQSDK", 'BL updateSystemBanner ========================')
                this.bannerAd.destroy();
                this.bannerAd = null;
                this.createSystemBanner();
            }, BannerController.getInstance().NUM_BannerUpdateTime * 1000)
    }

    /**
     * 隐藏系统banner
     */
    public hideSystemBanner() {
        if (this.bannerAd) {
            console.log("TYQSDK", 'BL hideSystemBanner ========================')
            this.bannerAd.hide();
            this.bannerShow = false;
        } else {
            console.log("TYQSDK", "BL 不存在系统banner ========================')");
        }

        if (this.updateBanner) clearInterval(this.updateBanner);

    }

}

export default BannerBL