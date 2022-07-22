import { isMobile } from './functions.js';

// Подключение базового набора функционала
import lightGallery from 'lightgallery';


lightGallery(document.querySelector('[data-gallery]'), {
	licenseKey: '7EC452A9-0CFD441C-BD984C7C-17C8456E',
	selector: '.row-furniture__item',
	speed: 500,
});
	
