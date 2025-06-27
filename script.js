// Load from data.js
let currentGrandIndex = 0;
let grandparent = familyData.grandparents[currentGrandIndex];

function renderTree(grandparent) {
  clearView();
  renderHeader(grandparent);
  renderGrandparent(grandparent);
  renderParents(grandparent.children);
  renderMiniMap();
  drawConnections();
}

function clearView() {
  document.getElementById("grandparent-gen").innerHTML = "";
  document.getElementById("parent-gen").innerHTML = "";
  document.getElementById("connectors").innerHTML = "";
}

function renderHeader(grandparent) {
  const header = document.getElementById("grandparent-name");
  header.textContent = grandparent.name || "Unnamed";
}

function renderGrandparent(grandparent) {
  const grandGen = document.getElementById("grandparent-gen");
  const wrapper = document.createElement("div");
  wrapper.className = "person-wrapper";

  const left = renderPartners(grandparent.partners, "left");
  const right = renderPartners([], "right"); // add dynamic switching later
  const grandNode = createPersonNode(grandparent, "grandparent");

  wrapper.appendChild(left);
  wrapper.appendChild(grandNode);
  wrapper.appendChild(right);

  grandGen.appendChild(wrapper);
}

function renderParents(parents) {
  const parentGen = document.getElementById("parent-gen");

  parents.forEach((parent) => {
    const block = document.createElement("div");
    block.className = "parent-block";

    const parentWrap = document.createElement("div");
    parentWrap.className = "person-wrapper";

    const left = renderPartners(parent.partners, "left");
    const right = renderPartners([], "right");
    const parentEl = createPersonNode(parent, "parent");

    parentWrap.appendChild(left);
    parentWrap.appendChild(parentEl);
    parentWrap.appendChild(right);
    block.appendChild(parentWrap);

    const childRow = document.createElement("div");
    childRow.className = "children-row";

    parent.children?.forEach((child) => {
      const childWrap = document.createElement("div");
      childWrap.className = "child-block";

      const childEl = createPersonNode(child, "child");
      childWrap.appendChild(childEl);

      // 👶 render grandchildren
      if (child.children && child.children.length > 0) {
        const grandRow = document.createElement("div");
        grandRow.className = "grandchildren-row";

        child.children.forEach((grand) => {
          const grandEl = createPersonNode(grand, "grandchild");
          grandRow.appendChild(grandEl);
        });

        childWrap.appendChild(grandRow);
      }

      childRow.appendChild(childWrap);
    });

    block.appendChild(childRow);
    parentGen.appendChild(block);
  });
}

function renderPartners(partners, side = "left") {
  const col = document.createElement("div");
  col.className = `partner-column ${side}`;

  partners.forEach((p) => {
    const icon = document.createElement("div");
    icon.className = "partner-icon";
    icon.title = p.name;
    icon.textContent = p.emoji || "💍";
    icon.onclick = () => alert(`Switching to partner: ${p.name}`);
    col.appendChild(icon);
  });

  return col;
}

function createPersonNode(person, role = "child") {
  const el = document.createElement("div");
  el.className = `person ${role}`;
  el.title = person.name;

  if (person.image) {
    const img = document.createElement("img");
    img.src = person.image;
    img.alt = person.name;
    img.onerror = () => {
      el.textContent = person.emoji || "❓";
    };
    el.appendChild(img);
  } else {
    el.textContent = person.emoji || "❓";
  }

  el.onclick = () => {
    window.location.href = `profile.html?id=${person.id}`;
  };

  return el;
}

function drawConnections() {
  const svg = document.getElementById("connectors");
  svg.innerHTML = "";

  const grandRect = document.querySelector(".grandparent").getBoundingClientRect();
  const svgRect = svg.getBoundingClientRect();

  document.querySelectorAll(".parent").forEach((parentEl) => {
    const parentRect = parentEl.getBoundingClientRect();
    const startX = grandRect.left + grandRect.width / 2 - svgRect.left;
    const startY = grandRect.bottom - svgRect.top;
    const endX = parentRect.left + parentRect.width / 2 - svgRect.left;
    const endY = parentRect.top - svgRect.top;

    const path = document.createElementNS("http://www.w3.org/2000/svg", "path");
    path.setAttribute("d", `M${startX},${startY} C${startX},${startY + 60} ${endX},${endY - 60} ${endX},${endY}`);
    path.setAttribute("stroke", "#bfbfbf");
    path.setAttribute("fill", "none");
    path.setAttribute("stroke-width", "2");
    svg.appendChild(path);
  });

  document.querySelectorAll(".parent-block").forEach((block) => {
    const parentEl = block.querySelector(".parent");
    const parentRect = parentEl.getBoundingClientRect();
    const pX = parentRect.left + parentRect.width / 2 - svgRect.left;
    const pY = parentRect.bottom - svgRect.top;

    const children = block.querySelectorAll(".child");
    children.forEach((childEl) => {
      const childRect = childEl.getBoundingClientRect();
      const cX = childRect.left + childRect.width / 2 - svgRect.left;
      const cY = childRect.top - svgRect.top;

      const path = document.createElementNS("http://www.w3.org/2000/svg", "path");
      path.setAttribute("d", `M${pX},${pY} C${pX},${pY + 40} ${cX},${cY - 40} ${cX},${cY}`);
      path.setAttribute("stroke", "#a682ff");
      path.setAttribute("fill", "none");
      path.setAttribute("stroke-width", "2");
      svg.appendChild(path);
      // Child → Grandchild lines
    block.querySelectorAll(".child-block").forEach((childBlock) => {
      const childEl = childBlock.querySelector(".child");
      if (!childEl) return;
  
      const childRect = childEl.getBoundingClientRect();
      const startX = childRect.left + childRect.width / 2 - svgRect.left;
      const startY = childRect.bottom - svgRect.top;
  
      const grandkids = childBlock.querySelectorAll(".grandchild");
      grandkids.forEach((grandEl) => {
        const grandRect = grandEl.getBoundingClientRect();
        const endX = grandRect.left + grandRect.width / 2 - svgRect.left;
        const endY = grandRect.top - svgRect.top;
  
        const path = document.createElementNS("http://www.w3.org/2000/svg", "path");
        path.setAttribute(
          "d",
          `M${startX},${startY} C${startX},${startY + 30} ${endX},${endY - 30} ${endX},${endY}`
        );
        path.setAttribute("stroke", "#ffc300");
        path.setAttribute("fill", "none");
        path.setAttribute("stroke-width", "2");
        svg.appendChild(path);
      });
    });
    });
  });

}

function drawSVGTree(grandparent) {
  const svg = document.getElementById("svg-tree");
  svg.innerHTML = "";

  const centerX = window.innerWidth / 2;
  const baseY = 100;
  const nodeRadius = 35;
  const gapX = 150;
  const gapY = 130;

  const nodes = [];
  const lines = [];

  // === Grandparent
  nodes.push({
    person: grandparent,
    x: centerX,
    y: baseY
  });

  // === Parents
  const parents = grandparent.children;
  const startX = centerX - ((parents.length - 1) * gapX) / 2;
  parents.forEach((parent, i) => {
    const px = startX + i * gapX;
    const py = baseY + gapY;
    nodes.push({ person: parent, x: px, y: py });

    // Link grandparent → parent
    lines.push({
      from: { x: centerX, y: baseY },
      to: { x: px, y: py },
      color: "#bfbfbf"
    });

    // === Children of parent
    if (parent.children?.length > 0) {
      const cStartX = px - ((parent.children.length - 1) * gapX) / 2;
      parent.children.forEach((child, j) => {
        const cx = cStartX + j * gapX;
        const cy = py + gapY;
        nodes.push({ person: child, x: cx, y: cy });

        // Link parent → child
        lines.push({
          from: { x: px, y: py },
          to: { x: cx, y: cy },
          color: "#a682ff"
        });

        // === Grandchildren
        if (child.children?.length > 0) {
          const gStartX = cx - ((child.children.length - 1) * gapX) / 2;
          child.children.forEach((grand, k) => {
            const gx = gStartX + k * gapX;
            const gy = cy + gapY;
            nodes.push({ person: grand, x: gx, y: gy });

            // Link child → grandchild
            lines.push({
              from: { x: cx, y: cy },
              to: { x: gx, y: gy },
              color: "#ffc300"
            });
          });
        }
      });
    }
  });

  // === Render lines first
  lines.forEach((line) => {
    const path = document.createElementNS("http://www.w3.org/2000/svg", "line");
    path.setAttribute("x1", line.from.x);
    path.setAttribute("y1", line.from.y);
    path.setAttribute("x2", line.to.x);
    path.setAttribute("y2", line.to.y);
    path.setAttribute("stroke", line.color);
    path.setAttribute("stroke-width", "2");
    svg.appendChild(path);
  });

  // === Render nodes
  nodes.forEach((node) => {
    const g = document.createElementNS("http://www.w3.org/2000/svg", "g");

    const circle = document.createElementNS("http://www.w3.org/2000/svg", "circle");
    circle.setAttribute("cx", node.x);
    circle.setAttribute("cy", node.y);
    circle.setAttribute("r", nodeRadius);
    circle.setAttribute("fill", "#6c63ff");
    g.appendChild(circle);

    if (node.person.image) {
      const img = document.createElementNS("http://www.w3.org/2000/svg", "image");
      img.setAttribute("href", node.person.image);
      img.setAttribute("x", node.x - 25);
      img.setAttribute("y", node.y - 25);
      img.setAttribute("width", 50);
      img.setAttribute("height", 50);
      img.setAttribute("clip-path", "circle(25px at center)");
      g.appendChild(img);
    } else {
      const textEmoji = document.createElementNS("http://www.w3.org/2000/svg", "text");
      textEmoji.setAttribute("x", node.x);
      textEmoji.setAttribute("y", node.y + 8);
      textEmoji.setAttribute("text-anchor", "middle");
      textEmoji.setAttribute("font-size", "24");
      textEmoji.textContent = node.person.emoji || "❓";
      g.appendChild(textEmoji);
    }

    const textLabel = document.createElementNS("http://www.w3.org/2000/svg", "text");
    textLabel.setAttribute("x", node.x);
    textLabel.setAttribute("y", node.y + nodeRadius + 18);
    textLabel.setAttribute("text-anchor", "middle");
    textLabel.setAttribute("fill", "#fff");
    textLabel.setAttribute("font-size", "12");
    textLabel.textContent = node.person.name;
    g.appendChild(textLabel);

    g.onclick = () => {
      window.location.href = `profile.html?id=${node.person.id}`;
    };

    svg.appendChild(g);
  });
}


// Grandparent navigation
document.getElementById("prev-grand").onclick = () => {
  currentGrandIndex = (currentGrandIndex - 1 + familyData.grandparents.length) % familyData.grandparents.length;
  grandparent = familyData.grandparents[currentGrandIndex];
  renderTree(grandparent);
};

document.getElementById("next-grand").onclick = () => {
  currentGrandIndex = (currentGrandIndex + 1) % familyData.grandparents.length;
  grandparent = familyData.grandparents[currentGrandIndex];
  renderTree(grandparent);
};

function renderMiniMap() {
  const miniList = document.getElementById("mini-branch-list");
  miniList.innerHTML = "";

  familyData.grandparents.forEach((gp, i) => {
    const li = document.createElement("li");
    li.textContent = gp.name;

    li.onclick = () => {
      currentGrandIndex = i;
      grandparent = familyData.grandparents[i];     // update the global grandparent
      renderTree(grandparent);                      // re-renders entire tree AND miniMap
    };

    miniList.appendChild(li);
  });
}


renderMiniMap();
renderTree(familyData.grandparents[currentGrandIndex]);
// drawSVGTree(familyData.grandparents[currentGrandIndex]);
// window.addEventListener("load", () => drawSVGTree(familyData.grandparents[currentGrandIndex]));
// // window.addEventListener("resize", () => setTimeout(drawConnections, 100));
