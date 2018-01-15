package r6robot

import(
	"io/ioutil"
	"time"
	login "github.com/AEmpire/r6robot/login"
	message "github.com/AEmpire/r6robot/message"
	plugins "github.com/AEmpire/r6robot/plugins"
)

var msgNum int64 = time.Now().Unix() % 1E4 * 1E4

func R6robot()  {
	c := make(chan message.MessageRcvd)

	for{
		
		get, err := login.Login()
	    if err != nil {
		    log := time.Now().String() + err.Error()
			ioutil.WriteFile("/home/shili/error.log", []byte(log), 0644)
			return
		}
		go message.Poll(get, c)

		for{
			msgNum++
			var msgSent string
			msgGet := <-c
			statusCode := msgGet.Retcode
			msgType := msgGet.Result[0].PollType
			msgContent := msgGet.Result[0].Value.Content
			groupCode := msgGet.Result[0].Value.GroupCode
			if statusCode == 0 {
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
			
		}
	}
}