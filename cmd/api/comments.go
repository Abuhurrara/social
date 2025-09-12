package main

import (
	"errors"
	"net/http"

	"github.com/Abuhurrara/social/internal/store"
)

type createCommentPayload struct {
	Content string `json:"content" validate:"required,max=500"`
}

func (app *application) createCommentHandler(w http.ResponseWriter, r *http.Request) {
	post := getPostFromContext(r)

	var payload createCommentPayload
	if err := readJson(w, r, &payload); err != nil {
		app.badRequestResponse(w, r, err)
		return
	}

	if err := Validate.Struct(payload); err != nil {
		app.badRequestResponse(w, r, err)
		return
	}

	// Check if post exists
	_, err := app.store.Posts.GetByID(r.Context(), post.ID)
	if err != nil {
		if errors.Is(err, store.ErrNotFound) {
			app.notFoundResponse(w, r, err)
			return
		} else {
			app.internalServerError(w, r, err)
		}
		return
	}

	comment := &store.Comments{
		PostID:  post.ID,
		Content: payload.Content,
		UserID:  post.UserID,
	}

	if err := app.store.Comments.Create(r.Context(), comment); err != nil {
		app.internalServerError(w, r, err)
		return
	}

	if err := app.JsonResponse(w, http.StatusOK, comment); err != nil {
		app.internalServerError(w, r, err)
		return
	}
}
