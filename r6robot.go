package r6robot

import (
	"os"
	"time"

	login "github.com/AEmpire/r6robot/login"
	message "github.com/AEmpire/r6robot/message"
	plugins "github.com/AEmpire/r6robot/plugins"
)

//R6robot 启动
func R6robot() {
	c := make(chan message.MessageRcvd)
	quit := make(chan string)
	//添加容错机制，返回错误信息十次重新登录
	errCount := 0
	msgNum := time.Now().Unix() % 1E4 * 1E4
	for {
		get, err := login.Login()
		if err != nil {
			fd, _ := os.OpenFile("/home/shili/error.log", os.O_RDWR|os.O_APPEND, 0644)
			defer fd.Close()
			log := time.Now().String() + err.Error()
			fd.WriteString(log)
			return
		}
		go message.Poll(get, c, quit)

	send_messages:
		for {
			msgNum++
			var msgSent string
			if errCount > 10 {
				quit <- "quit"
				fd, _ := os.OpenFile("/home/shili/error.log", os.O_RDWR|os.O_APPEND, 0644)
				defer fd.Close()
				log := time.Now().String() + " ErrMsg " + "\n"
				fd.WriteString(log)
				break send_messages
			}
			select {
			case msgGet := <-c:
				statusCode := msgGet.Retcode
				if statusCode == 0 && msgGet.Errmsg != "error" {
					msgType := msgGet.Result[0].PollType
					msgContent := msgGet.Result[0].Value.Content
					groupCode := msgGet.Result[0].Value.GroupCode
					if len(msgContent) > 1 && msgType == "group_message" {
						if msgContent[1] == "@拆迁机器人" {
							msgSent, err = plugins.GetR6Stats(msgContent[4].(string))
							if err != nil {
								break
							}
							message.Send(groupCode, msgNum, msgSent, get)
						}
					}
				}
			case <-quit:
				break send_messages
			}

		}
	}
}
