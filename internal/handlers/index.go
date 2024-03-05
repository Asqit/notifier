package handlers

import "github.com/gofiber/fiber/v2"

func Register(router fiber.Router) {
	// Notification routes ------------------->
	notifyHandler := NotifyHandler{}
	notifyRouter := router.Group("/notify")
	notifyRouter.Post("/random", notifyHandler.sendRandomMessage)
	notifyRouter.Post("/poem", notifyHandler.sendRandomPoem)
	notifyRouter.Post("/custom", notifyHandler.sendCustomMessage)
}
