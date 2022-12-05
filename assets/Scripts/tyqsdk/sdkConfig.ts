
class sdkConfig {
    private static instance: sdkConfig

    // SDK版本,请勿修改
    public static readonly SDKVersion: string = "version_1_0";
    // APPID,仅在HW(华为)渠道可用.
    public static readonly APPID: string = "0";

    /**
     * sdkConfig单例
     */
    public static getInstance(): sdkConfig {
        if (!sdkConfig.instance) {
            sdkConfig.instance = new sdkConfig()
        }
        return sdkConfig.instance
    }

    // 渠道ID "0"为测试版(安卓和IOS没有测试)  "1234666"为安卓  "1234888"为IOS
    //public channelId: string = '123415589';//qq
<<<<<<< HEAD
    //public channelId: string = '123410889';//vivo
    //public channelId: string = '123414289';//oppo
    public channelId: string = '123415489';//tiktok
    //public channelId: string = '0';//tiktok
=======
    public channelId: string = '123410889';//vivo
    //public channelId: string = '0';//tset
>>>>>>> 6c9f2336ea1f1b31affdae48bf9375fd94fbdfd6

}

export default sdkConfig