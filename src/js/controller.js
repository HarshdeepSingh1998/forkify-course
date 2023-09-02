
import 'core-js/stable';
import 'regenerator-runtime/runtime';
 
import * as model from './model.js';
import recipeView from './views/Recipeview.js';
import searchView from './views/searchView.js';
import resultView from './views/resultView.js';
import pagination from './views/pagination.js';
import bookmarkView from './views/bookmarkView.js';
import addRecipeView from './views/addNewRecipe.js';


// https://forkify-api.herokuapp.com/v2

////////////////////////////////////////////////////////////

const controlRecipe = async function() {
  try{
    const hashId = window.location.hash.slice(1);
    if(!hashId) return

    recipeView.renderSpinner();

    // to render the updated result view on hash change
    resultView.render(model.getPage(model.state.search.page))

    // to render the bookmark selected 
    bookmarkView.render(model.state.bookmarks)

    //load recipe. get data from model file

    await model.loadRecipe(hashId)

    const {recipe} = model.state;

    //render recipe

    recipeView.render(recipe)


  } catch(error) {
    recipeView.renderError()
  }
}

const controlSearch = async function() {
  try{
    //get query
    const q = searchView.getQuery();

    if(!q) return 
    searchView.clearInput();

    //spinner
    resultView.renderSpinner()

    // get data 
    await model.loadSearchResults(q);

    if(model.state.search.result.length === 0) throw new Error('error')
    
    console.log(model.state.search.result)

    //render result
    resultView.render(model.getPage(1))

    //render pagination
    pagination.render(model.state.search);
  } catch(err) {
    resultView.renderError();
  }
}

const paginationFunction = function(pageNumber) {
      //render result
      resultView.render(model.getPage(pageNumber))

      //render pagination
      pagination.render(model.state.search);
}

const serving = function (newServing) {

  model.updateServing(newServing);

  
  recipeView.update(model.state.recipe)
}

const controlBookmark = function() {
  if(!model.state.recipe.bookmarked) {
    model.bookmark(model.state.recipe);  
  } else {
    model.removeBookmark(model.state.recipe.id);
  }
  
  recipeView.render(model.state.recipe) ;

  bookmarkView.render(model.state.bookmarks)
}

const controlGetFormData = async function(recipe) {
  try {

    //render spinner
    addRecipeView.renderSpinner()

    //upload recipe , bookmark it and add key property to recipe
    await model.uploadFormData(recipe);

    //render recipe 
    recipeView.render(model.state.recipe)

    //success message
    addRecipeView.renderSuccessMessage()

    //bookmark render 
    bookmarkView.render(model.state.bookmarks)

    //change hashValue
    // window.location.hash = model.state.recipe.id;

    window.history.pushState(null, '', `#${model.state.recipe.id}`)

    //close the form 
    setTimeout(() => {
      addRecipeView.func()
    //rendering form back 
      addRecipeView.render()
    }, 1500);

  } catch(err) {
    addRecipeView.renderError()
  }
}
const init = function() {
  //right side recipe view
  recipeView.handlerFunction(controlRecipe);
  //top search view
  searchView.handlerSearchFunction(controlSearch);
  //bottom pagination 
  pagination.handlerPaginationFunction(paginationFunction)
  //serving change 
  recipeView.handleServingFunction(serving)
  //bookmark
  recipeView.handleBookmark(controlBookmark);
  //form submit data
  addRecipeView.addHandlerForm(controlGetFormData)
}


init();


