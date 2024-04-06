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
	To       []string
	Subject  string
	Body     string
	MimeType string
}

// Template for mime type...usage: fmt.Sprintf(MIME_TYPE_TEMPLATE, "text/plain; charset=utf-8")
const MIME_TYPE_TEMPLATE = "MIME-version: 1.0;\nContent-Type: %s; \n\n"

func NewRequest(to []string, subject, body string) *Request {
	return &Request{
		To:       to,
		Subject:  subject,
		Body:     body,
		MimeType: fmt.Sprintf(MIME_TYPE_TEMPLATE, "text/plain; charset=utf-8"),
	}
}

func (r *Request) SendEmail() (bool, error) {
	from := GetENV("SMTP_USR")
	pass := GetENV("SMTP_PWD")
	to := r.To

	var msgBuffer bytes.Buffer
	msgBuffer.WriteString(fmt.Sprintf("From: %s\nTo: %s\nSubject: %s\n%s\n%s", from, to[0], r.Subject, r.MimeType, r.Body))

	err := smtp.SendMail(GetENV("SMTP_HOST")+":587",
		smtp.PlainAuth("", from, pass, GetENV("SMTP_HOST")),
		from, r.To, msgBuffer.Bytes())

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
	r.MimeType = fmt.Sprintf(MIME_TYPE_TEMPLATE, mimeType)
	r.Body = buf.String()
	return nil
}
