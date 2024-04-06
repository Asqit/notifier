package handlers

import "github.com/gofiber/fiber/v2"

func Register(router fiber.Router) {
	// Health check route ------------------->
	router.Get("/health", func(c *fiber.Ctx) error {
		return c.SendString("OK")
	})

	// Notification routes ------------------->
	notifyHandler := NotifyHandler{}
	notifyRouter := router.Group("/notify")
	notifyRouter.Post("/random", notifyHandler.sendRandomMessage)
	notifyRouter.Post("/poem", notifyHandler.sendRandomPoem)
	notifyRouter.Post("/custom", notifyHandler.sendCustomMessage)
}
