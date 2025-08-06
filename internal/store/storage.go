package store

import (
	"context"
	"database/sql"
)

type Storage struct {
	Users interface {
		Create(ctx context.Context) error
	}
	Posts interface {
		Create(ctx context.Context, post *Posts) error
	}
}

func NewStorage(db *sql.DB) Storage {
	return Storage{
		Users: &UsersStore{db},
		Posts: &PostStore{db},
	}
}
