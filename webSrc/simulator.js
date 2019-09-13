import {getUrlVars} from './utils';
import ipfsPubsub from './ipfsPubSub';
import simState from './simState';
import { utilities} from 'leo.simulator.shared';
const {o} = utilities;
const main = ()=>{
  window.simState = simState();

  window.layerOneIpAddress = getUrlVars().layer1 ? getUrlVars().layer1 : 'localhost:3000';
  document.getElementById('layer1ip').innerText = window.layerOneIpAddress;
  document.getElementById('layer1PeerId').innerText = window.simState.getLayerOnePeerId();
  var container = document.getElementById("jsoneditor");
  var editor = new JSONEditor(container, {});
  var blockJsonEditContainer = document.getElementById("jsoneditorForBlock");
  var blockJsonEditor = new JSONEditor(blockJsonEditContainer, {});

  document.getElementById('btn1').onclick = ()=>{
    const userName = document.getElementById('userName').value.trim();
   
    editor.set({
      txType:"gasTransfer",
      fromUserName: userName,
      toUserName:"user #0", 
      amt:15
    })
  }
  document.getElementById('btn2').onclick = ()=>{
    const userName = document.getElementById('userName').value.trim();
    editor.set({
      txType:"newNodeJoinNeedRa",
      userName,
      depositAmt:10,
      ipfsPeerId:"Will Be Added Automatically"
    })
  };
  document.getElementById('btn3').onclick = ()=>{
    editor.set({
      txType:'setProofOfTrustForThisNode',
      psrData:'placeholder',
      isHacked:true,
      tpmPublicKey:'placeholder'
    })
  };
  document.getElementById('btn4').onclick = ()=>{
    const userName = document.getElementById('userName').value.trim();
   
    editor.set({
      txType:"uploadLambda",
      lambdaName:"hello_world",
      dockerImg:"placeholder",
      payment:"payPerUse",
      ownerName:userName,
      amt:2
    });
  };
  document.getElementById('btn5').onclick = ()=>{
    const userName = document.getElementById('userName').value.trim();
   
    editor.set({
      txType:"computeTask",
      userName,
      lambdaCid:"PLEASE_REPLACE_THIS_VALUE_TO_THE_lambdaCid_YOU_GOT_FROM_PREVIOUS_uploadLambda_TASK",
      postSecData:'placeholder',
      env:{
        network:'totalIsolated',
        ipAllowed:'none',
        p2pTrafficInAllowed:'owner',
        resultSendBackTo:'owner',
        errorSendBackTo:'owner',
        osRequirement:"none",
        timeOut:'100',
        cleanUpAfter:'totalWipeout'
      },
      executorRequirement:{
        credit:3,
        deposit:10

      },
      multiParties:'none',
      depositAmt:3
    });

  };
  
  document.getElementById('sendAction').onclick = async ()=>{
    const userName = document.getElementById('userName').value.trim();
    document.getElementById('initiatorResponse').innerHTML = "";
    document.getElementById('initiatorError').innerHTML = "";

    console.log("ready to send action,",JSON.stringify(editor.get(), null, 2));
    const jsonObj = editor.get();
    const warpper = {
      initiatorUserName: userName,
      action:jsonObj
    }
    const url = 'http://' + window.layerOneIpAddress + '/poc/action';
    console.log('url:', url);
    const response = await fetch(url, {
      method: 'POST', // *GET, POST, PUT, DELETE, etc.
      mode: 'cors', // no-cors, cors, *same-origin
      cache: 'no-cache', // *default, no-cache, reload, force-cache, only-if-cached
      credentials: 'omit', // include, *same-origin, omit
      headers: {
          'Content-Type': 'application/json',
          // 'Content-Type': 'application/x-www-form-urlencoded',
      },
      redirect: 'follow', // manual, *follow, error
      referrer: 'no-referrer', // no-referrer, *client
      body: JSON.stringify(warpper), // body data type must match "Content-Type" header
    });

    
    
    if(response.ok) {
      const result = await response.blob()
    
      document.getElementById('initiatorResponse').innerHTML = result;
    }
    else{
      document.getElementById('initiatorError').innerHTML = response.blob();
    }

    
  };

  document.getElementById('sendToTaskRoomDebug').onclick = async ()=>{
    const jsonObj = editor.get();
    const url = 'http://' + window.layerOneIpAddress + '/poc/debug';
    console.log('url:', url);
    const response = await fetch(url, {
      method: 'POST', // *GET, POST, PUT, DELETE, etc.
      mode: 'cors', // no-cors, cors, *same-origin
      cache: 'no-cache', // *default, no-cache, reload, force-cache, only-if-cached
      credentials: 'omit', // include, *same-origin, omit
      headers: {
          'Content-Type': 'application/json',
          // 'Content-Type': 'application/x-www-form-urlencoded',
      },
      redirect: 'follow', // manual, *follow, error
      referrer: 'no-referrer', // no-referrer, *client
      body: JSON.stringify(jsonObj), // body data type must match "Content-Type" header
    });
    
    if(response.ok) {
      const result = await response.blob();
    
      document.getElementById('initiatorResponse').innerHTML = result;
    }
    else{
      document.getElementById('initiatorError').innerHTML = response.blob();
    }

  }
  document.getElementById('showPeerMgr').onclick = ()=>{
    editor.set({
      txType:"debug_showPeerMgr"
      
    })
  };

  window.simState.on('layerOnePeerIdChanged', (args)=>{
    o('log', 'layerOnePeerIdChanged', args);
  })

  window.simState.on('blockChange', (args)=>{
    o('log', 'blockChange', args);
  })
  ipfsPubsub(window.simState);
};
document.addEventListener('DOMContentLoaded', main);



  