
import {utilities} from 'leo.simulator.shared';
const {o, tryParseJson} = utilities;
import {constValue} from 'leo.simulator.shared';
import rpcDirectHandler from './rpcHandler';
exports.peerJoined = (peer)=>{
  if(global.simState.hasPeerRegistered(peer) == false && peer != global.simState.getLayerOnePeerId()){
      
    global.rpcEvent.emit('rpcRequest', {
      sendToPeerId:peer,
      message:JSON.stringify({type:'ping', userInfo:global.userInfo}),
      responseCallBack:(res, err)=>{
        if(err){
          o('error', 'Ping another peer got err:', err);
        }
        else{
          const {type, userInfo} = res;
          console.assert(type == 'pong');
          o('debug', `I receive a pong from peer ${peer}, userInfo added to my peer list,`, userInfo)
          if(userInfo){
            global.simState.newPeerJoin(peer, userInfo);
          }else{
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
  // if(global.allPeers[peer]){
  //   console.log(`peer ${peer} left. His userinfo:`, global.allPeers[peer].userInfo);
  //   delete global.allPeers[peer];
  // }
  // else
    console.log(`peer ${peer} left`);
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
  const {sendToPeerId, message, guid, err} = args;
  //o('debug', 'inside exports.rpcResponse:', sendToPeerId, message, guid, err);
  room.rpcResponse(sendToPeerId, message, guid, err);
}


exports.rpcDirect = (message) => {
  //o('log', 'In townhall got RPC message from ' + message.from + ': ', message);
  if(! message.guid || ! message.verb)
    return console.log("twonHall RPC handler got a message not standard RPC,", message);
  const messageObj = tryParseJson(message.data.toString());
  if(! messageObj)
    return console.log("townHallMessageHandler received non-parsable message, ", messageString);
  
  const handlerFunction = rpcDirectHandler[messageObj.type];
  try {
      if(typeof handlerFunction == 'function'){
      handlerFunction({from:message.from, guid:message.guid, messageObj});
      return
    }
    else{
      return o('error', "townHallMessageHandler received unknown type message object,", messageObj );
    }
  }
  catch(e){
    return o('error', 'executing handlerFunction inside townhall has exception:', e);
  }
}