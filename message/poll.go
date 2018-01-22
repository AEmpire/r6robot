package message

import (
	"bytes"
	"encoding/json"
	"io/ioutil"
	"net/http"
	"os"
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
	Errmsg string
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
func Poll(get login.Gets, c chan MessageRcvd, quit chan string) {
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
		fd, _ := os.OpenFile("/home/shili/error.log", os.O_RDWR|os.O_APPEND, 0644)
		defer fd.Close()
		log := time.Now().String() + err.Error()
		fd.WriteString(log)
		return
	}
poll_messages:
	for {
		req, err := http.NewRequest("POST", urlPoll, bytes.NewBuffer(formPost))
		if err != nil {
			fd, _ := os.OpenFile("/home/shili/error.log", os.O_RDWR|os.O_APPEND, 0644)
			defer fd.Close()
			log := time.Now().String() + err.Error()
			fd.WriteString(log)
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
		if errCount > 10 {
			quit <- "quit"
			fd, _ := os.OpenFile("/home/shili/error.log", os.O_RDWR|os.O_APPEND, 0644)
			defer fd.Close()
			log := time.Now().String() + "读取信息错误，请重新登录" + "\n"
			fd.WriteString(log)
			return
		}
		resp, err := client.Do(req)
		if err != nil {
			if strings.Contains(err.Error(), "timeout") {
				errCount = 0
				continue poll_messages
			} else if strings.Contains(err.Error(), "reset") {
				fd, _ := os.OpenFile("/home/shili/error.log", os.O_RDWR|os.O_APPEND, 0644)
				defer fd.Close()
				log := time.Now().String() + "Connection has been reset, trying relogining"
				fd.WriteString(log)
				errCount++
				return
			} else {
				fd, _ := os.OpenFile("/home/shili/error.log", os.O_RDWR|os.O_APPEND, 0644)
				defer fd.Close()
				log := time.Now().String() + "Poll Error," + err.Error()
				fd.WriteString(log)
				errCount++
				continue poll_messages
			}
		}
		defer resp.Body.Close()
		body, err := ioutil.ReadAll(resp.Body)
		err = json.Unmarshal(body, &mess)
		if mess.Retcode != 0 && mess.Retcode != 100012 {
			fd, _ := os.OpenFile("/home/shili/error.log", os.O_RDWR|os.O_APPEND, 0644)
			defer fd.Close()
			log := time.Now().String() + mess.Retmsg
			fd.WriteString(log)
			close(c)
			return
		}
		if mess.Errmsg != "error" {
			fd, _ := os.OpenFile("/home/shili/access.log", os.O_RDWR|os.O_APPEND, 0644)
			defer fd.Close()
			log := time.Now().String() + "Poll Success!!!" + "\n"
			fd.WriteString(log)
		} else {
			errCount++
			fd, _ := os.OpenFile("/home/shili/access.log", os.O_RDWR|os.O_APPEND, 0644)
			defer fd.Close()
			log := time.Now().String() + "Poll error!!!" + "\n"
			fd.WriteString(log)
		}
		//将返回结果输入channel
		c <- mess
	}

}
