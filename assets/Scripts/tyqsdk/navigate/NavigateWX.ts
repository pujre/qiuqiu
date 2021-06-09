import BannerController from "../ads/bannerAd/BannerController";
import Network from "../network/Network";
import SdkTools from "../tools/SdkTools";
import CocosUI from "../ui/CocosUI";
import NavigateController from "./NavigateController";

class NavigateWX {

    private static instance: NavigateWX

    /**
     * 互推icon背景
     */
    public navigateBg: any = null;

    /**
     * 互推游戏的信息
     */
    public navigateInfom: any = null;

    /**
     * 互推横幅
     */
    public NavigateBanner: any = null;

    /**
     * 互推横幅资源
     */
    public NavigateBannerUITextures: any = null;

    /**
     * 是否加载到互推横幅资源
     */
    public isLoadNavigateBanner: boolean = false;

    /**
     * 互推九宫格资源
     */
    public NavigatePortalUITextures: any = null;

    /**
     * 互推九宫格背景
     */
    public layerBg: any = null;

    /**
     * 是否加载到互推九宫格资源
     */
    public isLoadNavigatePortal: boolean = false;

    /**
    * NavigateWX 单例
    */
    public static getInstance(): NavigateWX {
        if (!NavigateWX.instance) {
            NavigateWX.instance = new NavigateWX()
        }
        return NavigateWX.instance
    }

    /**
     * 展示互推icon
     */
    public showNavigateIcon(width, height, x, y) {
        if (this.navigateBg) {
            console.log("TYQSDK", "已存在互推ICON return");
            return;
        }
        console.log("TYQSDK", "showNavigateIcon===========================");

        let self = this;
        let UI = CocosUI.getInstance();
        let scene = cc.director.getScene();

        this.navigateBg = new cc.Node("navigateBg");
        this.navigateBg.addComponent(cc.Sprite);
        this.navigateBg.getComponent(cc.Sprite).spriteFrame = new cc.SpriteFrame(UI.navigateUITextures.bgTexture);
        setTimeout(() => {
            this.navigateBg.width = width;
            this.navigateBg.height = height;
            this.navigateBg.x = x;
            this.navigateBg.y = y;
        }, 1);

        this.navigateBg.runAction(cc.repeatForever(cc.sequence(cc.scaleBy(0.2, 1.1), cc.rotateTo(0.1, 30), cc.rotateTo(0.1, -25), cc.rotateTo(0.1, 20), cc.rotateTo(0.1, 0), cc.scaleBy(0.2, 1 / 1.1), cc.delayTime(5.0))));

        this.navigateBg.on(cc.Node.EventType.TOUCH_START, function (event) {
            self.jumpToMiniGame(self.navigateInfom);
        });

        scene.addChild(this.navigateBg);
        if (UI.cocosGroup != '') {
            this.navigateBg.group = UI.cocosGroup;
        }
        this.navigateBg.zIndex = 29999;

        var mask = new cc.Node("mask");
        mask.addComponent(cc.Mask);
        mask.getComponent(cc.Mask).type = cc.Mask.Type.IMAGE_STENCIL;
        mask.getComponent(cc.Mask).spriteFrame = new cc.SpriteFrame(UI.navigateUITextures.maskTexture);
        mask.getComponent(cc.Mask).alphaThreshold = 0.5;
        setTimeout(() => {
            mask.width = width * 0.84;
            mask.height = height * 0.84;
            mask.x = 0;
            mask.y = height * 0.05;
        }, 1);

        this.navigateBg.addChild(mask);

        var navigateIconImage = new cc.Node("image");
        navigateIconImage.addComponent(cc.Sprite);
        mask.addChild(navigateIconImage);

        var title = new cc.Node("title");
        title.addComponent(cc.Sprite);
        title.getComponent(cc.Sprite).spriteFrame = new cc.SpriteFrame(UI.navigateUITextures.moreGameTexture);
        setTimeout(() => {
            navigateIconImage.width = mask.width;
            navigateIconImage.height = mask.height;
            title.width = width * 0.84;
            title.height = height * 0.19;
            title.x = 0;
            title.y = -height * 0.27;
        }, 1);

        this.navigateBg.addChild(title);

        var iconupdate = function () {
            if (!navigateIconImage) {
                console.log("TYQSDK", 'no image');
                return;
            }
            var w = navigateIconImage.width;
            var h = navigateIconImage.width;
            var textrue = self.updateNavigateIcon();
            console.log("TYQSDK", "texture:" + textrue);
            navigateIconImage.getComponent(cc.Sprite).spriteFrame = new cc.SpriteFrame(textrue);
            navigateIconImage.width = w;
            navigateIconImage.height = h;
        }
        iconupdate();
        // 刷新互推ICON
        UI.navigateIconTimeInterval = setInterval(iconupdate, 30 * 1000);
    }
    /**
   * 刷新互推ICON
   */
    private updateNavigateIcon() {
        console.log("TYQSDK", "updateNavigateIcon===========================")
        var NavigateList = NavigateController.getInstance().navigateList;
        var self = this;
        var allWeight = 0;
        for (var i = 0; i < NavigateList.length; i++) {
            if (NavigateList[i].sort > 0) {
                allWeight += NavigateList[i].sort;
            }
        }

        var random = Math.floor(Math.random() * allWeight);
        var weightNow = 0;
        let inform = null;
        let index = 0;
        for (let i = 0; i < NavigateList.length; i++) {
            if (NavigateList[i].sort == 0) continue;
            if (random >= weightNow && random < weightNow + NavigateList[i].sort) {
                inform = NavigateList[i];
                index = i;
                console.log("TYQSDK", 'weight', random, NavigateList[i].pushGamePackage);
            }
            weightNow += NavigateList[i].sort;
        }
        if (inform) {
            this.navigateInfom = inform;
            return CocosUI.getInstance().NavigateIconTextureList[index];
        }
    }
    /**
     * 隐藏互推ICON
     * @param inform 
     */
    public hideNavigateIcon() {
        console.log("TYQSDK", "hideNavigateIcon===========================")
        if (this.navigateBg) {
            this.navigateBg.removeFromParent();
            this.navigateBg = null;
        }
        CocosUI.getInstance().navigateIconTimeInterval && clearInterval(CocosUI.getInstance().navigateIconTimeInterval);
    }


    /**
     * 创建互推横幅
     */
    public createNavigateBanner() {
        console.log("TYQSDK", "WX 开始加载互推横幅资源");
        var self = this;
        this.NavigateBannerUITextures = {
            navigateSettleGroup: null,
            navigateSettletitleBg: null,
            mask: null,
            iconWihte: null,
            navigateBanner: null,
            newMask: null,
            newIconWihte: null
        }
        var settleUIUrlList =
            [
                "https://tencentcnd.minigame.xplaymobile.com/Other/SDK/SDKImage_3_0/NavigateSettleRes/navigateSettleGroup.png",
                "https://tencentcnd.minigame.xplaymobile.com/Other/SDK/SDKImage_3_0/NavigateSettleRes/navigateSettletitleBg.png",
                "https://tencentcnd.minigame.xplaymobile.com/Other/SDK/SDKImage_3_0/NavigateSettleRes/settleIcon.png",
                "https://tencentcnd.minigame.xplaymobile.com/Other/SDK/SDKImage_3_0/NavigateSettleRes/iconWihte.png",
                "https://tencentcnd.minigame.xplaymobile.com/Other/SDK/SDKImage_3_0/NavigateSettleRes/navigateBanner.png",
                "https://tencentcnd.minigame.xplaymobile.com/Other/SDK/SDKImage_3_0/NavigateSettleRes/newMask3.png",
                "https://tencentcnd.minigame.xplaymobile.com/Other/SDK/SDKImage_3_0/NavigateSettleRes/newIconWihte3.png"
            ]
        SdkTools.loadImage(settleUIUrlList, (err, ArrImage) => {
            if (err) {
                console.log("TYQSDK", "WX 互推横幅资源加载错误" + JSON.stringify(err));
                return;
            }
            self.NavigateBannerUITextures.navigateSettleGroup = ArrImage[0];
            self.NavigateBannerUITextures.navigateSettletitleBg = ArrImage[1];
            self.NavigateBannerUITextures.mask = ArrImage[2];
            self.NavigateBannerUITextures.iconWihte = ArrImage[3];
            self.NavigateBannerUITextures.navigateBanner = ArrImage[4];
            self.NavigateBannerUITextures.newMask = ArrImage[5];
            self.NavigateBannerUITextures.newIconWihte = ArrImage[6];
            self.isLoadNavigateBanner = true;
            console.log("TYQSDK", "WX 互推横幅资源加载成功");
        })
    }

    public showNavigateBanner() {
        if (!this.isLoadNavigateBanner) {
            console.log("TYQSDK", "WX 互推横幅资源未加载完成");
            return;
        }
        if (this.NavigateBanner) {
            console.log("TYQSDK", "WX 已存在互推横幅");
            return;
        }

        let NavigateList = NavigateController.getInstance().navigateList;

        if (NavigateList.length < 5) {
            console.log("TYQSDK", "WX 互推样式的游戏数量小于5个 return");
            return;
        }

        BannerController.getInstance().hideBanner();

        console.log("TYQSDK", "showNavigateBanner================");

        var dataArr = [];
        for (let index = 0; index < NavigateList.length; index++) {
            dataArr[index] = NavigateList[index];
            dataArr[index].index = index;
        }

        var getInfom = function () {
            var allWeight = 0;
            for (var i = 0; i < dataArr.length; i++) {
                allWeight += dataArr[i].sort;
            }

            var random = Math.floor(Math.random() * allWeight);
            var weightNow = 0;
            for (let i = 0; i < dataArr.length; i++) {
                if (random >= weightNow && random < weightNow + dataArr[i].sort) {
                    var inform = dataArr[i];
                    dataArr.splice(i, 1);
                    return inform;
                }
                weightNow += dataArr[i].sort;
            }
        }

        let scene = cc.director.getScene();
        let self = this;

        this.NavigateBanner = new cc.Node("NavigateBanner");
        this.NavigateBanner.active = false;
        this.NavigateBanner.addComponent(cc.Sprite);
        this.NavigateBanner.getComponent(cc.Sprite).spriteFrame = new cc.SpriteFrame(this.NavigateBannerUITextures.navigateBanner);
        setTimeout(() => {
            if (cc.winSize.width < cc.winSize.height) {
                this.NavigateBanner.active = true;
                this.NavigateBanner.width = cc.winSize.width;
                this.NavigateBanner.height = this.NavigateBanner.width * 13 / 35;
            } else {
                this.NavigateBanner.active = true;
                this.NavigateBanner.height = cc.winSize.height * 0.4;
                this.NavigateBanner.width = this.NavigateBanner.height * 35 / 13;
            }
            this.NavigateBanner.x = cc.winSize.width / 2;
            this.NavigateBanner.y = this.NavigateBanner.height / 2;
        }, 1);
        scene.addChild(this.NavigateBanner);
        if (CocosUI.getInstance().cocosGroup != '') { this.NavigateBanner.group = CocosUI.getInstance().cocosGroup; }

        for (let i = 0; i < 5; i++) {
            let inform = getInfom();

            let button = new cc.Node("button");
            button.active = false;
            this.NavigateBanner.addChild(button);

            let iconWihte = new cc.Node("button");
            iconWihte.addComponent(cc.Sprite);
            iconWihte.getComponent(cc.Sprite).spriteFrame = new cc.SpriteFrame(this.NavigateBannerUITextures.newIconWihte);
            button.addChild(iconWihte);

            let mask = new cc.Node("mask");
            mask.addComponent(cc.Mask);
            mask.getComponent(cc.Mask).type = cc.Mask.Type.IMAGE_STENCIL;
            mask.getComponent(cc.Mask).spriteFrame = new cc.SpriteFrame(this.NavigateBannerUITextures.newMask);
            mask.getComponent(cc.Mask).alphaThreshold = 0.5;
            iconWihte.addChild(mask);

            let icon = new cc.Node("icon");
            icon.addComponent(cc.Sprite);
            icon.getComponent(cc.Sprite).spriteFrame = new cc.SpriteFrame(CocosUI.getInstance().NavigateIconTextureList[inform.index]);
            mask.addChild(icon);

            let nameLabel = new cc.Node("titleLabel");
            nameLabel.color = cc.Color.BLACK;
            nameLabel.addComponent(cc.Label);
            let gameName = inform.pushGameName;
            if (inform.pushGameName.length > 4) { gameName = gameName.substring(0, 4) + '...'; }
            nameLabel.getComponent(cc.Label).string = gameName;
            nameLabel.getComponent(cc.Label).fontSize = 30;
            nameLabel.getComponent(cc.Label).overflow = cc.Label.Overflow.SHRINK;
            nameLabel.getComponent(cc.Label).enableWrapText = false;
            nameLabel.getComponent(cc.Label).horizontalAlign = cc.Label.HorizontalAlign.CENTER;
            button.addChild(nameLabel);

            setTimeout(() => {
                button.active = true;

                button.width = this.NavigateBanner.width / 6.5;
                button.height = button.width;
                button.x = -this.NavigateBanner.width / 2 + this.NavigateBanner.width / 8.5 + this.NavigateBanner.width / 5.25 * i;
                button.y = -this.NavigateBanner.height / 16;

                iconWihte.width = button.width + 8;
                iconWihte.height = button.height + 8;

                mask.width = button.width;
                mask.height = button.height;

                icon.width = button.width;
                icon.height = button.height;

                nameLabel.width = icon.width;
                nameLabel.height = icon.height * 0.4;
                nameLabel.x = 0;
                nameLabel.y = -icon.height / 2 - nameLabel.height / 2 - 10;
            }, 1);

            icon.on(cc.Node.EventType.TOUCH_START, function (event) {
                self.jumpToMiniGame(inform);
            })
        }
    }
    /**
     * 隐藏互推横幅
     */
    public hideNavigateBanner() {
        console.log("TYQSDK", "hideNavigateBanner================");
        if (this.NavigateBanner) {
            this.NavigateBanner.removeFromParent();
            this.NavigateBanner = null;
        }
    }


    /**
     * 创建互推九宫格
     */
    public createNavigatePortal() {
        console.log("TYQSDK", "WX 开始加载互推九宫格资源");
        var self = this;
        this.NavigatePortalUITextures = {
            layerBg: null,
            navigatePortal: null,
            navigatePortalClose: null,
        }
        var urlList =
            [
                "https://tencentcnd.minigame.xplaymobile.com/Other/SDK/SDKImage_3_0/NavigateBox/layerBg.png",
                "https://tencentcnd.minigame.xplaymobile.com/Other/SDK/SDKImage_3_0/NavigateBox/NavigatePortal.png",
                "https://tencentcnd.minigame.xplaymobile.com/Other/SDK/SDKImage_3_0/NavigateBox/NavigatePortalClose.png",
            ]
        SdkTools.loadImage(urlList, (err, ArrImage) => {
            if (err) {
                console.log("TYQSDK", "WX 互推九宫格资源加载错误", JSON.stringify(err));
                return;
            }
            self.NavigatePortalUITextures.layerBg = ArrImage[0];
            self.NavigatePortalUITextures.navigatePortal = ArrImage[1];
            self.NavigatePortalUITextures.navigatePortalClose = ArrImage[2];
            self.isLoadNavigatePortal = true;
            console.log("TYQSDK", "WX 互推九宫格资源加载成功");
        })
    }
    /**
     * 展示互推九宫格
     */
    public showNavigatePortal() {
        if (!this.isLoadNavigatePortal) {
            console.log("TYQSDK", "WX 互推九宫格资源未加载完成");
            return;
        }
        if (this.layerBg) {
            console.log("TYQSDK", "WX 已存在互推横幅");
            return;
        }

        let NavigateList = NavigateController.getInstance().navigateList;

        if (NavigateList.length < 9) {
            console.log("TYQSDK", "WX 互推样式的游戏数量小于9个 return");
            return;
        }

        console.log("TYQSDK", "showNavigatePortal================");

        var dataArr = [];
        for (let index = 0; index < NavigateList.length; index++) {
            dataArr[index] = NavigateList[index];
            dataArr[index].index = index;
        }

        var getInfom = function () {
            var allWeight = 0;
            for (var i = 0; i < dataArr.length; i++) {
                allWeight += dataArr[i].sort;
            }

            var random = Math.floor(Math.random() * allWeight);
            var weightNow = 0;
            for (let i = 0; i < dataArr.length; i++) {
                if (random >= weightNow && random < weightNow + dataArr[i].sort) {
                    var inform = dataArr[i];
                    dataArr.splice(i, 1);
                    return inform;
                }
                weightNow += dataArr[i].sort;
            }
        }

        let scene = cc.director.getScene();
        let self = this;

        this.layerBg = new cc.Node("layerBg");
        let navigatePortal = new cc.Node("navigatePortal");
        let navigateClose = new cc.Node("navigateClose");

        this.layerBg.addComponent(cc.Sprite);
        this.layerBg.getComponent(cc.Sprite).spriteFrame = new cc.SpriteFrame(this.NavigatePortalUITextures.layerBg);
        this.layerBg.active = false;
        setTimeout(() => {
            this.layerBg.active = true;
            this.layerBg.width = cc.winSize.width;
            this.layerBg.height = cc.winSize.height;
            this.layerBg.x = cc.winSize.width / 2;
            this.layerBg.y = cc.winSize.height / 2;
        }, 0.5);
        this.layerBg.zIndex = 30003;
        this.layerBg.opacity = 200;
        scene.addChild(this.layerBg);
        if (CocosUI.getInstance().cocosGroup != '') {
            this.layerBg.group = CocosUI.getInstance().cocosGroup;
        }
        this.layerBg.on(cc.Node.EventType.TOUCH_START, function (event) {
        });


        navigatePortal.addComponent(cc.Sprite);
        navigatePortal.getComponent(cc.Sprite).spriteFrame = new cc.SpriteFrame(this.NavigatePortalUITextures.navigatePortal);
        setTimeout(() => {
            // navigatePortal.width = 520;
            // navigatePortal.height = 628;
            navigatePortal.width = 780;
            navigatePortal.height = 942;
        }, 0.5);
        this.layerBg.addChild(navigatePortal);


        navigateClose.addComponent(cc.Sprite);
        navigateClose.getComponent(cc.Sprite).spriteFrame = new cc.SpriteFrame(this.NavigatePortalUITextures.navigatePortalClose);
        setTimeout(() => {
            navigateClose.width = 50;
            navigateClose.height = 50;
            // navigateClose.x = navigatePortal.width / 2 - navigateClose.width / 2;
            navigateClose.x = navigatePortal.width / 2 - navigateClose.width;
            navigateClose.y = navigatePortal.height * 12 / 32 - navigateClose.height / 2;
        }, 0.5);
        navigatePortal.addChild(navigateClose);
        navigateClose.on(cc.Node.EventType.TOUCH_START, function (event) {
            console.log("TYQSDK", "用户手动关闭互推九宫格");
            self.layerBg.removeFromParent();
            self.layerBg = null;
        });


        for (let i = 0; i < 9; i++) {
            let inform = getInfom();

            let icon = new cc.Node("icon");
            icon.addComponent(cc.Sprite);
            icon.getComponent(cc.Sprite).spriteFrame = new cc.SpriteFrame(CocosUI.getInstance().NavigateIconTextureList[inform.index]);
            navigatePortal.addChild(icon);

            let nameLabel = new cc.Node("titleLabel");
            nameLabel.color = cc.Color.BLACK;
            nameLabel.addComponent(cc.Label);
            nameLabel.getComponent(cc.Label).string = inform.pushGameName;
            nameLabel.getComponent(cc.Label).fontSize = 40;
            nameLabel.getComponent(cc.Label).overflow = cc.Label.Overflow.SHRINK;
            nameLabel.getComponent(cc.Label).enableWrapText = false;
            nameLabel.getComponent(cc.Label).horizontalAlign = cc.Label.HorizontalAlign.CENTER;
            icon.addChild(nameLabel);
            icon.active = false;
            setTimeout(() => {
                icon.active = true;
                icon.width = navigatePortal.width / 5;
                icon.height = icon.width;
                // icon.x = -160 + (i % 3) * 160;
                // icon.y = 120 - Math.floor(i / 3) * 160;
                icon.x = -240 + (i % 3) * 240;
                icon.y = 180 - Math.floor(i / 3) * 240;

                nameLabel.width = icon.width;
                nameLabel.height = icon.height * 0.234;
                nameLabel.x = 0;
                nameLabel.y = -icon.height / 2 - nameLabel.height / 2;
            }, 1);

            icon.on(cc.Node.EventType.TOUCH_START, function (event) {
                self.jumpToMiniGame(inform);
            })
        }
    }


    /**
     * 互推游戏跳转
     * @param inform 
     */
    private jumpToMiniGame(inform) {
        console.log("TYQSDK", "WX jumpToMiniGame===========================")
        wx.navigateToMiniProgram({
            appId: inform.pushGamePackage,
            path: "?foo=bar",
            success(res) {
                Network.getInstance().statistics(inform);
                // 打开成功
                console.log("TYQSDK", "WX 跳转成功");
            },
            fail(err) {
                console.log("TYQSDK", "WX 跳转失败：" + JSON.stringify(err));
            }
        })
    }

}
export default NavigateWX