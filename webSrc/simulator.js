import {getUrlVars} from './utils';
import ipfsPubsub from './ipfsPubSub';
import simState from './simState';
import {o} from './utils';
import toastr from 'toastr';
const main = ()=>{
  window.simState = simState();

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
  
  document.getElementById('sendAction').onclick = ()=>{
    const userName = document.getElementById('userName').value.trim();
    if(! userName){
      return o('error', 'Please select user before sending action on behalf of this user');
    }
    const layerOnePeerId =  window.simState.getLayerOnePeerId();
    if(! layerOnePeerId){
      return o('error', 'We have to wait to get connected to the layerOne before sending transaction');
    }
    const jsonObj = editor.get();
    const warpper = {
      type:'webUiAction',
      initiatorUserName: userName,
      action:jsonObj
    }
    const responseCallBack = (res, err)=>{
      if(err){
        return o('error', 'Send tx to layerone get error response', err);
      }
      o('success', 'Transaction sent to layer one');
    };
    global.rpcEvent.emit('rpcRequest', {
      sendToPeerId: layerOnePeerId, 
      message : JSON.stringify(warpper), 
      responseCallBack
    })
  }

  document.getElementById('generateNewBlock').onclick = ()=>{
    const layerOnePeerId =  window.simState.getLayerOnePeerId();
    if(! layerOnePeerId){
      return o('error', 'We have to wait to get connected to the layerOne before sending transaction');
    }
    
    const warpper = {
      type:'webUiGenerateBlock'
    }
    const responseCallBack = (res, err)=>{
      if(err){
        return o('error', 'Ask generate new block to layerone get error response', err);
      }
      o('success', 'Ask generate new block sent to layer one');
    };
    global.rpcEvent.emit('rpcRequest', {
      sendToPeerId: layerOnePeerId, 
      message : JSON.stringify(warpper), 
      responseCallBack
    })
  }

  document.getElementById('sendToTaskRoomDebug').onclick = async ()=>{
  //   const jsonObj = editor.get();
  //   const url = 'http://' + window.layerOneIpAddress + '/poc/debug';
  //   console.log('url:', url);
  //   const response = await fetch(url, {
  //     method: 'POST', // *GET, POST, PUT, DELETE, etc.
  //     mode: 'cors', // no-cors, cors, *same-origin
  //     cache: 'no-cache', // *default, no-cache, reload, force-cache, only-if-cached
  //     credentials: 'omit', // include, *same-origin, omit
  //     headers: {
  //         'Content-Type': 'application/json',
  //         // 'Content-Type': 'application/x-www-form-urlencoded',
  //     },
  //     redirect: 'follow', // manual, *follow, error
  //     referrer: 'no-referrer', // no-referrer, *client
  //     body: JSON.stringify(jsonObj), // body data type must match "Content-Type" header
  //   });
    
  //   if(response.ok) {
  //     const result = await response.blob();
    
  //     document.getElementById('initiatorResponse').innerHTML = result;
  //   }
  //   else{
  //     document.getElementById('initiatorError').innerHTML = response.blob();
  //   }

  // }
  // document.getElementById('showPeerMgr').onclick = ()=>{
  //   editor.set({
  //     txType:"debug_showPeerMgr"
      
  //   })
  };

  window.simState.on('layerOnePeerIdChanged', (args)=>{
    o('success', 'layerOnePeerIdChanged', args);
    document.getElementById('layer1PeerId').innerHTML = args;
  })

  window.simState.on('blockChange', ({block})=>{
    o('success', 'new block height: ', block.blockHeight);
    document.getElementById('blockheight').innerHTML = block.blockHeight;
    blockJsonEditor.set(block);
  })
  ipfsPubsub(window.simState);
};
document.addEventListener('DOMContentLoaded', main);



  