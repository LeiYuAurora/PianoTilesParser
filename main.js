
const noteBuffers = {}

function loadNotes(audioSrc) {
  notify.success('获取音频')
//const notes = []
let loadAmount = 0
// AudioContext
const audioContext = new AudioContext();
// 基于src地址获得 AudioBuffer 的方法
const getAudioBuffer = (src) => {
  src ||= 'mute'
  if (noteBuffers[src]) {
    loadAmount++
    if (loadAmount === appeard.length) play()
    return
  }
  fetch(`./piano/${src}.mp3`)
  .then(resource => resource.arrayBuffer())
  .then(buffer => {
    audioContext.decodeAudioData(buffer, function(audioBuffer) {
      noteBuffers[src] = audioBuffer
      loadAmount++
      if (loadAmount === appeard.length) play()
    })
  })
}

const appeard = ['mute']


const clipAudio = (arrBuffer, duration) => {
  const audioBuffer = arrBuffer
  // 声道数量和采样率
var channels = audioBuffer.numberOfChannels;
var rate = audioBuffer.sampleRate;

// 截取前3秒
var startOffset = 0;
var endOffset = rate * duration;
// 3秒对应的帧数
var frameCount = endOffset - startOffset;

// 创建同样采用率、同样声道数量，长度是前3秒的空的AudioBuffer
var newAudioBuffer = new AudioContext().createBuffer(channels, endOffset - startOffset, rate);
// 创建临时的Array存放复制的buffer数据
var anotherArray = new Float32Array(frameCount);
// 声道的数据的复制和写入
var offset = 0;
for (var channel = 0; channel < channels; channel++) {
    audioBuffer.copyFromChannel(anotherArray, channel, startOffset);
    newAudioBuffer.copyToChannel(anotherArray, channel, offset);
}
  return newAudioBuffer
}

// 拼接音频的方法
const concatAudio = (arrBufferList) => {
    // 获得 AudioBuffer
    const audioBufferList = arrBufferList;
    // 最大通道数
    const maxChannelNumber = Math.max(...audioBufferList.map(audioBuffer => audioBuffer.numberOfChannels));
    // 总长度
    const totalLength = audioBufferList.map((buffer) => buffer.length).reduce((lenA, lenB) => lenA + lenB, 0)
    // 创建一个新的 AudioBuffer
    const newAudioBuffer = audioContext.createBuffer(maxChannelNumber, totalLength, audioBufferList[0].sampleRate);
    // 将所有的 AudioBuffer 的数据拷贝到新的 AudioBuffer 中
    let offset = 0;

    audioBufferList.forEach((audioBuffer, index) => {
        for (let channel = 0; channel < audioBuffer.numberOfChannels; channel++) {
            newAudioBuffer.getChannelData(channel).set(audioBuffer.getChannelData(channel), offset);
        }

        offset += audioBuffer.length;
    });

    return newAudioBuffer;
}

// 合并音频的方法
const mergeAudio = (arrBufferList) => {
  // 获得 AudioBuffer
  const audioBufferList = arrBufferList;
  // 最大播放时长
  const maxDuration = Math.max(...audioBufferList.map(audioBuffer => audioBuffer.duration));
  // 最大通道数
  const maxChannelNumber = Math.max(...audioBufferList.map(audioBuffer => audioBuffer.numberOfChannels));
  // 创建一个新的 AudioBuffer
  const newAudioBuffer = audioContext.createBuffer(maxChannelNumber, audioBufferList[0].sampleRate * maxDuration, audioBufferList[0].sampleRate);
  // 将所有的 AudioBuffer 的数据合并到新的 AudioBuffer 中
  audioBufferList.forEach((audioBuffer, index) => {
    for (let channel = 0; channel < audioBuffer.numberOfChannels; channel++) {
      const outputData = newAudioBuffer.getChannelData(channel);
      const bufferData = audioBuffer.getChannelData(channel);

      for (let i = audioBuffer.getChannelData(channel).length - 1; i >= 0; i--) {
        outputData[i] += bufferData[i];
      }

      newAudioBuffer.getChannelData(channel).set(outputData);
    }
  });

  return newAudioBuffer;
}

audioSrc.forEach((n, o) => n.forEach((s, i) => {
  if (!Array.isArray(s[0])) s[0] = [s[0]]
  s[0].map((u, c) => !appeard.includes(u) && appeard.push(u))
}))

appeard.forEach(v => getAudioBuffer(v))

function play() {
  const notes = audioSrc.map(v => v.map(s => s[0].map(u => noteBuffers[u])
    ))
  const noteBuffer = mergeAudio(notes.map((n, o) => concatAudio(n.map((v, i) => clipAudio(mergeAudio(v), audioSrc[o][i][1])))))
  const source = audioContext.createBufferSource()
  source.buffer = noteBuffer
  source.connect(audioContext.destination)
  source.start()
}
}
const THE_LIGHT_OF_STARS = [
  [
    [['a1', 'a'], 1.5],
    [['b1', 'b'], 1.5],
    [['a1', 'a'], 0.5],
    [['b1', 'b'], 0.5],
    [['_c2', '_c1'], 0.5],
    [['_f1', '_f'], 1.5],
    ['a1', 1.5],
    ['b1', 1.5],
    ['_c2', 0.5],
    ['d2', 0.5],
    ['e2', 0.5],
    ['d2', 0.5],
    ['_c2', 1/6],
    ['d2', 1/6],
    ['_c2', 1/6],
    ['b1', 0.5],
    ['a1', 1],
    ['e1', 0.5],
    ['b1', 1],
    ['a1', 0.5],
    ['d2', 1],
    ['_c2', 0.25],
    ['b1', 0.25],
    ['a1', 1.5],
    ['a1', 1],
    ['e1', 0.5],
    ['b1', 1],
    ['a1', 0.5],
    ['_c2', 2.5],
    ['e1', 0.5],
    ['a1', 1],
    ['e1', 0.5],
    ['b1', 1],
    ['a1', 0.5],
    ['d2', 1],
    ['_c2', 0.25],
    ['b1', 0.25],
    ['a1', 1.5],
    ['a1', 1],
    ['e1', 0.5],
    ['b1', 1],
    ['a1', 0.5],
    ['a1', 3]
  ],
    [
      ['_f', 0.5],
      ['a', 0.5],
      ['_c1', 0.5],
      ['e', 0.5],
      ['_g', 0.5],
      ['b', 0.5],
      ['a', 0.5],
      ['_c1', 0.5],
      ['e1', 0.5],
      ['_f', 0.5],
      ['b', 0.5],
      ['d1', 0.5]
    ]
]

function parse(text) {
  const data = JSON.parse(text)
  const _notes = []
  const musics = data.musics
  const restData = {
    Q: 8,
    R: 4,
    S: 2,
    T: 1,
    U: 0.5,
    V: 0.25,
    W: 0.125,
    X: 0.0625,
    Y: 0.03125
  }
      const noteData = {
    H: 8,
    I: 4,
    J: 2,
    K: 1,
    L: 0.5,
    M: 0.25,
    N: 0.125,
    O: 0.0625,
    P: 0.03125
  }
      const noteReg = /^(.+?)\[(.+?)\]$/
      const restReg = /^[QRSTUVWXY]+$/
  musics.forEach(music => {
    
    let bpm = music.bpm ?? data.baseBpm
    music.scores.forEach((track, i) => {
      _notes[i] ||= []
      const trackData = track.replace(/\d<(.+?)>/g, '$1').replace(/\{\d+\}/g, '').split(/,|;/).filter(v => v)
      trackData.forEach((_note, i2) => {
        if (noteReg.test(_note)) {
          const duration = RegExp.$2.split('').reduce((p, v) => p + noteData[v] * (60 / bpm), 0)
          const note = RegExp.$1.replace(/^\((.+)\)$/, '$1')
          const __note = note.split('~')
          __note.forEach((m, n, a) => m.split('@').forEach((p, q, r) => _notes[i].push([p.split('.').map(v => restData[v] ? 'mute' : v.replace('#', '_')), r.length === q + 1 ? (duration / a.length) * (1 - q / 32) : (duration / a.length) / 32])))
        } else if (restReg.test(_note)) {
          _notes[i].push([['mute'], _note.split('').reduce((p, v) => p + restData[v] * (60 / bpm), 0)])
        } else {
          console.warn(`未知的音符: ${_note}.`)
          return
        }
      })
    })
  })
  //console.log(_notes);
  loadNotes(_notes)
}


function load() {
  try {
    parse(document.querySelector('input').value)
  } catch (e) {
    notify.error(`错误: ${e}`)
  }
}

const notify = (function() {
  const template = document.createElement("div");
  template.classList.add("o-notification");
  const enterAnimation = "a-notification--enter";
  const leaveAnimation = "a-notification--leave";
  function showNotification(text, elClass, duration = 2000) {
    const el = template.cloneNode();
    el.textContent = text;
    el.classList.add(elClass, enterAnimation);
    const container = document.getElementById("notification-container");
    container.appendChild(el);
    let entered = false;
    function stopEnter() {
      if (entered) return;
      entered = true;
      el.classList.remove(enterAnimation);
    }
    setTimeout(() => stopEnter(), 500);
    let leaving = false;
    function leave() {
      if (leaving) return;
      leaving = true;
      stopEnter();
      el.classList.add(leaveAnimation);
      setTimeout(() => el.remove(), 500);
    }
    el.onclick = () => leave();
  }
  return {
    success: (text) => showNotification(text, "o-notification--success"),
    error: (text) => showNotification(text, "o-notification--error")
  };
}());

  audioBufferList.forEach((audioBuffer, index) => {
    for (let channel = 0; channel < audioBuffer.numberOfChannels; channel++) {
      const outputData = newAudioBuffer.getChannelData(channel);
      const bufferData = audioBuffer.getChannelData(channel);

      for (let i = audioBuffer.getChannelData(channel).length - 1; i >= 0; i--) {
        outputData[i] += bufferData[i];
      }

      newAudioBuffer.getChannelData(channel).set(outputData);
    }
  });

  return newAudioBuffer;
}
function play() {
  const notes = audioSrc.map(v => v.map(s => s[0].map(u => noteBuffers[u])
    ))
  const noteBuffer = mergeAudio(notes.map((n, o) => concatAudio(n.map((v, i) => clipAudio(mergeAudio(v), audioSrc[o][i][1])))))
  const source = audioContext.createBufferSource()
  source.buffer = noteBuffer
  source.connect(audioContext.destination)
  source.start()
}
}
function parse(text) {
  const data = JSON.parse(text)
  const _notes = []
  const musics = data.musics
  const restData = {
    Q: 8,
    R: 4,
    S: 2,
    T: 1,
    U: 0.5,
    V: 0.25,
    W: 0.125,
    X: 0.0625,
    Y: 0.03125
  }
      const noteData = {
    H: 8,
    I: 4,
    J: 2,
    K: 1,
    L: 0.5,
    M: 0.25,
    N: 0.125,
    O: 0.0625,
    P: 0.03125
  }
      const noteReg = /^(.+?)\[(.+?)\]$/
      const restReg = /^[QRSTUVWXY]+$/
  musics.forEach(music => {
    
    let bpm = music.bpm ?? data.baseBpm
    music.scores.forEach((track, i) => {
      _notes[i] ||= []
      const trackData = track.replace(/\d<(.+?)>/g, '$1').replace(/\{\d+\}/g, '').split(/,|;/).filter(v => v)
      trackData.forEach((_note, i2) => {
        if (noteReg.test(_note)) {
          const duration = RegExp.$2.split('').reduce((p, v) => p + noteData[v] * (60 / bpm), 0)
          const note = RegExp.$1.replace(/^\((.+)\)$/, '$1')
          const __note = note.split('~')
          __note.forEach((m, n, a) => m.split('@').forEach((p, q, r) => _notes[i].push([p.split('.').map(v => restData[v] ? 'mute' : v.replace('#', 'u')), r.length === q + 1 ? (duration / a.length) * (1 - q / 32) : (duration / a.length) / 32])))
        } else if (restReg.test(_note)) {
          _notes[i].push([['mute'], _note.split('').reduce((p, v) => p + restData[v] * (60 / bpm), 0)])
        } else {
          console.warn(`未知的音符: ${_note}.`)
          return
        }
      })
    })
  })
  //console.log(_notes);
  loadNotes(_notes)
}


function load() {
  try {
    parse(document.querySelector('input').value)
  } catch (e) {
    notify.error(`错误: ${e}`)
  }
}

const notify = (function() {
  const template = document.createElement("div");
  template.classList.add("o-notification");
  const enterAnimation = "a-notification--enter";
  const leaveAnimation = "a-notification--leave";
  function showNotification(text, elClass, duration = 2000) {
    const el = template.cloneNode();
    el.textContent = text;
    el.classList.add(elClass, enterAnimation);
    const container = document.getElementById("notification-container");
    container.appendChild(el);
    let entered = false;
    function stopEnter() {
      if (entered) return;
      entered = true;
      el.classList.remove(enterAnimation);
    }
    setTimeout(() => stopEnter(), 500);
    let leaving = false;
    function leave() {
      if (leaving) return;
      leaving = true;
      stopEnter();
      el.classList.add(leaveAnimation);
      setTimeout(() => el.remove(), 500);
    }
    el.onclick = () => leave();
  }
  return {
    success: (text) => showNotification(text, "o-notification--success"),
    error: (text) => showNotification(text, "o-notification--error")
  };
}());
