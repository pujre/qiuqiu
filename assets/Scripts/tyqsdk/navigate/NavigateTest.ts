import SdkTools from "../tools/SdkTools";
import CocosUI from "../ui/CocosUI";
import BannerController from "../ads/bannerAd/BannerController";

class NavigateTest {

    private static instance: NavigateTest

    /**
     * 测试互推ICON
     */
    public nativeIcon = null;

    /**
     * 测试互推列表
     */
    public navigateGroupBg = null;

    /**
     * 测试结算互推
     */
    public navigateSettle = null;

    /**
     * 测试互推横幅
     */
    public navigateBanner = null;

    /**
     * 测试互推九宫格
     */
    public navigatePortal = null;

    /**
     * 测试互推九宫格UI资源
     */
    public NavigateBoxPortalUIInfo = null;

    /**
     * 测试互推九宫格UI资源加载错误次数
     */
    public navigatePortalErrorTimes: number = 0;

    /**
     * 存储 是否调用过展示测试banner
     */
    public testBannerOnShow: boolean = false;

    /**
    * NavigateTest 单例
    */
    public static getInstance(): NavigateTest {
        if (!NavigateTest.instance) {
            NavigateTest.instance = new NavigateTest()
        }
        return NavigateTest.instance
    }


    /**
     * 展示测试互推ICON
     */
    public showNavigateIcon(width, height, x, y) {
        if (this.nativeIcon) {
            console.log("TYQSDK", "Test 已存在互推ICON return");
            return;
        }
        console.log("TYQSDK", 'Test showNavigateIcon====================');
        var self = this;
        var scene = cc.director.getScene();
        cc.loader.load("https://tencentcnd.minigame.xplaymobile.com/Other/SDK/SDKImage_3_0/NavigateIconRes/iconBg.png", (err, texture) => {
            self.nativeIcon = new cc.Node("nativeIcon");
            self.nativeIcon.addComponent(cc.Sprite);
            self.nativeIcon.getComponent(cc.Sprite).spriteFrame = new cc.SpriteFrame(texture);
            setTimeout(() => {
                self.nativeIcon.width = width;
                self.nativeIcon.height = height;
                self.nativeIcon.x = x;
                self.nativeIcon.y = y;
            }, 1);
            self.nativeIcon.zIndex = 29999;
            if (CocosUI.getInstance().cocosGroup != "") {
                self.nativeIcon.group = CocosUI.getInstance().cocosGroup;
            }
            scene.addChild(self.nativeIcon);
        });
    }
    /**
     * 隐藏测试互推ICON
     */
    public hideNavigateIcon() {
        if (this.nativeIcon) {
            console.log("TYQSDK", 'Test hideNavigateIcon====================');
            this.nativeIcon.removeFromParent();
            this.nativeIcon = null
        } else {
            console.log("TYQSDK", "Test 不存在测试互推ICON return");
            return;
        }
    }


    /**
     * 展示测试互推列表
     */
    public showNavigateGroup(type: string, side: string, size: number, y: number) {

        if (this.navigateGroupBg) {
            console.log("TYQSDK", "Test 已存在测试互推列表 return");
            return;
        }
        console.log("ASC", "Test showNavigateGroup========================");

        if (y == undefined || y == null) y = 0;

        var scene = cc.director.getScene();
        this.navigateGroupBg = new cc.Node("navigateGroupBg");
        scene.addChild(this.navigateGroupBg);
        this.navigateGroupBg.x = cc.winSize.width / 2;
        this.navigateGroupBg.y = cc.winSize.height / 2;

        let navigateGroupUITextures = {
            iconBtn: null,
            leftTuck: null,
            rightTuck: null,
            moreGameGroupLeft: null,
            moreGameGroupRight: null,
        }
        var iconUIUrlList =
            [
                "https://tencentcnd.minigame.xplaymobile.com/Other/SDK/SDKImage_3_0/NewNavigateGroupRes/iconBtn.png",
                "https://tencentcnd.minigame.xplaymobile.com/Other/SDK/SDKImage_3_0/NewNavigateGroupRes/leftTuck.png",
                "https://tencentcnd.minigame.xplaymobile.com/Other/SDK/SDKImage_3_0/NewNavigateGroupRes/rightTuck.png",
                "https://tencentcnd.minigame.xplaymobile.com/Other/SDK/SDKImage_3_0/NewNavigateGroupRes/moreGameGroupLeft.png",
                "https://tencentcnd.minigame.xplaymobile.com/Other/SDK/SDKImage_3_0/NewNavigateGroupRes/moreGameGroupRight.png",
            ]

        SdkTools.loadImage(iconUIUrlList, (err, ArrImage) => {
            if (err) {
                console.log("TYQSDK", "互推列表资源加载错误", JSON.stringify(err));
                return;
            }
            navigateGroupUITextures.iconBtn = ArrImage[0];
            navigateGroupUITextures.leftTuck = ArrImage[1];
            navigateGroupUITextures.rightTuck = ArrImage[2];
            navigateGroupUITextures.moreGameGroupLeft = ArrImage[3];
            navigateGroupUITextures.moreGameGroupRight = ArrImage[4];

            let iconBtn = new cc.Node();
            this.navigateGroupBg.addChild(iconBtn);
            iconBtn.addComponent(cc.Sprite);
            iconBtn.getComponent(cc.Sprite).spriteFrame = new cc.SpriteFrame(navigateGroupUITextures.iconBtn);
            iconBtn.width = size;
            iconBtn.height = size;
            // 如果参数side是left,默认互推列表icon在左侧中间
            if (side == "left") {
                // 互推列表icon在左侧中间
                iconBtn.x = iconBtn.width / 2 - cc.winSize.width / 2;
                iconBtn.y = y;
            } else {
                // 互推列表icon在右侧中间
                iconBtn.x = cc.winSize.width / 2 - iconBtn.width / 2;
                iconBtn.y = y;
            }

            let isOpenNavigateGroup = false;
            // 在左侧打开或在右侧打开互推列表
            let openNavigateGroup = (left: boolean) => {
                iconBtn.active = false;
                /**
                 * 是否已打开互推列表
                 */
                if (left) {
                    console.log("TYQSDK", "在左侧打开互推游戏列表");
                    // 互推游戏列表 左
                    let moreGameGroupLeft = new cc.Node("moreGameGroupLeft");
                    this.navigateGroupBg.addChild(moreGameGroupLeft);
                    moreGameGroupLeft.addComponent(cc.Sprite);
                    moreGameGroupLeft.getComponent(cc.Sprite).spriteFrame = new cc.SpriteFrame(navigateGroupUITextures.moreGameGroupLeft);
                    // 竖屏
                    moreGameGroupLeft.height = cc.winSize.height / 2;
                    moreGameGroupLeft.width = moreGameGroupLeft.height / 4.8;
                    moreGameGroupLeft.x = -moreGameGroupLeft.width / 2 - cc.winSize.width / 2;
                    moreGameGroupLeft.y = 0;
                    cc.tween(moreGameGroupLeft)
                        .by(0.2, { position: cc.v3(moreGameGroupLeft.width, 0, 0) })
                        .call(() => {
                            isOpenNavigateGroup = true;
                        })
                        .start();

                    // 左侧缩进按钮
                    let leftTuck = new cc.Node();
                    moreGameGroupLeft.addChild(leftTuck);
                    leftTuck.addComponent(cc.Sprite);
                    leftTuck.getComponent(cc.Sprite).spriteFrame = new cc.SpriteFrame(navigateGroupUITextures.leftTuck);
                    leftTuck.width = moreGameGroupLeft.width * 0.5;
                    leftTuck.height = leftTuck.width * 1.2;
                    leftTuck.x = moreGameGroupLeft.width * 0.65;
                    leftTuck.y = moreGameGroupLeft.height * 0.3;
                    leftTuck.on(cc.Node.EventType.TOUCH_END, () => {
                        if (!isOpenNavigateGroup) return;
                        cc.tween(moreGameGroupLeft)
                            .by(0.5, { position: cc.v3(-moreGameGroupLeft.width, 0, 0) })
                            .call(() => {
                                isOpenNavigateGroup = false;
                                iconBtn.active = true;
                                iconBtn.width = size;
                                iconBtn.height = size;
                                moreGameGroupLeft.destroy();
                            })
                            .start();
                    })

                } else {
                    console.log("TYQSDK", "在右侧打开互推游戏列表");
                    // 互推游戏列表 右
                    let moreGameGroupRight = new cc.Node("moreGameGroupRight");
                    this.navigateGroupBg.addChild(moreGameGroupRight);
                    moreGameGroupRight.addComponent(cc.Sprite);
                    moreGameGroupRight.getComponent(cc.Sprite).spriteFrame = new cc.SpriteFrame(navigateGroupUITextures.moreGameGroupRight);
                    // 竖屏
                    moreGameGroupRight.height = cc.winSize.height / 2;
                    moreGameGroupRight.width = moreGameGroupRight.height / 4.8;
                    moreGameGroupRight.x = moreGameGroupRight.width / 2 + cc.winSize.width / 2;
                    moreGameGroupRight.y = 0;
                    cc.tween(moreGameGroupRight)
                        .by(0.2, { position: cc.v3(-moreGameGroupRight.width, 0, 0) })
                        .call(() => {
                            isOpenNavigateGroup = true;
                        })
                        .start();

                    // 右侧缩进按钮
                    let rightTuck = new cc.Node();
                    moreGameGroupRight.addChild(rightTuck);
                    rightTuck.addComponent(cc.Sprite);
                    rightTuck.getComponent(cc.Sprite).spriteFrame = new cc.SpriteFrame(navigateGroupUITextures.rightTuck);
                    rightTuck.width = moreGameGroupRight.width * 0.5;
                    rightTuck.height = rightTuck.width * 1.2;
                    rightTuck.x = -moreGameGroupRight.width * 0.65;
                    rightTuck.y = moreGameGroupRight.height * 0.3;
                    rightTuck.on(cc.Node.EventType.TOUCH_END, () => {
                        if (!isOpenNavigateGroup) return;
                        cc.tween(moreGameGroupRight)
                            .by(0.5, { position: cc.v3(moreGameGroupRight.width, 0, 0) })
                            .call(() => {
                                isOpenNavigateGroup = false;
                                iconBtn.active = true;
                                iconBtn.width = size;
                                iconBtn.height = size;
                                moreGameGroupRight.destroy();
                            })
                            .start();
                    })
                }
            }

            iconBtn.on(cc.Node.EventType.TOUCH_END, () => {
                if (iconBtn.x <= 0) {
                    openNavigateGroup(true);
                } else {
                    openNavigateGroup(false);
                }
            })
        })

    }
    /**
     * 隐藏测试互推列表
     */
    public hideNavigateGroup() {
        if (this.navigateGroupBg) {
            console.log("TYQSDK", 'Test hideNavigateGroup====================');
            this.navigateGroupBg.removeFromParent();
            this.navigateGroupBg = null
        } else {
            console.log("TYQSDK", "Test 不存在测试互推列表 return");
            return;
        }
    }


    /**
     * 展示测试结算互推
     */
    public showNavigateSettle(type: number, x: number, y: number) {
        if (this.navigateSettle) {
            console.log("TYQSDK", "Test 已存在测试结算互推 return");
            return;
        }
        BannerController.getInstance().hideBanner();
        console.log("TYQSDK", 'Test showNavigateSettle====================');
        if (type == 1 && (cc.winSize.height / cc.winSize.width) <= (16 / 9)) { type = 4; y = 0; };
        switch (type) {
            case 1:
                {
                    var scene = cc.director.getScene();
                    var self = this;
                    cc.loader.load("https://tencentcnd.minigame.xplaymobile.com/Other/SDK/SDKImage_3_0/NewNavigateSettleRes/navigateSettle1Test.png", (err, texture) => {
                        this.navigateSettle = new cc.Node("navigateSettleBg");
                        if (CocosUI.getInstance().cocosGroup != '') {
                            self.navigateSettle.group = CocosUI.getInstance().cocosGroup;
                        }
                        scene.addChild(this.navigateSettle);
                        this.navigateSettle.addComponent(cc.Sprite);
                        this.navigateSettle.getComponent(cc.Sprite).spriteFrame = new cc.SpriteFrame(texture);
                        this.navigateSettle.width = cc.winSize.width * 9 / 10;
                        this.navigateSettle.height = cc.winSize.width * 2 / 3;
                        // 横坐标默认居中,纵坐标默认贴近底部
                        this.navigateSettle.x = cc.winSize.width / 2;
                        this.navigateSettle.y = this.navigateSettle.height / 2 + y;
                    });
                }
                break;
            case 2:
                {
                    var scene = cc.director.getScene();
                    var self = this;
                    self.navigateSettle = new cc.Node("navigateSettle");
                    self.navigateSettle.x = 0;
                    self.navigateSettle.y = 0;
                    self.navigateSettle.zIndex = 30000;
                    if (CocosUI.getInstance().cocosGroup != '') {
                        self.navigateSettle.group = CocosUI.getInstance().cocosGroup;
                    }
                    scene.addChild(self.navigateSettle);

                    cc.loader.load("https://tencentcnd.minigame.xplaymobile.com/Other/SDK/SDKImage_3_0/TestRes/TestNavigateSettleLeft.png", (err, texture) => {
                        var navigateSettleLeft = new cc.Node("navigateSettleLeft");
                        navigateSettleLeft.addComponent(cc.Sprite);
                        navigateSettleLeft.getComponent(cc.Sprite).spriteFrame = new cc.SpriteFrame(texture);
                        setTimeout(() => {
                            if (cc.winSize.width < cc.winSize.height) {
                                navigateSettleLeft.width = cc.winSize.width * 0.2;
                                navigateSettleLeft.height = navigateSettleLeft.width / 0.39;
                            }
                            else {
                                navigateSettleLeft.height = cc.winSize.height - 200;
                                navigateSettleLeft.width = cc.winSize.height * 0.39;

                            }
                            navigateSettleLeft.x = navigateSettleLeft.width / 2;
                            navigateSettleLeft.y = cc.winSize.height / 2;
                        }, 1);
                        self.navigateSettle.addChild(navigateSettleLeft);
                    });

                    cc.loader.load("https://tencentcnd.minigame.xplaymobile.com/Other/SDK/SDKImage_3_0/TestRes/TestNavigateSettleRight.png", (err, texture) => {
                        var navigateSettleRight = new cc.Node("navigateSettleRight");
                        navigateSettleRight.addComponent(cc.Sprite);
                        navigateSettleRight.getComponent(cc.Sprite).spriteFrame = new cc.SpriteFrame(texture);
                        setTimeout(() => {
                            if (cc.winSize.width < cc.winSize.height) {
                                navigateSettleRight.width = cc.winSize.width * 0.2;
                                navigateSettleRight.height = navigateSettleRight.width / 0.39;
                            }
                            else {
                                navigateSettleRight.height = cc.winSize.height - 200;
                                navigateSettleRight.width = cc.winSize.height * 0.39;
                            }
                            navigateSettleRight.x = cc.winSize.width - navigateSettleRight.width / 2;
                            navigateSettleRight.y = cc.winSize.height / 2;
                        }, 1);
                        self.navigateSettle.addChild(navigateSettleRight);
                    });
                }
                break;
            case 3:
                {
                    var scene = cc.director.getScene();
                    var self = this;
                    cc.loader.load("https://tencentcnd.minigame.xplaymobile.com/Other/SDK/SDKImage_3_0/TestRes/TestNavigateSettleType3.png", (err, texture) => {
                        self.navigateSettle = new cc.Node("navigateSettle");
                        self.navigateSettle.addComponent(cc.Sprite);
                        self.navigateSettle.getComponent(cc.Sprite).spriteFrame = new cc.SpriteFrame(texture);
                        setTimeout(() => {
                            if (cc.winSize.width < cc.winSize.height) {
                                self.navigateSettle.width = cc.winSize.width * 0.904;
                                self.navigateSettle.height = self.navigateSettle.width * 0.317;
                            }
                            else {
                                self.navigateSettle.height = cc.winSize.height / 5;
                                self.navigateSettle.width = self.navigateSettle.height / 0.317;
                            }
                            self.navigateSettle.x = x;
                            self.navigateSettle.y = y;
                        }, 1);
                        self.navigateSettle.zIndex = 30000;
                        if (CocosUI.getInstance().cocosGroup != '') {
                            self.navigateSettle.group = CocosUI.getInstance().cocosGroup;
                        }
                        scene.addChild(self.navigateSettle);
                    });
                }
                break;
            case 4:
                {
                    let self = this;
                    let scene = cc.director.getScene();
                    cc.loader.load("https://tencentcnd.minigame.xplaymobile.com/Other/SDK/SDKImage_3_0/NewNavigateSettleRes/navigateSettle4Test.png", (err, texture) => {
                        self.navigateSettle = new cc.Node("navigateSettle");
                        scene.addChild(self.navigateSettle);
                        self.navigateSettle.addComponent(cc.Sprite);
                        self.navigateSettle.getComponent(cc.Sprite).spriteFrame = new cc.SpriteFrame(texture);
                        if (cc.winSize.width < cc.winSize.height) {
                            this.navigateSettle.width = cc.winSize.width;
                            this.navigateSettle.height = this.navigateSettle.width * 0.3;
                        } else {
                            this.navigateSettle.width = cc.winSize.width / 2;
                            this.navigateSettle.height = this.navigateSettle.width * 0.25;
                        }
                        this.navigateSettle.x = cc.winSize.width / 2;
                        this.navigateSettle.y = this.navigateSettle.height / 2 + y;
                        self.navigateSettle.zIndex = 29999;
                        if (CocosUI.getInstance().cocosGroup != "") {
                            self.navigateSettle.group = CocosUI.getInstance().cocosGroup;
                        }
                    });
                }
                break;
            default:
                console.log("TYQSDK", "无该种类型的结算互推:" + type);
                break;
        }
    }
    /**
     * 隐藏测试结算互推
     */
    public hideNavigateSettle() {
        if (this.navigateSettle) {
            console.log("TYQSDK", 'Test hideNavigateSettle====================');
            this.navigateSettle.removeFromParent();
            this.navigateSettle = null
        } else {
            console.log("TYQSDK", "Test 不存在测试结算互推 return");
            return;
        }
    }


    /**
     * 展示测试互推盒子横幅
     */
    public showNavigateBoxBanner() {
        if (this.navigateBanner) {
            console.log("TYQSDK", "Test 已存在测试互推盒子横幅 return");
            return;
        }
        BannerController.getInstance().hideBanner();
        console.log("TYQSDK", 'Test showNavigateBoxBanner====================');

        let self = this;
        let scene = cc.director.getScene();
        cc.loader.load("https://tencentcnd.minigame.xplaymobile.com/Other/SDK/SDKImage_3_0/TestRes/TestNavigateBoxBanner.png", (err, texture) => {
            self.navigateBanner = new cc.Node("navigateBanner");
            self.navigateBanner.addComponent(cc.Sprite);
            self.navigateBanner.getComponent(cc.Sprite).spriteFrame = new cc.SpriteFrame(texture);
            setTimeout(() => {
                if (cc.winSize.width < cc.winSize.height) {
                    self.navigateBanner.width = cc.winSize.width;
                    self.navigateBanner.height = cc.winSize.height * 0.22;
                    self.navigateBanner.x = self.navigateBanner.width / 2;
                    self.navigateBanner.y = self.navigateBanner.height / 2;
                } else {
                    self.navigateBanner.width = cc.winSize.width / 2;
                    self.navigateBanner.height = cc.winSize.height * 0.4;
                    self.navigateBanner.x = self.navigateBanner.width;
                    self.navigateBanner.y = self.navigateBanner.height / 2;
                }
            }, 1);
            self.navigateBanner.zIndex = 29999;
            if (CocosUI.getInstance().cocosGroup != "") {
                self.navigateBanner.group = CocosUI.getInstance().cocosGroup;
            }
            scene.addChild(self.navigateBanner);
        });
    }
    /**
     * 隐藏测试互推盒子横幅
     */
    public hideNavigateBoxBanner() {
        if (this.navigateBanner) {
            console.log("TYQSDK", 'Test hideNavigateBoxBanner====================');
            this.navigateBanner.removeFromParent();
            this.navigateBanner = null;
        } else {
            console.log("TYQSDK", "Test 不存在测试互推盒子横幅 return");
            return;
        }
    }


    /**
     * 展示测试互推盒子九宫格
     */
    public showNavigateBoxPortal() {

        this.NavigateBoxPortalUIInfo =
        {
            layerBg: null,
            navigatePortal: null,
            exit: null,
        }
        var urlList = [
            "https://tencentcnd.minigame.xplaymobile.com/Other/SDK/SDKImage_3_0/NativeIntersRes/layerBg.png",
            "https://tencentcnd.minigame.xplaymobile.com/Other/SDK/SDKImage_3_0/TestRes/TestNavigateBoxPortal.png",
            "https://tencentcnd.minigame.xplaymobile.com/Other/SDK/SDKImage_3_0/TestRes/nativeClose.png",
        ];

        this.testBannerOnShow = BannerController.getInstance().testBannerShow;
        BannerController.getInstance().hideBanner();
        console.log("TYQSDK", 'Test showNavigateBoxPortal====================');
        let self = this;
        let scene = cc.director.getScene();

        SdkTools.loadImage(urlList, (err, texture) => {
            if (err) {
                console.log("TYQSDK", "测试互推盒子九宫格资源加载错误:" + JSON.stringify(err));
                if (self.navigatePortalErrorTimes < 5) {
                    self.navigatePortalErrorTimes++;
                    self.showNavigateBoxPortal();
                }
                return;
            } else {
                self.NavigateBoxPortalUIInfo.layerBg = texture[0];
                self.NavigateBoxPortalUIInfo.navigatePortal = texture[1];
                self.NavigateBoxPortalUIInfo.exit = texture[2];

                let layerBg = new cc.Node("layerBg");
                layerBg.addComponent(cc.Sprite);
                layerBg.getComponent(cc.Sprite).spriteFrame = new cc.SpriteFrame(self.NavigateBoxPortalUIInfo.layerBg);
                setTimeout(() => {
                    layerBg.width = cc.winSize.width;
                    layerBg.height = cc.winSize.height;
                    layerBg.x = cc.winSize.width / 2;
                    layerBg.y = cc.winSize.height / 2;
                }, 0.5);
                layerBg.zIndex = 30003;
                layerBg.opacity = 200;
                scene.addChild(layerBg);
                if (CocosUI.getInstance().cocosGroup != '') {
                    layerBg.group = CocosUI.getInstance().cocosGroup;
                }
                layerBg.on(cc.Node.EventType.TOUCH_START, function (event) {
                });

                let navigatePortal = new cc.Node("navigatePortal");
                navigatePortal.addComponent(cc.Sprite);
                navigatePortal.getComponent(cc.Sprite).spriteFrame = new cc.SpriteFrame(self.NavigateBoxPortalUIInfo.navigatePortal);
                setTimeout(() => {
                    navigatePortal.width = 520;
                    navigatePortal.height = 628;
                }, 0.5);
                layerBg.addChild(navigatePortal);

                let navigateClose = new cc.Node("navigateClose");
                navigateClose.addComponent(cc.Sprite);
                navigateClose.getComponent(cc.Sprite).spriteFrame = new cc.SpriteFrame(self.NavigateBoxPortalUIInfo.exit);
                setTimeout(() => {
                    navigateClose.width = 50;
                    navigateClose.height = 50;
                    navigateClose.x = navigatePortal.width / 2 - navigateClose.width / 2;
                    navigateClose.y = navigatePortal.height * 13 / 32 - navigateClose.height / 2;
                }, 0.5);
                navigatePortal.addChild(navigateClose);
                navigateClose.on(cc.Node.EventType.TOUCH_START, function (event) {
                    layerBg.removeFromParent();
                    if (self.testBannerOnShow) {
                        BannerController.getInstance().showBanner();
                    }
                });

            }
        });
    }

}
export default NavigateTest