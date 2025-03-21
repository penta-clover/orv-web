const audioContext = (stream: MediaStream) => {
  const audioContext = new AudioContext();
  const analyser = audioContext.createAnalyser();
  const microphone = audioContext.createMediaStreamSource(stream);
  microphone.connect(analyser);
  analyser.fftSize = 512;
  const bufferLength = analyser.frequencyBinCount;
  const dataArray = new Uint8Array(bufferLength);
  return { analyser, bufferLength, dataArray };
};
export default audioContext;
