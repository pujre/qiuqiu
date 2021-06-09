

/**
 * !!!!示例
 * Vivo mini game sdk的原生接口方法(静态方法)
 * https://minigame.vivo.com.cn/documents/#/lesson/
 * Oppo mini game sdk的接口方法文档
 * https://cdofs.oppomobile.com/cdo-activity/static/201810/26/quickgame/documentation/
 */
export default class MiniGameSDK 
{

    /**
     * 获取网络类型.
     * Object object
     * success	Function	否	成功回调
     * fail	Function	    否	失败回调，可能是因为缺乏权限
     * complete	Function	否	执行结束后的回调
     * 
     * success回调参数： Object data
     * metered	Boolean	是否按照流量计费
     * type	String	网络类型，可能的值为2g，3g，4g，wifi，none
     * @param callback 带boolean类型参数的回调
     */
    public static getNetworkType(callback: any)
    {
        if (cc.sys.platform == cc.sys.VIVO_GAME || cc.sys.platform == cc.sys.OPPO_GAME)
        {
            qg.getNetworkType({
                success: function (res)
                {

                    if (cc.sys.platform === cc.sys.VIVO_GAME)
                    {
                        console.log("vivo network getNetworkType type:", res.type);
                        if (res.type == 'wifi' || res.type == '4g')
                        {

                            if (callback) callback(true);
                        }
                        else
                        {
                            console.log('vivo 无网络连接');
                            if (callback) callback(false);
                        }
                    }
                    else if (cc.sys.platform === cc.sys.OPPO_GAME)
                    {
                        console.log("oppo network getNetworkType type:", res.networkType);
                        if (res.networkType == 'wifi' || res.networkType == '4g')
                        {
                            if (callback) callback(true);
                        }
                        else
                        {
                            if (callback) callback(false);
                        }
                    }

                },
                fail: function (res)
                {
                    if (callback) callback(false);
                    console.log("network getNetworkType ", res.errMsg);
                },
                complete: function (res) { }
            })
        }
        else
        {
            if (callback) callback(true);
        }
    }

    /**
     * 监听网络连接状态。如果多次调用，仅最后一次调用生效（vivo）
     * 监听网络状态变化事件（oppo）
     * @param callback  带boolean类型参数的回调
     */
    public static subscribeNetworkStatus(callback: any)
    {
        if (cc.sys.platform === cc.sys.VIVO_GAME)
        {
            qg.subscribeNetworkStatus({
                callback: function (data)
                {
                    console.log('vivo network status ,type:', data.type);
                    if (data.type == 'wifi' || data.type == '4g')
                    {
                        if (callback) callback(true);
                    }
                    else
                    {
                        if (callback) callback(false);
                    }
                }
            })
        }
        else if (cc.sys.platform === cc.sys.OPPO_GAME)
        {
            qg.onNetworkStatusChange(function (res)
            {
                console.log('oppo network status ,isConnected:', res.isConnected, ',networkType:', res.netWorkType);
                if (res.isConnected)
                {
                    if (res.netWorkType == 'wifi' || res.networkType == '4g')
                    {
                        if (callback) callback(true);

                    }
                    else
                    {
                        if (callback) callback(false);
                    }
                }
                else
                {
                    if (callback) callback(false);
                }
            })
        }
        else 
        {
            if (callback) callback(true);
        }

    }

    /**
     * 显示对话框
     * 
     */
    public static showDialog(_title: string, _msg: string, callback1: any, callback2: any = null, callback3: any = null)
    {
        if (cc.sys.platform === cc.sys.VIVO_GAME)
        {
            let dialogPanel: DialogPanel = new DialogPanel();
            dialogPanel.title = _title;
            dialogPanel.message = _msg;
            let btn: DailogButton = new DailogButton();
            btn.text = '确定';
            /* let btn2: DailogButton = new DailogButton();
            btn2.text = '取消';
            let btn3: DailogButton = new DailogButton();
            btn3.text = '按钮3'; */
            dialogPanel.buttons.push(btn);
            //dialogPanel.buttons.push(btn2);
            //dialogPanel.buttons.push(btn3);
            dialogPanel.success = (data) =>
            {
                console.log('dialog 成功回调：', data.index);
                if (data.index == 0)
                {
                    //第一个按钮的回调
                    callback1();
                }
                else if (data.index == 1)
                {
                    //第二个按钮的回调
                    if (callback2) callback2();
                }
                else if (data.index == 2)
                {
                    //第三个按钮的回调
                    if (callback3) callback3();
                }
            };
            dialogPanel.cancel = () =>
            {
                console.log('dialog 取消回调：');
            };
            dialogPanel.fail = (data, code) =>
            {
                console.log('dialog 失败回调：', data, ',====code', code);
            };
            if (cc.sys.platform === cc.sys.VIVO_GAME)
                qg.showDialog(dialogPanel);
        }
        else if (cc.sys.platform == cc.sys.OPPO_GAME)
        {
            qg.showModal({
                title: _title,
                content: _msg,
                success(res)
                {
                    if (res.confirm)
                    {
                        console.log('用户点击确定');
                        if (callback1) callback1();
                    } else if (res.cancel)
                    {
                        console.log('用户点击取消');
                        if (callback2) callback2();
                    }
                }
            })
        }
        else
        {
            console.log('other platform show dialog');
        }
    }

    /**
     * 显示弹窗
     * @param _msg 要显示的文本
     * @param _duration vivo:0为短时，1为长时，默认0.Oppo:提示的延迟时间，默认为1500
     */
    public static showToast(_msg: string, _duration: number)
    {
        if (cc.sys.platform == cc.sys.VIVO_GAME)
        {
            qg.showToast({
                message: _msg,
                duration: _duration
            })
        }
        else if (cc.sys.platform == cc.sys.OPPO_GAME)
        {
            qg.showToast({
                title: _msg,
                icon: 'success',
                duration: _duration
            })
        }
    }

    /**
     * 短震动15ms
     * vivo没有短震动
     */
    public static vibrateShort()
    {
        console.log('vivo vibrateShort');
        if (cc.sys.platform === cc.sys.VIVO_GAME)
        {
            qg.vibrateShort();
            this.vibrateLong();
        }
        else if (cc.sys.platform === cc.sys.OPPO_GAME)
        {
            qg.vibrateShort({
                success: function (res)
                {
                    console.log('oppo vibrateShort');
                },
                fail: function (res) { },
                complete: function (res) { }
            })
        }

    }

    /**
     * 长震动 400ms
     */
    public static vibrateLong()
    {
        console.log('vivo vibrateLong');
        if (cc.sys.platform === cc.sys.VIVO_GAME)
        {
            qg.vibrateLong();
        }
        else if (cc.sys.platform === cc.sys.OPPO_GAME)
        {
            qg.vibrateLong({
                success: function (res)
                {
                    console.log('oppo vibrateLong');
                },
                fail: function (res) { },
                complete: function (res) { }
            })
        }
    }

    /**
     * 游戏切后台切换监听
     * @param callback 
     */
    public static onApplication(callback: OnApplication)
    {
        if (cc.sys.platform === cc.sys.VIVO_GAME)
        {
            qg.onShow(() =>
            {
                console.log('vivo game enter foreground');
                if (callback) callback(true);
            });

            qg.onHide(() =>
            {
                console.log('vivo game enter background');
                if (callback) callback(false);
            });
        }

    }

    /**
     * 退出游戏
     */
    public static exitApplication()
    {
        if (cc.sys.platform === cc.sys.VIVO_GAME)
        {
            qg.exitApplication();
        }
        else if (cc.sys.platform === cc.sys.OPPO_GAME)
        {
            qg.exitApplication({})
        }

    }





}


/** 监听游戏切入前台的接口委托 */
export interface OnApplication
{
    /** 委托方法 */
    (result: boolean): void
}

/** 委托接口，不带参数的回调方法 */
export interface funVoid
{
    /** 不带参数的回调方法 */
    (): void
}

/** 委托接口，带参数的回调方法 
 * data.index==0: 点击了第一个按钮
 * data.index==1: 点击了第二个按钮
 * data.index==2: 点击了第三个按钮
*/
export interface funParam
{
    /** 带参数回调方法 */
    (data): void
}

/** 委托接口，带两个参数的回调方法 */
export interface funParams
{
    /** 带两个参数的回调方法 */
    (data, code): void
}



export class DialogPanel
{
    /** 标题 */
    title: string = 'title';
    /** 信息内容 */
    message: string = 'message';
    /** 按钮组 */
    buttons: DailogButton[] = [];
    /** 成功的回调,点击任何按钮都会触发该回调 */
    success: funParam;
    /** 取消的回调 */
    cancel: funVoid;
    /** 失败的回调 */
    fail: funParams;
}

export class DailogButton
{
    /** 按钮标签文字 */
    text: string = '按钮';
    /** 按钮背景颜色 */
    color: string = '#33dd44';
}