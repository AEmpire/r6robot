package message

import (
	"bytes"
	"encoding/json"
	"fmt"
	"io/ioutil"
	"net/http"
	"strings"
	"time"

	login "github.com/AEmpire/r6robot/login"
)

const (
	urlPoll = "https://d1.web2.qq.com/channel/poll2"
	referer = "https://d1.web2.qq.com/proxy.html?v=20151105001&callback=1&id=2"
)

type postForm struct {
	Ptwebqq    string `json:"ptwebqq"`
	Clientid   int    `json:"clientid"`
	Psessionid string `json:"psessionid"`
	Key        string `json:"key"`
}

//MessageRcvd 接受消息的JSON
type MessageRcvd struct {
	Result []struct {
		PollType string `json:"poll_type"`
		Value    struct {
			Content   []interface{} `json:"content"`
			FromUin   int64         `json:"from_uin"`
			GroupCode int64         `json:"group_code"`
			MsgID     int           `json:"msg_id"`
			MsgType   int           `json:"msg_type"`
			SendUin   int64         `json:"send_uin"`
			Time      int           `json:"time"`
			ToUin     int           `json:"to_uin"`
		} `json:"value"`
	} `json:"result"`
	Retcode int    `json:"retcode"`
	Retmsg  string `json:"retmsg"`
}

//Poll 接受消息
func Poll(get login.Gets, c chan MessageRcvd) {
	//添加容错机制
	errCount := 0

	var mess MessageRcvd

	form := postForm{
		Ptwebqq:    "",
		Clientid:   53999199,
		Psessionid: get.Psessionid,
		Key:        "",
	}
	formBody, err := json.Marshal(form)
	formPost := []byte("r=" + string(formBody))
	if err != nil {
		fmt.Println(err)
		return
	}
	for {
		req, err := http.NewRequest("POST", urlPoll, bytes.NewBuffer(formPost))
		if err != nil {
			fmt.Println(err)
			return
		}
		req.Header.Set("Origin", "https://d1.web2.qq.com")
		req.Header.Set("Referer", referer)
		req.Header.Set("Content-Type", "application/x-www-form-urlencoded")
		req.Header.Set("User-Agent", "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/63.0.3239.132 Safari/537.36")
		for name, val := range get.Cookies {
			req.AddCookie(&http.Cookie{Name: name, Value: val, Expires: time.Now().Add(30 * 24 * time.Hour)})
		}
		client := http.Client{}
		if errCount > 5 {
			fmt.Println("读取信息错误，请重新登录")
			return
		}
		resp, err := client.Do(req)
		if err != nil {
			if strings.Contains(err.Error(), "timeout") {
				errCount = 0
				continue
			} else {
				fmt.Println("Poll Error,", err.Error())
				errCount++
				continue
			}
		}
		defer resp.Body.Close()
		body, err := ioutil.ReadAll(resp.Body)
		err = json.Unmarshal(body, &mess)
		if mess.Retcode != 0 && mess.Retcode != 100012 {
			fmt.Println(mess.Retmsg)
			close(c)
			return
		}
		fmt.Println(mess)
		//将返回结果输入channel
		c <- mess
	}

}
