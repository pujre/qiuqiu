/**
 ** 创建人: zhibin
 ** 日  期: 2019.11.19
 ** 版  本: 1.0
 ** 描  述: 静态函数
        UI辅助类：
        UI的静态方法, 主要是通用效果和辅助UI表现的静态方法
*/

/** 抖动类型 */
export enum EShakeType{
    fromStrongToWeak = 1,  // 由强变弱
    Strong = 2    // 一直强
}

export default class UIHelper {
    /** 灰化sprite */
    static setSpriteState(sprite: cc.Sprite, bGray: boolean = false) {
        if (!sprite || !cc.isValid(sprite)) {
            return;
        }
        (<any>sprite)._sgNode.setState(bGray ? 1 : 0);
    }

    /** 
     * 节点震动
     * @param node 抖动节点
     * @param range 抖动范围
     * @param shakeTime 抖动时间
     * @param fromStrongToWeak 由强变弱
     * @param filterChildren 过滤不振动的节点
     */
    public static shakeScreen(node: cc.Node, range = cc.v2(15, 15), shakeTime = 0.8, shakeType = EShakeType.fromStrongToWeak, filterChildren: cc.Node[]) {
        let changeNode: { node: cc.Node, originPos: cc.Vec2 }[] = [];
        for (let i = 0; i < node.children.length; ++i) {
            let obj = node.children[i];
            if (filterChildren.indexOf(obj) == -1) {
                changeNode.push({ node: obj, originPos: obj.position });
            }
        }
        function setChangeNodePosition(x: number, y: number) {
            for (let j = 0; j < changeNode.length; ++j) {
                if (cc.isValid(changeNode[j].node)) {
                    changeNode[j].node.setPosition(changeNode[j].originPos.x + x, changeNode[j].originPos.y + y);
                }
            }
        }

        let pastTime = 0;
        let updateFunc = function shakeUpdate(dt: number) {
            pastTime += dt;
            let precent = pastTime / shakeTime;
            let shakePercent = precent;
            if (precent > 1) {
                precent = 1;
            }
            if (shakeType == EShakeType.fromStrongToWeak) {
                shakePercent = 1 - precent;
            }else if (shakeType == EShakeType.Strong) {
                shakePercent = 1;
            }
            let randx = (Math.random() - 0.5) * 2 * range.x * shakePercent;
            let randy = (Math.random() - 0.5) * 2 * range.y * shakePercent;

            if (precent == 1) {
                cc.director.getScheduler().unschedule(updateFunc, node)
                setChangeNodePosition(0, 0);
            } else if (cc.isValid(node)) {
                setChangeNodePosition(randx, randy);
            }
        }

        cc.director.getScheduler().schedule(updateFunc, node, 0);
    }

        /**
     * 循环放大缩小
     * @param node 变化的节点
     * @param big 放大的大小
     * @param small 缩小的大小
     * @param bigInterval 放大的时间
     * @param smallInterval 缩小的时间
     * @param totalTime 持续时间
     */
    static scaleLoop(node: cc.Node, big: number, small: number, bigDuration: number, smallDuration: number, totalDuration: number) {
        let easeTime = 1;
        let loopChangeAct = cc.repeatForever(cc.sequence(
            cc.scaleTo(bigDuration, big).easing(cc.easeOut(easeTime)),
            cc.scaleTo(bigDuration, 1).easing(cc.easeIn(easeTime)),
            cc.scaleTo(smallDuration, small).easing(cc.easeOut(easeTime)),
            cc.scaleTo(smallDuration, 1).easing(cc.easeIn(easeTime))
        ));

        let stopAct = cc.sequence(
            cc.delayTime(totalDuration),
            cc.callFunc(() => {
                node.stopAction(loopChangeAct);
                node.scale = 1;
            })
        )

        node.runAction(loopChangeAct);
        node.runAction(stopAct);
    }

    /** 滚动文字 */
    static playLabelRoll(lab: cc.Label, finalNum: number, min: number, max: number, rollTime: number, rollSpeed: number, prefix: string, finishFunc: () => void, force = false) {
        let pastTime = 0;
        if (!force) {
            let turnCount = Math.ceil(rollSpeed * rollTime / (max - min + 1));
            rollTime = (turnCount * (max - min + 1) + (finalNum - min)) / rollSpeed;
        }

        let rollUpdate = function (dt: number) {
            pastTime += dt;
            if (pastTime >= rollTime) {
                lab.string = prefix ? (prefix + finalNum.toString()) : finalNum.toString();
                this.unschedule(rollUpdate);
                finishFunc();
                return;
            }

            let num = Math.floor(rollSpeed * pastTime % (max - min + 1) + min);
            lab.string = prefix ? (prefix + num.toString()) : num.toString();
        }

        lab.schedule(rollUpdate, 0);
    }
}
