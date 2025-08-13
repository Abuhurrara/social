package store

import (
	"context"
	"database/sql"
	"errors"
)

var (
	ErrNotFound = errors.New("record not found")
)

type Storage struct {
	Users interface {
		Create(ctx context.Context, user *Users) error
	}
	Posts interface {
		Create(ctx context.Context, post *Posts) error
		GetByID(ctx context.Context, postID int64) (*Posts, error)
	}
}

func NewStorage(db *sql.DB) Storage {
	return Storage{
		Users: &UserStore{db},
		Posts: &PostStore{db},
	}
}
