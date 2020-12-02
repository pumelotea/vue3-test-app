// class Point {
//   public F:number = -1
//   public G:number = -1
//   public H:number = -1
//   public X:number = -1
//   public Y:number = -1
//   public parentPoint: Point | undefined
//
//   public setParentPoint(parentPoint: Point){
//     this.parentPoint = parentPoint
//   }
//
//   constructor(x:number,y:number) {
//     this.X = x
//     this.Y = y
//   }
//
//   public calcF(){
//     this.F = this.G + this.H
//   }
// }
//
// const OBLIQUE = 5;
// const STEP = 10;
// const closeList:Array<Point> = [];
// let openList:Array<Point> = [];
// const maze:Array<Array<number>> = initMaze()
//
// function initMaze():Array<Array<number>>{
//   const maze:Array<Array<number>> = []
//   for (let i=0;i<20;i++){
//     maze[i] = []
//     for (let j=0;j<20;j++){
//       maze[i][j] = 0
//     }
//   }
//   return maze
// }
//
// const findPath = (start:Point,end:Point,isIgnoreCorner:boolean)=>{
//   openList.push(start);
//   while (openList.length !=0){
//     //找出F值最小的点
//     let tempStart = minPoint(openList)
//     openList = openList.splice(1);
//
//     closeList.push(tempStart);
//
//     let surroundPointList = surroundPoints(tempStart, isIgnoreCorner);
//     surroundPointList.forEach(point => {
//       if (exists(openList,point)){
//         //计算G值, 如果比原来的大, 就什么都不做, 否则设置它的父节点为当前点,并更新G和F
//         foundPoint(tempStart, point);
//       }else{
//         //如果它们不在开始列表里, 就加入, 并设置父节点,并计算GHF
//         notFoundPoint(tempStart, end, point);
//       }
//     })
//     if (get(openList,end) != null)
//       return get(openList,end);
//
//   }
//   return get(openList,end);
// }
//
// function minPoint(list:Array<Point>):Point{
//   return list.sort((a, b) => {
//     return a.F - b.F
//   })[0]
// }
//
// function surroundPoints(point:Point,isIgnoreCorner:boolean):Array<Point>{
//   const surroundPoints = new Array<Point>(9);
//   for(let x = point.X -1; x <= point.X+1;x++){
//     for (let y = point.Y - 1; y <= point.Y + 1; y++) {
//       if (canReach(point,x, y,isIgnoreCorner)){
//         surroundPoints.push(new Point(x,y))
//       }
//     }
//   }
//   return surroundPoints
// }
//
// function canReachGrid(x:number,y:number):boolean {
//   return maze[x][y] === 0
// }
//
// function canReach(start:Point, x:number, y:number, isIgnoreCorner:boolean):boolean {
//   if (!canReachGrid(x, y) || exists(closeList,new Point(x,y))){
//     return false;
//   } else {
//     // YX
//     // 00 01  02  03 04
//     // 10 11  12  13 14
//     // 20 21 [22] 23 24
//     // 30 31  32  33 34
//     if (Math.abs(x - start.X) + Math.abs(y - start.Y) == 1){
//       return true;
//     } else {//如果是斜方向移动, 判断是否 "拌脚"
//       // if (canReachGrid(Math.abs(x - 1), y) && canReachGrid(x, Math.abs(y - 1)))
//       //   return true;
//       // else
//         return isIgnoreCorner;
//     }
//   }
// }
//
// function calcG(start:Point,point:Point):number {
//   let G = (Math.abs(point.X - start.X) + Math.abs(point.Y - start.Y)) == 2 ? STEP : OBLIQUE;
//   let parentG = point.parentPoint != null ? point.parentPoint.G : 0;
//   return G + parentG;
// }
//
// function calcH(end:Point,point:Point):number {
//   let step = Math.abs(point.X - end.X) + Math.abs(point.Y - end.Y);
//   return step * STEP;
// }
//
// function foundPoint(tempStart:Point, point:Point) {
//   let G = calcG(tempStart, point);
//   if (G < point.G)
//   {
//     point.parentPoint = tempStart;
//     point.G = G;
//     point.calcF();
//   }
// }
//
// function notFoundPoint( tempStart:Point, end:Point,  point:Point) {
//   point.parentPoint = tempStart;
//   point.G = calcG(tempStart, point);
//   point.H = calcH(end, point);
//   point.calcF();
//   openList.push(point);
// }
//
// function exists(list:Array<Point>,point:Point):boolean{
//   return list.filter(e=>{
//     return e.X == point.X && e.Y == point.Y
//   }).length>0
// }
//
// function get(list:Array<Point>,point:Point):Point | null{
//   let res = list.filter(e=>{
//     return e.X == point.X && e.Y == point.Y
//   })
//   if (res.length>0){
//     return res[0]
//   }
//   return null
// }
//
// function flatResult(point:Point,list:Array<Point>) {
//   if (point.parentPoint){
//     flatResult(point.parentPoint,list)
//   }
//   list.push(point)
// }
//
// //测试
//
// maze[2][8]=9
// maze[3][8]=9
// maze[4][8]=9
// maze[5][8]=9
// maze[6][8]=9
// maze[7][8]=9
// maze[8][8]=9
// maze[9][8]=9
// // maze[10][8]=9
// maze[11][8]=9
// maze[12][8]=9
// maze[13][8]=9
// maze[14][8]=9
// maze[15][8]=9
// maze[16][8]=9
// maze[17][8]=9
//
// let start = new Point(2,5)
// let end = new Point(15,12)
// let result = findPath(start,end,false)
// console.log('result',result)
//
// let list:Array<Point> = []
// flatResult(result as any,list)
//
// list.forEach(e=>{
//   maze[e.X][e.Y] = 1
// })
// console.log(list.length)
// console.log(maze)
