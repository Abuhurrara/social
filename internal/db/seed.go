package db

import (
	"context"
	"fmt"
	"github.com/Abuhurrara/social/internal/store"
	"log"
	"math/rand"
)

var usernames = []string{
	"alice", "bob", "charlie", "dave", "eve",
	"frank", "grace", "heidi", "ivan", "judy",
	"karl", "louis", "mallory", "nick", "olivia",
	"peggy", "quentin", "rachel", "steve", "trent",
	"ursula", "victor", "wendy", "xavier", "yvonne",
	"zack", "amy", "brian", "carl", "diana",
	"edward", "fiona", "george", "hannah", "ian",
	"jessica", "kevin", "laura", "mike", "nina",
	"oscar", "paula", "quincy", "ruby", "sam",
	"tina", "ulysses", "violet", "will", "zoe",
}
var titles = []string{
	"Getting Started with Go",
	"Why I Love Open Source",
	"Top 5 Coding Mistakes",
	"My First Hackathon",
	"Simple Guide to REST APIs",
	"Learning SQL the Easy Way",
	"Debugging Like a Pro",
	"Writing Clean Code",
	"Git Tips for Beginners",
	"Why Testing Matters",
	"From Idea to App",
	"Deploying on Docker",
	"How I Stay Productive",
	"Lessons from a Side Project",
	"Intro to Microservices",
	"Scaling Your Web App",
	"Understanding Context in Go",
	"Async Programming Explained",
	"Design Patterns Simplified",
	"How I Fixed a Production Bug",
}

var contents = []string{
	"Today I explored Go's concurrency model and was amazed by how simple goroutines make parallel programming.",
	"I recently tried a new productivity method and it completely changed how I manage my daily tasks.",
	"Debugging a nasty bug taught me more than any tutorial could — here's what I learned.",
	"Sometimes the best way to learn is by building small side projects that solve personal problems.",
	"I set up Docker for my app today, and deployment feels way less scary now.",
	"Writing clean code is less about rules and more about empathy for future developers.",
	"This week, I experimented with SQL queries and finally understood how joins actually work.",
	"Unit testing seemed boring at first, but it saved me hours when a hidden bug showed up.",
	"Reading open source code is like peeking into another developer's brain — fascinating and humbling.",
	"I attended my first hackathon and learned more in 24 hours than in a month of study.",
	"REST APIs aren’t just about endpoints; they’re about designing predictable and usable systems.",
	"Microservices sound complex, but breaking big problems into small ones really helps.",
	"Async programming can be confusing, but once you get it, everything clicks together.",
	"Today I broke production accidentally — but fixing it taught me resilience and patience.",
	"Version control is like a time machine, and git is the best kind of magic.",
	"Working with context in Go helped me build APIs that are faster and safer.",
	"I discovered a neat design pattern today that simplified my entire codebase.",
	"Side projects often teach me more than professional work — freedom leads to creativity.",
	"Scaling an app is more about planning than coding — architecture matters!",
	"Sometimes the hardest bugs are caused by the simplest mistakes, like a missing semicolon.",
}

var tags = []string{
	"go",
	"programming",
	"webdev",
	"docker",
	"sql",
	"opensource",
	"cloud",
	"tutorial",
	"database",
	"api",
	"javascript",
	"react",
	"designpatterns",
	"microservices",
	"rest",
	"testing",
	"productivity",
	"devops",
	"opensource",
	"concurrency",
}
var comments = []string{
	"Great post! Thanks for sharing.",
	"This was super helpful, appreciate it.",
	"I didn’t quite understand the part about concurrency.",
	"Awesome explanation, keep it up!",
	"Can you write more about databases?",
	"This solved a problem I was stuck on for days.",
	"Looking forward to your next post.",
	"Interesting perspective, I learned something new.",
	"Can you also add some code examples?",
	"Love how simple you explained a complex topic.",
}

func Seed(store store.Storage) {
	ctx := context.Background()

	users := generateUsers(100)
	for _, user := range users {
		if err := store.Users.Create(ctx, user); err != nil {
			log.Printf("Failed to create user %s: %v", user, err)
			return
		}
	}

	posts := generatePosts(200, users)
	for _, post := range posts {
		if err := store.Posts.Create(ctx, post); err != nil {
			log.Printf("Failed to create post %s: %v", post, err)
			return
		}
	}

	comments := generateComments(500, users, posts)
	for _, comment := range comments {
		if err := store.Comments.Create(ctx, comment); err != nil {
			log.Printf("Failed to create comment %s: %v", comment, err)
			return
		}
	}

	fmt.Printf("Seeding Complete")
}

func generateUsers(num int) []*store.User {
	users := make([]*store.User, num)

	for i := 0; i < num; i++ {
		users[i] = &store.User{
			Username: usernames[i%len(usernames)] + fmt.Sprintf("%d", i),
			Password: "123123",
			Email:    usernames[i%len(usernames)] + fmt.Sprintf("%d", i) + "@example.com",
		}
	}

	return users
}

func generatePosts(num int, users []*store.User) []*store.Post {
	posts := make([]*store.Post, num)

	for i := 0; i < num; i++ {
		user := users[rand.Intn(len(users))]

		posts[i] = &store.Post{
			UserID:  user.ID,
			Title:   titles[rand.Intn(len(titles))],
			Content: contents[rand.Intn(len(contents))],
			Tags: []string{
				tags[rand.Intn(len(tags))],
				tags[rand.Intn(len(tags))],
				tags[rand.Intn(len(tags))],
			},
		}
	}

	return posts
}

func generateComments(num int, users []*store.User, posts []*store.Post) []*store.Comments {
	cms := make([]*store.Comments, num)

	for i := 0; i < num; i++ {
		cms[i] = &store.Comments{
			UserID:  users[rand.Intn(len(users))].ID,
			PostID:  posts[rand.Intn(len(posts))].ID,
			Content: comments[rand.Intn(len(comments))],
		}
	}

	return cms
}
