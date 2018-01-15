package message

import (
	"bytes"
	"fmt"
	login "github.com/AEmpire/r6robot/login"
	"io/ioutil"
	"net/http"
	"time"
)

//Send 发送信息
func Send(groupCode int64, msgNum int64, msg string, get login.Gets) {

	formBody := `{"` + "group_uin" + `":` + fmt.Sprintf("%d", groupCode) + `,"content":"[\"` + msg + `\",[\"font\",{\"name\":\"宋体\",\"size\":10,\"style\":[0,0,0],\"color\":\"000000\"}]]","face":561,"clientid":53999199,"msg_id":` + fmt.Sprint(msgNum) + `,"psessionid":"` + get.Psessionid + `"}`

	formPost := []byte("r=" + string(formBody))

	req, err := http.NewRequest("POST", "https://d1.web2.qq.com/channel/send_qun_msg2", bytes.NewBuffer(formPost))
	if err != nil {
		log := time.Now().String() + err.Error()
		ioutil.WriteFile("/home/shili/error.log", []byte(log), 0644)
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
		log := time.Now().String() + err.Error()
		ioutil.WriteFile("/home/shili/error.log", []byte(log), 0644)
		return
	}
	defer resp.Body.Close()
	body, _ := ioutil.ReadAll(resp.Body)
	log := time.Now().String() + string(body)
	ioutil.WriteFile("/home/shili/access.log", []byte(log), 0644)
}
