import NativeVivo from "./tyqsdk/ads/nativeAd/NativeVivo";
import SdkTools from "./tyqsdk/tools/SdkTools";
import CocosUI from "./tyqsdk/ui/CocosUI";

const {ccclass, property} = cc._decorator;

@ccclass
export default class test extends cc.Component {
    @property([cc.SpriteFrame])
    ArrImage=[];
    cocosGroup = "";
    onLoad () {
        this.loadNativeInstersRes();
        
    }

    start () {

    }

    onclick(){
        console.log("TYQSDK", "showNativeIntersUI===========================")
        var layerBg = new cc.Node("layerBg");
        layerBg.addComponent(cc.Sprite);
        layerBg.getComponent(cc.Sprite).spriteFrame = new cc.SpriteFrame(this.NIUIInfo.layerBg);
        layerBg.active = false;
        setTimeout(() => {
          console.log("TYQSDK", "setTimeout===========================layerBg",layerBg)
          layerBg.active = true;
          layerBg.width = 2560;
          layerBg.height = 2560;
          layerBg.x = cc.winSize.width / 2;
          layerBg.y = cc.winSize.height / 2;
        }, 0.5);
        layerBg.zIndex = 30003;
        layerBg.opacity = 150;
        layerBg.attr({ adId: 1 });
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
    
        //   let tempid = nativeInfo.adId
          //点击原生插屏
          button.on(cc.Node.EventType.TOUCH_START, function (event) {
            // NativeController.getInstance().reportNativeClick(tempid);
            // if (SdkTools.getPlatform() == Game_Platform.GP_HW) {
            //   IntersController.getInstance().intersNowTime = 0;
            //   scene.removeChild(layerBg);
            //   scene.removeChild(bg);
            //   scene.removeChild(button);
            // }
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
    
        //let tempid = nativeInfo.adId
        //点击原生插屏
        bg.on(cc.Node.EventType.TOUCH_START, function (event) {
        //   NativeController.getInstance().reportNativeClick(tempid);
        //   if (SdkTools.getPlatform() == Game_Platform.GP_HW) {
        //     IntersController.getInstance().intersNowTime = 0;
        //     scene.removeChild(layerBg);
        //     scene.removeChild(bg);
        //     scene.removeChild(button);
        //   }
        });
    
        var titleLabel = new cc.Node("titleLabel");
        titleLabel.addComponent(cc.Label);
        titleLabel.getComponent(cc.Label).fontSize = 30;
        // if (nativeInfo.title.length >= 10) nativeInfo.title = nativeInfo.title.substring(0, 10);
        // if (nativeInfo.desc.length >= 10) nativeInfo.desc = nativeInfo.desc.substring(0, 10);
        // titleLabel.getComponent(cc.Label).string = nativeInfo.title;
    
        titleLabel.color = cc.color(0xCC, 0x7C, 0x70);
        bg.addChild(titleLabel);
    
    
        if (true) {
          console.log("TYQSDK", "原生插屏广告大图优先")
          var descLabel = new cc.Node("descLabel");
          descLabel.addComponent(cc.Label);
         // descLabel.getComponent(cc.Label).string = this.nativeInfo.desc;
          descLabel.getComponent(cc.Label).fontSize = 30;
          descLabel.color = cc.color(0x99, 0x7C, 0x70);
          bg.addChild(descLabel);
    
          var bigImage = new cc.Node("icon");
          bigImage.addComponent(cc.Sprite);
         // bigImage.getComponent(cc.Sprite).spriteFrame = new cc.SpriteFrame(nativeInfo.Native_BigImage);
    
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
        // else if (NativeController.getInstance().getIconNativeFlag()) {
        //   console.log("TYQSDK", "原生插屏广告ICON展示")
        //   var descLabel = new cc.Node("descLabel");
        //   descLabel.addComponent(cc.Label);
        //   //descLabel.getComponent(cc.Label).string = nativeInfo.desc;
        //   descLabel.getComponent(cc.Label).fontSize = 30;
        //   descLabel.color = cc.color(0x00, 0x00, 0x00);
        //   bg.addChild(descLabel);
    
        //   var icon = new cc.Node("icon");
        //   icon.addComponent(cc.Sprite);
        //   //icon.getComponent(cc.Sprite).spriteFrame = new cc.SpriteFrame(nativeInfo.Native_icon);
        //   bg.addChild(icon);
    
        //   setTimeout(() => {
        //     titleLabel.y = bg.height / 2 - titleLabel.height / 2 - bg.height * 0.15;
        //     descLabel.x = 0;
        //     descLabel.y = -bg.height * 0.33;
    
        //     icon.height = bg.height * 0.55;
        //     icon.width = icon.height;
    
        //     icon.x = 0;
        //     icon.y = 0;
    
        //   }, 1);
        // }
    
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
    
        // NativeController.getInstance().nativeAdShowInfo[1] = tempid;
    
        var self = this;
        //关闭按钮
        exit.on(cc.Node.EventType.TOUCH_START, function (event) {
        //   IntersController.getInstance().intersNowTime = 0;
        //   NativeController.getInstance().nativeAdShowInfo[1] = "";
          scene.removeChild(layerBg);
          scene.removeChild(bg);
          scene.removeChild(button);
          event.stopPropagation();
        });
    }

    NIUIInfo:any=null;
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
    
        var self = this;
        self.NIUIInfo.layerBg = this.ArrImage[0];
        self.NIUIInfo.bg = this.ArrImage[1];
        self.NIUIInfo.button =this. ArrImage[2];
        self.NIUIInfo.exit = this.ArrImage[3];
        self.NIUIInfo.mask = this.ArrImage[4];
        self.NIUIInfo.ad=this.ArrImage[5];
      }
    // update (dt) {}
}
