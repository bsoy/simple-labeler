<template>
  <div class="app">
    <div class="checker">
      <span>{{labeledNum}} / {{totalNum}}</span>
      <span class="tabs">
        <span 
          v-for="item in cates" 
          :key="item.value" 
          :class="curCheckingCate === item.value ? 'live':''"
          @click="showStrokesInCate(item.value)"
        >{{item.label}}</span>
        <span 
          :class="curCheckingCate === '' ? 'live':''"
          @click="showStrokesInCate('')"
        >NoLabel</span>
      </span>
    </div>
    <div class="mode">
      <span class="ctag">{{curMode}}</span>
      <span 
        :class="curMode === 'checking' ? 'icon-close-solid' : ''"
        @click="switchToLabelingMode"></span>
    </div>
    <div class="main">
      <vue-scroll>
      <el-popover
        ref="popover"
        trigger="manual"
        width="150"
        :style="popPos">
        <el-select v-model="selectVal" placeholder="Label it ~" @change="setLabel">
          <el-option
            v-for="item in cates"
            :key="item.value"
            :label="item.label"
            :value="item.value">
          </el-option>
        </el-select>
      </el-popover>  
      <canvas id="canvas" width="1920" height="1080">
        Canvas is not supported in your browser:( Please upgrade.
      </canvas> 
      </vue-scroll>
    </div>
    <div class="toolbar clearfix">
      <span class="tool">
        <span class="icon-zoom-out" @click = "zoom(-1)"></span>
        <span class="icon-zoom-in" @click = "zoom(1)"></span>
      </span>
      <button class="finish" @click = "finishLabeling">Finish</button>
    </div> 
    <canvas id="static-canvas" width="1200" height="675"></canvas>

    <el-dialog width="70%" center top="20px"
      :visible.sync="finishDialog">
      <div class="dbDialog">
        <div v-if="!isDbChecked" class="dbchecker">
          <h2 class="title">Double Checking</h2>
          <div class="staticWrapper">
            <vue-scroll>
            <img :src="canvasImg">
            </vue-scroll>
          </div>
          <el-steps :active="activeStep" finish-status="success" :align-center="true">
            <el-step 
              v-for="item in cates"
              :key="item.value"
              :title="item.label"
              @click.native="setActiveStep(item.value)">
            </el-step>
          </el-steps>
          <button @click="nextCheckStep" class="next">{{activeText}}</button>
        </div>
        <div v-else class="congrats">
          <Congrats />
          <div slot="footer" class="dialog-footer">
            <button class="done" @click="finishDialog = false">Done</button>
          </div>
        </div>        
      </div>      
    </el-dialog>   
  </div>
</template>

<script>
import {fabric} from 'fabric'
import X2JS from 'x2js'
import { saveAs } from 'file-saver';

import Congrats from './Congrats.vue'
import {Stroke, SketchPoint} from '../assets/js/sketchdata.js'
import _global from '../assets/js/global.js'

export default {
  name: "Canvas",
  data() {
    return {
      labeledNum: 0,
      totalNum: 0,

      sketch: [],
      minX: 0,
      minY: 0,
      fileNamePre: '',
      result: {},

      canvas: null,
      lastObjs: [],
      lastZoom: 1,

      cates: _global.cates,
      selectVal: '',
      popPos: {
        position: 'absolute',     
      },

      curMode: _global.modes[0],
      curCheckingCate: '-1',

      finishDialog: false,
      isDbChecked: false,
      staticCanvas: null,
      canvasImg: '', //the staticCanvas cant show, so add a canvasImg to help
      activeStep: 0,
      activeText: _global.dbcheckText[0],
    };
  },
  components: {
    Congrats
  },

  mounted() {
    this.initCanvas();
  },

  methods: {
    initCanvas(){
      if(this.canvas){
        this.lastObjs = this.canvas.getObjects();
        this.lastZoom = this.canvas.getZoom();
        this.canvas.dispose()
      }
      let canvas = this.canvas = new fabric.Canvas('canvas', {
        selectionColor: "rgb(112, 235, 219, 0.3)",
        selectionBorderColor:"rgb(0, 207, 180)", 
        selectionFullyContained: true,
        selectionKey: "ctrlKey",
        hoverCursor: "pointer",
      });
      let _proto = fabric.Object.prototype;
      _proto.transparentCorners = false;
      _proto.cornerStyle = "circle";
      _proto.cornerSize = 8;
      _proto.cornerColor = "rgb(112, 235, 219, 0.8)";
      _proto.borderColor = "rgb(0, 207, 180, 0.5)";
      _proto.lockUniScaling = true;
      _proto.lockRotation = true; 
      let controlPos = ['ml', 'mt', 'mr', 'mb', 'mtr']
      controlPos.forEach((pos)=>{
        _proto.setControlVisible(pos, false)
      })   

      canvas.on('dragover', this.allowDrop);
      canvas.on('drop', this.drop);

      canvas.on('mouse:over', this.onMouseOver);
      canvas.on('mouse:out', this.onMouseOut);

      canvas.on('mouse:dblclick', this.onMouseDbClick); // todo: change to contextmenu
      canvas.on('mouse:down', this.onMouseDown);
    },
    removeListenersFromCanvas(){
      //??
    },
    onMouseOver(e){
      if(e.target){
        e.target.set('stroke', _global.hoveredLineColor);
        this.canvas.renderAll();
      }
    },
    onMouseOut(e){
      if(e.target){
        e.target.set('stroke', _global.lineColor);
        this.canvas.renderAll();
      }
    },
    onMouseDbClick(e){
      if(this.canvas.getActiveObjects().length>0 && e.target){
        let tar = e.target
        let coorid = this.getTransformedCoorid(tar.left, tar.top)

        let post = 'px !important'
        this.popPos['top']=`${coorid.y}${post}`
        this.popPos['left']=`${coorid.x+tar.width*this.canvas.getZoom()}${post}`
        this.selectVal=''

        this.$forceUpdate()
        this.$refs.popover.doShow()
      }
    },
    onMouseDown(){
      this.$refs.popover.doClose()
      let activeObjs = this.canvas.getActiveObjects();
      if(activeObjs.length!=0){
        activeObjs.forEach((obj)=>{ //cancel the hovered color when selected
          obj.set('stroke', _global.lineColor);
        })
      }
    },

    redrawCanvas(){
      this.canvas.setZoom(this.lastZoom);
      this.lastObjs.forEach((obj)=>{
        this.canvas.add(obj)       
      })
    },

    setLabel(val){
      let activeObjs = this.canvas.getActiveObjects();
      let newLabeledNum = 0;
      activeObjs.forEach((item)=>{
        if(this.result[item.id]===''){
          newLabeledNum++;
        }
        this.result[item.id] = val;
      })
      this.labeledNum += newLabeledNum
    },
    showStrokesInCate(cate){
      if(this.curMode !== _global.modes[1]){
        this.switchToCheckingMode();
      }

      this.curCheckingCate = cate;
      this.setLineColorByCate(this.canvas, cate);
      this.canvas.renderAll();
    },
    switchToCheckingMode(){
      this.curMode = _global.modes[1];
      this.canvas.removeListeners();
    },

    switchToLabelingMode(){
      this.curMode = _global.modes[0];
      this.curCheckingCate = '-1';     
      // not sure how to remove listeners in fabric one by one, when switch to checking mode
      // so temporarily: dispose, reinit, redraw the canvas
      this.initCanvas();
      this.redrawCanvas();

      let objs = this.canvas.getObjects()
      objs.forEach((obj)=>{
        obj.set('stroke', _global.lineColor);
      })
      this.canvas.renderAll();
    },

    setLineColorByCate(canvas, cate){
      let objs = canvas.getObjects()
      Object.keys(this.result).forEach((key)=>{
        let path = objs.find((obj)=>{
          if(obj.id === key) return true
          else return false
        })

        if(this.result[key]===cate){
          path.set('stroke', _global.hoveredLineColor);
        }else{
          path.set('stroke', _global.fadedLineColor);
        }
      })
    },

    finishLabeling(){
      if(this.labeledNum == this.totalNum && this.totalNum != 0){
        // dbcheck dialog
        this.finishDialog = true;
        this.isDbChecked = false;
        this.activeStep = 0;
        this.activeText = _global.dbcheckText[0];

        // if generate dataURL by ori-canvas:
        //   need computing the ori-coorid
        //   not sure how to clone objs, so need recovering line color of ori-canvas
        // if create a new static canvas
        //   need to redraw the paths        
        this.setLineColorByCate(this.staticCanvas, String(this.activeStep+1));
        this.staticCanvas.renderAll();
        this.canvasImg = this.staticCanvas.toDataURL();
      }else{
        // not-completed message
        this.$message({
          message: 'Labeling is not completed.',
          type: 'warning',
          center: true,
        });
      }
    },
    nextCheckStep(){
      if(this.activeText === _global.dbcheckText[1]){
        // download result
        let resultStr = '';
        let cateList = [];
        _global.cates.forEach((cate)=>{
          cateList[parseInt(cate.value)] = cate.label;
        })
        Object.keys(this.result).forEach((key)=>{
          resultStr += `${key} ${cateList[this.result[key]]}\r\n`
        });
        var blob = new Blob([resultStr], {type: "text/plain;charset=utf-8"});
        saveAs(blob, `${this.fileNamePre}_${_global.filenamePost}.txt`);
                
        this.isDbChecked = true;
        // todo: close the dialog after 6 secs?
        return
      }
      this.activeStep++;
      this.checkConfirmText();      
    },
    setActiveStep(val){
      this.activeStep = parseInt(val) - 1;
      this.checkConfirmText(); // not correct in last step
    },
    checkConfirmText(){
      this.setLineColorByCate(this.staticCanvas, String(this.activeStep+1));
      this.staticCanvas.renderAll();
      this.canvasImg = this.staticCanvas.toDataURL();

      if(this.activeStep >= (this.cates.length-1)){
        this.activeText = _global.dbcheckText[1]
      }else{
        this.activeText = _global.dbcheckText[0]
      }
    },

    dragStart(){
      //e.dataTransfer.setData("text/xml", e.target.id);
    },
    allowDrop(opt){
      let e = opt.e;
      e.preventDefault();
      e.dataTransfer.dropEffect = "move";
    },
    drop(opt){
      let e = opt.e;
      e.preventDefault();
      this.sketch = [];
      this.result = {};
      this.labeledNum = 0;
      this.canvas.clear().renderAll();
      this.staticCanvas = new fabric.StaticCanvas('static-canvas');

      let files = e.dataTransfer.files;
      if(files.length === 0){
        return;
      }
      let file = files[0];
      let pres = file.name.split('_')
      this.fileNamePre = `${pres[0]}_${pres[1]}_${pres[2]}`;
      
      let jsonObj = null;
      let reader = new FileReader();     
      reader.onload=(e)=>{
        let x2js = new X2JS();
        jsonObj = x2js.xml2js(e.target.result);

        // save the sketch xml file to strokes
        // todo: if type not supported, use Message
        let traces = jsonObj.ink.trace;
        for(let i=0;i<traces.length;i++){
          let stroke = new Stroke(jsonObj.ink.trace[i]["_xml:id"]);
          this.result[stroke.id] = '';

          let pntStrs = traces[i].__text.split(', ');
          for(let j=0;j<pntStrs.length;j++){
            let pntStr=pntStrs[j].split(' ');
            stroke.addPoint(new SketchPoint(parseInt(pntStr[0]), parseInt(pntStr[1])));
          }
          this.sketch.push(stroke);                              
        }
        this.totalNum = this.sketch.length;  
        this.minX = this.getMinXInSketch();
        this.minY = this.getMinYInSketch();  
        this.draw();    
      }
      reader.readAsText(file);
    },
    draw() {
      for(let i=0;i<this.sketch.length;i++){
        this.canvas.add(this.getStrokePath(this.sketch[i]));
      }

      // todo: simplify
      for(let i=0;i<this.sketch.length;i++){
        let stroke = this.sketch[i];
        let firstPoint = this.initialTransform(stroke.getPoint(0));
        let pathStr = `M ${firstPoint.x} ${firstPoint.y} `;
        for(let j=1;j<stroke.points.length;j++){
          let point = this.initialTransform(stroke.getPoint(j));
          pathStr += `L ${point.x} ${point.y} `
        }
        let path = new fabric.Path(pathStr);
        path.set({fill: '', stroke: _global.lineColor});
        Object.defineProperty(path, 'id', {value: stroke.id})
        this.staticCanvas.add(path);
      }
    },
    getStrokePath(stroke){
      let firstPoint = this.initialTransform(stroke.getPoint(0));
      let pathStr = `M ${firstPoint.x} ${firstPoint.y} `;
      for(let j=1;j<stroke.points.length;j++){
        let point = this.initialTransform(stroke.getPoint(j));
        pathStr += `L ${point.x} ${point.y} `
      }
      let path = new fabric.Path(pathStr, {
        lockScalingX: true,
        lockScalingY: true,
        lockRotation: true,
        lockMovementX: true,
        lockMovementY: true,
        perPixelTargetFind: true,
        cornerSize: 5,
        cornerStyle: "circle",
      });
      path.set({fill: '', stroke: _global.lineColor});
      let controlPos = ['ml', 'mt', 'mr', 'mb', 'mtr']
      controlPos.forEach((pos)=>{
        path.setControlVisible(pos, false)
      })

      Object.defineProperty(path, 'id', {value: stroke.id}) //!:)
      return path;
    },

    zoom(sign){
      let zoom = this.canvas.getZoom();
      zoom += sign * 0.2;
      if(zoom > 4) zoom = 4;
      if(zoom < 0.1) zoom = 0.1;
      this.canvas.zoomToPoint(new fabric.Point(0, 0), zoom);
    },

    initialTransform(point){
      return new SketchPoint(
        (point.x-this.minX+50)/2, 
        (point.y-this.minY+50)/2
      );
    },
    initialTransform2(point){
      return new SketchPoint(
        point.x/2, 
        point.y/2
      );
    },
    getMinXInSketch(){
      let minX = Infinity;
      this.sketch.forEach((stroke)=>{
        stroke.points.forEach((point)=>{
          if(point.x<minX){
            minX = point.x;
          }
        })
      })
      return minX;
    },
    getMinYInSketch(){
      let minY = Infinity;
      this.sketch.forEach((stroke)=>{
        stroke.points.forEach((point)=>{
          if(point.y<minY){
            minY = point.y;
          }
        })
      })
      return minY;
    },

    getTransformedCoorid(ax, ay){
      let matrix = this.canvas.viewportTransform;
      let point = new fabric.Point(ax, ay);
      point.x = matrix[0]*ax+matrix[2]*ay+matrix[4];
      point.y = matrix[1]*ax+matrix[3]*ay+matrix[5];
      return point;
    }
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss" scoped>

.mode{
  height:26px;
  width: 80px;
  margin: 20px auto 0;

  position:relative;
}
@font-face {
  font-family: 'icomoon';
  src:  url('../assets/fonts/icomoon.eot?1wca01');
  src:  url('../assets/fonts/icomoon.eot?1wca01#iefix') format('embedded-opentype'),
    url('../assets/fonts/icomoon.ttf?1wca01') format('truetype'),
    url('../assets/fonts/icomoon.woff?1wca01') format('woff'),
    url('../assets/fonts/icomoon.svg?1wca01#icomoon') format('svg');
  font-weight: normal;
  font-style: normal;
}
[class^="icon-"], [class*=" icon-"] {
  /* use !important to prevent issues with browser extensions that change fonts */
  font-family: 'icomoon' !important;
  font-style: normal;
  font-weight: normal;
  font-variant: normal;
  text-transform: none;
  line-height: 1;

  /* Better Font Rendering =========== */
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;

  &:hover{
    cursor: pointer;
  }
  &:hover::before{
    color: rgb(5, 230, 200);
  }
}
.icon-close-solid{
  font-size: 10px;

  float: right;
}
.icon-close-solid:before {
  content: "\e902";
}
.icon-zoom-out, .icon-zoom-in{
  font-size: 25px;
}
.icon-zoom-out{
  margin-right: 10px;
}
.icon-zoom-out:before {
  content: "\e900";
}
.icon-zoom-in:before {
  content: "\e901";
}
.ctag {
  padding: 1px 4px;
  position: absolute;
  bottom: 0;
  left: 50%;
  transform: translateX(-50%);

  color: #fff;
  background-color: rgb(95, 95, 95);
}

.main {
  height: 600px;
  position:relative;

  overflow: auto;
}
#canvas {
  display: block;
  margin: 0px auto;

  background-color: #fff;
  background-image: url("data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSI0MCIgaGVpZ2h0PSI0MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTSAwIDEwIEwgNDAgMTAgTSAxMCAwIEwgMTAgNDAgTSAwIDIwIEwgNDAgMjAgTSAyMCAwIEwgMjAgNDAgTSAwIDMwIEwgNDAgMzAgTSAzMCAwIEwgMzAgNDAiIGZpbGw9Im5vbmUiIHN0cm9rZT0iI2UwZTBlMCIgb3BhY2l0eT0iMC4yIiBzdHJva2Utd2lkdGg9IjEiLz48cGF0aCBkPSJNIDQwIDAgTCAwIDAgMCA0MCIgZmlsbD0ibm9uZSIgc3Ryb2tlPSIjZTBlMGUwIiBzdHJva2Utd2lkdGg9IjEiLz48L3BhdHRlcm4+PC9kZWZzPjxyZWN0IHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiIGZpbGw9InVybCgjZ3JpZCkiLz48L3N2Zz4=");
}

@mixin hover {
  cursor: pointer;
  background-color: rgb(112, 235, 219);
}
.checker {
  padding: 15px 20px 5px;
  font-size: 1.4rem;
  vertical-align: middle;

  color: rgb(110, 110, 110);
  background: rgb(220, 220, 220);

  position: relative;
}
.tabs {
  position: absolute;
  right: 20px;

  & > span {
    padding: 3px 3px;
    margin: 0 3px;
    text-align: center;

    &:hover {
      @include hover;      
    }
  }
  .live{
    @include hover;
    border-bottom: 2px solid;
  }
}

button:hover{
  background: #24EBD1;
  cursor: pointer;
  color: #fff;
}
.toolbar{
  margin: 6px 0 5px 0;
  text-align: center;
  position: relative;
}
.tool{
  float: left;
}
.finish{
  float: right;
  position: relative;
  top: -6px;
}
.clearfix:after{
  display: block;
  content: "";
  clear: both;
}

#static-canvas{
  display: none;
}
.dbchecker{
  text-align: center;
  font-family: 'Raleway', sans-serif;
  .title{
    width: 50%;
    margin: 0 auto;
    position: relative;
    top: -30px;
  }
  .next{
    margin-top: 12px;
    width: 200px;
  }
}
.el-step__head:hover {
  color: #4ac0dd; //not work...
}
.congrats{
  height: 400px;
}
.dialog-footer{
  text-align: center;
}
.done{
  margin-top: 10px;
}

button, .ctag, .checker{
  user-select:none;
}

.staticWrapper{
  height: 450px;
  overflow: auto;
}
</style>
