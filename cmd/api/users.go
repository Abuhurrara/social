package main

import (
	"errors"
	"github.com/Abuhurrara/social/internal/store"
	"github.com/go-chi/chi/v5"
	"net/http"
	"strconv"
)

func (app *application) getUserHandler(w http.ResponseWriter, r *http.Request) {
	idParam := chi.URLParam(r, "userID")
	userID, err := strconv.ParseInt(idParam, 10, 64)
	if err != nil {
		app.internalServerError(w, r, err)
		return
	}

	ctx := r.Context()

	user, err := app.store.Users.GetByID(ctx, userID)
	if err != nil {
		switch {
		case errors.Is(err, store.ErrNotFound):
			app.notFoundResponse(w, r, err)
		default:
			app.internalServerError(w, r, err)
		}
		return
	}

	if err := app.JsonResponse(w, http.StatusOK, user); err != nil {
		app.internalServerError(w, r, err)
		return
	}
}
