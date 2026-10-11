# Driftleaf Extensions

Discover small community-built tools for working with your Driftleaf notes and
databases.

## Browse and install

Open the **Extensions** gallery in Driftleaf to browse available extensions.
Choose an extension to preview its source, then install it from the gallery.
Extensions run as code, so review the preview and grant only the vault access
you are comfortable sharing. Installed extensions start without vault
permissions; they can only read data after you explicitly grant access.

You can also download an individual `.js` file from the
[Releases](https://github.com/AetherAssembly/Driftleaf-Extensions/releases)
page and import it from Driftleaf's Extensions screen. ZIP imports are not
supported. Each release also includes a `checksums.txt` file with SHA-256
checksums for its extension files, for integrity verification by Driftleaf or
other tools.

## Available extensions

| Extension | What it does |
| --- | --- |
| **Daily Notes** | Finds notes with date-like (`YYYY-MM-DD`) titles and lets you preview their contents. |
| **Tag Index** | Collects inline `#tags` from accessible Markdown notes and lists the notes using each tag. |
| **Link Map** | Summarizes links between notes and mentions that are not linked yet. |
| **Database Dashboard** | Shows row and property counts for databases you have shared with it. |
| **Task Overview** | Finds unchecked Markdown checklist items in accessible notes. |

Extensions only work with the notes and databases made available through their
granted permissions. For help or to suggest an extension, [open an issue](https://github.com/AetherAssembly/Driftleaf-Extensions/issues/new/choose).

## Contributing

Contributions are welcome. See [CONTRIBUTING.md](.github/CONTRIBUTING.md) for
development and publishing instructions, and the
[Driftleaf extension guide](https://github.com/AetherAssembly/Driftleaf/blob/main/docs/EXTENSIONS.md)
for the extension API.

## License

This project is licensed under the [MIT LICENSE](LICENSE).
