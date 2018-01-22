package message

import (
	"bytes"
	"encoding/json"
	"fmt"
	"io/ioutil"
	"net/http"
	"os"
	"time"

	login "github.com/AEmpire/r6robot/login"
)

type sentStatus struct {
	Errmsg  string `json:"errmsg"`
	Retcode int    `json:"retcode"`
}

//Send 发送信息
func Send(groupCode int64, msgNum int64, msg string, get login.Gets) {
	sentCount := 0
send_massage:
	var stats sentStatus
	formBody := `{"` + "group_uin" + `":` + fmt.Sprintf("%d", groupCode) + `,"content":"[\"` + msg + `\",[\"font\",{\"name\":\"宋体\",\"size\":10,\"style\":[0,0,0],\"color\":\"000000\"}]]","face":561,"clientid":53999199,"msg_id":` + fmt.Sprint(msgNum) + `,"psessionid":"` + get.Psessionid + `"}`

	formPost := []byte("r=" + string(formBody))

	req, err := http.NewRequest("POST", "https://d1.web2.qq.com/channel/send_qun_msg2", bytes.NewBuffer(formPost))
	if err != nil {
		fd, _ := os.OpenFile("/home/shili/error.log", os.O_RDWR|os.O_CREATE|os.O_APPEND, 0644)
		defer fd.Close()
		log := time.Now().String() + err.Error()
		fd.WriteString(log)
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
		fd, _ := os.OpenFile("/home/shili/error.log", os.O_RDWR|os.O_CREATE|os.O_APPEND, 0644)
		defer fd.Close()
		log := time.Now().String() + err.Error()
		fd.WriteString(log)
		return
	}
	defer resp.Body.Close()
	body, _ := ioutil.ReadAll(resp.Body)
	json.Unmarshal(body, &stats)
	if stats.Retcode != 0 {
		if sentCount > 5 {
			fd, _ := os.OpenFile("/home/shili/access.log", os.O_RDWR|os.O_APPEND, 0644)
			defer fd.Close()
			log := time.Now().String() + string(body)
			fd.WriteString(log)
			return
		}
		sentCount++
		fd, _ := os.OpenFile("/home/shili/access.log", os.O_RDWR|os.O_APPEND, 0644)
		defer fd.Close()
		log := time.Now().String() + string(body)
		fd.WriteString(log)
		goto send_massage
	}
	sentCount = 0
	fd, _ := os.OpenFile("/home/shili/access.log", os.O_RDWR|os.O_APPEND, 0644)
	defer fd.Close()
	log := time.Now().String() + "Send success!!\n"
	fd.WriteString(log)
}
