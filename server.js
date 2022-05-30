import webSocket, { WebSocketServer } from 'ws';

const type_enter = 0;
const type_leave = 1;
const type_msg = 2;

let count = 0; // 记录当前连接上来的总用户数据

const wss = new WebSocketServer({ port: 8080 });

wss.on('connection', function connection(ws) {
    count++;
    ws.userName = `user-${count}`
    ws.on("open", function open(data) {
        console.log("data",data)
        broadcast(`${ws.userName}进入了聊天室！`, false);
    })

    // 发送消息
    ws.on('message', function message(data, isBinary) {
      console.log('received: %s', data);
      broadcast(data, isBinary)
    });

    ws.on("close", function close(data, isBinary){
        console.log('close: %s', data);
      broadcast(`${ws.userName}离开了聊天室！`, false)
    })
  
    ws.send('something');

    ws.on("error", function error(err) {
        console.log("err",err)
    })
  });
// ws.on(conn => {
//     // 每个连接到服务器用户，都会有一个conn
//     count++
//     // 给用户取名字
//     conn.userName = `用户-${count}`

//     // 告诉所有用户，有人加入聊天室
//     broadcast({
//         type: type_enter,
//         msg: `${conn.userName}进入了聊天室！`,
//         time: new Date().toLocaleTimeString()
//     })

//     // 接受到了浏览器的数据
//     conn.on('text',data=>{
//         broadcast({
//             type: type_msg,
//             msg: data,
//             time: new Date().toLocaleTimeString()
//         })
//     })

//     // 关闭连接
//     conn.on('close',data=>{
//         count--
//         broadcast({
//             type: type_leave,
//             msg: `${conn.userName}离开了聊天室！`,
//             time: new Date().toLocaleTimeString()
//         })
//     })

//     // 发生异常
//     conn.on('error',data=>{
//         console.log("发生异常")
//     })
// })

// 广播，给所有用户发送消息
function broadcast(msg,isBinary) {
    // server.connections 表示所有用户
    wss.clients.forEach(item=>{
        if (item.readyState === webSocket.OPEN) {
            item.send(msg,{binary: isBinary})
        }
      })
}
