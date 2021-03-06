package login

import (
	"bytes"
	"encoding/json"
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
	//cookies
	Cookies map[string]string
}

const (
	//urlVfqq 获取vfwebqq的固定url
	urlVfqq = `https://s.web2.qq.com/api/getvfwebqq?ptwebqq=&clientid=53999199&psessionid=&t=1515901255275`
	//urlUin 获取uin以及psessionid的固定url
	urlUin = `https://d1.web2.qq.com/channel/login2`
)

func addCookies2Req(req *http.Request) {
	for name, val := range cookies {
		req.AddCookie(&http.Cookie{Name: name, Value: val, Expires: time.Now().Add(30 * 24 * time.Hour)})
	}
}

//Login 登录QQ
func Login() (Gets, error) {
	//获取uin以及psessionid的表单内容
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
		err := GetQcode()
		if err != nil {
			return loginGets, err
		}
	check_state:
		for !isScanned {
			resp, err := GetQRStat()
			if err != nil {
				return loginGets, err
			}
			switch code := regexStat.FindAllStringSubmatch(resp, -1)[0][1]; code {
			case `65`:
				//二维码失效重新获取
				break check_state
			case `0`:
				//通过正则获取返回的url
				sigLink = regexp.MustCompile(`ptuiCB\(\'0\',\'0\',\'([^\']+)\'`).FindAllStringSubmatch(resp, -1)[0][1]
				//fmt.Println(sigLink)
				isScanned = true
				delete(cookies, "qrsig")
			}
			time.Sleep(3 * time.Second)
		}
	}

	//通过返回的url获取cookies
	reqSig, err := http.NewRequest("GET", sigLink, nil)
	if err != nil {
		return loginGets, err
	}

	addCookies2Req(reqSig)
	//http包会默认追踪重定向，故使用自定义CheckRedirect
	client.CheckRedirect = func(req *http.Request, via []*http.Request) error {
		return http.ErrUseLastResponse
	}
	respSig, err := client.Do(reqSig)
	if err != nil {
		return loginGets, err
	}
	for _, co := range respSig.Cookies() {
		switch co.Name {
		case "p_skey":
			if len(co.Value) > 0 {
				cookies["p_skey"] = co.Value
			}
		case "p_uin":
			if len(co.Value) > 0 {
				cookies["p_uin"] = co.Value
			}
		case "pt4_token":
			if len(co.Value) > 0 {
				cookies["pt4_token"] = co.Value
			}
		}
	}

	//获取vfwebqq
	reqVf, err := http.NewRequest("GET", urlVfqq, nil)
	if err != nil {
		return loginGets, err
	}
	addCookies2Req(reqVf)
	reqVf.Header.Set("Referer", "https://s.web2.qq.com/proxy.html?v=20130916001&callback=1&id=1")
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
	uinpost, err := json.Marshal(uinBody)
	uinForm := "r=" + string(uinpost)
	reqUin, err := http.NewRequest("POST", urlUin, bytes.NewBuffer([]byte(uinForm)))
	if err != nil {
		return loginGets, err
	}
	addCookies2Req(reqUin)
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
	loginGets.Cookies = cookies
	return loginGets, nil
}
