import SdkTools, { Game_Platform } from "../tools/SdkTools"
import NativeController from "../ads/nativeAd/NativeController"
import BannerController from "../ads/bannerAd/BannerController";
import NavigateController from "../navigate/NavigateController";
import Network from "../network/Network";
import IntersController from "../ads/IntersAd/IntersController";


class CocosUI {
  private static instance: CocosUI

  tempid=0;

  /**
   * cocos creator 分组
   */
  public cocosGroup = "";

  /**
   * 原生Banner
   */
  public nativeBanner = null;

  /**
   * 原生Icon
   */
  public nativeIcon = null

  /**
   * 原生大图
   */
  public nativeImage = null;

  /**
   * 互推ICON刷新定时器
   */
  public navigateIconTimeInterval = null;

  /**
   * 互推游戏的信息
   */
  public navigateInfom: any = null;

  /**
   * 互推ICON的背景
   */
  public navigateBg: any = null;

  /**
   * 互推列表的背景
   */
  public navigateGroupBg: any = null;

  /**
   * 结算互推的背景
   */
  public navigateSettleBg: any = null;

  /**
   * 原生插屏广告UI贴图目录
   */
  public NIUIInfo: any = null;

  /**
   * 原生插屏广告UI贴图目录
   */
  public NativeBannerUIInfo: any = null;

  /**
   * 原生ICON广告角标UI资源
   */
  public ICONInfo: any = null;

  /**
   * 互推UI资源
   */
  public navigateUITextures = null;

  /**
   * 互推图的资源list
   */
  public NavigateIconTextureList: any = [];

  /**
   * 互推列表UI资源
   */
  public navigateGroupUITextures = null;

  /**
   * 原生插屏加载报错次数
   */
  public nativeIntersErrorTimes = 0;

  /**
   * 原生banner加载报错次数
   */
  public nativeBannerErrorTimes = 0;

  /**
   * 原生ICON广告角标UI资源加载报错次数
   */
  public nativeIconErrorTimes = 0;

  /**
   * 是否加载完成原生插屏UI
   */
  public isLoadNIUI = false;

  /**
   * 是否加载完成原生BannerUI
   */
  public isLoadNativeBannerUI = false;

  /**
   * 是否加载完成原生ICON广告角标UI
   */
  public isLoadIconTip = false;

  /**
   * 是否加载完成互推ICON资源
   */
  public isLoadNavigateIcon = false;

  /**
   * 是否加载完成互推列表
   */
  public isLoadNavigateGroup = false;

  /**
   * 是否加载完成互推列表资源图
   */
  public isLoadNavigateList = false;

  /**
   * 互推列表资源图
   */
  public navigateSettleUITextures = null;

  /**
   * 是否正在播放互推列表动画
   */
  public groupMoving = false;

  /**
   * 是否加载完成结算互推资源图
   */
  public isLoadNavigateSettle = false;

  /**
   * 互推列表隐藏定时器
   */
  public navigateGroupHideTmt = null;

  /**
   * 互推列表获取的六个icon节点
   */
  public iconArr = [];


  /**
   * CocosUI 单例
   */
  public static getInstance(): CocosUI {
    if (!CocosUI.instance) {
      CocosUI.instance = new CocosUI()
    }
    return CocosUI.instance
  }

  /**
   *设置组
   */
  setGroup(group: string) {
    this.cocosGroup = group;
  }


  /**
   * 加载原生插屏UI资源
   */
  public loadNativeInstersRes() {
    console.log("TYQSDK", "开始加载原生插屏资源")
    this.NIUIInfo =
    {
      layerBg: null,
      bg: null,
      button: null,
      exit: null,
      mask: null,
      ad:null
    }

    var urlList = [
      "https://h5-1258069360.cos.ap-guangzhou.myqcloud.com/other/sdk/NativeAD/layerBg.png",
      "https://h5-1258069360.cos.ap-guangzhou.myqcloud.com/other/sdk/NativeAD/Bg.png",
      "https://h5-1258069360.cos.ap-guangzhou.myqcloud.com/other/sdk/NativeAD/touchButton.png",
      "https://h5-1258069360.cos.ap-guangzhou.myqcloud.com/other/sdk/NativeAD/nativeBannerClose.png",
      "https://h5-1258069360.cos.ap-guangzhou.myqcloud.com/other/sdk/NativeAD/mask.png",
      "https://h5-1258069360.cos.ap-guangzhou.myqcloud.com/other/sdk/image/NativeAdTip.png"
    ];

    var self = this;

    SdkTools.loadImage(urlList, (err, ArrImage) => {
      if (err) {
        console.log("TYQSDK", "原生插屏资源加载错误:" + JSON.stringify(err));
        if (self.nativeIntersErrorTimes < 5) {
          self.nativeIntersErrorTimes++;
          self.loadNativeInstersRes();
        }
        return;
      } else {
        self.NIUIInfo.layerBg = ArrImage[0];
        self.NIUIInfo.bg = ArrImage[1];
        self.NIUIInfo.button = ArrImage[2];
        self.NIUIInfo.exit = ArrImage[3];
        self.NIUIInfo.mask = ArrImage[4];
        self.NIUIInfo.ad=ArrImage[5];
        self.isLoadNIUI = true;
        console.log("TYQSDK", "原生插屏资源加载成功");
      }
    })
  }


  /**
   * 加载原生BannerUI资源
   */
  public loadNativeBannerRes() {
    console.log("TYQSDK", "开始加载原生Banner资源")
    this.NativeBannerUIInfo =
    {
      bannerBg: null,
      bannerButton: null,
      bannerClose: null,
      bannerTip: null,
    }

    var urlList = [
      "https://h5-1258069360.cos.ap-guangzhou.myqcloud.com/other/sdk/NativeAD/newNativeBanner.png",
      "https://tencentcnd.minigame.xplaymobile.com/Other/SDK/SDKImage_3_0/NativeBannerRes/nativeBannerButton.png",
      "https://h5-1258069360.cos.ap-guangzhou.myqcloud.com/other/sdk/NativeAD/nativeBannerClose.png",
      "https://h5-1258069360.cos.ap-guangzhou.myqcloud.com/other/sdk/NativeAD/ICONAd.png",
    ];

    var self = this;
    SdkTools.loadImage(urlList, (err, ArrImage) => {
      if (err) {
        console.log("TYQSDK", "原生Banner资源加载错误:" + JSON.stringify(err));
        if (self.nativeBannerErrorTimes < 5) {
          self.nativeBannerErrorTimes++;
          self.loadNativeBannerRes();
        }
        return;
      }

      self.NativeBannerUIInfo.bannerBg = ArrImage[0];
      self.NativeBannerUIInfo.bannerButton = ArrImage[1];
      self.NativeBannerUIInfo.bannerClose = ArrImage[2];
      self.NativeBannerUIInfo.bannerTip = ArrImage[3];
      self.isLoadNativeBannerUI = true;
      console.log("TYQSDK", "原生Banner资源加载成功");
    })
  }


  /**
   * 加载原生ICON广告角标UI资源
   */
  public loadNativeIconRes() {
    this.ICONInfo =
    {
      iconButton: null,
      iconClose: null
    }

    var urlList = [
      "https://h5-1258069360.cos.ap-guangzhou.myqcloud.com/other/sdk/NativeAD/ad.png",
      "https://h5-1258069360.cos.ap-guangzhou.myqcloud.com/other/sdk/NativeAD/IconClose.png",
    ];

    var self = this;

    console.log("TYQSDK", "开始加载原生广告角标资源");

    SdkTools.loadImage(urlList, (err, texture) => {
      if (err) {
        console.log("TYQSDK", "原生广告角标资源加载错误" + err);
        if (self.nativeIconErrorTimes < 5) {
          self.nativeIconErrorTimes++;
          self.loadNativeIconRes();
        }
        return;
      }
      self.isLoadIconTip = true;
      console.log("TYQSDK", "原生广告角标资源加载成功");
      self.ICONInfo.iconButton = texture[0];
      self.ICONInfo.iconClose = texture[1];
    });
  }


  /**
   * 加载互推ICON资源
   */
  public loadNavigateIconRes() {
    console.log('TYQSDK', '开始加载互推ICON资源');
    var self = this;
    this.navigateUITextures = {
      maskTexture: null,
      bgTexture: null,
      moreGameTexture: null
    }
    var iconUIUrlList =
      [
        "https://h5-1258069360.cos.ap-guangzhou.myqcloud.com/other/sdk/NativeAD/mask.png",
        "https://h5-1258069360.cos.ap-guangzhou.myqcloud.com/other/sdk/NativeAD/iconBg.png",
        "https://tencentcnd.minigame.xplaymobile.com/Other/SDK/SDKImage_3_0/NavigateIconRes/morgametitle.png"
      ]
    SdkTools.loadImage(iconUIUrlList, (err, ArrImage) => {
      if (err) {
        console.log("TYQSDK", "互推ICON资源加载错误:" + JSON.stringify(err));
        return;
      }
      self.navigateUITextures.maskTexture = ArrImage[0];
      self.navigateUITextures.bgTexture = ArrImage[1];
      self.navigateUITextures.moreGameTexture = ArrImage[2];
      self.isLoadNavigateIcon = true;
      console.log('TYQSDK', '互推ICON资源加载成功');
    })
    this.loadNavigateList();
  }


  /**
   * 加载互推列表资源
   */
  public loadNavigateGroup() {
    console.log("TYQSDK", "开始加载互推列表资源");
    var self = this;
    this.navigateGroupUITextures = {
      iconBtn: null,
      iconMask: null,
      leftTuck: null,
      rightTuck: null,
      moreGameGroupLeft: null,
      moreGameGroupRight: null,
    }
    var iconUIUrlList =
      [
        "https://tencentcnd.minigame.xplaymobile.com/Other/SDK/SDKImage_3_0/NewNavigateGroupRes/iconBtn.png",
        "https://tencentcnd.minigame.xplaymobile.com/Other/SDK/SDKImage_3_0/NewNavigateGroupRes/iconMask.png",
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
      self.navigateGroupUITextures.iconBtn = ArrImage[0];
      self.navigateGroupUITextures.iconMask = ArrImage[1];
      self.navigateGroupUITextures.leftTuck = ArrImage[2];
      self.navigateGroupUITextures.rightTuck = ArrImage[3];
      self.navigateGroupUITextures.moreGameGroupLeft = ArrImage[4];
      self.navigateGroupUITextures.moreGameGroupRight = ArrImage[5];
      self.isLoadNavigateGroup = true;
      console.log("TYQSDK", "互推列表资源加载成功");
    })
    this.loadNavigateList();
  }


  /**
   * 加载结算互推资源
   */
  public loadNavigateSettleRes() {

    var self = this;
    this.navigateSettleUITextures = {
      navigateSettleGroup: null,
      navigateSettletitleBg: null,
      mask: null,
      iconWihte: null,
      navigateSettle4Bg: null,
      newMask: null,
      newIconWihte: null,
      navigateSettle1Bg: null,
      iconMask: null,
      iconNameBg: null,
      iconYellow: null,
    }
    var settleUIUrlList =
      [
        "https://tencentcnd.minigame.xplaymobile.com/Other/SDK/SDKImage_3_0/NavigateSettleRes/navigateSettleGroup.png",
        "https://tencentcnd.minigame.xplaymobile.com/Other/SDK/SDKImage_3_0/NavigateSettleRes/navigateSettletitleBg.png",
        "https://tencentcnd.minigame.xplaymobile.com/Other/SDK/SDKImage_3_0/NavigateSettleRes/settleIcon.png",
        "https://tencentcnd.minigame.xplaymobile.com/Other/SDK/SDKImage_3_0/NavigateSettleRes/iconWihte.png",
        "https://tencentcnd.minigame.xplaymobile.com/Other/SDK/SDKImage_3_0/NewNavigateSettleRes/navigateSettle4Bg.png",
        "https://tencentcnd.minigame.xplaymobile.com/Other/SDK/SDKImage_3_0/NavigateSettleRes/newMask3.png",
        "https://tencentcnd.minigame.xplaymobile.com/Other/SDK/SDKImage_3_0/NavigateSettleRes/newIconWihte3.png",
        "https://tencentcnd.minigame.xplaymobile.com/Other/SDK/SDKImage_3_0/NewNavigateSettleRes/navigateSettle1Bg.png",
        "https://tencentcnd.minigame.xplaymobile.com/Other/SDK/SDKImage_3_0/NewNavigateSettleRes/mask.png",
        "https://tencentcnd.minigame.xplaymobile.com/Other/SDK/SDKImage_3_0/NewNavigateSettleRes/iconNameBg.png",
        "https://tencentcnd.minigame.xplaymobile.com/Other/SDK/SDKImage_3_0/NewNavigateSettleRes/iconYellow.png",
      ]
    SdkTools.loadImage(settleUIUrlList, (err, ArrImage) => {
      if (err) {
        console.log("TYQSDK", "结算互推资源加载错误" + JSON.stringify(err));
        return;
      }
      self.navigateSettleUITextures.navigateSettleGroup = ArrImage[0];
      self.navigateSettleUITextures.navigateSettletitleBg = ArrImage[1];
      self.navigateSettleUITextures.mask = ArrImage[2];
      self.navigateSettleUITextures.iconWihte = ArrImage[3];
      self.navigateSettleUITextures.navigateSettle4Bg = ArrImage[4];
      self.navigateSettleUITextures.newMask = ArrImage[5];
      self.navigateSettleUITextures.newIconWihte = ArrImage[6];
      self.navigateSettleUITextures.navigateSettle1Bg = ArrImage[7];
      self.navigateSettleUITextures.iconMask = ArrImage[8];
      self.navigateSettleUITextures.iconNameBg = ArrImage[9];
      self.navigateSettleUITextures.iconYellow = ArrImage[10];
      self.isLoadNavigateSettle = true;
      console.log("TYQSDK", "结算互推资源加载成功");
    })
    this.loadNavigateList();
  }


  /**
   * 加载互推资源列表
   */
  public loadNavigateList() {
    var self = this;
    let navigateListNum = 0;
    let navigateList = NavigateController.getInstance().navigateList;
    for (let i = 0; i < navigateList.length; i++) {
      cc.loader.load(navigateList[i].pushGamePicture, (err, texture) => {
        if (err) {
          console.log("TYQSDK", `icon${i}加载失败`);
          cc.loader.load('https://tencentcnd.minigame.xplaymobile.com/Other/SDK/SDKImage_3_0/NavigateIconRes/noIconImage.png', (err, texture) => {
            navigateListNum++;
            if (err) {
              self.NavigateIconTextureList[i] = null;
            }
            else {
              self.NavigateIconTextureList[i] = texture;
              if (navigateListNum >= navigateList.length) {
                self.isLoadNavigateList = true;
              }
            }
          });
        }
        else {
          self.NavigateIconTextureList[i] = texture;
          navigateListNum++;
          if (navigateListNum >= navigateList.length) {
            self.isLoadNavigateList = true;
          }
        }
      });
    }
  }


  /**
   * 展示原生插屏
   * @param nativeInfo 原生信息
   * @param uiInfo     ui资源
   */
  showNativeIntersUI(nativeInfo) {
    console.log("TYQSDK", "showNativeIntersUI===========================")
    var layerBg = new cc.Node("layerBg");
    layerBg.addComponent(cc.Sprite);
    layerBg.getComponent(cc.Sprite).spriteFrame = new cc.SpriteFrame(this.NIUIInfo.layerBg);
    layerBg.active = false;
    setTimeout(() => {
      layerBg.active = true;
      layerBg.width = 2560;
      layerBg.height = 2560;
      layerBg.x = cc.winSize.width / 2;
      layerBg.y = cc.winSize.height / 2;
    }, 0.5);
    layerBg.zIndex = 30003;

    layerBg.opacity = 150;

    layerBg.attr({ adId: nativeInfo.adId });
    var scene = cc.director.getScene();

    scene.addChild(layerBg);
    if (this.cocosGroup != '') {
      layerBg.group = this.cocosGroup;
    }
    layerBg.on(cc.Node.EventType.TOUCH_START, function (event) {
    })

    var bg = new cc.Node("bg");
    bg.addComponent(cc.Sprite);

    var spFrame = new cc.SpriteFrame(this.NIUIInfo.bg);
    bg.getComponent(cc.Sprite).spriteFrame = spFrame;
    bg.zIndex = 30010;

    if (cc.winSize.width < cc.winSize.height) {

      setTimeout(() => {
        bg.width = cc.winSize.width - 100;
        bg.height = bg.width * 0.89;
        bg.x = cc.winSize.width / 2;
        bg.y = cc.winSize.height / 2 + 100;
      }, 1);
      scene.addChild(bg);
      if (this.cocosGroup != '') {
        bg.group = this.cocosGroup;
      }

      //ad标识
      var ad = new cc.Node("ad");
      ad.addComponent(cc.Sprite);
      ad.getComponent(cc.Sprite).spriteFrame = new cc.SpriteFrame(this.NIUIInfo.ad);

      setTimeout(() => {
        // ad.width = bg.width - 200;
        // ad.height = button.width * 0.382;

        ad.x = bg.x;
        ad.y = bg.y - bg.height / 2 - button.height / 2 - 30;
        ad.zIndex = 30010;
      }, 1);

      scene.addChild(ad);

      var button = new cc.Node("button");
      button.addComponent(cc.Sprite);
      button.getComponent(cc.Sprite).spriteFrame = new cc.SpriteFrame(this.NIUIInfo.button);

      setTimeout(() => {
        button.width = bg.width - 200;
        button.height = button.width * 0.382;

        button.x = bg.x;
        button.y = bg.y - bg.height / 2 - button.height / 2 - 30;
        button.zIndex = 30010;
      }, 1);

      scene.addChild(button);

      let tempid = nativeInfo.adId
      //点击原生插屏
      button.on(cc.Node.EventType.TOUCH_START, function (event) {
        NativeController.getInstance().reportNativeClick(tempid);
        if (SdkTools.getPlatform() == Game_Platform.GP_HW) {
          IntersController.getInstance().intersNowTime = 0;
          scene.removeChild(layerBg);
          scene.removeChild(bg);
          scene.removeChild(button);
        }
      });

      if (this.cocosGroup != '') {
        button.group = this.cocosGroup;
      }
    }
    else {
      setTimeout(() => {
        bg.height = cc.winSize.height - 200;
        bg.width = bg.height / 0.89;

        bg.x = cc.winSize.width / 2;
        bg.y = cc.winSize.height / 2;
      }, 0.5);

      scene.addChild(bg);
      if (this.cocosGroup != '') {
        bg.group = this.cocosGroup;
      }
    }

    let tempid = nativeInfo.adId
    //点击原生插屏
    bg.on(cc.Node.EventType.TOUCH_START, function (event) {
      NativeController.getInstance().reportNativeClick(tempid);
      if (SdkTools.getPlatform() == Game_Platform.GP_HW) {
        IntersController.getInstance().intersNowTime = 0;
        scene.removeChild(layerBg);
        scene.removeChild(bg);
        scene.removeChild(button);
      }
    });

    var titleLabel = new cc.Node("titleLabel");
    titleLabel.addComponent(cc.Label);
    titleLabel.getComponent(cc.Label).fontSize = 30;
    if (nativeInfo.title.length >= 10) nativeInfo.title = nativeInfo.title.substring(0, 10);
    if (nativeInfo.desc.length >= 10) nativeInfo.desc = nativeInfo.desc.substring(0, 10);
    titleLabel.getComponent(cc.Label).string = nativeInfo.title;

    titleLabel.color = cc.color(0xCC, 0x7C, 0x70);
    bg.addChild(titleLabel);


    if (NativeController.getInstance().getImageNativeFlag()) {
      console.log("TYQSDK", "原生插屏广告大图优先")
      var descLabel = new cc.Node("descLabel");
      descLabel.addComponent(cc.Label);
      descLabel.getComponent(cc.Label).string = nativeInfo.desc;
      descLabel.getComponent(cc.Label).fontSize = 30;
      descLabel.color = cc.color(0x99, 0x7C, 0x70);
      bg.addChild(descLabel);

      var bigImage = new cc.Node("icon");
      bigImage.addComponent(cc.Sprite);
      bigImage.getComponent(cc.Sprite).spriteFrame = new cc.SpriteFrame(nativeInfo.Native_BigImage);

      setTimeout(() => {
        titleLabel.y = bg.height / 2 - titleLabel.height / 2 - bg.height * 0.15;
        descLabel.x = 0;
        descLabel.y = bg.height * 0.18;

        bigImage.width = bg.height * 0.8;
        bigImage.height = bg.height * 0.4;

        bigImage.x = 0;
        bigImage.y = bg.height * -0.085;

      }, 1);

      bg.addChild(bigImage);

    }
    else if (NativeController.getInstance().getIconNativeFlag()) {
      console.log("TYQSDK", "原生插屏广告ICON展示")
      var descLabel = new cc.Node("descLabel");
      descLabel.addComponent(cc.Label);
      descLabel.getComponent(cc.Label).string = nativeInfo.desc;
      descLabel.getComponent(cc.Label).fontSize = 30;
      descLabel.color = cc.color(0x00, 0x00, 0x00);
      bg.addChild(descLabel);

      var icon = new cc.Node("icon");
      icon.addComponent(cc.Sprite);
      icon.getComponent(cc.Sprite).spriteFrame = new cc.SpriteFrame(nativeInfo.Native_icon);
      bg.addChild(icon);

      setTimeout(() => {
        titleLabel.y = bg.height / 2 - titleLabel.height / 2 - bg.height * 0.15;
        descLabel.x = 0;
        descLabel.y = -bg.height * 0.33;

        icon.height = bg.height * 0.55;
        icon.width = icon.height;

        icon.x = 0;
        icon.y = 0;

      }, 1);
    }

    var exit = new cc.Node("exit");
    exit.addComponent(cc.Sprite);
    exit.getComponent(cc.Sprite).spriteFrame = new cc.SpriteFrame(this.NIUIInfo.exit);

    exit.zIndex = 30010;
    exit.addComponent(cc.Button);
    setTimeout(() => {
      exit.x = bg.width / 2 - exit.width / 2 * 1.25 * bg.width / 914 - bg.width * 0.07;
      exit.y = bg.height / 2 - exit.width / 2 * 1.25 * bg.width / 914 - bg.width * 0.07;
      exit.scale = bg.width / 914;
    }, 1);
    //exit.runAction(cc.repeatForever(cc.sequence(cc.scaleTo(0.5,bg.width/914 * 1.2),cc.scaleTo(0.5,bg.width/914))));
    bg.addChild(exit);

    NativeController.getInstance().nativeAdShowInfo[1] = tempid;

    var self = this;
    //关闭按钮
    exit.on(cc.Node.EventType.TOUCH_START, function (event) {
      IntersController.getInstance().intersNowTime = 0;
      NativeController.getInstance().nativeAdShowInfo[1] = "";
      scene.removeChild(layerBg);
      scene.removeChild(bg);
      scene.removeChild(button);
      event.stopPropagation();
    });
  }


  /**
   * 展示BannerUI
   */
  public showNativeBannerUI(nativeInfo) {
    var scene = cc.director.getScene();
    if (this.nativeBanner && scene.getChildByName('nativeBanner')) {
      console.log("TYQSDK", "已存在原生banner return");
      return;
    }

    //原生广告id
    let tempid = nativeInfo.adId

    NativeController.getInstance().reportNativeShow(tempid);

    console.log('TYQSDK', 'showNativeBanner========================')

    this.nativeBanner = new cc.Node("nativeBanner");
    this.nativeBanner.addComponent(cc.Sprite);
    this.nativeBanner.getComponent(cc.Sprite).spriteFrame = new cc.SpriteFrame(this.NativeBannerUIInfo.bannerBg);
    this.nativeBanner.addComponent(cc.Widget);
    this.nativeBanner.getComponent(cc.Widget).isAlignHorizontalCenter = true;
    scene.addChild(this.nativeBanner);
    if (cc.winSize.width < cc.winSize.height) {
      this.nativeBanner.width = cc.winSize.width;
      this.nativeBanner.height = cc.winSize.width * 0.18;
    }
    else {
      this.nativeBanner.width = cc.winSize.width / 2;
      this.nativeBanner.height = this.nativeBanner.width * 0.18;
    }
    this.nativeBanner.y = this.nativeBanner.height / 2;

    var resolution = JSON.stringify(cc.view.getResolutionPolicy())
    var viewScaleHeight = JSON.parse(resolution)._contentStrategy._result.viewport.height

    if (typeof viewScaleHeight != undefined && viewScaleHeight && viewScaleHeight != SdkTools.getInstance().getSystemInfo().screenHeight && cc.winSize.height > cc.winSize.width && SdkTools.getInstance().getSystemInfo().screenHeight != 0) {
      var viewScale = viewScaleHeight / cc.winSize.height;
      this.nativeBanner.y = this.nativeBanner.height / 2 - (SdkTools.getInstance().getSystemInfo().screenHeight - viewScaleHeight) / 2 / viewScale;
    }
    this.nativeBanner.zIndex = 29998;

    this.nativeBanner.on(cc.Node.EventType.TOUCH_START, function (event) {
      NativeController.getInstance().reportNativeClick(tempid);
      if (SdkTools.getPlatform() == Game_Platform.GP_HW) {
        let bannerController = BannerController.getInstance();
        console.log("TYQSDK", "原生banner关闭", bannerController.NUM_BannerUpdateTime + "S后再次刷新");
        self.hideNativeBannerUI();
        // 广告关闭统计
        bannerController.bannerClose();
        bannerController.updateBanner();
      }
    });


    if (this.cocosGroup != '') {
      this.nativeBanner.group = this.cocosGroup;
    }

    var adTip = new cc.Node("adTip");
    adTip.addComponent(cc.Sprite);
    adTip.getComponent(cc.Sprite).spriteFrame = new cc.SpriteFrame(this.NativeBannerUIInfo.bannerTip);
    this.nativeBanner.addChild(adTip);
    adTip.height = 0.2 * this.nativeBanner.height;
    adTip.width = adTip.height / 0.45;
    adTip.x = this.nativeBanner.width / 2 - adTip.width / 2;
    adTip.y = this.nativeBanner.height / 2 - adTip.height / 2;


    var bannerButton = new cc.Node("bannerButton");
    if (SdkTools.getPlatform() == Game_Platform.GP_HW) bannerButton.active = false;
    bannerButton.addComponent(cc.Sprite);
    bannerButton.getComponent(cc.Sprite).spriteFrame = new cc.SpriteFrame(this.NativeBannerUIInfo.bannerButton);
    this.nativeBanner.addChild(bannerButton);
    bannerButton.width = this.nativeBanner.width * 0.255;
    bannerButton.height = bannerButton.width * 0.351;
    bannerButton.x = this.nativeBanner.width / 2 - this.nativeBanner.width * 0.185;
    bannerButton.y = 0;

    if (NativeController.getInstance().getImageNativeFlag()) {
      var image = new cc.Node("image");
      image.addComponent(cc.Sprite);
      image.getComponent(cc.Sprite).spriteFrame = new cc.SpriteFrame(nativeInfo.Native_BigImage);
      this.nativeBanner.addChild(image);
      image.height = this.nativeBanner.height;
      image.width = image.height * 2;
      image.x = image.width / 2 - this.nativeBanner.width / 2;
      image.y = 0;

      var titleLabel = new cc.Node("titleLabel");
      titleLabel.addComponent(cc.Label);
      titleLabel.getComponent(cc.Label).fontSize = 25;
      if (nativeInfo.desc == "") {
        titleLabel.getComponent(cc.Label).string = nativeInfo.title;
      } else {
        titleLabel.getComponent(cc.Label).string = nativeInfo.desc;
      }
      titleLabel.getComponent(cc.Label).overflow = cc.Label.Overflow.CLAMP;
      titleLabel.getComponent(cc.Label).horizontalAlign = cc.Label.HorizontalAlign.LEFT;
      titleLabel.getComponent(cc.Label).verticalAlign = cc.Label.VerticalAlign.CENTER;
      titleLabel.color = cc.color(0xFF, 0x00, 0x00);
      this.nativeBanner.addChild(titleLabel);

      titleLabel.width = this.nativeBanner.width - image.width - bannerButton.width - 0.2 * this.nativeBanner.height / 0.45;
      titleLabel.height = this.nativeBanner.height;
      titleLabel.y = 0;
      titleLabel.x = -this.nativeBanner.width / 2 + this.nativeBanner.height * 2.2 + titleLabel.width / 2;

    } else if (NativeController.getInstance().getIconNativeFlag()) {
      var icon = new cc.Node("icon");
      icon.addComponent(cc.Sprite);
      icon.getComponent(cc.Sprite).spriteFrame = new cc.SpriteFrame(nativeInfo.Native_icon);
      this.nativeBanner.addChild(icon);
      icon.width = this.nativeBanner.height * 0.8;
      icon.height = this.nativeBanner.height * 0.8;
      icon.x = -this.nativeBanner.width / 2 + icon.width * 0.8;
      icon.y = 0;

      var titleLabel = new cc.Node("titleLabel");
      titleLabel.addComponent(cc.Label);
      titleLabel.getComponent(cc.Label).fontSize = 25;
      if (nativeInfo.desc == "") {
        titleLabel.getComponent(cc.Label).string = nativeInfo.title;
      } else {
        titleLabel.getComponent(cc.Label).string = nativeInfo.desc;
      }
      titleLabel.getComponent(cc.Label).overflow = cc.Label.Overflow.CLAMP;
      titleLabel.getComponent(cc.Label).horizontalAlign = cc.Label.HorizontalAlign.LEFT;
      titleLabel.getComponent(cc.Label).verticalAlign = cc.Label.VerticalAlign.CENTER;
      titleLabel.color = cc.color(0xFF, 0x00, 0x00);
      this.nativeBanner.addChild(titleLabel);

      titleLabel.width = this.nativeBanner.width - icon.width - bannerButton.width - 0.2 * this.nativeBanner.height / 0.45;
      titleLabel.height = this.nativeBanner.height;
      titleLabel.y = 0;
      titleLabel.x = -this.nativeBanner.width / 2 + this.nativeBanner.height * 1.5 + titleLabel.width / 2;
    }

    var closeICON = new cc.Node("closeICON");
    closeICON.addComponent(cc.Sprite);
    closeICON.getComponent(cc.Sprite).spriteFrame = new cc.SpriteFrame(this.NativeBannerUIInfo.bannerClose);
    this.nativeBanner.addChild(closeICON);
    closeICON.width = 0.27 * this.nativeBanner.height;
    closeICON.height = 0.27 * this.nativeBanner.height;
    closeICON.x = -this.nativeBanner.width / 2 + closeICON.width / 2;
    closeICON.y = this.nativeBanner.height / 2 - closeICON.width / 2;

    var closeButton = new cc.Node("closeButton");
    this.nativeBanner.addChild(closeButton);
    closeButton.width = closeICON.height;
    closeButton.height = closeICON.height;
    closeButton.x = -this.nativeBanner.width / 2 + closeICON.width / 2;
    closeButton.y = this.nativeBanner.height / 2 - closeICON.width / 2;
    closeButton.zIndex = 29999;

    NativeController.getInstance().nativeAdShowInfo[0] = tempid;

    let self = this;
    // 监听原生banner关闭
    closeButton.on(cc.Node.EventType.TOUCH_START, function (event) {
      let bannerController = BannerController.getInstance();
      console.log("TYQSDK", "原生banner关闭", bannerController.NUM_BannerUpdateTime + "S后再次刷新");
      NativeController.getInstance().nativeAdShowInfo[0] = "";
      self.hideNativeBannerUI();
      // 广告关闭统计
      bannerController.bannerClose();
      bannerController.updateBanner();
      // 清除触摸事件的冒泡
      event.stopPropagation();
    });

  }
  /**
   *  隐藏原生Banner
   */
  public hideNativeBannerUI() {
    NativeController.getInstance().nativeAdShowInfo[0] = "";
    if (this.nativeBanner) {
      console.log("TYQSDK", "hideNativeBannerUI===========================");
      this.nativeBanner.removeFromParent();
      this.nativeBanner = null;
    }
  }


  /**
   *  展示原生ICON
   */
  public showNativeIconUI(width, height, x, y, nativeInfo) {
    console.log("TYQSDK", "showNativeICON===========================");

    this.nativeIcon = new cc.Node("icon");
    this.nativeIcon.addComponent(cc.Sprite);
    this.nativeIcon.getComponent(cc.Sprite).spriteFrame = new cc.SpriteFrame(nativeInfo.Native_icon);
    this.nativeIcon.scale = 0;
    this.nativeIcon.active = false;
    this.nativeIcon.zIndex = 30000;
    setTimeout(() => {
      this.nativeIcon.active = true;
      this.nativeIcon.width = width;
      this.nativeIcon.height = height;
      this.nativeIcon.x = x;
      this.nativeIcon.y = y;
      this.nativeIcon.scale = 1;
    }, 1);
    var scene = cc.director.getScene();
    scene.addChild(this.nativeIcon);

    if (this.cocosGroup != '') {
      this.nativeIcon.group = this.cocosGroup;
    }

    var ICONTip = new cc.Node("ICONInfo");
    ICONTip.addComponent(cc.Sprite);
    ICONTip.getComponent(cc.Sprite).spriteFrame = new cc.SpriteFrame(this.ICONInfo.iconButton);
    setTimeout(() => {
      ICONTip.width = width / 3;
      ICONTip.height = ICONTip.width / 70 * 34;
      ICONTip.x = width / 2 - ICONTip.width / 2;
      ICONTip.y = height / 2 - ICONTip.height / 2;
    }, 1);
    this.nativeIcon.addChild(ICONTip);

    var ICONClose = new cc.Node("ICONClose");
    ICONClose.addComponent(cc.Sprite);
    ICONClose.getComponent(cc.Sprite).spriteFrame = new cc.SpriteFrame(this.ICONInfo.iconClose);
    setTimeout(() => {
      ICONClose.width = 45;
      ICONClose.height = 45;
      ICONClose.x = -this.nativeIcon.width / 2 + ICONClose.width / 2;
      ICONClose.y = this.nativeIcon.height / 2 - ICONClose.width / 2;
    }, 1);
    this.nativeIcon.addChild(ICONClose);

    var titleLabel = new cc.Node("titleLabel");
    titleLabel.addComponent(cc.Label);
    titleLabel.getComponent(cc.Label).fontSize = 20;
    if (nativeInfo.title.length <= 5) {
      titleLabel.getComponent(cc.Label).string = nativeInfo.title;
    } else {
      titleLabel.getComponent(cc.Label).string = "";
    }
    titleLabel.y = -height / 2 - 30;
    titleLabel.color = cc.color(0xFF, 0xFF, 0xFF);
    this.nativeIcon.addChild(titleLabel);

    let self = this;
    //关闭原生ICON广告
    ICONClose.on(cc.Node.EventType.TOUCH_START, function (event) {
      console.log("TYQSDK", "手动关闭原生ICON");
      self.nativeIcon.removeFromParent();
      event.stopPropagation();
    })

    //点击原生广告
    let tempid = nativeInfo.adId
    this.tempid=tempid;
    this.nativeIcon.on(cc.Node.EventType.TOUCH_START, function (event) {
      console.log("TYQSDK", "点击原生ICON");
      NativeController.getInstance().reportNativeClick(tempid)
    });
  }
 
  
  public ShowPrimeval(){
      console.log("TYQSDK", "点击原生ICON");
      if(this.tempid==0){
        console.log("TYQSDK", ",没有原生广告上报展示id");
        return;
      }
      NativeController.getInstance().reportNativeClick(this.tempid)
  }
  /**
   * 隐藏原生ICON
   */
  public hideNativeIconUI() {
    if (this.nativeIcon) {
      this.nativeIcon.removeFromParent();
      this.nativeIcon = null;
      console.log("TYQSDK", "hideNativeIconUI===========================")
    }
    else {
      console.log("TYQSDK", "不存在原生ICON");
      return;
    }
  }

  /**
   *  展示原生大图
   */
  public showNativeImageUI(width, height, x, y, nativeInfo) {

    console.log("TYQSDK", "showNativeImageUI===========================");

    this.nativeImage = new cc.Node("nativeImage");
    this.nativeImage.addComponent(cc.Sprite);
    this.nativeImage.getComponent(cc.Sprite).spriteFrame = new cc.SpriteFrame(nativeInfo.Native_BigImage);
    this.nativeImage.scale = 0;
    this.nativeImage.active = false;
    this.nativeImage.zIndex = 30000;
    setTimeout(() => {
      this.nativeImage.active = true;
      this.nativeImage.width = width;
      this.nativeImage.height = height;
      this.nativeImage.x = x;
      this.nativeImage.y = y;
      this.nativeImage.scale = 1;
    }, 1);
    var scene = cc.director.getScene();
    scene.addChild(this.nativeImage);

    if (this.cocosGroup != '') {
      this.nativeImage.group = this.cocosGroup;
    }

    var ICONTip = new cc.Node("ICONInfo");
    ICONTip.addComponent(cc.Sprite);
    ICONTip.getComponent(cc.Sprite).spriteFrame = new cc.SpriteFrame(this.ICONInfo.iconButton);
    setTimeout(() => {
      ICONTip.width = width / 5;
      ICONTip.height = ICONTip.width / 70 * 34;
      ICONTip.x = width / 2 - ICONTip.width / 2;
      ICONTip.y = height / 2 - ICONTip.height / 2;
    }, 1);
    this.nativeImage.addChild(ICONTip);

    var ICONClose = new cc.Node("ICONClose");
    ICONClose.addComponent(cc.Sprite);
    ICONClose.getComponent(cc.Sprite).spriteFrame = new cc.SpriteFrame(this.ICONInfo.iconClose);
    setTimeout(() => {
      ICONClose.width = 45;
      ICONClose.height = 45;
      ICONClose.x = -this.nativeImage.width / 2 + ICONClose.width / 2;
      ICONClose.y = this.nativeImage.height / 2 - ICONClose.width / 2;
    }, 1);
    this.nativeImage.addChild(ICONClose);

    let self = this;
    //关闭原生大图广告
    ICONClose.on(cc.Node.EventType.TOUCH_START, function (event) {
      console.log("TYQSDK", "手动关闭原生大图");
      self.nativeImage.removeFromParent();
      event.stopPropagation();
    })

    //点击原生广告
    let tempid = nativeInfo.adId
    this.tempid=tempid;
    this.nativeImage.on(cc.Node.EventType.TOUCH_START, function (event) {
      console.log("TYQSDK", "点击原生大图");
      NativeController.getInstance().reportNativeClick(tempid)
    });

  }
  /**
   * 隐藏原生大图
   */
  public hideNativeImageUI() {
    if (this.nativeImage) {
      this.nativeImage.removeFromParent();
      this.nativeImage = null;
      console.log("TYQSDK", "hideNativeImageUI===========================")
    }
    else {
      console.log("TYQSDK", "不存在原生大图 return");
      return;
    }
  }


  /**
   * 展示互推ICON
   */
  public showNavigateIcon(width, height, x, y) {

    if (this.navigateBg) {
      console.log("TYQSDK", "已存在互推ICON return");
      return;
    }

    console.log("TYQSDK", "showNavigateIcon===========================");

    var self = this;
    var scene = cc.director.getScene();

    this.navigateBg = new cc.Node("navigateBg");
    this.navigateBg.addComponent(cc.Sprite);
    this.navigateBg.getComponent(cc.Sprite).spriteFrame = new cc.SpriteFrame(this.navigateUITextures.bgTexture);
    setTimeout(() => {
      this.navigateBg.width = width;
      this.navigateBg.height = height;
      this.navigateBg.x = x;
      this.navigateBg.y = y;
    }, 0.5);

    this.navigateBg.runAction(cc.repeatForever(cc.sequence(cc.scaleBy(0.2, 1.1), cc.rotateTo(0.1, 30), cc.rotateTo(0.1, -25), cc.rotateTo(0.1, 20), cc.rotateTo(0.1, 0), cc.scaleBy(0.2, 1 / 1.1), cc.delayTime(5.0))));

    this.navigateBg.on(cc.Node.EventType.TOUCH_START, function (event) {
      self.jumpToMiniGame(self.navigateInfom);
    });

    scene.addChild(this.navigateBg);
    if (this.cocosGroup != '') {
      this.navigateBg.group = this.cocosGroup;
    }
    this.navigateBg.zIndex = 29999;

    var mask = new cc.Node("mask");
    mask.addComponent(cc.Mask);
    mask.getComponent(cc.Mask).type = cc.Mask.Type.IMAGE_STENCIL;
    mask.getComponent(cc.Mask).spriteFrame = new cc.SpriteFrame(this.navigateUITextures.maskTexture);
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
    title.getComponent(cc.Sprite).spriteFrame = new cc.SpriteFrame(this.navigateUITextures.moreGameTexture);
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
    this.navigateIconTimeInterval = setInterval(iconupdate, 30 * 1000);
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
      return this.NavigateIconTextureList[index];
    }
  }
  /**
   * 隐藏互推ICON
   * @param inform 
   */
  public hideNavigateIcon() {
    console.log("TYQSDK", "hideNavigateIcon===========================")
    var scene = cc.director.getScene();
    NavigateController.getInstance().isNavigateIconShow = false;
    if (this.navigateBg) {
      this.navigateBg.removeFromParent();
      this.navigateBg = null;
    }
    this.navigateIconTimeInterval && clearInterval(this.navigateIconTimeInterval);
  }

  /**
   * 展示互推列表
   */
  public showNavigateGroup(type: string, side: string, size: number, y: number) {

    if (!this.isLoadNavigateGroup) {
      console.log("TYQSDK", "互推列表未加载完成");
      return;
    }

    if (this.navigateGroupBg) {
      console.log("TYQSDK", "已存在互推列表 return");
      return;
    }

    let Navigate = NavigateController.getInstance();
    if (Navigate.navigateList.length < 6) {
      console.log("TYQSDK", "互推游戏数量小于6个");
      return;
    }

    console.log("TYQSDK", "showNavigateGroup===========================");

    // 正在展示互推列表
    Navigate.isNavigateGroupShow = true;

    if (y == undefined || y == null) y = 0;

    // 定时器,隐藏互推列表按钮
    let navigateGroupHideFunc = () => {
      iconBtn.width = size;
      iconBtn.height = size;

      if (this.navigateGroupHideTmt) {
        clearTimeout(this.navigateGroupHideTmt);
        this.navigateGroupHideTmt = null;
      }

      if (!isOpenNavigateGroup && iconBtn.active) {
        this.navigateGroupHideTmt =
          setTimeout(() => {
            console.log("TYQSDK", "隐藏一半互推列表icon");
            cc.tween(iconBtn)
              .by(0.5, { position: cc.v3(iconBtn.x <= 0 ? -iconBtn.width / 2 : iconBtn.width / 2, 0, 0) })
              .start()
          }, 10000);
      }
    }


    let scene = cc.director.getScene();


    // 互推列表背景
    this.navigateGroupBg = new cc.Node("navigateGroupBg");
    scene.addChild(this.navigateGroupBg);
    this.navigateGroupBg.x = cc.winSize.width / 2;
    this.navigateGroupBg.y = cc.winSize.height / 2;
    if (this.cocosGroup != "") this.navigateGroupBg.group = this.cocosGroup;

    // 互推列表icon按钮
    let iconBtn = new cc.Node("iconBtn");
    this.navigateGroupBg.addChild(iconBtn);
    iconBtn.addComponent(cc.Sprite);
    iconBtn.getComponent(cc.Sprite).spriteFrame = new cc.SpriteFrame(this.navigateGroupUITextures.iconBtn);
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

      let AllNavigateGameList = Navigate.navigateList;
      var dataArr = [];
      for (let index = 0; index < AllNavigateGameList.length; index++) {
        dataArr[index] = AllNavigateGameList[index];
        dataArr[index].index = index;
      }
      var getInfom = () => {
        // 总权重
        var allWeight = 0;
        for (var i = 0; i < dataArr.length; i++) {
          allWeight += dataArr[i].sort;
        }

        var random = Math.floor(Math.random() * allWeight);
        var weightNow = 0;
        for (let i = 0; i < dataArr.length; i++) {
          // 如果随机数大于等于当前权重 并且 随机数小于 当前权重+下一个游戏的权重
          if (random >= weightNow && random < weightNow + dataArr[i].sort) {
            // 返回这个游戏在所有互推游戏中的索引
            var inform = dataArr[i];
            // 删除这个游戏
            dataArr.splice(i, 1);
            return inform;
          }
          // 否则当前权重继续增加下一个游戏的权重
          weightNow += dataArr[i].sort;
        }
      }

      /**
       * 是否已打开互推列表
       */
      if (left) {
        console.log("TYQSDK", "在左侧打开互推游戏列表");
        iconBtn.active = false;
        // 互推游戏列表 左
        let moreGameGroupLeft = new cc.Node("moreGameGroupLeft");
        this.navigateGroupBg.addChild(moreGameGroupLeft);
        moreGameGroupLeft.addComponent(cc.Sprite);
        moreGameGroupLeft.getComponent(cc.Sprite).spriteFrame = new cc.SpriteFrame(this.navigateGroupUITextures.moreGameGroupLeft);
        // 竖屏
        moreGameGroupLeft.height = cc.winSize.height / 2;
        moreGameGroupLeft.width = moreGameGroupLeft.height / 4.8;
        moreGameGroupLeft.x = -moreGameGroupLeft.width / 2 - cc.winSize.width / 2;
        moreGameGroupLeft.y = 0;
        cc.tween(moreGameGroupLeft)
          .by(0.2, { position: cc.v3(moreGameGroupLeft.width, 0, 0) })
          .call(() => {
            isOpenNavigateGroup = true;
            navigateGroupHideFunc();
          })
          .start();

        // 左侧缩进按钮
        let leftTuck = new cc.Node();
        moreGameGroupLeft.addChild(leftTuck);
        leftTuck.addComponent(cc.Sprite);
        leftTuck.getComponent(cc.Sprite).spriteFrame = new cc.SpriteFrame(this.navigateGroupUITextures.leftTuck);
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
              navigateGroupHideFunc();
              moreGameGroupLeft.destroy();
            })
            .start();
        })

        // icon区域遮罩
        let iconAreaMask = new cc.Node();
        moreGameGroupLeft.addChild(iconAreaMask);
        iconAreaMask.addComponent(cc.Mask);
        iconAreaMask.getComponent(cc.Mask).type = 0;
        iconAreaMask.width = moreGameGroupLeft.width * 0.8;
        iconAreaMask.height = moreGameGroupLeft.height * 0.85;
        iconAreaMask.x = -moreGameGroupLeft.width / 13;
        iconAreaMask.y = -moreGameGroupLeft.height / 22;

        var iconArea = new cc.Node();
        iconAreaMask.addChild(iconArea);
        iconArea.x = 0;
        iconArea.y = 0;


        // icon 6为互推游戏的个数
        for (let i = 0; i < 6; i++) {
          let inform = getInfom();

          var icon = new cc.Node();
          iconArea.addChild(icon);
          icon.addComponent(cc.Sprite);
          icon.getComponent(cc.Sprite).spriteFrame = new cc.SpriteFrame(this.NavigateIconTextureList[inform.index]);
          // icon.getComponent(cc.Sprite).spriteFrame = new cc.SpriteFrame(this.navigateGroupUITextures.TestIcon);
          icon.width = iconAreaMask.width * 0.9;
          icon.height = icon.width;
          icon.x = 0;
          icon.y = -(i - 2) * (icon.height * 1.15)/*  + icon.width * 0.01 */;
          icon.on(cc.Node.EventType.TOUCH_START, () => {
            console.log("TYQSDK", "icon", i);
            this.jumpToMiniGame(inform);
          })
          this.iconArr[i] = icon;
        }


        cc.tween(iconArea)
          .repeatForever(
            cc.tween()
              .delay(1)
              .by(3, { position: cc.v3(0, icon.height * 1.15) })
              .call(() => {
                this.iconArr[0].y -= 6 * (icon.height * 1.15);
                let tempIcon = this.iconArr[0];
                for (let i = 0; i < 6; i++) {
                  if (i < 6 - 1) {
                    this.iconArr[i] = this.iconArr[i + 1];
                  }
                }
                this.iconArr[6 - 1] = tempIcon;
              })
          )
          .start();


      } else {
        console.log("TYQSDK", "在右侧打开互推游戏列表");
        iconBtn.active = false;
        // 互推游戏列表 右
        let moreGameGroupRight = new cc.Node("moreGameGroupRight");
        this.navigateGroupBg.addChild(moreGameGroupRight);
        moreGameGroupRight.addComponent(cc.Sprite);
        moreGameGroupRight.getComponent(cc.Sprite).spriteFrame = new cc.SpriteFrame(this.navigateGroupUITextures.moreGameGroupRight);
        // 竖屏
        moreGameGroupRight.height = cc.winSize.height / 2;
        moreGameGroupRight.width = moreGameGroupRight.height / 4.8;
        moreGameGroupRight.x = moreGameGroupRight.width / 2 + cc.winSize.width / 2;
        moreGameGroupRight.y = 0;
        cc.tween(moreGameGroupRight)
          .by(0.2, { position: cc.v3(-moreGameGroupRight.width, 0, 0) })
          .call(() => {
            isOpenNavigateGroup = true;
            navigateGroupHideFunc();
          })
          .start();

        // 右侧缩进按钮
        let rightTuck = new cc.Node();
        moreGameGroupRight.addChild(rightTuck);
        rightTuck.addComponent(cc.Sprite);
        rightTuck.getComponent(cc.Sprite).spriteFrame = new cc.SpriteFrame(this.navigateGroupUITextures.rightTuck);
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
              // iconBtn.width = size;
              // iconBtn.height = size;
              iconBtn.active = true;
              navigateGroupHideFunc();
              moreGameGroupRight.destroy();
            })
            .start();
        })

        // icon区域遮罩
        let iconAreaMask = new cc.Node();
        moreGameGroupRight.addChild(iconAreaMask);
        iconAreaMask.addComponent(cc.Mask);
        iconAreaMask.getComponent(cc.Mask).type = 0;
        iconAreaMask.width = moreGameGroupRight.width * 0.8;
        iconAreaMask.height = moreGameGroupRight.height * 0.85;
        iconAreaMask.x = moreGameGroupRight.width / 13;
        iconAreaMask.y = -moreGameGroupRight.height / 22;

        var iconArea = new cc.Node();
        iconAreaMask.addChild(iconArea);
        iconArea.x = 0;
        iconArea.y = 0;

        // icon 6为互推游戏的个数
        for (let i = 0; i < 6; i++) {
          let inform = getInfom();

          var icon = new cc.Node();
          iconArea.addChild(icon);
          icon.addComponent(cc.Sprite);
          icon.getComponent(cc.Sprite).spriteFrame = new cc.SpriteFrame(this.NavigateIconTextureList[inform.index]);
          // icon.getComponent(cc.Sprite).spriteFrame = new cc.SpriteFrame(this.navigateGroupUITextures.TestIcon);
          icon.width = iconAreaMask.width * 0.9;
          icon.height = icon.width;
          icon.x = 0;
          icon.y = -(i - 2) * (icon.height * 1.15);
          icon.on(cc.Node.EventType.TOUCH_START, () => {
            console.log("TYQSDK", "icon", i);
            this.jumpToMiniGame(inform);
          })
          this.iconArr[i] = icon;
        }


        cc.tween(iconArea)
          .repeatForever(
            cc.tween()
              .delay(1)
              .by(3, { position: cc.v3(0, icon.height * 1.15) })
              .call(() => {
                this.iconArr[0].y -= 6 * (icon.height * 1.15);
                let tempIcon = this.iconArr[0];
                for (let i = 0; i < 6; i++) {
                  if (i < 6 - 1) {
                    this.iconArr[i] = this.iconArr[i + 1];
                  }
                }
                this.iconArr[6 - 1] = tempIcon;
              })
          )
          .start();
      }
    }



    let startClickPos;
    let endMoveScreenPos;
    // 触碰到该节点时
    iconBtn.on(cc.Node.EventType.TOUCH_START, ((evnet: cc.Event) => {
      let touch: cc.Touch = evnet.touch;
      startClickPos = touch.getLocation();
    }))

    // 当手指在目标节点区域内离开屏幕时
    iconBtn.on(cc.Node.EventType.TOUCH_END, ((evnet: cc.Event) => {
      let touch: cc.Touch = evnet.touch;
      endMoveScreenPos = touch.getLocation();

      // 位移x、y
      let offsetX = Math.abs(endMoveScreenPos.x - startClickPos.x);
      let offsetY = Math.abs(endMoveScreenPos.y - startClickPos.y);
      if (offsetX <= 20 && offsetY <= 20) {
        console.log("TYQSDK", "点击icon 展开互推列表");
        if (endMoveScreenPos.x <= cc.winSize.width / 2) {
          openNavigateGroup(true);
        }
        else {
          openNavigateGroup(false);
        }
      }

      // 重设位置,将按钮放在屏幕边缘
      iconBtn.setPosition(iconBtn.parent.convertToNodeSpaceAR(cc.v2(endMoveScreenPos.x >= cc.winSize.width / 2 ? cc.winSize.width - iconBtn.width / 2 : iconBtn.width / 2, endMoveScreenPos.y)));

      if (iconBtn.active) navigateGroupHideFunc();
    }))

    // 当手指在节点上移动时
    iconBtn.on(cc.Node.EventType.TOUCH_MOVE, ((evnet: cc.Event) => {
      let touch: cc.Touch = evnet.touch;
      iconBtn.setPosition(iconBtn.parent.convertToNodeSpaceAR(touch.getLocation()));
    }))

    // 定时隐藏
    navigateGroupHideFunc();
  }

  /**
   * 隐藏互推列表
   */
  public hideNavigateGroup() {
    NavigateController.getInstance().isNavigateGroupShow = false;
    if (this.navigateGroupBg) {
      console.log("TYQSDK", "hideNavigateGroup===========================")
      this.navigateGroupBg.removeFromParent();
      this.navigateGroupBg = null;
    } else {
      console.log("TYQSDK", "互推列表不存在 return");
      return;
    }
  }


  /**
   * 展示结算互推
   */
  public showNavigateSettle(type: number, x: number, y: number) {

    BannerController.getInstance().hideBanner();

    if (this.navigateSettleBg) {
      console.log("TYQSDK", "已存在结算互推 return");
      return;
    }
    console.log("TYQSDK", "showNavigateSettle===========================")

    let Navigate = NavigateController.getInstance();
    let NavigateList = Navigate.navigateList;
    if (!this.isLoadNavigateSettle) {
      console.log("TYQSDK", "结算互推资源未加载到 return");
      return;
    }
    // if (!this.isLoadNavigateList) {
    //   console.log("互推游戏列表资源未加载到 return");
    //   return;
    // }

    Navigate.isNavigateSettleShow = true;

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
    var scene = cc.director.getScene();
    var iconSize;

    if (type == 1 && (cc.winSize.height / cc.winSize.width) <= (16 / 9)) { type = 4; y = 0; };

    switch (type) {
      case 1:
        {
          if (NavigateList.length < 6) {
            console.log("TYQSDK", "后台配置互推游戏小于6个");
            return;
          }

          this.navigateSettleBg = new cc.Node("navigateSettleBg");
          if (this.cocosGroup != '') { this.navigateSettleBg.group = this.cocosGroup; }
          scene.addChild(this.navigateSettleBg);
          this.navigateSettleBg.addComponent(cc.Sprite);
          this.navigateSettleBg.getComponent(cc.Sprite).spriteFrame = new cc.SpriteFrame(this.navigateSettleUITextures.navigateSettle1Bg);
          this.navigateSettleBg.width = cc.winSize.width * 9 / 10;
          this.navigateSettleBg.height = cc.winSize.width * 2 / 3;
          // 横坐标默认居中,纵坐标默认贴近底部
          this.navigateSettleBg.x = cc.winSize.width / 2;
          this.navigateSettleBg.y = this.navigateSettleBg.height / 2 + y;

          for (let i = 0; i < 6; i++) {
            let inform = getInfom();

            let IconNode = new cc.Node("IconNode");
            this.navigateSettleBg.addChild(IconNode);
            IconNode.width = this.navigateSettleBg.width / 4;
            IconNode.height = IconNode.width;
            IconNode.x = (i % 3 - 1) * (IconNode.width * 4 / 3);
            IconNode.y = i < 3 ? IconNode.width * 3 / 5 : -IconNode.width * 7 / 10;

            let mask = new cc.Node("mask");
            IconNode.addChild(mask);
            mask.addComponent(cc.Mask);
            mask.getComponent(cc.Mask).type = cc.Mask.Type.IMAGE_STENCIL;
            mask.getComponent(cc.Mask).spriteFrame = new cc.SpriteFrame(this.navigateSettleUITextures.iconMask);
            mask.getComponent(cc.Mask).alphaThreshold = 0.1;
            mask.width = IconNode.width;
            mask.height = IconNode.width;

            let icon = new cc.Node("icon");
            mask.addChild(icon);
            icon.addComponent(cc.Sprite);
            if (this.NavigateIconTextureList[inform.index]) {
              icon.getComponent(cc.Sprite).spriteFrame = new cc.SpriteFrame(this.NavigateIconTextureList[inform.index]);
            }
            icon.width = mask.width;
            icon.height = mask.height;

            let iconWihte = new cc.Node("button");
            IconNode.addChild(iconWihte);
            iconWihte.addComponent(cc.Sprite);
            iconWihte.getComponent(cc.Sprite).spriteFrame = new cc.SpriteFrame(this.navigateSettleUITextures.iconYellow);
            iconWihte.width = IconNode.width + 8;
            iconWihte.height = IconNode.height + 8;

            let iconNameBg = new cc.Node("iconNameBg");
            IconNode.addChild(iconNameBg);
            iconNameBg.addComponent(cc.Sprite);
            iconNameBg.getComponent(cc.Sprite).spriteFrame = new cc.SpriteFrame(this.navigateSettleUITextures.iconNameBg);
            iconNameBg.width = IconNode.width;
            iconNameBg.height = IconNode.width / 5;
            iconNameBg.y = -IconNode.height / 2 - iconNameBg.height / 1.6;

            let iconName = new cc.Node("iconName");
            iconNameBg.addChild(iconName);
            iconName.addComponent(cc.Label);
            iconName.getComponent(cc.Label).fontSize = 35;
            iconName.getComponent(cc.Label).verticalAlign = 1;
            iconName.getComponent(cc.Label).string = inform.pushGameName.length > 5 ? inform.pushGameName.substring(0, 5) + '...' : inform.pushGameName;

            icon.on(cc.Node.EventType.TOUCH_START, () => {
              this.jumpToMiniGame(inform);
            })
          }

        }
        break;
      case 2:
        {
          if (NavigateList.length < 4) {
            console.log("TYQSDK", "后台配置互推游戏小于4个");
            return;
          }

          var self = this;
          this.navigateSettleBg = new cc.Node("navigateSettleBg");
          this.navigateSettleBg.x = 0;
          this.navigateSettleBg.y = 0;
          this.navigateSettleBg.zIndex = 30000;
          if (this.cocosGroup != '') { this.navigateSettleBg.group = this.cocosGroup; }
          scene.addChild(this.navigateSettleBg);

          var navigateSettleLeft = new cc.Node("navigateSettleLeft");
          var spleft = navigateSettleLeft.addComponent(cc.Sprite);
          var spleftframe = new cc.SpriteFrame(this.navigateSettleUITextures.navigateSettleGroup);
          navigateSettleLeft.getComponent(cc.Sprite).type = cc.Sprite.Type.SLICED;
          spleftframe.insetTop = 30;
          spleftframe.insetBottom = 30;
          spleftframe.insetLeft = 30;
          spleftframe.insetRight = 30;
          spleft.spriteFrame = spleftframe;
          setTimeout(() => {
            if (cc.winSize.width < cc.winSize.height) {
              navigateSettleLeft.width = cc.winSize.width * 0.2;
              navigateSettleLeft.height = navigateSettleLeft.width / 0.439;
            }
            else {
              navigateSettleLeft.height = cc.winSize.height - 200;
              navigateSettleLeft.width = cc.winSize.height * 0.439;
            }
          }, 0.5);

          navigateSettleLeft.x = navigateSettleLeft.width / 2 - navigateSettleLeft.width * 0.15;
          navigateSettleLeft.y = cc.winSize.height / 2;
          self.navigateSettleBg.addChild(navigateSettleLeft);

          var leftTitle = new cc.Node("leftTitle");
          leftTitle.addComponent(cc.Sprite);
          leftTitle.getComponent(cc.Sprite).spriteFrame = new cc.SpriteFrame(this.navigateSettleUITextures.navigateSettletitleBg);

          var titleLabel = new cc.Node("titleLabel");
          titleLabel.addComponent(cc.Label);
          titleLabel.getComponent(cc.Label).fontSize = 20;
          titleLabel.getComponent(cc.Label).horizontalAlign = cc.Label.HorizontalAlign.CENTER;
          titleLabel.getComponent(cc.Label).verticalAlign = cc.Label.VerticalAlign.CENTER;
          titleLabel.getComponent(cc.Label).string = '更多游戏';
          titleLabel.color = cc.Color.WHITE;
          leftTitle.addChild(titleLabel);
          navigateSettleLeft.addChild(leftTitle);
          setTimeout(() => {
            iconSize = navigateSettleLeft.width * 0.7;

            leftTitle.width = navigateSettleLeft.width * 0.931;
            leftTitle.height = navigateSettleLeft.height * 0.142;
            leftTitle.x = 0;
            leftTitle.y = navigateSettleLeft.height / 2 - leftTitle.height / 2 - navigateSettleLeft.height * 0.018;

            titleLabel.x = navigateSettleLeft.width * 0.05;
          }, 1);

          for (let i = 0; i < 2; i++) {
            let inform = getInfom();

            let button = new cc.Node("button");
            navigateSettleLeft.addChild(button);

            let iconWihte = new cc.Node("button");
            iconWihte.addComponent(cc.Sprite);
            iconWihte.getComponent(cc.Sprite).spriteFrame = new cc.SpriteFrame(this.navigateSettleUITextures.iconWihte);

            button.addChild(iconWihte);

            let mask = new cc.Node("mask");
            mask.addComponent(cc.Mask);
            mask.getComponent(cc.Mask).type = cc.Mask.Type.IMAGE_STENCIL;
            mask.getComponent(cc.Mask).spriteFrame = new cc.SpriteFrame(this.navigateSettleUITextures.mask);
            mask.getComponent(cc.Mask).alphaThreshold = 0.5;

            button.addChild(mask);

            let icon = new cc.Node("button");
            icon.addComponent(cc.Sprite);
            if (this.NavigateIconTextureList[inform.index]) {
              icon.getComponent(cc.Sprite).spriteFrame = new cc.SpriteFrame(this.NavigateIconTextureList[inform.index]);
            }

            mask.addChild(icon);

            let nameLabel = new cc.Node("titleLabel");
            nameLabel.addComponent(cc.Label);
            nameLabel.getComponent(cc.Label).fontSize = 20;
            nameLabel.getComponent(cc.Label).overflow = cc.Label.Overflow.SHRINK;
            nameLabel.getComponent(cc.Label).enableWrapText = false;
            nameLabel.getComponent(cc.Label).horizontalAlign = cc.Label.HorizontalAlign.CENTER;
            nameLabel.getComponent(cc.Label).string = inform.pushGameName;
            nameLabel.color = cc.Color.WHITE;
            button.addChild(nameLabel);

            button.on(cc.Node.EventType.TOUCH_START, function (event) {
              self.jumpToMiniGame(inform);
            });

            setTimeout(() => {
              button.width = iconSize;
              button.height = iconSize;
              button.x = navigateSettleLeft.width * 0.05;
              button.y = - navigateSettleLeft.height / 2 + (navigateSettleLeft.height - navigateSettleLeft.height * 0.036 - leftTitle.height) / 4 + i * (navigateSettleLeft.height - navigateSettleLeft.height * 0.036 - leftTitle.height) / 2;

              iconWihte.x = 0;
              iconWihte.y = iconSize * 0.085;
              iconWihte.width = iconSize * 0.781 + 2;
              iconWihte.height = iconSize * 0.781 + 2;

              mask.width = iconSize * 0.781;
              mask.height = iconSize * 0.781;
              mask.x = 0;
              mask.y = iconSize * 0.085;

              icon.width = mask.width;
              icon.height = mask.height;

              nameLabel.x = 0;
              nameLabel.y = mask.y - iconSize * 0.546;
              nameLabel.width = iconSize;
              nameLabel.height = iconSize * 0.234;
            }, 1);
          }



          var navigateSettleRight = new cc.Node("navigateSettleRight");
          var spright = navigateSettleRight.addComponent(cc.Sprite);
          var sprightframe = new cc.SpriteFrame(this.navigateSettleUITextures.navigateSettleGroup);
          navigateSettleRight.getComponent(cc.Sprite).type = cc.Sprite.Type.SLICED;
          sprightframe.insetTop = 30;
          sprightframe.insetBottom = 30;
          sprightframe.insetLeft = 30;
          sprightframe.insetRight = 30;
          spright.spriteFrame = sprightframe;
          setTimeout(() => {
            if (cc.winSize.width < cc.winSize.height) {
              navigateSettleRight.width = cc.winSize.width * 0.2;
              navigateSettleRight.height = navigateSettleRight.width / 0.439;
            }
            else {
              navigateSettleRight.height = cc.winSize.height - 200;
              navigateSettleRight.width = cc.winSize.height * 0.439;
            }

            navigateSettleRight.x = cc.winSize.width - navigateSettleRight.width / 2 + navigateSettleRight.width * 0.15;
            navigateSettleRight.y = cc.winSize.height / 2;
          }, 0.5);


          self.navigateSettleBg.addChild(navigateSettleRight);

          var rightTitle = new cc.Node("rightTitle");
          rightTitle.addComponent(cc.Sprite);
          rightTitle.getComponent(cc.Sprite).spriteFrame = new cc.SpriteFrame(this.navigateSettleUITextures.navigateSettletitleBg);

          navigateSettleRight.addChild(rightTitle);
          var rtitleLabel = new cc.Node("rtitleLabel");
          rtitleLabel.addComponent(cc.Label);
          rtitleLabel.getComponent(cc.Label).fontSize = 20;
          rtitleLabel.getComponent(cc.Label).horizontalAlign = cc.Label.HorizontalAlign.CENTER;
          rtitleLabel.getComponent(cc.Label).verticalAlign = cc.Label.VerticalAlign.CENTER;
          rtitleLabel.getComponent(cc.Label).string = '更多游戏';
          rtitleLabel.color = cc.Color.WHITE;

          rightTitle.addChild(rtitleLabel);
          iconSize = navigateSettleRight.width * 0.7;

          setTimeout(() => {
            rightTitle.width = navigateSettleRight.width * 0.931;
            rightTitle.height = navigateSettleRight.height * 0.142;
            rightTitle.x = 0;
            rightTitle.y = navigateSettleRight.height / 2 - rightTitle.height / 2 - navigateSettleRight.height * 0.018;
            rtitleLabel.x = - (navigateSettleRight.width * 0.05);
          }, 1);

          for (let i = 0; i < 2; i++) {
            let inform = getInfom();

            let button = new cc.Node("button");

            navigateSettleRight.addChild(button);

            let iconWihte = new cc.Node("button");
            iconWihte.addComponent(cc.Sprite);
            iconWihte.getComponent(cc.Sprite).spriteFrame = new cc.SpriteFrame(this.navigateSettleUITextures.iconWihte);

            setTimeout(() => {
              iconWihte.x = 0;
              iconWihte.y = iconSize * 0.085;
              iconWihte.width = iconSize * 0.781 + 2;
              iconWihte.height = iconSize * 0.781 + 2;
            }, 1);
            button.addChild(iconWihte);

            let mask = new cc.Node("mask");
            mask.addComponent(cc.Mask);
            mask.getComponent(cc.Mask).type = cc.Mask.Type.IMAGE_STENCIL;
            mask.getComponent(cc.Mask).spriteFrame = new cc.SpriteFrame(this.navigateSettleUITextures.mask);
            mask.getComponent(cc.Mask).alphaThreshold = 0.5;

            button.addChild(mask);

            let icon = new cc.Node("button");
            icon.addComponent(cc.Sprite);
            if (this.NavigateIconTextureList[inform.index]) {
              icon.getComponent(cc.Sprite).spriteFrame = new cc.SpriteFrame(this.NavigateIconTextureList[inform.index]);
            }

            mask.addChild(icon);

            let nameLabel = new cc.Node("titleLabel");
            nameLabel.addComponent(cc.Label);
            nameLabel.getComponent(cc.Label).fontSize = 20;
            nameLabel.getComponent(cc.Label).overflow = cc.Label.Overflow.SHRINK;
            nameLabel.getComponent(cc.Label).enableWrapText = false;
            nameLabel.getComponent(cc.Label).horizontalAlign = cc.Label.HorizontalAlign.CENTER;

            nameLabel.getComponent(cc.Label).string = inform.pushGameName;

            nameLabel.color = cc.Color.WHITE;
            button.addChild(nameLabel);

            button.on(cc.Node.EventType.TOUCH_START, function (event) {
              self.jumpToMiniGame(inform);
            });

            setTimeout(() => {
              button.width = iconSize;
              button.height = iconSize;
              button.x = -navigateSettleRight.width * 0.05;
              button.y = - navigateSettleLeft.height / 2 + (navigateSettleRight.height - navigateSettleRight.height * 0.036 - rightTitle.height) / 4 + i * (navigateSettleRight.height - navigateSettleRight.height * 0.036 - rightTitle.height) / 2;

              mask.width = iconSize * 0.781;
              mask.height = iconSize * 0.781;
              mask.x = 0;
              mask.y = iconSize * 0.085;

              icon.width = mask.width;
              icon.height = mask.height;

              nameLabel.x = 0;
              nameLabel.y = mask.y - iconSize * 0.546;
              nameLabel.width = iconSize;
              nameLabel.height = iconSize * 0.234;
            }, 1);
          }

        }
        break;
      case 3:
        {
          if (NavigateList.length < 5) {
            console.log("TYQSDK", "互推游戏资源小于5");
            return;
          }

          var scene = cc.director.getScene();
          var self = this;
          this.navigateSettleBg = new cc.Node("navigateSettleBg");
          this.navigateSettleBg.x = 0;
          this.navigateSettleBg.y = 0;
          this.navigateSettleBg.zIndex = 30000;
          if (this.cocosGroup != '') { this.navigateSettleBg.group = this.cocosGroup; }

          scene.addChild(this.navigateSettleBg);

          var navigateSettle = new cc.Node("navigateSettle");
          var sp = navigateSettle.addComponent(cc.Sprite);
          var spframe = new cc.SpriteFrame(this.navigateSettleUITextures.navigateSettleGroup);
          navigateSettle.getComponent(cc.Sprite).type = cc.Sprite.Type.SLICED;
          spframe.insetTop = 30;
          spframe.insetBottom = 30;
          spframe.insetLeft = 30;
          spframe.insetRight = 30;
          sp.spriteFrame = spframe;

          setTimeout(() => {
            if (cc.winSize.width < cc.winSize.height) {
              navigateSettle.width = cc.winSize.width * 0.904;
              navigateSettle.height = navigateSettle.width * 0.317;
            }
            else {
              navigateSettle.height = cc.winSize.height / 4;
              navigateSettle.width = navigateSettle.height / 0.317;
            }
          }, 0.5);
          navigateSettle.x = x;
          navigateSettle.y = y;
          self.navigateSettleBg.addChild(navigateSettle);

          var leftTitle = new cc.Node("leftTitle");
          leftTitle.addComponent(cc.Sprite);
          var titleframe = new cc.SpriteFrame(this.navigateSettleUITextures.navigateSettletitleBg);
          leftTitle.getComponent(cc.Sprite).type = cc.Sprite.Type.SLICED;
          titleframe.insetTop = 30;
          titleframe.insetBottom = 30;
          titleframe.insetLeft = 30;
          titleframe.insetRight = 30;
          leftTitle.getComponent(cc.Sprite).spriteFrame = titleframe;

          setTimeout(() => {
            leftTitle.width = navigateSettle.width * 0.972;
            leftTitle.height = navigateSettle.height * 0.138;
            leftTitle.x = 0;
            leftTitle.y = navigateSettle.height / 2 - leftTitle.height / 2 - navigateSettle.height * 0.018;
          }, 1);

          var titleLabel = new cc.Node("titleLabel");
          titleLabel.addComponent(cc.Label);
          titleLabel.getComponent(cc.Label).fontSize = 25;
          titleLabel.getComponent(cc.Label).horizontalAlign = cc.Label.HorizontalAlign.CENTER;
          titleLabel.getComponent(cc.Label).verticalAlign = cc.Label.VerticalAlign.CENTER;
          titleLabel.getComponent(cc.Label).string = '更多精品游戏推荐!';
          titleLabel.color = cc.Color.WHITE;
          leftTitle.addChild(titleLabel);

          navigateSettle.addChild(leftTitle);

          for (let i = 0; i < 5; i++) {
            let inform = getInfom();

            let button = new cc.Node("button");

            navigateSettle.addChild(button);

            let iconWihte = new cc.Node("button");
            iconWihte.addComponent(cc.Sprite);
            iconWihte.getComponent(cc.Sprite).spriteFrame = new cc.SpriteFrame(this.navigateSettleUITextures.iconWihte);

            button.addChild(iconWihte);

            let mask = new cc.Node("mask");
            mask.addComponent(cc.Mask);
            mask.getComponent(cc.Mask).type = cc.Mask.Type.IMAGE_STENCIL;
            mask.getComponent(cc.Mask).spriteFrame = new cc.SpriteFrame(this.navigateSettleUITextures.mask);
            mask.getComponent(cc.Mask).alphaThreshold = 0.5;
            button.addChild(mask);

            let icon = new cc.Node("button");
            icon.addComponent(cc.Sprite);
            if (this.NavigateIconTextureList[inform.index]) {
              console.log("TYQSDK", inform.index);
              icon.getComponent(cc.Sprite).spriteFrame = new cc.SpriteFrame(this.NavigateIconTextureList[inform.index]);
            }
            mask.addChild(icon);

            let nameLabel = new cc.Node("titleLabel");
            nameLabel.addComponent(cc.Label);
            nameLabel.getComponent(cc.Label).fontSize = 20;
            nameLabel.getComponent(cc.Label).overflow = cc.Label.Overflow.SHRINK;
            nameLabel.getComponent(cc.Label).enableWrapText = false;
            nameLabel.getComponent(cc.Label).horizontalAlign = cc.Label.HorizontalAlign.CENTER;

            nameLabel.getComponent(cc.Label).string = inform.pushGameName;

            nameLabel.color = cc.Color.WHITE;
            button.addChild(nameLabel);

            button.on(cc.Node.EventType.TOUCH_START, function (event) {
              self.jumpToMiniGame(inform);
            });

            setTimeout(() => {
              iconSize = navigateSettle.width / 5;

              button.width = iconSize;
              button.height = iconSize;

              button.x = - navigateSettle.width / 2 + navigateSettle.width / 10 + navigateSettle.width / 5 * i;
              button.y = navigateSettle.height / 2 - leftTitle.height * 1.25 - iconSize / 2;

              iconWihte.x = 0;
              iconWihte.y = iconSize * 0.085;
              iconWihte.width = iconSize * 0.781 + 2;
              iconWihte.height = iconSize * 0.781 + 2;

              mask.width = iconSize * 0.781;
              mask.height = iconSize * 0.781;
              mask.x = 0;
              mask.y = iconSize * 0.085;

              icon.width = mask.width;
              icon.height = mask.height;

              nameLabel.x = 0;
              nameLabel.y = mask.y - iconSize * 0.546;
              nameLabel.width = iconSize;
              nameLabel.height = iconSize * 0.234;
            }, 1);
          }
        }
        break;
      case 4:
        {
          if (NavigateList.length < 5) {
            console.log("TYQSDK", "OPPO 互推样式的游戏数量小于5个 return");
            return;
          }

          let self = this;

          this.navigateSettleBg = new cc.Node("navigateSettleBg");
          scene.addChild(this.navigateSettleBg);
          this.navigateSettleBg.addComponent(cc.Sprite);
          this.navigateSettleBg.getComponent(cc.Sprite).spriteFrame = new cc.SpriteFrame(this.navigateSettleUITextures.navigateSettle4Bg);
          if (cc.winSize.width < cc.winSize.height) {
            this.navigateSettleBg.width = cc.winSize.width;
            this.navigateSettleBg.height = this.navigateSettleBg.width * 0.3;
          } else {
            this.navigateSettleBg.width = cc.winSize.width / 2;
            this.navigateSettleBg.height = this.navigateSettleBg.width * 0.25;
          }
          this.navigateSettleBg.x = cc.winSize.width / 2;
          this.navigateSettleBg.y = this.navigateSettleBg.height / 2 + y;

          if (this.cocosGroup != '') { this.navigateSettleBg.group = this.cocosGroup; }

          for (let i = 0; i < 5; i++) {
            let inform = getInfom();

            let button = new cc.Node("button");
            this.navigateSettleBg.addChild(button);

            let iconWihte = new cc.Node("button");
            iconWihte.addComponent(cc.Sprite);
            iconWihte.getComponent(cc.Sprite).spriteFrame = new cc.SpriteFrame(this.navigateSettleUITextures.newIconWihte);
            button.addChild(iconWihte);

            let mask = new cc.Node("mask");
            mask.addComponent(cc.Mask);
            mask.getComponent(cc.Mask).type = cc.Mask.Type.IMAGE_STENCIL;
            mask.getComponent(cc.Mask).spriteFrame = new cc.SpriteFrame(this.navigateSettleUITextures.newMask);
            mask.getComponent(cc.Mask).alphaThreshold = 0.5;
            iconWihte.addChild(mask);

            let icon = new cc.Node("icon");
            icon.addComponent(cc.Sprite);
            icon.getComponent(cc.Sprite).spriteFrame = new cc.SpriteFrame(this.NavigateIconTextureList[inform.index]);
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


            button.width = this.navigateSettleBg.width / 6;
            button.height = button.width;
            button.x = -this.navigateSettleBg.width / 5 * (i - 2);
            button.y = button.height * 0.1;

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

            icon.on(cc.Node.EventType.TOUCH_START, function (event) {
              self.jumpToMiniGame(inform);
            })
          }
        }
        break;
      default:
        console.log("TYQSDK", "无该种类型的结算互推:" + type);
        break;
    }
  }
  /**
   * 隐藏结算互推
   */
  public hideNavigateSettle() {
    NavigateController.getInstance().isNavigateSettleShow = false;
    if (this.navigateSettleBg) {
      console.log("TYQSDK", "hideNavigateSettle===========================")
      this.navigateSettleBg.removeFromParent();
      this.navigateSettleBg = null;
    } else {
      console.log("TYQSDK", "不存在结算互推 return");
      return;
    }
  }


  /**
   * 互推游戏跳转
   * @param inform 
   */
  private jumpToMiniGame(inform) {
    switch (SdkTools.getPlatform()) {
      case Game_Platform.GP_Oppo:
        console.log("TYQSDK", "OPPO jumpToMiniGame===========================")
        Network.getInstance().statistics(inform);
        qg.navigateToMiniGame({
          pkgName: inform.pushGamePackage,
          success: function () {
          },
          fail: function (res) {
            console.log("TYQSDK", JSON.stringify(res));
          }
        });
        break;
      case Game_Platform.GP_WX:
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
        break;
      default:
        break;
    }
  }

}
export default CocosUI