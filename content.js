var container = document.createElement('div');
container.id = 'xc-container';
document.body.appendChild(container);

var pageUpButton = document.createElement('div');
pageUpButton.id = 'xc-pageup';
container.appendChild(pageUpButton);

var pageDownButton = document.createElement('div');
pageDownButton.id = 'xc-pagedown';
container.appendChild(pageDownButton);


pageUpButton.innerText = '▲';
pageUpButton.onclick = function() {
  window.scrollTo(0, window.scrollY - window.innerHeight * .9);
};

pageDownButton.innerText = '▼';
pageDownButton.onclick = function() {
  window.scrollTo(0, window.scrollY + window.innerHeight * .9);
};

container.style.top = window.innerHeight * .8 + 'px';
container.style.left = window.innerWidth - 100 + 'px';
