// --- Node-based data model ---
const grandparent = {
  name: "Mkhulu Mthinsi",
  emoji: "👴",
  partners: ["Wife 1"],
  children: [
    {
      name: "Zakhele",
      emoji: "👨",
      partners: ["Nandi", "Thandi"],
      children: ["Child 1", "Child 2", "Child 3", "Child 4", "Child 5", "Child 6"]
    },
    {
      name: "Vuyi",
      emoji: "👩",
      partners: ["Thabo"],
      children: ["Child 7", "Child 8"]
    },
    {
      name: "Stutu",
      emoji: "👩",
      partners: ["Sipho"],
      children: ["Child 9"]
    }
  ],
};

// --- Render Function ---
function renderGrandparentNode(data) {
  document.getElementById("grandparent-name").textContent = data.name;
  const node = document.getElementById("grandparent-node");
  node.textContent = data.emoji;

  const left = document.getElementById("partner-left");
  const right = document.getElementById("partner-right");

  // Split partners for display: half on left, half on right
  const mid = Math.ceil(data.partners.length / 2);
  const leftPartners = data.partners.slice(0, mid);
  const rightPartners = data.partners.slice(mid);

  left.innerHTML = "";
  right.innerHTML = "";

  leftPartners.forEach(name => {
    const el = document.createElement("div");
    el.className = "partner-icon";
    el.textContent = "🧓";
    el.title = name;
    el.onclick = () => alert(`View ${name}'s info`);
    left.appendChild(el);
  });

  rightPartners.forEach(name => {
    const el = document.createElement("div");
    el.className = "partner-icon";
    el.textContent = "🧓";
    el.title = name;
    el.onclick = () => alert(`View ${name}'s info`);
    right.appendChild(el);
  });
}

function renderChildren(data) {
  const parentSection = document.getElementById("parent-section");
  parentSection.innerHTML = "";

  data.children.forEach(child => {
    const container = document.createElement("div");
    container.className = "person-container";

    // Left partners
    const left = document.createElement("div");
    left.className = "partner-container left";
    (child.partners || []).slice(0, 1).forEach(name => {
      const icon = document.createElement("div");
      icon.className = "partner-icon";
      icon.textContent = "🧓";
      icon.title = name;
      icon.onclick = () => alert(`View ${name}'s info`);
      left.appendChild(icon);
    });

    // Node
    const node = document.createElement("div");
    node.className = "person";
    node.textContent = child.emoji;
    node.title = child.name;

    // Right partners
    const right = document.createElement("div");
    right.className = "partner-container right";
    (child.partners || []).slice(1).forEach(name => {
      const icon = document.createElement("div");
      icon.className = "partner-icon";
      icon.textContent = "🧓";
      icon.title = name;
      icon.onclick = () => alert(`View ${name}'s info`);
      right.appendChild(icon);
    });

    container.appendChild(left);
    container.appendChild(node);
    container.appendChild(right);

    parentSection.appendChild(container);
  });
}

function renderGrandChildren(data) {
  const childSection = document.getElementById("child-section");
  childSection.innerHTML = "";

  data.children.forEach(parent => {
    parent.children.forEach((kidName, index) => {
      const div = document.createElement("div");
      div.className = "grandchild person";
      div.textContent = "🧒";
      div.title = kidName;
      div.setAttribute("data-parent", parent.name);
      div.setAttribute("data-index", index);
      childSection.appendChild(div);
    });
  });
}

function drawLines() {
  const svg = document.getElementById("connectors");
  svg.innerHTML = "";

  const grand = document.getElementById("grandparent-node");
  const parentContainers = document.querySelectorAll("#parent-section .person");
  const grandchildNodes = document.querySelectorAll("#child-section .grandchild");

  const svgRect = svg.getBoundingClientRect();

  // Grandparent → Parents
  const gRect = grand.getBoundingClientRect();
  const gX = gRect.left + gRect.width / 2 - svgRect.left;
  const gY = gRect.bottom - svgRect.top;

  parentContainers.forEach(parent => {
    const pRect = parent.getBoundingClientRect();
    const pX = pRect.left + pRect.width / 2 - svgRect.left;
    const pY = pRect.top - svgRect.top;

    const path = document.createElementNS("http://www.w3.org/2000/svg", "path");
    path.setAttribute("d", `M${gX},${gY} C${gX},${gY + 50} ${pX},${pY - 50} ${pX},${pY}`);
    path.setAttribute("stroke", "#888");
    path.setAttribute("stroke-width", "2");
    path.setAttribute("fill", "transparent");
    svg.appendChild(path);
  });

  // Parent → Children
  grandchildNodes.forEach(child => {
    const parentName = child.getAttribute("data-parent");
    const parent = Array.from(parentContainers).find(p => p.title === parentName);
    if (!parent) return;

    const cRect = child.getBoundingClientRect();
    const pRect = parent.getBoundingClientRect();

    const cX = cRect.left + cRect.width / 2 - svgRect.left;
    const cY = cRect.top - svgRect.top;

    const pX = pRect.left + pRect.width / 2 - svgRect.left;
    const pY = pRect.bottom - svgRect.top;

    const path = document.createElementNS("http://www.w3.org/2000/svg", "path");
    path.setAttribute("d", `M${pX},${pY} C${pX},${pY + 50} ${cX},${cY - 50} ${cX},${cY}`);
    path.setAttribute("stroke", "#a682ff");
    path.setAttribute("stroke-width", "2");
    path.setAttribute("fill", "transparent");
    svg.appendChild(path);
  });
}


// --- Load tree ---
renderGrandparentNode(grandparent);
renderChildren(grandparent);
renderGrandChildren(grandparent);

window.addEventListener("load", () => setTimeout(drawLines, 100));
window.addEventListener("resize", () => setTimeout(drawLines, 100));
