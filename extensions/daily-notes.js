void (async () => {
  const notes = await window.driftleafExtension.listNotes();
  const entries = notes
    .filter((note) => /^\d{4}-\d{2}-\d{2}$/.test(note.title))
    .sort((a, b) => b.title.localeCompare(a.title));

  const main = document.createElement("main");
  main.style.cssText = "font:16px system-ui;max-width:760px;margin:40px auto;padding:0 20px";
  const heading = document.createElement("h1");
  heading.textContent = "Daily notes";
  const list = document.createElement("ul");
  for (const note of entries) {
    const item = document.createElement("li");
    const link = document.createElement("button");
    link.textContent = `${note.title} · ${note.folderPath || "Root"}`;
    link.style.cssText =
      "font:inherit;border:0;background:none;color:inherit;padding:8px;cursor:pointer";
    link.addEventListener("click", async () => {
      const content = await window.driftleafExtension.readNote(note.id);
      const preview = document.createElement("pre");
      preview.style.cssText = "white-space:pre-wrap;overflow-wrap:anywhere";
      preview.textContent = content;
      main.replaceChildren(heading, list, preview);
    });
    item.append(link);
    list.append(item);
  }
  if (!entries.length) {
    const empty = document.createElement("p");
    empty.textContent = "No notes titled YYYY-MM-DD were found.";
    main.append(heading, empty);
  } else {
    main.append(heading, list);
  }
  document.body.replaceChildren(main);
})().catch((error) => {
  document.body.textContent = `Extension error: ${String(error)}`;
});
