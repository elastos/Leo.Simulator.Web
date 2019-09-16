
import {utilities} from 'leo.simulator.shared';
const {o, tryParseJson} = utilities;



exports.reqUserInfo = ({from})=>{
  simState.updateLayerOnePeerId(from);

  const resMessage = {
    type:'resUserFromWebUi',
    userName:'WebUi'
  };
  o('log', 'I received layerOne asking for UserInfo. replied webUi');
  return {resMessage}
};

exports.ping = ({from})=>{
  o('debug', `I receive another peer ${from} ping. I response my userInfo`);

  const resMessage = {
    type:'pong',
    userInfo:null,
    specialRole:'WebUi'
  };
  return {resMessage}
};

exports.updateNodeUserInfo = ({from, message})=>{
  const {userInfo} = message;
  global.simState.peerUpdateUserInfo(from, userInfo);
  console.log('user send me updateNodeUserInfo,', userInfo);
  return {resMessage: "{resposne: 'ok'}"}
}