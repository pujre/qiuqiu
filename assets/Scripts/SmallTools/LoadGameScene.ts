import MiniGameSDK from "../ThirdPlugin/MiniGameSDK";
const {ccclass, property} = cc._decorator;

/**加载场景（用于加载游戏主场景） */
@ccclass
export default class LoadGameScene extends cc.Component {
    @property()
    SceneName:string='';
    @property(cc.Sprite)
    loading:cc.Sprite=null;

    start () {
        //this.DeskTop();
        this.scheduleOnce(()=>{
            if(this.SceneName!='')cc.director.loadScene(this.SceneName);
        },1.5);
        this.LoadFill();
    }


    LoadFill(){
        this.schedule(()=>{
            // 这里的 this 指向 component
            this.loading.fillRange+=0.01;
        }, 0.01, 99, 0);
    }


    DeskTop(){
        if (cc.sys.platform === cc.sys.VIVO_GAME || cc.sys.platform === cc.sys.OPPO_GAME) {
            MiniGameSDK.getNetworkType((result) => {
                if (result) {
                    
                }
                else {
                    MiniGameSDK.showDialog('提示', '无网络，请退出游戏重启网络', () => {
                        MiniGameSDK.exitApplication();
                    });
                }
            });
        }
    }

    // update (dt) {}
}
