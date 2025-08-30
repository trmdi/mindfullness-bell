import { getVar, resetTimer, debug } from './utils.js';

async function ensureOffscreen() {
  if (await chrome.offscreen.hasDocument()) return;

  await chrome.offscreen.createDocument({
    url: "../views/offscreen.html",
    reasons: ["AUDIO_PLAYBACK"],
    justification: "for playing sound"
  });
}

function sendNotification() {
  const getMsg = chrome.i18n.getMessage;
  const id = 'MindfullnessBell';
  chrome.notifications.clear(id);
  chrome.notifications.create(id, {
    'type': 'basic',
    'iconUrl': '../icons/icon.png',
    'title': getMsg('BellNotificationTitle'),
    'message': getMsg('BellNotificationMsgIn') + '\n' + getMsg('BellNotificationMsgOut'),
    'silent': true
  });
}

async function inviteBell() {
  await ensureOffscreen();
  chrome.runtime.sendMessage({'target': 'offscreen', 'inviteBell': true});
}

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.target !== '*' && message.target !== 'background') return;
  console.log(message);

  if (message.inviteBell) {
    inviteBell();
  } else if (message.hasOwnProperty('getVar')) {
    (async () => {
      sendResponse(await getVar(message.getVar));
    })();
    return true;
  } else if (message.hasOwnProperty('ringing') && message.ringing === false) {
    resetTimer();
  } else if (message.sendNotification) {
    sendNotification();
  }
});

chrome.alarms.onAlarm.addListener((alarm) => {
  if (alarm.name === 'bell') {
    (async () => {
      const { timer } = await getVar(['timer']);
      if (Date.now() >= timer) {
        console.log('alarm inviteBell()');
        inviteBell();
      }
    })();
  }
});

chrome.runtime.onInstalled.addListener(() => {
  chrome.alarms.create('bell', {
    'delayInMinutes': 0,
    'periodInMinutes': 1
  });
});
