package login

import (
	"fmt"
	"regexp"
	"time"
)

//Login 登录QQ
func Login() error {
	regexStat := regexp.MustCompile(`ptuiCB\(\'(\d+)\'`)
	isScanned := false
	var sigLink string

	for !isScanned {
		qrsig, errCode := GetQcode()
		if errCode != nil {
			return errCode
		}
	check_state:
		for !isScanned {
			resp, errStat := GetQRStat(qrsig)
			if errStat != nil {
				return errStat
			}
			switch code := regexStat.FindAllStringSubmatch(resp, -1)[0][1]; code {
			case `65`:
				fmt.Println("二维码已失效")
				break check_state
			case `66`:
				fmt.Println("二维码未失效")
			case `67`:
				fmt.Println("二维码认证中")
			case `0`:
				fmt.Println("二维码认证成功")
				sigLink = regexp.MustCompile(`ptuiCB\(\'0\',\'0\',\'([^\']+)\'`).FindAllStringSubmatch(resp, -1)[0][1]
				fmt.Println(sigLink)
				isScanned = true
			}
			time.Sleep(3 * time.Second)
		}
	}
	return nil
}
