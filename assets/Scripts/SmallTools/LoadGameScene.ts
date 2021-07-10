import MiniGameSDK from "../ThirdPlugin/MiniGameSDK";
const {ccclass, property} = cc._decorator;

/**加载场景（用于加载游戏主场景） */
@ccclass
export default class LoadGameScene extends cc.Component {
    @property()
    SceneName:string='';
    @property(cc.Sprite)
    loading:cc.Sprite=null;

    private progressNum: number = 0;
    loadComplete: boolean = false;


    onLoad () {
        this.loadScene(this.SceneName);
    }

    loadScene(scene: string) {
        let self = this;
        cc.director.preloadScene(scene,
            function (completedCount, totalCount, item) {
                if (completedCount / totalCount > self.progressNum) {
                    self.progressNum = completedCount / totalCount;
                    self.loading.fillRange=self.progressNum;
                    cc.log("加载进度" + self.progressNum+' 资源总数为：'+totalCount+'  当前已加载的资源数为：'+completedCount+ ' item:'+item.url);
                }
            },
            function (error: Error, asset) {
                self.loadComplete = true;
                cc.log("场景资源加载完成");
            }
        )
    }
    update(dt){
        if(this.loadComplete){
            cc.log("开始跳转场景");
            this.loadComplete=false;
            cc.director.loadScene(this.SceneName);
        }
    }
}
