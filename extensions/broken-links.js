void (async () => {
  const notes = await window.driftleafExtension.listNotes();
  const titleLookup = new Map();
  for (const note of notes) {
    const title = note.title.trim();
    if (!title) continue;
    const key = title.toLowerCase();
    titleLookup.set(key, (titleLookup.get(key) ?? 0) + 1);
  }

  const broken = [];
  for (const note of notes) {
    const content = await window.driftleafExtension.readNote(note.id);
    for (const match of content.matchAll(/\[\[([^\]|]+)(?:\|[^\]]*)?\]\]/g)) {
      const target = match[1].trim().replace(/\\/g, "/");
      let exists = false;
      if (target.includes("/")) {
        const normalized = target.toLowerCase();
        exists = notes.filter((candidate) =>
          `${candidate.folderPath}/${candidate.title}`
            .replace(/^\/+/, "")
            .toLowerCase() === normalized
        ).length === 1;
      } else {
        exists = (titleLookup.get(target.toLowerCase()) ?? 0) === 1;
      }
      if (!exists) {
        broken.push({
          source: note.title || "Untitled",
          target,
        });
      }
    }
  }

  const main = document.createElement("main");
  main.style.cssText = "font:16px system-ui;max-width:760px;margin:40px auto;padding:0 20px";
  const heading = document.createElement("h1");
  heading.textContent = "Broken links";
  const list = document.createElement("ul");
  for (const link of broken) {
    const item = document.createElement("li");
    item.textContent = `${link.source} → [[${link.target}]]`;
    list.append(item);
  }
  if (!broken.length) {
    const empty = document.createElement("p");
    empty.textContent = "No broken wiki links found in accessible notes.";
    main.append(heading, empty);
  } else {
    main.append(heading, list);
  }
  document.body.replaceChildren(main);
})().catch((error) => {
  document.body.textContent = `Extension error: ${String(error)}`;
});
