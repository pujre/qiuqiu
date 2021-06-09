import SdkTools from "../../tools/SdkTools"
import CocosUI from "../../ui/CocosUI"

class BlockTest {
    private static instance: BlockTest

    /**
     * 积木广告白包ICON组件
     */
    public nativeIcon: any = null;

    /**
    * BlockTest 单例
    */
    public static getInstance(): BlockTest {
        if (!BlockTest.instance) {
            BlockTest.instance = new BlockTest()
        }
        return BlockTest.instance
    }
    /**
     * 展示积木广告
     */
    public showBlock(type: string, x: number, y: number, blockSize: number) {
        console.log("TYQSDK", 'Test showBlock==========================');
        var scene = cc.director.getScene();
        cc.loader.load("https://tencentcnd.minigame.xplaymobile.com/Other/SDK/SDKImage_3_0/NavigateIconRes/iconBg.png", (err, texture) => {
            this.nativeIcon = new cc.Node("nativeIcon");
            this.nativeIcon.addComponent(cc.Sprite);
            this.nativeIcon.getComponent(cc.Sprite).spriteFrame = new cc.SpriteFrame(texture);
            setTimeout(() => {
                this.nativeIcon.width = 200;
                this.nativeIcon.height = 200;
                this.nativeIcon.x = x + this.nativeIcon.width / 2;
                this.nativeIcon.y = y - this.nativeIcon.height / 2;
            }, 1)
            this.nativeIcon.zIndex = 29999;
            scene.addChild(this.nativeIcon);
            if (CocosUI.getInstance().cocosGroup != '') {
                this.nativeIcon.group = CocosUI.getInstance().cocosGroup;
            }
        });
    }

    /**
     * 关闭积木广告
     */
    public hideBlock() {
        if (this.nativeIcon) {
            console.log("TYQSDK", "Test hideBlock==========================");
            this.nativeIcon.removeFromParent();
            this.nativeIcon = null;
        } else {
            console.log("TYQSDK", "Test 不存在测试积木广告");
            return;
        }
    }

}
export default BlockTest