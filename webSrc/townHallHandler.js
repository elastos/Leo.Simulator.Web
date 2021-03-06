
import {utilities} from 'leo.simulator.shared';
const {o, tryParseJson} = utilities;
import {constValue} from 'leo.simulator.shared';
import {cache} from './utils';

exports.peerJoined = (peer)=>{
  if(global.simState.hasPeerRegistered(peer) == false && peer != global.simState.getLayerOnePeerId()){
      
    global.rpcEvent.emit('rpcRequest', {
      sendToPeerId:peer,
      message:JSON.stringify({type:'ping', userInfo:global.userInfo, specialRole: 'WebUi'}),
      responseCallBack:(res, err)=>{
        if(err){
          o('error', `Ping another peer ${peer} got err:`, err);
        }
        else{
          const {type, userInfo, specialRole} = res;
          console.assert(type == 'pong');
          o('debug', `I receive a pong from peer ${peer}, userInfo added to my peer list,`, userInfo)
          if(userInfo){
            global.simState.newPeerJoin(peer, userInfo);
          }
          else if(specialRole == 'LayerOneBlockChain'){
            global.simState.updateLayerOnePeerId(peer);
          }
          else{
            o('error', 'A peer doesnt response a valid userInfo. Probably he hasnot got his user from layerone yet', peer);
          }
        }
      }
    });
    console.log(`peer ${peer} joined. userInfo request sent`)
  }
  else
    console.log(`I have him into peer list`, peer);
};
exports.peerLeft = (peer)=>{
  global.simState.peerLeft(peer);
};
exports.subscribed = (m)=>console.log(`Subscribed ${m}`);

exports.rpcResponseWithNewRequest = (room)=>(args)=>{
  const {sendToPeerId, message, guid, responseCallBack, err} = args;
  room.rpcResponseWithNewRequest(sendToPeerId, message, guid, responseCallBack, err);
}
exports.rpcRequest = (room)=>(args)=>{
  const {sendToPeerId, message, responseCallBack} = args;
  // sendToPeerId:tx.ipfsPeerId, 
  // message:JSON.stringify(raReqObj), 
  // responseCallBack:handleRaResponse
  room.rpcRequest(sendToPeerId, message, responseCallBack);
}
exports.rpcResponse =  (room)=>(args)=>{
  const {sendToPeerId, message, guid, err, result} = args;
  o('debug', 'inside exports.rpcResponse:', sendToPeerId, message, guid, err, result);
  room.rpcResponse(sendToPeerId, message, guid, err);
}


// exports.rpcDirect = (message) => {
//   //o('log', 'In townhall got RPC message from ' + message.from + ': ', message);
//   if(! message.guid || ! message.verb)
//     return console.log("twonHall RPC handler got a message not standard RPC,", message);
//   const messageObj = tryParseJson(message.data.toString());
//   if(! messageObj)
//     return console.log("townHallMessageHandler received non-parsable message, ", messageString);
  
//   const handlerFunction = rpcDirectHandler[messageObj.type];
//   try {
//       if(typeof handlerFunction == 'function'){
//       handlerFunction({from:message.from, guid:message.guid, messageObj});
//       return
//     }
//     else{
//       return o('error', "townHallMessageHandler received unknown type message object,", messageObj );
//     }
//   }
//   catch(e){
//     return o('error', 'executing handlerFunction inside townhall has exception:', e);
//   }
// }

exports.messageHandler = (message)=>{
  const {from, data} = message;
  const messageObj = tryParseJson(message.data.toString());
  if(! messageObj)
    return console.log("townHallMessageHandler received non-parsable message, ", messageString);
  const {type, content} = messageObj;
  switch(type){
    case "status":
    case "info":
    case "error":
    case "warning":
      global.simState.nodeStatusUpdate({from, type, content});
      break;
    case 'data':
      cache.set('task_data', {
        type : 'image',
        txType : 'TaskComputeResult',
        data : 'data:image/jpeg;base64,'+content
      });
      console.log('rpc data: ', content);
      break;
    default:
      o('error', ' we do not support this type of WebUi status message, ', type);
  }

}