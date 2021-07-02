import SdkTools, { Game_Platform } from "../tools/SdkTools"
import BannerController from "../ads/bannerAd/BannerController"
import IntersController from "../ads/IntersAd/IntersController"
import VideoController from "../ads/videoAd/VideoController"
import NativeController from "../ads/nativeAd/NativeController"
import OtherFunctions from "../tools/OtherFunctions"
import NavigateController from "../navigate/NavigateController"
import Config from "../sdkConfig"
import BoxController from "../ads/boxAd/BoxController"
import BlockController from "../ads/blockAd/BlockController"
import sdkConfig from "../sdkConfig"

const config = Config.getInstance();

/**
 * 服务器URL
 */
//const host = "https://cloud.xminigame.com/api"
// const host = "http://centos.6263game.com:10010" //测试

class Network {
  private static instance: Network

  /**
   * 服务器返回的token
   */
  private mobileToken: string = "";

  /**
   * 初始化成功
   */
  private isInitCompelete = 0;

  /**
   * 是否初始化过，此参数用于防止SDK多次初始化的问题
   */
  private hasBeenInit = false;

  /**
   * 是否下发广告
   */
  private pushAd: boolean = false;

  /**
   * 统计互推数据的开关默认开启
   */
  private statisSwitch: boolean = true;

  /**
   * 快手gameUserId
   */
  private gameUserId: string = "";

  /**
   * 小米登录成功返回的uid
   */
  private uid: number = 0;

  /**
   * 返回的用户数据
   */
  private userData: any = null;
  private userId: string = "";
  private userToken: string = "";
  private userType: number = 0;

  /**
   * 用户信息
   */
  public userInfo: any = null;
  public nickName: string = "";
  public avatar: string = "";
  public gender: string = "";

  /**
   * 强制登录后的回调
   */
  public mustLoginCallback;

  /**
   * Network 单例
   */
  public static getInstance(): Network {
    if (!Network.instance) {
      Network.instance = new Network()
    }
    return Network.instance
  }

  /**
   * 渠道的登录接口(获取渠道的token)
   */
  public login(callback) {
    let self = this;
    switch (SdkTools.getPlatform()) {
      case Game_Platform.GP_Oppo:
        {
          qg.login({
            success: function (res) {
              console.log("TYQSDK", "OPPO 登录成功：" + JSON.stringify(res.data));
              self.getH5SDKUserInfo(res.data.token, SdkTools.getData("ServerUserId", ""), callback);
            },
            fail: function (res) {
              console.log("TYQSDK", "OPPO 登录失败,", JSON.stringify(res));
              console.log("TYQSDK", "OPPO 启用游客登录");
              self.userRegister(SdkTools.getData("ServerUserId", ""), callback);
            }
          });
        }
        break;
      case Game_Platform.GP_Vivo:
        {
          console.log("TYQSDK", "VIVO 启用游客登录");
          this.userRegister(SdkTools.getData("ServerUserId", ""), callback);
        }
        break;
      case Game_Platform.GP_Tiktok:
        {
          tt.login({
            force: false,
            success(res) {
              if (res.isLogin) {
                console.log("TYQSDK", "Tiktok 已登录：" + JSON.stringify(res));
                self.getH5SDKUserInfo(res.code, SdkTools.getData("ServerUserId", ""), callback);
              } else {
                console.log("TYQSDK", "Tiktok 未登录,", JSON.stringify(res));
                console.log("TYQSDK", "Tiktok 启用游客登录");
                self.userRegister(SdkTools.getData("ServerUserId", ""), callback);
              }
            },
            fail(res) {
              console.log("TYQSDK", "Tiktok 登录失败,", JSON.stringify(res));
              console.log("TYQSDK", "Tiktok 启用游客登录");
              self.userRegister(SdkTools.getData("ServerUserId", ""), callback);
            },
          });
        }
        break;
      case Game_Platform.GP_QQ:
        {
          qq.login({
            success(res) {
              console.log("TYQSDK", "QQ 登录成功：" + JSON.stringify(res));
              self.getH5SDKUserInfo(res.code, SdkTools.getData("ServerUserId", ""), callback);
            },
            fail(res) {
              console.log("TYQSDK", "QQ 登录失败,", JSON.stringify(res));
              console.log("TYQSDK", "QQ 启用游客登录");
              self.userRegister(SdkTools.getData("ServerUserId", ""), callback);
            }
          })
        }
        break;
      case Game_Platform.GP_WX:
        {
          wx.login({
            success(res) {
              if (res.code) {
                console.log("TYQSDK", "WX 登录成功：" + JSON.stringify(res));
                self.getH5SDKUserInfo(res.code, SdkTools.getData("ServerUserId", ""), callback);
              } else {
                console.log("TYQSDK", "WX 登录失败," + JSON.stringify(res));
                console.log("TYQSDK", "WX 启用游客登录");
                self.userRegister(SdkTools.getData("ServerUserId", ""), callback);
              }
            },
            fail(res) {
              console.log("TYQSDK", "WX 登录失败,", JSON.stringify(res));
              console.log("TYQSDK", "WX 启用游客登录");
              self.userRegister(SdkTools.getData("ServerUserId", ""), callback);
            }
          })
        }
        break;
      case Game_Platform.GP_KS:
        {
          kwaigame.login({
            success: (result) => {
              console.log("TYQSDK", "KS 登录成功:" + JSON.stringify(result));
              console.log("result.gameUserId:", JSON.stringify(result.gameUserId));
              self.gameUserId = result.gameUserId;
              console.log("self.gameUserId:", JSON.stringify(self.gameUserId));
              self.getH5SDKUserInfo(result.gameToken, SdkTools.getData("ServerUserId", ""), callback);
            },
            fail: (error) => {
              console.log("TYQSDK", "KS 登录失败:" + JSON.stringify(error));
              console.log("TYQSDK", "KS 启用游客登录");
              self.userRegister(SdkTools.getData("ServerUserId", ""), callback);
            }
          });
        }
        break;
      case Game_Platform.GP_HW:
        {
          hbs.gameLogin({
            forceLogin: 1, //强制登录，未登录时会弹出登录对话框
            appid: sdkConfig.APPID, //appid需要与华为开发者联盟后台配置一致
            success: function (res) {
              console.log("TYQSDK", "HW 登录成功", JSON.stringify(res));
              console.log(res.playerId);
              self.getH5SDKUserInfo(res.playerId, SdkTools.getData("ServerUserId", ""), callback);
            },
            fail(data, code) {
              console.log("TYQSDK", "HW 登录失败", JSON.stringify(data) + "," + JSON.stringify(code));
              console.log("TYQSDK", "HW 启用游客登录");
              self.userRegister(SdkTools.getData("ServerUserId", ""), callback);
            }
          });
        }
        break;
      case Game_Platform.GP_XM:
        {
          qg.login({
            success: function (res) {
              console.log("TYQSDK " + "XM 登录成功" + JSON.stringify(res));
              self.uid = res.data.appAccountId;
              self.getH5SDKUserInfo(res.data.session, SdkTools.getData("ServerUserId", ""), callback);
            },
            fail: function (res) {
              console.log("TYQSDK", "XM 登录失败", JSON.stringify(res));
              self.userRegister(SdkTools.getData("ServerUserId", ""), callback);
            }
          });
        }
        break;
      case Game_Platform.GP_BL:
        {
          bl.login({
            success(res) {
              if (res.code) {
                console.log("TYQSDK", "BL 登录成功", JSON.stringify(res));
                self.getH5SDKUserInfo(res.code, SdkTools.getData("ServerUserId", ""), callback);
              } else {
                console.log("TYQSDK", "BL 登录失败", JSON.stringify(res));
                console.log("TYQSDK", "BL 启用游客登录");
                self.userRegister(SdkTools.getData("ServerUserId", ""), callback);
              }
            },
            fail(res) {
              console.log("TYQSDK", "BL 登录失败", JSON.stringify(res));
              console.log("TYQSDK", "BL 启用游客登录");
              self.userRegister(SdkTools.getData("ServerUserId", ""), callback);
            }
          })
        }
        break;
      default:
        break;
    }
  }


  /**
  * 针对没有获取渠道token的游客用户
  */
  userRegister(userId, callback) {
    console.log("TYQSDK", "获取游客token");
    var Data =
    {
      "channelId": config.channelId,
      "signParam": {
      },
      "userId": userId
    }

    //var self = this;
    //var url = `${host}/xmini-game-user/mobile/login/getVisitorToken`;
    //var xhr = new XMLHttpRequest();
    //xhr.onreadystatechange = function () {
      //if (xhr.readyState == 4 && xhr.status == 200) {
      //   var data = xhr.responseText;
      //   if (data) {
      //     console.log("TYQSDK", "getVisitorToken 服务器返回的data:", data);
      //   }
      //   var json = JSON.parse(data);

      //   if (typeof json == "undefined" || !json || !json.data) {
      //     console.log("TYQSDK", 'error : is not a json');
      //     callback(false);
      //     return;
      //   }

      //   // 保存服务器返回的游客token和userId
      //   var token = json.data.token;
      //   var userId = json.data.userId;

      //   if (token && typeof token != "undefined" && userId && typeof userId != "undefined") {
      //     console.log("TYQSDK", "注册成功", token, userId);
      //     self.mobileToken = token;
          SdkTools.saveData("ServerUserId", userId);
          callback(true);
      //   }
      //   else {
      //     console.log("TYQSDK", "注册失败", token, userId);
      //     callback(false);
      //   }

      //   self.userToken = token;
      //   self.userId = userId;
      //   self.userType = 0;
      // }
    //};
    // xhr.addEventListener('error', e => {
    //   console.log("TYQSDK", 'error', JSON.stringify(e));
    // });

    // console.log("TYQSDK", "发送给服务器的Data：", JSON.stringify(Data));
    // xhr.open("POST", url, true);
    // xhr.setRequestHeader("Content-type", "application/json");
    // xhr.send(JSON.stringify(Data));
  }


  /**
  * 针对已经获取到获取渠道token的用户
  */
  getH5SDKUserInfo(token, userId, callback) {
    console.log("TYQSDK", "渠道返回的token：", token);
    var Data;
    switch (SdkTools.getPlatform()) {
      case Game_Platform.GP_Oppo:
        {
          Data =
          {
            "channelId": config.channelId,
            "signParam": {
              "token": token,
              "sdkVersion": "1.0.0"
            },
            "userId": userId
          }
        }
        break;
      case Game_Platform.GP_Vivo:
        {
          Data =
          {
            "channelId": config.channelId,
            "signParam": {
              "token": token,
              // "sdkVersion": "1.0.0" vivo不需要sdkVersion
            },
            "userId": userId
          }
        }
        break;
      case Game_Platform.GP_Tiktok:
      case Game_Platform.GP_QQ:
      case Game_Platform.GP_WX:
        {
          Data =
          {
            "channelId": config.channelId,
            "signParam": {
              "code": token,
              "nickName": SdkTools.getData("nickName", ""),
              "avatar": SdkTools.getData("avatarUrl", ""),
              "gender": SdkTools.getData("gender", "0")
            },
            "userId": userId
          }
        }
        break;
      case Game_Platform.GP_KS:
        {
          Data =
          {
            "channelId": config.channelId,
            "signParam": {
              "gameUserId": this.gameUserId,
              "gameToken": token,
              "nickName": SdkTools.getData("nickName", ""),
              "avatar": SdkTools.getData("avatarUrl", ""),
              "gender": SdkTools.getData("gender", "0")
            },
            "userId": userId
          }
        }
        break;
      case Game_Platform.GP_HW:
        {
          Data =
          {
            "channelId": config.channelId,
            "signParam": {
              "openId": token,
              "appId": sdkConfig.APPID,
              "nickName": SdkTools.getData("nickName", ""),
              "avatar": SdkTools.getData("avatarUrl", ""),
              "gender": SdkTools.getData("gender", "0")
            },
            "userId": userId
          }
        }
        break;
      case Game_Platform.GP_XM:
        {
          Data =
          {
            "channelId": config.channelId,
            "signParam": {
              "session": token,
              "uid": this.uid,
              "nickName": SdkTools.getData("nickName", ""),
              "avatarUrl": SdkTools.getData("avatarUrl", ""),
              "gender": SdkTools.getData("gender", "0")
            },
            "userId": userId
          }
        }
        break;
      case Game_Platform.GP_BL:
        {
          Data =
          {
            "channelId": config.channelId,
            "signParam": {
              "js_code": token,
              "nickName": SdkTools.getData("nickName", ""),
              "avatar": SdkTools.getData("avatarUrl", ""),
              "gender": SdkTools.getData("gender", "0")
            },
            "userId": userId
          }
        }
        break;
      default:
        {
          callback(false);
        }
        break;
    }

    console.log("TYQSDK", "封装的Data：", JSON.stringify(Data));

    // var self = this;
    //var url = `${host}/xmini-game-user/mobile/login/getMobileToken`;
    // let xhr = new XMLHttpRequest();
    // xhr.onreadystatechange = function () {
    //   if (xhr.readyState == 4 && xhr.status == 200) {
    //     var data = xhr.responseText;
    //     if (data) {
    //       console.log("TYQSDK", "getMobileToken 服务器返回的data：", data);
    //     }
    //     var json = JSON.parse(data);

    //     if (typeof json == "undefined" || !json || !json.data) {
    //       console.log("TYQSDK", 'error : is not a json');
    //       callback(false);
    //       return;
    //     }

    //     var token = json.data.token;
    //     var userId = json.data.userId;

    //     self.nickName = json.data.nickName;
    //     json.data.gender == "" ? self.gender = "0" : self.gender = json.data.gender;
    //     self.avatar = json.data.avatar;

    //     if (token && typeof token != "undefined" && userId && typeof userId != "undefined") {
    //       self.mobileToken = token;
    //       SdkTools.saveData("ServerUserId", userId);
           callback(true);
    //     }
    //     else {
    //       console.log("TYQSDK", "注册失败");
    //       callback(false);
    //     }

    //     // 保存用户数据
    //     self.userToken = token;
    //     self.userId = userId;
    //     self.userType = 1;
    //   }
    // };
    // xhr.addEventListener('error', e => {
    //   console.log("TYQSDK", 'error', JSON.stringify(e));
    // });

    // xhr.open("POST", url, true);
    // xhr.setRequestHeader("Content-type", "application/json");
    // // xhr.setRequestHeader("Authorization", token);
    // xhr.send(JSON.stringify(Data));
  }


  /**
   * 获得后台在线参数
   */
  public getSDKOnlineConfig(callback?) {
    if (this.hasBeenInit) {
      console.log("TYQSDK", "重复初始化 return");
      return;
    }
    this.hasBeenInit = true;

    //下发广告
    // var url = `${host}/xmini-game-advert/mobile/advert/downAdConfigure?channelId=${config.channelId}`
    // var self = this;
    // let xhr = new XMLHttpRequest();

    // xhr.onreadystatechange = function () {
    //   if (xhr.readyState == 4 && xhr.status == 200) {
    //     var data = xhr.responseText;
    //     if (!data) {
    //       console.log("TYQSDK", "初始化失败");
    //       return;
    //     }
    //     if (self.pushAd) return;
    //     self.pushAd = true;

    //     console.log("TYQSDK", "downAdConfigure 下发广告data：", data);

    //     var json = JSON.parse(data);
    //     if (typeof json == "undefined" || !json || !json.data) {
    //       console.log("TYQSDK", 'error : is not a json');
    //       return;
    //     }
    //     if (typeof json.data.mainSwitch != "undefined") {
    //   let SW_MainSwitch = json.data.mainSwitch;           //广告总开关
    //       // 渠道管理-广告总开关
    //       if (!SW_MainSwitch) {
    //         console.log("TYQSDK", "广告开关没有开启");
    //         return;
    //       }
    //     }


    //     // 广告开关
    //     var adSwitch = json.data.advertSwitch;
    //     if (typeof adSwitch.bannerSwitch != "undefined") {
    //       BannerController.getInstance().SW_SystemBannerSwitch = adSwitch.bannerSwitch;             // 系统Banner开关
    //     }
    //     if (typeof adSwitch.intersSwitch != "undefined") {
    //       IntersController.getInstance().SW_SystemIntersSwitch = adSwitch.intersSwitch;             // 系统插屏开关
    //     }
    //     if (typeof adSwitch.videoSwitch != "undefined") {
    //       VideoController.getInstance().SW_VideoSwitch = adSwitch.videoSwitch;                     //视频开关
    //     }
    //     if (typeof adSwitch.nativeBigIntersSwitch != "undefined") {
    //       NativeController.getInstance().SW_NativeMainSwitch = adSwitch.nativeBigIntersSwitch;     //原生总开关
    //     }
    //     if (typeof adSwitch.nativeBannerSwitch != "undefined") {
    //       BannerController.getInstance().SW_NativeBannerSwitch = adSwitch.nativeBannerSwitch;      //原生Banner开关
    //     }
    //     if (typeof adSwitch.nativeIntersSwitch != "undefined") {
    //       IntersController.getInstance().SW_NativeIntersSwitch = adSwitch.nativeIntersSwitch;      //原生插屏开关
    //     }
    //     if (typeof adSwitch.boxSwitch != "undefined") {
    //       BoxController.getInstance().SW_BoxSwitch = adSwitch.boxSwitch;      //QQ盒子广告开关
    //       NavigateController.getInstance().SW_BoxSwitch = adSwitch.boxSwitch;      //互推盒子广告开关
    //     }


    //     // 广告ID
    //     var adIdentity = json.data.advertIdentity;
    //     if (adIdentity.enableSwitch && typeof adIdentity != "undefined") {
    //       adIdentity.adBannerId && (BannerController.getInstance().ID_BannerId = adIdentity.adBannerId); //banner广告ID
    //       adIdentity.adIntersId && (IntersController.getInstance().ID_SystemIntersId = adIdentity.adIntersId); //系统插屏广告ID
    //       adIdentity.adNativeId && (NativeController.getInstance().ID_NativeID = adIdentity.adNativeId); //原生广告ID
    //       adIdentity.adVideoId && (VideoController.getInstance().ID_VideoID = adIdentity.adVideoId); //视频广告ID
    //       adIdentity.adBoxId && (BoxController.getInstance().ID_BoxID = adIdentity.adBoxId); //盒子广告ID
    //       adIdentity.adBrickId && (BlockController.getInstance().ID_BlockID = adIdentity.adBrickId); //积木广告ID
    //     } else {
    //       console.log("TYQSDK", "广告ID未启用==================");
    //     }


    //     // 插屏二合一
    //     if (json.data.combineInters != null) {
    //       var adCombineControl = json.data.combineInters;
    //       if (typeof adCombineControl != "undefined" && adCombineControl.enableSwitch != null && adCombineControl.enableSwitch) {
    //         IntersController.getInstance().NUM_NativeIntersPercent = adCombineControl.nativeIntersRatio; //原生插屏出现的概率
    //       }
    //     }


    //     // 动态控制
    //     if (json.data.dynamicNativeInters != null) {
    //       var adDynamicNativeInters = json.data.dynamicNativeInters;
    //       if (typeof adDynamicNativeInters.intersSwitch != "undefined" && adDynamicNativeInters.intersSwitch != null && adDynamicNativeInters.intersSwitch) {
    //         NativeController.getInstance().NUM_NativeIntersReportFrequency = adDynamicNativeInters.reportFrequency;       //原生插屏上报次数
    //       }
    //     }


    //     // 广告基础控制-banner控制
    //     if (json.data.baseControl != null) {
    //       var adBannerControl = json.data.baseControl;
    //       if (typeof adBannerControl.bannerSwitch != "undefined" && adBannerControl.bannerSwitch != null && adBannerControl) {
    //         if (typeof adBannerControl.refreshTime != "undefined" && adBannerControl.refreshTime != null && adBannerControl.refreshTime != 0) {
    //           BannerController.getInstance().NUM_BannerUpdateTime = adBannerControl.refreshTime;                //Banner刷新时间
    //         }
    //         if (typeof adBannerControl.priority != "undefined" && adBannerControl.priority != null && adBannerControl.priority) {
    //           if (adBannerControl.priority == "nativeBanner") {
    //             BannerController.getInstance().SW_SystemBannerFirst = false;                                 //系统banner优先？  
    //           }
    //         }
    //         if (typeof adBannerControl.maxClose != "undefined" && adBannerControl.maxClose != null && adBannerControl.maxClose != 0) {
    //           BannerController.getInstance().NUM_BannerMostShowTimes = adBannerControl.maxClose;            // banner最大展示次数
    //         }
    //       }
    //     }


    //     // 广告基础控制-插屏控制
    //     if (json.data.baseControl != null) {
    //       var adIntersControl = json.data.baseControl;
    //       if (typeof adIntersControl != "undefined" && adIntersControl != null && adIntersControl) {
    //         IntersController.getInstance().SW_IntersBaseControlSwitch = adIntersControl.intersSwitch;     //插屏基本控制的开关(插屏开关)
    //         if (typeof adIntersControl.startNum != "undefined" && adIntersControl.startNum != null && adIntersControl.startNum != 0) {
    //           IntersController.getInstance().NUM_IntersStartNum = adIntersControl.startNum;        //插屏开始次数
    //         }
    //         if (typeof adIntersControl.intervalNum != "undefined" && adIntersControl.intervalNum != null && adIntersControl.intervalNum != 0) {
    //           IntersController.getInstance().NUM_IntersIntervalNum = adIntersControl.intervalNum;        //插屏间隔次数
    //         }
    //         if (typeof adIntersControl.intervalTime != "undefined" && adIntersControl.intervalTime != null && adIntersControl.intervalTime != 0) {
    //           IntersController.getInstance().NUM_IntersIntervalTime = adIntersControl.intervalTime;      //插屏间隔最小时间 
    //         }
    //         if (typeof adIntersControl.delayEject != "undefined" && adIntersControl.delayEject != null && adIntersControl.delayEject != 0) {
    //           IntersController.getInstance().NUM_IntersDelayTime = adIntersControl.delayEject;           //插屏延迟时间(ms)
    //         }
    //         if (typeof adIntersControl.delayProbability != "undefined" && adIntersControl.delayProbability != null && adIntersControl.delayProbability != 0) {
    //           IntersController.getInstance().NUM_IntersDelayPercent = adIntersControl.delayProbability;  //插屏延迟概率
    //         }
    //       }
    //     }


    //     // 广告基础控制-原生控制
    //     if (json.data.baseControl != null) {
    //       var adNativeControl = json.data.baseControl;
    //       if (typeof adNativeControl.originalSwitch != "undefined" && adNativeControl.originalSwitch != null && adNativeControl.originalSwitch) {
    //         if (typeof adNativeControl.originalRefreshTime != "undefined" && adNativeControl.originalRefreshTime != null && adNativeControl.originalRefreshTime > 0) {
    //           NativeController.getInstance().NUM_NativeUpdateTime = adNativeControl.originalRefreshTime;  //原生刷新时间
    //         }
    //       }
    //     }


    //     // 桌面开关
    //     if (json.data.desktopSwitch != null) {
    //       var adOtherSwitch = json.data.desktopSwitch;
    //       if (typeof adOtherSwitch.desktopIconSwitch != "undefined" && adOtherSwitch.desktopIconSwitch != null && adOtherSwitch) {
    //         OtherFunctions.getInstance().SW_DesktopSwitch = adOtherSwitch.desktopIconSwitch;               // 添加桌面图标开关
    //       }
    //       if (typeof adOtherSwitch.activateDesktopIconSwitch != "undefined" && adOtherSwitch.activateDesktopIconSwitch != null && adOtherSwitch) {
    //         OtherFunctions.getInstance().SW_IntersToDesktop = adOtherSwitch.activateDesktopIconSwitch;          // 插屏间隔弹桌面图标开关
    //       }
    //       if (typeof adOtherSwitch.autoAddDesktopNumber != "undefined" && adOtherSwitch.autoAddDesktopNumber != null && adOtherSwitch.desktopIconSwitch && adOtherSwitch.activateDesktopIconSwitch && adOtherSwitch.autoAddDesktopNumber != 0) {
    //         OtherFunctions.getInstance().NUM_DeskAutoMostTimes = adOtherSwitch.autoAddDesktopNumber;        // 自动弹添加桌面次数
    //       }
    //       if (typeof adOtherSwitch.intersAddDesktopNumber != "undefined" && adOtherSwitch.intersAddDesktopNumber != null && adOtherSwitch.activateDesktopIconSwitch && adOtherSwitch.intersAddDesktopNumber != 0) {
    //         OtherFunctions.getInstance().NUM_IntersAddDesktopNumber = adOtherSwitch.intersAddDesktopNumber;         // 第几次插屏变添加桌面
    //       }
    //     }


        // 创建广告
        //(adIdentity.adBannerId || SdkTools.getPlatform() == Game_Platform.GP_BL) && 
        BannerController.getInstance().createSystemBanner();
        //adIdentity.adIntersId && 
        IntersController.getInstance().createSystemInters();
        //adIdentity.adNativeId && 
        NativeController.getInstance().createNativeAd();
        ///(adIdentity.adVideoId || SdkTools.getPlatform() == Game_Platform.GP_BL) && 
        VideoController.getInstance().createVideoAd();
        //adIdentity.adBoxId && 
        BoxController.getInstance().createAppBox();
        //adIdentity.adBrickId && 
        BlockController.getInstance().createBlock();


        IntersController.getInstance().runIntersInterval();
        SdkTools.getInstance().initSystemInfo(callback);
    //   }
    // }

    // xhr.onerror = function (e) {
    //   console.log("TYQSDK", "err:" + JSON.stringify(e));
    // }
    // xhr.open("GET", url, true);
    // xhr.setRequestHeader("content-type", "application/x-www-form-urlencoded");
    // xhr.setRequestHeader("Authorization", this.mobileToken);
    // xhr.send();

    // if (SdkTools.getPlatform() == Game_Platform.GP_Oppo || SdkTools.getPlatform() == Game_Platform.GP_WX) {
    //   // 下发互推
    //   var navigateurl = `${host}/xmini-game-advert/mobile/pushgame/downPushGames?channelId=${config.channelId}`
    //   var navigatexhr = new XMLHttpRequest();

    //   navigatexhr.onreadystatechange = function () {
    //     if (navigatexhr.readyState == 4 && navigatexhr.status == 200) {
    //       var data = navigatexhr.responseText;
    //       if (!data) {
    //         console.log("TYQSDK", "初始化失败");
    //         return;
    //       }

    //       console.log("TYQSDK", "下发互推data：", data);

    //       var json = JSON.parse(data);
    //       if (typeof json == "undefined" || !json || !json.data) {
    //         console.log("TYQSDK", 'error : is not a json');
    //         return;
    //       }


    //       // 互推控制
    //       let navigateSwitch = false;
    //       if (json.data.masterSwitch && typeof json.data.masterSwitch != "undefined") {
    //         navigateSwitch = json.data.masterSwitch;                                            // 互推主开关
    //       }
    //       if (!navigateSwitch) {
    //         self.isInitCompelete++;
    //         if (callback && self.isInitCompelete == 2) {
    //           callback(true);
    //         }
    //         console.log("TYQSDK", "互推开关没有开启");
    //         return;
    //       }


    //       // 互推开关
    //       var promoData = json.data.pushSwitch;
    //       if (typeof json.data.pushGameList != "undefined") {
    //         NavigateController.getInstance().navigateList = json.data.pushGameList              // 互推游戏列表
    //         NavigateController.getInstance().loadNavigateList();
    //       }

    //       switch (SdkTools.getPlatform()) {
    //         case Game_Platform.GP_Oppo:
    //         case Game_Platform.GP_WX:
    //           if (promoData && typeof promoData.iconSwitch != "undefined") {
    //             NavigateController.getInstance().SW_NavigateIconSwitch = promoData.iconSwitch;      // 互推ICON开关
    //             if (promoData.iconSwitch) {
    //               NavigateController.getInstance().createNavigateIcon();
    //             }
    //           }
    //           if (promoData && typeof promoData.listSwitch != "undefined") {
    //             NavigateController.getInstance().SW_NavigateGroupSwitch = promoData.listSwitch;     // 互推列表开关
    //             if (promoData.listSwitch) {
    //               NavigateController.getInstance().createNavigateGroup();
    //             }
    //           }
    //           if (promoData && typeof promoData.settleSwitch != "undefined") {
    //             NavigateController.getInstance().SW_NavigateSettleSwitch = promoData.settleSwitch;   // 结算互推开关
    //             if (promoData.settleSwitch) {
    //               NavigateController.getInstance().createNavigateSettle();
    //             }
    //           }
    //           break;

    //         // if (promoData && typeof promoData.iconSwitch != "undefined") {
    //         //   NavigateController.getInstance().SW_NavigateIconSwitch = promoData.iconSwitch;      // 互推ICON开关
    //         //   if (promoData.iconSwitch) {
    //         //     NavigateController.getInstance().createNavigateIcon();
    //         //   }
    //         // }
    //         // NavigateWX.getInstance().createNavigateBanner();
    //         // NavigateWX.getInstance().createNavigatePortal();
    //         // break;
    //         default:
    //           break;
    //       }



    //       // 互推统计
    //       var statisSwitch = json.data.statisSwitch;
    //       if (statisSwitch && typeof statisSwitch != "undefined") {
    //         self.statisSwitch = statisSwitch;                   // 互推统计开关
    //       }


    //       self.isInitCompelete++;
    //       if (callback && self.isInitCompelete == 2) {
             callback(true);
    //       }
    //     }
    //   };

    //   navigatexhr.open("GET", navigateurl, true);
    //   navigatexhr.setRequestHeader("Authorization", this.mobileToken);
    //   navigatexhr.send();
    // }
  }


  /**
   * 互推统计
   */
  public statistics(infom) {
    if (!this.statisSwitch) {
      return;
    }
    // // 互推统计
    // var url = `${host}/xmini-game-user/mobile/pushdata/collectAdPush?channelId=${config.channelId}&pushGamePackage=${infom.pushGamePackage}`;
    // var xhr = new XMLHttpRequest();
    // xhr.onreadystatechange = function () {
    //   if (xhr.readyState == 4 && xhr.status == 200) {
    //     var data = xhr.responseText;
    //     if (data) {
    //       console.log("TYQSDK", "互推统计数据:" + data);
    //     }
    //   }
    // };
    // xhr.open("POST", url, true);
    // xhr.setRequestHeader("Content-type", "application/json");
    // xhr.setRequestHeader("Authorization", this.mobileToken);
    // xhr.send();
  }


  /**
   * 获取用户数据
   */
  public getUserData(callback) {
    console.log("TYQSDK", "getUserData=====================");
    this.userData = {
      userId: this.userId,
      token: this.userToken,
      userType: this.userType,
    }
    callback(this.userData);
  }


  /**
   * 获取用户信息
   */
  public getUserInfo(callback) {
    console.log("TYQSDK", "getUserInfo=====================");
    this.userInfo = {
      head: "",
      name: "",
      sex: "",
      city: "",
      province: "",
      country: "",
      power: false
    }
    let self = this;
    switch (SdkTools.getPlatform()) {
      case Game_Platform.GP_Tiktok:
        // 如果是用户类型
        if (self.userType == 1) {
          tt.getUserInfo({
            success(res) {
              console.log("TYQSDK", "用户授权成功");
              self.userInfo.head = res.userInfo.avatarUrl;
              self.userInfo.name = res.userInfo.nickName;
              if (res.userInfo.gender == 1) {
                self.userInfo.sex = "M";
              } else if (res.userInfo.gender == 2) {
                self.userInfo.sex = "F";
              } else {
                self.userInfo.sex = "0";
              }
              self.userInfo.city = res.userInfo.city;
              self.userInfo.province = res.userInfo.province;
              self.userInfo.country = res.userInfo.country;
              self.userInfo.power = true;
              SdkTools.saveData("avatarUrl", self.userInfo.head);
              SdkTools.saveData("nickName", self.userInfo.name);
              SdkTools.saveData("gender", self.userInfo.sex);
              callback(self.userInfo);
            },
            fail(res) {
              console.log("TYQSDK", "用户拒绝授权");
              self.userInfo.power = false;
              callback(self.userInfo);
            },
          });
        } else {
          callback(self.userInfo);
        }
        break;
      case Game_Platform.GP_Oppo:
        self.userInfo.head = self.avatar;
        self.userInfo.name = self.nickName;
        self.userInfo.sex = self.gender;
        self.userInfo.power = true;
        callback(self.userInfo);
        break;
      case Game_Platform.GP_KS:
        kwaigame.authorize({
          scope: "Scope.userInfo",
          success: () => {
            console.log("TYQSDK", "授权获取用户信息成功");
          },
          fail: (error) => {
            console.log("TYQSDK", "授权获取用户信息失败: " + JSON.stringify(error));
          },
          complete: () => {
            console.log("TYQSDK", "授权获取用户信息完成");
          }
        });
        kwaigame.getUserInfo({
          success: (result) => {
            console.log("TYQSDK", "获取用户信息成功：" + JSON.stringify(result));
            self.userInfo.head = result.userHead;
            self.userInfo.name = result.userName;
            self.userInfo.sex = result.gender;
            self.userInfo.power = true;
            SdkTools.saveData("avatarUrl", self.userInfo.head);
            SdkTools.saveData("nickName", self.userInfo.name);
            SdkTools.saveData("gender", self.userInfo.sex);
            callback(self.userInfo);
          },
          fail: (error) => {
            console.log("TYQSDK", "获取用户信息失败: " + JSON.stringify(error));
            self.userInfo.power = false;
            callback(self.userInfo);
          },
          complete: () => {
            console.log("TYQSDK", "获取用户信息完成");
          }
        });
        break;
      case Game_Platform.GP_HW:
        hbs.authorize({
          scope: 'userInfo',
          params: {
            appid: sdkConfig.APPID,
            type: "token",
            scope: 'scope.baseProfile',
            state: "200"
          },
          success: function (res) {
            console.log("TYQSDK", "HW authorize success", res);
            self.userInfo.name = res.nickname;
            if (res.avatar.default != undefined) self.userInfo.head = res.avatar.default;
            self.userInfo.power = true;
            SdkTools.saveData("avatarUrl", self.userInfo.head);
            SdkTools.saveData("nickName", self.userInfo.name);
            callback(self.userInfo);
          },
          fail: function () {
            console.log("TYQSDK", "HW authorize fail");
            self.userInfo.power = false;
            callback(self.userInfo);
          },
        });
        break;
      case Game_Platform.GP_BL:
        bl.getUserInfo({
          success(res) {
            console.log("TYQSDK", "BL 授权获取用户信息成功", res);
            self.userInfo.head = res.userInfo.avatarUrl;
            self.userInfo.name = res.userInfo.nickname;
            self.userInfo.country = res.userInfo.country;
            self.userInfo.province = res.userInfo.province;
            self.userInfo.city = res.userInfo.city;
            if (res.userInfo.gender == 1) {
              self.userInfo.sex = "M";
            } else if (res.userInfo.gender == 2) {
              self.userInfo.sex = "F";
            } else {
              self.userInfo.sex = "0";
            }
            self.userInfo.power = true;
            SdkTools.saveData("avatarUrl", self.userInfo.head);
            SdkTools.saveData("nickName", self.userInfo.name);
            SdkTools.saveData("gender", self.userInfo.sex);
            callback(self.userInfo);
          },
          fail(res) {
            console.log("TYQSDK", "BL 授权获取用户信息失败", res);
            self.userInfo.power = false;
          }
        });
        break;
      case Game_Platform.GP_Test:
      default:
        callback(self.userInfo);
        break;
    }
  }

  /**
   * 强制游客登录
   */
  public mustLogin(callback) {
    let self = this;
    this.mustLoginCallback = callback;
    switch (SdkTools.getPlatform()) {
      case Game_Platform.GP_Tiktok:
        let data =
        {
          "channelId": config.channelId,
          "signParam": {
            "code": "",
            "nickName": SdkTools.getData("nickName", ""),
            "avatar": SdkTools.getData("avatarUrl", ""),
            "gender": SdkTools.getData("gender", "0")
          },
          "userId": this.userId
        }

        tt.login({
          // force: false,
          success(res) {
            console.log("TYQSDK", "Tiktok 登录成功：" + JSON.stringify(res));
            data.signParam.code = res.code;
            // self.sendRequestToServe(`${host}/xmini-game-user/mobile/login/getMobileToken`, "POST", data);
          },
          fail(res) {
            console.log("TYQSDK", "Tiktok 登录失败");
            callback(false);
          },
        });
        break;
      default:
        break;
    }
  }

  /**
   * 发送请求给服务器
   * @param requestWay 请求方式"POST" "GET"
   * @param data 传入参数
   */
  public sendRequestToServe(url: string, requestWay: string, data: any) {
    var self = this;
    let xhr = new XMLHttpRequest();
    // console.log("TYQSDK", "url", url);
    // console.log("TYQSDK", "请求方式：", requestWay);
    // console.log("TYQSDK", "入参：", data);
    xhr.onreadystatechange = function () {
      if (xhr.readyState == 4 && xhr.status == 200) {
        var data = xhr.responseText;
        if (data) {
          console.log("TYQSDK", "getMobileToken 服务器返回的参数：", data);
        }
        var json = JSON.parse(data);

        if (typeof json == "undefined" || !json || !json.data) {
          console.log("TYQSDK", 'error : is not a json');
          self.mustLoginCallback(false);
          return;
        }

        // 保存用户数据
        self.userToken = json.data.token;
        self.userId = json.data.userId;
        self.userType = 1;

        SdkTools.saveData("ServerUserId", self.userId);
        self.mustLoginCallback(true);
      }
    };
    xhr.addEventListener('error', e => {
      console.log("TYQSDK", 'error', JSON.stringify(e));
    });

    xhr.open(requestWay, url, true);
    xhr.setRequestHeader("Content-type", "application/json");
    xhr.send(JSON.stringify(data));
  }

}
export default Network