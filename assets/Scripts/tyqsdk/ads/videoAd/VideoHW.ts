import SdkTools from "../../tools/SdkTools"

class VideoHW {
    private static instance: VideoHW

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
     * VideoHW 单例
     */
    public static getInstance(): VideoHW {
        if (!VideoHW.instance) {
            VideoHW.instance = new VideoHW();
        }
        return VideoHW.instance
    }


    /**
     * 获取视频是否加载
     */
    public getVideoFlag(): boolean {
        return this.isLoadVideo;
    }


    /**
     * 创建视频广告
     */
    public createVideoAd(ID) {

        console.log('TYQSDK', 'HW 视频广告初始化', ID)

        let self = this;

        this.videoAd = hbs.createRewardedVideoAd({
            adUnitId: ID,
        });

        //监听视频广告加载完成
        this.videoAd.onLoad(() => {
            console.log('TYQSDK', 'HW 视频广告加载完成')
            this.isLoadVideo = true;
        })

        //监听视频广告加载出错
        this.videoAd.onError(err => {
            console.log('TYQSDK', 'HW 视频加载失败 ：' + JSON.stringify(err))
            this.isLoadVideo = false;
            if (this.videoAd) {
                setTimeout(() => {
                    self.videoAd && self.videoAd.load()
                }, 30 * 1000)
            }
        })

        //监听视频广告播放完成
        this.videoAd.onClose(res => {
            if (res.isEnded) {
                console.log('TYQSDK', 'HW 激励视频广告完成，发放奖励')
                if (this.videoCallBack) {
                    this.videoCallBack(true);
                    this.videoAd.load();
                }
            } else {
                console.log('TYQSDK', 'HW 激励视频广告取消关闭，不发放奖励')
                if (this.videoCallBack) {
                    this.videoCallBack(false);
                    this.videoAd.load();
                }
            }
        })

        this.videoAd.load();

    }


    /**
     * 展示video
     */
    public showVideo(callback) {
        if (this.videoAd) {
            this.videoCallBack = callback;
            console.log('TYQSDK', 'HW showVideo========================')
            this.videoAd.show();
        } else {
            console.log("TYQSDK", "不存在视频广告===============");
        }
    }
}

export default VideoHW