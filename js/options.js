function setLocalization() {
    var getI18nMsg = chrome.i18n.getMessage;
    
    document.title = getI18nMsg('bellTitle');
    $('#bellTitle').each(function(){
        this.innerHTML=getI18nMsg('bellTitle');
    });
    $('#bellUsePopupIcon').each(function(){
        this.innerHTML=getI18nMsg('bellUsePopupIcon');
    });
}

document.addEventListener('DOMContentLoaded', function () {
    setLocalization();
});
