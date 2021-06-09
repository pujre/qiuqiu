
/**
 ** 创建人: zhibin
 ** 日  期: 2019.11.19
 ** 版  本: 1.0
 ** 描  述: 
        配置表管理类：
        主要负责配置表的加载，调用init函数会加载asset
 ** 应  用: 
 *  ConfigManager.init();
 *  ConfigManager.getCf("name" , 1);  基本上只需要用这个
 */

const configDir = "json";

class CConfigManger {
    private static _manager: CConfigManger = null;
    public static getInstance(): CConfigManger {
        if (!this._manager) {
            this._manager = new CConfigManger();
        }
        return this._manager;
    }

    public static destroy(): void {
        if (this._manager) {
            this._manager = null;
        }
    }

    private _bIsLoad = false;
    private _configMap: { [key: string]: any } = {};

    /**
     * 初始化,json加载
     * @param callBack 是否加载完成的回调 
     */
    public init(callBack?: (isOk: boolean) => void) {
        if (this._bIsLoad) {
            cc.log("configManager already init");
            if (callBack) {
                callBack(false);
            }
            return;
        }
        this._bIsLoad = true;
        cc.loader.loadResDir(configDir, (error: Error, resource: any[], urls: string[]): void => {
            if (error) {
                cc.error("load res error :" + error.message);
                this._bIsLoad = false;
                if (callBack) {
                    callBack(false);
                }
                return;
            }

            for (let i = 0; i < resource.length; i++) {
                if (urls[i] && resource[i]) {
                    let name = cc.path.basename(urls[i], "");
                    this._configMap[name] = this._parseConfByConf(name,resource[i].json) ;
                }
            }
            //cc.log(this._configMap);
            if (callBack) {
                callBack(true);
            }
        })
    }

    private _parseConfByConf(name,res){
        // let keyConfig = KEY_CONFIG[name];
        // if(keyConfig){
        //     let conf = {};
        //     for (let dataIdx in res) {
        //         let data = res[dataIdx];
        //         let subConf = conf;
        //         for (let index = 0; index < keyConfig.length; index++) {
        //             let key = data[ keyConfig[index]];
        //             if(!subConf[key]){
        //                 subConf[key] = {};
        //             }
        //             if(index == keyConfig.length -1){
        //                 subConf[key] = data;
        //                 break;
        //             }

        //             subConf = subConf[key];
        //         }
        //     }
        //     return conf;
        // }else{
            return res;
        // }
        
    }

    /**
     * 获取配置
     * @param configName 配置名字
     */
    public getConfigByName(configName: string): any {
        if (this._configMap[configName]) {
            return this._configMap[configName];
        } else {
            cc.log("cant find config name :" + configName);
            return null;
        }
    }

    
    // 
    /**
     * 获得配置，可以传索引
     * 比如  
     *  ConfigManger.getCf("lord",3009,1);
        ConfigManger.getCf("skill",200101)
        ConfigManger.getCf("icon");
        没有 keys 就和 getConfigByName() 效果一致
     * @param cfName 配置名字 
     * @param keys 索引
     */
    public getCf(cfName: string, ...keys:(string|number)[] ): any {
        if (cfName && "" == cfName) {
            return;
        }

        let ret = this._configMap[cfName];
        for (let index = 0; index < keys.length; index++) {
            const element = keys[index];
            if(ret && ret.hasOwnProperty(element)){
                ret = ret[element];
            }else{
                return null;
            }
        }

        return ret;

    }

    /** 
     * 多语言转换，用法ConfigManger.xlangStr(1001,{lv:1,num:10})会把{lv}替换成1,{num}替换成10
     * @param id 配置id
     * @param replaceObj 需要替换的表
     */
    public xlangStr(id: number,replaceObj = {}): string {
        let lang = "cn";
        let xl = this.getCf("localization_" + lang, id);
        if (xl && xl.des) {
            let ret:string = xl.des ;
            if(replaceObj){
                for (const key in replaceObj) {
                    ret = ret.replace("{"+ key +"}",replaceObj[key]);
                }
            }
            return ret;
        } else {
            return `${id}`;
        }
    }

    /**
     * 根据json格式转换为数组
     * @param cfName 
     * @param key 
     * @param value 
     */
    public getIdsByKeyValue(cfName:string,key:string|number,value:string|number):number[]{
        if (cfName && "" == cfName) {
            return;
        }
        let ids = [];
        let ret = this._configMap[cfName];
        if(ret){
            for (const idx in ret) {
                let item = ret[idx];
                if(item[key] == value){
                    ids.push(idx);
                }
            }
        }
        return ids;
    }


}
let ConfigManger = CConfigManger.getInstance();
//ConfigManger.init();

export default ConfigManger;
