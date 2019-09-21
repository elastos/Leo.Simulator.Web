import IPFS from 'ipfs';
import {getUrlVars} from './utils.js';
import events from 'events';
import Room from 'ipfs-pubsub-room';
import { utilities} from 'leo.simulator.shared';
const {o} = utilities;
import newBlockHandler from './newBlockHandler';
import rpcDirectHandler from './rpcHandler';
import rpcResponse from './rpcResponse'
import townHallHandler from './townHallHandler';
import libp2pOptions from './browser-bundle';
import PeerId from 'peer-id';
export default async (simState)=>{
  const swarmUrl = (()=>{
    console.log('getUrlVars()', getUrlVars());
    const swarmUrlOption = getUrlVars().s || "";
    switch(swarmUrlOption){
      case 'public':
        return '/dns4/ws-star.discovery.libp2p.io/tcp/443/wss/p2p-websocket-star';
      case 'local':
      case '':
        return '/ip4/127.0.0.1/tcp/9090/ws/p2p-websocket-star';
      default:
        return '/ip4/' + swarmUrlOption + '/tcp/9090/ws/p2p-websocket-star';
    }
  })();
  
  console.log('swarmUrl:|', swarmUrl, '|');
  
  const ipfs = await IPFS.create({
    repo: 'ipfs-storage-no-git/poc/' + Math.random(),
    EXPERIMENTAL: {
      pubsub: true
    },
    config: {
      Addresses: {
        Swarm: [
          swarmUrl
        ]
      }
    },
    libp2p:libp2pOptions()
  });
  console.log('IPFS node is ready');
  window.ipfs = ipfs;
  window.ipfsPeerId = ipfs._peerInfo.id.toB58String();
  
  ipfs.on('error', error=>{
    console.log('IPFS on error:', error);
  });

  ipfs.on('init', error=>{
    console.log('IPFS on init:', error);
  });

  const randRoomPostfix = getUrlVars().r || "";
  
  console.log("randRoomPostfix", randRoomPostfix);
  const townHall = Room(ipfs, 'townHall'+ randRoomPostfix);//roomMessageHandler(ipfs, 'townHall' + randRoomPostfix, options, townHall);
  const blockRoom = Room(ipfs, 'blockRoom'+ randRoomPostfix);//roomMessageHandler(ipfs, 'blockRoom' + randRoomPostfix, options, blockRoom);
  

  // global.blockMgr = blockMgr;
  global.rpcEvent = new events.EventEmitter();
  global.broadcastEvent = new events.EventEmitter();
  townHall.on('peer joined', townHallHandler.peerJoined);
  townHall.on('peer left', townHallHandler.peerLeft);
  townHall.on('subscribed', townHallHandler.subscribed);
  townHall.on('rpcDirect', rpcResponse(rpcDirectHandler));
  townHall.on('message', townHallHandler.messageHandler);
  //townHall.on('message', messageHandler);
  townHall.on('error', (err)=>o('error', `*******   townHall has pubsubroom error,`, err));
  townHall.on('stopping', ()=>o('error', `*******   townHall is stopping`));
  townHall.on('stopped', ()=>o('error', `*******   townHall is stopped`));
  blockRoom.on('subscribed', m=>o('log', 'subscribed', m));
  blockRoom.on('message', newBlockHandler(simState));//blockRoomHandler.messageHandler(ipfs))
  blockRoom.on('error', (err)=>o('error', `*******   blockRoom has pubsubroom error,`, err));
  blockRoom.on('stopping', ()=>o('error', `*******   blockRoom is stopping`));
  blockRoom.on('stopped', ()=>o('error', `*******   blockRoom is stopped`));

  global.rpcEvent.on("rpcRequest", townHallHandler.rpcRequest(townHall));
  global.rpcEvent.on("rpcResponseWithNewRequest", townHallHandler.rpcResponseWithNewRequest(townHall));
  global.rpcEvent.on("rpcResponse", townHallHandler.rpcResponse(townHall));
  
  //broadcastEvent.on('blockRoom', (m)=>blockRoom.broadcast(m));  
};


