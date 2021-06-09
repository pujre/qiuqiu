
import TYQAd from './TYQAd'
import SdkTools from './tools/SdkTools';
const { ccclass, property } = cc._decorator;

@ccclass
export default class test extends cc.Component {

    public videoPath;
    public moreGamesBanner;

    start() {
        // kwaigame.readyGo(); // 请在游戏首屏加载完成之后调用
        // kwaigame.init({
        //     appId: "ks658932921253558438"
        // });
        TYQAd.getInstance().initAd();
    }

    getUserInfo() {
        TYQAd.getInstance().getUserInfo((res) => {
            console.log("TYQSDK", "getUserInfo", JSON.stringify(res));
        });
    }

    getUserData() {
        TYQAd.getInstance().getUserData((res) => {
            console.log(res);
        });
    }


    showMoreGamesBanner() {
        TYQAd.getInstance().showMoreGamesBanner();
    }
    hideMoreGamesBanner() {
        TYQAd.getInstance().hideMoreGamesBanner();
    }


    startGameVideo() {
        TYQAd.getInstance().startGameVideo(60);
    }
    stopGameVideo() {
        TYQAd.getInstance().stopGameVideo(videoPath => {
            console.log('视频录制成功');
            this.videoPath = videoPath;
        });
    }
    shareVideo() {
        TYQAd.getInstance().shareVideo("这是抖音分享视频的标题", "这是头条分享视频的描述", "这是抖音分享视频的话题", this.videoPath, res => {
            if (res) {
                console.log("分享成功");
            } else {
                console.log("分享失败");
            }
        });
    }

    showMoreGames() {
        // TYQAd.getInstance().showMoreGames("https://tencentcnd.minigame.xplaymobile.com/Wuyuhui/KuGou/lddqq.png", 200, 100, cc.winSize.width / 2, cc.winSize.height / 2);
        TYQAd.getInstance().showMoreGamesModal();
    }

    hideMoreGames() {
        TYQAd.getInstance().hideMoreGames();
    }

    showBlock() {
        // QQ "landscape"-横向展示 "vertical"-竖向展示
        // TYQAd.getInstance().getBlockFlag() && TYQAd.getInstance().showBlock("landscape", 100, 300, 3);
        // WX：广告组件的主题颜色,"white"-白色 "black"-黑色
        TYQAd.getInstance().getBlockFlag() && TYQAd.getInstance().showBlock("black", 0, 600, 8);
    }

    hideBlock() {
        TYQAd.getInstance().hideBlock();
    }

    showAppBox() {
        TYQAd.getInstance().getBoxFlag() && TYQAd.getInstance().showAppBox();
    }

    showBanner() {
        TYQAd.getInstance().showBanner();
    }
    hideBanner() {
        TYQAd.getInstance().hideBanner();
    }

    showVideo() {
        TYQAd.getInstance().getVideoFlag() && TYQAd.getInstance().showVideo((res) => {
            if (res) {
                console.log("视频播放完成");
            } else {
                console.log("视频取消播放");
            }
        });
    }
    showVideoInters() {
        TYQAd.getInstance().getVideoIntersFlag() && TYQAd.getInstance().showVideoInters(() => {
            // do something 视频播放完成所做的操作 恢复游戏
        });
    }

    showInters() {
        TYQAd.getInstance().getIntersFlag() && TYQAd.getInstance().showInters();
    }

    showNativeIcon() {
        TYQAd.getInstance().getNativeIconFlag() && TYQAd.getInstance().showNativeIcon(200, 200, 300, 300);
    }

    hideNativeIcon() {
        TYQAd.getInstance().hideNativeIcon();
    }

    showNativeImage() {
        TYQAd.getInstance().getImageNativeFlag() && TYQAd.getInstance().showNativeImage(628, 314, 500, 300);
    }

    hideNativeImage() {
        TYQAd.getInstance().hideNativeImage();
    }

    getNativeInfo() {
        TYQAd.getInstance().getNativeInfo();
    }




    showNavigateIcon() {
        TYQAd.getInstance().getNavigateIconFlag() && TYQAd.getInstance().showNavigateIcon(120, 120, 200, 200);
    }

    hideNavigateIcon() {
        TYQAd.getInstance().hideNavigateIcon();
    }

    showNavigateGroup() {
        TYQAd.getInstance().showNavigateGroup("horizontal", "right", 120, 0);
    }

    hideNavigateGroup() {
        TYQAd.getInstance().hideNavigateGroup();
    }

    showNavigateSettle1() {
        TYQAd.getInstance().showNavigateSettle(1, 0, 0);
    }
    showNavigateSettle2() {
        TYQAd.getInstance().showNavigateSettle(2, cc.winSize.width / 2, cc.winSize.height / 2);
    }
    showNavigateSettle3() {
        TYQAd.getInstance().showNavigateSettle(3, cc.winSize.width / 2, cc.winSize.height / 2);
    }
    showNavigateSettle4() {
        TYQAd.getInstance().showNavigateSettle(4, 0, 0);
    }

    hideSettleNavigate() {
        TYQAd.getInstance().hideNavigateSettle();
    }


    showNavigateBoxBanner() {
        TYQAd.getInstance().getNavigateBoxBannerFlag() && TYQAd.getInstance().showNavigateBoxBanner();
    }
    hideNavigateBoxBanner() {
        TYQAd.getInstance().hideNavigateBoxBanner();
    }

    showNavigateBoxPortal() {
        TYQAd.getInstance().getNavigateBoxPortalFlag() && TYQAd.getInstance().showNavigateBoxPortal();
    }


    addDesktop() {
        TYQAd.getInstance().getDeskTopFlag((res) => {
            if (res) {
                TYQAd.getInstance().addDeskTop((result) => {
                    if (result) {
                        console.log("添加桌面接口调用成功");
                    } else {
                        console.log("添加桌面接口调用失败");
                    }
                });
            } else {
                console.log("已存在桌面图标");
            }
        });
    }

    showToast() {
        TYQAd.getInstance().showToast("暂无视频广告");
    }

    phoneVibrateShort() {
        TYQAd.getInstance().phoneVibrate("short");
    }

    phoneVibrateLong() {
        TYQAd.getInstance().phoneVibrate("long");
    }

    reportMonitor() {
        TYQAd.getInstance().reportMonitor();
    }


}
