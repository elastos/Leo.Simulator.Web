
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
