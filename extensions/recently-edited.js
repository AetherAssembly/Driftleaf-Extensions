void (async () => {
  const notes = await window.driftleafExtension.listNotes();
  const entries = [...notes]
    .sort((a, b) => (b.updatedAt ?? 0) - (a.updatedAt ?? 0));

  const main = document.createElement("main");
  main.style.cssText = "font:16px system-ui;max-width:760px;margin:40px auto;padding:0 20px";
  const heading = document.createElement("h1");
  heading.textContent = "Recently edited";
  const list = document.createElement("ul");
  for (const note of entries) {
    const item = document.createElement("li");
    const date = note.updatedAt
      ? new Date(note.updatedAt).toLocaleString()
      : "Unknown date";
    item.textContent = `${note.title || "Untitled"} · ${date} · ${note.folderPath || "Root"}`;
    list.append(item);
  }
  if (!entries.length) {
    main.append(heading, document.createTextNode("No accessible notes found."));
  } else {
    main.append(heading, list);
  }
  document.body.replaceChildren(main);
})().catch((error) => {
  document.body.textContent = `Extension error: ${String(error)}`;
});
