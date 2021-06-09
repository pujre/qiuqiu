
const {ccclass, property} = cc._decorator;
/**
 * 事件管理器
 * 
 * 事件监听
 * T.EventCenter.getInst().register("test", ()=>{},this);
 * 事件移除
 * T.EventCenter.getInst().removeListener("test",this);
 * 发送消息
 * T.EventCenter.getInst().fire("test");
 */
@ccclass
export default class EventCenter extends cc.Component {

  /** 监听数组 */
  private listeners = {};

  private static instance = null;

  /**单例 */
  public static getInst(): EventCenter {
      if(!this.instance || this.instance == null) {
          this.instance = new EventCenter();
      }
      return this.instance;
  }
  /** 
   * 注册事件
   * @param name 事件名称
   * @param callback 回调函数,默认传入第一个参数为args[1]
   * @param context 上下文
   */
  public register(name: string, callback: Function, context: any) {
      let observers: Observer[] = this.listeners[name];
      if (!observers) {
          this.listeners[name] = [];
      }
      this.listeners[name].push(new Observer(callback, context));
  }

  /**
   * 移除事件
   * @param name 事件名称
   * @param context 上下文
   */
  public removeListener(name: string, context: any) {
      let observers: Observer[] = this.listeners[name];
      if (!observers) return;
      let length = observers.length;
      for (let i = 0; i < length; i++) {
          let observer = observers[i];
          if (observer.compar(context)) {
              observers.splice(i, 1);
              break;
          }
      }
      if (observers.length == 0) {
          delete this.listeners[name];
      }
  }

  /**
   * 发送事件
   * @param name 事件名称
   */
  public fire(name: string, ...args: any[]) {
      let observers: Observer[] = this.listeners[name];
      if (!observers) return;
      let length = observers.length;
      for (let i = 0; i < length; i++) {
          let observer = observers[i];
          observer.notify(...args);
      }
  }

}

export class Observer {
    /** 回调函数 */
    private callback: Function = null;
    /** 上下文 */
    private context: any = null;

    constructor(callback: Function, context: any) {
        let self = this;
        self.callback = callback;
        self.context = context;
    }

    /**
     * 发送通知
     * @param args 不定参数
     */
    notify(...args: any[]): void {
        let self = this;
        self.callback(...args);
    }

    /**
     * 上下文比较
     * @param context 上下文
     */
    compar(context: any): boolean {
        return context == this.context;
    }
}
