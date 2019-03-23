<template>
  <div class = "congrats">
    <div class="done-text">
      <figure>
        <svg id="anim"
          xmlns="http://www.w3.org/2000/svg"
          xmlns:sodipodi="http://sodipodi.sourceforge.net/DTD/sodipodi-0.dtd"
          xmlns:inkscape="http://www.inkscape.org/namespaces/inkscape"
          viewBox="0 0 370 106"
          version="1.1">
          <g id="layer1" transform="translate(0,-191.16665)">
            <text
              xml:space="preserve" x="0" y="271">
              <tspan sodipodi:role="line" x="0" y="271">Dooone~</tspan>
            </text> 
          </g>
        </svg>
      </figure>
    </div>
    <div class="ghost">
      <div class="body">
          <div class="face">
            <div class="eye left"></div>
            <div class="eye right"></div>
            <div class="smile"></div>
            <div class="rosy left"></div>
            <div class="rosy right"></div>
          </div>
          <div class="bottom">
            <div></div>
            <div></div>
            <div></div>
            <div></div>
            <div></div>
          </div>
      </div>
      <div class="shadow"></div>
    </div>
  </div>
</template>

<script>
export default {
  
}
</script>

<style lang="scss" scoped>
.congrats{
  margin-top: 20px;
}

$white:rgb(250, 249, 232);
$cyan: #27ecd2;
.done-text {
  position:relative;
  user-select:none;
}

figure{
  width:500px;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
}

#anim text {
  font-size:10.5px;
  line-height:1.25;
  font-family:sans-serif;
  fill:$cyan;
  stroke:none;
  stroke-width:0.26;
}
#anim tspan{
  font-size:84.6px;
  font-family:Forte;-inkscape-font-specification:Forte;
  stroke:rgb(198, 184, 238); //rgb(205, 255, 240)
  stroke-width:2;

  stroke-dasharray:250; /*how long the dashes are*/
  stroke-dashoffset:250; /*how far they are spaced */
  animation: write 2s linear forwards;
}

@keyframes write {
  from {stroke-dashoffset:250;}
  to {stroke-dashoffset:0;}
}


$black:#272B24;
$shadow:rgba(186, 204, 201, 0.6);
$pink:rgb(255, 154, 107); //rgb(255, 107, 107)
.ghost {
  position: relative;  
  width:160px;
  height:180px;
  top: 70px;
  margin: 0 auto;
  
  .body {
      position: relative;
      
      width:160px;
      height:180px;
      border-top-right-radius:80px;
      border-top-left-radius:80px;
      
      background-color:$white;
      
      animation:float 4s ease infinite;
      .face {
        display:flex;
        flex-wrap:wrap;
        
        position: absolute;
        top:67px;
        left:37px;
        
        width:72px;
        height:41px;
        
        .eye {
            width:18px;
            height:18px;
            border-radius:100%;
            
            background-color:$black;
            &.left {
              margin-right:36px;
            }
        }
        .smile {
            margin-top:2px;
            margin-left:19px;
            width:36px;
            height:16px;
            
            border-bottom-left-radius:16px 12px;
            border-bottom-right-radius:16px 12px;
            border-top-left-radius:4px;
            border-top-right-radius:4px;
            
            background-color:$pink;
        }
        .rosy {
            position: absolute;
            top:28px;
            
            width:16px;
            height:10px;
            border-radius:100%;
            
            background-color:$cyan;
            &.left {
              left:-8px;
              transform:rotate(-8deg);
            }
            &.right {
              right:-9px;
              transform:rotate(8deg);
            }
        }
      }             
      
      .bottom {
        display:flex;
        position: absolute;
        top:100%;
        left:0px;
        right:-1px; //Shhhh
        
        div {
            flex-grow:1;
            position: relative;
            top:-14px;
            
            height:28px;
            border-radius:100%;
            
            background-color:$white;
            
            &:nth-child(2n) {
              top:-10px;
              
              margin:0 -2px;
              border-top:10px solid $white;
              
              background:transparent;
            }
        }
      }
  }
  .shadow {
      position: absolute;
      bottom:-80px;
      left:50%;
      
      width:200px;
      height:12px;
      border-radius:100%;
      
      background-color:$shadow;
      
      animation:shadow 4s ease infinite;
  }
}

@keyframes float {
   0%,100% {
      top:0px;
   }
   40% {
      top:-40px;
   }
}
@keyframes shadow {
   0%,100% {
      transform:translateX(-50%) scale(0.8);
   }
   40% {
      transform:translateX(-50%) scale(0.5);
   }
}
</style>


