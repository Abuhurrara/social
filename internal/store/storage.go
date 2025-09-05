package store

import (
	"context"
	"database/sql"
	"errors"
	"time"
)

var (
	ErrNotFound          = errors.New("record not found")
	ErrConflict          = errors.New("resource already exists")
	QueryTimeoutDuration = time.Second * 5
)

type Storage struct {
	Users interface {
		GetByID(context.Context, int64) (*User, error)
		Create(ctx context.Context, user *User) error
	}
	Posts interface {
		Create(ctx context.Context, post *Posts) error
		GetByID(context.Context, int64) (*Posts, error)
		Delete(context.Context, int64) error
		Update(context.Context, *Posts) error
	}
	Comments interface {
		Create(context.Context, *Comments) error
		GetByPostID(context.Context, int64) ([]Comments, error)
	}
	Followers interface {
		Follow(ctx context.Context, followerID, UserID int64) error
		Unfollow(ctx context.Context, followerID, userID int64) error
	}
}

func NewStorage(db *sql.DB) Storage {
	return Storage{
		Users:     &UserStore{db},
		Posts:     &PostStore{db},
		Comments:  &CommentsStore{db},
		Followers: &FollowerStore{db},
	}
}
