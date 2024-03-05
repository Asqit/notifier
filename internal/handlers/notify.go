package handlers

import (
	"math/rand"
	"net/http"

	"github.com/asqit/notifier/internal/utils"
	"github.com/gofiber/fiber/v2"
)

type NotifyHandler struct{}

type PassphrasePayload struct {
	Passphrase string `json:"passphrase"`
}

func (handler *NotifyHandler) sendRandomMessage(c *fiber.Ctx) error {
	data := new(PassphrasePayload)

	if err := c.BodyParser(data); err != nil {
		return c.Status(http.StatusBadRequest).JSON(fiber.Map{
			"message": "bad request!",
		})
	}

	messages := utils.ReadMessages()
	i := rand.Intn(len(messages.Messages))

	return c.Status(http.StatusCreated).JSON(fiber.Map{
		"data": messages.Messages[i],
	})
}

func (handler *NotifyHandler) sendRandomPoem(c *fiber.Ctx) error {
	return c.SendStatus(http.StatusNotImplemented)
}

func (handler *NotifyHandler) sendCustomMessage(c *fiber.Ctx) error {
	return c.SendStatus(http.StatusNotImplemented)
}
