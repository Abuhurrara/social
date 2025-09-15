package main

import (
	"net/http"
)

type RegisterUserPayload struct {
	Username string `json:"username" validate:"required,max=100"`
	Password string `json:"password" validate:"required,min=3,max=72"`
	Email    string `json:"email" validate:"required,max=255,email"`
}

// registerUserHandler godoc
//
//	@Summary Register a user
//	@Description Registers a user
//	@Tags authentication
//	@Accept			json
//	@Produce		json
//	@Param payload body RegisterUserPayload "User credentials"
//	@Success		201	{object}	store.User	"User registered"
//	@Failure		400		{object}	error
//	@Failure		500		{object}	error
//	@Router			/authentication/user [post]
func (app *application) registerUserHandler(w http.ResponseWriter, r *http.Request) {
	var payload RegisterUserPayload
	if err := readJson(w, r, &payload); err != nil {
		app.badRequestResponse(w, r, err)
		return
	}

	if err := Validate.Struct(payload); err != nil {
		app.badRequestResponse(w, r, err)
		return
	}
}
