# Remix Barcode Scanner

A barcode scanner demo in Remix.

It uses [Dynamsoft Barcode Reader](https://www.dynamsoft.com/barcode-reader/overview/) to scan barcodes.

To illustrate Remix's features, the demo scans the ISBN barcodes, gets the book info, and saves them to a PostgreSQL database.

[Online Demo deployed on Vercel](https://remix-barcode-scanner.vercel.app/)

## Demo Videos

New Book Record:

https://github.com/tony-xlh/remix-barcode-scanner/assets/5462205/ca85c047-af6e-4771-bc59-21a9dc2d8e38

Edit a Book Record:

https://github.com/tony-xlh/remix-barcode-scanner/assets/5462205/5665d91f-a163-4724-b826-52bf0c597b77

Delete a Book Record:

https://github.com/tony-xlh/remix-barcode-scanner/assets/5462205/177ba2df-0c16-484d-b3a4-c9c45c1234ba

## Development

From your terminal:

```sh
npm run dev
```

This starts your app in development mode, rebuilding assets on file changes.

## Deployment

First, build your app for production:

```sh
npm run build
```

Then run the app in production mode:

```sh
npm start
```

Now you'll need to pick a host to deploy it to.

### DIY

If you're familiar with deploying node applications, the built-in Remix app server is production-ready.

Make sure to deploy the output of `remix build`

- `build/`
- `public/build/`
