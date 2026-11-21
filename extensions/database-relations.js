void (async () => {
  const databases = await window.driftleafExtension.listDatabases();
  const main = document.createElement("main");
  main.style.cssText = "font:16px system-ui;max-width:760px;margin:40px auto;padding:0 20px";
  const heading = document.createElement("h1");
  heading.textContent = "Database relations";
  const list = document.createElement("ul");

  for (const database of databases) {
    const data = await window.driftleafExtension.readDatabase(database.id);
    const names = new Map(databases.map((candidate) => [candidate.id, candidate.title]));
    for (const property of data.properties) {
      if (property.type === "relation") {
        const item = document.createElement("li");
        const target = names.get(property.relationDatabaseId) ?? "unshared database";
        item.textContent =
          `${database.title}: ${property.name} → relation to ${target}`;
        list.append(item);
      } else if (property.type === "rollup") {
        const item = document.createElement("li");
        item.textContent =
          `${database.title}: ${property.name} → rollup (${property.rollupFunction || "show_original"})`;
        list.append(item);
      }
    }
  }

  if (!list.children.length) {
    const empty = document.createElement("p");
    empty.textContent = "No relation or rollup properties found in shared databases.";
    main.append(heading, empty);
  } else {
    main.append(heading, list);
  }
  document.body.replaceChildren(main);
})().catch((error) => {
  document.body.textContent = `Extension error: ${String(error)}`;
});
