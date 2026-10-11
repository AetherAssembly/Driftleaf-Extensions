void (async () => {
  const notes = await window.driftleafExtension.listNotes();
  const tasks = [];
  for (const note of notes) {
    const content = await window.driftleafExtension.readNote(note.id);
    for (const line of content.split(/\r?\n/)) {
      const match = line.match(/^\s*[-*+]\s+\[([ xX])\]\s+(.+)$/);
      if (match && match[1].toLowerCase() !== "x") {
        tasks.push({ note: note.title || "Untitled", text: match[2].trim() });
      }
    }
  }

  const main = document.createElement("main");
  main.style.cssText = "font:16px system-ui;max-width:760px;margin:40px auto;padding:0 20px";
  const heading = document.createElement("h1");
  heading.textContent = "Open tasks";
  const list = document.createElement("ul");
  for (const task of tasks) {
    const item = document.createElement("li");
    item.textContent = `${task.text} — ${task.note}`;
    list.append(item);
  }
  if (!tasks.length) {
    const empty = document.createElement("p");
    empty.textContent = "No open Markdown checklist tasks found in accessible notes.";
    main.append(heading, empty);
  } else {
    main.append(heading, list);
  }
  document.body.replaceChildren(main);
})().catch((error) => {
  document.body.textContent = `Extension error: ${String(error)}`;
});
