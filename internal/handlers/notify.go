package handlers

import (
	"fmt"
	"math/rand"
	"net/http"

	"github.com/asqit/notifier/internal/models"
	"github.com/asqit/notifier/internal/utils"
	"github.com/gofiber/fiber/v2"
)

type NotifyHandler struct{}

var TO = []string{utils.GetENV("RECEIVER")}
var WORKING_DIRECTORY_PATH = utils.GetWd()
var PASSPHRASE = utils.GetENV("PASSPHRASE")

func (handler *NotifyHandler) sendRandomMessage(c *fiber.Ctx) error {
	var payload = new(models.PassphraseBody)
	if err := c.BodyParser(payload); err != nil {
		return c.SendStatus(http.StatusBadRequest)
	}

	if payload.Passphrase != PASSPHRASE {
		return c.SendStatus(http.StatusUnauthorized)
	}

	messages := utils.ParseJSON[models.MessagesAsset](WORKING_DIRECTORY_PATH + "/assets/messages.json")
	message := messages.Messages[rand.Intn(len(messages.Messages))]

	mail := utils.NewRequest(TO, "You're in my mind right now 💭❤️", "")
	body := models.RandomMessageAsset{
		Title:       "Milá Míšo",
		Paragraph_1: message[0],
		Paragraph_2: message[1],
		Paragraph_3: message[2],
		Signature:   message[3],
	}
	err := mail.ParseTemplate(WORKING_DIRECTORY_PATH+"/assets/templates/random_message.html", body)
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

// POST /custom
func (handler *NotifyHandler) sendCustomMessage(c *fiber.Ctx) error {
	var payload = new(models.CustomMessageBody)
	if err := c.BodyParser(&payload); err != nil {
		return c.SendStatus(http.StatusBadRequest)
	}

	if PASSPHRASE != payload.Passphrase {
		return c.SendStatus(http.StatusUnauthorized)
	}

	mail := utils.NewRequest(TO, "Myslím na Tebe", "")
	mail.ParseTemplate(WORKING_DIRECTORY_PATH+"/assets/templates/custom_message.html", models.CustomMessageBody{
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
	var payload = new(models.PassphraseBody)
	if err := c.BodyParser(&payload); err != nil {
		return c.SendStatus(http.StatusBadRequest)
	}

	if payload.Passphrase != PASSPHRASE {
		return c.SendStatus(http.StatusUnauthorized)
	}

	poems := utils.ParseJSON[models.PoemsAsset](WORKING_DIRECTORY_PATH + "/assets/poems.json")
	selectedPoem := poems.Poems[rand.Intn(len(poems.Poems))]

	mail := utils.NewRequest(TO, "Few lines, that may cheer you up a bit", "")
	mail.Body = utils.ParsePoem(WORKING_DIRECTORY_PATH+"/assets/templates/poem.html", selectedPoem)
	mail.MimeType = fmt.Sprintf(utils.MIME_TYPE_TEMPLATE, "text/html; charset=utf-8")
	ok, err := mail.SendEmail()

	if err != nil {
		return c.SendStatus(http.StatusInternalServerError)
	}

	if !ok {
		return c.SendStatus(http.StatusUnauthorized)
	}

	return c.SendStatus(http.StatusCreated)
}
