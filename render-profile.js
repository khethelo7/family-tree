// Parse query string (e.g., ?person=Zakhele)
const params = new URLSearchParams(window.location.search);
const personName = params.get("person");

function findPersonByName(name, data) {
  if (data.name === name) return data;
  if (data.children) {
    for (const child of data.children) {
      if (child.name === name) return child;
    }
  }
  return null;
}

const person = findPersonByName(personName, familyData.grandparent);

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
