void (async () => {
  const databases = await window.driftleafExtension.listDatabases();
  const main = document.createElement("main");
  main.style.cssText = "font:16px system-ui;max-width:760px;margin:40px auto;padding:0 20px";
  const heading = document.createElement("h1");
  heading.textContent = "Database dashboard";
  const list = document.createElement("ul");
  for (const database of databases) {
    const data = await window.driftleafExtension.readDatabase(database.id);
    const item = document.createElement("li");
    item.textContent = `${database.title}: ${data.rows.length} rows · ${data.properties.length} properties`;
    list.append(item);
  }
  if (!databases.length) {
    const empty = document.createElement("p");
    empty.textContent = "No databases have been shared with this extension yet.";
    main.append(heading, empty);
  } else {
    main.append(heading, list);
  }
  document.body.replaceChildren(main);
})().catch((error) => {
  document.body.textContent = `Extension error: ${String(error)}`;
});
