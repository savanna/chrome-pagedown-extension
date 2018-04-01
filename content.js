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

      window.onresize = this.updatePosition.bind(this);
      this.updatePosition();

      this.container.ontouchstart = function(e) {
        e = MainUI.getScreenEvent(e);
        this.touchStartTime = new Date();
        let {x, y} = MainUI.getLocation();
        this.touchStartOffset = {x: x - e.screenX, y: y - e.screenY};
      }.bind(this);
      this.container.onmousedown = this.container.ontouchstart;

      this.container.ontouchend = function(e) {
        this.touchStartTime = undefined;
      }.bind(this);
      window.addEventListener('mouseup', this.container.ontouchend);

      this.container.ontouchcancel = function() {
        this.touchStartTime = undefined;
      }.bind(this);

      let ontouchmove = function(e) {
        if (!this.touchStartTime)
          return;

        console.info('touch move');
        e = getScreenEvent(e);
        var now = new Date().getTime();
        if (now - this.touchStartTime.getTime() > 2 * 1000) {
          MainUI.setLocation(
              e.screenX + this.touchStartOffset.x,
              e.screenY + this.touchStartOffset.y);
          this.updatePosition();
        }
      }.bind(this)
      window.addEventListener('touchmove', ontouchmove);
      window.addEventListener('mousemove', ontouchmove);
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

    static setLocation(x, y) {
      localStorage.setItem('xc_x', x);
      localStorage.setItem('xc_y', y);
    }

    static getLocation() {
      let x = localStorage.getItem('xc_x');
      let y = localStorage.getItem('xc_y');

      if (!x || isNaN(x) || !y || isNaN(y)) {
        var initLocation = MainUI.initLocation();
        x = initLocation.x;
        y = initLocation.y;
        MainUI.setLocation(x, y);
      }

      let loc = {
        x: Math.min(window.innerWidth - 50, Math.max(0, x)),
        y: Math.min(window.innerHeight - 100, Math.max(0, y))
      };
      return loc;
    }

    static getScreenEvent(e) {
      if ('screenX' in e) {
        return e;
      }

      if ('screenX' in e.targetTouches[0]) {
        return e.targetTouches[0];
      }

      if ('screenX' in e.changedTouches[0]) {
        return e.changedTouches[0];
      }
    }

    static initLocation() {
      let x = window.innerWidth - 96;
      let y = Math.max(
          0, window.innerHeight - Math.max(window.innerHeight * .4, 160));
      return {x, y};
    }

    updatePosition() {
      if (document.body.scrollHeight > window.innerHeight) {
        this.container.style.display = 'block';
        let {x, y} = MainUI.getLocation();
        this.container.style.left = x + 'px';
        this.container.style.top = y + 'px';
        console.info('update location');
        console.info({x, y});
      } else {
        // No need to scroll.
        this.container.style.display = 'none';
      }
    }
  }

  var mainUI = new MainUI();
}
