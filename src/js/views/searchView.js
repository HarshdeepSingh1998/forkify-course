class SearchView { 
    parentElement = document.querySelector('.search');

    constructor() {

    }

    getQuery() {
        return this.parentElement.querySelector('.search__field').value
    }

    clearInput() {
        this.parentElement.querySelector('.search__field').value = ''
    }
    handlerSearchFunction(func) {
        this.parentElement.addEventListener('submit', function(e) {
            e.preventDefault();
            func();
        })
    }
}


export default new SearchView;