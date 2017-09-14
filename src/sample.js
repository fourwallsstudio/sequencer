export const drumSequencerGrid = [];
export const musicSequencerGrid = [];

for (let row = 0; row < 4; row++) {
  const dRow = [];
  const mRow = [];
  for (let col = 0; col < 16; col++) {
    dRow.push(false);
    mRow.push(false);
  }
  drumSequencerGrid.push(dRow);
  musicSequencerGrid.push(mRow);
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
  'assets/samples/seq.wav',
  'assets/samples/synth_short.wav',
  'assets/samples/pad.wav',
  'assets/samples/bass.wav',
]

const getSample = (url) => {
  return new Promise((resolve, reject) => {
    const request = new XMLHttpRequest();
    request.open('GET', url, true);
    request.responseType = 'arraybuffer';
    request.onload = () => resolve(request.response);
    request.onerror = e => reject(e);
    request.send();
  })
}

const decodeAudio = (audioData) => {
  return new Promise((resolve, reject) => {
    audioCtx.decodeAudioData(
      audioData,
      buffer => resolve(buffer),
      e => reject(e.err)
    )
  })
}

let sampleArrayBuffers;
let samplePromises = sampleURLs
  .map( url => getSample(url)
  .then( audioData => decodeAudio(audioData) ));

Promise.all(samplePromises).then( buffers => sampleArrayBuffers = buffers );


const playSample = (idx) => {
  const source = audioCtx.createBufferSource();
  source.buffer = sampleArrayBuffers[idx];
  source.connect(analyser);
  source.start(0);
};


let currentCol = 0;
export const getCurrentCol = () => currentCol;
const getDrumGrid = () => drumSequencerGrid;
const getMusicGrid = () => musicSequencerGrid;

setInterval( () => {
  const drumRow = getDrumGrid();
  const musicRow = getMusicGrid();

  for (let i = 0; i < 4; i++) {
    if (drumRow[i][currentCol] === true) playSample(i);
    if (musicRow[i][currentCol] === true) playSample(i + 4);
  }

  currentCol = (currentCol + 1) % 16;
}, 125);
