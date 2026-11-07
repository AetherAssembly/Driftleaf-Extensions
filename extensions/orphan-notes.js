void (async () => {
  const graph = await window.driftleafExtension.graph();
  const connected = new Set();
  for (const edge of graph.edges) {
    connected.add(edge.sourceId);
    connected.add(edge.targetId);
  }
  for (const mention of graph.unlinkedMentions) {
    connected.add(mention.sourceId);
    connected.add(mention.targetId);
  }
  const orphans = graph.nodes
    .filter((note) => !connected.has(note.id))
    .sort((a, b) => a.title.localeCompare(b.title));

  const main = document.createElement("main");
  main.style.cssText = "font:16px system-ui;max-width:760px;margin:40px auto;padding:0 20px";
  const heading = document.createElement("h1");
  heading.textContent = "Orphan notes";
  const summary = document.createElement("p");
  summary.textContent = `${orphans.length} of ${graph.nodes.length} notes have no links or mentions.`;
  const list = document.createElement("ul");
  for (const note of orphans) {
    const item = document.createElement("li");
    item.textContent = `${note.title || "Untitled"} · ${note.folderPath || "Root"}`;
    list.append(item);
  }
  if (!orphans.length) {
    main.append(heading, summary);
  } else {
    main.append(heading, summary, list);
  }
  document.body.replaceChildren(main);
})().catch((error) => {
  document.body.textContent = `Extension error: ${String(error)}`;
});
