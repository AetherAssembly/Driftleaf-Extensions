void (async () => {
  const [graph, notes] = await Promise.all([
    window.driftleafExtension.graph(),
    window.driftleafExtension.listNotes(),
  ]);
  const names = new Map(notes.map((note) => [note.id, note.title || "Untitled"]));
  const main = document.createElement("main");
  main.style.cssText = "font:16px system-ui;max-width:760px;margin:40px auto;padding:0 20px";
  const heading = document.createElement("h1");
  heading.textContent = "Link map";
  const summary = document.createElement("p");
  summary.textContent = `${graph.nodes.length} notes · ${graph.edges.length} links · ${graph.unlinkedMentions.length} unlinked mentions`;
  const list = document.createElement("ul");
  for (const edge of graph.edges) {
    const item = document.createElement("li");
    item.textContent = `${names.get(edge.sourceId) ?? "Unknown note"} → ${names.get(edge.targetId) ?? "Unknown note"}`;
    list.append(item);
  }
  for (const mention of graph.unlinkedMentions) {
    const item = document.createElement("li");
    item.textContent = `${names.get(mention.sourceId) ?? "Unknown note"} mentions ${names.get(mention.targetId) ?? "Unknown note"} (not linked)`;
    list.append(item);
  }
  main.append(heading, summary, list);
  document.body.replaceChildren(main);
})().catch((error) => {
  document.body.textContent = `Extension error: ${String(error)}`;
});
