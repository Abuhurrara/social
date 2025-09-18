package mailer

const (
	FromName = "SocialNetwork"
)

type Client interface {
	Send(templateFile, username, email string, data any, isSanbox bool) error
}

// Hey {username}, with {email}
