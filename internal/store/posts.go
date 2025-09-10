package store

import (
	"context"
	"database/sql"
	"errors"
	"github.com/lib/pq"
)

type Post struct {
	ID        int64      `json:"id"`
	Content   string     `json:"content"`
	Title     string     `json:"title"`
	UserID    int64      `json:"user_id"`
	Tags      []string   `json:"tags"`
	CreatedAt string     `json:"created_at"`
	UpdatedAt string     `json:"updated_at"`
	Version   int        `json:"version"`
	Comments  []Comments `json:"comments"`
	User      User       `json:"user"`
}

type PostWithMetadata struct {
	Post
	CommentsCount int `json:"comments_count"`
}
type PostStore struct {
	db *sql.DB
}

func (s *PostStore) GetUserFeed(ctx context.Context, userId int64, fq PaginatedFeedQuery) ([]PostWithMetadata, error) {
	query := `
		SELECT
		  p.id,
		  p.content,
		  p.title,
		  p.created_at,
		  p.user_id,
		  p.version,
		  p.tags,
		  u.username,
		  count(c.id) AS comments_count
		FROM
		  posts p
		  LEFT JOIN comments c ON c.post_id = p.id
		  LEFT JOIN users u ON p.user_id = u.id
		  JOIN followers f ON f.follower_id = p.user_id
		  OR p.user_id = $1
		WHERE
		  f.user_id = $1
		  OR p.user_id = $1
		GROUP BY
		  p.id,
		  u.username
		ORDER BY
		  p.created_at ` + fq.Sort + `
		LIMIT $2 OFFSET $3
`

	ctx, cancel := context.WithTimeout(ctx, QueryTimeoutDuration)
	defer cancel()

	rows, err := s.db.QueryContext(ctx, query, userId, fq.Limit, fq.Offset)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	var feed []PostWithMetadata
	for rows.Next() {
		var p PostWithMetadata
		err := rows.Scan(
			&p.ID,
			&p.Content,
			&p.Title,
			&p.CreatedAt,
			&p.UserID,
			&p.Version,
			pq.Array(&p.Tags),
			&p.User.Username,
			&p.CommentsCount,
		)
		if err != nil {
			return nil, err
		}

		feed = append(feed, p)
	}

	return feed, nil
}

func (s *PostStore) Create(ctx context.Context, post *Post) error {
	query := `
		INSERT INTO posts (content, title, user_id, tags)
		VALUES ($1, $2, $3, $4) RETURNING id, created_at, updated_at
	`

	ctx, cancel := context.WithTimeout(ctx, QueryTimeoutDuration)
	defer cancel()

	err := s.db.QueryRowContext(ctx, query,
		post.Content,
		post.Title,
		post.UserID,
		pq.Array(post.Tags),
	).Scan(
		&post.ID,
		&post.CreatedAt,
		&post.UpdatedAt,
	)
	if err != nil {
		return err
	}

	return nil
}

func (s *PostStore) GetByID(ctx context.Context, postId int64) (*Post, error) {
	query := `
		SELECT id, content, title, user_id, created_at, updated_at, tags, version
		FROM posts
		WHERE id = $1
`
	ctx, cancel := context.WithTimeout(ctx, QueryTimeoutDuration)
	defer cancel()

	var post Post
	err := s.db.QueryRowContext(ctx, query, postId).Scan(
		&post.ID,
		&post.Content,
		&post.Title,
		&post.UserID,
		&post.CreatedAt,
		&post.UpdatedAt,
		pq.Array(&post.Tags),
		&post.Version,
	)
	if err != nil {
		switch {
		case errors.Is(err, sql.ErrNoRows):
			return nil, ErrNotFound
		default:
			return nil, err
		}
	}

	return &post, nil
}

func (s *PostStore) Delete(ctx context.Context, postId int64) error {
	query := `
		DELETE FROM posts
		WHERE id = $1
`
	ctx, cancel := context.WithTimeout(ctx, QueryTimeoutDuration)
	defer cancel()

	res, err := s.db.ExecContext(ctx, query, postId)
	if err != nil {
		return err
	}

	rows, err := res.RowsAffected()
	if err != nil {
		return err
	}

	if rows == 0 {
		return ErrNotFound
	}

	return nil
}

func (s *PostStore) Update(ctx context.Context, post *Post) error {
	query := `
		UPDATE posts
		SET content = $1, title = $2, version = version + 1
		WHERE id = $3 AND version = $4
		RETURNING version
`
	ctx, cancel := context.WithTimeout(ctx, QueryTimeoutDuration)
	defer cancel()

	err := s.db.QueryRowContext(
		ctx,
		query,
		post.Content,
		post.Title,
		post.ID,
		post.Version,
	).Scan(
		&post.Version,
	)
	if err != nil {
		switch {
		case errors.Is(err, sql.ErrNoRows):
			return ErrNotFound
		default:
			return err
		}
	}

	return nil
}
