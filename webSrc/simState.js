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
    this._users = {};
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

  isUserExisting(userName){
    
    return this._users[userName]? true: false;
  }

  hasPeerRegistered(peer){
    return Object.values(this._users).filter(u=>u.getPeerId() == peer).length > 0? true: false;
  }

  newPeerJoin(peer, userInfo){
    if(! userInfo)
      return;
    if(this.isUserExisting(userInfo.username)){
      if(this._users[userInfo.userName].getPeerId() != peer){
        this._users[userInfo.userName].setPeerId(peer);
      }
      this._users[userInfo.userName].setUserOnline();
      return;
    }
    const userTableRowsParent = document.getElementById('userStateTableRoot');
    
    this._users[userInfo.userName] = new PeerState(userTableRowsParent, peer, userInfo);
    this._users[userInfo.userName].addToDom();
  }

  getCurrentBlock(){
    return this._currentBlock;
  }

}