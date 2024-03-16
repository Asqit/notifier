package utils

import (
	"bytes"
	"encoding/json"
	"fmt"
	"html/template"
	"io"
	"log"
	"os"
	"strings"

	"github.com/joho/godotenv"
)

func GetENV(key string) string {
	err := godotenv.Load(".env")
	if err != nil {
		fmt.Printf("Failed to load '.env' file %v", err)
	}
	return os.Getenv(key)
}

func ParseJSON[T any](path string) T {
	_, err := os.Stat(path)
	if err != nil {
		log.Fatalf("failed to look up a file %v", err)
	}

	file, err := os.Open(path)
	if err != nil {
		log.Fatalf("error opening file %v", err)
	}

	defer file.Close()

	contents, err := io.ReadAll(file)
	if err != nil {
		log.Fatalf("failed to read contents of file %v", err)
	}

	var parsedResult T
	err = json.Unmarshal(contents, &parsedResult)
	if err != nil {
		log.Fatalf("failed to parse JSON %v", err)
	}

	return parsedResult
}

func GetWd() string {
	path, err := os.Getwd()
	if err != nil {
		log.Fatalf("failed to read work directory path %v", err)
	}

	return path
}

var FuncMap = template.FuncMap{
	"NewlineToParagraph": func(s string) template.HTML {
		paragraphs := strings.Split(s, "\n")
		result := ""
		for _, p := range paragraphs {
			result += "<p>" + p + "</p>"
		}
		return template.HTML(result)
	},
}

func ParsePoem(path string, data string) string {
	file, err := os.ReadFile(path)
	if err != nil {
		log.Fatalf("failed to read template %v", err)
	}

	t := template.Must(template.New("page").Funcs(FuncMap).Parse(string(file)))
	buffer := new(bytes.Buffer)
	err = t.Execute(buffer, data)
	if err != nil {
		log.Fatalf("failed to create new template %v", err)
	}

	return buffer.String()
}
