
const canvasWidth = 960, canvasHeight = 540;
const lineColor = 'rgba(100,100,100)', hoveredLineColor= 'rgba(184,72,255)', 
  fadedLineColor = 'rgba(100,100,100,0.3)';

const cates = [{
    value: '1',
    label: 'Text'
  }, {
    value: '2',
    label: 'Arrow'
  }, {
    value: '3',
    label: 'Terminator'
  }, {
    value: '4',
    label: 'Data'
  }, {
    value: '5',
    label: 'Process'
  }, {
    value: '6',
    label: 'Decision'
  }
];

const modes = ['labeling', 'checking'];
const dbcheckText = ['Next', 'Download Labeled File'];

const filenamePost = 'annotation';

export default{
  canvasWidth, canvasHeight,
  lineColor, hoveredLineColor, fadedLineColor,
  cates, modes, dbcheckText,
  filenamePost
}