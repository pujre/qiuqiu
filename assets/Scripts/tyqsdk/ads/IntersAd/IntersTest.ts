import SdkTools from "../../tools/SdkTools";
import CocosUI from "../../ui/CocosUI";

class IntersTest {
    private static instance: IntersTest

    /**
     * 测试插屏
     */
    public NIUIInfo: any = null;

    /**
     * 测试插屏加载错误次数
     */
    public nativeIntersErrorTimes: number = 0;

    /**
     * IntersTest 单例
     */
    public static getInstance(): IntersTest {
        if (!IntersTest.instance) {
            IntersTest.instance = new IntersTest()
        }
        return IntersTest.instance
    }

    /**
     * 展示测试插屏
     */
    public showInters() {
        console.log("TYQSDK", "Test showInters===========================")
        this.NIUIInfo =
        {
            layerBg: null,
            exit: null,
        }
        var urlList = [
            "https://tencentcnd.minigame.xplaymobile.com/Other/SDK/SDKImage_3_0/NativeIntersRes/layerBg.png",
            "https://tencentcnd.minigame.xplaymobile.com/Other/SDK/SDKImage_3_0/NativeIntersRes/nativeClose.png",
        ];

        let self = this;

        SdkTools.loadImage(urlList, (err, ArrImage) => {
            if (err) {
                console.log("TYQSDK", "测试插屏资源加载错误:" + JSON.stringify(err));
                if (self.nativeIntersErrorTimes < 5) {
                    self.nativeIntersErrorTimes++;
                    self.showInters();
                }
                return;
            } else {
                self.NIUIInfo.layerBg = ArrImage[0];
                self.NIUIInfo.exit = ArrImage[1];

                var layerBg = new cc.Node("layerBg");
                layerBg.addComponent(cc.Sprite);
                layerBg.getComponent(cc.Sprite).spriteFrame = new cc.SpriteFrame(self.NIUIInfo.layerBg);
                setTimeout(() => {
                    layerBg.width = cc.winSize.width;
                    layerBg.height = cc.winSize.height;
                    layerBg.x = cc.winSize.width / 2;
                    layerBg.y = cc.winSize.height / 2;
                }, 0.5);
                layerBg.zIndex = 30003;
                layerBg.opacity = 150;
                var scene = cc.director.getScene();
                scene.addChild(layerBg);
                if (CocosUI.getInstance().cocosGroup != '') {
                    layerBg.group = CocosUI.getInstance().cocosGroup;
                }
                layerBg.on(cc.Node.EventType.TOUCH_START, function (event) {
                })

                var text = new cc.Node("text");
                text.color = cc.Color.RED;
                text.addComponent(cc.Label);
                text.getComponent(cc.Label).string = "这是一个测试插屏,请点击右上角关闭";
                text.getComponent(cc.Label).fontSize = 50;
                text.getComponent(cc.Label).lineHeight = 50;
                layerBg.addChild(text);

                var exit = new cc.Node("exit");
                exit.addComponent(cc.Sprite);
                exit.getComponent(cc.Sprite).spriteFrame = new cc.SpriteFrame(self.NIUIInfo.exit);
                setTimeout(() => {
                    exit.x = cc.winSize.width / 2 * 3 / 4;
                    exit.y = cc.winSize.height / 2 * 3 / 5;
                }, 1);
                exit.zIndex = 30010;
                layerBg.addChild(exit);
                exit.on(cc.Node.EventType.TOUCH_START, function (event) {
                    console.log("TYQSDK", "关闭测试插屏");
                    scene.removeChild(layerBg);
                });
            }
        })
    }


}

export default IntersTest 