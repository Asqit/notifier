# Notifier

Notifier is a simple web application, which purpose is to notify your love partner, that you are thinking about them. I tried making the application in the minimal tech. stack. Api is written in `Golang` and client-side is not bundled or anything, it's plain `JavaScript` with `Arrow.js` to make up for interactivity. The whole app is styled with `UnoCSS`.

## Running on your own

```shell
$ git clone https://github.com/asqit/notifier
$ cd ./notifier
$ cat env.txt >> .env       # create '.env' file with contents of env.txt
$ $EDITOR .env              # edit the '.env' file (esc + ':wq' + enter 😉)
```

### Locally

You can run the app locally without the need of a docker engine. To do so, you need a [golang compiler](https://go.dev/doc/install).

```shell
$ go mod download   # download modules
$ go run .          # run the app in "dev" mode
```

### Image

```shell
$ docker build -t notifier-app .
```
