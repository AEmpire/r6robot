package login

import (
	"io/ioutil"
	"net/http"
	"strconv"
	"time"
)

//ScannedSetting 扫描二维码后返回的设置参数
type ScannedSetting struct{
	Status string
	Cookies []*http.Cookie
}

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
	resp, err := http.Get("https://ssl.ptlogin2.qq.com/ptqrshow?appid=501004106")

	if err != nil {
		return "", err
	}
	defer resp.Body.Close()
	body, err := ioutil.ReadAll(resp.Body)
	cookie := resp.Cookies()
	qrsig := cookie[0].Value
	if err!= nil {
		return "", err
	}

	filename := "/home/shili/图片/QCode.png"
	err = ioutil.WriteFile(filename, body, 0644)
	if err != nil {
		return "", err
	}
	return qrsig, nil
}

//GetQRStat 获取QR码扫描状态
//此处只需reqURL与cookie正确即可，无需referer
func GetQRStat(qrsig string) (settings ScannedSetting, err error) {

	qrtoken := strconv.Itoa(hash33(qrsig))
	referer := "https://xui.ptlogin2.qq.com/cgi-bin/xlogin?daid=164&target=self&style=40&pt_disable_pwd=1&mibao_css=m_webqq&appid=501004106&enable_qlogin=0&no_verifyimg=1&s_url=https%3A%2F%2Fw.qq.com%2Fproxy.html&f_url=loginerroralert&strong_login=1&login_state=10&t=20131024001"
	reqURL := "https://ssl.ptlogin2.qq.com/ptqrlogin?u1=https%3A%2F%2Fw.qq.com%2Fproxy.html&ptqrtoken=" + qrtoken + "&ptredirect=0&h=1&t=1&g=1&from_ui=1&ptlang=2052&action=0-0-1515480825809&js_ver=10233&js_type=1&login_sig=&pt_uistyle=40&aid=501004106&daid=164&mibao_css=m_webqq&"

	req, err := http.NewRequest("GET", reqURL, nil)
	if err != nil {
		return settings, err
	}

	req.Header.Set("Referer", referer)
	cookie := http.Cookie{Name: "qrsig", Value: qrsig, Expires: time.Now().Add(30 * 24 * time.Hour)}
	req.AddCookie(&cookie)
	client := &http.Client{}
	resp, err := client.Do(req)
	if err != nil {
		return settings, err
	}

	defer resp.Body.Close()
	body, _ := ioutil.ReadAll(resp.Body)
	settings.Status = string(body)
	settings.Cookies = resp.Cookies()

	return settings, err
}
