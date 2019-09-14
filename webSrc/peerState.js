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

  getPeerId(){
    return this._peerId;
  }
  setPeerId(peerId){
    this._peerId = peerId;
  }
  isExistInDom(){
    return false;
  }
  updateOnNewBlock({block}){
    const gas = block.gasMap[this._userName];
    const credit = block.creditMap[this._userName];
    this._changeInnerText(this._col1, gas);
    this._changeInnerText(this._col2, credit);
    this._changeInnerText(this._col3, '');
    this._removeBold(this._col4);
  }

  setUserOffline(){
    if(this._isOnline == false)  return;
    this._isOnline = false;
    
    this._col3.innerText = 'Offline';
    this._changeInnerText(this._col3, 'Offline');
    this._changeInnerText(this._actionEle, '');

  }
  setUserOnline(){
    if(this._isOnline == true) return;
    this._isOnline = true;
    const block = global.simState.getCurrentBlock();
    if(block){
      const gas = block.gasMap[this._userName];
      const credit = block.creditMap[this._userName];
      this._changeInnerText(this._col1, gas);
      this._changeInnerText(this._col2, credit);
    }

    this._changeInnerText(this._col3, 'Online');
    this._changeInnerText(this._actionEle, 'Action');

  }
  _removeBold(ele){
    const classAttribute = ele.getAttribute("class");
    if(classAttribute){
      const classes = classAttribute.split(' ');
      const classOmitBold = classes.filter(c=>c != 'font-weight-bold');
      ele.setAttribute('class', classOmitBold.join(' '));
    }
  }
  _addBold(ele){
    const classAttribute = ele.getAttribute("class");
    if(classAttribute){
      const classes = classAttribute.split(' ');
      const classOmitBold = classes.filter(c=>c != 'font-weight-bold');
      classOmitBold.push('font-weight-bold');
      ele.setAttribute('class', classOmitBold.join(' '));
    }
    else{
      ele.setAttribute('class', 'font-weight-bold');
    }
  }
  _changeInnerText(ele, value){
    if(ele.innerText == value && value){
      this._removeBold(ele);
    }
    else{
      ele.innerText = value;
      if(value){
        this._addBold(ele);
      }
      else{
        //do not set bold font if the text is empty
      }
      
    }
  }
}