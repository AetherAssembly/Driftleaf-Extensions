void (async () => {
  const [notes, databases] = await Promise.all([
    window.driftleafExtension.listNotes(),
    window.driftleafExtension.listDatabases(),
  ]);
  const folders = new Map();

  for (const note of notes) {
    const folder = note.folderPath || "Root";
    const summary = folders.get(folder) ?? { notes: 0, databases: 0 };
    summary.notes += 1;
    folders.set(folder, summary);
  }
  for (const database of databases) {
    const folder = database.folderPath || "Root";
    const summary = folders.get(folder) ?? { notes: 0, databases: 0 };
    summary.databases += 1;
    folders.set(folder, summary);
  }

  const main = document.createElement("main");
  main.style.cssText = "font:16px system-ui;max-width:760px;margin:40px auto;padding:0 20px";
  const heading = document.createElement("h1");
  heading.textContent = "Folder summary";
  const list = document.createElement("ul");
  for (const [folder, summary] of [...folders].sort(([a], [b]) => a.localeCompare(b))) {
    const item = document.createElement("li");
    item.textContent =
      `${folder}: ${summary.notes} notes · ${summary.databases} databases`;
    list.append(item);
  }
  if (!folders.size) {
    const empty = document.createElement("p");
    empty.textContent = "No accessible notes or databases found.";
    main.append(heading, empty);
  } else {
    main.append(heading, list);
  }
  document.body.replaceChildren(main);
})().catch((error) => {
  document.body.textContent = `Extension error: ${String(error)}`;
});
