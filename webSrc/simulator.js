import {getUrlVars} from './utils';
import ipfsPubsub from './ipfsPubSub';
import simState from './simState';
import {o, cache} from './utils';
import _ from 'lodash';
import toastr from 'toastr';
import { utils } from 'vrf.js';
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
    const jsonObj = editor.get();
    const wrapper = {
      type:'webUiAction',
      initiatorUserName: userName,
      action:jsonObj
    }
    const responseCallBack = (res, err)=>{
      if(err){
        return o('error', 'Send tx to initiator get error response', err);
      }
      o('success', 'Transaction sent to initiator');
    };
    const sendToPeerId = global.simState.getUserPeerId(userName);
    if(! sendToPeerId)  {
      o('error', 'User is not online, cannot send action');
      return;
    }
    global.rpcEvent.emit('rpcRequest', {
      sendToPeerId, 
      message: JSON.stringify(wrapper),
      responseCallBack
    });
  };


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

  //document.getElementById('sendToTaskRoomDebug').onclick = async ()=>{
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
  //};

  document.getElementById('js_upload').onchange = async (e)=>{
    const userName = document.getElementById('userName').value.trim();
  
    const file = e.target.files[0];
    const fr = new FileReader();
    fr.onload = async ()=>{
      // const cid = await ipfs.dag.put({
      //   type : 'image',
      //   code : fr.result
      // });
      const code = fr.result.replace('data:image/jpeg;base64,', '');

      editor.set({
        txType:"uploadLambda",
        code: code,
        dockerImg:"image",
        payment:"payPerUse",
        ownerName:userName,
        amt:2
      });

      cache.set('task_data', {
        ownerName:userName,
        data: fr.result,
        type: 'image',
        txType : 'uploadLambda'
      });

      document.getElementById('js_upload').value = '';
    };
    fr.readAsDataURL(file);
  };

  document.getElementById('clearLayerOneLog').onclick = ()=>{
    const containerEle = document.getElementById('layerOneLogContainer')

    let child = containerEle.lastElementChild;  
    while (child) { 
      containerEle.removeChild(child); 
      child = containerEle.lastElementChild; 
    }
  };

  $('#showDataModal').click(()=>{
    const d = cache.get('task_data');
    if(!d){
      alert('no task data value');
      return false;
    }

    console.log(d);
    $('#js_data').modal('show');
    _.delay(()=>{
      let html = '';
      html += `<div>Tx Type: ${d.txType}</div>`;
      html += `<div>Type: ${d.type}</div>`;
      // html += `<div>Owner Name: ${d.ownerName}</div>`;

      if(d.type === 'image'){
        html += '<img style="width: 100%; margin: 12px auto;" src="'+d.data+'" />';
      }

      $('#js_data').find('.js_body').html(html);
    }, 100);
  })

  window.simState.on('layerOnePeerIdChanged', (args)=>{
    o('success', 'layerOnePeerIdChanged', args);
    document.getElementById('layer1PeerId').innerHTML = args;
  })

  window.simState.on('blockChange', ({block})=>{
    o('success', 'new block height: ', block.blockHeight);
    document.getElementById('blockheight').innerHTML = 'Block #' + block.blockHeight;
    blockJsonEditor.set(block);
  })
  ipfsPubsub(window.simState);
};
document.addEventListener('DOMContentLoaded', main);



  