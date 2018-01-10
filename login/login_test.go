package login

import (
	"testing"
)

func TestGetQcode(t *testing.T) {
	if qrsig, err := GetQcode(); err != nil {
		t.Error(err)
	} else {
		t.Log(qrsig)
	}
}

func TestHash33(t *testing.T) {
	t.Log(hash33("HUNYGc6d8km3NAZrqVBma4sTH1yUWIJwvZ72n*DJn4QvXC*mq9SXdGn3GFLn8eSr"))
}

func TestQRState(t *testing.T) {
	qrsig, err := GetQcode()
	if err != nil {
		t.Error(err)
	}
	if isScanned, errStat := GetQRStat(qrsig); errStat != nil {
		t.Error(errStat)
	} else {
		t.Log(isScanned, qrsig)
	}
}
