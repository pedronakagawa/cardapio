
const products={
  //Tradicionais
  "x-burguer":{name:"X Burguer",price:20},
  "x-salada":{name:"X Salada",price:25},
  "x-frango":{name:"X Frango",price:17},
  "x-egg":{name:"X Egg",price:18},
  "x-bacon":{name:"X Bacon",price:19},
  "x-baconegg":{name:"X Bacon Egg",price:21},
  "x-tudao":{name:"X Tudão",price:35},
  //Especiais
  "burguer-r7":{name:"Burguer R7",price:20},
  "burguer-r1":{name:"Burguer R1",price:23},
  "bbq-bacon":{name:"BBQ Bacon",price:25},
  "bm":{name:"BM",price:27},
  "abracadabra":{name:"Abracadabra",price:28},
  "black-r1":{name:"Black R1",price:33},
  //Combos
  "combo-classico":{name:"Combo Clássico",price:29.90},
  "combo-r1":{name:"Combo R1",price:34.90},
  "combo-bbq":{name:"Combo BBQ",price:44.90},
  "combo-kids":{name:"Combo Kids",price:29.90},
  // Salgados
  "coxinha":{name:"Coxinha",price:10},
  "maravilha":{name:"Maravilha",price:10},
  "porcao-festa":{name:"Porção Tamanho Festa",price:20},
  //Porções
  "bf-p":{name:"Batata Frita Simples P",price:10},
  "bf-m":{name:"Batata Frita Simples M",price:15},
  "bf-g":{name:"Batata Frita Simples G",price:25},
  "bfcb-p":{name:"Batata com Cheddar e Bacon P",price:20},
  "bfcb-m":{name:"Batata com Cheddar e Bacon M",price:25},
  "bfcb-g":{name:"Batata com Cheddar e Bacon G",price:36},
  //Pastéis
  "p-queijo":{name:"Pastel de Queijo",price:12},
  "p-pizza":{name:"Pastel de Pizza",price:15},
  "p-carne":{name:"Pastel de Carne",price:17},
  "p-carne-queijo":{name:"Pastel Carne com Queijo",price:20},
  //Doces
  "pudim":{name:"Pudim",price:7},
  "bolo-fatia":{name:"Bolo Fatia",price:12},
  "tortinha":{name:"Tortinha",price:7},
  "copo-felicidade":{name:"Copo da Felicidade",price:12}
};

let cart = JSON.parse(localStorage.getItem("cart")) || {};

const cartItems = document.getElementById("cartItems");
const cartCount = document.getElementById("cartCount");
const totalSpan = document.getElementById("total");
const totalCart1 = document.getElementById("total1");
const totalCart2 = document.getElementById("total2");
const bairro = document.getElementById("bairro");
const cartBtn = document.getElementById("cartBtn");

const fmt=v=>v.toLocaleString("pt-BR",{style:"currency",currency:"BRL"});


// ===== RESTAURA BAIRRO =====
const savedBairro = localStorage.getItem("bairro");
if(savedBairro) bairro.value = savedBairro;

function saveStorage(){
  localStorage.setItem("cart", JSON.stringify(cart));
  localStorage.setItem("bairro", bairro.value);
}

function toggle(id){
  const el=document.getElementById(id);
  el.style.display=el.style.display==="none"?"block":"none";
}



function add(id){
  cart[id] ? cart[id].qty++ : cart[id]={...products[id],qty:1};
  saveStorage();
  render();
}


function removeItem(id){
  if(cart[id].qty>1) cart[id].qty--;
  else delete cart[id];
  saveStorage();
  render();
}

function render(){
  cartItems.innerHTML="";
  let total=0,count=0;

  Object.entries(cart).forEach(([id,i])=>{
    total+=i.price*i.qty;
    count+=i.qty;

    cartItems.innerHTML+=`
      <li class="list-group-item d-flex justify-content-between align-items-center">
        <strong>${i.name}</strong>
        <div>
        <button class="btn btn-sm btn-danger" onclick="removeItem('${id}')">−</button>
        <strong class="m-1">${i.qty}</strong>
        <button class="btn btn-sm btn-success" onclick="add('${id}')">+</button>
        </div>
      </li>`;

  });

  total += Number(bairro.value || 0);

  totalSpan.innerText = fmt(total - bairro.value);
  totalCart1.innerText = fmt(total - bairro.value);
  totalCart2.innerText = fmt(total);
  cartCount.innerText = count;

  saveStorage();
}

function toggleTroco(){
  troco.style.display = pagamento.value==="Dinheiro" ? "block" : "none";
  troco.required = pagamento.value === "Dinheiro";
}

// Calcular hora da entrega
function calcularHorarioEntrega(minInicial, minFinal) {
  const agora = new Date();

  const inicio = new Date(agora.getTime() + minInicial * 60000);
  const fim = new Date(agora.getTime() + minFinal * 60000);

  const formatar = (data) =>
    data.toLocaleTimeString("pt-BR", {
      hour: "2-digit",
      minute: "2-digit"
    });

  return `${formatar(inicio)} a ${formatar(fim)}`;
}

const horarioEntrega = calcularHorarioEntrega(40, 50);





function send(){

  const form = document.getElementById("orderForm");


  if(!form.checkValidity()){
    form.classList.add("was-validated");
    return;
  }


  if(!Object.keys(cart).length) return alert("Carrinho vazio");

  let msg="*Pedido - Tsunami Hamburgueria*\n\n";
  Object.values(cart).forEach((i,n)=>{

    let precoQty = i.price * i.qty

    msg+=`* ${i.name}: ${i.qty} und. = ${precoQty.toLocaleString('pt-br', { style: 'currency', currency: 'BRL' })}\n`;
  });

  msg+=`\n--------------------------------`;  
  msg+=`\n*SUBTOTAL:* ${totalCart1.innerText}`;  
  msg+=`\n--------------------------------\n`;
  
  msg+=`\n🛵 *Dados para entrega*\n`;
  msg+=`\n*Nome:* ${nome.value}`;
  msg+=`\n*Endereço:* ${endereco.value}`;
  msg+=`\n*Bairro:* ${bairro.options[bairro.selectedIndex].text.split("-")[0].trim()}`;
  if(complemento.value) msg+=`\n*Complemento:* ${complemento.value}`;
  if(referencia.value) msg+=`\n*Ponto de Referência:* ${referencia.value}`;
  msg+=`\n*Telefone:* ${telefone.value}\n`;
  
  msg+=`\n*Taxa de Entrega:* ${Number(bairro.value).toLocaleString('pt-br', { style: 'currency', currency: 'BRL' })}\n`;
  
  msg+=`\n🕙 *Tempo de Entrega:* aprox. ${horarioEntrega}\n`;

  msg+=`\n--------------------------------`;
  msg+=`\n🧾 *TOTAL:* ${totalCart2.innerText}`;
  msg+=`\n--------------------------------\n`;
  
  msg+=`\n💳 *PAGAMENTO*\n`;

  msg+=`\n*Pagamento:* ${pagamento.value}`;
  if(pagamento.value==="Dinheiro") msg+=`\nTroco para: ${troco.value}`;

  window.open("https://wa.me/5513997175595?text="+encodeURIComponent(msg),"_blank");

  localStorage.clear();
  cart = {};
  render();
}

// ===== CONTROLE DO BOTÃO FLUTUANTE =====
const cartModal = document.getElementById("cartModal");
cartModal.addEventListener("show.bs.modal",()=>cartBtn.style.display="none");
cartModal.addEventListener("hidden.bs.modal",()=>cartBtn.style.display="block");

// ===== INICIAL =====
render();