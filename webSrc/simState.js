import { utilities} from 'leo.simulator.shared';
const {o} = utilities;
import EventEmitter from 'events';
import autoBind from 'auto-bind';
export default ()=>{
  return new SimState();
}
import PeerState from './peerState';

class SimState extends EventEmitter{
  constructor(){
    super();
    this._currentBlock = null;
    this._currentBlockCid = '';
    this._lastBlock = null;
    this._lastBlockCid = '';
    this._layerOnePeerId = '';
    this._peers = {};
    autoBind(this);
  }

  receiveNewBlock(block, blockCid){
    this._lastBlock = this._currentBlock;
    this._lastBlockCid = this._currentBlockCid;
    this._currentBlock = block;
    this._currentBlockCid = blockCid;
    this.emit('blockChange', {block, blockCid});
  }

  updateLayerOnePeerId(layerOnePeerId){
    if(this._layerOnePeerId == layerOnePeerId){
      return;
    }
    this._layerOnePeerId = layerOnePeerId;
    this.emit('layerOnePeerIdChanged', this._layerOnePeerId);
  }

  getLayerOnePeerId(){
    return this._layerOnePeerId;
  }

  hasPeerRegistered(peer){
    return this._peers[peer]? true: false;
  }

  newPeerJoin(peer, userInfo){
    if(this.hasPeerRegistered(peer))
      return;
    const userTableRowsParent = document.getElementById('userStateTableRoot');
    
    this._peers[peer] = new PeerState(userTableRowsParent, peer, userInfo);
    this._peers[peer].addToDom();
  }

  getPeerState(peer){
    return this._peers[peer];
  }

}