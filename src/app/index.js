import "../styles/index.css";


function component () {
  var element = document.createElement('h1');

   // lodash is required for the next line to work 
  element.innerHTML = 'osfmg it working';

  return element;
}

document.body.insertBefore(component(), document.getElementById('root'));
