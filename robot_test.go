package R6Robot

import (
	"testing"
)

func TestGetQcode(t *testing.T) {
	if err := GetQcode(); err != nil {
		t.Error(err)
	} else {
		t.Log("pass!")
	}
}
