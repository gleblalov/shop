
// Получение данных с json-файла
function getData(){
    let url = 'db.json';
    return fetch(url)
     .then(response => {
         if(response.status === 200){
             return response.json();
         } 
     })
     .then(data =>{
         return data;
     }).catch(e =>{
        console.log(e);
     });
}
// end Получение данных с json-файла

//Отображение карточек на странице
function renderCards(data){  
    const cardsInner = document.querySelector('.cards');
    const {goods} = data;
    goods.forEach(good => {
        const card = document.createElement('div');
        let priceSale = Number(good.price) - (Number(good.price)*Number(good.sizeSale)/100);
        card.classList.add('cards__item');
        card.setAttribute('data-category', good.category);
        card.innerHTML = `
                <div class="item__img" data-category= "${good.category}">
                    <img src="${good.img}" alt="">
                    ${good.sale ? `<span class="item__sale">${good.sizeSale}%</span>` : ''}
                </div>
                <div class="item__price">
                     ${good.sale ? 
                        `<span class="price--sale" id='price'>${Math.round(priceSale)} ₴</span>
                         <span class="price--through">${good.price} ₴</span>` : 
                         `<span class="price--real" id='price'>${good.price} ₴</span>`
                    }
                </div>
                <div class="item__title">${good.title}</div>
                <button class="item__button">В корзину</button>
            `;
        cardsInner.appendChild(card);
    });
}
// end Отображение карточек на странице

//Отображение и работа каталога
function renderCatalog(data){
    const {goods} = data;
    const categories =  [...new Set(goods.map(prod => prod.category))];
    const catalogList = document.querySelector('.list');
    const catalogBtn = document.querySelector('.catalog');
    const catalogInner = document.querySelector('.catalog__list');
    const cards = document.querySelectorAll('.cards__item');

    categories.forEach(category => {
        const li = document.createElement('li');
        li.textContent = category;
        catalogList.appendChild(li);
    });
    
    catalogBtn.addEventListener('click', (event)=>{
        if(catalogInner.style.display){
            catalogInner.style.display = '';
        } else {
            catalogInner.style.display = 'block';
        }

        if( event.target.tagName === 'LI'){
            cards.forEach(card =>{
                if(card.dataset.category === event.target.textContent){
                    card.style.display = '';
                } else {
                    card.style.display = 'none'; 
                }
            })
        }
    });
}
//end Отображение и работа каталога

// Фильтр, если ли у товара Акция
 function filterSale(){
    
    const saleCheckbox = document.querySelector('#sale__checkbox');
    const cards = document.querySelectorAll('.cards__item');
    
    saleCheckbox.addEventListener('click', () =>{    
        cards.forEach(card =>{ 
            if(saleCheckbox.checked){
                if(!card.querySelector('.item__sale')){
                    card.style.display = 'none';
                } 
            } else{
                card.style.display = '';
            }
        });
    });
 }
 // end Фильтр, если ли у товара Акция

 // Фильтр по цене
function filterPrice(){
    const cards = document.querySelectorAll('.cards__item');
    const min = document.querySelector('#min');
    const max = document.querySelector('#max');
     
    function filterPriceChange(){
        cards.forEach(card =>{
            const cardPrice = card.querySelector('#price');
            const price = parseFloat(cardPrice.textContent);
            if((min.value && price < min.value) || (max.value && price > max.value)){
               card.style.display = 'none'; 
            } else{
                card.style.display = '';
            }
        });
    }

    min.addEventListener('change', filterPriceChange);
    max.addEventListener('change', filterPriceChange);
}
 // end Фильтр по цене

// Поиск товара
function search(){
    const cards = document.querySelectorAll('.cards__item');
    const searchBtn = document.querySelector('.search__button');
    const searchInput = document.querySelector('.search__input');

    searchBtn.addEventListener('click', ()=>{
        const searchText = new RegExp(searchInput.value.trim(), 'i');
        cards.forEach(card => {
            const title = card.querySelector('.item__title');
            
            if(!searchText.test(title.textContent)){
                card.style.display = 'none';
            } else{
                card.style.display = '';
            }
        });
    });

}
// end Поиск товара

//Открытие/закрытие корзины
const openCartBtn = document.querySelector('.cart__button'),
      closeCartBtn = document.querySelector('.close__button'),
      cart = document.querySelector('.cart');

openCartBtn.addEventListener('click', () => {
    cart.style.display = 'block';
    document.body.style.overflow = 'hidden';
});

closeCartBtn.addEventListener('click', () => {
    cart.style.display = 'none';
    document.body.style.overflow = '';
});
// end Открытие/закрытие корзины

// Добавление товара в корзину
function AddCart(){
    const cards = document.querySelectorAll('.cards .cards__item'),
          cartWrapper = document.querySelector('.cart__wrapper'),
          cartEmpty = document.querySelector('#cart--empty');
        //   cardsCart = cartWrapper.querySelectorAll('.cards__item'),
        //   deleteBtn = cardsCart.querySelector('.item__button');

    cards.forEach(card => {
        const addBtn = card.querySelector('.item__button');
    
        addBtn.addEventListener('click', () => {
            const cardClone = card.cloneNode(true);
            cartWrapper.appendChild(cardClone);
            const deleteBtn = cardClone.querySelector('.item__button');
            deleteBtn.textContent = 'Удалить';
            cartEmpty.remove();
            countGoods();
            totalSum();
            deleteBtn.addEventListener('click', ()=>{
                cartWrapper.removeChild(cardClone);
                // cardClone.remove();
                countGoods();
                totalSum();
                card = cartWrapper.querySelectorAll('.cards__item');
                if(card.length === 0){
                    cartWrapper.appendChild(cartEmpty);
                }
            });   
        });
    });
    
}
// end Добавление товар в корзину

//Cчётчик товаров в корзине
function countGoods(){
    const cartWrapper = document.querySelector('.cart__wrapper'),
          cardsCart = cartWrapper.querySelectorAll('.cards__item'),
          cartCounter = document.querySelector('.cart__counter');

    cartCounter.textContent = cardsCart.length;
}
// end Cчётчик товаров в корзине

//Подсчет суммы в корзине
function totalSum(){
    const cartWrapper = document.querySelector('.cart__wrapper'),
          cardsCart = cartWrapper.querySelectorAll('.cards__item'),
          cardPrice = cartWrapper.querySelectorAll('#price'),
          cartPrice = document.querySelector('#cart__price');
    let totalSum = 0;

    cardPrice.forEach(item => {
        totalSum += parseFloat(item.textContent);
    });
    
    cartPrice.textContent = totalSum;
}
// end Подсчет суммы в корзине

//Удаление товара из корзины
// function deleteCart(){
//     const cartWrapper = document.querySelector('.cart__wrapper'),
//           cardsCart = cartWrapper.querySelectorAll('.cards__item'),
//           deleteBtn = cardsCart.querySelector('.item__button');
//     console.log(cartWrapper);
    
// }
// end Удаление товара из корзины


// Вызов функций
getData().then(data => {
    renderCards(data);
    renderCatalog(data);
    filterSale();
    filterPrice();
    search();
    AddCart();
});


// const initialFunction = ()=> {
//     renderCards();
//     renderCatalog();
//     filterSale();
//     filterPrice();
// }

// initialFunction();