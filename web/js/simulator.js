(function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
"use strict";

var _utils = require("./utils");

const main = () => {
  window.layerOneIpAddress = (0, _utils.getUrlVars)().layer1 ? (0, _utils.getUrlVars)().layer1 : 'localhost:3000';
  document.getElementById('layer1ip').innerText = window.layerOneIpAddress;
  var container = document.getElementById("jsoneditor");
  var editor = new JSONEditor(container, {});

  document.getElementById('btn1').onclick = () => {
    editor.set({
      txType: "gasTransfer",
      fromUserName: userName,
      toUserName: "user #0",
      amt: 15
    });
  };

  document.getElementById('btn2').onclick = () => {
    editor.set({
      txType: "newNodeJoinNeedRa",
      userName,
      depositAmt: 10,
      ipfsPeerId: "Will Be Added Automatically"
    });
  };

  document.getElementById('btn3').onclick = () => {
    editor.set({
      txType: 'setProofOfTrustForThisNode',
      psrData: 'placeholder',
      isHacked: true,
      tpmPublicKey: 'placeholder'
    });
  };

  document.getElementById('btn4').onclick = () => {
    editor.set({
      txType: "uploadLambda",
      lambdaName: "hello_world",
      dockerImg: "placeholder",
      payment: "payPerUse",
      ownerName: userName,
      amt: 2
    });
  };

  document.getElementById('btn5').onclick = () => {
    editor.set({
      txType: "computeTask",
      userName,
      lambdaCid: "PLEASE_REPLACE_THIS_VALUE_TO_THE_lambdaCid_YOU_GOT_FROM_PREVIOUS_uploadLambda_TASK",
      postSecData: 'placeholder',
      env: {
        network: 'totalIsolated',
        ipAllowed: 'none',
        p2pTrafficInAllowed: 'owner',
        resultSendBackTo: 'owner',
        errorSendBackTo: 'owner',
        osRequirement: "none",
        timeOut: '100',
        cleanUpAfter: 'totalWipeout'
      },
      executorRequirement: {
        credit: 3,
        deposit: 10
      },
      multiParties: 'none',
      depositAmt: 3
    });
  };

  document.getElementById('selectUser').onchange = () => {
    userName = document.getElementById('selectUser').value;
    document.getElementById('userName').innerHTML = userName;
  };

  document.getElementById('sendAction').onclick = async () => {
    //const userName = document.getElementById('userName').innerHTML;
    document.getElementById('initiatorResponse').innerHTML = "";
    document.getElementById('initiatorError').innerHTML = "";
    console.log("ready to send action,", JSON.stringify(editor.get(), null, 2));
    const jsonObj = editor.get();
    const warpper = {
      initiatorUserName: userName,
      action: jsonObj
    };
    const url = 'http://' + window.layerOneIpAddress + '/poc/action';
    console.log('url:', url);
    const response = await fetch(url, {
      method: 'POST',
      // *GET, POST, PUT, DELETE, etc.
      mode: 'cors',
      // no-cors, cors, *same-origin
      cache: 'no-cache',
      // *default, no-cache, reload, force-cache, only-if-cached
      credentials: 'omit',
      // include, *same-origin, omit
      headers: {
        'Content-Type': 'application/json' // 'Content-Type': 'application/x-www-form-urlencoded',

      },
      redirect: 'follow',
      // manual, *follow, error
      referrer: 'no-referrer',
      // no-referrer, *client
      body: JSON.stringify(warpper) // body data type must match "Content-Type" header

    });

    if (response.ok) {
      const result = await response.blob();
      document.getElementById('initiatorResponse').innerHTML = result;
    } else {
      document.getElementById('initiatorError').innerHTML = response.blob();
    }
  };

  document.getElementById('sendToTaskRoomDebug').onclick = async () => {
    const jsonObj = editor.get();
    const url = 'http://' + window.location.host + '/poc/debug';
    console.log('url:', url);
    const response = await fetch(url, {
      method: 'POST',
      // *GET, POST, PUT, DELETE, etc.
      mode: 'same-origin',
      // no-cors, cors, *same-origin
      cache: 'no-cache',
      // *default, no-cache, reload, force-cache, only-if-cached
      credentials: 'same-origin',
      // include, *same-origin, omit
      headers: {
        'Content-Type': 'application/json' // 'Content-Type': 'application/x-www-form-urlencoded',

      },
      redirect: 'follow',
      // manual, *follow, error
      referrer: 'no-referrer',
      // no-referrer, *client
      body: JSON.stringify(jsonObj) // body data type must match "Content-Type" header

    });

    if (response.ok) {
      const result = await response.blob();
      document.getElementById('initiatorResponse').innerHTML = result;
    } else {
      document.getElementById('initiatorError').innerHTML = response.blob();
    }
  };

  document.getElementById('showPeerMgr').onclick = () => {
    editor.set({
      txType: "debug_showPeerMgr"
    });
  };
};

document.addEventListener('DOMContentLoaded', main);

},{"./utils":2}],2:[function(require,module,exports){
"use strict";

exports.getUrlVars = () => {
  const vars = {};
  const decodedUri = decodeURI(window.location.href);
  const parts = decodedUri.replace(/[?&]+([^=&]+)=([^&]*)/gi, (m, key, value) => {
    vars[key] = value;
  });
  return vars;
};

exports.tryParseJson = s => {
  try {
    return JSON.parse(s);
  } catch (e) {
    return undefined;
  }
};

exports.logToWebPage = (log, json) => {
  const logEle = document.getElementById('log');
  const jsonBetterLooking = json ? '<pre><code>' + JSON.stringify(json, undefined, 2) + '</code></pre>' : '';
  const innerHtml = '<li>' + log + jsonBetterLooking + '</li>';
  logEle.innerHTML = innerHtml + logEle.innerHTML;
};

exports.updateLog = (type, opts) => {
  console.log(111, type, opts);
  $.ajax({
    url: '/poc/pot_log_update?type=' + type,
    type: 'post',
    data: opts || {}
  }).then(rs => {});
};

},{}]},{},[1])
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJ3ZWJTcmMvc2ltdWxhdG9yLmpzIiwid2ViU3JjL3V0aWxzLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBOzs7QUNBQTs7QUFDQSxNQUFNLElBQUksR0FBRyxNQUFJO0FBQ2YsRUFBQSxNQUFNLENBQUMsaUJBQVAsR0FBMkIseUJBQWEsTUFBYixHQUFzQix5QkFBYSxNQUFuQyxHQUE0QyxnQkFBdkU7QUFDQSxFQUFBLFFBQVEsQ0FBQyxjQUFULENBQXdCLFVBQXhCLEVBQW9DLFNBQXBDLEdBQWdELE1BQU0sQ0FBQyxpQkFBdkQ7QUFHQSxNQUFJLFNBQVMsR0FBRyxRQUFRLENBQUMsY0FBVCxDQUF3QixZQUF4QixDQUFoQjtBQUNBLE1BQUksTUFBTSxHQUFHLElBQUksVUFBSixDQUFlLFNBQWYsRUFBMEIsRUFBMUIsQ0FBYjs7QUFFQSxFQUFBLFFBQVEsQ0FBQyxjQUFULENBQXdCLE1BQXhCLEVBQWdDLE9BQWhDLEdBQTBDLE1BQUk7QUFDNUMsSUFBQSxNQUFNLENBQUMsR0FBUCxDQUFXO0FBQ1QsTUFBQSxNQUFNLEVBQUMsYUFERTtBQUVULE1BQUEsWUFBWSxFQUFFLFFBRkw7QUFHVCxNQUFBLFVBQVUsRUFBQyxTQUhGO0FBSVQsTUFBQSxHQUFHLEVBQUM7QUFKSyxLQUFYO0FBTUQsR0FQRDs7QUFRQSxFQUFBLFFBQVEsQ0FBQyxjQUFULENBQXdCLE1BQXhCLEVBQWdDLE9BQWhDLEdBQTBDLE1BQUk7QUFDNUMsSUFBQSxNQUFNLENBQUMsR0FBUCxDQUFXO0FBQ1QsTUFBQSxNQUFNLEVBQUMsbUJBREU7QUFFVCxNQUFBLFFBRlM7QUFHVCxNQUFBLFVBQVUsRUFBQyxFQUhGO0FBSVQsTUFBQSxVQUFVLEVBQUM7QUFKRixLQUFYO0FBTUQsR0FQRDs7QUFRQSxFQUFBLFFBQVEsQ0FBQyxjQUFULENBQXdCLE1BQXhCLEVBQWdDLE9BQWhDLEdBQTBDLE1BQUk7QUFDNUMsSUFBQSxN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RCxDQVBEOztBQVNBLE9BQU8sQ0FBQyxZQUFSLEdBQXdCLENBQUQsSUFBSztBQUMxQixNQUFHO0FBQ0QsV0FBTyxJQUFJLENBQUMsS0FBTCxDQUFXLENBQVgsQ0FBUDtBQUNELEdBRkQsQ0FHQSxPQUFNLENBQU4sRUFBUTtBQUNOLFdBQU8sU0FBUDtBQUNEO0FBQ0YsQ0FQRDs7QUFTQSxPQUFPLENBQUMsWUFBUixHQUF1QixDQUFDLEdBQUQsRUFBTSxJQUFOLEtBQWE7QUFDbEMsUUFBTSxNQUFNLEdBQUcsUUFBUSxDQUFDLGNBQVQsQ0FBd0IsS0FBeEIsQ0FBZjtBQUNBLFFBQU0saUJBQWlCLEdBQUcsSUFBSSxHQUFFLGdCQUFnQixJQUFJLENBQUMsU0FBTCxDQUFlLElBQWYsRUFBcUIsU0FBckIsRUFBZ0MsQ0FBaEMsQ0FBaEIsR0FBcUQsZUFBdkQsR0FBeUUsRUFBdkc7QUFDQSxRQUFNLFNBQVMsR0FBRyxTQUFTLEdBQVQsR0FBZSxpQkFBZixHQUFtQyxPQUFyRDtBQUNBLEVBQUEsTUFBTSxDQUFDLFNBQVAsR0FBbUIsU0FBUyxHQUFHLE1BQU0sQ0FBQyxTQUF0QztBQUNELENBTEQ7O0FBT0EsT0FBTyxDQUFDLFNBQVIsR0FBb0IsQ0FBQyxJQUFELEVBQU8sSUFBUCxLQUFjO0FBQ2hDLEVBQUEsT0FBTyxDQUFDLEdBQVIsQ0FBWSxHQUFaLEVBQWlCLElBQWpCLEVBQXVCLElBQXZCO0FBQ0EsRUFBQSxDQUFDLENBQUMsSUFBRixDQUFPO0FBQ0wsSUFBQSxHQUFHLEVBQUcsOEJBQTRCLElBRDdCO0FBRUwsSUFBQSxJQUFJLEVBQUcsTUFGRjtBQUdMLElBQUEsSUFBSSxFQUFHLElBQUksSUFBSTtBQUhWLEdBQVAsRUFJRyxJQUpILENBSVMsRUFBRCxJQUFNLENBQUUsQ0FKaEI7QUFLRCxDQVBEIiwiZmlsZSI6ImdlbmVyYXRlZC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzQ29udGVudCI6WyIoZnVuY3Rpb24oKXtmdW5jdGlvbiByKGUsbix0KXtmdW5jdGlvbiBvKGksZil7aWYoIW5baV0pe2lmKCFlW2ldKXt2YXIgYz1cImZ1bmN0aW9uXCI9PXR5cGVvZiByZXF1aXJlJiZyZXF1aXJlO2lmKCFmJiZjKXJldHVybiBjKGksITApO2lmKHUpcmV0dXJuIHUoaSwhMCk7dmFyIGE9bmV3IEVycm9yKFwiQ2Fubm90IGZpbmQgbW9kdWxlICdcIitpK1wiJ1wiKTt0aHJvdyBhLmNvZGU9XCJNT0RVTEVfTk9UX0ZPVU5EXCIsYX12YXIgcD1uW2ldPXtleHBvcnRzOnt9fTtlW2ldWzBdLmNhbGwocC5leHBvcnRzLGZ1bmN0aW9uKHIpe3ZhciBuPWVbaV1bMV1bcl07cmV0dXJuIG8obnx8cil9LHAscC5leHBvcnRzLHIsZSxuLHQpfXJldHVybiBuW2ldLmV4cG9ydHN9Zm9yKHZhciB1PVwiZnVuY3Rpb25cIj09dHlwZW9mIHJlcXVpcmUmJnJlcXVpcmUsaT0wO2k8dC5sZW5ndGg7aSsrKW8odFtpXSk7cmV0dXJuIG99cmV0dXJuIHJ9KSgpIiwiaW1wb3J0IHtnZXRVcmxWYXJzfSBmcm9tICcuL3V0aWxzJztcbmNvbnN0IG1haW4gPSAoKT0+e1xuICB3aW5kb3cubGF5ZXJPbmVJcEFkZHJlc3MgPSBnZXRVcmxWYXJzKCkubGF5ZXIxID8gZ2V0VXJsVmFycygpLmxheWVyMSA6ICdsb2NhbGhvc3Q6MzAwMCc7XG4gIGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdsYXllcjFpcCcpLmlubmVyVGV4dCA9IHdpbmRvdy5sYXllck9uZUlwQWRkcmVzcztcbiAgXG4gIFxuICB2YXIgY29udGFpbmVyID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJqc29uZWRpdG9yXCIpO1xuICB2YXIgZWRpdG9yID0gbmV3IEpTT05FZGl0b3IoY29udGFpbmVyLCB7fSk7XG5cbiAgZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ2J0bjEnKS5vbmNsaWNrID0gKCk9PntcbiAgICBlZGl0b3Iuc2V0KHtcbiAgICAgIHR4VHlwZTpcImdhc1RyYW5zZmVyXCIsXG4gICAgICBmcm9tVXNlck5hbWU6IHVzZXJOYW1lLFxuICAgICAgdG9Vc2VyTmFtZTpcInVzZXIgIzBcIiwgXG4gICAgICBhbXQ6MTVcbiAgICB9KVxuICB9XG4gIGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdidG4yJykub25jbGljayA9ICgpPT57XG4gICAgZWRpdG9yLnNldCh7XG4gICAgICB0eFR5cGU6XCJuZXdOb2RlSm9pbk5lZWRSYVwiLFxuICAgICAgdXNlck5hbWUsXG4gICAgICBkZXBvc2l0QW10OjEwLFxuICAgICAgaXBmc1BlZXJJZDpcIldpbGwgQmUgQWRkZWQgQXV0b21hdGljYWxseVwiXG4gICAgfSlcbiAgfTtcbiAgZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ2J0bjMnKS5vbmNsaWNrID0gKCk9PntcbiAgICBlZGl0b3Iuc2V0KHtcbiAgICAgIHR4VHlwZTonc2V0UHJvb2ZPZlRydXN0Rm9yVGhpc05vZGUnLFxuICAgICAgcHNyRGF0YToncGxhY2Vob2xkZXInLFxuICAgICAgaXNIYWNrZWQ6dHJ1ZSxcbiAgICAgIHRwbVB1YmxpY0tleToncGxhY2Vob2xkZXInXG4gICAgfSlcbiAgfTtcbiAgZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ2J0bjQnKS5vbmNsaWNrID0gKCk9PntcbiAgICBlZGl0b3Iuc2V0KHtcbiAgICAgIHR4VHlwZTpcInVwbG9hZExhbWJkYVwiLFxuICAgICAgbGFtYmRhTmFtZTpcImhlbGxvX3dvcmxkXCIsXG4gICAgICBkb2NrZXJJbWc6XCJwbGFjZWhvbGRlclwiLFxuICAgICAgcGF5bWVudDpcInBheVBlclVzZVwiLFxuICAgICAgb3duZXJOYW1lOnVzZXJOYW1lLFxuICAgICAgYW10OjJcbiAgICB9KTtcbiAgfTtcbiAgZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ2J0bjUnKS5vbmNsaWNrID0gKCk9PntcbiAgICBlZGl0b3Iuc2V0KHtcbiAgICAgIHR4VHlwZTpcImNvbXB1dGVUYXNrXCIsXG4gICAgICB1c2VyTmFtZSxcbiAgICAgIGxhbWJkYUNpZDpcIlBMRUFTRV9SRVBMQUNFX1RISVNfVkFMVUVfVE9fVEhFX2xhbWJkYUNpZF9ZT1VfR09UX0ZST01fUFJFVklPVVNfdXBsb2FkTGFtYmRhX1RBU0tcIixcbiAgICAgIHBvc3RTZWNEYXRhOidwbGFjZWhvbGRlcicsXG4gICAgICBlbnY6e1xuICAgICAgICBuZXR3b3JrOid0b3RhbElzb2xhdGVkJyxcbiAgICAgICAgaXBBbGxvd2VkOidub25lJyxcbiAgICAgICAgcDJwVHJhZmZpY0luQWxsb3dlZDonb3duZXInLFxuICAgICAgICByZXN1bHRTZW5kQmFja1RvOidvd25lcicsXG4gICAgICAgIGVycm9yU2VuZEJhY2tUbzonb3duZXInLFxuICAgICAgICBvc1JlcXVpcmVtZW50Olwibm9uZVwiLFxuICAgICAgICB0aW1lT3V0OicxMDAnLFxuICAgICAgICBjbGVhblVwQWZ0ZXI6J3RvdGFsV2lwZW91dCdcbiAgICAgIH0sXG4gICAgICBleGVjdXRvclJlcXVpcmVtZW50OntcbiAgICAgICAgY3JlZGl0OjMsXG4gICAgICAgIGRlcG9zaXQ6MTBcblxuICAgICAgfSxcbiAgICAgIG11bHRpUGFydGllczonbm9uZScsXG4gICAgICBkZXBvc2l0QW10OjNcbiAgICB9KTtcblxuICB9O1xuICBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnc2VsZWN0VXNlcicpLm9uY2hhbmdlID0gKCk9PntcbiAgICB1c2VyTmFtZSA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdzZWxlY3RVc2VyJykudmFsdWU7XG4gICAgZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ3VzZXJOYW1lJykuaW5uZXJIVE1MID0gdXNlck5hbWU7IFxuICB9XG4gIGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdzZW5kQWN0aW9uJykub25jbGljayA9IGFzeW5jICgpPT57XG4gICAgLy9jb25zdCB1c2VyTmFtZSA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCd1c2VyTmFtZScpLmlubmVySFRNTDtcbiAgICBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnaW5pdGlhdG9yUmVzcG9uc2UnKS5pbm5lckhUTUwgPSBcIlwiO1xuICAgIGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdpbml0aWF0b3JFcnJvcicpLmlubmVySFRNTCA9IFwiXCI7XG5cbiAgICBjb25zb2xlLmxvZyhcInJlYWR5IHRvIHNlbmQgYWN0aW9uLFwiLEpTT04uc3RyaW5naWZ5KGVkaXRvci5nZXQoKSwgbnVsbCwgMikpO1xuICAgIGNvbnN0IGpzb25PYmogPSBlZGl0b3IuZ2V0KCk7XG4gICAgY29uc3Qgd2FycHBlciA9IHtcbiAgICAgIGluaXRpYXRvclVzZXJOYW1lOiB1c2VyTmFtZSxcbiAgICAgIGFjdGlvbjpqc29uT2JqXG4gICAgfVxuICAgIGNvbnN0IHVybCA9ICdodHRwOi8vJyArIHdpbmRvdy5sYXllck9uZUlwQWRkcmVzcyArICcvcG9jL2FjdGlvbic7XG4gICAgY29uc29sZS5sb2coJ3VybDonLCB1cmwpO1xuICAgIGNvbnN0IHJlc3BvbnNlID0gYXdhaXQgZmV0Y2godXJsLCB7XG4gICAgICBtZXRob2Q6ICdQT1NUJywgLy8gKkdFVCwgUE9TVCwgUFVULCBERUxFVEUsIGV0Yy5cbiAgICAgIG1vZGU6ICdjb3JzJywgLy8gbm8tY29ycywgY29ycywgKnNhbWUtb3JpZ2luXG4gICAgICBjYWNoZTogJ25vLWNhY2hlJywgLy8gKmRlZmF1bHQsIG5vLWNhY2hlLCByZWxvYWQsIGZvcmNlLWNhY2hlLCBvbmx5LWlmLWNhY2hlZFxuICAgICAgY3JlZGVudGlhbHM6ICdvbWl0JywgLy8gaW5jbHVkZSwgKnNhbWUtb3JpZ2luLCBvbWl0XG4gICAgICBoZWFkZXJzOiB7XG4gICAgICAgICAgJ0NvbnRlbnQtVHlwZSc6ICdhcHBsaWNhdGlvbi9qc29uJyxcbiAgICAgICAgICAvLyAnQ29udGVudC1UeXBlJzogJ2FwcGxpY2F0aW9uL3gtd3d3LWZvcm0tdXJsZW5jb2RlZCcsXG4gICAgICB9LFxuICAgICAgcmVkaXJlY3Q6ICdmb2xsb3cnLCAvLyBtYW51YWwsICpmb2xsb3csIGVycm9yXG4gICAgICByZWZlcnJlcjogJ25vLXJlZmVycmVyJywgLy8gbm8tcmVmZXJyZXIsICpjbGllbnRcbiAgICAgIGJvZHk6IEpTT04uc3RyaW5naWZ5KHdhcnBwZXIpLCAvLyBib2R5IGRhdGEgdHlwZSBtdXN0IG1hdGNoIFwiQ29udGVudC1UeXBlXCIgaGVhZGVyXG4gICAgfSk7XG4gICAgXG4gICAgaWYocmVzcG9uc2Uub2spIHtcbiAgICAgIGNvbnN0IHJlc3VsdCA9IGF3YWl0IHJlc3BvbnNlLmJsb2IoKVxuICAgIFxuICAgICAgZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ2luaXRpYXRvclJlc3BvbnNlJykuaW5uZXJIVE1MID0gcmVzdWx0O1xuICAgIH1cbiAgICBlbHNle1xuICAgICAgZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ2luaXRpYXRvckVycm9yJykuaW5uZXJIVE1MID0gcmVzcG9uc2UuYmxvYigpO1xuICAgIH1cblxuICAgIFxuICB9O1xuXG4gIGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdzZW5kVG9UYXNrUm9vbURlYnVnJykub25jbGljayA9IGFzeW5jICgpPT57XG4gICAgY29uc3QganNvbk9iaiA9IGVkaXRvci5nZXQoKTtcbiAgICBjb25zdCB1cmwgPSAnaHR0cDovLycgKyB3aW5kb3cubG9jYXRpb24uaG9zdCArICcvcG9jL2RlYnVnJztcbiAgICBjb25zb2xlLmxvZygndXJsOicsIHVybCk7XG4gICAgY29uc3QgcmVzcG9uc2UgPSBhd2FpdCBmZXRjaCh1cmwsIHtcbiAgICAgIG1ldGhvZDogJ1BPU1QnLCAvLyAqR0VULCBQT1NULCBQVVQsIERFTEVURSwgZXRjLlxuICAgICAgbW9kZTogJ3NhbWUtb3JpZ2luJywgLy8gbm8tY29ycywgY29ycywgKnNhbWUtb3JpZ2luXG4gICAgICBjYWNoZTogJ25vLWNhY2hlJywgLy8gKmRlZmF1bHQsIG5vLWNhY2hlLCByZWxvYWQsIGZvcmNlLWNhY2hlLCBvbmx5LWlmLWNhY2hlZFxuICAgICAgY3JlZGVudGlhbHM6ICdzYW1lLW9yaWdpbicsIC8vIGluY2x1ZGUsICpzYW1lLW9yaWdpbiwgb21pdFxuICAgICAgaGVhZGVyczoge1xuICAgICAgICAgICdDb250ZW50LVR5cGUnOiAnYXBwbGljYXRpb24vanNvbicsXG4gICAgICAgICAgLy8gJ0NvbnRlbnQtVHlwZSc6ICdhcHBsaWNhdGlvbi94LXd3dy1mb3JtLXVybGVuY29kZWQnLFxuICAgICAgfSxcbiAgICAgIHJlZGlyZWN0OiAnZm9sbG93JywgLy8gbWFudWFsLCAqZm9sbG93LCBlcnJvclxuICAgICAgcmVmZXJyZXI6ICduby1yZWZlcnJlcicsIC8vIG5vLXJlZmVycmVyLCAqY2xpZW50XG4gICAgICBib2R5OiBKU09OLnN0cmluZ2lmeShqc29uT2JqKSwgLy8gYm9keSBkYXRhIHR5cGUgbXVzdCBtYXRjaCBcIkNvbnRlbnQtVHlwZVwiIGhlYWRlclxuICAgIH0pO1xuICAgIFxuICAgIGlmKHJlc3BvbnNlLm9rKSB7XG4gICAgICBjb25zdCByZXN1bHQgPSBhd2FpdCByZXNwb25zZS5ibG9iKCk7XG4gICAgXG4gICAgICBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnaW5pdGlhdG9yUmVzcG9uc2UnKS5pbm5lckhUTUwgPSByZXN1bHQ7XG4gICAgfVxuICAgIGVsc2V7XG4gICAgICBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnaW5pdGlhdG9yRXJyb3InKS5pbm5lckhUTUwgPSByZXNwb25zZS5ibG9iKCk7XG4gICAgfVxuXG4gIH1cbiAgZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ3Nob3dQZWVyTWdyJykub25jbGljayA9ICgpPT57XG4gICAgZWRpdG9yLnNldCh7XG4gICAgICB0eFR5cGU6XCJkZWJ1Z19zaG93UGVlck1nclwiXG4gICAgICBcbiAgICB9KVxuICB9O1xufTtcbmRvY3VtZW50LmFkZEV2ZW50TGlzdGVuZXIoJ0RPTUNvbnRlbnRMb2FkZWQnLCBtYWluKTtcblxuXG5cbiAgIiwiZXhwb3J0cy5nZXRVcmxWYXJzID0gKCk9PntcbiAgY29uc3QgdmFycyA9IHt9O1xuICBjb25zdCBkZWNvZGVkVXJpID0gZGVjb2RlVVJJKHdpbmRvdy5sb2NhdGlvbi5ocmVmKTtcbiAgY29uc3QgcGFydHMgPSBkZWNvZGVkVXJpLnJlcGxhY2UoL1s/Jl0rKFtePSZdKyk9KFteJl0qKS9naSwgKG0sa2V5LHZhbHVlKSA9PntcbiAgICAgIHZhcnNba2V5XSA9IHZhbHVlO1xuICB9KTtcbiAgcmV0dXJuIHZhcnM7XG59XG5cbmV4cG9ydHMudHJ5UGFyc2VKc29uID0gKHMpPT57XG4gIHRyeXtcbiAgICByZXR1cm4gSlNPTi5wYXJzZShzKTtcbiAgfVxuICBjYXRjaChlKXtcbiAgICByZXR1cm4gdW5kZWZpbmVkO1xuICB9XG59XG5cbmV4cG9ydHMubG9nVG9XZWJQYWdlID0gKGxvZywganNvbik9PntcbiAgY29uc3QgbG9nRWxlID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ2xvZycpO1xuICBjb25zdCBqc29uQmV0dGVyTG9va2luZyA9IGpzb24/ICc8cHJlPjxjb2RlPicgKyBKU09OLnN0cmluZ2lmeShqc29uLCB1bmRlZmluZWQsIDIpICsgJzwvY29kZT48L3ByZT4nIDogJyc7XG4gIGNvbnN0IGlubmVySHRtbCA9ICc8bGk+JyArIGxvZyArIGpzb25CZXR0ZXJMb29raW5nICsgJzwvbGk+JztcbiAgbG9nRWxlLmlubmVySFRNTCA9IGlubmVySHRtbCArIGxvZ0VsZS5pbm5lckhUTUw7XG59XG5cbmV4cG9ydHMudXBkYXRlTG9nID0gKHR5cGUsIG9wdHMpPT57XG4gIGNvbnNvbGUubG9nKDExMSwgdHlwZSwgb3B0cyk7XG4gICQuYWpheCh7XG4gICAgdXJsIDogJy9wb2MvcG90X2xvZ191cGRhdGU/dHlwZT0nK3R5cGUsXG4gICAgdHlwZSA6ICdwb3N0JyxcbiAgICBkYXRhIDogb3B0cyB8fCB7fVxuICB9KS50aGVuKChycyk9Pnt9KVxufVxuXG4iXX0=
