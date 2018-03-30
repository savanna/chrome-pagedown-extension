{
  class MainUI {
    constructor() {
      this.container = MainUI.createButton(
          document.body, 'xc-container', undefined /*label*/,
          undefined /*handler*/);

      this.pageUpButton =
          MainUI.createButton(this.container, 'xc-pageup', '▲', function() {
            window.scrollTo(0, window.scrollY - window.innerHeight * .9);
          });

      this.pageDownButton =
          MainUI.createButton(this.container, 'xc-pagedown', '▼', function() {
            window.scrollTo(0, window.scrollY + window.innerHeight * .9);
          });

      window.onresize = this.updatePosition;
      this.updatePosition();
    }

    static isTouchDevice() {
      return 'ontouchstart' in document.documentElement;
    }

    static createButton(container, id, label, handler) {
      let button = document.createElement('div');
      button.id = id;
      if (label) {
        button.innerText = label;
      }
      if (handler) {
        button.onclick = handler;
      }
      if (MainUI.isTouchDevice()) {
        // prevent long press context menu.
        button.oncontextmenu = function(e) {
          e.preventDefault();
          return false;
        }
      }
      container.appendChild(button);
      return button;
    }

    updatePosition() {
      if (document.body.scrollHeight > window.innerHeight) {
        this.container.style.display = 'block';
        this.container.style.top =
            Math.max(
                0,
                window.innerHeight - Math.max(window.innerHeight * .2, 160)) +
            'px';
        this.container.style.left = window.innerWidth - 96 + 'px';
      } else {
        // No need to scroll.
        this.container.style.display = 'none';
      }
    }
  }

  var mainUI = new MainUI();
}
