import SdkTools from "../../tools/SdkTools";
import CocosUI from "../../ui/CocosUI";

/**
 * NativeTest
 */
class NativeTest {

    private static instance: NativeTest

    /**
     * 原生ICON测试
     */
    public nativeIcon: any = null;

    /**
     * 原生大图测试
     */
    public nativeImage: any = null;

    /**
    * NativeTest 单例
    */
    public static getInstance(): NativeTest {
        if (!NativeTest.instance) {
            NativeTest.instance = new NativeTest()
        }
        return NativeTest.instance
    }

    /**
     * 创建原生ICON
     */
    public createNativeIcon() {

    }

    /**
     * 展示原生Icon
     */
    public showNativeIcon(width, height, x, y) {
        if (this.nativeIcon) {
            console.log("TYQSDK", "Test 已存在原生ICON return");
            return;
        }
        console.log("TYQSDK", 'Test showNativeIcon==================');

        cc.loader.load("https://tencentcnd.minigame.xplaymobile.com/Other/SDK/SDKImage_3_0/NavigateIconRes/iconBg.png", (err, texture) => {
            var scene = cc.director.getScene();
            this.nativeIcon = new cc.Node("nativeIcon");
            this.nativeIcon.addComponent(cc.Sprite);
            this.nativeIcon.getComponent(cc.Sprite).spriteFrame = new cc.SpriteFrame(texture);
            setTimeout(() => {
                this.nativeIcon.width = width;
                this.nativeIcon.height = height;
                this.nativeIcon.x = x;
                this.nativeIcon.y = y;
            }, 1)
            this.nativeIcon.zIndex = 29999;
            scene.addChild(this.nativeIcon);
            if (CocosUI.getInstance().cocosGroup != "") {
                this.nativeIcon.group = CocosUI.getInstance().cocosGroup;
            }


            
        });
    }
    /**
     * 隐藏测试原生Icon
     */
    public hideNativeIcon() {
        if (this.nativeIcon) {
            console.log("TYQSDK", "Test hideNativeICON==============");
            this.nativeIcon.removeFromParent();
            this.nativeIcon = null
        } else {
            console.log("TYQSDK", "Test 不存在原生ICON");
            return;
        }
    }

    /**
     * 展示测试原生大图
     */
    public showNativeImage(width, height, x, y) {
        if (this.nativeImage) {
            console.log("TYQSDK", "Test 已存在原生大图 return");
            return;
        }
        console.log("TYQSDK", 'Test showNativeImage==================');

        cc.loader.load("https://tencentcnd.minigame.xplaymobile.com/Other/SDK/SDKImage_3_0/TestRes/fakeNativeImage.png", (err, texture) => {
            var scene = cc.director.getScene();
            this.nativeImage = new cc.Node("nativeImage");
            this.nativeImage.addComponent(cc.Sprite);
            this.nativeImage.getComponent(cc.Sprite).spriteFrame = new cc.SpriteFrame(texture);
            setTimeout(() => {
                this.nativeImage.width = width;
                this.nativeImage.height = height;
                this.nativeImage.x = x;
                this.nativeImage.y = y;
            }, 1)
            this.nativeImage.zIndex = 29999;
            scene.addChild(this.nativeImage);
            if (CocosUI.getInstance().cocosGroup != "") {
                this.nativeImage.group = CocosUI.getInstance().cocosGroup;
            }
        });
    }
    /**
     * 隐藏测试原生大图
     */
    public hideNativeImage() {
        if (this.nativeImage) {
            console.log("TYQSDK", "Test hideNativeImage==============");
            this.nativeImage.removeFromParent();
            this.nativeImage = null
        } else {
            console.log("TYQSDK", "Test 不存在原生大图 return");
            return;
        }
    }

}

export default NativeTest