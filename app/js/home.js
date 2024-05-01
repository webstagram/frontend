
export function home() {
  const lol = document.getElementById('lol');

  setInterval(async () =>{    
    const response = await fetch('https://api.chucknorris.io/jokes/random');
    const text = await response.json();
    
    const p = document.createElement('p');
    p.innerText = text.value;

    lol.append(p);
  }, 2500);
}