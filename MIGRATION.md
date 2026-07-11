# Replacing the current Vite site in GitHub Codespaces

## 1. Create a safety branch

```bash
git switch -c rebuild/multiverse-archive
```

## 2. Preserve the original images

```bash
mkdir -p /tmp/michael-dinko-assets
cp public/Cover_*.webp /tmp/michael-dinko-assets/
cp public/author.jpeg /tmp/michael-dinko-assets/
```

## 3. Remove the old application files

Do not remove `.git`.

```bash
rm -rf src dist node_modules
rm -f index.html vite.config.* eslint.config.* postcss.config.*
```

## 4. Copy this rebuild into the repository root

Extract the ZIP and copy all included files and folders into the repository root.

Then restore the original images:

```bash
cp /tmp/michael-dinko-assets/* public/
```

## 5. Install and test

```bash
npm install
npm run check
npm run build
npm run dev -- --host 0.0.0.0
```

## 6. Commit only after checking desktop and mobile previews

```bash
git add -A
git commit -m "Rebuild author portfolio as multiverse archive"
git push -u origin rebuild/multiverse-archive
```

Create a pull request into `main` after the preview is approved.
