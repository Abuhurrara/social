package main

import (
	"testing"

	"github.com/Abuhurrara/social/internal/store"
	"go.uber.org/zap"
)

func NewTestApplication(t *testing.T) *application {
	t.Helper()

	logger := zap.Must(zap.NewProduction()).Sugar()
	mockStore := store.NewMockStore{}

	return &application{
		logger: logger,
		store:  mockStore,
	}
}
