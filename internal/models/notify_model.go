package models

type PassphraseBody struct {
	Passphrase string `json:"passphrase"`
}

type CustomMessageBody struct {
	Title      string `json:"title"`
	Message    string `json:"message"`
	Signature  string `json:"signature"`
	Passphrase string `json:"passphrase"`
}

type MessagesAsset struct {
	Messages [][]string `json:"messages"`
}

type PoemsAsset struct {
	Poems []string `json:"poems"`
}

type RandomMessageAsset struct {
	Title       string
	Paragraph_1 string
	Paragraph_2 string
	Paragraph_3 string
	Signature   string
}
