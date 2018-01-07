package main

import (
	"io/ioutil"
	"net/http"
)

//GetQcode 获取登录二维码
func GetQcode() {
	resp, errResp := http.Get("https://ssl.ptlogin2.qq.com/ptqrshow?appid=501004106")

	if errResp != nil {
		println("请求错误")
		return
	}
	defer resp.Body.Close()
	body, errRead := ioutil.ReadAll(resp.Body)

	if errRead != nil {
		println("响应读取错误")
		return
	}

	filename := "QCode.png"
	errFileWrite := ioutil.WriteFile(filename, body, 0644)
	if errFileWrite != nil {
		println("写文件错误")
		return
	}
}

func main() {
	GetQcode()
}
