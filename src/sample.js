export const drumSequencerGrid = [];

for (let row = 0; row < 4; row++) {
  const rowArr = [];
  for (let col = 0; col < 16; col++) {
    rowArr.push(false);
  }
  drumSequencerGrid.push(rowArr);
};

const audioCtx = new (window.AudioContext || window.webkitAudioContext)();

export const analyser = audioCtx.createAnalyser();
analyser.fftSize = 256;
const bufferLength = analyser.frequencyBinCount;
analyser.connect(audioCtx.destination);


const sampleURLs = [
  'assets/samples/HANDCLP1.WAV',
  'assets/samples/HHCD0.WAV',
  'assets/samples/ST0T0S7.WAV',
  'assets/samples/BT0A0D0.WAV',
]

const sampleArrayBuffers = [];

const getSample = (resolve, reject) => {
  const url = sampleURLs.shift();
  const request = new XMLHttpRequest();
  request.open('GET', url, true);
  request.responseType = 'arraybuffer';

  request.onload = () => {
    sampleArrayBuffers.push(request.response);
    resolve();
  };
  request.onerror = (e) => reject(e);

  request.send();
};

const decodeAudio = (resolve, reject) => {
  const audioData = sampleArrayBuffers.pop();

  audioCtx.decodeAudioData(audioData, (buffer) => {
      sampleArrayBuffers.push(buffer);
      resolve();
    },
    (e) => reject(e.err)
  )
}

new Promise(getSample)
  .then( () => new Promise(decodeAudio) )
  .then( () => new Promise(getSample) )
  .then( () => new Promise(decodeAudio) )
  .then( () => new Promise(getSample) )
  .then( () => new Promise(decodeAudio) )
  .then( () => new Promise(getSample) )
  .then( () => new Promise(decodeAudio) )


const playSample = (idx) => {
  const source = audioCtx.createBufferSource();
  source.buffer = sampleArrayBuffers[idx];
  source.connect(analyser);
  source.start(0);
};


let currentCol = 0;
export const getCurrentCol = () => currentCol;
const getDrumGrid = () => drumSequencerGrid;

setInterval( () => {
  const row = getDrumGrid();
  if (row[0][currentCol] === true) playSample(0);
  if (row[1][currentCol] === true) playSample(1);
  if (row[2][currentCol] === true) playSample(2);
  if (row[3][currentCol] === true) playSample(3);
  currentCol = (currentCol + 1) % 16;
}, 125);
