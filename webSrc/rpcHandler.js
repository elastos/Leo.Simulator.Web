
import {utilities} from 'leo.simulator.shared';
const {o, tryParseJson} = utilities;
import {constValue} from 'leo.simulator.shared';


exports.reqUserInfo = ({from, guid})=>{
  simState.updateLayerOnePeerId(from);

  const resMessage = {
    type:'resUserFromWebUi',
    userName:'WebUi'
  };
  o('log', 'I received layerOne asking for UserInfo. replied webUi');
  return {resMessage}
};

exports.ping = ({from, guid})=>{
  o('debug', `I receive another peer ${from} ping. I response my userInfo`);

  const resMessage = {
    type:'pong',
    userInfo:null,
    specialRole:'WebUi'
  };
  return {resMessage}
};

exports.updateNodeUserInfo = ({from, guid, messageObj})=>{
  const {userInfo} = messageObj;
  global.simState.peerUpdateUserInfo(from, userInfo);
  return {resMessage: "{resposne: 'ok'}"}
}