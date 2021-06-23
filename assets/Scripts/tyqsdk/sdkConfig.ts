
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
    public channelId: string = '0'//"123410889";

}

export default sdkConfig