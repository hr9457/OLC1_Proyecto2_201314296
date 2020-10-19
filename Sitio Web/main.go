package main

import (
	"io/ioutil"
	"log"
	"net/http"
)

type saludo struct {
	Saludo string
}

func main() {
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
