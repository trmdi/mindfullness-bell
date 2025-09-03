import { debug } from './utils.js'

const nhatChuong = document.getElementById('nhatchuong');
const thinhChuong = document.getElementById('thinhchuong');

let stopRequest = null;

async function getVar(request) {
  return new Promise((resolve, reject) => {
    chrome.runtime.sendMessage({'target': 'background', 'getVar': request}, (response) => {
      const err = chrome.runtime.lastError;
      if (err) {
        reject(err)
      } else {
        resolve(response);
      }
    });
  });
}

function setVolume(volume) {
  nhatChuong.volume = volume/100;
  thinhChuong.volume = volume/100;
}

function sendNotification() {
  chrome.runtime.sendMessage({'target': 'background', 'sendNotification': true});
}

async function inviteBell(type) {
  debug('inviteBell', type);
  const audio = {
    'nhatChuong': nhatChuong,
    'thinhChuong': thinhChuong
  }[type];

  await audio.play();

  return new Promise((resolve, reject) => {
    function cleanUp() {
      audio.removeEventListener('ended', onEnded);
      audio.removeEventListener('pause', onEnded);
      audio.pause();
      audio.currentTime = 0;
    }
    function onEnded() {
      cleanUp();
      resolve();
      debug(type, 'audio ended');
    }

    audio.addEventListener('ended', onEnded);
    audio.addEventListener('pause', onEnded);
  });
}

let ringing = false;
function setRinging(r) {
  ringing = r;
  chrome.runtime.sendMessage({'target': '*', 'ringing': r});
}

async function inviteBells() {
  if (ringing) return;

  const { volume, numbOfBells } = await getVar(['volume', 'numbOfBells']);

  sendNotification();
  setVolume(volume);

  setRinging(true);
  await inviteBell('nhatChuong');
  for (let i = 0; i < numbOfBells; i++) {
    if (stopRequest) {
      break;
    }
    await inviteBell('thinhChuong');
  }
  setRinging(false);
  stopRequest = null;
  debug('inviteBells ended');
}

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.target !== 'offscreen') return;

  if (message.inviteBell) {
    inviteBells();
  } else if (message.hasOwnProperty('setVolume')) {
    (async () => {
      setVolume((await getVar(['volume'])).volume);
    })();
  } else if (message.hasOwnProperty('getRinging')) {
    sendResponse({'ringing': ringing});
  } else if (message.stopBell) {
    stopRequest = true;
    nhatChuong.pause();
    thinhChuong.pause();
  }
});
