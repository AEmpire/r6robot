package R6Robot

import (
	"io/ioutil"
	"net/http"
)

//GetQcode 获取登录二维码
func GetQcode() error {
	resp, errResp := http.Get("https://ssl.ptlogin2.qq.com/ptqrshow?appid=501004106")

	if errResp != nil {
		return errResp
	}
	defer resp.Body.Close()
	body, errRead := ioutil.ReadAll(resp.Body)

	if errRead != nil {
		return errRead
	}

	filename := "QCode.png"
	errFileWrite := ioutil.WriteFile(filename, body, 0644)
	if errFileWrite != nil {
		return errFileWrite
	}
	return nil
}
