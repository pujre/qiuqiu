import SdkTools from "../../tools/SdkTools"
import CocosUI from "../../ui/CocosUI"

class VideoTest {
    private static instance: VideoTest

    /**
    * VideoTest 单例
    */
    public static getInstance(): VideoTest {
        if (!VideoTest.instance) {
            VideoTest.instance = new VideoTest()
        }
        return VideoTest.instance
    }

    public showVideo(callback) {

        console.log("TYQSDK", "Test 展示测试视频====================");

        var layerBg = new cc.Node("layerBg");

        if (CocosUI.getInstance().cocosGroup != "") {
            layerBg.group = CocosUI.getInstance().cocosGroup;
        }

        setTimeout(() => {
            layerBg.width = 2560;
            layerBg.height = 2560;
            layerBg.x = cc.winSize.width / 2;
            layerBg.y = cc.winSize.height / 2;
        }, 1);
        layerBg.addComponent(cc.Sprite);
        layerBg.opacity = 200;
        cc.loader.load('https://tencentcnd.minigame.xplaymobile.com/Other/SDK/SDKImage_3_0/NativeIntersRes/layerBg.png', (err, texture) => {
            layerBg.getComponent(cc.Sprite).spriteFrame = new cc.SpriteFrame(texture);
            setTimeout(() => {
                layerBg.width = 2560;
                layerBg.height = 2560;
            }, 1);
        });
        var scene = cc.director.getScene();
        scene.addChild(layerBg);
        layerBg.zIndex = 30000;
        //关闭按钮
        layerBg.on(cc.Node.EventType.TOUCH_START, function (event) {

        });

        var titleLabel = new cc.Node("titleLabel");
        titleLabel.addComponent(cc.Label);
        titleLabel.getComponent(cc.Label).fontSize = 30;
        titleLabel.getComponent(cc.Label).enableWrapText = true;
        titleLabel.width = cc.winSize.width - 200;
        titleLabel.getComponent(cc.Label).string = "视频播放回调的测试";

        titleLabel.x = 0;
        titleLabel.y = 100;
        layerBg.addChild(titleLabel);


        var buttonSuccess = new cc.Node("buttonSuccess");
        buttonSuccess.addComponent(cc.Label);
        buttonSuccess.getComponent(cc.Label).fontSize = 30;
        buttonSuccess.getComponent(cc.Label).string = "播放成功";

        buttonSuccess.x = -100;
        buttonSuccess.y = -100;
        layerBg.addChild(buttonSuccess);
        //关闭按钮
        buttonSuccess.on(cc.Node.EventType.TOUCH_START, function (event) {
            scene.removeChild(layerBg);
            callback(true);
        });


        var buttonFailed = new cc.Node("buttonFailed");
        buttonFailed.addComponent(cc.Label);
        buttonFailed.getComponent(cc.Label).fontSize = 30;
        buttonFailed.getComponent(cc.Label).string = "播放失败";

        buttonFailed.x = 100;
        buttonFailed.y = -100;
        layerBg.addChild(buttonFailed);
        //关闭按钮
        buttonFailed.on(cc.Node.EventType.TOUCH_START, function (event) {
            scene.removeChild(layerBg);
            callback(false);
        });
    }


}

export default VideoTest  