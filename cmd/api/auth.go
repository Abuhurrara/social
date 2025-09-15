package main

import (
	"fmt"
	"net/http"

	"github.com/Abuhurrara/social/internal/store"
)

type RegisterUserPayload struct {
	Username string `json:"username" validate:"required,max=100"`
	Password string `json:"password" validate:"required,min=3,max=72"`
	Email    string `json:"email" validate:"required,max=255,email"`
}

// registerUserHandler godoc
//
//	@Summary		Register a user
//	@Description	Registers a user
//	@Tags			authentication
//	@Accept			json
//	@Produce		json
//	@Param			payload	body		RegisterUserPayload	true	"User credentials"
//	@Success		201		{object}	store.User			"User registered"
//	@Failure		400		{object}	error
//	@Failure		500		{object}	error
//	@Router			/authentication/user [post]
func (app *application) registerUserHandler(w http.ResponseWriter, r *http.Request) {
	var payload RegisterUserPayload
	fmt.Println("Payload CHECK1", payload)
	if err := readJson(w, r, &payload); err != nil {
		app.badRequestResponse(w, r, err)
		return
	}

	fmt.Println("Payload CHECK2", payload)

	if err := Validate.Struct(payload); err != nil {
		app.badRequestResponse(w, r, err)
		return
	}

	user := &store.User{
		Username: payload.Username,
		Email:    payload.Email,
	}

	fmt.Println("user CHECK3", user)

	// hash the password
	if err := user.Password.Set(payload.Password); err != nil {
		app.badRequestResponse(w, r, err)
		return
	}

	// store the user

	if err := app.JsonResponse(w, http.StatusCreated, nil); err != nil {
		app.internalServerError(w, r, err)
	}
}
