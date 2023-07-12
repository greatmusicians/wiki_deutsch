package main

import (
	"encoding/json"
	"fmt"
	"io/ioutil"
	"os"
	"strings"
)

type Wort struct {
	Typ      string   `json:"Typ"`
	Audio    string   `json:"Audio"`
	Note     string   `json:"Note"`     //备注
	Data     []string `json:"Data"`     //词性，单词，复数，含义
	Beispiel string   `json:"Beispiel"` //例句
	Section  string   `json:"Section"`  //来源
}

const templ = `<div class="Wort" Kapitel="%v" Typ="%v" Audio="%v">
<W1>%v</W1><W2>%v</W2><W3>%v</W3><W4>%v</W4>
<Beispiel>%v</Beispiel>
<Notiz>%v</Notiz>
</div>
`

func main() {
	entryList, err := os.ReadDir(".")
	if err != nil {
		fmt.Println(err)
		return
	}
	var wortList []Wort
	for _, v := range entryList {
		if !strings.HasSuffix(v.Name(), ".json") {
			continue
		}
		fmt.Println(v.Name())
		list, err := LoadWortList(v.Name())
		if err != nil {
			fmt.Println(err)
			return
		}
		wortList = append(wortList, list...)
	}
	var content string
	for _, v := range wortList {
		if len(v.Data) == 2 {
			content += fmt.Sprintf(templ,
				v.Section, v.Typ, "",
				v.Data[0], v.Data[1], "", "",
				v.Beispiel, v.Note)
		} else if len(v.Data) == 4 {
			content += fmt.Sprintf(templ,
				v.Section, v.Typ, "",
				v.Data[0], v.Data[1], v.Data[2], v.Data[3],
				v.Beispiel, v.Note)
		} else {
			fmt.Println(v.Data)
		}
	}
	err = os.WriteFile("result.md", []byte(content), 0644)
	if err != nil {
		fmt.Println(err)
		return
	}
}

func LoadWortList(filename string) ([]Wort, error) {
	contentsBytes, err := ioutil.ReadFile(filename)
	if err != nil {
		return nil, err
	}
	var list []Wort
	err = json.Unmarshal(contentsBytes, &list)
	if err != nil {
		return nil, err
	}
	return list, nil
}
