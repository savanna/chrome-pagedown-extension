{
  let MOVE_START_DELAY_MS = 1 * 1000;
  let PAGE_PERCENT = .92;
  let PAGE_ANIMATION_DURATION_MS = 200.0;

  class MainUI {
    constructor() {
      this.container = MainUI.createButton(
          document.body, 'xc-container', undefined /*handler*/);

      this.pageUpButton = MainUI.createButton(
          this.container, 'xc-pageup', this.scrollPage.bind(this, -1));

      this.pageDownButton = MainUI.createButton(
          this.container, 'xc-pagedown', this.scrollPage.bind(this, 1));

      window.onresize = this.updatePosition.bind(this);
      this.readLocation();

      this.container.ontouchstart = function(e) {
        e = MainUI.getScreenEvent(e);
        this.setTouchStart(e.screenX, e.screenY);
      }.bind(this);
      this.container.onmousedown = this.container.ontouchstart;

      this.container.ontouchend = function(e) {
        var now = new Date().getTime();
        if (this.touchStartTime &&
            (now - this.touchStartTime) > MOVE_START_DELAY_MS) {
          this.saveLocation();
        }

        this.setTouchEnd();
      }.bind(this);
      window.addEventListener('mouseup', this.container.ontouchend);

      this.container.onmouseleave = function(e) {
        var now = new Date().getTime();
        if (this.touchStartTime &&
            (now - this.touchStartTime < MOVE_START_DELAY_MS)) {
          this.setTouchEnd();
        }
      }.bind(this);

      this.container.ontouchcancel = this.setTouchEnd.bind(this);

      let ontouchmove = function(e) {
        if (!this.touchStartTime)
          return;

        if ('path' in e) {
          // TouchEvent, and finger moved out.
          if (!e.path.includes(this.container)) {
            this.container.onmouseleave();
          }
        }
        e = MainUI.getScreenEvent(e);
        var now = new Date().getTime();
        if (now - this.touchStartTime > MOVE_START_DELAY_MS) {
          this.setLocation(
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

    static createButton(container, id, handler) {
      let button = document.createElement('div');
      button.id = id;
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

    setTouchStart(screenX, screenY) {
      this.touchStartTime = new Date().getTime();
      this.touchStartOffset = {x: this.x - screenX, y: this.y - screenY};
      this.moveTimerId = window.setTimeout(() => {
        this.container.classList.add('large');
        this.moveTimerId = undefined;
      }, MOVE_START_DELAY_MS);
    }

    setTouchEnd() {
      this.touchStartTime = undefined;
      this.touchStartOffset = undefined;
      if (this.moveTimerId) {
        window.clearTimeout(this.moveTimerId);
        this.moveTimerId = undefined;
      }

      if (this.container.classList.contains('large')) {
        this.container.classList.remove('large');
        this.lastLargeTime = new Date().getTime();
      }
    }

    setLocation(x, y) {
      this.x = x;
      this.y = y;
    }

    saveLocation() {
      chrome.runtime.sendMessage({
        name: 'setLocation',
        data: {
          x: this.x,
          y: this.y,
          width: window.innerWidth,
          height: window.innerHeight
        }
      });
    }

    readLocation() {
      chrome.runtime.sendMessage(
          {
            name: 'getLocation',
            data: {width: window.innerWidth, height: window.innerHeight}
          },
          (loc) => {
            this.x = loc.x;
            this.y = loc.y;
            this.updatePosition();
          });
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

    scrollPage(direction) {
      let now = new Date().getTime();
      if (now - this.lastLargeTime < 10) {
        // Just come out of a move, ignore the scroll
        return;
      }
      var startY = window.scrollY;
      var difference = direction * window.innerHeight * PAGE_PERCENT;
      var startTime = performance.now();

      function step() {
        var normalizedTime =
            (performance.now() - startTime) / PAGE_ANIMATION_DURATION_MS;
        if (normalizedTime > 1)
          normalizedTime = 1;

        window.scrollTo(
            0, startY + difference * Math.sin(normalizedTime * Math.PI / 2));
        if (normalizedTime < 1) {
          window.requestAnimationFrame(step);
        }
      }
      window.requestAnimationFrame(step);
    }

    updatePosition() {
      if (this.x === undefined || this.y === undefined) {
        return;
      }

      if (document.body.scrollHeight > window.innerHeight) {
        this.container.style.display = 'block';
        this.container.style.left = this.x + 'px';
        this.container.style.top = this.y + 'px';
      } else {
        // No need to scroll.
        this.container.style.display = 'none';
      }
    }
  }

  var mainUI = new MainUI();
}
