package cache

import (
	"context"
	"github.com/Abuhurrara/social/internal/store"
	"github.com/go-redis/redis/v8"
)

type UserStore struct {
	rdb *redis.Client
}

func (s *UserStore) Get(ctx context.Context, userID int64) (*store.User, error) {

}

func (s *UserStore) Set(ctx context.Context, user *store.User) error {
	
}
