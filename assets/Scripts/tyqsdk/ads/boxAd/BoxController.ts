import SdkTools, { Game_Platform } from "../../tools/SdkTools"
import NavigateController from "../../navigate/NavigateController"

class BoxController {
    private static instance: BoxController

    /**
     * 盒子广告ID
     */
    public ID_BoxID = "b55b572b26bf93d1f4ae5ca138a36947";

    /**
     * 盒子广告开关
     */
    public SW_BoxSwitch: boolean = true;

    /**
     * 盒子广告对象
     */
    public appBoxAd: any = null;

    /**
     * 是否加载到盒子广告
     */
    public isLoadAppBox: boolean = false;

    /**
    * BoxController 单例
    */
    public static getInstance(): BoxController {
        if (!BoxController.instance) {
            BoxController.instance = new BoxController()
        }
        return BoxController.instance
    }


    /**
     * 创建盒子广告
     */
    public createAppBox() {

        if (!this.SW_BoxSwitch) {
            console.log("TYQSDK", "QQ 盒子广告开关未开启");
            return;
        }
        
        if (SdkTools.getPlatform() == Game_Platform.GP_Oppo) {
            NavigateController.getInstance().createNavigateBoxPortal(this.ID_BoxID);
            return;
        }

       

        if (!SdkTools.getInstance().isversionNewThanEngineVersion("1.7.1")) {
            console.log("TYQSDK", "QQ 平台版本过低,不能创建盒子广告");
            return;
        }

        console.log('TYQSDK', 'QQ 盒子广告初始化', this.ID_BoxID);

        let self = this;

        this.appBoxAd = qq.createAppBox({
            adUnitId: this.ID_BoxID
        });

        // 加载盒子广告
        this.appBoxAd.load().then(() => {
            console.log('TYQSDK', 'QQ 加载盒子广告完成===================');
            self.isLoadAppBox = true;
        })

        // 监听用户关闭盒子广告
        this.appBoxAd.onClose(() => {
            console.log('TYQSDK', 'QQ 关闭盒子广告');
            self.appBoxAd.load().then(() => {
                console.log('TYQSDK', 'QQ 加载盒子广告完成===================');
                self.isLoadAppBox = true;
            })
        })
    }

    /**
     * 获取盒子是否可以展示标志
     */
    public getBoxFlag() {
        return this.isLoadAppBox;
    }

    /**
     * 展示盒子广告
     */
    public showAppBox() {
        if (SdkTools.getPlatform() == Game_Platform.GP_Test) {
            console.log("TYQSDK", "Test 没有测试盒子广告============");
            return;
        }
        if (!this.SW_BoxSwitch) {
            console.log("TYQSDK", "QQ 盒子广告开关未开启");
            return;
        }

        if (this.isLoadAppBox) {
            console.log('TYQSDK', 'QQ 展示盒子广告========================');
            this.appBoxAd.show();
        } else {
            console.log('TYQSDK', 'QQ 盒子广告未加载完成');
        }

    }


}

export default BoxController  