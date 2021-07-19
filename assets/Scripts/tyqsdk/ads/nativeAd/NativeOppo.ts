import SdkTools from "../../tools/SdkTools";
import CocosUI from "../../ui/CocosUI";

/**
 * OPPO原生类
 */
class NativeOppo {

  private static instance: NativeOppo

  /**
   * oppo原生广告对象
   */
  public nativeAd: any = null;

  /**
   * oppo原生广告资源
   */
  public nativeInfo: any = null;

  /**
   * 原生广告内容,供研发获取
   */
  public nativeContent: any = null;

  /**
   * 是否加载到原生1:1图片/ICON
   */
  public isLoadIconNative: boolean = false;

  /**
   * 是否加载到原生2:1大图
  */
  public isLoadImageNative: boolean = false;

  /**
   * 存放上一个原生广告的ID
   */
  public tempID: string = "";

  /**
  * NativeOppo 单例
  */
  public static getInstance(): NativeOppo {
    if (!NativeOppo.instance) {
      NativeOppo.instance = new NativeOppo()
    }
    return NativeOppo.instance
  }


  /**
  * 展示原生Banner
  */
  public showNativeBanner() {
    CocosUI.getInstance().showNativeBannerUI(this.nativeInfo);
  }

  /**
   * 刷新原生banner
   */
  public updateNativeBanner() {
    CocosUI.getInstance().hideNativeBannerUI();
    CocosUI.getInstance().showNativeBannerUI(this.nativeInfo);
  }

  /**
   * 隐藏原生Banner 
  */
  public hideNativeBaner() {
    CocosUI.getInstance().hideNativeBannerUI();
  }

  /**
   * 创建oppo原生广告
   */
  public createNativeAd(ID) {

    console.log("TYQSDK", "OPPO 加载原生广告", ID);

    this.nativeAd = qg.createNativeAd({
      posId: ID
    })

    //window.bigImageNativeAD.load();

    this.nativeInfo = {
      adId: null,
      title: '特别惊喜',
      desc: '点我一下可不可以啊',
      clickBtnTxt: null,
      Native_icon: null,
      Native_BigImage: null
    };

    this.nativeContent =
    {
      adId: null,
      title: null,
      desc: null,
      Native_icon: null,
      Native_BigImage: null,
      NativeAdTip: "https://h5-1258069360.cos.ap-guangzhou.myqcloud.com/other/sdk/NativeAD/ICONAd.png",
      NativeClose: "https://h5-1258069360.cos.ap-guangzhou.myqcloud.com/other/sdk/NativeAD/nativeBannerClose.png",
    }

    var self = this;

    this.nativeAd.onLoad(function (res) {

      console.log("TYQSDK", "OPPO 原生广告加载成功", JSON.stringify(res.adList))

      var index = 0;
      for (var i = 0; i < res.adList.length; i++) {
        if (res.adList[i].icon != "" && res.adList[i].imgUrlList.length > 0) {
          console.log("TYQSDK", "OPPO 同时存在原生ICON和大图");
          index = i;
          break;
        }
        if (i == res.adList.length - 1 && (res.adList[i].icon != "" || res.adList[i].imgUrlList.length > 0)) {
          console.log("TYQSDK", "OPPO 只存在原生ICON或大图");
          index = i;
          break;
        }
      }

      self.nativeInfo.adId = String(res.adList[index].adId);
      self.nativeInfo.title = String(res.adList[index].title);
      self.nativeInfo.desc = String(res.adList[index].desc);
      self.nativeInfo.clickBtnTxt = String(res.adList[index].clickBtnTxt);

      self.nativeContent.adId = String(res.adList[index].adId);
      self.nativeContent.title = String(res.adList[index].title);
      self.nativeContent.desc = String(res.adList[index].desc);

      if (res.adList && res.adList[index].icon != "") {
        cc.loader.load({ url: String(res.adList[index].icon), type: 'png' }, (err, texture) => {
          console.log("TYQSDK", "OPPO 原生ICON加载成功");
          self.nativeInfo.Native_icon = texture;
          self.isLoadIconNative = true;
        });
        self.nativeContent.Native_icon = String(res.adList[index].icon);
      } else {
        self.nativeInfo.Native_icon = null;
        self.isLoadIconNative = false;
      }

      if (res.adList && res.adList[index].imgUrlList.length > 0) {
        cc.loader.load({ url: String(res.adList[index].imgUrlList[0]), type: 'png' }, (err, texture) => {
          console.log("TYQSDK", "OPPO 原生大图加载成功");
          self.nativeInfo.Native_BigImage = texture;
          self.isLoadImageNative = true;
        });
        self.nativeContent.Native_BigImage = String(res.adList[index].imgUrlList[0]);
      } else {
        self.nativeInfo.Native_BigImage = null;
        self.isLoadImageNative = false;
      }

    });


    //监听原生广告加载错误
    this.nativeAd.onError(err => {
      console.log("TYQSDK", "OPPO 原生广告加载失败：" + JSON.stringify(err))
    });

    this.nativeAd.load();
  }


  /**
   * 定时刷新原生广告
  */
  public nativeUpdate() {
    this.nativeAd && this.nativeAd.load();
  }

  /**
   * 是否加载到原生1:1图片
   */
  public getIconNativeFlag(): boolean {
    return this.isLoadIconNative;
  }

  /**
   * 是否加载到原生2:1大图
   */
  public getImageNativeFlag(): boolean {
    return this.isLoadImageNative;
  }


  /**
   * 展示原生插屏
   */
  public showNativeInters(NativeIntersReportFrequency) {
    //上报次数
    var self = this;
    if (NativeIntersReportFrequency <= 1) {
      self.reportNativeShow(self.nativeInfo.adId);
    }
    else {
      for (var i = 0; i < NativeIntersReportFrequency; i++) {
        setTimeout(() => {
          self.reportNativeShow(self.nativeInfo.adId);
        }, 5000 * i);
      }
    }
    CocosUI.getInstance().showNativeIntersUI(this.nativeInfo)
  }


  /**
   * 展示原生Icon
   */
  public showNativeIcon(width, height, x, y) {
    this.reportNativeShow(this.nativeInfo.adId);
    CocosUI.getInstance().showNativeIconUI(width, height, x, y, this.nativeInfo)
  }

  /**
   * 展示原生大图
   */
  public showNativeImage(width, height, x, y) {
    this.reportNativeShow(this.nativeInfo.adId);
    CocosUI.getInstance().showNativeImageUI(width, height, x, y, this.nativeInfo)
  }


  /**
   * 自由获取原生广告信息
   */
  public getNativeInfo() {
    return this.nativeContent;
  }
  /**
   * 上报原生广告展示
   */
  public reportNativeShow(ID) {
    if (this.tempID == ID) {
      console.log("TYQSDK", "OPPO 该原生广告ID已上报展示");
    } else {
      this.tempID = ID;
      console.log("TYQSDK", "OPPO 原生广告上报展示", "广告ID为:" + ID);
      this.nativeAd.reportAdShow({
        adId: ID
      })
    }
  }
  /**
   * 上报原生广告点击
   */
  public reportNativeClick(ID) {
    console.log("TYQSDK", "OPPO 原生广告上报点击", "广告ID为:" + ID);
    this.nativeAd.reportAdClick({
      adId: ID
    })
  }
}

export default NativeOppo 