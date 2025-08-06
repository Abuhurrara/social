package main

import (
	"github.com/Abuhurrara/social/internal/env"
	store2 "github.com/Abuhurrara/social/internal/store"
	"github.com/joho/godotenv"
	"log"
)

func main() {
	err := godotenv.Load()
	if err != nil {
		log.Fatal("Error loading .env file")
	}

	store := store2.NewStorage(nil)

	cfg := config{
		address: env.GetString("ADDR", ":8080"),
	}

	app := &application{
		config: cfg,
		store:  store,
	}

	mux := app.mount()

	log.Fatal(app.run(mux))
}
