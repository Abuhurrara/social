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
		GetByID(context.Context, int64) (*Posts, error)
	}
	Comments interface {
		GetByPostID(context.Context, int64) ([]Comment, error)
	}
}

func NewStorage(db *sql.DB) Storage {
	return Storage{
		Users:    &UserStore{db},
		Posts:    &PostStore{db},
		Comments: &CommentStore{db},
	}
}
