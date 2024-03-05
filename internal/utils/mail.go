package utils

import (
	"bytes"
	"html/template"
	"log"
	"net/smtp"
)

type Request struct {
	to      []string
	subject string
	body    string
}

func NewRequest(to []string, subject, body string) *Request {
	return &Request{
		to:      to,
		subject: subject,
		body:    body,
	}
}

func (r *Request) SendEmail() (bool, error) {
	from := GetENV("SMTP_USR")
	pass := GetENV("SMTP_PWD")
	to := GetENV("RECEIVER")

	mime := "MIME-version: 1.0;\nContent-Type: text/html; charset=\"UTF-8\";\n\n"
	msg := "From: " + from + "\n" +
		"To: " + to + "\n" +
		"Subject: " + r.subject + "\n" + mime + "\n" +
		r.body

	err := smtp.SendMail(GetENV("SMTP_HOST")+":587",
		smtp.PlainAuth("", from, pass, GetENV("SMTP_HOST")),
		from, []string{to}, []byte(msg))

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
	r.body = buf.String()
	return nil
}
