import SdkTools, { Game_Platform } from "../tools/SdkTools"

let showAuthenticationCallback = null;
let hasNetworkCallback = null;

class OtherFunctions {
    private static instance: OtherFunctions

    /**
     * 添加桌面图标开关
     */
    public SW_DesktopSwitch: boolean = true;

    /**
     * 插屏间隔弹桌面图标开关
     */
    public SW_IntersToDesktop: boolean = false;

    /**
     * 自动弹添加桌面次数
     */
    public NUM_DeskAutoMostTimes: number = 0;

    /**
     * 第几次插屏变添加桌面
     */
    public NUM_IntersAddDesktopNumber: number = 0;

    /**
     * OtherFunctions 单例
     */
    public static getInstance(): OtherFunctions {
        if (!OtherFunctions.instance) {
            OtherFunctions.instance = new OtherFunctions()
        }
        return OtherFunctions.instance
    }


    /**
     * 判断渠道是否拥有添加桌面接口
     */
    public hasDesktopFunc() {
        switch (SdkTools.getPlatform()) {
            case Game_Platform.GP_Oppo:
            case Game_Platform.GP_Vivo:
            case Game_Platform.GP_Tiktok:
            case Game_Platform.GP_QQ:
            case Game_Platform.GP_HW:
            case Game_Platform.GP_Test:
                return true;
            default:
                return false;
        }
    }
    /**
     * 获取能否添加桌面标志
     */
    public getDeskTopFlag(callback) {
        if (!this.SW_DesktopSwitch) {
            console.log("TYQSDK", "添加桌面图标开关未开启");
            callback(false);
            return;
        }
        switch (SdkTools.getPlatform()) {
            case Game_Platform.GP_Oppo:
                {
                    qg.hasShortcutInstalled({
                        success: function (res) {
                            // 判断图标未存在时，创建图标
                            if (res == false) {
                                callback(true);
                            }
                        },
                        fail: function (err) {
                            console.log("TYQSDK", JSON.stringify(err));
                        },
                        complete: function () { }
                    })
                    break;
                }
            case Game_Platform.GP_Vivo:
                {
                    qg.hasShortcutInstalled({
                        success: function (status) {
                            if (status) {
                                console.log("TYQSDK", 'VIVO 已创建桌面图标');
                                callback(false);
                            } else {
                                console.log("TYQSDK", 'VIVO 未创建桌面图标')
                                callback(true);
                            }
                        }
                    })
                    break;
                }
            case Game_Platform.GP_Tiktok:
                {
                    tt.checkShortcut({
                        success: function (res) {
                            if (!res.status.exist || res.status.needUpdate) {
                                console.log("TYQSDK", "checkShortcut res:", JSON.stringify(res));
                                console.log("TYQSDK", 'Tiktok 未创建桌面图标或图标需要更新');
                                callback(true);
                            } else {
                                console.log("TYQSDK", 'Tiktok 已创建桌面图标');
                                callback(false);
                            }
                        },
                        fail: function (res) {
                            console.log("TYQSDK", "Tiktok 添加桌面图标失败：", JSON.stringify(res.errMsg));
                            callback(false);
                        }
                    })
                }
                break;
            case Game_Platform.GP_QQ:
                callback(true);
                break;
            case Game_Platform.GP_HW:
                hbs.hasInstalled({
                    success: function (res) {
                        if (res) {
                            console.log("TYQSDK", "HW 已创建桌面图标");
                            callback(false);
                        } else {
                            console.log("TYQSDK", "HW 未创建桌面图标");
                            callback(true);
                        }
                    },
                    fail: function (data) {
                        console.log("TYQSDK", "未知错误:" + data);
                        callback(false);
                    }
                })
                break;
            case Game_Platform.GP_Test:
                callback(true);
                break;
            default:
                callback(true);
                break;
        }
    }
    /**
     * 添加桌面
     */
    public addDeskTop(callback) {
        if (!this.SW_DesktopSwitch) {
            console.log("TYQSDK", "添加桌面图标开关未开启");
            callback(false);
            return;
        }
        switch (SdkTools.getPlatform()) {
            case Game_Platform.GP_Oppo:
                {
                    qg.installShortcut({
                        success: function () {
                            console.log("TYQSDK", 'OPPO 创建桌面图标成功')
                            // 执行用户创建图标奖励
                            callback(true);
                        },
                        fail: function (err) {
                            console.log("TYQSDK", 'OPPO 创建桌面图标失败:' + JSON.stringify(err));
                            callback(false);
                        },
                        complete: function () { }
                    })
                    break;
                }
            case Game_Platform.GP_Vivo:
                {
                    qg.installShortcut({
                        success: function () {
                            console.log("TYQSDK", 'VIVO 创建桌面图标成功')
                            callback(true);
                        },
                        fail: function (err) {
                            console.log("TYQSDK", 'VIVO 创建桌面图标失败:' + JSON.stringify(err));
                            callback(false);
                        },
                        complete: function () { }
                    })
                    break;
                }
            case Game_Platform.GP_QQ:
                {
                    qq.saveAppToDesktop({
                        success: function () {
                            console.log("TYQSDK", 'QQ 创建桌面图标成功')
                            // 执行用户创建图标奖励
                            callback(true);
                        },
                        fail: function (err) {
                            console.log("TYQSDK", 'QQ 创建桌面图标失败:' + JSON.stringify(err));
                            callback(false);
                        },
                        complete: function () { }
                    })
                    break;
                }
            case Game_Platform.GP_Tiktok:
                tt.addShortcut({
                    success: function (res) {
                        console.log("TYQSDK", "添加桌面成功");
                        callback(true);
                    },
                    fail: function (res) {
                        console.log("TYQSDK", "添加桌面失败:" + JSON.stringify(res));
                        callback(false);
                    }
                })
                break;
            case Game_Platform.GP_HW:
                hbs.install({
                    success: function (res) {
                        console.log("TYQSDK", "HW 添加桌面成功");
                        callback(true);
                    },
                    fail: function (erromsg, errocode) {
                        console.log("TYQSDK", "HW 添加桌面失败:" + JSON.stringify(erromsg));
                        callback(false);
                    }
                });
                break;
            default:
                callback(true);
                break;
        }
    }


    /**
     * 展示系统提示
     */
    public showToast(msg: string, duration?: number) {
        if (duration == undefined || duration == null || duration == 0) duration = 1500;
        switch (SdkTools.getPlatform()) {
            case Game_Platform.GP_Oppo:
                {
                    console.log('TYQSDK', 'OPPO showToast：', msg);
                    qg.showToast({
                        title: msg,
                        duration: duration
                    })
                    break;
                }
            case Game_Platform.GP_Vivo:
                {
                    console.log('TYQSDK', 'VIVO showToast：', msg);
                    qg.showToast({
                        message: msg,
                        duration: duration == 1 ? 1 : 0
                    })
                    break;
                }
            case Game_Platform.GP_Tiktok:
                {
                    console.log('TYQSDK', 'Tiktok showToast：', msg);
                    tt.showToast({
                        title: msg,
                        duration: duration
                    })
                    break;
                }
            case Game_Platform.GP_QQ:
                {
                    console.log('TYQSDK', 'QQ showToast：', msg);
                    qq.showToast({
                        title: msg,
                        duration: duration
                    })
                    break;
                }
            case Game_Platform.GP_Test:
                console.log('TYQSDK', 'Test 打包后会有真实效果:', msg);
                break;
            default:
                break;
        }
    }


    /**
     * 手机震动
     */
    public phoneVibrate(type: string) {
        switch (SdkTools.getPlatform()) {
            case Game_Platform.GP_Oppo:
                {
                    if (type == 'short') {
                        qg.vibrateShort({
                            success: function (res) { },
                            fail: function (res) { },
                            complete: function (res) { }
                        })
                    }
                    if (type == 'long') {
                        qg.vibrateLong({
                            success: function (res) { },
                            fail: function (res) { },
                            complete: function (res) { }
                        })
                    }
                    break;
                }
            case Game_Platform.GP_Vivo:
            case Game_Platform.GP_XM:
                {
                    if (type == 'short') {
                        qg.vibrateShort()
                    }
                    if (type == 'long') {
                        qg.vibrateLong()
                    }
                    break;
                }
            case Game_Platform.GP_Tiktok:
                {
                    if (type == 'long') {
                        tt.vibrateLong({
                            success(res) {
                            },
                            fail(res) {
                                console.log("TYQSDK", 'Tiktok vibrateLong调用失败');
                            }
                        });
                    }
                    else if (type == 'short') {
                        tt.vibrateShort({
                            success(res) {
                                //console.log(`${res}`);
                            },
                            fail(res) {
                                console.log("TYQSDK", 'Tiktok vibrateShort调用失败');
                            }
                        });
                    }
                    break;
                }
            case Game_Platform.GP_QQ:
                {
                    if (type == 'long') {
                        qq.vibrateLong({
                            success(res) {
                            },
                            fail(res) {
                                console.log("TYQSDK", 'QQ vibrateLong调用失败', JSON.stringify(res));
                            }
                        });
                    }
                    else if (type == 'short') {
                        qq.vibrateShort({
                            success(res) {
                            },
                            fail(res) {
                                console.log("TYQSDK", 'QQ vibrateShort调用失败', JSON.stringify(res));
                            }
                        });
                    }
                    break;
                }
            case Game_Platform.GP_WX:
                {
                    if (type == 'long') {
                        wx.vibrateLong({
                            success(res) {
                            },
                            fail(res) {
                                console.log("TYQSDK", 'WX vibrateLong调用失败', JSON.stringify(res));
                            }
                        });
                    }
                    else if (type == 'short') {
                        wx.vibrateShort({
                            type: "heavy",
                            success(res) {
                            },
                            fail(res) {
                                console.log("TYQSDK", 'WX vibrateShort调用失败', JSON.stringify(res));
                            }
                        });
                    }
                    break;
                }
            case Game_Platform.GP_BL:
                {
                    if (type == 'long') {
                        bl.vibrateLong({
                            success(res) {
                            },
                            fail(res) {
                                console.log("TYQSDK", 'BL vibrateLong调用失败', JSON.stringify(res));
                            }
                        });
                    }
                    else if (type == 'short') {
                        bl.vibrateShort({
                            success(res) {
                            },
                            fail(res) {
                                console.log("TYQSDK", 'BL vibrateShort调用失败', JSON.stringify(res));
                            }
                        });
                    }
                    break;
                }
            case Game_Platform.GP_Test:
                console.log("TYQSDK", 'Test 手机震动，需要在打包后会有真实效果:', type);
                break;
            case Game_Platform.GP_Android:
                jsb.reflection.callStaticMethod("com/asc/sdk/ndk/AndroidNDKHelper", "ReceiveCppMessage", "(Ljava/lang/String;)V", `{"calling_method_name":"shakePhone","calling_method_params":${type}}`);
                break;
            case Game_Platform.GP_IOS:
                jsb.reflection.callStaticMethod("systemSetting", "shakePhone:", type);
                break;
            default:
                break;
        }
    }


    /**
     * OPPO数据上报
     */
    reportMonitor() {
        switch (SdkTools.getPlatform()) {
            case Game_Platform.GP_Oppo:
                {
                    if (qg.getSystemInfoSync().platformVersionCode < 1060) {
                        return;
                    }
                    qg.reportMonitor('game_scene', 0)
                    break;
                }
            default:
                break;
        }
    }


    /**
     * 退出游戏
     */
    public exitTheGame() {
        switch (SdkTools.getPlatform()) {
            case Game_Platform.GP_Android:
                jsb.reflection.callStaticMethod("com/asc/sdk/ndk/AndroidNDKHelper", "ReceiveCppMessage", "(Ljava/lang/String;)V", `{'calling_method_name':'exit'}`);
                break;
            case Game_Platform.GP_IOS:
                cc.game.end();
                break;
            default:
                break;
        }
    }


    /**
     * 事件上报
     */
    public reportAnalytics(params, data) {
        switch (SdkTools.getPlatform()) {
            case Game_Platform.GP_Tiktok:
                tt.reportAnalytics(params, data);
                break;
            case Game_Platform.GP_Android:
                let reportData = JSON.stringify({ calling_method_name: "reportAnalytics", calling_method_params: { "eventName": params, "data": data } });
                jsb.reflection.callStaticMethod("com/asc/sdk/ndk/AndroidNDKHelper", "ReceiveCppMessage", "(Ljava/lang/String;)V", reportData);
                break;
            case Game_Platform.GP_IOS:
                jsb.reflection.callStaticMethod("systemSetting", "showUMWithType:withData:", params, JSON.stringify(data));
                break;
            default:
                break;
        }
    }


    /**
     * 实名认证(防沉迷)
     */
    public showAuthentication(callback) {
        switch (SdkTools.getPlatform()) {
            case Game_Platform.GP_Android:
                jsb.reflection.callStaticMethod("com/asc/sdk/ndk/AndroidNDKHelper", "ReceiveCppMessage", "(Ljava/lang/String;)V", `{"calling_method_name":"showAuthentication","calling_method_params":0}`);
                break;
            case Game_Platform.GP_IOS:
                showAuthenticationCallback = callback;
                jsb.reflection.callStaticMethod("systemSetting", "showAuthentication");
                break;
            default:
                break;
        }
    }
    /**
     * 游客体验
     */
    public TouristModel(callback) {
        switch (SdkTools.getPlatform()) {
            case Game_Platform.GP_Android:
                jsb.reflection.callStaticMethod("com/asc/sdk/ndk/AndroidNDKHelper", "ReceiveCppMessage", "(Ljava/lang/String;)V", `{"calling_method_name":"TouristModel","calling_method_params":0}`);
                break;
            case Game_Platform.GP_IOS:
                break;
            default:
                break;
        }
    }


    /**
     * 能否展示oppo超休闲（首页更多游戏）标志
     */
    public getShowMoreGameFlag() {
        switch (SdkTools.getPlatform()) {
            case Game_Platform.GP_Android:
                return jsb.reflection.callStaticMethod("com/asc/sdk/ndk/AndroidNDKHelper", "SendMessageGetAdFlag", "(Ljava/lang/String;)Z", "getShowMoreGameFlag");
            default:
                return true;
        }
    }
    /**
     * oppo超休闲（首页更多游戏）
     */
    public showOPPOMoreGame() {
        switch (SdkTools.getPlatform()) {
            case Game_Platform.GP_Android:
                jsb.reflection.callStaticMethod("com/asc/sdk/ndk/AndroidNDKHelper", "ReceiveCppMessage", "(Ljava/lang/String;)V", `{"calling_method_name":"showOPPOMoreGame","calling_method_params":0}`);
                break;
            default:
                break;
        }
    }


    /**
     * 是否有网络
     */
    public hasNetwork(callback) {
        switch (SdkTools.getPlatform()) {
            case Game_Platform.GP_IOS:
                hasNetworkCallback = callback;
                jsb.reflection.callStaticMethod("systemSetting", "hasNetwork");
            default:
                callback(true);
        }
    }


    /**
     * 展示评论
     */
    public showReviewAlert() {
        switch (SdkTools.getPlatform()) {
            case Game_Platform.GP_IOS:
                jsb.reflection.callStaticMethod("systemSetting", "showReviewAlert");
                break;
            default:
                break;
        }
    }


    public showiOSADWithScene(key: string, type: string) {
        switch (SdkTools.getPlatform()) {
            case Game_Platform.GP_IOS:
                jsb.reflection.callStaticMethod("DJADManagerVC", "showiOSADWithScene:Platform:", key.toString(), type);
                break;
            default:
                break;
        }
    }
    public showiOSADWithType(key: string, type: string) {
        switch (SdkTools.getPlatform()) {
            case Game_Platform.GP_IOS:
                jsb.reflection.callStaticMethod("DJADManagerVC", "showiOSADWithType:Platform:", key.toString(), type);
                break;
            default:
                break;
        }
    }
    public videoUIShow(key: string) {
        switch (SdkTools.getPlatform()) {
            case Game_Platform.GP_IOS:
                jsb.reflection.callStaticMethod("DJADManagerVC", "videoUIShow:", key.toString());
                break;
            default:
                break;
        }
    }

}
export default OtherFunctions

//防沉迷回调
{
    (<any>window).showAuthenticationCallback = function (result: string) {
        console.log("TYQSDK", "showAuthenticationCallback", showAuthenticationCallback)
        showAuthenticationCallback && showAuthenticationCallback(result == "1");
        return "callback suc"
    }
}

//是否有网络回调
{
    (<any>window).HasNetworkCallback = function (result: string) {
        console.log("TYQSDK", "hasNetworkCallback", hasNetworkCallback)
        hasNetworkCallback && hasNetworkCallback(result == "1");
        return "callback suc"
    }
}