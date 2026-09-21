const q=(s,p=document)=>p.querySelector(s),qa=(s,p=document)=>[...p.querySelectorAll(s)];
const cards=qa(".product-card"),grid=q(".product-grid"),toast=q(".toast");
let cart=[],wish=0,filter="all";

function notify(message){toast.textContent=message;toast.classList.add("show");clearTimeout(notify.timer);notify.timer=setTimeout(()=>toast.classList.remove("show"),2200)}
function applyFilter(term=""){
  const needle=term.trim().toLowerCase();
  cards.forEach(card=>card.hidden=!(filter==="all"||card.dataset.category.includes(filter))||!card.dataset.name.toLowerCase().includes(needle));
}
qa("[data-filter]").forEach(button=>button.addEventListener("click",()=>{
  filter=button.dataset.filter;qa("[data-filter]").forEach(item=>item.classList.toggle("active",item===button));applyFilter();
}));
qa("[data-filter-link]").forEach(card=>card.addEventListener("click",()=>{
  filter=card.dataset.filterLink;const target=q(`[data-filter="${filter}"]`);if(target)target.click();
}));
q("#sort-products").addEventListener("change",event=>{
  const mode=event.target.value;const sorted=[...cards];
  if(mode!=="featured") sorted.sort((a,b)=>(+a.dataset.price- +b.dataset.price)*(mode==="low"?1:-1));
  sorted.forEach(card=>grid.append(card));
});
qa(".heart-button").forEach(button=>button.addEventListener("click",()=>{
  button.classList.toggle("active");button.textContent=button.classList.contains("active")?"♥":"♡";
  wish+=button.classList.contains("active")?1:-1;q("[data-wishlist-count]").textContent=wish;notify(button.classList.contains("active")?"Saved to your wishlist":"Removed from wishlist");
}));
function renderCart(){
  const box=q(".drawer-items");q("[data-cart-count]").textContent=cart.length;
  box.innerHTML=cart.length?cart.map((item,index)=>`<div class="drawer-item"><div><strong>${item.name}</strong><p>₹ ${Number(item.price).toLocaleString("en-IN")}</p></div><button data-remove="${index}">Remove</button></div>`).join(""):"<p>Your bag is waiting for something beautiful.</p>";
  qa("[data-remove]",box).forEach(button=>button.addEventListener("click",()=>{cart.splice(+button.dataset.remove,1);renderCart()}));
}
qa(".quick-add").forEach(button=>button.addEventListener("click",()=>{
  const card=button.closest(".product-card");cart.push({name:card.dataset.name,price:card.dataset.price});renderCart();notify("Added to your bag");
}));
const drawer=q(".store-drawer"),backdrop=q(".drawer-backdrop");
function toggleDrawer(open){drawer.classList.toggle("open",open);backdrop.classList.toggle("open",open);drawer.setAttribute("aria-hidden",String(!open))}
q(".cart-toggle").addEventListener("click",()=>toggleDrawer(true));q(".drawer-head button").addEventListener("click",()=>toggleDrawer(false));backdrop.addEventListener("click",()=>toggleDrawer(false));
q(".search-toggle").addEventListener("click",()=>q(".search-panel").classList.toggle("open"));
q(".search-panel").addEventListener("submit",event=>{event.preventDefault();filter="all";applyFilter(q(".search-panel input").value);q("#shop").scrollIntoView({behavior:"smooth"});q(".search-panel").classList.remove("open")});
const menu=q(".menu-button");menu.addEventListener("click",()=>{const open=q(".main-nav").classList.toggle("open");menu.setAttribute("aria-expanded",String(open))});qa(".main-nav a").forEach(link=>link.addEventListener("click",()=>q(".main-nav").classList.remove("open")));
q(".subscribe-form").addEventListener("submit",event=>{event.preventDefault();notify("Welcome to the YURS circle");event.target.reset()});
const terms=q(".terms-dialog");q(".terms-open").addEventListener("click",()=>terms.showModal());q(".terms-close").addEventListener("click",()=>terms.close());
