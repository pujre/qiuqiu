import SdkTools, { Game_Platform } from "../../tools/SdkTools"
import VideoOppo from "./VideoOppo"
import VideoTest from "./VideoTest"
import VideoVivo from "./VideoVivo"
import VideoTiktok from "./VideoTiktok"
import VideoQQ from "./VideoQQ"
import VideoWX from "./VideoWX"
import VideoKS from "./VideoKS"
import VideoHW from "./VideoHW"
import VideoXM from "./VideoXM"
import VideoBL from "./VideoBL"

let videoCallback = null;
let videoIntersCallBack = null;

class VideoController {
    private static instance: VideoController

    /**
     * 系统视频广告ID
     */
    public ID_VideoID = "7c460fa6046545b6a32b219b3126572e";

    /**
     * 视频开关
     */
    public SW_VideoSwitch = true;

    /**
    * VideoController 单例
    */
    public static getInstance(): VideoController {
        if (!VideoController.instance) {
            VideoController.instance = new VideoController()
        }
        return VideoController.instance
    }

    /**
     * 创建视频广告
    */
    public createVideoAd() {
        if (!this.SW_VideoSwitch) {
            console.log("TYQSDK", "视频开关没有开启");
            return;
        }
        switch (SdkTools.getPlatform()) {
            case Game_Platform.GP_Oppo:
                VideoOppo.getInstance().createVideoAd(this.ID_VideoID);
                break;
            case Game_Platform.GP_Vivo:
                VideoVivo.getInstance().createVideoAd(this.ID_VideoID);
                break;
            case Game_Platform.GP_Tiktok:
                VideoTiktok.getInstance().createVideoAd(this.ID_VideoID);
                break;
            case Game_Platform.GP_QQ:
                VideoQQ.getInstance().createVideoAd(this.ID_VideoID);
                break;
            case Game_Platform.GP_WX:
                VideoWX.getInstance().createVideoAd(this.ID_VideoID);
                break;
            case Game_Platform.GP_KS:
                VideoKS.getInstance().createVideoAd(this.ID_VideoID);
                break;
            case Game_Platform.GP_HW:
                VideoHW.getInstance().createVideoAd(this.ID_VideoID);
                break;
            case Game_Platform.GP_XM:
                VideoXM.getInstance().createVideoAd(this.ID_VideoID);
                break;
            case Game_Platform.GP_BL:
                VideoBL.getInstance().createVideoAd();
                break;
            default:
                break;
        }
    }

    /**
     * 获取视频是否加载
     */
    public getVideoFlag(): boolean {
        switch (SdkTools.getPlatform()) {
            case Game_Platform.GP_Oppo:
                return VideoOppo.getInstance().getVideoFlag();
            case Game_Platform.GP_Vivo:
                return VideoVivo.getInstance().getVideoFlag();
            case Game_Platform.GP_Tiktok:
                return VideoTiktok.getInstance().getVideoFlag();
            case Game_Platform.GP_QQ:
                return VideoQQ.getInstance().getVideoFlag();
            case Game_Platform.GP_WX:
                return VideoWX.getInstance().getVideoFlag();
            case Game_Platform.GP_KS:
                return VideoKS.getInstance().getVideoFlag();
            case Game_Platform.GP_HW:
                return VideoHW.getInstance().getVideoFlag();
            case Game_Platform.GP_XM:
                return VideoXM.getInstance().getVideoFlag();
            case Game_Platform.GP_BL:
                return VideoBL.getInstance().getVideoFlag();
            case Game_Platform.GP_Android:
                return jsb.reflection.callStaticMethod("com/asc/sdk/ndk/AndroidNDKHelper", "SendMessageGetAdFlag", "(Ljava/lang/String;)Z", "getVideoFlag");
            case Game_Platform.GP_IOS:
                //return jsb.reflection.callStaticMethod("DJADManagerVC", "getVideoFlag") == "1";
            case Game_Platform.GP_Test:
                return true;
            default:
                return false;
        }
    }

    /**
     * 展示Video
     */
    public showVideo(callback) {
        if (SdkTools.getPlatform() == Game_Platform.GP_Test) {
            VideoTest.getInstance().showVideo(callback);
            return;
        }
        if (SdkTools.getPlatform() == Game_Platform.GP_Android) {
            videoCallback = callback;
            jsb.reflection.callStaticMethod("com/asc/sdk/ndk/AndroidNDKHelper", "ReceiveCppMessage", "(Ljava/lang/String;)V", `{"calling_method_name":"showVideo","calling_method_params":0}`);
            return;
        }
        if (SdkTools.getPlatform() == Game_Platform.GP_IOS) {
            videoCallback = callback;
            //jsb.reflection.callStaticMethod("DJADManagerVC", "showVideo");
            return;
        }
        if (!this.SW_VideoSwitch) {
            console.log("TYQSDK", "视频开关未开启");
            return;
        }
        switch (SdkTools.getPlatform()) {
            case Game_Platform.GP_Oppo:
                VideoOppo.getInstance().showVideo(callback);
                break;
            case Game_Platform.GP_Vivo:
                VideoVivo.getInstance().showVideo(callback);
                break;
            case Game_Platform.GP_Tiktok:
                VideoTiktok.getInstance().showVideo(callback);
                break;
            case Game_Platform.GP_QQ:
                VideoQQ.getInstance().showVideo(callback);
                break;
            case Game_Platform.GP_WX:
                VideoWX.getInstance().showVideo(callback);
                break;
            case Game_Platform.GP_KS:
                VideoKS.getInstance().showVideo(callback);
                break;
            case Game_Platform.GP_HW:
                VideoHW.getInstance().showVideo(callback);
                break;
            case Game_Platform.GP_XM:
                VideoXM.getInstance().showVideo(callback);
                break;
            case Game_Platform.GP_BL:
                VideoBL.getInstance().showVideo(callback);
                break;
            default:
                break;
        }

    }


    /** 
     * 是否加载到插屏视频广告
     */
    public getVideoIntersFlag() {
        switch (SdkTools.getPlatform()) {
            case Game_Platform.GP_Android:
                return jsb.reflection.callStaticMethod("com/asc/sdk/ndk/AndroidNDKHelper", "SendMessageGetAdFlag", "(Ljava/lang/String;)Z", "getVideoIntersFlag");
            case Game_Platform.GP_IOS:
                //return jsb.reflection.callStaticMethod("DJADManagerVC", "getIntersVideoFlag") == "1";
            default:
                return false;
        }
    }
    /**
     * 展示插屏视频广告
     */
    public showVideoInters(callback) {
        switch (SdkTools.getPlatform()) {
            case Game_Platform.GP_Android:
                videoIntersCallBack = callback;
                jsb.reflection.callStaticMethod("com/asc/sdk/ndk/AndroidNDKHelper", "ReceiveCppMessage", "(Ljava/lang/String;)V", `{"calling_method_name":"showVideoInters","calling_method_params":0}`);
                break;
            case Game_Platform.GP_IOS:
                videoIntersCallBack = callback;
                //jsb.reflection.callStaticMethod("DJADManagerVC", "showIntersVideo");
                break;
            default:
                break;
        }
    }

}
export default VideoController

//视频回调
{
    (<any>window).VideoCallback = function (result: string) {
        console.log("TYQSDK", "视频是否播放完成?", result == "1");
        videoCallback && videoCallback(result == "1");
        return "callback suc"
    }
}
//视频插屏回调
{
    (<any>window).VideoIntersCallBack = function () {
        //do something 视频播放完成所做的操作 恢复游戏
        console.log("TYQSDK", "videoInsertCallBack")
        videoIntersCallBack && videoIntersCallBack();
        return "callback suc"//必须要有返回值 返回值为字符串
    }
}