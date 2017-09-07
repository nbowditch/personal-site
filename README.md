# webpack-base

Template for a new webpack app with a few simple test examples laid out.

*Note:* This was developed on Windows. The only thing Windows-specific is the setting of environment variables in the webpack config file.

## Setup

- Make sure you have node and npm installed
- Run `npm install` in the root directory

## Scripts

- `npm run dev` will set up a webpack dev server on localhost:8080. The server uses hot module reloading, so edits you make to modules in the `/src` directory will be automatically recompiled into `dist/bundle.js` and loaded into the browser upon saving. Source maps are enabled for easier debugging.
- `npm run build` will compile and minify source files into a hashed bundle without any of the webpack dev server stuff to make it more lightweight. I may add a simple web server to this project later; otherwise you will need to run your own http server.

## Credits

This project was created by following along with Emil Oberg's tutorial found [here](https://www.youtube.com/watch?v=eWmkBNBTbMM).
