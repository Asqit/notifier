package utils

import (
	"encoding/json"
	"fmt"
	"io"
	"log"
	"os"

	"github.com/joho/godotenv"
)

type Messages struct {
	Messages [][]string `json:"messages"`
}

func GetENV(key string) string {
	err := godotenv.Load(".env")
	if err != nil {
		fmt.Println("Error loading '.env' file")
	}
	return os.Getenv(key)
}

func ReadMessages() Messages {
	path, err := os.Getwd()
	if err != nil {
		log.Fatalf("directory %v does not exists", err)
	}

	file, err := os.Open(path + "/assets/messages.json")
	if err != nil {
		log.Fatalf("error opening file %v", err)
	}

	defer file.Close()

	contents, err := io.ReadAll(file)
	if err != nil {
		log.Fatalf("failed to read contents of file %v", err)
	}

	var messages Messages
	err = json.Unmarshal(contents, &messages)
	if err != nil {
		log.Fatalf("failed to parse JSON %v", err)
	}

	return messages
}
