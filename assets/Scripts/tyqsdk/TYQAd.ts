import Network from "./network/Network"
import SdkTools, { Game_Platform } from "./tools/SdkTools";
import bannerController from "./ads/bannerAd/BannerController";
import intersController from "./ads/IntersAd/IntersController";
import videoController from "./ads/videoAd/VideoController";
import NavigateController from "./navigate/NavigateController"
import NativeController from "./ads/nativeAd/NativeController";
import OtherFunctions from "./tools/OtherFunctions";
import RecordAndShare from "./recordShare/RecordAndShare"
import BoxController from "./ads/boxAd/BoxController"
import BlockController from "./ads/blockAd/BlockController"
import CocosUI from "./ui/CocosUI";
import sdkConfig from "./sdkConfig";


class TYQAd {
  private static instance: TYQAd

  

  /**
   * 防止多次初始化操作
   */
  private hasBeenInit: boolean = false;

  /**
   * 渠道数组
   */
  private readonly channelArray: any = ["OPPO", "VIVO", "Tiktok", "QQ", "Test", "Android", "IOS", "WX", "KS", "HW", "XM", "BL"];

  /**
   * TYQAd 单例
   */
  public static getInstance(): TYQAd {
    if (!TYQAd.instance) {
      TYQAd.instance = new TYQAd()
    }
    return TYQAd.instance
  }


  /**
   * 初始化广告
   */
  initAd(callback?) {
    console.log("TYQSDK", "initAd");
    console.log("TYQSDK", "当前SDKVersion：" + sdkConfig.SDKVersion);
   
    //用于防止多次初始化
    if (this.hasBeenInit) {
      console.log("TYQSDK", "重复初始化initAd return================");
      return
    }
    this.hasBeenInit = true;

    NativeController.getInstance().onGameShow();

    //测试模式
    if (SdkTools.getPlatform() == Game_Platform.GP_Test) {
      callback && callback(true);
      return;
    }

    // 先登陆成功再请求广告配置
    Network.getInstance().login(function (success) {
      if (success) {
      }
    })
    Network.getInstance().getSDKOnlineConfig(callback)
    console.log("TYQSDK", "当前渠道：" + this.channelArray[SdkTools.getPlatform()]);
  }


  /** 
   * ALL
   * 展示横幅
   */
  public showBanner() {
    console.log('TYQSDK', 'showBanner');
    bannerController.getInstance().showBanner();
  }
  /** 
   * ALL
   * 隐藏横幅
   */
  public hideBanner() {
    console.log('TYQSDK', 'hideBanner');
    bannerController.getInstance().hideBanner();
  }


  /** 
   * ALL
   * 获取插屏是否可以展示标志
   */
  public getIntersFlag() {
    console.log('TYQSDK', 'getIntersFlag:' + intersController.getInstance().getIntersFlag())
    return intersController.getInstance().getIntersFlag();
  }
  /** 
   * ALL
   * 展示插屏
   */
  public showInters() {
    console.log('TYQSDK', 'showInters');
    intersController.getInstance().showInters();
  }


  /** 
   * ALL
   * 获取视频是否可以展示标志
   * 为false时需要提示 暂无视频广告
   */
  public getVideoFlag() {
    console.log('TYQSDK', 'getVideoFlag:' + videoController.getInstance().getVideoFlag());
    return videoController.getInstance().getVideoFlag();
  }
  /** 
   * ALL
   * 展示视频
   * @param callback 视频播放回调
   */
  public showVideo(callback) {
    console.log('TYQSDK', 'showVideo');
    videoController.getInstance().showVideo(callback);
  }


  /** 
   * OPPO & VIVO & WX & Android
   * 获取原生ICON是否可以展示标志
   */
  public getNativeIconFlag() {
    console.log('TYQSDK', 'getNativeIconFlag:' + NativeController.getInstance().getIconNativeFlag());
    return NativeController.getInstance().getIconNativeFlag();
  }
  /**
   * OPPO & VIVO & WX & Android
   * 展示原生ICON
   * @param width ICON的宽(微信无法设置,可填任意值)
   * @param height ICON的高(微信无法设置,可填任意值)
   * @param x ICON的横坐标
   * @param y ICON的横坐标
   */
  public showNativeIcon(width: number, height: number, x: number, y: number) {
    console.log('TYQSDK', 'showNativeICON');
    NativeController.getInstance().showNativeIcon(width, height, x, y);
  }
  /** 
   * OPPO & VIVO & WX & Android
   * 隐藏原生ICON
   */
  public hideNativeIcon() {
    console.log('TYQSDK', 'hideNativeIcon');
    NativeController.getInstance().hideNativeIcon();
  }

  /**
   * OPPO & VIVO
   * 获取原生大图是否可以展示标志
   */
  public getImageNativeFlag() {
    console.log('TYQSDK', 'getImageNativeFlag:' + NativeController.getInstance().getImageNativeFlag());
    return NativeController.getInstance().getImageNativeFlag();
  }
  /**
   * OPPO & VIVO & Android
   * 展示原生大图
   * Android渠道填任意参数 0,0,0,0
   * @param width 原生大图的宽 ps:建议宽：高 = 2:1 否则图片可能模糊
   * @param height 原生大图的高
   * @param x 原生大图的横坐标
   * @param y 原生大图的横坐标
   */
  public showNativeImage(width: number, height: number, x: number, y: number) {
    console.log('TYQSDK', 'showNativeImage');
    NativeController.getInstance().showNativeImage(width, height, x, y);
  }
  /** 
   * OPPO & VIVO & Android
   * 隐藏原生大图
   */
  public hideNativeImage() {
    console.log('TYQSDK', 'hideNativeImage');
    NativeController.getInstance().hideNativeImage();
  }

  /**
   * OPPO & VIVO
   * 自由获取原生广告信息
   */
  public getNativeInfo() {
    console.log('TYQSDK', 'getNativeInfo');
    console.log(JSON.stringify(NativeController.getInstance().getNativeInfo()));
    return NativeController.getInstance().getNativeInfo();
  }
  /**
   * OPPO & VIVO
   * 上报原生广告展示
   * @param id 获取的原生广告的id
   */
  public reportNative(id) {
    console.log('TYQSDK', 'reportNativeShow');
    NativeController.getInstance().reportNativeShow(id);
  }
  /**
   * OPPO & VIVO & Android
   * 上报原生广告点击(Android 使按钮绑定点击事件即可,id可填任意)
   * @param id 获取的原生广告的id
   */
  public nativeClick(id) {
    console.log('TYQSDK', 'reportNativeClick');
    NativeController.getInstance().reportNativeClick(id);
  }

  /**
   * OPPO & Android & IOS & WX
   * 获取互推ICON是否可以展示标签
   */
  public getNavigateIconFlag() {
    console.log('TYQSDK', 'getNavigateIconFlag:' + NavigateController.getInstance().getNavigateIconFlag());
    return NavigateController.getInstance().getNavigateIconFlag();
  }
  /**
   * OPPO & Android & IOS & WX
   * 展示互推ICON
   * @param width ICON的宽
   * @param height ICON的高
   * @param x ICON的横坐标
   * @param y ICON的纵坐标
   */
  public showNavigateIcon(width: number, height: number, x: number, y: number) {
    console.log('TYQSDK', 'showNavigateIcon');
    NavigateController.getInstance().showNavigateIcon(width, height, x, y);
  }
  /** 
   * OPPO & Android & IOS & WX
   * 隐藏互推ICON
   */
  public hideNavigateIcon() {
    console.log('TYQSDK', 'hideNavigateIcon');
    NavigateController.getInstance().hideNavigateIcon();
  }

  /**
   * OPPO & Android & IOS & WX
   * 获取互推列表是否可以展示标志
   */
  public getNavigateGroupFlag() {
    console.log('TYQSDK', 'getNavigateGroupFlag:' + NavigateController.getInstance().getNavigateGroupFlag());
    return NavigateController.getInstance().getNavigateGroupFlag();
  }
  /**
   * OPPO & Android & IOS & WX
   * 展示互推列表(OPPO仅竖版可用)
   * @param type vertical-竖版 (不支持--horizontal-横版)
   * @param side left-左侧 right-右侧
   * @param size OPPO - 按钮大小
   * @param y OPPO - 按钮的纵坐标,默认0,处在屏幕左侧或者右侧中间
   */
  public showNavigateGroup(type: string, side: string, size: number, y: number) {
    console.log('TYQSDK', 'showNavigateGroup');
    NavigateController.getInstance().showNavigateGroup(type, side, size, y);
  }
  /**
   * OPPO & Android & IOS & WX
   * 隐藏互推列表
   */
  public hideNavigateGroup() {
    console.log('TYQSDK', 'hideNavigateGroup');
    NavigateController.getInstance().hideNavigateGroup();
  }

  /**
   * OPPO & Android & IOS & WX
   * 获取结算互推是否展示标签
   */
  public getNavigateSettleFlag() {
    console.log('TYQSDK', 'getNavigateSettleFlag:' + NavigateController.getInstance().getNavigateSettleFlag());
    return NavigateController.getInstance().getNavigateSettleFlag();
  }
  /**
   * OPPO & Android & IOS & WX
   * 展示结算互推
   * @param type 1-大窗口类型,2-两边类型,3-横条类型,4-横幅类型
   * @param x 结算互推的横坐标
   * @param y 结算互推的纵坐标
   */
  showNavigateSettle(type: number, x: number, y: number) {
    console.log('TYQSDK', 'showNavigateSettle');
    NavigateController.getInstance().showNavigateSettle(type, x, y);
  }
  /**
   * OPPO & Android & IOS & WX
   * 隐藏结算互推
   */
  public hideNavigateSettle() {
    console.log('TYQSDK', 'hideNavigateSettle');
    NavigateController.getInstance().hideNavigateSettle();
  }

  /**
   * OPPO
   * 获取互推盒子横幅广告能否展示标志
   */
  public getNavigateBoxBannerFlag() {
    console.log('TYQSDK', 'getNavigateBoxBannerFlag:' + NavigateController.getInstance().getNavigateBoxBannerFlag());
    return NavigateController.getInstance().getNavigateBoxBannerFlag();
  }
  /**
   * OPPO
   * 展示互推盒子横幅广告
   */
  public showNavigateBoxBanner() {
    console.log('TYQSDK', 'showNavigateBoxBanner');
    NavigateController.getInstance().showNavigateBoxBanner();
  }
  /**
   * OPPO
   * 隐藏互推盒子横幅广告
   */
  public hideNavigateBoxBanner() {
    console.log('TYQSDK', 'hideNavigateBoxBanner');
    NavigateController.getInstance().hideNavigateBoxBanner();
  }

  /**
   * OPPO
   * 获取互推盒子九宫格广告能否展示标志
   */
  public getNavigateBoxPortalFlag() {
    console.log('TYQSDK', 'getNavigateBoxPortalFlag:' + NavigateController.getInstance().getNavigateBoxPortalFlag());
    return NavigateController.getInstance().getNavigateBoxPortalFlag();
  }
  /**
   * OPPO
   * 展示互推盒子九宫格广告
   */
  public showNavigateBoxPortal() {
    console.log('TYQSDK', 'showNavigateBoxPortal');
    NavigateController.getInstance().showNavigateBoxPortal();
  }

  /**
   * OPPO & VIVO & WX => cocos,cocos3d
   * 设置渲染层级最高的组
   * 以下方法仅针对cocos、cocos3d引擎UI使用多个摄像机的情况，如果没有用到多个摄像机请忽略
   * 为了保证sdk的原生广告和互推等UI始终显示在最上层，请将组设置成最上层。
   * @param group 
   */
  public setGroup(group: string) {
    console.log('TYQSDK', 'setGroup');
    CocosUI.getInstance().setGroup(group);
  }


  /**
   * 判断渠道是否拥有添加桌面接口
   */
  public hasDesktopFunc() {
    console.log('TYQSDK', 'hasDesktopFunc');
    return OtherFunctions.getInstance().hasDesktopFunc();
  }
  /**
   * OPPO & VIVO & QQ & Tiktok & HW
   * 获取能否添加桌面图标标志
   * @param callback 
   */
  public getDeskTopFlag(callback) {
    console.log('TYQSDK', 'getDeskTopFlag');
    return OtherFunctions.getInstance().getDeskTopFlag(callback);
  }
  /**
   * OPPO & VIVO & QQ & Tiktok & HW
   * 添加桌面图标
   * @param callback 
   */
  public addDeskTop(callback) {
    console.log('TYQSDK', 'addDeskTop');
    OtherFunctions.getInstance().addDeskTop(callback);
  }


  /**
   * OPPO & VIVO & QQ & Tiktok
   * 展示系统提示
   * @param msg 提示信息
   * OPPO/QQ-最多七个文字
   * @param duration 提示框停留时间
   * OPPO/Tiktok/QQ-提示框停留时间(ms)，默认为1500
   * VIVO-0为短时显示，1为长时显示，默认0
   */
  public showToast(msg: string, duration?: number) {
    console.log('TYQSDK', 'showToast');
    OtherFunctions.getInstance().showToast(msg, duration);
  }


  /**
   * ALL
   * 手机震动
   * @param type short-短震动 long-长震动
   */
  public phoneVibrate(type: string) {
    console.log('TYQSDK', 'phoneVibrate', type);
    OtherFunctions.getInstance().phoneVibrate(type);
  }


  /**
   * OPPO
   * 数据上报
   */
  public reportMonitor() {
    console.log('TYQSDK', 'reportMonitor');
    OtherFunctions.getInstance().reportMonitor()
  }


  /**
   * TIKTOK
   * 分享图文
   */
  public share(templateId) {
    console.log('TYQSDK', 'share', templateId);
    RecordAndShare.getInstance().share(templateId);
  }

  /**
   * TIKTOK & KS
   * 开始录屏
   * @param duration 录屏的时长,单位s,必须大于3s,最大值300s(5分钟) KS可填任意数
   */
  public startGameVideo(duration) {
    console.log('TYQSDK', 'startGameVideo', duration);
    RecordAndShare.getInstance().startGameVideo(duration);
  }

  /**
   * TIKTOK & KS
   * 暂停录屏
   */
  public pauseGameVideo() {
    console.log('TYQSDK', 'pauseGameVideo');
    RecordAndShare.getInstance().pauseGameVideo();
  }

  /**
   * TIKTOK & KS
   * 继续录屏(暂停录屏之后)
   */
  public resumeGameVideo() {
    console.log('TYQSDK', 'resumeGameVideo');
    RecordAndShare.getInstance().resumeGameVideo();
  }

  /**
   * TIKTOK & KS
   * 停止录屏
   * @param callback 停止录屏后的回调,返回视频地址 KS返回录屏的ID
   */
  public stopGameVideo(callback) {
    console.log('TYQSDK', 'stopGameVideo');
    RecordAndShare.getInstance().stopGameVideo(callback);
  }

  /**
   * TIKTOK & KS
   * 分享视频
   * @param title 这是抖音分享视频的标题 KS可在快手后台申请样式添加样式ID,无样式ID需为""
   * @param desc 这是头条分享视频的描述 KS可填任意
   * @param topics 这是抖音分享视频的话题 KS可填任意
   * @param videoPath TT-视频地址 KS-录屏ID 停止录屏返回的地址或ID
   * @param callback 分享视频的回调
   */
  public shareVideo(title, desc, topics, videoPath, callback) {
    console.log('TYQSDK', 'shareVideo');
    RecordAndShare.getInstance().shareVideo(title, desc, topics, videoPath, callback);
  }

  /**
   * TIKTOK
   * 录制精彩瞬间
   * 数组的值表示记录这一时刻的前后时间段内的视频,单位是 s
   * @param before 这一时刻的前before秒
   * @param after 这一时刻的后after秒
   */
  public recordClip(before, after) {
    console.log('TYQSDK', 'recordClip');
    RecordAndShare.getInstance().recordClip(before, after);
  }

  /**
   * TIKTOK
   * 剪辑精彩瞬间
   * @param videoPath 视频存放地址
   * @param callback 剪辑回调
   */
  public clipVideo(videoPath, callback) {
    console.log('TYQSDK', 'clipVideo');
    RecordAndShare.getInstance().clipVideo(videoPath, callback);
  }

  /**
   * TIKTOK
   * 展示更多游戏按钮
   * @param ImageAddress 图片地址
   * @param width 按钮(图片)的宽
   * @param height 按钮(图片)的高
   * @param x 按钮(图片)的左上角横坐标
   * @param y 按钮(图片)的左上角纵坐标
   */
  public showMoreGames(ImageAddress: string, width: number, height: number, x: number, y: number) {
    console.log('TYQSDK', 'showMoreGames');
    RecordAndShare.getInstance().showMoreGames(ImageAddress, width, height, x, y);
  }
  /**
   * TIKTOK
   * 隐藏更多游戏按钮
   */
  public hideMoreGames() {
    console.log('TYQSDK', 'hideMoreGames');
    RecordAndShare.getInstance().hideMoreGames();
  }

  /**
   * TIKTOK
   * 展示更多游戏,按钮绑定点击事件即可
   */
  public showMoreGamesModal() {
    console.log("TYQSDK", "showMoreGamesModal");
    RecordAndShare.getInstance().showMoreGamesModal();
  }

  /**
   * TIKTOK
   * 展示更多游戏横幅
   */
  public showMoreGamesBanner() {
    console.log("TYQSDK", "showMoreGamesBanner");
    RecordAndShare.getInstance().showMoreGamesBanner();
  }
  /**
   * TIKTOK
   * 隐藏更多游戏横幅
   */
  public hideMoreGamesBanner() {
    console.log("TYQSDK", "hideMoreGamesBanner");
    RecordAndShare.getInstance().hideMoreGamesBanner();
  }

  /**
   * TIKTOK
   * 收藏
   * @param type "tip"-顶部气泡 "bar"-底部弹窗
   * @param content 弹窗文案,最多显示 12 个字符,建议默认使用 一键添加到我的小程序
   * @param position 弹窗类型为 bar 时的位置参数 "bottom"-贴近底部 "overtab"-悬于页面 tab 区域上方
   */
  public showFavoriteGuide(type: string, content: string, position: string) {
    console.log('TYQSDK', 'showFavoriteGuide');
    RecordAndShare.getInstance().showFavoriteGuide(type, content, position);
  }

  /**
   * ALL
   * 获取用户数据
   * @callback {userId:"",token:"",type:0}
   * type-0,游客类型;
   * type-1,用户类型;
   */
  public getUserData(callback) {
    console.log("TYQSDK", "getUserData");
    Network.getInstance().getUserData(callback);
  }

  /**
   * TIKTOK & OPPO & KS & HW & BL
   * 获取用户信息
   * @callback {head:"",name:"",sex:"0",power:false}
   * power-false,未授权获取用户信息
   * power-true,已授权获取用户信息
   * sex "M"为男,"F"为女,"0"为未知
   */
  public getUserInfo(callback) {
    console.log("TYQSDK", "getUserInfo");
    Network.getInstance().getUserInfo(callback);
  }

  /**
   * Tiktok
   * 强制游客登录之后再次获取用户信息
   * @param callback 登录成功返回true,失败返回false
   */
  public mustLogin(callback) {
    console.log("TYQSDK", "mustLogin");
    Network.getInstance().mustLogin(callback);
  }


  /** 
   * QQ
   * 获取盒子是否可以展示标志
   */
  public getBoxFlag() {
    console.log('TYQSDK', 'getBoxFlag:' + BoxController.getInstance().getBoxFlag());
    return BoxController.getInstance().getBoxFlag();
  }
  /**
   * QQ
   * 展示盒子广告
   */
  public showAppBox() {
    console.log('TYQSDK', 'showAppBox');
    BoxController.getInstance().showAppBox();
  }


  /** 
   * QQ & WX
   * 获取积木是否可以展示标志
   */
  public getBlockFlag() {
    console.log('TYQSDK', 'getBlockFlag:' + BlockController.getInstance().getBlockFlag());
    return BlockController.getInstance().getBlockFlag();
  }
  /**
   * QQ & WX
   * 展示积木广告
   * @param type QQ: "landscape"-横向展示 "vertical"-竖向展示   WX：广告组件的主题颜色,"white"-白色 "black"-黑色
   * @param x 积木广告左上角横坐标
   * @param y 积木广告左上角纵坐标
   * @param blockSize QQ：积木广告数量：1~5 实际数量以拉取的为准   WX：积木广告数量:5或者8  5个为单行列表,8个为双行列表
   */
  public showBlock(type: string, x: number, y: number, blockSize: number) {
    console.log('TYQSDK', 'showBlock');
    BlockController.getInstance().showBlock(type, x, y, blockSize);
  }
  /** 
   * QQ & WX
   * 关闭积木广告
   */
  public hideBlock() {
    console.log('TYQSDK', 'hideBlock');
    BlockController.getInstance().hideBlock();
  }


  /** 
   * Android & IOS
   * 是否加载到插屏视频广告
   */
  public getVideoIntersFlag() {
    console.log('TYQSDK', 'getVideoIntersFlag:' + videoController.getInstance().getVideoIntersFlag());
    return videoController.getInstance().getVideoIntersFlag();
  }
  /**
   * Android & IOS
   * 展示插屏视频广告
   */
  public showVideoInters(callback) {
    console.log('TYQSDK', 'showVideoInters');
    videoController.getInstance().showVideoInters(callback);
  }


  /**
   * Android & IOS
   * 退出游戏
   */
  public exitTheGame() {
    console.log('TYQSDK', 'exitTheGame');
    OtherFunctions.getInstance().exitTheGame();
  }


  /**
   * Android & IOS & Tiktok
   * 自定义事件上报
   * @param params Android&IOS-友盟事件ID,Tiktok-字节后台自定义事件ID
   * @param data 事件参数
   */
  public reportAnalytics(params: string, data: any) {
    console.log('TYQSDK', 'reportAnalytics');
    OtherFunctions.getInstance().reportAnalytics(params, data);
  }


  /**
   * Android & IOS
   * Android无回调
   * 实名认证(防沉迷)
   */
  public showAuthentication(callback) {
    console.log('TYQSDK', 'showAuthentication');
    OtherFunctions.getInstance().showAuthentication(callback);
  }
  /**
   * Android & IOS
   * Android无回调
   * 游客体验
   */
  public TouristModel(callback) {
    console.log('TYQSDK', 'TouristModel');
    OtherFunctions.getInstance().TouristModel(callback);
  }


  /**
   * Android
   * 展示原生广告
   * width ：宽
   * height ：高
   * viewX：界面的左上角距离整个界面左边的占比  
   * viewY：界面的左上角距离整个界面上边的占比
   */
  public showNativeAd(width, height, viewX, viewY) {
    console.log('TYQSDK', 'showNativeAd');
    NativeController.getInstance().showNativeAd(width, height, viewX, viewY);
  }


  /**
   * Android
   * 能否展示oppo超休闲（首页更多游戏）标志
   */
  public getShowMoreGameFlag() {
    console.log('TYQSDK', 'getShowMoreGameFlag');
    return OtherFunctions.getInstance().getShowMoreGameFlag();
  }
  /**
   * Android
   * oppo超休闲（首页更多游戏）
   */
  public showOPPOMoreGame() {
    console.log('TYQSDK', 'showOPPOMoreGame');
    OtherFunctions.getInstance().showOPPOMoreGame();
  }


  /**
   * IOS
   * 是否有网络
   */
  public hasNetwork(callback) {
    console.log('TYQSDK', 'hasNetwork:' + OtherFunctions.getInstance().hasNetwork(callback));
    OtherFunctions.getInstance().hasNetwork(callback);
  }


  /**
   * IOS
   * 展示评论
   */
  public showReviewAlert() {
    console.log('TYQSDK', 'showReviewAlert');
    OtherFunctions.getInstance().showReviewAlert();
  }


  /**
   * IOS
   * 每个视频播放之前  0:插屏  1:视频
   */
  public showiOSADWithScene(key: string, type: string) {
    console.log('TYQSDK', 'showReviewAlert');
    OtherFunctions.getInstance().showiOSADWithScene(key, type);
  }
  /**
   * IOS
   * 弹出广告激励视频回调中使用
   */
  public showiOSADWithType(key: string, type: string) {
    console.log('TYQSDK', 'showiOSADWithType');
    OtherFunctions.getInstance().showiOSADWithType(key, type);
  }
  /**
   * IOS
   * 弹出插屏之前视频界面 和 弹出插屏之后回调调用  0:插屏  1:视频
   */
  public videoUIShow(key: string) {
    console.log('TYQSDK', 'videoUIShow');
    OtherFunctions.getInstance().videoUIShow(key);
  }


}

export default TYQAd