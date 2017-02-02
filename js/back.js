var body = document.getElementById('body_error');

for(var i=0; i<40; i++){
  var innerDiv = document.createElement('div');
  innerDiv.className = 'line';

  body.appendChild(innerDiv);
}

for(var i=0; i<30; i++){
  var innerDiv = document.createElement('div');
  innerDiv.className = 'dot';

  body.appendChild(innerDiv);
}
