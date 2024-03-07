package main

import (
	"log"

	"github.com/asqit/notifier/internal/handlers"
	"github.com/asqit/notifier/internal/utils"
	"github.com/gofiber/fiber/v2"
	"github.com/gofiber/fiber/v2/middleware/cors"
	"github.com/gofiber/fiber/v2/middleware/helmet"
	"github.com/gofiber/fiber/v2/middleware/logger"
)

func main() {
	app := fiber.New()
	app.Use(cors.New())
	app.Use(helmet.New())
	app.Use(logger.New(logger.Config{
		Format: "[${ip}]:${port} ${status} - ${method} ${path}\n",
	}))

	app.Static("/", "./public")

	api := app.Group("/api")
	handlers.Register(api)

	port := utils.GetENV("PORT")
	if port == "" {
		port = ":8080"
	}

	log.Fatal(app.Listen(port))
}
