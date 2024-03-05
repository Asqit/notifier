package main

import (
	"log"

	"github.com/asqit/notifier/internal/handlers"
	"github.com/asqit/notifier/internal/utils"
	"github.com/gofiber/fiber/v2"
	"github.com/gofiber/fiber/v2/middleware/cors"
)

func main() {
	app := fiber.New()
	app.Use(cors.New())

	app.Static("/", "./public")

	api := app.Group("/api")
	api.Get("/", func(c *fiber.Ctx) error {
		return c.SendString("Hello, World!")
	})

	handlers.Register(api)
	port := utils.GetENV("PORT")
	log.Fatal(app.Listen(port))
}
