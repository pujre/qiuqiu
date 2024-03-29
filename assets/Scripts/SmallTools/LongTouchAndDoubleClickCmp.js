cc.Class({
    extends: cc.Component,
    properties:
    {
        isLongTouch : {
            default : false,
            tooltip : "是否打开长按",
        },
        longTouchTime : {
            default: 2000,
            tooltip : "长按响应时间(单位:（ms/毫秒）)",
            visible() {
                return this.isLongTouch;
            }
        },
        longTouchEvent : {
            default: null,
            tooltip : "长按的响应事件",
            type : cc.Component.EventHandler,
            visible() {
                return this.isLongTouch;
            },
        },
        isDoubleClick : {
            default : false,
            tooltip : "是否打开双击",
        },
        doubleClickTimes : {
            default: 600,
            tooltip : "双击之间的间隔时间(单位(ms/毫秒))",
            visible() {
                return this.isDoubleClick;
            }
        },
        doubleClickEvent : {
            default: null,
            tooltip : "双击的响应事件",
            type : cc.Component.EventHandler,
            visible() {
                return this.isDoubleClick;
            },
        },
    },


      /***
      **  下面的都是临时变量
      ***/
    //触摸状态
    isTouchState : false,
    //触摸时长
    touchTime : 0,
    //记录双击状态
    doubleClickState : false,
    //记录双击的间隔时间
    doubleOffTime : 0,


    // LIFE-CYCLE CALLBACKS:
    ctor()
    {
        //初始化事件
        this.longTouchEvent = new cc.Component.EventHandler();
        this.doubleClickEvent = new cc.Component.EventHandler();
    },

    onLoad () 
    {
        //触摸开始
        this.node.on(cc.Node.EventType.TOUCH_START,function(event){
            this.isTouchState = true;
            this.touchTime = 0;
        },this);

        this.node.on(cc.Node.EventType.TOUCH_END,function(event){
            this.isTouchState = false;
            //判断是不是长按
            if(this.isLongTouch)
            {
                if(this.touchTime >= this.longTouchTime)
                {
                    //派发长按事件
                    this.longTouchEvent.emit([this.longTouchEvent.customEventData]);
                    this.touchTime = 0;
                    return;
                }
            }

            //判断是不是双击
            if(this.isDoubleClick)
            {
                if(this.doubleClickState)
                {
                     //第二次点击判断间隔时间
                    if(this.doubleOffTime <= this.doubleClickTimes)
                    {
                        //派发双击事件
                        this.doubleClickEvent.emit([this.doubleClickEvent.customEventData]);
                    }
                    this.doubleOffTime = 0;
                    this.doubleClickState = false;
                }
                else
                {
                    //第一次点击后，设置为双击状态，开始双击间隔时间计时
                    this.doubleClickState = true;
                    this.doubleOffTime = 0;
                }
            }

            this.touchTime = 0;
        },this);

    },

    start () {

    },

    update (dt)
    {
        //触摸计时
        if(this.isTouchState)
        {
            //防止这个数加的很大
            if(this.touchTime > this.longTouchTime)
            {
                this.touchTime = this.longTouchTime;
            }
            this.touchTime = this.touchTime + dt*1000;
 
        }
        //双击计时
        if(this.doubleClickState)
        {
            if(this.doubleOffTime > this.doubleClickTimes)
            {
                this.doubleOffTime = this.doubleClickTimes;
            }
            this.doubleOffTime = this.doubleOffTime + dt*1000;
        }
    },
});