// Parse query string (e.g., ?id=ZAK234)
const params = new URLSearchParams(window.location.search);
const personId = params.get("id");

function findPersonById(id, node) {
  if (node.id === id) return node;

  if (node.partners) {
    for (const p of node.partners) {
      if (p.id === id) return p;
    }
  }

  if (node.children) {
    for (const child of node.children) {
      if (typeof child === "object" && child.id === id) return child;
      const found = findPersonById(id, child);
      if (found) return found;
    }
  }

  return null;
}

const person = findPersonById(personId, familyData.grandparent);


if (person) {
  document.getElementById("profile-name").textContent = person.name;
  document.getElementById("profile-emoji").textContent = person.emoji;

  const container = document.getElementById("metadata-container");
  const meta = person.metadata || {};
  for (const key in meta) {
    const div = document.createElement("div");
    div.textContent = `${key}: ${Array.isArray(meta[key]) ? meta[key].join(", ") : meta[key]}`;
    container.appendChild(div);
  }
} else {
  document.body.innerHTML = "<h2>Person not found.</h2><a href='index.html'>Go back</a>";
}
