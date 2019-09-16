const {o} = './utils';
import EventEmitter from 'events';
import autoBind from 'auto-bind';
import { ENGINE_METHOD_DIGESTS } from 'constants';

export default class PeerState{
  constructor(parentDomEle, peerId, userInfo){
    this._peerId = peerId;
    this._parentDomEle = parentDomEle;
    
    this._userName = userInfo.userName;

    this._tr = document.createElement('tr');
    this._th = document.createElement('th');
    this._th.setAttribute('scope', 'row');
    this._actionEle = document.createElement('a');
    this._actionEle.setAttribute('href', '#');
    this._actionEle.setAttribute('data-toggle', 'modal');
    this._actionEle.setAttribute('data-user-id', this._userName);
    this._actionEle.setAttribute('data-target',' #exampleModalCenter');
    this._actionEle.innerText = this._userName;
    this._th.appendChild(this._actionEle);
    
    this._col1 = document.createElement('td');

    this._col2 = document.createElement('td');

    this._col3 = document.createElement('td');
    this._col3.innerText = 'online';
    
    this._tr.appendChild(this._th);
    this._tr.appendChild(this._col1);
    this._tr.appendChild(this._col2);
    this._tr.appendChild(this._col3);

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
    this._changeInnerText(this._col1, gas.toFixed(2));
    this._changeInnerText(this._col2, credit.toFixed());
   
  }

  setUserOffline(){
    if(this._isOnline == false)  return;
    this._isOnline = false;
    
    this.statusUpdate('text-secondary', 'Offline')
    this._actionEle.removeAttribute('href');
    this._actionEle.removeAttribute('data-toggle');
  }
  setUserOnline(){
    if(this._isOnline == true) return;
    this._isOnline = true;
    const block = global.simState.getCurrentBlock();
    if(block){
      const gas = block.gasMap[this._userName];
      const credit = block.creditMap[this._userName];
      this._changeInnerText(this._col1, gas.toFixed(2));
      this._changeInnerText(this._col2, credit.toFixed());
    }

    this.statusUpdate('text-secondary', 'Online')
    this._actionEle.setAttribute('href', "#");
    this._actionEle.setAttribute('data-toggle', "modal");
  }
  _removeStyleClass(ele, styleClass){
    const classAttribute = ele.getAttribute("class");
    if(classAttribute){
      const classes = classAttribute.split(' ');
      const classOmitBold = classes.filter(c=>c != styleClass);
      ele.setAttribute('class', classOmitBold.join(' '));
    }
  }
  _removeBold(ele){
    this._removeStyleClass(ele, 'font-weight-bold' )
  }
  _addStyleClass(ele, styleClass){
    if(! styleClass)  return;
    const classAttribute = ele.getAttribute("class");
    if(classAttribute){
      const classes = classAttribute.split(' ');
      const classOmitBold = classes.filter(c=>c != styleClass);
      classOmitBold.push(styleClass);
      ele.setAttribute('class', classOmitBold.join(' '));
    }
    else{
      ele.setAttribute('class', styleClass);
    }
  }
  _addBold(ele){
    this._addStyleClass(ele, 'font-weight-bold');
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

  statusUpdate(type, content){
    this._changeInnerText(this._col3, content);
    const styleMap={
      status:'text-secondary',
      info: "text-primary",
      error: 'text-danger',
      warning: 'text-warning'
    }

    this._addStyleClass(this._col3, styleMap[type]);
  }
}