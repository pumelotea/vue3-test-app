export class Point {
  public F:number = -1
  public G:number = -1
  public H:number = -1
  public X:number = -1
  public Y:number = -1
  public parentPoint: Point | undefined

  public setParentPoint(parentPoint: Point){
    this.parentPoint = parentPoint
  }

  constructor(x:number,y:number) {
    this.X = x
    this.Y = y
  }

  public calcF(){
    this.F = this.G + this.H
  }
}

export class AStarFindPath {
  public OBLIQUE = 5
  public STEP = 10
  public closeList:Array<Point> = []
  public openList:Array<Point> = []
  public maze:Array<Array<number>> = []
  public gridWidth = 20
  public gridHeight = 20


  public initMaze(obstruction:Array<Point>=[]){
    const maze:Array<Array<number>> = []
    for (let i=0;i<this.gridWidth;i++){
      maze[i] = []
      for (let j=0;j<this.gridHeight;j++){
        maze[i][j] = 0
        let tmp = this.get(obstruction,new Point(i,j))
        if (tmp){
          maze[i][j] = 1
        }
      }
    }
    this.maze = maze
  }

  private minPoint(list:Array<Point>):Point{
    return list.sort((a, b) => {
      return a.F - b.F
    })[0]
  }

  private surroundPoints(point:Point,isIgnoreCorner:boolean):Array<Point>{
    const surroundPoints = new Array<Point>(9);
    for(let x = point.X -1; x <= point.X+1;x++){
      for (let y = point.Y - 1; y <= point.Y + 1; y++) {
        if (this.canReach(point,x, y,isIgnoreCorner)){
          surroundPoints.push(new Point(x,y))
        }
      }
    }
    return surroundPoints
  }

  private canReachGrid(x:number,y:number):boolean {
    // console.log(x,y,this.maze[x])

    if (!this.maze[x]){
      return false
    }

    return this.maze[x][y] === 0
  }

  private canReach(start:Point, x:number, y:number, isIgnoreCorner:boolean):boolean {
    if (!this.canReachGrid(x, y) || this.exists(this.closeList,new Point(x,y))){
      return false;
    } else {
      // YX
      // 00 01  02  03 04
      // 10 11  12  13 14
      // 20 21 [22] 23 24
      // 30 31  32  33 34
      if (Math.abs(x - start.X) + Math.abs(y - start.Y) == 1){
        return true;
      } else {//如果是斜方向移动, 判断是否 "拌脚"
        // if (canReachGrid(Math.abs(x - 1), y) && canReachGrid(x, Math.abs(y - 1)))
        //   return true;
        // else
        return isIgnoreCorner;
      }
    }
  }

  private calcG(start:Point,point:Point):number {
    let G = (Math.abs(point.X - start.X) + Math.abs(point.Y - start.Y)) == 2 ? this.STEP : this.OBLIQUE;
    let parentG = point.parentPoint != null ? point.parentPoint.G : 0;
    return G + parentG;
  }

  private calcH(end:Point,point:Point):number {
    let step = Math.abs(point.X - end.X) + Math.abs(point.Y - end.Y);
    return step * this.STEP;
  }

  private foundPoint(tempStart:Point, point:Point) {
    let G = this.calcG(tempStart, point);
    if (G < point.G)
    {
      point.parentPoint = tempStart;
      point.G = G;
      point.calcF();
    }
  }

  private notFoundPoint( tempStart:Point, end:Point,  point:Point) {
    point.parentPoint = tempStart;
    point.G = this.calcG(tempStart, point);
    point.H = this.calcH(end, point);
    point.calcF();
    this.openList.push(point);
  }

  private exists(list:Array<Point>,point:Point):boolean{
    return list.filter(e=>{
      return e.X == point.X && e.Y == point.Y
    }).length>0
  }

  private get(list:Array<Point>,point:Point):Point | null{
    let res = list.filter(e=>{
      return e.X == point.X && e.Y == point.Y
    })
    if (res.length>0){
      return res[0]
    }
    return null
  }

  public flatResult(point:Point,list:Array<Point>) {
    if (point.parentPoint){
      this.flatResult(point.parentPoint,list)
    }
    list.push(point)
  }

  public findPath (start:Point,end:Point,isIgnoreCorner:boolean){
    this.openList.push(start);
    while (this.openList.length !=0){
      //找出F值最小的点
      let tempStart = this.minPoint(this.openList)
      this.openList = this.openList.splice(1);

      this.closeList.push(tempStart);

      let surroundPointList = this.surroundPoints(tempStart, isIgnoreCorner);
      surroundPointList.forEach(point => {
        if (this.exists(this.openList,point)){
          //计算G值, 如果比原来的大, 就什么都不做, 否则设置它的父节点为当前点,并更新G和F
          this.foundPoint(tempStart, point);
        }else{
          //如果它们不在开始列表里, 就加入, 并设置父节点,并计算GHF
          this.notFoundPoint(tempStart, end, point);
        }
      })
      if (this.get(this.openList,end) != null){
        return this.get(this.openList,end);
      }
    }
    return this.get(this.openList,end);
  }
}


