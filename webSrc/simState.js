import { utilities} from 'leo.simulator.shared';
const {o} = utilities;
import EventEmitter from 'events';
import autoBind from 'auto-bind';
export default ()=>{
  return new SimState();
}

class SimState extends EventEmitter{
  constructor(){
    super();
    this._currentBlock = null;
    this._currentBlockCid = '';
    this._lastBlock = null;
    this._lastBlockCid = '';
    this._layerOnePeerId = '';
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
}