import IntersController from "./IntersController";

class IntersXM {
    private static instance: IntersXM

    /**
     * 插屏广告对象
     */
    public systemIntersAd = null;

    /**
     * 是否加载到了插屏广告
     */
    private isLoadSystemInter = false;


    /**
     * IntersXM 单例
     */
    public static getInstance(): IntersXM {
        if (!IntersXM.instance) {
            IntersXM.instance = new IntersXM()
        }
        return IntersXM.instance
    }

    /**
     * 获取插屏是否可以展示
     */
    public getSystemIntersFlag() {
        return this.isLoadSystemInter;
    }


    public createSystemInters(ID) {

        console.log('TYQSDK', 'XM 插屏广告初始化', ID)

        let self = this;
        this.systemIntersAd = qg.createInterstitialAd({
            adUnitId: ID
        });

        //监听插屏广告加载完成
        this.systemIntersAd.onLoad(() => {
            console.log('TYQSDK', 'XM 插屏广告加载完成')
            self.isLoadSystemInter = true
        })

        //监听插屏广告加载出错
        this.systemIntersAd.onError(err => {
            console.log('TYQSDK', 'XM 插屏广告加载失败：' + JSON.stringify(err))
            self.isLoadSystemInter = false;
            if (self.systemIntersAd) {
                setTimeout(() => {
                    self.systemIntersAd && self.systemIntersAd.load()
                }, 30 * 1000)
            }
        })

        //监听插屏广告关闭
        this.systemIntersAd.onClose(() => {
            console.log('TYQSDK', 'XM 系统插屏广告关闭');
            IntersController.getInstance().intersNowTime = 0;
            this.isLoadSystemInter = false;
            // 系统插屏关闭后10s后再次load
            setTimeout(() => {
                this.createSystemInters(ID);
            }, 10 * 1000);
        })

        // 加载一次
        // this.systemIntersAd.load();
    }


    /**
     * 展示系统插屏
     */
    public showSystemInters() {
        if (this.systemIntersAd && this.isLoadSystemInter) {
            console.log("TYQSDK", "XM showSystemInters==================");
            this.systemIntersAd.show();
        } else {
            console.log("TYQSDK", "XM 系统插屏广告未加载");
            return;
        }
    }
}

export default IntersXM