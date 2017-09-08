export const sequencerGrid = [];
for (let i = 0; i < 16; i++) {
  sequencerGrid.push([false, false, false, false])
}

const audioCtx = new (window.AudioContext || window.webkitAudioContext)();

export const analyser = audioCtx.createAnalyser();

analyser.fftSize = 256;
const bufferLength = analyser.frequencyBinCount;
analyser.connect(audioCtx.destination);


const sampleURLs = [
  'assets/samples/BT0A0D0.WAV',
  'assets/samples/ST0T0S7.WAV',
  'assets/samples/HHCD0.WAV',
  'assets/samples/HANDCLP1.WAV'
]

const getSample = (idx) => {
  const source = audioCtx.createBufferSource();
  const request = new XMLHttpRequest();

    request.open('GET', sampleURLs[idx], true);

    request.responseType = 'arraybuffer';

    request.onload = function() {
      const audioData = request.response;

      audioCtx.decodeAudioData(audioData, function(buffer) {
          source.buffer = buffer;
          source.connect(analyser);
          source.start(0);
        },

        function(e){ console.log("Error with decoding audio data" + e.err); });
    }

    request.send();
}

let currentCol = 0;

const getGrid = () => sequencerGrid;

setInterval( () => {
  const row = getGrid()[currentCol];
  if (row[0] === true) getSample(0);
  if (row[1] === true) getSample(1);
  if (row[2] === true) getSample(2);
  if (row[3] === true) getSample(3);
  currentCol = (currentCol + 1) % 16;
}, 125);
