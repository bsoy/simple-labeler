export{Stroke, SketchPoint}

class Stroke {
  constructor(id) {
    this.id = id
    this.points = []    
    //this.cate = ''
  } 

  addPoint(point) {
    this.points.push(point);
  }
  getPoints(){
    return this.points;
  }
  getPoint(i){
    return this.points[i];
  }
  length(){
    let numOfPoints = this.points.Count;
    let len = 0;

    for (let i = 0; i < numOfPoints - 1; i++)
    {
        let point1 = this.getPoint(i), point2 = this.getPoint(i + 1);
        len += point1.dist(point2);
    }
    return len;
  }
  setCategory(cate){
    this.cate = cate;
  }
}

class SketchPoint{
  constructor(x, y){
    this.x=x;
    this.y=y;
    //this.strokeId=strokeId;
  }

  dist(p){
    let temp=Math.pow((p.x - this.x), 2) + Math.pow((p.y - this.y), 2);
    return Math.sqrt(temp);
  }
}