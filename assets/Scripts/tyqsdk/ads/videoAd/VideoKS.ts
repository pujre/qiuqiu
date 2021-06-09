import SdkTools from "../../tools/SdkTools"


class VideoKS {
    private static instance: VideoKS

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
     * VideoKS 单例
     */
    public static getInstance(): VideoKS {
        if (!VideoKS.instance) {
            VideoKS.instance = new VideoKS();
        }
        return VideoKS.instance
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

        console.log('TYQSDK', 'KS 视频广告初始化', ID)

        let self = this;

        this.videoAd = kwaigame.createRewardedVideoAd({
            adUnitId: ID
        })

        if (this.videoAd) {
            this.isLoadVideo = true;
            
            this.videoAd.onClose((result) => {
                console.log("TYQSDK", "激励视频取消播放");
                this.videoCallBack(false);
            });

            this.videoAd.onReward((result) => {
                console.log("TYQSDK", "激励视频播放完成");
                this.videoCallBack(true);
            });
        }
    }


    /**
     * 展示video
     */
    public showVideo(callback) {
        if (this.videoAd) {
            this.videoCallBack = callback;
            console.log('TYQSDK', 'KS showVideo========================')
            this.videoAd.show({
                success: () => {
                },
                fail: (error) => {
                    console.log("TYQSDK", "激励视频播放失败: " + JSON.stringify(error));
                }
            })
        } else {
            console.log("TYQSDK", "不存在视频广告===============");
        }
    }
}

export default VideoKS  