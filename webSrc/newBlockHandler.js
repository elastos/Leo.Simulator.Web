import { utilities} from 'leo.simulator.shared';
const {o, tryParseJson} = utilities;

export default (simState)=>async (message)=>{
  if(message.from != window.layerOnePeerId){
    simState.updateLayerOnePeerId( message.from);
  }
  const blockObj = tryParseJson(message.data);
  if(typeof blockObj == 'undefined'){
    
    return o('error', 'In block room got an non-parsable message from ' + message.from + ': ' + message.data.toString());
  }
  const {txType, cid, height} = blockObj;
  if(txType != 'newBlock'){
    return o('error', 'In block room got an unhandled message from ' + message.from + ': ' + message.data.toString());
  }
  const block = (await window.ipfs.dag.get(cid)).value;
  simState.receiveNewBlock(block, cid);
  const totalGas = Object.values(block.gasMap).reduce((sum, g)=>sum + g, 0);
  document.getElementById('totalGas').innerHTML = totalGas;
  document.getElementById('totalCreditForOnlineNodes').innerHTML = block.totalCreditForOnlineNodes
}