void (async () => {
  const notes = await window.driftleafExtension.listNotes();
  let complete = 0;
  let incomplete = 0;
  const breakdown = [];

  for (const note of notes) {
    const content = await window.driftleafExtension.readNote(note.id);
    let noteComplete = 0;
    let noteIncomplete = 0;
    for (const line of content.split(/\r?\n/)) {
      const match = line.match(/^\s*[-*+]\s+\[([ xX])\]\s+(.+)$/);
      if (!match) continue;
      if (match[1].toLowerCase() === "x") {
        complete += 1;
        noteComplete += 1;
      } else {
        incomplete += 1;
        noteIncomplete += 1;
      }
    }
    if (noteComplete || noteIncomplete) {
      breakdown.push({
        title: note.title || "Untitled",
        complete: noteComplete,
        incomplete: noteIncomplete,
      });
    }
  }

  const main = document.createElement("main");
  main.style.cssText = "font:16px system-ui;max-width:760px;margin:40px auto;padding:0 20px";
  const heading = document.createElement("h1");
  heading.textContent = "Checklist progress";
  const summary = document.createElement("p");
  summary.textContent =
    `${complete} complete · ${incomplete} incomplete · ${complete + incomplete} total`;
  const list = document.createElement("ul");
  for (const note of breakdown) {
    const total = note.complete + note.incomplete;
    const item = document.createElement("li");
    item.textContent =
      `${note.title}: ${note.complete}/${total} complete`;
    list.append(item);
  }
  main.append(heading, summary);
  if (list.children.length) main.append(list);
  document.body.replaceChildren(main);
})().catch((error) => {
  document.body.textContent = `Extension error: ${String(error)}`;
});
