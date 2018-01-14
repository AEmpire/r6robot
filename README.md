# R6Robot

基于smartQQ开发的一款聊天机器人

## 功能

实现登录、接受以及发送信息等功能

### 已完成

二维码登录，可通过调用github.com/AEmpire/r6robot/login包实现

接收信息

发送信息

```go
package main

import (
	"fmt"
	"github.com/AEmpire/r6robot/login"
	"github.com/AEmpire/r6robot/message"
)

func main() {
	c := make(chan message.MessageRcvd)

	get, err := login.Login()
	if err != nil {
		fmt.Println(err)
	}
	fmt.Println(get)
	go message.Poll(get, c)

	message.Send(get, c)
}


```

### 待完成

R6Stat RESTful API 调用

## Authors

* **Li Shi** - [AEmpire](https://github.com/AEmpire)

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details
