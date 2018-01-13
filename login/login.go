package login

import (
	"bytes"
	"encoding/json"
	"fmt"
	"io/ioutil"
	"net/http"
	"regexp"
	"time"
)

//vfRet 转换接收vfwebqq的json
type vfRet struct {
	Retcode int
	Result  struct {
		Vfwebqq string
	}
}

//uinPost 获取uin与psessionid的POST内容
type uinPost struct {
	Ptwebqq    string `json:"ptwebqq"`
	Clientid   int    `json:"clientid"`
	Psessionid string `json:"psessionid"`
	Status     string `json:"status"`
}

//uinJSON 包含uin与psessionid的json
type uinRet struct {
	Result struct {
		Cip        int    `json:"cip"`
		F          int    `json:"f"`
		Index      int    `json:"index"`
		Port       int    `json:"port"`
		Psessionid string `json:"psessionid"`
		Status     string `json:"status"`
		Uin        int    `json:"uin"`
		UserState  int    `json:"user_state"`
		Vfwebqq    string `json:"vfwebqq"`
	} `json:"result"`
	Retcode int `json:"retcode"`
}

//Gets 包含通过登录获得的用于轮询消息以及其他用途的重要参数
type Gets struct {
	//获取好友信息
	Vfwebqq string
	//发送消息
	Psessionid string
	//发送消息
	Uin int
	//重要cookies
	Cookies []*http.Cookie
}

//AddCookie 添加cookie
func (g Gets) AddCookie(cookie *http.Cookie) {
	g.Cookies = append(g.Cookies, cookie)
}

const (
	//urlVfqq 获取vfwebqq的固定url
	urlVfqq = `https://s.web2.qq.com/api/getvfwebqq?ptwebqq=&clientid=53999199&psessionid=&t=1515849548201`
	//urlUin 获取uin以及psessionid的固定url
	urlUin = `https://d1.web2.qq.com/channel/login2`
)

//Login 登录QQ
func Login() (Gets, error) {
	uinBody := uinPost{
		Clientid:   53999199,
		Status:     "online",
		Ptwebqq:    "",
		Psessionid: ""}

	var loginGets Gets
	//提取二维码状态码
	regexStat := regexp.MustCompile(`ptuiCB\(\'(\d+)\'`)

	//判断二维码是否已扫描
	isScanned := false

	//保存扫描二维码后返回的url
	var sigLink string

	//获取二维码
	for !isScanned {
		qrsig, err := GetQcode()
		if err != nil {
			return loginGets, err
		}
	check_state:
		for !isScanned {
			resp, err := GetQRStat(qrsig)
			if err != nil {
				return loginGets, err
			}
			switch code := regexStat.FindAllStringSubmatch(resp.Status, -1)[0][1]; code {
			case `65`:
				//二维码失效重新获取
				fmt.Println("二维码已失效")
				break check_state
			case `66`:
				fmt.Println("二维码未失效")
			case `67`:
				fmt.Println("二维码认证中")
			case `0`:
				fmt.Println("二维码认证成功")
				//通过正则获取返回的url
				sigLink = regexp.MustCompile(`ptuiCB\(\'0\',\'0\',\'([^\']+)\'`).FindAllStringSubmatch(resp.Status, -1)[0][1]
				fmt.Println(sigLink)
				loginGets.Cookies = resp.Cookies
				isScanned = true
			}
			time.Sleep(3 * time.Second)
		}
	}

	//通过返回的url获取cookies
	fmt.Println("cookies")
	reqSig, err := http.Get(sigLink)
	if err != nil {
		return loginGets, err
	}
	println(reqSig.StatusCode)
	
	//获取vfwebqq
	fmt.Println("vfwebqq")
	reqVf, err := http.NewRequest("Get", urlVfqq, nil)
	if err != nil {
		return loginGets, err
	}
	for _, cookie := range loginGets.Cookies {
		reqVf.AddCookie(cookie)
	}
	reqVf.Header.Set("Referer", "https://s.web2.qq.com/proxy.html?v=20130916001&callback=1&id=1")
	client := &http.Client{}
	respVf, err := client.Do(reqVf)
	if err != nil {
		return loginGets, err
	}
	defer respVf.Body.Close()
	vfJSON, _ := ioutil.ReadAll(respVf.Body)
	var vfret vfRet
	err = json.Unmarshal([]byte(vfJSON), &vfret)
	if err != nil {
		return loginGets, err
	}
	loginGets.Vfwebqq = vfret.Result.Vfwebqq

	//获取uin与psessionid
	fmt.Println("uin")
	uinpost, err := json.Marshal(uinBody)
	reqUin, err := http.NewRequest("POST", urlUin, bytes.NewBuffer(uinpost))
	if err != nil {
		return loginGets, err
	}
	for _, cookie := range loginGets.Cookies {
		reqUin.AddCookie(cookie)
	}
	reqUin.Header.Set("Content-Type", "application/x-www-form-urlencoded")
	respUin, err := client.Do(reqUin)
	if err != nil {
		return loginGets, err
	}
	defer respUin.Body.Close()
	uinJSON, _ := ioutil.ReadAll(respUin.Body)
	var uinret uinRet
	err = json.Unmarshal([]byte(uinJSON), &uinret)
	if err != nil {
		return loginGets, err
	}
	loginGets.Psessionid = uinret.Result.Psessionid
	loginGets.Uin = uinret.Result.Uin

	return loginGets, nil
}
