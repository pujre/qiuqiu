
import SdkTools from "../../tools/SdkTools"
import CocosUI from "../../ui/CocosUI"

class BannerTest {
    private static instance: BannerTest

    public bannerUI = null;
    public bannerFakeBg = null;

    /**
     * BannerTest 单例
     */
    public static getInstance(): BannerTest {
        if (!BannerTest.instance) {
            BannerTest.instance = new BannerTest()
        }
        return BannerTest.instance
    }

    //创建横幅
    public createBanner() {

    }
    //展示测试横幅
    public showBanner() {
        if (this.bannerFakeBg) {
            console.log("TYQSDK", "已经存在测试Banner return");
            return;
        }
        console.log("TYQSDK", "Test showBanner===============");
        cc.loader.load('https://tencentcnd.minigame.xplaymobile.com/Other/SDK/SDKImage_3_0/TestRes/FakeNativeBannerBg.png', (err, texture) => {
            this.bannerUI = new cc.SpriteFrame(texture);
            this.bannerFakeBg = new cc.Node("bannerFakeBg");
            this.bannerFakeBg.addComponent(cc.Sprite);
            this.bannerFakeBg.getComponent(cc.Sprite).spriteFrame = this.bannerUI;
            this.bannerFakeBg.addComponent(cc.Widget);
            this.bannerFakeBg.getComponent(cc.Widget).isAlignHorizontalCenter = true;
            var scene = cc.director.getScene();
            scene.addChild(this.bannerFakeBg);
            if (cc.winSize.width < cc.winSize.height) {
                this.bannerFakeBg.width = cc.winSize.width;
                this.bannerFakeBg.height = cc.winSize.width * 0.18;
            }
            else {
                this.bannerFakeBg.width = cc.winSize.width / 2;
                this.bannerFakeBg.height = this.bannerFakeBg.width * 0.18;
            }
            this.bannerFakeBg.y = this.bannerFakeBg.height / 2;

            this.bannerFakeBg.zIndex = 30000;

            if (CocosUI.getInstance().cocosGroup != "") {
                this.bannerFakeBg.group = CocosUI.getInstance().cocosGroup;
            }
        });
    }
    // 隐藏测试横幅
    public hideBanner() {
        if (this.bannerFakeBg) {
            console.log("TYQSDK", "Test hideBanner===============");
            this.bannerFakeBg.removeFromParent();
            this.bannerFakeBg = null;
        } else {
            console.log("TYQSDK", "Test 不存在测试banner");
            return;
        }
    }


}

export default BannerTest 