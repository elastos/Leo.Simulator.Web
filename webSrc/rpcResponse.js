import { o, tryParseJson} from './utils';

export default (rpcDirectHandler)=>async ({from, guid, verb, data})=>{

  if(! guid || ! verb)
    return console.error("twonHall RPC handler got a message which is not a standard RPC,", data.toString());
  const _messageObj = tryParseJson(data.toString());
  if(! _messageObj)
    return console.log("townHallMessageHandler received non-parsable message, ", messageString);
  const {type, ...message} = _messageObj;
  const handlerFunction = rpcDirectHandler[type];
  try {
    if(typeof handlerFunction == 'function'){
      const {resMessage, err, responseCallBack} = await handlerFunction({from, message});
      if(typeof rpcResponseWithNewRequest == 'function'){
        global.rpcEvent.emit('rpcResponseWithNewRequest', {
          sendToPeerId: from, 
          message : resMessage? (typeof resMessage == 'object'? JSON.stringify(resMessage) : resMessage) : null, 
          guid,
          err: err? (typeof err == 'object'? JSON.stringify(err) : err) : null,
          responseCallBack
        });
      }else{
        global.rpcEvent.emit('rpcResponse', {
          sendToPeerId: from, 
          message : resMessage? (typeof resMessage == 'object'? JSON.stringify(resMessage) : resMessage) : null, 
          err: err? (typeof err == 'object'? JSON.stringify(err) : err) : null,
          guid
        });
      }
    }
    else{
      return o('error', "townHallMessageHandler received unknown type message object,", _messageObj );
    }
  }
  catch(e){
    return o('error', 'executing handlerFunction inside townhall has exception:', e);
  }
}