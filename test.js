// cmd commands    
// npm i

const ids = document.getElementById("ids"),
  search = document.getElementById("search"),
  prew = document.getElementById("prew"),
  next = document.getElementById("next"),
  counts = document.getElementById("count");

let count = 0;
let toggle = 1;

prew.onclick = () => {
  ids.innerHTML = "";
  if (count >= 0) {
    toggle--;
    counts.innerText = toggle;
    count -= 50;
    makeAPIRequest('Valantis', 'get_ids', { "offset": count, "limit": 50 })
  }
}

next.onclick = () => {
  ids.innerHTML = "";
  if (count < 7754) {
    toggle++;
    counts.innerText = toggle;
    count += 50;
    makeAPIRequest('Valantis', 'get_ids', { "offset": count, "limit": 50 })
  }
}

document.oninput = e => {
  let value = e.target.value
  if (e.target.id == "price")
    makeAPIRequest('Valantis', 'filter', { "price": Number(value) })
  else if (e.target.id == "brand")
    makeAPIRequest('Valantis', 'filter', { "brand": value })
  else if (e.target.id == "product")
    makeAPIRequest('Valantis', 'filter', { "product": value })
}

function generateAuthHeaderValue(password) {
  const date = new Date();
  const timestamp = date.getUTCFullYear().toString() + (date.getUTCMonth() + 1).toString().padStart(2, '0') + date.getUTCDate().toString().padStart(2, '0');
  const authString = password + '_' + timestamp;
  return md5(authString).toString();
}

function makeAPIRequest(password, action, params) {
  const url = 'http://api.valantis.store:40000';
  const authHeader = generateAuthHeaderValue(password);
  const requestBody = {
    action,
    params
  };

  fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-Auth': authHeader
    },
    body: JSON.stringify(requestBody)
  })
    .then(response => response.json())
    .then(result => {
      if (action == "get_ids") {
        set_ids(result)

      }
      else if (action == "get_items") {
        addItems(result)
      }
      else if (action == "filter") {
        ids.innerHTML = "";
        set_ids(result)
      }
    })
    .catch(err => console.error(err))
}

function set_ids(par) {
  for (let i in par)
    makeAPIRequest('Valantis', 'get_items', { "ids": par[i] })
}

makeAPIRequest('Valantis', 'get_ids', { "offset": 0, "limit": 50 })

function addItems(par) {
  for (let i in par) {
    for (let j of par[i]) {
      if (j.id != j.id + 1) {
        ids.innerHTML += `
        <div class="id">
        <div>id: ${j.id}</div>
        <div>brand: ${j.brand}</div>
        <div>product: ${j.product}</div>
        <div>price: ${j.price}</div>
        </div> `
      }
    }
  }
}

