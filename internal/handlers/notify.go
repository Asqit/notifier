package handlers

import (
	"log"
	"math/rand"
	"net/http"
	"os"

	"github.com/asqit/notifier/internal/utils"
	"github.com/gofiber/fiber/v2"
)

type NotifyHandler struct{}

type PassphrasePayload struct {
	Passphrase string `json:"passphrase"`
}
type RandomMessage struct {
	Title       string
	Paragraph_1 string
	Paragraph_2 string
	Paragraph_3 string
	Signature   string
}

// TODO: Refactor this handler
func (handler *NotifyHandler) sendRandomMessage(c *fiber.Ctx) error {
	var payload = new(PassphrasePayload)
	if err := c.BodyParser(payload); err != nil {
		return c.SendStatus(http.StatusBadRequest)
	}

	passphrase := utils.GetENV("PASSPHRASE")
	if payload.Passphrase != passphrase {
		return c.SendStatus(http.StatusUnauthorized)
	}

	messages := utils.ReadMessages()
	message := messages.Messages[rand.Intn(len(messages.Messages))]
	path, err := os.Getwd()

	if err != nil {
		log.Fatalf("directory %v does not exists", err)
		return c.SendStatus(http.StatusInternalServerError)
	}

	mail := utils.NewRequest([]string{"ondrejtucek9@gmail.com"}, "Myslím na Tebe", "")
	body := RandomMessage{
		Title:       "Milá Míšo",
		Paragraph_1: message[0],
		Paragraph_2: message[1],
		Paragraph_3: message[2],
		Signature:   message[3],
	}
	err = mail.ParseTemplate(path+"/assets/templates/random_message.html", body)
	if err != nil {
		return c.SendStatus(http.StatusInternalServerError)
	}

	// TODO: This call is taking longest time of the whole request
	// find a better/faster way to send an email.
	ok, err := mail.SendEmail()

	if err != nil {
		return c.SendStatus(http.StatusInternalServerError)
	}

	if !ok {
		return c.SendStatus(http.StatusUnauthorized)
	}

	return c.Status(http.StatusCreated).JSON(fiber.Map{
		"message": message,
	})
}

// TODO: Finish implementation
func (handler *NotifyHandler) sendRandomPoem(c *fiber.Ctx) error {
	return c.SendStatus(http.StatusNotImplemented)
}

// TODO: Finish implementation
func (handler *NotifyHandler) sendCustomMessage(c *fiber.Ctx) error {
	return c.SendStatus(http.StatusNotImplemented)
}
