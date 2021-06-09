import SdkTools, { Game_Platform } from "../tools/SdkTools"
import CocosUI from "../ui/CocosUI"

class RecordAndShare {
    private static instance: RecordAndShare

    /**
     * 录屏地址
     */
    private videoPath: any = null;

    /**
     * 录屏回调
     */
    private shareVideoCallback: any = null;

    /**
     * 是否自动停止录屏(即传入的录屏时间达到)
     */
    private isAutoStop: boolean = false;

    /**
     * 录屏对象
     */
    private gameRecorder: any = null;

    /**
     * 更多游戏按钮
     */
    private moreGameButton: any = null;

    /**
     * 是否正在展示更多游戏按钮
     */
    private isShowMoreGames: boolean = false;

    /**
     * 更多游戏测试ICON按钮
     */
    private nativeIcon: any = null;

    /**
     * 更多游戏横幅
     */
    private moreGamesBanner: any = null;

    /**
     * RecordAndShare单例
     */
    public static getInstance(): RecordAndShare {
        if (!RecordAndShare.instance) {
            RecordAndShare.instance = new RecordAndShare()
        }
        return RecordAndShare.instance
    }

    /**
     * 分享图文
     */
    public share(templateId) {
        switch (SdkTools.getPlatform()) {
            case Game_Platform.GP_Tiktok:
                {
                    tt.shareAppMessage({
                        templateId: templateId, // 替换成通过审核的分享ID
                        query: "",
                        success() {
                            console.log("TYQSDK", "Tiktok 分享成功");
                        },
                        fail(e) {
                            console.log("TYQSDK", "Tiktok 分享失败");
                        }
                    });
                    break;
                }
            default:
                break;
        }
    }

    /**
     * 开始录屏
     */
    public startGameVideo(duration) {
        switch (SdkTools.getPlatform()) {
            case Game_Platform.GP_Tiktok:
                {
                    this.videoPath = null;

                    if (!duration) {
                        duration = 10;
                    }
                    this.gameRecorder = tt.getGameRecorderManager();

                    this.gameRecorder.onStart(res => {
                        console.log("TYQSDK", "Tiktok 录屏开始");
                        // do somethine;
                    });

                    this.gameRecorder.onStop(res => {
                        console.log("TYQSDK", 'Tiktok 录屏结束', res.videoPath);
                        this.videoPath = res.videoPath;
                        if (this.shareVideoCallback) {
                            this.shareVideoCallback(this.videoPath);
                            this.shareVideoCallback = null;
                        } else {
                            this.isAutoStop = true;
                        }
                    });

                    this.gameRecorder.onError(errMsg => {
                        console.log("TYQSDK", "Tiktok 录屏错误:" + JSON.stringify(errMsg));
                    });

                    this.gameRecorder.start({
                        duration: duration
                    });
                    break;
                }
            case Game_Platform.GP_KS:
                {
                    this.videoPath = null;

                    this.gameRecorder = kwaigame.createMediaRecorder();
                    if (this.gameRecorder === null) {
                        console.log("TYQSDK", "当前版本App不支持录屏");
                        return;
                    }

                    this.gameRecorder.onStart(res => {
                        console.log("TYQSDK", "KS 录屏开始");
                    });

                    this.gameRecorder.onStop(res => {
                        console.log("TYQSDK", 'KS 录屏结束', JSON.stringify(res));
                        this.videoPath = res.videoID;
                        this.shareVideoCallback(this.videoPath);
                    });

                    this.gameRecorder.onError((err) => {
                        console.log("TYQSDK", "发生录屏错误", JSON.stringify(err));
                    });

                    this.gameRecorder.start();
                    break;
                }
            default:
                break;
        }
    }

    /**
     * 暂停录屏
     */
    public pauseGameVideo() {
        switch (SdkTools.getPlatform()) {
            case Game_Platform.GP_Tiktok:
                {
                    console.log("TYQSDK", "Tiktok 暂停录屏==================");
                    this.gameRecorder && this.gameRecorder.pause();
                    break;
                }
            case Game_Platform.GP_KS:
                {
                    console.log("TYQSDK", "KS 暂停录屏==================");
                    this.gameRecorder && this.gameRecorder.pause();
                    break;
                }
            default:
                break;
        }
    }

    /**
     * 继续录屏
     */
    public resumeGameVideo() {
        switch (SdkTools.getPlatform()) {
            case Game_Platform.GP_Tiktok:
                {
                    console.log("TYQSDK", "Tiktok 继续录屏==================");
                    this.gameRecorder && this.gameRecorder.resume();
                    break;
                }
            case Game_Platform.GP_KS:
                {
                    console.log("TYQSDK", "KS 继续录屏==================");
                    this.gameRecorder && this.gameRecorder.resume();
                    break;
                }
            default:
                break;
        }
    }

    /**
     * 停止录屏
     */
    public stopGameVideo(callback) {
        switch (SdkTools.getPlatform()) {
            case Game_Platform.GP_Tiktok:
                {
                    this.shareVideoCallback = callback;
                    console.log("TYQSDK", "Tiktok stopGameVideo=======================");
                    if (this.isAutoStop) {
                        this.shareVideoCallback(this.videoPath);
                        this.shareVideoCallback = null;
                        this.isAutoStop = false;
                        return;
                    }
                    this.gameRecorder && this.gameRecorder.stop();
                    break;
                }
            case Game_Platform.GP_KS:
                {
                    this.shareVideoCallback = callback;
                    console.log("TYQSDK", "KS stopGameVideo==================");
                    this.gameRecorder && this.gameRecorder.stop();
                    break;
                }
            case Game_Platform.GP_Test:
                callback("0");
                break;
            default:
                break;
        }
    }

    /**
     * 分享视频
     */
    public shareVideo(title, desc, topics, videoPath, callback) {
        console.log("TYQSDK", "Tiktok 分享录屏", videoPath);
        switch (SdkTools.getPlatform()) {
            case Game_Platform.GP_Tiktok:
                {
                    if (!videoPath) {
                        console.log("TYQSDK", "视频地址为空 return");
                        return;
                    }
                    tt.shareAppMessage({
                        channel: "video",
                        title: title,
                        desc: desc,
                        extra: {
                            videoPath: videoPath, // 可替换成录屏得到的视频地址
                            videoTopics: [topics], //该字段已经被hashtag_list代替，为保证兼容性，建议两个都填写。
                            hashtag_list: [topics],
                        },
                        success() {
                            console.log("TYQSDK", "Tiktok 分享视频成功");
                            callback(true);
                        },
                        fail(e) {
                            console.log("TYQSDK", "Tiktok 分享视频失败:" + JSON.stringify(e));
                            callback(false);
                        },
                    });
                    break;
                }
            case Game_Platform.GP_Test:
                {
                    console.log("TYQSDK", "Test 分享视频成功");
                    callback(true);
                    break;
                }
            case Game_Platform.GP_KS:
                {
                    this.gameRecorder && this.gameRecorder.publishVideo({
                        mouldId: title,
                        video: videoPath,
                        callback: (error) => {
                            if (error != null && error != undefined) {
                                console.log("TYQSDK", "分享录屏失败: " + JSON.stringify(error));
                                if (error.code == -10014) console.log("TYQSDK", "录屏时间过短");
                                callback(false);
                                return;
                            }
                            console.log("TYQSDK", "分享录屏成功");
                            callback(true);
                        }
                    })
                    break;
                }
            default:
                break;
        }
    }

    /**
     * 标记精彩瞬间
     */
    public recordClip(before, after) {
        switch (SdkTools.getPlatform()) {
            case Game_Platform.GP_Tiktok:
                {
                    this.gameRecorder && this.gameRecorder.recordClip({
                        timeRange: [before, after],
                        success(r) {
                            console.log("TYQSDK", "Tiktok 裁剪唯一索引", r.index); // 裁剪唯一索引
                        }
                    });
                    break
                }
            default:
                break;
        }
    }

    /**
     * 剪辑精彩瞬间
     */
    public clipVideo(videoPath, callback) {
        switch (SdkTools.getPlatform()) {
            case Game_Platform.GP_Tiktok:
                {
                    this.gameRecorder && this.gameRecorder.clipVideo({
                        path: videoPath,
                        success(res) {
                            // 由开始5秒 +最后10秒 拼接合成的视频
                            console.log("TYQSDK", "Tiktok 录屏地址", res.videoPath);
                            callback(true, res.videoPath);
                        },
                        fail(e) {
                            console.error('剪辑失败', e);
                            callback(false, videoPath);
                        }
                    });
                    break;
                }
            default:
                break;
        }
    }

    /**
     * 展示更多游戏
     */
    public showMoreGames(ImageAddress, width, height, x, y) {
        switch (SdkTools.getPlatform()) {
            case Game_Platform.GP_Tiktok:
                {
                    if (tt.getSystemInfoSync().platform != "android") {
                        console.log("TYQSDK", "非安卓手机,不能展示更多游戏按钮 return");
                        return;
                    }

                    if (!SdkTools.getInstance().isversionNewThanEngineVersion("1.23.0")) {
                        console.log("TYQSDK", "平台版本过低,不能展示更多游戏按钮,当前版本:" + tt.getSystemInfoSync().SDKVersion);
                        return;
                    }

                    if (this.isShowMoreGames) {
                        console.log("TYQSDK", "正在展示更多游戏按钮 return");
                        return;
                    }
                    this.isShowMoreGames = true;

                    console.log("TYQSDK", "showMoreGames=====================");

                    let windowWidth = Number(tt.getSystemInfoSync().windowWidth);
                    let windowHeight = Number(tt.getSystemInfoSync().windowHeight);

                    // cocos以左下角为0,0转换为左上角为0,0 且dp转换为px
                    width = width * (windowWidth / cc.winSize.width)
                    height = height * (windowHeight / cc.winSize.height)
                    x = x * (windowWidth / cc.winSize.width)
                    y = (cc.winSize.height - y) * (windowHeight / cc.winSize.height)

                    this.moreGameButton = tt.createMoreGamesButton({
                        type: "image",
                        image: ImageAddress,
                        style: {
                            left: x,
                            top: y,
                            width: width,
                            height: height,
                            lineHeight: 40,
                            backgroundColor: "#ff0000",
                            textColor: "#ffffff",
                            textAlign: "center",
                            fontSize: 16,
                            borderRadius: 4,
                            borderWidth: 0,
                            borderColor: "#ff0000",
                        },
                        appLaunchOptions: [
                            {
                                appId: 'ttXXXXXX',
                                query: "foo=bar&baz=qux",
                                extraData: {},
                            }
                        ],
                        onNavigateToMiniGameBox(res) {
                            console.log("跳转到小游戏盒子", res);
                        },
                    });

                    this.moreGameButton.onTap(() => {
                        console.log("TYQSDK", "点击更多游戏");
                    });
                }
                break;
            case Game_Platform.GP_Test:
                {
                    var scene = cc.director.getScene();
                    if (this.nativeIcon) {
                        console.log("TYQSDK", "已存在测试更多游戏自定义按钮 return");
                        return;
                    }
                    console.log("TYQSDK", "Test showMoreGames=====================");
                    cc.loader.load(ImageAddress, (err, texture) => {
                        this.nativeIcon = new cc.Node("nativeIcon");
                        this.nativeIcon.addComponent(cc.Sprite);
                        this.nativeIcon.getComponent(cc.Sprite).spriteFrame = new cc.SpriteFrame(texture);
                        setTimeout(() => {
                            this.nativeIcon.width = width;
                            this.nativeIcon.height = height;
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
                break;
            default:
                break;
        }
    }
    /**
     * 隐藏更多游戏
     */
    public hideMoreGames() {
        switch (SdkTools.getPlatform()) {
            case Game_Platform.GP_Test:
                if (this.nativeIcon) {
                    console.log("TYQSDK", "Test hideMoreGames=====================");
                    this.nativeIcon.removeFromParent();
                    this.nativeIcon = null;
                } else {
                    console.log("TYQSDK", "Test 不存在更多游戏 return");
                    return;
                }
                break;
            case Game_Platform.GP_Tiktok:
                if (this.moreGameButton) {
                    console.log("TYQSDK", "hideMoreGames=====================");
                    this.isShowMoreGames = false;
                    this.moreGameButton.destroy();
                    this.moreGameButton = null;
                } else {
                    console.log("TYQSDK", "不存在更多游戏 return");
                    return;
                }
                break;
            default:
                break;
        }
    }

    /**
     * 更多游戏
     */
    public showMoreGamesModal() {
        switch (SdkTools.getPlatform()) {
            case Game_Platform.GP_Tiktok:
                if (tt.getSystemInfoSync().platform != "android") {
                    console.log("TYQSDK", "非安卓手机,请隐藏更多游戏按钮 return");
                    return;
                }

                if (!SdkTools.getInstance().isversionNewThanEngineVersion("1.33.0")) {
                    console.log("TYQSDK", "平台版本过低,无法跳入游戏中心,当前版本:" + tt.getSystemInfoSync().SDKVersion);
                    return;
                }

                console.log("TYQSDK", "showMoreGamesModal=====================");

                // 打开互跳弹窗
                tt.showMoreGamesModal({
                    appLaunchOptions: [
                        {
                            appId: "ttXXXXXX",
                            query: "foo=bar&baz=qux",
                            extraData: {},
                        },
                    ],
                    success(res) {
                        console.log("success", res.errMsg);
                    },
                    fail(res) {
                        console.log("fail", res.errMsg);
                    },
                });

                break;
            case Game_Platform.GP_Test:
                console.log("TYQSDK", "showMoreGamesModal=====测试点击更多游戏");
                break;
            default:
                break;
        }
    }

    /**
     * 收藏游戏
     */
    public showFavoriteGuide(type, content, position) {
        switch (SdkTools.getPlatform()) {
            case Game_Platform.GP_Tiktok:
                tt.showFavoriteGuide({
                    type: type,
                    content: content,
                    position: position,
                    success(res) {
                        console.log("TYQSDK", "引导组件展示成功");
                    },
                    fail(res) {
                        console.log("TYQSDK", "引导组件展示失败:" + JSON.stringify(res));
                    },
                });
                break;
            default:
                break;
        }
    }

    /**
     * 展示更多游戏横幅
     */
    public showMoreGamesBanner() {
        switch (SdkTools.getPlatform()) {
            case Game_Platform.GP_Test:
                console.log("TYQSDK", "Test showMoreGamesBanner===============");
                cc.loader.load("https://tencentcnd.minigame.xplaymobile.com/Other/SDK/SDKImage_3_0/TestRes/TestMoreGamesBanner.png", (err, texture) => {
                    this.moreGamesBanner = new cc.Node("moreGamesBanner");
                    this.moreGamesBanner.addComponent(cc.Sprite);
                    this.moreGamesBanner.getComponent(cc.Sprite).spriteFrame = new cc.SpriteFrame(texture);
                    setTimeout(() => {
                        this.moreGamesBanner.width = 900;
                        this.moreGamesBanner.height = 312;
                        this.moreGamesBanner.x = cc.winSize.width / 2;
                        this.moreGamesBanner.y = this.moreGamesBanner.height / 2;
                    }, 1);
                    this.moreGamesBanner.zIndex = 30000;
                    let scene = cc.director.getScene();
                    scene.addChild(this.moreGamesBanner);
                    if (CocosUI.getInstance().cocosGroup != "") {
                        this.moreGamesBanner.group = CocosUI.getInstance().cocosGroup;
                    }
                });
                break;
            case Game_Platform.GP_Tiktok:
                if (tt.getSystemInfoSync().platform != "android") {
                    console.log("TYQSDK", "非安卓手机,不能展示更多游戏横幅");
                    return;
                }
                if (!SdkTools.getInstance().isversionNewThanEngineVersion("1.67.0")) {
                    console.log("TYQSDK", "平台版本过低,不能展示更多游戏横幅,当前版本:" + tt.getSystemInfoSync().SDKVersion);
                    return;
                }
                console.log("TYQSDK", "Tiktok showMoreGamesBanner===============");
                this.moreGamesBanner = tt.createMoreGamesBanner({
                    style: {
                        left: 0,
                        top: 0,
                        width: 150,
                        height: 40,
                        verticalAlign: "bottom",
                        horizontalAlign: "center"
                    },
                    appLaunchOptions: [
                        {
                            appId: "ttXXXXXX",
                            query: "foo=bar&baz=qux",
                            extraData: {},
                        },
                    ],
                });
                this.moreGamesBanner.onError((err) => {
                    console.log("TYQSDK", "Tiktok 更多游戏横幅出错:", JSON.stringify(err));
                })
                this.moreGamesBanner.show();
                break;
            default:
                break;
        }
    }
    /**
     * 隐藏更多游戏横幅
     */
    public hideMoreGamesBanner() {
        switch (SdkTools.getPlatform()) {
            case Game_Platform.GP_Test:
                console.log("TYQSDK", "Test hideMoreGamesBanner===============");
                if (this.moreGamesBanner) {
                    this.moreGamesBanner.removeFromParent();
                    this.moreGamesBanner = null;
                }
                break;
            case Game_Platform.GP_Tiktok:
                console.log("TYQSDK", "Tiktok hideMoreGamesBanner===============");
                this.moreGamesBanner && this.moreGamesBanner.hide();
                break;
            default:
                break;
        }
    }

}
export default RecordAndShare