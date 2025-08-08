package store

import (
	"context"
	"database/sql"
)

type Users struct {
	ID        string `json:"id"`
	Username  string `json:"name"`
	Email     string `json:"email"`
	Password  string `json:"_"`
	CreatedAt string `json:"created_at"`
}

type UserStore struct {
	db *sql.DB
}

func (s *UserStore) Create(ctx context.Context, user *Users) error {
	query := `
INSERT INTO users (username, password, email) VALUS($1, $2, $3) RETURNING id, created_at
`
	err := s.db.QueryRowContext(
		ctx,
		query,
		user.Username,
		user.Password,
		user.Email,
	).Scan(&user.ID, &user.CreatedAt)
	if err != nil {
		return err
	}

	return nil
}
