import { debug } from './utils.js'

const nhatChuong = document.getElementById('nhatchuong');
const thinhChuong = document.getElementById('thinhchuong');

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
  const audio = {
    'nhatchuong': nhatChuong,
    'thinhchuong': thinhChuong
  };

  audio[type].pause();
  audio[type].currentTime = 0;

  audio[type].play();

  return new Promise((resolve, reject) => {
    setTimeout(() => {
      resolve();
    }, audio[type].duration * 1000);
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
  await inviteBell('nhatchuong');
  for (let i = 0; i < numbOfBells; i++) {
    await inviteBell('thinhchuong');
  }
  setRinging(false);
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
  }
});
