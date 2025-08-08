package store

import (
	"context"
	"database/sql"
)

type Storage struct {
	Users interface {
		Create(ctx context.Context, user *Users) error
	}
	Posts interface {
		Create(ctx context.Context, post *Posts) error
	}
}

func NewStorage(db *sql.DB) Storage {
	return Storage{
		Users: &UserStore{db},
		Posts: &PostStore{db},
	}
}
