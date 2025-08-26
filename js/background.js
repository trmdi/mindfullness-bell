// This script is to load data or initialize data
var isBellEnabled = true;
var nhatChuongDataLoaded = false;
var thinhChuongDataLoaded = false;
var nhatChuongBell = document.getElementById("nhatChuong");
var thinhChuongBell = document.getElementById("thinhChuong");
var time_space_option = 2;
var volume = 30;
var timer = 0; // this is the time remaining
var time_space = 3; //mins
var timer_str = '';
var volume = document.getElementById("volume").value;
var numbOfBells = 3;
var bell0timer = null; //storage for the timer objects
var bell1timer = null;
var bell2timer = null;
var bell3timer = null;
var HTMLver = getHtmlVer();
var isdebug = false;

var BellNotification = {
    type: "basic",
    iconUrl: "../icons/icon.png", // icon url - can be relative
    title: "Breathe, my dear...", // notification title
    message: "In  -  I know I am breathing in.\nOut  -  I know I am breathing out." // notification body text
};
function initBellNotification(){
    var getI18nMsg = chrome.i18n.getMessage;
    BellNotification.title=getI18nMsg('BellNotificationTitle');
    BellNotification.message=getI18nMsg('BellNotificationMsgIn')+"\n"+getI18nMsg('BellNotificationMsgOut');
}
var BellNotificationID = "BellNotification";

function setDataLoadedNhatChuong() {
    nhatChuongDataLoaded = true;
}

function setDataLoadedThinhChuong() {
    thinhChuongDataLoaded = true;
}

function invitebell() {

    resetTime();
    invitebell2();
    if (isBellEnabled) {
        chrome.notifications.create(BellNotificationID, BellNotification, function() {});
    }
}

function invitebell2() {
    clearTimeout(bell0timer);
    clearTimeout(bell1timer);
    clearTimeout(bell2timer);
    clearTimeout(bell3timer);

    if (isBellEnabled) {
        bell0timer = setTimeout(nhatchuong, 500);
        if (numbOfBells>0){
            bell1timer = setTimeout(thinhchuong, 5000);
            if (numbOfBells>1){
                bell2timer = setTimeout(thinhchuong, 15000);
                if (numbOfBells>2){
                    bell3timer = setTimeout(thinhchuong_last, 25000);
                }
            }
        }
    }
}

function nhatchuong() {
    if (isBellEnabled) {
        if (HTMLver >= 5) {
            nhatChuongBell.pause();
            thinhChuongBell.pause();
            nhatChuongBell.currentTime = 0;
            thinhChuongBell.currentTime = 0;
            nhatChuongBell.play();
        } else {
            var bell1 = '<embed id="MediaPlayer1" showcontrols="0" style="visibility:hidden" showstatusbar="0"';
            bell1 += ' autostart="true" src = "../bells/c3.mp3" controller="false" volume = "' + document.getElementById("volume").value * 0.5 + '%" SendPlayStateChangeEvents="true"';
            bell1 += ' SendOpenStateChangeEvents="true" height="0" style="height:0px;" ></embed>';
            document.getElementById("mediaContainer").innerHTML = bell1;
        }
    }
}

function thinhchuong() {
    if (isBellEnabled) {
        if (HTMLver >= 5) {
            nhatChuongBell.pause();
            thinhChuongBell.pause();
            nhatChuongBell.currentTime = 0;
            thinhChuongBell.currentTime = 0;
            thinhChuongBell.play();
        } else {
            var bell2 = '<embed id="MediaPlayer1" showcontrols="0" style="visibility:hidden" showstatusbar="0"';
            bell2 += ' autostart="true" src = "../bells/BellofMindfulness.mp3" controller="false" volume = "' + document.getElementById("volume").value + '" SendPlayStateChangeEvents="true"';
            bell2 += ' SendOpenStateChangeEvents="true" height="0" style="height:0px;"  repeat ="3"></embed>';
            document.getElementById("mediaContainer").innerHTML = bell2;
        }
    }
}
//this is the sound of the final bell
function thinhchuong_last() {
    if (isBellEnabled) {
        if (HTMLver >= 5) {
            nhatChuongBell.pause();
            thinhChuongBell.pause();
            nhatChuongBell.currentTime = 0;
            thinhChuongBell.currentTime = 0;
            thinhChuongBell.play();
        } else {
            var bell2 = '<embed id="MediaPlayer1" showcontrols="0" style="visibility:hidden" showstatusbar="0"';
            bell2 += ' autostart="true" src = "../bells/BellofMindfulness.mp3" controller="false" volume = "' + document.getElementById("volume").value + '" SendPlayStateChangeEvents="true"';
            bell2 += ' SendOpenStateChangeEvents="true" height="0" style="height:0px;"  repeat ="3"></embed>';
            document.getElementById("mediaContainer").innerHTML = bell2;
        }
    }
    chrome.notifications.clear(BellNotificationID, function() {});
}

//update the changes of time spacing between each invitation of the bell
function changeTimeSpace() {
    if (isdebug) {
        console.log('Background: changeTimeSpace is called');
    }
    if (document.getElementById("timespace").value > time_space) {
        time_space = document.getElementById("timespace").value;
        resetTime();
        return;
    }
    if (((time_space - document.getElementById("timespace").value) * 60 < timer) && (document.getElementById("timespace").value < time_space)) {
        timer -= (time_space - document.getElementById("timespace").value) * 60;
        time_space = document.getElementById("timespace").value;
    }

}

// this function is to read indicator of time space changes and make updates
function changeTimeSpace2() {
    if (isdebug) {
        console.log('Background: changeTimeSpace2 is called');
    }
    chrome.storage.local.get('timeSpaceOption', function(objs1) {
        if (objs1.timeSpaceOption >= 0) {
            time_space_option = objs1.timeSpaceOption;
            document.getElementById("timespace").selectedIndex = time_space_option;
            changeTimeSpace();
        }
    });
    if (isdebug) {
        console.log('Background: done changeTimeSpace2 is called');
    }
}

function updateTime() {

    chrome.storage.local.get('isBellEnabled', function(objs) {
        if (objs.isBellEnabled) {
            // this is like turning on from off state
            if (!isBellEnabled) {
                timer = 1;
                isBellEnabled = true;
            }
            timer--;
            writeTime();

            chrome.storage.local.set({
                'TimeRemain': timer
            }, function() {});

            chrome.storage.local.get('volumeChanged', function(objs) {
                if (isdebug) {
                    console.log('Background: Checking for volume change', objs);
                }
                if (objs.volumeChanged) {
                    changeVolume2();
                    if (isdebug) {
                        console.log("volume" + volume);
                    }
                    chrome.storage.local.set({
                        'volumeChanged': false
                    }, function() {
                        if (isdebug) {
                            console.log('Background: Saved volumeChanged to false');
                        }
                    });
                }
            });
            chrome.storage.local.get('numBellsChanged', function(objs) {
                if (isdebug) {
                    console.log('Background: Checking for number of bells change', objs);
                }
                if (objs.numBellsChanged) {
                    chrome.storage.local.get('numbOfBells',function(objs1){
                        numbOfBells = objs1.numbOfBells;
                        document.getElementById("numOfBells").selectedIndex = numbOfBells;
                    });
                    if (isdebug) {
                        console.log("volume" + volume);
                    }
                    chrome.storage.local.set(
                        {'numBellsChanged': false},
                        function() {
                            if (isdebug) {
                                console.log('Background: Saved numBellsChanged to false');
                            }
                        }
                    );
                }
            });

            chrome.storage.local.get('timeSpaceChanged', function(objs) {
                if (isdebug) {
                    console.log('Background: Checking for timeSpaceChanged', objs);
                }
                if (objs.timeSpaceChanged) {
                    changeTimeSpace2();
                    chrome.storage.local.set({
                        'timeSpaceChanged': false
                    }, function() {
                        if (isdebug) {
                            console.log('Background: Saved timeSpaceChanged to false');
                        }
                    });
                }
            });

            chrome.storage.local.get('doRingBell', function(objs) {
                if (objs.doRingBell) {
                    if (isdebug) {
                        console.log('Background: doRingBell', objs.doRingBell);
                    }
                    chrome.storage.local.set({
                        'doRingBell': false
                    }, function() {});
                    invitebell2();
                    chrome.notifications.create(BellNotificationID, BellNotification, function() {});
                }
            });

            if (timer <= 0) {
                invitebell();
            }
        } else {
            // turning off from on
            timer = 0;
            chrome.storage.local.set({
                'TimeRemain': timer
            }, function() {});
            chrome.browserAction.setBadgeText({
                text: 'OFF'
            });
            chrome.browserAction.setBadgeBackgroundColor({
                color: "#e56524"
            });
            if (isdebug) {
                console.log('Background: isBellEnabled: ', objs.isBellEnabled);
            }
        }
        isBellEnabled = objs.isBellEnabled;
    });

    //the reason for 2 invitebell call is that the get method storage doesn't fire in sync with the commands called
    setTimeout(updateTime, 1000);
}

function resetTime() {
    timer = time_space * 60;
}


function writeTime() {
    var timestr = '';
    var tempstr = '';
    timestr += '' + Math.floor(timer / 60);
    if (timestr.length == 1) timestr = '0' + timestr;
    timestr += ':';
    tempstr += timer % 60;
    if (tempstr.length == 1) tempstr = '0' + tempstr;
    timestr += tempstr;

    document.getElementById('timeleft').value = timestr;

    chrome.browserAction.setBadgeText({
        text: timestr
    });
    chrome.browserAction.setBadgeBackgroundColor({
        color: "#e56524"
    });
}

function changeVolume() {
    volume = document.getElementById("volume").value;
    document.getElementById("volume_txt").value = '' + document.getElementById("volume").value + '%';
    if (HTMLver >= 5) {
        nhatChuongBell.volume = document.getElementById("volume").value / 100;
        thinhChuongBell.volume = document.getElementById("volume").value / 100;
    }
}

function changeVolume2() {
    chrome.storage.local.get('volume', function(objs) {
        if (objs.volume >= 0) {
            volume = objs.volume;
            document.getElementById("volume").value = objs.volume;
            if (isdebug) {
                console.log('Background: Volume set to ' + volume);
            }
            changeVolume();
        }
    });

}

function setBellEnable() {
    isBellEnabled = document.getElementById("isBellEnabledSwitch").checked;
    if (isdebug) {
        console.log("Background: isBellEnabled: " + isBellEnabled)
    };
    if (isBellEnabled) {
        document.getElementById("onLayer").style.visibility = "visible";
        document.getElementById("onLayer").style.display = "block";
        document.getElementById("offLayer").style.visibility = "hidden";
        document.getElementById("offLayer").style.display = "none";
    } else {
        document.getElementById("offLayer").style.visibility = "visible";
        document.getElementById("offLayer").style.display = "block";
        document.getElementById("onLayer").style.visibility = "hidden";
        document.getElementById("onLayer").style.display = "none";
    }
    chrome.storage.local.set({
        'isBellEnabled': isBellEnabled
    }, function() {
        if (isdebug) {
            console.log('Background: Saved isBellEnabled');
        }
    });
}

function getHtmlVer() {
    var CName = navigator.appCodeName;
    var UAgent = navigator.userAgent;
    var HtmlVer = 0.0;
    // Remove start of string in UAgent upto CName or end of string if not found.
    UAgent = UAgent.substring((UAgent + CName).toLowerCase().indexOf(CName.toLowerCase()));
    // Remove CName from start of string. (Eg. '/5.0 (Windows; U...)
    UAgent = UAgent.substring(CName.length);
    // Remove any spaves or '/' from start of string.
    while (UAgent.substring(0, 1) == " " || UAgent.substring(0, 1) == "/") {
        UAgent = UAgent.substring(1);
    }
    // Remove the end of the string from first characrer that is not a number or point etc.
    var pointer = 0;
    while ("0123456789.+-".indexOf((UAgent + "?").substring(pointer, pointer + 1)) >= 0) {
        pointer = pointer + 1;
    }
    UAgent = UAgent.substring(0, pointer);

    if (!isNaN(UAgent)) {
        if (UAgent > 0) {
            HtmlVer = UAgent;
        }
    }
    return HtmlVer;
}

function updateData() {
    document.getElementById("isBellEnabledSwitch").checked = isBellEnabled;
    document.getElementById("offLayer").style.height = document.getElementById("onLayer").offsetHeight;
    document.getElementById("numOfBells").selectedIndex = numbOfBells;
    setBellEnable();

    changeTimeSpace2();
    changeVolume2();
    if (isdebug) {
        console.log('UpdateNow');
    }
}

function setLocalization() {
    var getI18nMsg = chrome.i18n.getMessage;
    
    document.title = getI18nMsg('bellTitle');
    $('#bellTitle').each(function(){
        this.innerHTML=getI18nMsg('bellTitle');
    });
    $('#RemainingTime').each(function(){
        this.innerHTML=getI18nMsg('RemainingTime');
        this.title = getI18nMsg('RemainingTime_Tooltip');
    });
    $('#TimeBetweenBells').each(function(){
        this.innerHTML=getI18nMsg('TimeBetweenBells');
        this.title = getI18nMsg('TimeBetweenBells_Tooltip');
    });
    $('#_5min_').each(function(){
        this.innerHTML=getI18nMsg('_5min_');
    });
    $('#_10min_').each(function(){
        this.innerHTML=getI18nMsg('_10min_');
    });
    $('#_15min_').each(function(){
        this.innerHTML=getI18nMsg('_15min_');
    });
    $('#_20min_').each(function(){
        this.innerHTML=getI18nMsg('_20min_');
    });
    $('#_30min_').each(function(){
        this.innerHTML=getI18nMsg('_30min_');
    });
    $('#_45min_').each(function(){
        this.innerHTML=getI18nMsg('_45min_');
    });
    $('#_60min_').each(function(){
        this.innerHTML=getI18nMsg('_60min_');
    });
    $('#VolumeLabel').each(function(){
        this.innerHTML=getI18nMsg('VolumeLabel');
        this.title = getI18nMsg('Volume_Tooltip');
    });
    $('#invitebell').each(function(){
        this.value=getI18nMsg('InviteBell');
    });
    $('#BellIsOff').each(function(){
        this.innerHTML=getI18nMsg('BellIsOff');
    });
    $('#BellOfMindfulnessPurpose').each(function(){
        this.innerHTML=getI18nMsg('BellOfMindfulnessPurpose');
    });
    $('#DesignCredit').each(function(){
        this.innerHTML=getI18nMsg('DesignCredit');
    });
    $('#ExtAuthor').each(function(){
        this.innerHTML=getI18nMsg('extAuthor');
    });
    $('#TranslateCredit').each(function(){
        this.innerHTML=getI18nMsg('TranslateCredit');
    });
    $('#InspirationTxt').each(function(){
        this.innerHTML=getI18nMsg('InspirationTxt');
    });
    $('#InspirationCredit').each(function(){
        this.innerHTML=getI18nMsg('InspirationCredit');
    });
    
    $('#isBellEnabledSwitch').each(function(){
        this.title = getI18nMsg('isBellEnabledSwitch_Tooltip');
        $(this).children().each(function(){
            this.title = getI18nMsg('isBellEnabledSwitch_Tooltip');
            $(this).children().each(function(){
                this.title = getI18nMsg('isBellEnabledSwitch_Tooltip');
            });
        });
    });
    $('#timeleft').each(function(){
        this.title = getI18nMsg('RemainingTime_Tooltip');
    });
    $('#timespace').each(function(){
        this.title = getI18nMsg('TimeBetweenBells_Tooltip');
    });
    $('#volume').each(function(){
        this.title = getI18nMsg('Volume_Tooltip');
    });
    $('#volume_txt').each(function(){
        this.title = getI18nMsg('Volume_Tooltip');
    });
    $('#invitebell').each(function(){
        this.title = getI18nMsg('InviteBell_Tooltip');
    });
    
    
}

function loadData() {

    var myvars = new Array();
    myvars[0] = 'timeSpaceOption';
    myvars[1] = 'volume';
    myvars[2] = 'isBellEnabled';
    myvars[3] = 'numbOfBells';

    //setBellEnable2();
    //chrome.storage.onChanged.addListener(updateData);
    try {
        chrome.storage.local.get(myvars, function(objs) {
            if (objs.timeSpaceOption == null) {
                chrome.storage.local.set({
                    'timeSpaceOption': time_space_option
                }, function() {
                    if (isdebug) {
                        console.log('Background: Saved time_space_option');
                    }
                });
            } else {
                time_space_option = objs.timeSpaceOption;
                if (isdebug) {
                    console.log('Background: timeSpaceOption', objs.timeSpaceOption);
                }
            }
            if (objs.numbOfBells == null || objs.numbOfBells<0) {
                chrome.storage.local.set({
                    'numbOfBells': numbOfBells
                }, function() {
                    if (isdebug) {
                        console.log('Background: Saved numbOfBells');
                    }
                });
            } else {
                numbOfBells = objs.numbOfBells;
                document.getElementById("numOfBells").selectedIndex = numbOfBells;
                if (isdebug) {
                    console.log('Background: numbOfBells', objs.numbOfBells);
                }
            }

            if (objs.volume == null) {
                chrome.storage.local.set({
                    'volume': volume
                }, function() {
                    if (isdebug) {
                        console.log('Background: Saved volume');
                    }
                });
            } else {
                volume = objs.volume;
                if (isdebug) {
                    console.log('Background: volume: ', objs.volume);
                }
            }

            if (objs.isBellEnabled == null) {
                chrome.storage.local.set({
                    'isBellEnabled': isBellEnabled
                }, function() {
                    if (isdebug) {
                        console.log('Background: Saved isBellEnabled');
                    }
                });
            } else {
                isBellEnabled = objs.isBellEnabled;
                if (isdebug) {
                    console.log('Background: isBellEnabled: ', isBellEnabled);
                }
            }
            updateData();
            initTimer();
        });
    } catch (err) {
        if (isdebug) {
            console.log('Background: Cannot get local storage');
        }
        chrome.storage.local.set({
            'timeSpaceOption': time_space_option
        }, function() {
            if (isdebug) {
                console.log('Background: Saved time_space_option');
            }
        });
        chrome.storage.local.set({
            'numbOfBells': numbOfBells
        }, function() {
            if (isdebug) {
                console.log('Background: Saved numbOfBells');
            }
        });
        chrome.storage.local.set({
            'volume': volume
        }, function() {
            if (isdebug) {
                console.log('Background: Saved volume');
            }
        });
        chrome.storage.local.set({
            'isBellEnabled': isBellEnabled
        }, function() {
            if (isdebug) {
                console.log('Background: Saved isBellEnabled');
            }
        });
    }
}

function playIt() {
    // keep on reloading data
    if (!(nhatChuongDataLoaded && nhatChuongDataLoaded)) {
        setTimeout(playIt, 100);
    } else {
        invitebell();
        updateTime();
    }
}

function initTimer() {
    chrome.storage.local.set({
        'timeSpaceChanged': false
    }, function() {
        if (isdebug) {
            console.log('Background: Set timeSpaceChanged to false');
        }
    });
    chrome.storage.local.set({
        'numBellsChanged': false
    }, function() {
        if (isdebug) {
            console.log('Background: Set numBellsChanged to false');
        }
    });
    chrome.storage.local.set({
        'doRingBell': false
    }, function() {
        if (isdebug) {
            console.log('Background: Set doRingBell to false');
        }
    });
    chrome.storage.local.set({
        'volumeChanged': false
    }, function() {
        if (isdebug) {
            console.log('Background: Set volumeChanged to false');
        }
    });
    if (HTMLver >= 5) {
        playIt();
    } else {
        invitebell();
        updateTime();
    }
}

document.addEventListener('DOMContentLoaded', function() {
    setLocalization();
    if (HTMLver >= 5) {
        nhatChuongBell.oncanplaythrough = setDataLoadedNhatChuong();
        thinhChuongBell.oncanplaythrough = setDataLoadedThinhChuong();
    }
    loadData();
});