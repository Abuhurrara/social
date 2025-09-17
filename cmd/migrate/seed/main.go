package main

import (
	"log"

	"github.com/Abuhurrara/social/internal/db"
	"github.com/Abuhurrara/social/internal/env"
	store2 "github.com/Abuhurrara/social/internal/store"
)

func main() {
	addr := env.GetString("DB_ADDR", "postgres://admin:adminpassword@localhost/socialnetwork?sslmode=disable")
	conn, err := db.New(addr, 3, 3, "15m")
	if err != nil {
		log.Fatal(err)
	}
	defer conn.Close()

	store := store2.NewStorage(conn)

	db.Seed(store, conn)
}
