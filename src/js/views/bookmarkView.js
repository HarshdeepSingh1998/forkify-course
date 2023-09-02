import View from "./view.js";
import icons from 'url:../../img/icons.svg';

class BookmarkView extends View {
    parentElement = document.querySelector('.bookmarks__list');
    errorMessage = 'no bookmarks found'
    constructor() {
        super()
    }
    
    generateHTML () {
      const id = window.location.hash.slice(1);
        return this.data.map(data => 
         `<li class="preview">
         <a class="preview__link ${id === data.id ? 'preview__link--active': ''}"  href="#${data.id}">
           <figure class="preview__fig">
             <img src="${data.imageUrl}" alt="Test" />
           </figure>
           <div class="preview__data">
             <h4 class="preview__title">${data.title}</h4>
             <p class="preview__publisher">${data.publisher}</p>
             <div class="preview__user-generated">
               <svg>
                 <use href="${icons}#icon-user"></use>
               </svg>
             </div>
           </div>
         </a>
       </li>
         `).join('') 
    }
}


export default new BookmarkView;
