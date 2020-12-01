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


  </div>
</template>

<script lang="ts">
import { ref, reactive,toRaw } from 'vue'

export default {
  name: 'index',
  setup() {
    const width = 500
    const height = 500
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
      food.posX = posX
      food.posY = posY
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
        console.log(i)
        if (i===0){
          snakeBody[i].posX = shadowSnakeHead.posX
          snakeBody[i].posY = shadowSnakeHead.posY
        }else{
          snakeBody[i].posX = snakeBody[i-1].posX
          snakeBody[i].posY = snakeBody[i-1].posY
        }
      }
      console.log(snakeBody)
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
      //  38
      //37  39
      //  40
      if (Math.abs(direction-event.keyCode)!==2){
        direction = event.keyCode
        console.log('direction',direction)
      }
    }


    createSnake()
    createFood()

    setInterval(() => {
      moveSnake()

    }, 100)



    document.addEventListener('keydown', changeDirection)

    return {
      gridCountX,
      gridCountY,
      gridWidth,
      gridHeight,
      food,
      snake,
      snakeBody,
      moveSnake
    }
  }
}
</script>

<style scoped>
.game-wrap {
  width: 500px;
  height: 500px;
  background: black;
  position: fixed;
  left: 50%;
  transform: translate3d(-50%, 0, 0);
}

.grid {
  width: 10px;
  height: 10px;
  position: absolute;
  left: 0;
  top: 0;
  background: white;
  border: 1px solid #8c8c8c;
}

.food {
  background: dodgerblue;
  z-index: 999;
}

.snake {
  background: #ee151b;
  border: none;
  z-index: 999;
}
</style>
