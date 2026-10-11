# Contributing

Thanks for helping improve the Driftleaf extension catalog.

## Propose a change

- Use the issue forms to report a problem or suggest an extension.
- For code changes, open a pull request and describe what users will see.
- Do not include private notes, database contents, or other personal vault data
  in issues, pull requests, or screenshots.

## Add or update an extension

1. Put each standalone extension in `extensions/` as a `.js` file.
2. Use the `window.driftleafExtension` API documented in the
   [Driftleaf extension guide](https://github.com/AetherAssembly/Driftleaf/blob/main/docs/EXTENSIONS.md).
3. Use DOM `textContent` for vault data; do not inject note or database content
   as HTML.
4. Request only the data the extension needs, and explain its behavior and
   required access in the pull request.
5. Check JavaScript syntax locally with `node --check extensions/<file>.js`.
   The pull request workflow checks all extension files automatically.

## Publish an extension

After a change is ready, push a version tag such as `v1.0.0`. The release
workflow checks the extension files and creates a GitHub Release with each
`.js` file attached as an individual asset, plus a `checksums.txt` manifest
containing the SHA-256 checksum of each extension. Driftleaf discovers stable
releases (not drafts or prereleases) and lists their JavaScript assets in the
in-app extension gallery. Tags with a hyphen, such as `v1.1.0-rc.1`, create
prereleases and are not listed in the gallery.
