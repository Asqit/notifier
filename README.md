# Notifier - API

An API part of my new notifier application. This application aims to let your close ones notified, that you are thinking about them. 


## Running locally 


### Install 

I recommend using Python's virtual environment to keep your dependencies separated and thus keeping your OS clean.

```shell
$ git clone https://github.com/Asqit/notifier
$ cd ./notifier
$ python -m venv <environment-name> # optional, good to keep dependencies separated
$ source ./<environment-name>/bin/activate # only with the previous optional step fulfilled
$ pip install -r ./requirements.txt
```


### Running

We are using invoke tool to make separate scripts, similar to package.json in node.js. 

```shell
$ source ./<environment-name>/bin/activate # activate the virtual environment (optional, only if you use it)
$ inv dev # starts the development server
```

<details>
<summary>other scripts</summary>

- `add`: installs a dependency and creates a lock file. 
    - **syntax:** `$ inv add fastapi-pagination`
    
- `dev`: starts the development server on port `8000`
    - **syntax:** `$ inv dev`
</details>