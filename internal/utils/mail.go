package utils

import (
	"bytes"
	"fmt"
	"html/template"
	"log"
	"mime"
	"net/smtp"
	"path/filepath"
)

type Request struct {
	to       []string
	subject  string
	body     string
	mimeType string
}

// Template for mime type...usage: fmt.Sprintf(MIME_TYPE_TEMPLATE, "text/plain; charset=utf-8")
const MIME_TYPE_TEMPLATE = "MIME-version: 1.0;\nContent-Type: %s; \n\n"

func NewRequest(to []string, subject, body string) *Request {
	return &Request{
		to:       to,
		subject:  subject,
		body:     body,
		mimeType: fmt.Sprintf(MIME_TYPE_TEMPLATE, "text/plain; charset=utf-8"),
	}
}

func (r *Request) SendEmail() (bool, error) {
	from := GetENV("SMTP_USR")
	pass := GetENV("SMTP_PWD")
	to := r.to
	msg := fmt.Sprintf("From: %s\nTo: %s\nSubject: %s\n%s\n%s", from, to[0], r.subject, r.mimeType, r.body)

	err := smtp.SendMail(GetENV("SMTP_HOST")+":587",
		smtp.PlainAuth("", from, pass, GetENV("SMTP_HOST")),
		from, r.to, []byte(msg))

	if err != nil {
		log.Printf("smtp error: %s", err)
		return false, err
	}

	return true, nil
}

func (r *Request) ParseTemplate(templateFileName string, data interface{}) error {
	t, err := template.ParseFiles(templateFileName)
	if err != nil {
		return err
	}
	buf := new(bytes.Buffer)
	if err = t.Execute(buf, data); err != nil {
		return err
	}

	fileExtension := filepath.Ext(templateFileName)
	mimeType := mime.TypeByExtension(fileExtension)
	r.mimeType = fmt.Sprintf(MIME_TYPE_TEMPLATE, mimeType)
	r.body = buf.String()
	return nil
}
