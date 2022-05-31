import webSocket, { WebSocketServer } from 'ws';

const type_enter = 0;
const type_leave = 1;
const type_msg = 2;

let count = 0; // 记录当前连接上来的总用户数据

const wss = new WebSocketServer({ port: 8080 });

wss.on('connection', function connection(ws) {
    count++;
    let userName = `user-${count}`
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
        userName = msg.split(":")[1];
        broadcast(userName,type_enter,`${userName}进入了聊天室！`, false);
      } else {
        broadcast(userName,type_msg,msg, isBinary)
      }
    });

    // 关闭连接
    ws.on("close", function close(data, isBinary){
        console.log('close: %s', data);
        count--;
      broadcast(userName,type_leave,`${userName}离开了聊天室！`, false)
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
        time: new Date().toLocaleTimeString()
    }
    // server.connections 表示所有用户
    wss.clients.forEach(item=>{
        if (item.readyState === webSocket.OPEN) {
            item.send(JSON.stringify(data),{binary: isBinary})
        }
      })
}
