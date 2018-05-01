{
  class Background {
    constructor() {}

    static setLocation(x, y, width, height) {
      /*
       * we store location offsets from the edge of the screen.
       * positive |x|, |y| is offset from the top left.
       * negative is offset from the bottom right.
       */
      if (x > width / 2) {
        x = x - width;
      }

      if (y > height / 2) {
        y = y - height;
      }

      localStorage.setItem('xc_x', x);
      localStorage.setItem('xc_y', y);
      console.info('set:' + x + ',' + y);
    }

    static getLocation(width, height) {
      let x = parseInt(localStorage.getItem('xc_x'));
      let y = parseInt(localStorage.getItem('xc_y'));

      console.info('stored:' + x + ',' + y);
      if (!x || isNaN(x) || !y || isNaN(y)) {
        x = -96;
        y = -Math.max(height * .4, 160);
      }

      if (x < 0) {
        x = x + width;
      }
      if (y < 0) {
        y = y + height;
      }

      let loc = {x: x, y: y};
      return loc;
    }

    onMessage(message, sender, callback) {
      console.info('received message:');
      console.info(message);
      if (message.name == 'setLocation') {
        let d = message.data;
        Background.setLocation(d.x, d.y, d.width, d.height);
      } else if (message.name == 'getLocation') {
        let d = message.data;
        let response = Background.getLocation(d.width, d.height);
        callback(response);
        console.info('returned:');
        console.info(response);
      }
    }
  }

  var bg = new Background();

  chrome.runtime.onMessage.addListener(bg.onMessage.bind(bg));
}
