package models

type PassphrasePayload struct {
	Passphrase string `json:"passphrase"`
}

type RandomMessage struct {
	Title       string
	Paragraph_1 string
	Paragraph_2 string
	Paragraph_3 string
	Signature   string
}

type CustomMessagePayload struct {
	Title      string `json:"title"`
	Message    string `json:"message"`
	Signature  string `json:"signature"`
	Passphrase string `json:"passphrase"`
}
