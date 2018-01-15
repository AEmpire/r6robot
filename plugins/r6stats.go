package plugins

import (
	"encoding/json"
	"fmt"
	"io/ioutil"
	"net/http"
	"time"
)

type playerStats struct {
	Player struct {
		Username  string
		Platform  string
		UbisoftID string
		IndexedAt time.Time
		UpdatedAt time.Time
		Stats     struct {
			Ranked struct {
				HasPlayed bool
				Wins      int
				Losses    int
				Wlr       float64
				Kills     int
				Deaths    int
				Kd        float64
				Playtime  int
			}
			Casual struct {
				HasPlayed bool
				Wins      int
				Losses    int
				Wlr       float64
				Kills     int
				Deaths    int
				Kd        float64
				Playtime  float64
			}
			Overall struct {
				Revives                int
				Suicides               int
				ReinforcementsDeployed int
				BarricadesBuilt        int
				StepsMoved             int
				BulletsFired           int
				BulletsHit             int
				Headshots              int
				MeleeKills             int
				PenetrationKills       int
				Assists                int
			}
			Progression struct {
				Level int
				Xp    int
			}
		}
	}
}

type errMsg struct {
	Status string `json:"status"`
	Errors []struct {
		Detail string `json:"detail"`
		Title  string `json:"title"`
		Code   int    `json:"code"`
		Meta   struct {
			Description string `json:"description"`
		} `json:"meta"`
		Reference string `json:"reference"`
		Field     string `json:"field"`
	} `json:"errors"`
}

//GetR6Stats 获取玩家信息
func GetR6Stats(msgGet string) (msgSent string, err error) {
	var stats playerStats
	var errmsg errMsg
	url := "https://api.r6stats.com/api/v1/players/" + msgGet + "?platform=uplay"
	resp, err := http.Get(url)
	if err != nil {
		return msgSent, err
	}
	defer resp.Body.Close()
	body, err := ioutil.ReadAll(resp.Body)

	if resp.StatusCode == 404 {
		err = json.Unmarshal(body, &errmsg)
		if errmsg.Errors[0].Code == 457 {
			msgSent = "未找到该玩家"
			return msgSent, err
		}
		msgSent = "服务器挂啦，抢修中"
		return msgSent, err
	}

	err = json.Unmarshal(body, &stats)
	if err != nil {
		return msgSent, err
	}

	var kdratio, wlratio float32
	kdratio = float32(stats.Player.Stats.Casual.Kills+stats.Player.Stats.Ranked.Kills) / float32(stats.Player.Stats.Casual.Deaths+stats.Player.Stats.Ranked.Deaths)
	wlratio = float32(stats.Player.Stats.Casual.Wins+stats.Player.Stats.Ranked.Wins) / float32(stats.Player.Stats.Casual.Losses+stats.Player.Stats.Ranked.Losses)
	msgSent = `玩家ID：` + stats.Player.Username +
		`\n等级：` + fmt.Sprintf("%d", stats.Player.Stats.Progression.Level) +
		`\n战损比：` + fmt.Sprintf("%.2f", kdratio) +
		`\n胜负比：` + fmt.Sprintf("%.2f", wlratio)
	return msgSent, err
}
