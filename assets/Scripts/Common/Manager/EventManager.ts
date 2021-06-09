
/**
 ** 创建人: zhibin
 ** 日  期: 2019.11.19
 ** 版  本: 1.0
 ** 描  述: 单例、观察者
        事件管理类：
        主要负责事件的注册监听和触发事件
 ** 应  用: 
    EventManager.addEventListener("event" , this.event , this);  //添加事件监听
    EventManager.raiseEvent("event" , {xx:xx});  // 触发事件
    EventManager.removeEventListener("event" , this.event , this); //移除事件监听
*/

export type EventManagerCallFunc = (eventName: string, eventData: any)=>void;

interface CallBackTarget {
    callBack:EventManagerCallFunc,
    target:any,
}

class CEventManager {
    private static instance: CEventManager = null;
    public static getInstance(): CEventManager {
        if (!this.instance) {
            this.instance = new CEventManager();
        }
        return this.instance;
    }

    public static destroy(): void {
        if (this.instance) {
            delete this.instance;
            this.instance = null;
        }
    }

    private constructor() {
        // 构造函数h
    }

    private _eventListeners: {[key:string]: CallBackTarget[]} = {};

    private getEventListenersIndex(eventName: string, callBack:EventManagerCallFunc, target?:any):number {
        let index = -1;
        for (let i = 0;i < this._eventListeners[eventName].length;i++) {
            let iterator = this._eventListeners[eventName][i];
            if (iterator.callBack == callBack && (!target || iterator.target == target)) {
                index = i;
                break;
            }
        }
        return index;
    }

    /**
     * 添加事件监听（数组）
     * @param eventName 事件名
     * @param callBack 事件回调
     * @param target 绑定
     */
    addEventListener(eventName: string, callBack: EventManagerCallFunc, target?:any): boolean {
        if(!eventName){
            cc.warn("eventName is empty"+eventName);
            return;
        }

        if (null == callBack) {
            cc.log('addEventListener callBack is nil');
            return false;
        }
        let callTarget:CallBackTarget = {callBack:callBack, target:target};
        if (null == this._eventListeners[eventName]) {
            this._eventListeners[eventName] = [callTarget];

        }else {
            let index = this.getEventListenersIndex(eventName, callBack, target);
            if (-1 == index) {
                this._eventListeners[eventName].push(callTarget);
            }
        }

        return true;
    }

    /**
     * 设置事件监听（和addEventListener 的区别是 一个是尾部添加一个是覆盖）
     * @param eventName 事件名
     * @param callBack 事件回调
     * @param target 绑定
     */
    setEventListener(eventName: string, callBack: EventManagerCallFunc, target?:any): boolean {
        if(!eventName){
            cc.warn("eventName is empty"+eventName);
            return;
        }

        if (null == callBack) {
            cc.log('setEventListener callBack is nil');
            return false;
        }
        let callTarget:CallBackTarget = {callBack:callBack, target:target};
        this._eventListeners[eventName] = [callTarget];

        return true;
    }

    /**
     * 移除事件监听， 和addEventListener 相对应
     * @param eventName 事件名
     * @param callBack 事件回调
     * @param target 绑定
     */
    removeEventListener(eventName: string, callBack: EventManagerCallFunc, target?:any) {
        if (null != this._eventListeners[eventName]) {
            let index = this.getEventListenersIndex(eventName, callBack, target);
            if (-1 != index) {
                this._eventListeners[eventName].splice(index, 1);
            }
        }
    }

    /**
     * 事件触发
     * @param eventName 事件名
     * @param eventData 事件数据传值
     */
    raiseEvent(eventName: string, eventData?: any) {
        console.log(`==================== raiseEvent ${eventName} begin | `,eventData,new Date());
        if (null != this._eventListeners[eventName]) {
            // 将所有回调提取出来，再调用，避免调用回调的时候操作了事件的删除
            let callbackList: CallBackTarget[] = [];
            for (const iterator of this._eventListeners[eventName]) {
                callbackList.push({callBack: iterator.callBack, target: iterator.target});
            }

            for (const iterator of callbackList) {
                //console.log(`-------------------- raiseEvent ${eventName} execute callback begin --------------------`);
                iterator.callBack.call(iterator.target, eventName, eventData);
                //console.log(`-------------------- raiseEvent ${eventName} execute callback end --------------------`);
            }
        }
        console.log(`==================== raiseEvent ${eventName} end`);
    }
}

export let EventManager = CEventManager.getInstance();

