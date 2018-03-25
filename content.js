var container = document.createElement('div');
container.id = 'xc-container';

var pageDownButton = document.createElement('div');
pageDownButton.id = 'xc-pagedown';

container.appendChild(pageDownButton);
document.body.appendChild(container);


pageDownButton.innerText = '▼';
pageDownButton.onclick = function() {
  window.scrollTo(0, window.scrollY + window.innerHeight * .9);
};

container.style.top = window.innerHeight * .8 + 'px';
container.style.left = window.innerWidth - 100 + 'px';
