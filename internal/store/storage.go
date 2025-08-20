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
		Create(ctx context.Context, user *User) error
	}
	Posts interface {
		Create(ctx context.Context, post *Posts) error
		GetByID(context.Context, int64) (*Posts, error)
		Delete(context.Context, int64) error
	}
	Comments interface {
		GetByPostID(context.Context, int64) ([]Comments, error)
	}
}

func NewStorage(db *sql.DB) Storage {
	return Storage{
		Users:    &UserStore{db},
		Posts:    &PostStore{db},
		Comments: &CommentsStore{db},
	}
}
