
import {utilities} from 'leo.simulator.shared';
const {o, tryParseJson} = utilities;
import {constValue} from 'leo.simulator.shared';


exports.reqUserInfo = ({from, guid})=>{
  simState.updateLayerOnePeerId(from);

  const resMessage = {
    type:'resUserFromWebUi',
    userName:'WebUi'
  };

  global.rpcEvent.emit('rpcResponse', {
    sendToPeerId: from, 
    message : JSON.stringify(resMessage), 
    guid
  });

  o('log', 'I received layerOne asking for UserInfo. replied webUi');
};

exports.ping = ({from, guid})=>{
  o('debug', `I receive another peer ${from} ping. I response my userInfo`);

  const resMessage = {
    type:'pong',
    userInfo:null,
    specialRole:'WebUi'
  };
  global.rpcEvent.emit('rpcResponse', {
    sendToPeerId: from,
    message: JSON.stringify(resMessage),
    guid
  });
};

exports.updateNodeUserInfo = ({from, guid, messageObj})=>{
  const {userInfo} = messageObj;
  global.simState.peerUpdateUserInfo(from, userInfo);
  global.rpcEvent.emit('rpcResponse', {
    sendToPeerId: from,
    message: "{resposne: 'ok'}",
    guid
  });
}