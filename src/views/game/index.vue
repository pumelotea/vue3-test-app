<template>
  <div class="game-wrap">

    <template v-for="x in gridCountX">
      <div class="grid" v-for="y in gridCountY"
           :style="{left:`${(x-1)*gridWidth}px`,top:`${(y-1)*gridHeight}px`}"></div>
    </template>

    <div v-if="food.posX>=0 && food.posY>=0"
         class="grid food"
         :style="{left:`${food.posX*gridWidth}px`,top:`${food.posY*gridHeight}px`}"
    >
    </div>
    <div v-if="snake.posX>=0 && snake.posY>=0"
         class="grid snake"
         :style="{left:`${snake.posX*gridWidth}px`,top:`${snake.posY*gridHeight}px`}"
    >
    </div>

    <div class="grid snake"
         v-for="body in snakeBody"
         :style="{left:`${body.posX*gridWidth}px`,top:`${body.posY*gridHeight}px`}"
    ></div>
    <div class="score-panel">
      <div>吃食物:{{snakeBodyLength}}</div>
    </div>

  </div>
</template>

<script lang="ts">
import { ref, reactive,toRaw,computed } from 'vue'
import {AStarFindPath,Point} from './AStarFindPath'
export default {
  setup() {
    const width = 200
    const height = 200
    const gridWidth = 10
    const gridHeight = 10
    const gridCountX = ref(width / gridWidth)
    const gridCountY = ref(height / gridHeight)
    let snakeBody:Array<any> = reactive([])
    let direction = 37 + Math.floor(Math.random() * 4)
    let food = reactive({ posX: -1, posY: -1 })
    let snake = reactive({ posX: -1, posY: -1 })
    let shadowSnakeHead = reactive({ posX: -1, posY: -1 })

    const createFood = () => {
      const posX = Math.floor(Math.random() * gridCountX.value)
      const posY = Math.floor(Math.random() * gridCountY.value)

      const list = []

      list.push(snake)
      list.push(...snakeBody)

      const exist = list.filter(e=>{
        return e.posX == posX && e.posY == posY
      }).length>0

      if (exist) {
        createFood()
      } else{
        food.posX = posX
        food.posY = posY
      }
    }

    const createSnake = () => {
      const posX = Math.floor(Math.random() * gridCountX.value)
      const posY = Math.floor(Math.random() * gridCountY.value)
      snake.posX = posX
      snake.posY = posY
    }

    const isGetFood = () => {
      return snake.posX === food.posX && snake.posY === food.posY
    }

    const eatFood = () => {
      snakeBody.push({posX:-1,posY:-1})
    }

    const refreshAllPos = () =>{
      if (snakeBody.length===0){
        return
      }

      if (snakeBody.length === 1){
        snakeBody[0].posX = shadowSnakeHead.posX
        snakeBody[0].posY = shadowSnakeHead.posY
        return
      }

      for (let i=snakeBody.length-1;i>=0;i--){
        if (i===0){
          snakeBody[i].posX = shadowSnakeHead.posX
          snakeBody[i].posY = shadowSnakeHead.posY
        }else{
          snakeBody[i].posX = snakeBody[i-1].posX
          snakeBody[i].posY = snakeBody[i-1].posY
        }
      }
    }


    const moveSnake = () => {
      shadowSnakeHead.posX = toRaw(snake).posX
      shadowSnakeHead.posY = toRaw(snake).posY
      switch (direction) {
          //左
        case 37:
          snake.posX -= 1
          break
          //右
        case 39:
          snake.posX += 1
          break
          //上
        case 38:
          snake.posY -= 1
          break
          //下
        case 40:
          snake.posY += 1
          break
      }

      const getFood = isGetFood()
      if (getFood){
        eatFood()
        createFood()
      }
      refreshAllPos()
    }

    const changeDirection = (event: any) => {
      autoPlayV2()
      //  38
      //37  39
      //  40
      if (Math.abs(direction-event.keyCode)!==2){
        direction = event.keyCode
      }
    }

    const snakeBodyLength = computed(()=>{
      return snakeBody.length
    })

    createSnake()
    createFood()


    //不考虑障碍物寻路
    const autoPlay = () => {
      const deltaX = snake.posX - food.posX
      const deltaY = snake.posY - food.posY

      shadowSnakeHead.posX = toRaw(snake).posX
      shadowSnakeHead.posY = toRaw(snake).posY
      if (Math.abs(deltaX)>0){
        snake.posX -= deltaX>0? 1:-1

      }else if (Math.abs(deltaY)>0){
        snake.posY -= deltaY>0? 1:-1
      }

      const getFood = isGetFood()
      if (getFood){
        eatFood()
        createFood()
      }
      refreshAllPos()
    }



    const autoPlayV2 = () => {
      let aStarFinder = new AStarFindPath()
      shadowSnakeHead.posX = toRaw(snake).posX
      shadowSnakeHead.posY = toRaw(snake).posY

      let obstruction:Array<Point> = []
      obstruction.push(... snakeBody.map(e=>new Point(e.posX,e.posY)))
      aStarFinder.initMaze(obstruction)
      // console.log(aStarFinder.maze)
      let res = aStarFinder.findPath(new Point(snake.posX,snake.posY),new Point(food.posX,food.posY),false)
      // console.log(res)
      let pointList:Array<Point> = []
      aStarFinder.flatResult(res as Point,pointList)
      // console.log(pointList)
      for (let i=0;i<pointList.length&&i<2;i++){
        snake.posX = pointList[i].X
        snake.posY = pointList[i].Y
      }

      const getFood = isGetFood()
      if (getFood){
        eatFood()
        createFood()
      }
      refreshAllPos()
    }



    setInterval(() => {
      autoPlayV2()
    }, 100)
    //
    // setInterval(() => {
    //   moveSnake()
    // }, 100)

    document.addEventListener('keydown', changeDirection)

    return {
      gridCountX,
      gridCountY,
      gridWidth,
      gridHeight,
      food,
      snake,
      snakeBody,
      snakeBodyLength
    }
  }
}
</script>

<style scoped>
.game-wrap {
  width: 200px;
  height:200px;
  background: black;
  position: fixed;
  left: 50%;
  transform: translate3d(-50%, 0, 0);
  box-sizing: border-box;
}

.grid {
  width: 10px;
  height: 10px;
  position: absolute;
  left: 0;
  top: 0;
  background: white;
  border: 1px solid #c3c2c2;
}

.food {
  background: dodgerblue;
  z-index: 999;
  animation: bling 1s infinite;
  border-radius: 50%;
  border: none;
}

.head {
  background: dodgerblue;
  z-index: 999;
  animation: bling 0.5s infinite;
}

.snake {
  background: #ee151b;
  border: none;
  z-index: 999;
  /*transition: all 200ms;*/
}

@keyframes bling
{
  0% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.5);
  }
  100% {
    transform: scale(1);
  }
}

.score-panel{
  position: fixed;
  top: 810px;
}

</style>
