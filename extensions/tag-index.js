void (async () => {
  const notes = await window.driftleafExtension.listNotes();
  const tags = new Map();
  for (const note of notes) {
    const content = await window.driftleafExtension.readNote(note.id);
    for (const match of content.matchAll(/(?:^|\s)#([a-zA-Z][\w/-]*)/g)) {
      const tag = match[1].toLowerCase();
      tags.set(tag, [...(tags.get(tag) ?? []), note]);
    }
  }

  const main = document.createElement("main");
  main.style.cssText = "font:16px system-ui;max-width:760px;margin:40px auto;padding:0 20px";
  const heading = document.createElement("h1");
  heading.textContent = "Tag index";
  const list = document.createElement("ul");
  for (const [tag, taggedNotes] of [...tags].sort(([a], [b]) => a.localeCompare(b))) {
    const item = document.createElement("li");
    const title = document.createElement("strong");
    title.textContent = `#${tag} (${taggedNotes.length})`;
    const names = document.createElement("span");
    names.textContent = ` — ${taggedNotes.map((note) => note.title).join(", ")}`;
    item.append(title, names);
    list.append(item);
  }
  if (!tags.size) {
    const empty = document.createElement("p");
    empty.textContent = "No inline #tags found in accessible notes.";
    main.append(heading, empty);
  } else {
    main.append(heading, list);
  }
  document.body.replaceChildren(main);
})().catch((error) => {
  document.body.textContent = `Extension error: ${String(error)}`;
});
