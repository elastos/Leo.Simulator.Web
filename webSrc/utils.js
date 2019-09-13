import toastr from 'toastr';
import { generateKeyPair } from 'crypto';
exports.getUrlVars = ()=>{
  const vars = {};
  const decodedUri = decodeURI(window.location.href);
  const parts = decodedUri.replace(/[?&]+([^=&]+)=([^&]*)/gi, (m,key,value) =>{
      vars[key] = value;
  });
  return vars;
}

exports.tryParseJson = (s)=>{
  try{
    return JSON.parse(s);
  }
  catch(e){
    return undefined;
  }
}

exports.logToWebPage = (log, json)=>{
  const logEle = document.getElementById('log');
  const jsonBetterLooking = json? '<pre><code>' + JSON.stringify(json, undefined, 2) + '</code></pre>' : '';
  const innerHtml = '<li>' + log + jsonBetterLooking + '</li>';
  logEle.innerHTML = innerHtml + logEle.innerHTML;
}

exports.updateLog = (type, opts)=>{
  console.log(111, type, opts);
  $.ajax({
    url : '/poc/pot_log_update?type='+type,
    type : 'post',
    data : opts || {}
  }).then((rs)=>{})
}

exports.o = (type, ... messages) =>{
  toastr.options = {
    "closeButton": true,
    "debug": true,
    "newestOnTop": false,
    "progressBar": true,
    "positionClass": "toast-top-right",
    "preventDuplicates": true,
    "showDuration": "300",
    "hideDuration": "1000",
    "timeOut": "5000",
    "extendedTimeOut": "1000",
    "showEasing": "swing",
    "hideEasing": "linear",
    "showMethod": "fadeIn",
    "hideMethod": "fadeOut"
  }
  if(type == 'alert'){
    toastr.error(messages[1], messages[0]);
    return;
  }
  switch(type){
    case 'err':
    case 'error':
      console.error(...messages);
      toastr.error(messages[1], messages[0]);
      break;
    case 'info':
      toastr.info(messages[1], messages[0]);
      break;
    case 'log':
    case 'debug':
      console.log(...messages);
      
    case 'success':
      console.log(...messages);
      toastr.success(messages[1], messages[0]);
      break;
    case 'warning':
        console.log(...messages);
        toastr.warning(messages[1], messages[0]);
        break;
    default:
      console.log(...messages);
  }
};