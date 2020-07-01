<img src="https://raw.githubusercontent.com/cloudmax94/cadence.link/master/static/img/logo.png" alt="cadence.link" width="268">

Documentation site for Cadence of Hyrule, with focus on going fast.

## Contributing

For now pull requests shall only contain changes and additions to content and images.

## Branches

The ``master`` branch is where the site is automatically built from.

## Build

cadence.link is built with [Hugo](https://gohugo.io/getting-started/installing/), make sure that you have it installed first.

To view the site locally, you first need to clone this repository:
```bash
git clone https://github.com/CloudMax94/cadence.link.git
```

Next you need to install the local JavaScript packages:
```bash
npm install
```

Hugo also requires the ``postcss-cli`` JavaScript package to be installed in the environment:
```bash
npm install -g postcss-cli
```

Then to view the site in your browser, run Hugo and open up the link:

```bash
▶ hugo server

Started building sites ...
.
.
Serving pages from memory
Web Server is available at http://localhost:1313/ (bind address 127.0.0.1)
Press Ctrl+C to stop
```
