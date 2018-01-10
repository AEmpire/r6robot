package login

import (
	"io/ioutil"
	"net/http"
	"strconv"
	"time"
)

//hash33 自定哈希函数
func hash33(qrsig string) int {
	e := 0
	for _, r := range qrsig {
		e += (e << 5) + int(r)
	}
	return 2147483647 & e
}

//GetQcode 获取登录二维码
func GetQcode() (string, error) {
	resp, errResp := http.Get("https://ssl.ptlogin2.qq.com/ptqrshow?appid=501004106")

	if errResp != nil {
		return "", errResp
	}
	defer resp.Body.Close()
	body, errRead := ioutil.ReadAll(resp.Body)
	cookie := resp.Cookies()
	qrsig := cookie[0].Value
	if errRead != nil {
		return "", errRead
	}

	filename := "/home/shili/图片/QCode.png"
	errFileWrite := ioutil.WriteFile(filename, body, 0644)
	if errFileWrite != nil {
		return "", errFileWrite
	}
	return qrsig, nil
}

//GetQRStat 获取QR码扫描状态
//此处只需reqURL与cookie正确即可，无需referer
func GetQRStat(qrsig string) (string, error) {

	qrtoken := strconv.Itoa(hash33(qrsig))
	referer := "https://xui.ptlogin2.qq.com/cgi-bin/xlogin?daid=164&target=self&style=40&pt_disable_pwd=1&mibao_css=m_webqq&appid=501004106&enable_qlogin=0&no_verifyimg=1&s_url=https%3A%2F%2Fw.qq.com%2Fproxy.html&f_url=loginerroralert&strong_login=1&login_state=10&t=20131024001"
	reqURL := "https://ssl.ptlogin2.qq.com/ptqrlogin?u1=https%3A%2F%2Fw.qq.com%2Fproxy.html&ptqrtoken=" + qrtoken + "&ptredirect=0&h=1&t=1&g=1&from_ui=1&ptlang=2052&action=0-0-1515480825809&js_ver=10233&js_type=1&login_sig=&pt_uistyle=40&aid=501004106&daid=164&mibao_css=m_webqq&"

	req, errReq := http.NewRequest("GET", reqURL, nil)
	if errReq != nil {
		return "0", errReq
	}

	req.Header.Set("Referer", referer)
	cookie := http.Cookie{Name: "qrsig", Value: qrsig, Expires: time.Now().Add(30 * 24 * time.Hour)}
	req.AddCookie(&cookie)
	client := &http.Client{}
	resp, errResp := client.Do(req)
	if errResp != nil {
		return "0", errResp
	}

	defer resp.Body.Close()
	body, _ := ioutil.ReadAll(resp.Body)
	respStr := string(body)

	return respStr, nil
}
