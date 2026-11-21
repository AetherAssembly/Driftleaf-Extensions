void (async () => {
  const notes = await window.driftleafExtension.listNotes();
  const groups = new Map();
  for (const note of notes) {
    const title = note.title.trim() || "Untitled";
    const key = title.toLowerCase();
    groups.set(key, [...(groups.get(key) ?? []), note]);
  }

  const duplicates = [...groups.values()]
    .filter((group) => group.length > 1)
    .sort((a, b) => (a[0].title || "").localeCompare(b[0].title || ""));

  const main = document.createElement("main");
  main.style.cssText = "font:16px system-ui;max-width:760px;margin:40px auto;padding:0 20px";
  const heading = document.createElement("h1");
  heading.textContent = "Duplicate titles";
  const list = document.createElement("ul");
  for (const group of duplicates) {
    const item = document.createElement("li");
    const title = document.createElement("strong");
    title.textContent = `${group[0].title || "Untitled"} (${group.length})`;
    item.append(title);
    for (const note of group) {
      const location = document.createElement("div");
      location.textContent = note.folderPath || "Root";
      item.append(location);
    }
    list.append(item);
  }
  if (!duplicates.length) {
    const empty = document.createElement("p");
    empty.textContent = "No duplicate note titles found.";
    main.append(heading, empty);
  } else {
    main.append(heading, list);
  }
  document.body.replaceChildren(main);
})().catch((error) => {
  document.body.textContent = `Extension error: ${String(error)}`;
});
