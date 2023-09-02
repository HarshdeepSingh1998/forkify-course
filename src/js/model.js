import { async } from "regenerator-runtime";
import { API_URL, KEY } from "./config";
import { getJSON, sendJSON } from "./helpers";

export const state = {
    recipe: {},
    search: {
        query: '',
        result: [],
        page: 1,
    },
    bookmarks: [],
}

export const loadRecipe = async function (hashId) {
    try {
        const data = await getJSON(`${API_URL}/${hashId}?key=${KEY}`);
        let {recipe} = data.data;
        state.recipe = {
          id: recipe.id,
          cookingTime: recipe.cooking_time,
          imageUrl: recipe.image_url,
          ingredients: recipe.ingredients,
          publisher: recipe.publisher,
          serving: recipe.servings,
          sourceUrl: recipe.source_url,
          title: recipe.title,
          ...(recipe.key && {key: recipe.key})

        };
        //searchinf in the bookmark array for the hashid 
        if(state.bookmarks.some(book => book.id === hashId)){
            state.recipe.bookmarked = true;
        } else {
            state.recipe.bookmarked = false;
        }
    } catch(err) {
        throw err;
    }
}


export const loadSearchResults = async function (query) {
    try{
        state.search.query = query;
        const data = await getJSON(`${API_URL}?search=${query}&key=${KEY}`);
        state.search.result =  data.data.recipes.map(rec => {
            return {
                id: rec.id,
                title: rec.title,
                publisher: rec.publisher,
                imageUrl: rec.image_url,
                ...(rec.key && {key: rec.key})
            }
        })
    } catch(err) {
        throw err
    }
}


export const getPage = function (page) {

    state.search.page = page;

    let start = (page - 1) * 10;
    let end = (page) * 10;

    return state.search.result.slice(start, end)
}

export const updateServing = function(serv) {
    state.recipe.ingredients.forEach(ing => {
        ing.quantity = (ing.quantity * serv) / state.recipe.serving; 
    });

    state.recipe.serving = serv;
}

const localStorageSetBookmark = function() {
    localStorage.setItem('bookmark', JSON.stringify(state.bookmarks))
}

export const bookmark = function(recipe) {
    
    state.bookmarks.push(recipe);

    if(recipe.id === state.recipe.id) {
        state.recipe.bookmarked = true;
    }
    localStorageSetBookmark()
}

export const removeBookmark = function(id) {
    const i = state.bookmarks.findIndex(data => data.id === id)
    state.bookmarks.splice(i, 1);
    
    if(id === state.recipe.id) {
        state.recipe.bookmarked = false;
    }

    localStorageSetBookmark()
}


const getLocalStorageData = function() {
    const data = localStorage.getItem('bookmark');
    if(data) {
        state.bookmarks = JSON.parse(data)
    }
}

getLocalStorageData();


export const uploadFormData = async function(newRecipe) {
    try{
        const ingredients = Object.entries(newRecipe)
        .filter(entry => entry[0].startsWith('ingredient') && entry[1] !== '')
        .map(ing => {
          const ingArr = ing[1].replaceAll(' ', '').split(',');
          if (ingArr.length !== 3)
            throw new Error(
              'Wrong ingredient fromat! Please use the correct format :)'
            );
  
          const [quantity, unit, description] = ingArr;
  
          return { quantity: quantity ? +quantity : null, unit, description };
        });


        const recipe = {
            title: newRecipe.title,
            source_url: newRecipe.sourceUrl,
            image_url: newRecipe.image,
            publisher: newRecipe.publisher,
            cooking_time: +newRecipe.cookingTime,
            servings: +newRecipe.servings,
            ingredients,
          };
        const data = await sendJSON(`${API_URL}?key=${KEY}`, recipe);
        let {recipe: r} = data.data;
        state.recipe = {
            id: r.id,
            cookingTime: r.cooking_time,
            imageUrl: r.image_url,
            ingredients: r.ingredients,
            publisher: r.publisher,
            serving: r.servings,
            sourceUrl: r.source_url,
            title: r.title,
            ...(r.key && {key: r.key})
        }
        bookmark(state.recipe)
    }
    catch(err){
        throw err;
    }
}