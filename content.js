function isTouchDevice() {
  return 'ontouchstart' in document.documentElement;
}

function getButton(container, id, label, handler) {
  var button = document.getElementById(id);
  if (!button) {
    button = document.createElement('div');
    button.id = id;
    if (label) {
      button.innerText = label;
    }
    if (handler) {
      button.onclick = handler;
    }
    if (isTouchDevice()) {
      // prevent long press context menu.
      button.oncontextmenu = function(e) {
        e.preventDefault();
        return false;
      }
    }
    container.appendChild(button);
  }
  return button;
};

function maybeSetupButtons() {
  var container = getButton(
      document.body, 'xc-container', undefined /*label*/,
      undefined /*handler*/);

  var pageUpButton = getButton(container, 'xc-pageup', '▲', function() {
    window.scrollTo(0, window.scrollY - window.innerHeight * .9);
  });

  var pageDownButton = getButton(container, 'xc-pagedown', '▼', function() {
    window.scrollTo(0, window.scrollY + window.innerHeight * .9);
  });

  if (document.body.scrollHeight > window.innerHeight) {
    container.style.display = 'block';
    container.style.top =
        Math.max(
            0, window.innerHeight - Math.max(window.innerHeight * .2, 160)) +
        'px';
    container.style.left = window.innerWidth - 96 + 'px';
  } else {
    // No need to scroll.
    container.style.display = 'none';
  }
};


window.onresize = maybeSetupButtons;
maybeSetupButtons();
