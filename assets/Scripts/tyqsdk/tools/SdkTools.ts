import Config from "../sdkConfig"

const config = Config.getInstance();

export enum Game_Platform {
    GP_Oppo,  //Oppo渠道
    GP_Vivo,  //Vivo渠道
    GP_Tiktok,//抖音渠道
    GP_QQ,    //qq渠道
    GP_Test,  //测试
    GP_Android, //安卓
    GP_IOS,    //IOS
    GP_WX,     //微信
    GP_KS,     //快手
    GP_HW,     //华为
    GP_XM,     //小米
    GP_BL,     //哔哩哔哩
    GP_BD,     //百度
}

class SystemInfo {
    /**
     * 屏幕宽度
    */
    public screenWidth = 0;
    /**
     * 屏幕高度
    */
    public screenHeight = 0;
}


class SdkTools {
    private static instance: SdkTools

    public static getInstance(): SdkTools {
        if (!SdkTools.instance) {
            SdkTools.instance = new SdkTools()
        }
        return SdkTools.instance
    }
    /**
     * 系统属性
    */
    private systemInfo: SystemInfo = null;

    /** 
     * 存储数据到本地
    */
    public static saveData(key, value) {
        cc.sys.localStorage.setItem(key, value);
    }

    /** 
     * 从本地获取数据
    */
    public static getData(key, defaultValue): string {
        var value = cc.sys.localStorage.getItem(key);
        if (value == null) value = defaultValue;
        return value;
    }

    /**
     * 获取渠道
     */
    public static getPlatform(): Game_Platform {

        if (!config.channelId || config.channelId.length < 3) {
            return Game_Platform.GP_Test;
        }

        // 分割字符串 取字符串的5,6，7位
        var channelId = config.channelId.substring(4, 7);


        //通过渠道号确定渠道        
        if (channelId == '142') {
            return Game_Platform.GP_Oppo;
        }
        else if (channelId == '108') {
            return Game_Platform.GP_Vivo;
        }
        else if (channelId == '154') {
            return Game_Platform.GP_Tiktok;
        }
        else if (channelId == '155') {
            return Game_Platform.GP_QQ;
        }
        else if (channelId == '666') {
            return Game_Platform.GP_Android;
        }
        else if (channelId == '888') {
            return Game_Platform.GP_IOS;
        }
        else if (channelId == '161') {
            return Game_Platform.GP_WX;
        }
        else if (channelId == '162') {
            return Game_Platform.GP_KS;
        }
        else if (channelId == '163') {
            return Game_Platform.GP_HW;
        }
        else if (channelId == '164') {
            return Game_Platform.GP_XM;
        }
        else if (channelId == '165') {
            return Game_Platform.GP_BL;
        }
        else if(channelId=='188')
        return Game_Platform.GP_BD;
        else {
            return Game_Platform.GP_Test;
        }

    }

    /**
     * 加载数组图片资源
     */
    public static loadImage(urlList, callback) {
        let ImageArr = new Array();
        var arrNumber = 0;
        for (let index = 0; index < urlList.length; index++) {
            cc.loader.load(urlList[index], (err, resList) => {
                ImageArr[index] = resList;
                if (err != null || ImageArr[index] == null) {
                    console.log("TYQSDK", "资源加载错误:" + JSON.stringify(err));
                    callback(true, null);
                    return;
                }
                arrNumber++;
                if (arrNumber >= urlList.length) {
                    callback(false, ImageArr);
                }
            })
        }
    }

    public static sdklog(message?: any, ...optionalParams: any[]) {
        console.log(message, optionalParams);
    }

    /**
     * 获取系统信息
     */
    public initSystemInfo(callback) {
        var self = this;
        this.systemInfo = new SystemInfo();
        switch (SdkTools.getPlatform()) {
            case Game_Platform.GP_Oppo:
                {
                    qg.getSystemInfo({
                        success: function (data) {
                            console.log("TYQSDK", `获取设备信息成功， screenWidth = ${data.screenWidth},handling success， screenHeight = ${data.screenHeight}, ${cc.winSize.height},${JSON.stringify(cc.view.getResolutionPolicy())}`)
                            self.systemInfo.screenWidth = data.screenWidth;
                            self.systemInfo.screenHeight = data.screenHeight;
                        },
                        complete: function () {
                            if (callback) {
                                callback(true);
                            }
                        }
                    })
                }
                break;
            case Game_Platform.GP_Vivo:
                {
                    qg.getSystemInfo({
                        success: function (data) {
                            console.log("TYQSDK", `获取设备信息成功， screenWidth = ${data.screenWidth},handling success， screenHeight = ${data.screenHeight}, ${cc.winSize.height},${JSON.stringify(cc.view.getResolutionPolicy())}`)
                            self.systemInfo.screenWidth = data.screenWidth;
                            self.systemInfo.screenHeight = data.screenHeight;
                        },
                        complete: function () {
                            if (callback) {
                                callback(true);
                            }
                        }
                    })
                }
                break;
            default:
                if (callback) {
                    callback(true);
                }
                break;
        }
    }


    /**
     * 获取屏幕宽高信息
     */
    public getSystemInfo(): SystemInfo {
        return this.systemInfo;
    }

    /**
     * QQ & Tiktok
     * 判断某版本是否大于当前版本
     * @param version QQ-SDKVersion如"1.12.0"
     */
    public isversionNewThanEngineVersion(version) {
        switch (SdkTools.getPlatform()) {
            case Game_Platform.GP_QQ:
                {
                    var versionArr = version.split('.');
                    var ver = Number(versionArr[0]) * 100 + Number(versionArr[1]) * 10 + Number(versionArr[2]);

                    var engineVersion = qq.getSystemInfoSync().SDKVersion;
                    var engineVersionArr = engineVersion.split('.');
                    var enginever = Number(engineVersionArr[0]) * 100 + Number(engineVersionArr[1]) * 10 + Number(engineVersionArr[2]);

                    if (ver <= enginever) {
                        return true;
                    }
                    else {
                        return false;
                    }
                }
            case Game_Platform.GP_Tiktok:
                {
                    var versionArr = version.split('.');
                    var ver = Number(versionArr[0]) * 100 + Number(versionArr[1]) * 10 + Number(versionArr[2]);

                    var engineVersion = tt.getSystemInfoSync().SDKVersion;
                    var engineVersionArr = engineVersion.split('.');
                    var enginever = Number(engineVersionArr[0]) * 100 + Number(engineVersionArr[1]) * 10 + Number(engineVersionArr[2]);

                    if (ver <= enginever) {
                        return true;
                    }
                    else {
                        return false;
                    }
                }
            case Game_Platform.GP_WX:
                {
                    var versionArr = version.split('.');
                    var ver = Number(versionArr[0]) * 100 + Number(versionArr[1]) * 10 + Number(versionArr[2]);

                    var engineVersion = wx.getSystemInfoSync().SDKVersion;
                    var engineVersionArr = engineVersion.split('.');
                    var enginever = Number(engineVersionArr[0]) * 100 + Number(engineVersionArr[1]) * 10 + Number(engineVersionArr[2]);

                    if (ver <= enginever) {
                        return true;
                    }
                    else {
                        return false;
                    }
                }
            default:
                return true;
        }
    }
}

export default SdkTools