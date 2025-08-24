// Custom Quill module to add a trash icon overlay to images for removal
export default function ImageRemoveOverlay(quill: any) {
  let overlay: HTMLDivElement | null = null;
  let img: HTMLImageElement | null = null;
  let imgIndex: number | null = null;

  function showOverlayForImage(imageNode: HTMLImageElement) {
    hideOverlay();

    const editorContainer = quill.root.parentNode;
    if (!editorContainer) return;

    // Find the index of the image embed in the Quill document
    const blot = quill.scroll.descendant(quill.constructor.import('formats/image'), 0).find((b: any) => b.domNode === imageNode);
    if (!blot) return;
    const index = quill.getIndex(blot);
    imgIndex = index;

    const imgRect = imageNode.getBoundingClientRect();
    const editorRect = editorContainer.getBoundingClientRect();

    overlay = document.createElement('div');
    overlay.className = 'quill-image-remove-overlay';
    overlay.style.position = 'absolute';
    overlay.style.left = (imgRect.left - editorRect.left) + 'px';
    overlay.style.top = (imgRect.top - editorRect.top) + 'px';
    overlay.style.width = imageNode.width + 'px';
    overlay.style.height = imageNode.height + 'px';
    overlay.style.pointerEvents = 'none';
    overlay.style.zIndex = '1000';

    const button = document.createElement('button');
    button.innerHTML = '🗑️';
    button.className = 'quill-image-remove-btn';
    button.style.position = 'relative';
    button.style.top = '4px';
    button.style.right = '4px';
    button.style.zIndex = '1010';
    button.style.background = 'rgba(255,255,255,0.95)';
    button.style.border = 'none';
    button.style.borderRadius = '50%';
    button.style.cursor = 'pointer';
    button.style.pointerEvents = 'auto';
    button.style.fontSize = '20px';
    button.style.boxShadow = '0 2px 8px rgba(0,0,0,0.15)';
    button.style.display = 'flex';
    button.style.alignItems = 'center';
    button.style.justifyContent = 'center';
    button.style.width = '32px';
    button.style.height = '32px';
    button.style.color = '#d32f2f';

    button.onclick = function (e) {
      e.preventDefault();
      e.stopPropagation();
      if (imgIndex !== null) {
        quill.deleteText(imgIndex, 1, 'user');
      }
      hideOverlay();
    };

    overlay.appendChild(button);
    editorContainer.appendChild(overlay);
    img = imageNode;
  }

  function hideOverlay() {
    if (overlay && overlay.parentNode) {
      overlay.parentNode.removeChild(overlay);
    }
    overlay = null;
    img = null;
    imgIndex = null;
  }

  // Show overlay on click
  quill.root.addEventListener('click', function (e: any) {
    if (e.target && e.target.tagName === 'IMG') {
      showOverlayForImage(e.target);
    } else {
      hideOverlay();
    }
  });

  // Show overlay on selection-change if selection is an image
  quill.on('selection-change', function(range: any) {
    if (!range) {
      hideOverlay();
      return;
    }
    const [blot, offset] = quill.scroll.descendant(quill.constructor.import('formats/image'), range.index);
    if (blot && blot.domNode) {
      showOverlayForImage(blot.domNode);
    } else {
      hideOverlay();
    }
  });

  quill.on('text-change', hideOverlay);
} 