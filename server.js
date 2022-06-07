import webSocket, { WebSocketServer } from 'ws';

const type_enter = 0;
const type_leave = 1;
const type_msg = 2;

let count = 0; // 记录当前连接上来的总用户数据
let userlist = [];  // 记录当前列表对象

const wss = new WebSocketServer({ port: 8080 });

wss.on('connection', function connection(ws) {
    // console.log("ws",ws)
    ws.userName = `user-${count}`
    // let time = new Date().toLocaleTimeString();
    // ws.on("login",function login(data) {
    //     // 连接之后 发送广播
    //     broadcast(userName,type_enter,`${ws.userName}进入了聊天室！`,time, false);
    // })
    // ws.on("open", function open(data) {
    //     console.log("data",data)
    //     broadcast(`${ws.userName}进入了聊天室！`, false);
    // })

    // 发送消息
    ws.on('message', function message(data, isBinary) {
      console.log('received: %s', data);
      let msg = data + ""
      if (msg.indexOf('login:')!== -1) {
        count++;
        ws.userName = msg.split(":")[1];
        userlist.push(ws.userName);
        broadcast(ws.userName,type_enter,`${ws.userName} 进入了聊天室！`, false);
      }else if (msg.indexOf('close:')!== -1) {
        closeWs(msg.split(":")[1]);
      } else {
        broadcast(ws.userName,type_msg,msg, isBinary)
      }
    });

    // 关闭连接
    ws.on("close", function close(data, isBinary){
        console.log('close: %s', data);
        count--;
        userlist = userlist.filter(item => item !== ws.userName)
      broadcast(ws.userName,type_leave,`${ws.userName} 离开了聊天室！`, false)
    })

    // 报错
    ws.on("error", function error(err) {
        console.log("err",err)
    })
});

// 广播，给所有用户发送消息
function broadcast(name, type,msg, isBinary) {
    let data = {
        type: type,
        userName: name,
        msg: msg,
        time: new Date().toLocaleTimeString(),
        count: count,
        userlist: userlist
    }
    // server.connections 表示所有用户
    wss.clients.forEach(item=>{
        if (item.readyState === webSocket.OPEN) {
            item.send(JSON.stringify(data),{binary: isBinary})
        }
      })
}

function closeWs(params) {
  wss.clients.forEach(item=>{
    if (item.userName == params) {
      if (item.readyState === webSocket.OPEN) {
        item.close();
      }
    }
  })
}
