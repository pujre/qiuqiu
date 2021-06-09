
class VideoBL {
    private static instance: VideoBL

    /**
     * 是否加载到视频
     */
    private isLoadVideo = false;

    /**
     * 视频广告对象
     */
    private videoAd = null;

    /**
     * 视频回调
     */
    private videoCallBack = null;

    /**
     * VideoBL 单例
     */
    public static getInstance(): VideoBL {
        if (!VideoBL.instance) {
            VideoBL.instance = new VideoBL();
        }
        return VideoBL.instance
    }


    /**
     * 获取视频是否加载
     */
    public getVideoFlag(): boolean {
        if (!this.isLoadVideo && this.videoAd) {
            this.videoAd.load()
        }
        return this.isLoadVideo;
    }


    /**
     * 创建视频广告
     */
    public createVideoAd() {

        console.log('TYQSDK', 'BL 视频广告初始化');

        this.videoAd = bl.createRewardedVideoAd();

        // 监听加载完成
        this.videoAd.onLoad((e) => {
            // 重要！此处必须先 off 本次事件回调。
            // this.videoAd.offLoad(adLoadHandler);
            console.log("TYQSDK", "BL 视频广告加载成功");
            this.isLoadVideo = true;
        })

        // 激励广告出错
        this.videoAd.onError((e) => {
            console.log("TYQSDK", "BL 视频广告加载错误:", JSON.stringify(e));
            this.videoAd.destroy();
            this.createVideoAd();
        })

        // 用户点击“关闭广告”
        this.videoAd.onClose((e) => {
            if (e.isEnded) {
                console.log("TYQSDK", "BL 激励视频广告完成，发放奖励");
                this.videoCallBack(true);
            } else {
                console.log("TYQSDK", "BL 激励视频广告取消关闭，不发放奖励");
                this.videoCallBack(false);
            }
            this.isLoadVideo = false;
            this.videoAd.destroy();
            this.createVideoAd();
        })

        // 加载
        this.videoAd.load();
    }


    /**
     * 展示video
     */
    public showVideo(callback) {
        if (this.videoAd) {
            this.videoCallBack = callback
            console.log('TYQSDK', 'BL showVideo ========================');
            this.videoAd.show();
            this.isLoadVideo = false;
        } else {
            console.log("TYQSDK", "不存在视频广告===============");
        }
    }
}

export default VideoBL  