import { utilities} from 'leo.simulator.shared';
const {o} = utilities;
import EventEmitter from 'events';
import autoBind from 'auto-bind';
export default ()=>{
  return new SimState();
}
import PeerState from './peerState';
import { AssertionError } from 'assert';

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
    return this._findPeerStateByPeerId(peer)? true: false;
  }

  newPeerJoin(peer, userInfo){
    if(! userInfo)
      return;
    if(! userInfo.userName)
      return o('debug', `This peer ${peer} has not got userName yet.`);
    if(this.isUserExisting(userInfo.userName)){
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

  peerLeft(peer){
    const peerState = this._findPeerStateByPeerId(peer);
    if(! peerState) return o('error', `Peer ${peer} left but not exists in current online users`);
    peerState.setUserOffline();
  }

  _findPeerStateByPeerId(peer){
    const peerStatesWhichHasThisPeerId = Object.values(this._users).filter(u=>u.getPeerId() == peer);
    console.assert(peerStatesWhichHasThisPeerId.length < 2, `ERROR: We should assume every user's peer State will have unique peerId. but it seems wrong here. ${peer} exists more than once`);
    return peerStatesWhichHasThisPeerId.length == 0? null: peerStatesWhichHasThisPeerId[0]
  }
  peerUpdateUserInfo(peer, userInfo){
    return this.newPeerJoin(peer, userInfo);
  }

  getCurrentBlock(){
    return this._currentBlock;
  }
  nodeStatusUpdate({from, type, content}){
    const peerState = this._findPeerStateByPeerId(from);
    if(peerState){
      peerState.statusUpdate(type, content);
    }
  }
  nodeDataUpdate({from, type, content}){
    
  }
}