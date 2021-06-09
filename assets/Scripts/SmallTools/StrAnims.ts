
const {ccclass, property} = cc._decorator;

@ccclass
export default class StrAnims extends cc.Component {
    @property([cc.String])
    StrArr:string[]=[];
    @property()
    times:number=0.5;
    label:cc.Label=null;
    i:number=0;

    onLoad () {
        this.label=this.node.getComponent(cc.Label);
        this.NextStr();
    }

    NextStr() {
        if(this.label&&this.StrArr.length>0){
            this.label.string=this.StrArr[this.i];
            this.i=this.i==this.StrArr.length-1?0:this.i+1;
            this.scheduleOnce(()=>{
                this.NextStr();
            },this.times);
        }
    }

    // update (dt) {}
}
