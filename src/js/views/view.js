import icons from 'url:../../img/icons.svg';

export default class View {
    data;

    constructor() {
        
    }

    renderSpinner() {
        const spin = `
        <div class="spinner">
        <svg>
          <use href="${icons}#icon-loader"></use>
        </svg>
      </div>
        `
        this.parentElement.innerHTML = '';
        this.parentElement.insertAdjacentHTML('afterbegin', spin);
    }

    renderError() {
        const html = `
        <div class="error">
            <div>
              <svg>
                <use href="${icons}#icon-alert-triangle"></use>
              </svg>
            </div>
            <p>${this.errorMessage}</p>
          </div>
        `;
        this.parentElement.innerHTML = '';
        this.parentElement.insertAdjacentHTML('afterbegin', html);
    }

    renderSuccessMessage() {
        const html = `
        <div class="message">
        <div>
          <svg>
            <use href="${icons}#icon-smile"></use>
          </svg>
        </div>
        <p>${this.successMessage}</p>
      </div>
        `;
        this.parentElement.innerHTML = '';
        this.parentElement.insertAdjacentHTML('afterbegin', html);
    }

    render(recipe) {
        this.data = recipe;
        const renderHTML = this.generateHTML();
        this.parentElement.innerHTML = ''
        this.parentElement.insertAdjacentHTML('afterbegin', renderHTML);
    }

    update(recipe) {
      this.data = recipe;
      const renderHTML = this.generateHTML();

      const newDOM = document.createRange().createContextualFragment(renderHTML);

      const newElements = Array.from(newDOM.querySelectorAll('*'));

      const elements = Array.from(this.parentElement.querySelectorAll('*'));
      
      newElements.forEach((el, i) => {
        const currentEl = elements[i];
        if(!el.isEqualNode(currentEl) && el.firstChild?.nodeValue.trim() !== '') {
          currentEl.textContent = el.textContent
        }

        //changing attributes
        if(!el.isEqualNode(currentEl)) {
          Array.from(el.attributes).forEach((attr) => {
            currentEl.setAttribute(attr.name, attr.value)
          })
        }
      })
  }
}