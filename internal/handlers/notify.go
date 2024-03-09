package handlers

import (
	"log"
	"math/rand"
	"net/http"
	"os"

	"github.com/asqit/notifier/internal/models"
	"github.com/asqit/notifier/internal/utils"
	"github.com/gofiber/fiber/v2"
)

type NotifyHandler struct{}

var TO = []string{utils.GetENV("RECEIVER")}

func (handler *NotifyHandler) sendRandomMessage(c *fiber.Ctx) error {
	var payload = new(models.PassphrasePayload)
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

	mail := utils.NewRequest(TO, "Myslím na Tebe", "")
	body := models.RandomMessage{
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

func (handler *NotifyHandler) sendCustomMessage(c *fiber.Ctx) error {
	var payload = new(models.CustomMessagePayload)
	if err := c.BodyParser(&payload); err != nil {
		return c.SendStatus(http.StatusBadRequest)
	}

	passphrase := utils.GetENV("PASSPHRASE")
	if passphrase != payload.Passphrase {
		return c.SendStatus(http.StatusUnauthorized)
	}

	path, err := os.Getwd()
	if err != nil {
		return c.SendStatus(http.StatusInternalServerError)
	}

	mail := utils.NewRequest(TO, "Myslím na Tebe", "")
	mail.ParseTemplate(path+"/assets/templates/custom_message", models.CustomMessagePayload{
		Title:     payload.Title,
		Message:   payload.Message,
		Signature: payload.Signature,
	})

	ok, err := mail.SendEmail()
	if err != nil {
		return c.SendStatus(http.StatusUnauthorized)
	}

	if !ok {
		return c.SendStatus(http.StatusInternalServerError)
	}

	return c.SendStatus(http.StatusCreated)
}

// TODO: Finish implementation
func (handler *NotifyHandler) sendRandomPoem(c *fiber.Ctx) error {
	return c.SendStatus(http.StatusNotImplemented)
}
