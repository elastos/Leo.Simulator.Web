const {o} = './utils';
import EventEmitter from 'events';
import autoBind from 'auto-bind';

export default class PeerState{
  constructor(parentDomEle, peerId, userInfo){
    this._peerId = peerId;
    this._parentDomEle = parentDomEle;
    
    this._userName = userInfo.userName;

    this._tr = document.createElement('tr');
    this._th = document.createElement('th');
    this._th.setAttribute('scope', 'row');
    this._th.innerText = userInfo.userName;
    
    this._col1 = document.createElement('td');

    this._col2 = document.createElement('td');

    this._col3 = document.createElement('td');
    this._col3.innerText = "just joined";
    this._col4 = document.createElement('td');
    
    this._actionEle = document.createElement('a');
    this._actionEle.setAttribute('href', '#');
    this._actionEle.setAttribute('data-toggle', 'modal');
    this._actionEle.setAttribute('data-user-id', this._userName);
    this._actionEle.setAttribute('data-target',' #exampleModalCenter');
    this._actionEle.innerText = 'Action';
   
    this._col4.appendChild(this._actionEle);
    this._tr.appendChild(this._th);
    this._tr.appendChild(this._col1);
    this._tr.appendChild(this._col2);
    this._tr.appendChild(this._col3);
    this._tr.appendChild(this._col4);
  
    global.simState.on('blockChange', this.updateOnNewBlock.bind(this))
    global.simState.setMaxListeners(global.simState.getMaxListeners() + 1);
    autoBind(this);
  }

  addToDom(){
    this._parentDomEle.appendChild(this._tr);
  }


  isExistInDom(){
    return false;
  }
  updateOnNewBlock({block}){
    const gas = block.gasMap[this._userName];
    const credit = block.creditMap[this._userName];
    this._col1.innerText = gas;
    this._col2.innerText = credit;
    this._col3.innerText = "";
  }
  peerLeft(){

  }
  peerJoin(){

  }
}