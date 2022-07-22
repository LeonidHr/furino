// Проверка на мобайл
import { isMobile } from "./functions.js";
// Удаление классов
import { removeClasses} from "./functions.js";
// ibg 
import { ibg } from "./functions.js";


window.addEventListener("load", function() {
  document.addEventListener("click", documentActions);

  // Делегирыавание
  function documentActions(e) {
    const targetEvents = e.target;

    if (window.innerWidth > 768 && isMobile.any()) {
      if (targetEvents.classList.contains('menu__arrow')) {
        targetEvents.closest('.menu__item').classList.toggle('_hover');
      }
      if (
        !targetEvents.classList.contains('menu__arrow') && document.querySelectorAll('.menu__item._hover').length > 0
        ) {
        removeClasses(document.querySelectorAll('.menu__item._hover'), '_hover');
      }
    }
    if (targetEvents.classList.contains('search-form__icon')) {
      document.querySelector('.search-form').classList.toggle('_active');
    } else if (!targetEvents.closest('.search-form') && document.querySelector('.search-form._active')) {
      document.querySelector('.search-form').classList.remove('_active');
    }  
    if (e.target.closest('.icon-menu')) {
      document.body.classList.toggle('_lock');
      document.documentElement.classList.toggle("menu-open");
    }

    if (targetEvents.classList.contains('products__more')) {
      getProducts(targetEvents);
      e.preventDefault();
    }

    if (targetEvents.classList.contains('actions-product__btn')) {
      const productId = targetEvents.closest('.item-product').dataset.pid;
      addToCart(targetEvents, productId);
      e.preventDefault();
    }

    if (targetEvents.classList.contains('cart-header__icon') || targetEvents.closest('.cart-header__icon')) {
      if (document.querySelector('.cart-list').children.length > 0) {
        document.querySelector('.cart-header').classList.toggle('_active');
      }
      e.preventDefault(); 
    } else if (!targetEvents.closest('.cart-header') && !targetEvents.classList.contains('actions-product__btn')) {
      document.querySelector('.cart-header').classList.remove('_active');
    }

    if (targetEvents.classList.contains('cart-list__delete')) {
      const productId = targetEvents.closest('.cart-list__item').dataset.cartPid;
      updateCart(targetEvents, productId, false);
      e.preventDefault();
    }
  }  

  // header 

  const headerElement = document.querySelector('.header');

  const callback = function(entries, observer) {
    if (entries[0].isIntersecting) {
      headerElement.classList.remove('_scroll');
    } else {
      headerElement.classList.add('_scroll');
    }
  };

  const headerObserver = new IntersectionObserver(callback);
  headerObserver.observe(headerElement);


  // Функция для показа товаров

  async function getProducts(button) {
    if (!button.classList.contains('_hold')) {
      button.classList.add('_hold');
      const file = "json/products.json";
      let response = await fetch(file, {
        method: "GET"
      });

      if (response.ok) {
        let result = await response.json();
        loadProducts(result);
        button.classList.remove('_hold');
        button.remove();
      } else {
        alert('Ошибка!');
      }
    }
  }

  function loadProducts(data) { 
    const productsItems = document.querySelector('.products__items');

    data.products.forEach(item => {
      const productId = item.id;
      const productUrl = item.url;
      const productTitle = item.title;
      const productText = item.text;
      const productLabels = item.labels;
      const productImage = item.image;
      const productPrice = item.price;
      const productPriceOld = item.priceOld;
      const productLikeUrl = item.likeUrl;
      const productShareUrl = item.shareUrl;

      let productTemplateStart = `<article data-pid="${productId}" class="products__item item-product">`;
      let productTemplateEnd = ` </article>`;

      
      let productTemplateLabels = '';
      if (productLabels) {
        let productLabelsStart = `<div class="item-product__labels">`;
        let productLabelsContent = ``;
        let productLabelsEnd = `</div>`;

        productLabels.forEach(labelItem => {
          productLabelsContent += `
            <div class="item-product__label item-product__label--${labelItem.type}">${labelItem.value}</div>
          `;
        });
      
        productTemplateLabels += productLabelsStart;
        productTemplateLabels += productLabelsContent;
        productTemplateLabels += productLabelsEnd;
      }

      let productTemplateImage = `
        <a class="item-product__img _ibg" href="${productUrl}">
          <img src="img/products/${productImage}" alt="${productTitle}">
        </a>
      `;

      let productTemplateBodyStart = `<div class="item-product__body">`;
      let productTemplateBodyEnd = `</div>`;

      let productTemplateContent = `
        <div class="item-product__content">
          <h4 class="item-product__title">${productTitle}</h4>
          <div class="item-product__text">${productText}</div>
        </div>
      `;

      let productTemplatePrices = '';
      let productTemplatePricesStart = `<div class="item-product__prices">`;
      let productTemplatePricesEnd = `</div>`;
      let productTemplateCurrentPrice = `<div class="item-product__price">${productPrice}</div>`;
      let productTemplateOldPrice = ` <div class="item-product__price item-product__price--old">${productPriceOld}</div>`;

      productTemplatePrices += productTemplatePricesStart;
      productTemplatePrices += productTemplateCurrentPrice;

      if (productPriceOld) {
        productTemplateCurrentPrice += productTemplateOldPrice;
      }
      productTemplatePrices += productTemplatePricesEnd;

      let productTemplateActions = `
        <div class="item-product__actions actions-product">
          <div class="actions-product__body">
            <a class="actions-product__btn btn btn--white" href="#">Add to cart</a>
            <a class="actions-product__link _icon-share" href="${productShareUrl}">Share</a>
            <a class="actions-product__link _icon-favorite" href="${productLikeUrl}">Like</a>
          </div>
        </div>
      `;

      let productTemplateBody = '';
      productTemplateBody += productTemplateBodyStart;
      productTemplateBody += productTemplateContent;
      productTemplateBody += productTemplatePrices;
      productTemplateBody += productTemplateActions;
      productTemplateBody += productTemplateBodyEnd;

      let productTemplate = '';
      productTemplate += productTemplateStart;
      productTemplate += productTemplateLabels;
      productTemplate += productTemplateImage;
      productTemplate += productTemplateBody;
      productTemplate += productTemplateEnd;

      productsItems.insertAdjacentHTML("beforeend", productTemplate);

      ibg();
    });
  }

  // Добавление товаров в карзину

  function addToCart(productButton, productId) {
    if (!productButton.classList.contains('_hold')) {
      productButton.classList.add('_hold');
      productButton.classList.add('_fly');

      const cart = document.querySelector('.cart-header__icon');
      const product = document.querySelector(`[data-pid="${productId}"]`);
      const productImage = product.querySelector('.item-product__img');

      const productImageFly = productImage.cloneNode(true);

      const productImageFlyWidth = productImage.offsetWidth;
      const productImageFlyHeight = productImage.offsetHeight;
      const productImageFlyTop = productImage.getBoundingClientRect().top;
      const productImageFlyLeft = productImage.getBoundingClientRect().left;

      productImageFly.setAttribute('class', '_flyImage _ibg');
      productImageFly.style.cssText = `
        top: ${productImageFlyTop}px;
        left: ${productImageFlyLeft}px;
        width: ${productImageFlyWidth}px;
        height: ${productImageFlyHeight}px;
      `;

      document.body.append(productImageFly);
      ibg();

      const cartFlyTop = cart.getBoundingClientRect().top;
      const cartFlyLeft = cart.getBoundingClientRect().left;
    
      productImageFly.style.cssText = `
        top: ${cartFlyTop}px;
        left: ${cartFlyLeft}px;
        width: 0px;
        height: 0px;
        opacity: 0;
      `;
      ibg();

      productImageFly.addEventListener("transitionend", () => {
        if (productButton.classList.contains('_fly')) {
          productImageFly.remove();
          updateCart(productButton, productId, true);
          productButton.classList.remove('_fly');
        }
      });
    }  
  }

  function updateCart(productButton, productId, productAdd) {
    const cart = document.querySelector('.cart-header'),
          cartIcon = document.querySelector('.cart-header__icon'),
          cartQuatity = cartIcon.querySelector('span'),
          cartList = document.querySelector('.cart-header__list'),
          cartProduct = document.querySelector(`[data-cart-pid="${productId}"]`);

    if (productAdd) {
      if (cartQuatity) {
        ++cartQuatity.innerHTML;
      } else {
        cartIcon.insertAdjacentHTML("beforeend", `<span>1</span>`);
      }

      if (!cartProduct) {
        const product = document.querySelector(`[data-pid="${productId}"]`);
        const cartProductImage = product.querySelector('.item-product__img').innerHTML;
        const cartProductTitle = product.querySelector('.item-product__title').innerHTML;
        const cartProductContent = `
          <a class="cart-list__img _ibg" href="#">${cartProductImage}</a>
          <div class="cart-list__body">
            <a class="cart-list__title" href="#">${cartProductTitle}</a>
            <div class="cart-list__quantity">Quantity: <span>1</span></div>
            <a class="cart-list__delete" href="#">Delete</a>
          </div>
        `;

        cartList.insertAdjacentHTML("beforeend", 
        `
          <li data-cart-pid="${productId}" class="cart-list__item">${cartProductContent}</li>
        `);
      } else {
        const cartProductQuantity = cartProduct.querySelector('.cart-list__quantity span');
        cartProductQuantity.innerHTML = ++cartProductQuantity.innerHTML;
      }

      productButton.classList.remove('_hold');
    } else {
      const cartProductQuantity = cartProduct.querySelector('.cart-list__quantity span');

      if (cartProductQuantity.innerHTML > 1) {
        --cartProductQuantity.innerHTML;
      } else {
        cartProduct.remove();
      }

      const cartQuantityValue = --cartQuatity.innerHTML;

      if (cartQuantityValue > 0) {
        cartQuatity.innerHTML = cartQuantityValue;
      } else {
        cartQuatity.remove();
        cart.classList.remove('_active');
      }
    }
  }

  // Галлерея фурнитуры
  const furniture = document.querySelector('.furniture__body');
  if (furniture && !isMobile.any()) {
    const furnitureItems = document.querySelector('.furniture__items');
    const furnitureColumns = document.querySelectorAll('.furniture__column');

    // Скорость анимации
    const speed = furniture.dataset.speed;

    let positionX = 0;
    let coordXprocent = 0;
  
    function setMouseGalleryStyle() {
      let furnitureItemsWidth = 0;
      furnitureColumns.forEach(column => {
        furnitureItemsWidth += column.offsetWidth;
      });

      const furnitureDifferent = furnitureItemsWidth - furniture.offsetWidth;
      const distX = Math.floor(coordXprocent - positionX);

      positionX = positionX + (distX * speed);
      let position = furnitureDifferent / 200 * positionX;

      furnitureItems.style.cssText = `transform: translate3d(${-position}px, 0, 0)`;

      if (Math.abs(distX) > 0) {
        requestAnimationFrame(setMouseGalleryStyle);
      } else {
        furniture.classList.remove('_init');
      }
    }

    furniture.addEventListener('mousemove', e => {
      const furnitureWidth = furniture.offsetWidth;

      // Ноль по середине
      const coordX = e.pageX - furnitureWidth / 2;

      // Получаем проценты
      coordXprocent = coordX / furnitureWidth * 200;

      if (!furniture.classList.contains('_init')) {
        requestAnimationFrame(setMouseGalleryStyle);
        furniture.classList.add('_init');
      }
    });
  }
});
