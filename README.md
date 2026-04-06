# Johannes Sluis Portfolio

This project is a Create React App portfolio site with a dedicated SSH portfolio page at `/ssh-portfolio`.

## SSH terminal embed

The SSH page can embed a hosted browser terminal that connects to the real SSH portfolio through a separate service such as WeTTY or WebSSH2.

Set these environment variables before running or building the app:

```bash
REACT_APP_SSH_TERMINAL_URL=https://terminal.joesluis.dev
REACT_APP_SSH_TERMINAL_EMBED_MODE=iframe
# Optional
REACT_APP_SSH_TERMINAL_HEALTHCHECK_URL=https://terminal.joesluis.dev/healthz
```

Notes:

- `REACT_APP_SSH_TERMINAL_URL` must be an absolute `http` or `https` URL.
- The frontend only supports `iframe` embed mode right now.
- If the terminal service is missing or slow to load, the page falls back to the plain `ssh joesluis.dev` command.

## Available Scripts

In the project directory, you can run:

### `npm start`

Runs the app in the development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in your browser.

The page will reload when you make changes.\
You may also see any lint errors in the console.

### `npm test`

Launches the test runner in the interactive watch mode.\
See the section about [running tests](https://facebook.github.io/create-react-app/docs/running-tests) for more information.

### `npm run build`

Builds the app for production to the `build` folder.\
It correctly bundles React in production mode and optimizes the build for the best performance.
