

const {ccclass, property} = cc._decorator;

@ccclass
export class LatticeArray {
    private L2DArray: Array<Array<number>> = new Array<Array<number>>();
    private rows: number = 6;
    private columns: number = 6;
    public constructor() {
        this.initRows(this.rows);
        this.initColumns(this.columns);
    }

    /**根据节点获取lattice */
    public getValueNode(cnode:cc.Node):number{
        let vut=cnode.name.split(',');
        return this.getValue(Number(vut[0]),Number(vut[1]));
    }

    /**
    * 取数组中的值
    */
    public getValue(rows: number, columns: number): number {
        if (rows < 0 || columns < 0 || rows >= this.rows || columns >= this.columns) {
            return null;
        }
        return this.L2DArray[rows][columns];
    }

    /**
    * 为数组赋值
    */
    public setValue(rows: number, columns: number, value: number): void {
        if (rows < 0 || columns < 0 || rows >= this.rows || columns >= this.columns){
            return;
        }
        this.L2DArray[rows][columns] = value;
    }


    /**
    * 初始化行数
    */
    private initRows(rows: number): void {
        if (rows < 1) {
            return;
        }
        for (let i = 0; i < rows; i++) {
            this.L2DArray.push(new Array<number>());
        }
    }


    /**
    * 初始化列数
    */
    private initColumns(columns: number): void {
        if (columns < 1) {
            return;
        }
        for (let i = 0; i < this.L2DArray.length; i++) {
            for (let j = 0; j < columns; j++) {
                this.L2DArray[i].push((j));
            }
        }
    }

    /**
    * 获取数组
    */
    public getArray(): Array<Array<number>> {
        return this.L2DArray;
    }
}

