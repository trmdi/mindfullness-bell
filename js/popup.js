// This script is to load data or initialize data
var isBellEnabled = true;
var time_space_option = 2;
var volume = 30;

var timer = 0;
var time_space = 3; //mins
var timer_str = '';
var volume;
var numbOfBells = 3;

var HTMLver = getHtmlVer();	
var isdebug = false;

function invitebell(){
	chrome.storage.local.set({'doRingBell':true}, function(){ if (isdebug) {console.log('Pop-Up: Set to invite bell');}});
}

function changeTimeSpace(){
	time_space_option = document.getElementById("timespace").selectedIndex;
	chrome.storage.local.set({'timeSpaceOption': time_space_option}, function() {
		if (isdebug) {console.log('Pop-Up: Saved time_space_option');}
	});
	chrome.storage.local.set({'timeSpaceChanged': true}, function() {
		if (isdebug) {console.log('Pop-Up: Saved timeSpaceChanged');}
	});

}
function changeNumbOfBells(){
    numbOfBells = document.getElementById("numOfBells").selectedIndex;
	chrome.storage.local.set({'numbOfBells': numbOfBells}, function() {
		if (isdebug) {console.log('Pop-Up: Saved numbOfBells');}
	});
	chrome.storage.local.set({'numBellsChanged': true}, function() {
		if (isdebug) {console.log('Pop-Up: Saved numBellsChanged');}
	});
}
function updateTime(){

	chrome.storage.local.get('TimeRemain', function(objs){
		if(objs.TimeRemain != null){
			timer = objs.TimeRemain;
		}
	});
	writeTime();
	setTimeout(updateTime,100);
}
function resetTime(){
	timer = time_space*60;
}
function initTimer(){
	updateTime();
}
function writeTime(){
	var timestr = '';
	var tempstr = '';
	timestr += ''+ Math.floor(timer/60);
	if (timestr.length == 1) 
	timestr = '0' + timestr;
	timestr += ':'
	tempstr += timer%60;
	if (tempstr.length == 1)
	tempstr = '0' + tempstr;
	timestr += tempstr;
    $('#timeleft').each(function(){
        this.value = timestr;
    });
}
function changeVolume(){
	document.getElementById("volume_txt").value = '' + document.getElementById("volume").value + '%';
	volume = document.getElementById("volume").value;
	chrome.storage.local.set({'volume': volume}, function() {
		if (isdebug) {console.log('Pop-Up: Saved volume', volume);}
	});
	chrome.storage.local.set({'volumeChanged': true}, function() {
		if (isdebug) {console.log('Pop-Up: Saved volumeChanged');}
	});
}
function setBellEnable(){
	isBellEnabled = document.getElementById("isBellEnabledSwitch").checked;
	if (isdebug) {console.log("Background: isBellEnabled: " + isBellEnabled)};
	if (isBellEnabled){
        $('#onLayer').css('display','block');
        $('#offLayer').css('display','none');
	}else{
        $('#onLayer').css('display','none');
        $('#offLayer').css('display','block');
	}
	chrome.storage.local.set({'isBellEnabled': isBellEnabled}, function() {
		if (isdebug) {console.log('Background: Saved isBellEnabled');}
	});
}

function getHtmlVer(){
	var CName  = navigator.appCodeName;
	var UAgent = navigator.userAgent;
	var HtmlVer= 0.0;
	// Remove start of string in UAgent upto CName or end of string if not found.
	UAgent = UAgent.substring((UAgent+CName).toLowerCase().indexOf(CName.toLowerCase()));
	// Remove CName from start of string. (Eg. '/5.0 (Windows; U...)
	UAgent = UAgent.substring(CName.length);
	// Remove any spaves or '/' from start of string.
	while(UAgent.substring(0,1)==" " || UAgent.substring(0,1)=="/"){
		UAgent = UAgent.substring(1);
	}
	// Remove the end of the string from first characrer that is not a number or point etc.
	var pointer = 0;
	while("0123456789.+-".indexOf((UAgent+"?").substring(pointer,pointer+1))>=0){
		pointer = pointer+1;
	}
	UAgent = UAgent.substring(0,pointer);
	
	if(!isNaN(UAgent)){
		if(UAgent>0){
			HtmlVer=UAgent;
		}
	}
	return HtmlVer;
}



function updateData(){
	document.getElementById("timespace").selectedIndex = time_space_option;
    document.getElementById("numOfBells").selectedIndex = numbOfBells;
	document.getElementById("volume").value = volume;
	document.getElementById("volume_txt").value = '' + document.getElementById("volume").value + '%';
	document.getElementById("isBellEnabledSwitch").checked = isBellEnabled;
	document.getElementById('volume').onchange = changeVolume;
	document.getElementById('timespace').onchange = changeTimeSpace;
    document.getElementById('numOfBells').onchange = changeNumbOfBells;
	document.getElementById('invitebell').onclick = invitebell;
	document.getElementById('thichNhatHanh').onclick = invitebell;
	document.getElementById("isBellEnabledSwitch").onclick = setBellEnable;
	document.getElementById("offLayer").style.height = document.getElementById("onLayer").offsetHeight;
	setBellEnable();	
	if (isdebug) {console.log('UpdateNow');}
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
    $('#numOfBellsLabel').each(function(){
        this.innerHTML=getI18nMsg('NumOfBellsLabel');
        this.title = getI18nMsg('NumOfBells_Tooltip');
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
    
    $('#DonationTextH4').each(function(){
        this.innerHTML=getI18nMsg('DonationTextH4');
    });
    $('#DonationText').each(function(){
        this.innerHTML=getI18nMsg('DonationText');
    });
    $('#DonationButton').each(function(){
        this.value=getI18nMsg('DonationButton');
        this.title=getI18nMsg('DonationButton_Tooltip');
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
    $('#numbOfBells').each(function(){
        this.title = getI18nMsg('NumOfBells_Tooltip');
    });
}
function loadData(){

	var myvars = new Array();
	myvars[0] = 'timeSpaceOption';
	myvars[1] = 'volume';
	myvars[2] = 'isBellEnabled';
    myvars[3] = 'numbOfBells';
	
	chrome.storage.local.get(myvars, function(objs) {
		if (objs.timeSpaceOption == null){
			chrome.storage.local.set({'timeSpaceOption': time_space_option}, function() {
				if (isdebug) {console.log('POPUP: Saved time_space_option');}
			});
		}
		else{
			time_space_option = objs.timeSpaceOption;
			if (isdebug) {console.log('POPUP: timeSpaceOption',objs.timeSpaceOption);}
		}
		
		if (objs.volume == null){
			chrome.storage.local.set({'volume': volume}, function() {
				if (isdebug) {console.log('POPUP: Saved volume');}
			});
		}
		else{
			volume = objs.volume;
			if (isdebug) {console.log('POPUP: volume: ', objs.volume);}
		}
		
		if (objs.isBellEnabled == null){
			chrome.storage.local.set({'isBellEnabled': isBellEnabled}, function() {
				if (isdebug) {console.log('POPUP: Saved isBellEnabled');}
			});
		}
		else{
			isBellEnabled = objs.isBellEnabled;
			if (isdebug) {console.log('POPUP: isBellEnabled: ', isBellEnabled);}
		}
        if (objs.numbOfBells == null){
			chrome.storage.local.set({'numbOfBells': numbOfBells}, function() {
				if (isdebug) {console.log('POPUP: Saved numbOfBells');}
			});
		}
		else{
			numbOfBells = objs.numbOfBells;
			if (isdebug) {console.log('POPUP: numbOfBells',objs.numbOfBells);}
		}
		updateData();
		initTimer();
	});


}  
document.addEventListener('DOMContentLoaded', function () {
    setLocalization();
	loadData();
});
$('.DonationHidingButton').each(function(){
    this.onclick = function(){
        $('.DonationLayer').css('height','100px');
        $('.DonationLayer').css('min-height','100px');
        $('.DonationLayer').css('max-height','100px');
        setTimeout(function(){
            $(document.body).scrollTop($('#DonationButton').offset().top);
        },700);
    };
});
