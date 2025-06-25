const grandparent = {
  name: "Mkhulu Mthinsi",
  emoji: "👴",
  partners: [
    { name: "Wife 1", emoji: "👵" }
  ],
  children: [
    {
      name: "Zakhele",
      emoji: "👨",
      partners: [
        { name: "Nonkululeko", emoji: "👩" }
      ],
      children: ["Sihle", "Ganozi", "Siyabonga", "Sthe", "Andile", "Khethelo"]
    },
    {
      name: "Sipho",
      emoji: "👨",
      partners: [],
      children: ["Bheki"]
    },
    {
      name: "Dodge",
      emoji: "👨",
      partners: [
        { name: "Nozipho", emoji: "👩" }
      ],
      children: ["Nqobile", "Khanyo"]
    },
    {
      name: "Carro",
      emoji: "👩",
      partners: [],
      children: ["Lulu"]
    },
    {
      name: "Stutu",
      emoji: "👩",
      partners: [],
      children: ["Sthembile"]
    },
    {
      name: "Vuyi",
      emoji: "👩",
      partners: [],
      children: ["Papi", "Twana"]
    }
  ]
};


document.getElementById("grandparent-name").textContent = grandparent.name;

// Render Grandparent
const grandGen = document.getElementById("grandparent-gen");
const grandWrapper = document.createElement("div");
grandWrapper.className = "person-wrapper";

const leftPartnerCol = document.createElement("div");
leftPartnerCol.className = "partner-column left";
grandparent.partners.forEach((partner) => {
  const icon = document.createElement("div");
  icon.className = "partner-icon";
  icon.textContent = partner.emoji;
  icon.onclick = () => alert(`Switching to partner: ${partner.name}`);
  leftPartnerCol.appendChild(icon);
});

const grandEl = document.createElement("div");
grandEl.className = "grandparent-node";
grandEl.textContent = grandparent.emoji;
grandEl.setAttribute("data-id", "grand");

const rightPartnerCol = document.createElement("div");
rightPartnerCol.className = "partner-column right";

grandWrapper.appendChild(leftPartnerCol);
grandWrapper.appendChild(grandEl);
grandWrapper.appendChild(rightPartnerCol);
grandGen.appendChild(grandWrapper);

// Render Parents + Children
const parentGen = document.getElementById("parent-gen");

grandparent.children.forEach((parent, index) => {
  const block = document.createElement("div");
  block.className = "parent-block";

  const parentWrapper = document.createElement("div");
parentWrapper.className = "person-wrapper";

const leftCol = document.createElement("div");
leftCol.className = "partner-column left";
parent.partners.forEach((partner) => {
  const icon = document.createElement("div");
  icon.className = "partner-icon";
  icon.textContent = partner.emoji;
  icon.onclick = () => alert(`Switching to partner: ${partner.name}`);
  leftCol.appendChild(icon);
});

const nodeEl = document.createElement("div");
nodeEl.className = "person parent";
nodeEl.textContent = parent.emoji;
nodeEl.setAttribute("data-id", `parent-${index}`);

const rightCol = document.createElement("div");
rightCol.className = "partner-column right";

parentWrapper.appendChild(leftCol);
parentWrapper.appendChild(nodeEl);
parentWrapper.appendChild(rightCol);
block.appendChild(parentWrapper);


  const childRow = document.createElement("div");
  childRow.className = "children-row";

  parent.children.forEach((child, cIdx) => {
    const childEl = document.createElement("div");
    childEl.className = "person child";
    childEl.textContent = "👶";
    childEl.setAttribute("data-id", `child-${index}-${cIdx}`);
    childRow.appendChild(childEl);
  });

  block.appendChild(childRow);
  parentGen.appendChild(block);
});

// === Connect with SVG Paths ===
function drawConnections() {
  const svg = document.getElementById("connectors");
  svg.innerHTML = "";

  const grandRect = grandEl.getBoundingClientRect();
  const svgRect = svg.getBoundingClientRect();

  // Parent links
  document.querySelectorAll(".parent").forEach((parentEl) => {
    const parentRect = parentEl.getBoundingClientRect();
    const startX = grandRect.left + grandRect.width / 2 - svgRect.left;
    const startY = grandRect.bottom - svgRect.top;

    const endX = parentRect.left + parentRect.width / 2 - svgRect.left;
    const endY = parentRect.top - svgRect.top;

    const path = document.createElementNS("http://www.w3.org/2000/svg", "path");
    path.setAttribute(
      "d",
      `M${startX},${startY} C${startX},${startY + 60} ${endX},${endY - 60} ${endX},${endY}`
    );
    path.setAttribute("stroke", "#bfbfbf");
    path.setAttribute("fill", "none");
    path.setAttribute("stroke-width", "2");
    svg.appendChild(path);
  });

  // Child links
  document.querySelectorAll(".parent-block").forEach((block) => {
    const parentEl = block.querySelector(".parent");
    const parentRect = parentEl.getBoundingClientRect();

    const children = block.querySelectorAll(".child");
    children.forEach((childEl) => {
      const childRect = childEl.getBoundingClientRect();
      const startX = parentRect.left + parentRect.width / 2 - svgRect.left;
      const startY = parentRect.bottom - svgRect.top;

      const endX = childRect.left + childRect.width / 2 - svgRect.left;
      const endY = childRect.top - svgRect.top;

      const path = document.createElementNS("http://www.w3.org/2000/svg", "path");
      path.setAttribute(
        "d",
        `M${startX},${startY} C${startX},${startY + 40} ${endX},${endY - 40} ${endX},${endY}`
      );
      path.setAttribute("stroke", "#a682ff");
      path.setAttribute("fill", "none");
      path.setAttribute("stroke-width", "2");
      svg.appendChild(path);
    });
  });
}

window.addEventListener("load", () => setTimeout(drawConnections, 100));
window.addEventListener("resize", () => setTimeout(drawConnections, 100));
