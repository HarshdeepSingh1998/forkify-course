import View from "./view.js";
import icons from 'url:../../img/icons.svg';


class Pagination extends View {
    parentElement = document.querySelector('.pagination');

    generateHTML() {
        const numberOfPages = Math.ceil(this.data.result.length / 10);
        //page1 and other pages

        if(this.data.page === 1 && numberOfPages > 1 ) {
            return `
            <button data-goto=${this.data.page + 1}  class="btn--inline pagination__btn--next">
            <span>Page ${this.data.page + 1}</span>
            <svg class="search__icon">
              <use href="${icons}#icon-arrow-right"></use>
            </svg>
          </button>
            `
        }

        //last page
        if(this.data.page === numberOfPages && numberOfPages > 1) {
           return `
           <button data-goto=${this.data.page - 1} class="btn--inline pagination__btn--prev">
           <svg class="search__icon">
             <use href="${icons}#icon-arrow-left"></use>
           </svg>
           <span>Page ${this.data.page -1}</span>
         </button>
           `
        }

        //middle page
        if(this.data.page < numberOfPages) {
            return `
            <button data-goto=${this.data.page - 1} class="btn--inline pagination__btn--prev">
            <svg class="search__icon">
              <use href="${icons}#icon-arrow-left"></use>
            </svg>
            <span>Page ${this.data.page -1}</span>
          </button>
            <button data-goto=${this.data.page + 1} class="btn--inline pagination__btn--next">
            <span>Page ${this.data.page + 1}</span>
            <svg class="search__icon">
              <use href="${icons}#icon-arrow-right"></use>
            </svg>
          </button>
            `
        }

        //no other pages 

        return(``)
    }

    handlerPaginationFunction(func) {
        this.parentElement.addEventListener('click', (e) => {
            const btn = e.target.closest('.btn--inline');
            if(!btn) return
            const goTo = +btn.dataset.goto;
            func(goTo)
        });
    }
}

export default new Pagination();