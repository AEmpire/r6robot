package message

import(
	"fmt"
	"time"
	"bytes"
	"io/ioutil"
	"encoding/json"
	"net/http"
	"github.com/AEmpire/r6robot/login"
)

type messageSent struct {
	GroupUin   int64    `json:"group_uin"`
	Content    string `json:"content"`
	Face       int    `json:"face"`
	Clientid   int    `json:"clientid"`
	MsgID      int64    `json:"msg_id"`
	Psessionid string `json:"psessionid"`
}

//Send 发送信息
func Send(get login.Gets, c chan MessageRcvd)  {
	var messSent messageSent
	msgNum := time.Now().Unix() % 1E4 * 1E4
	msg := "233"
	fmt.Println(msgNum)
	for {
		msgNum++
		messGet := <- c
		if messGet.Result[0].PollType == "group_message" && messGet.Retcode == 0{
			messSent = messageSent{
				GroupUin:messGet.Result[0].Value.GroupCode,
				Content:"[\""+msg+"\",[\"font\",{\"name\":\"宋体\",\"size\":10,\"style\":[0,0,0],\"color\":\"000000\"}]]",
				Face:561,
				Clientid:53999199,
				MsgID:msgNum,
				Psessionid:get.Psessionid,
			}
			formBody, err := json.Marshal(messSent)
			formPost := []byte("r=" + string(formBody))
			if err != nil {
				fmt.Println(err)
				return
			}
			req, err := http.NewRequest("POST", "https://d1.web2.qq.com/channel/send_qun_msg2", bytes.NewBuffer(formPost))
			if err != nil {
				fmt.Println(err)
				return
			}
			req.Header.Set("Origin", "https://d1.web2.qq.com")
			req.Header.Set("Referer", "https://d1.web2.qq.com/cfproxy.html?v=20151105001&callback=1")
			req.Header.Set("Content-Type", "application/x-www-form-urlencoded")
			req.Header.Set("User-Agent", "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/63.0.3239.132 Safari/537.36")
			for name, val := range get.Cookies {
				req.AddCookie(&http.Cookie{Name: name, Value: val, Expires: time.Now().Add(30 * 24 * time.Hour)})
			}
			client := http.Client{}
			resp, err := client.Do(req)
			if err != nil {
				fmt.Println(err)
				return
			}
			defer resp.Body.Close()
			body, _ := ioutil.ReadAll(resp.Body)
			fmt.Println(string(body))
		}
	}
	
}