package login

import (
	"io/ioutil"
	"net/http"
	"strconv"
)

var (
	cookies map[string]string
	client  *http.Client
)

const (
	urlPtqrshow = `https://ssl.ptlogin2.qq.com/ptqrshow?appid=501004106&e=2&l=M&s=3&d=72&v=4&t=0.7922025677391542&daid=164&pt_3rd_aid=0'`
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
func GetQcode() error {
	cookies = make(map[string]string)
	cookies["pgv_pvi"] = "2677229032"
	cookies["pvi_si"] = "s3883232818"

	client = &http.Client{}

	req, err := http.NewRequest("GET", urlPtqrshow, nil)
	if err != nil {
		return err
	}
	addCookies2Req(req)
	resp, err := client.Do(req)
	if err != nil {
		return err
	}
	defer resp.Body.Close()
	body, err := ioutil.ReadAll(resp.Body)
	cookie := resp.Cookies()
	cookies["qrsig"] = cookie[0].Value
	if err != nil {
		return err
	}

	filename := "/home/shili/QCode.png"
	err = ioutil.WriteFile(filename, body, 0644)
	if err != nil {
		return err
	}
	return nil
}

//GetQRStat 获取QR码扫描状态
//此处只需reqURL与cookie正确即可，无需referer
func GetQRStat() (status string, err error) {

	qrtoken := strconv.Itoa(hash33(cookies["qrsig"]))
	reqURL := "https://ssl.ptlogin2.qq.com/ptqrlogin?u1=https%3A%2F%2Fw.qq.com%2Fproxy.html&ptqrtoken=" + qrtoken + "&ptredirect=0&h=1&t=1&g=1&from_ui=1&ptlang=2052&action=0-0-1515480825809&js_ver=10233&js_type=1&login_sig=&pt_uistyle=40&aid=501004106&daid=164&mibao_css=m_webqq&"

	req, err := http.NewRequest("GET", reqURL, nil)
	if err != nil {
		return status, err
	}

	addCookies2Req(req)
	resp, err := client.Do(req)
	if err != nil {
		return status, err
	}

	defer resp.Body.Close()
	body, _ := ioutil.ReadAll(resp.Body)
	status = string(body)
	cookie := resp.Cookies()

	for _, co := range cookie {
		switch co.Name {
		case "ptisp":
			cookies["ptisp"] = co.Value
		case "RK":
			cookies["RK"] = co.Value
		case "pt2gguin":
			cookies["pt2gguin"] = co.Value
		case "ptcz":
			if len(co.Value) > 0 {
				cookies["ptcz"] = co.Value
			}
		case "skey":
			cookies["skey"] = co.Value
		case "uin":
			cookies["uin"] = co.Value
		}
	}

	return status, err
}
