
    const treeContainer = document.getElementById("tree");
    const treeParts = treeContainer.querySelectorAll(
    ".tree-top, .tree-middle, .tree-bottom"
    );
    let draggedDecoration = null;

    function createDecoration(type, color) {
    const decoration = document.createElement("div");
    decoration.className = `decoration ${type}`;
    if (type === "ball") {
        decoration.style.backgroundColor = color;
    }
    decoration.draggable = true;
    decoration.addEventListener("dragstart", dragStart);
    decoration.addEventListener("dragend", dragEnd);
    return decoration;
    }

    function dragStart(e) {
    draggedDecoration = e.target;
    e.dataTransfer.setData("text/plain", e.target.className);
    }

    function dragEnd(e) {
    draggedDecoration = null;
    }

    treeContainer.addEventListener("dragover", (e) => {
    e.preventDefault();
    });

    treeContainer.addEventListener("drop", (e) => {
    e.preventDefault();
    if (draggedDecoration) {
        const treePart = getTreePartAtPosition(e.clientX, e.clientY);
        if (treePart) {
        const partRect = treePart.getBoundingClientRect();
        const relativeX = e.clientX - partRect.left;
        const relativeY = e.clientY - partRect.top;

        if (
            isWithinTriangle(
            relativeX,
            relativeY,
            partRect.width,
            partRect.height
            )
        ) {
            const newDecoration = createDecoration(
            draggedDecoration.dataset.type,
            window.getComputedStyle(draggedDecoration).backgroundColor
            );
            newDecoration.style.left = `${
            (relativeX / partRect.width) * 100
            }%`;
            newDecoration.style.top = `${
            (relativeY / partRect.height) * 100
            }%`;
            treePart.appendChild(newDecoration);
        }
        }
    }
    });

    function getTreePartAtPosition(x, y) {
    for (const part of treeParts) {
        const rect = part.getBoundingClientRect();
        if (
        x >= rect.left &&
        x <= rect.right &&
        y >= rect.top &&
        y <= rect.bottom
        ) {
        return part;
        }
    }
    return null;
    }

    function isWithinTriangle(x, y, width, height) {
    const halfWidth = width / 2;
    const slope = height / halfWidth;
    return (
        y >= 0 &&
        y <= height &&
        x >= halfWidth - y / slope &&
        x <= halfWidth + y / slope
    );
    }

    document.querySelectorAll(".decoration-option").forEach((option) => {
    option.addEventListener("dragstart", dragStart);
    option.addEventListener("dragend", dragEnd);
    });

    function clearDecorations() {
    treeParts.forEach((part) => {
        const decorations = part.querySelectorAll(".decoration");
        decorations.forEach((decoration) => decoration.remove());
    });
    }
