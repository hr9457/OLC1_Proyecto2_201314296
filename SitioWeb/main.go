package main

import (
	"bytes"
	"encoding/json"
	"fmt"
	"io/ioutil"
	"log"
	"net/http"
)

// struct from set code
type Data struct {
	Codigo string
}

//peticion para la traduccion del javascript
func getInfo() {
	url := "http://localhost:3000/saludos"
	log.Println(url)
	resp, err := http.Get(url)
	if err != nil {
		log.Println("Conexion fallida")
		//panic(err)
	}
	log.Println("solicitudd exitosa")
	//log.Println(resp)
	defer resp.Body.Close()
	data, err := ioutil.ReadAll(resp.Body)
	if err != nil {
		//panic(err)
	}
	log.Println(string(data))
}

//funcion para llamar a la petcion post de nodejs
func setInfo() {
	url := "http://localhost:3000/saludos"
	fmt.Println(url)
	value := Data{"public class animal{int var1=45;}"}
	datajson, err := json.Marshal(value)
	if err != nil {
		log.Fatalln(err)
	}
	resp, err := http.Post(url, "application/json; charset=utf-8", bytes.NewBuffer(datajson))
	if err != nil {
		log.Fatalln(err)
	}
	defer resp.Body.Close()
	bodyBytes, _ := ioutil.ReadAll(resp.Body)
	bodyString := string(bodyBytes)
	fmt.Println(bodyString)
}

func convertJSON() {
	value := Data{
		Codigo: "public class animal{int var1=45;}",
	}
	datosJson, err := json.Marshal(value)
	if err != nil {
		log.Fatal(err)
	}
	fmt.Println(string(datosJson))
}

func main() {
	fileServer := http.FileServer(http.Dir("public"))
	http.Handle("/", http.StripPrefix("/", fileServer))
	http.ListenAndServe(":4000", nil)
}
