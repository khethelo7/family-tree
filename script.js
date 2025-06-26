// Load from data.js
let currentGrandIndex = 0;
let grandparent = familyData.grandparents[currentGrandIndex];

function createPersonElement(person, className) {
  const el = document.createElement("div");
  el.className = `person ${className}`;
  el.title = person.name;

  const img = document.createElement("img");
  img.src = person.image || "";
  img.alt = person.name;
  img.onerror = () => {
    img.remove();
    el.textContent = person.emoji || "❓";
  };
  img.loading = "lazy";

  el.appendChild(img);
  el.onclick = () => {
    window.location.href = `profile.html?id=${person.id}`;
  };

  return el;
}


function renderTree(grandparent) {
  document.getElementById("grandparent-gen").innerHTML = "";
  document.getElementById("parent-gen").innerHTML = "";
  document.getElementById("connectors").innerHTML = "";

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
    icon.title = partner.name;
    icon.textContent = partner.emoji;
    icon.onclick = () => alert(`Switching to partner: ${partner.name}`);
    leftPartnerCol.appendChild(icon);
  });

  const grandEl = createPersonElement(grandparent, "grandparent");
  grandEl.setAttribute("data-id", "grand");
  grandEl.title = grandparent.name;
  grandEl.onclick = () => {
    window.location.href = `profile.html?id=${grandparent.id}`;
  };

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
      icon.title = partner.name;
      icon.onclick = () => alert(`Switching to partner: ${partner.name}`);
      leftCol.appendChild(icon);
    });

    const nodeEl = createPersonElement(parent, "parent");
    nodeEl.title = parent.name;
    nodeEl.setAttribute("data-id", `parent-${index}`);
    nodeEl.onclick = () => {
      window.location.href = `profile.html?id=${parent.id}`;
    };

    const rightCol = document.createElement("div");
    rightCol.className = "partner-column right";

    parentWrapper.appendChild(leftCol);
    parentWrapper.appendChild(nodeEl);
    parentWrapper.appendChild(rightCol);
    block.appendChild(parentWrapper);

      const childRow = document.createElement("div");
  childRow.className = "children-row";

  parent.children.forEach((child) => {
    const childWrapper = document.createElement("div");
    childWrapper.className = "child-block"; // new wrapper

    const childEl = createPersonElement(child, "child");
    childWrapper.appendChild(childEl);

    // --- Render grandchildren if child has children ---
    if (child.children && child.children.length > 0) {
      const grandchildRow = document.createElement("div");
      grandchildRow.className = "grandchildren-row";

      child.children.forEach((grandchild) => {
        const grandchildEl = createPersonElement(grandchild, "grandchild");
        grandchildRow.appendChild(grandchildEl);
      });

      childWrapper.appendChild(grandchildRow);
    }

    childRow.appendChild(childWrapper);
  });

  block.appendChild(childRow);

    parentGen.appendChild(block);
  });

  setTimeout(drawConnections, 100);
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
window.addEventListener("load", () => renderTree(grandparent));
window.addEventListener("resize", () => setTimeout(drawConnections, 100));


