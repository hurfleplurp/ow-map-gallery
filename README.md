# Overwatch Map Gallery

Minimal static gallery for high-resolution Overwatch maps hosted on Google Drive.

## Local preview

Open `index.html` directly, or run a simple static server:

```bash
npx serve .
```

## Add more maps

Edit `app.js` and add new map objects to the `maps` array:

```js
{
  name: "Map Name",
  mode: "Mode",
  imageUrl: "https://lh3.googleusercontent.com/d/YOUR_IMAGE_ID"
}
```

## Deploy to Vercel

1. Push this folder to a Git repository.
2. Import the repository in Vercel.
3. Framework preset: `Other`.
4. Build command: leave empty.
5. Output directory: leave empty.

Because this is a static site, Vercel will serve the files directly.
