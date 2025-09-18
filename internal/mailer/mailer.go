package mailer

const (
	FromName   = "SocialNetwork"
	maxRetries = 3
)

type Client interface {
	Send(templateFile, username, email string, data any, isSanbox bool) error
}

// Hey {username}, with {email}
