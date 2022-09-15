/******/ (() => { // webpackBootstrap
/******/ 	var __webpack_modules__ = ({

/***/ "./scss/style.scss":
/*!*************************!*\
  !*** ./scss/style.scss ***!
  \*************************/
/***/ (() => {

// extracted by mini-css-extract-plugin
    if(false) { var cssReload; }
  

/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId](module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/compat get default export */
/******/ 	(() => {
/******/ 		// getDefaultExport function for compatibility with non-harmony modules
/******/ 		__webpack_require__.n = (module) => {
/******/ 			var getter = module && module.__esModule ?
/******/ 				() => (module['default']) :
/******/ 				() => (module);
/******/ 			__webpack_require__.d(getter, { a: getter });
/******/ 			return getter;
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/define property getters */
/******/ 	(() => {
/******/ 		// define getter functions for harmony exports
/******/ 		__webpack_require__.d = (exports, definition) => {
/******/ 			for(var key in definition) {
/******/ 				if(__webpack_require__.o(definition, key) && !__webpack_require__.o(exports, key)) {
/******/ 					Object.defineProperty(exports, key, { enumerable: true, get: definition[key] });
/******/ 				}
/******/ 			}
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/hasOwnProperty shorthand */
/******/ 	(() => {
/******/ 		__webpack_require__.o = (obj, prop) => (Object.prototype.hasOwnProperty.call(obj, prop))
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/make namespace object */
/******/ 	(() => {
/******/ 		// define __esModule on exports
/******/ 		__webpack_require__.r = (exports) => {
/******/ 			if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 				Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 			}
/******/ 			Object.defineProperty(exports, '__esModule', { value: true });
/******/ 		};
/******/ 	})();
/******/ 	
/************************************************************************/
var __webpack_exports__ = {};
// This entry need to be wrapped in an IIFE because it need to be in strict mode.
(() => {
"use strict";
/*!*********************!*\
  !*** ./js/index.js ***!
  \*********************/
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _scss_style_scss__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @scss/style.scss */ "./scss/style.scss");
/* harmony import */ var _scss_style_scss__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_scss_style_scss__WEBPACK_IMPORTED_MODULE_0__);



class Search {
    constructor(input, url, navList) {
        this.url = url;
        this.input = input;
        this.navList = navList;
        this.repositoryList = repositoryList;

        this.event = this.debounce(this.keyUp, 150);

        input.addEventListener("keyup", this.event.bind(this));
    }

    debounce(fn, debounceTime) {
        let debounceFn
        
        return function() {
            clearTimeout(debounceFn);
            debounceFn = setTimeout(() => fn.apply(this, arguments), debounceTime);
        }
    }

    async keyUp() {
        if (this.input.value != "") {
            let myQuery = `?q=${this.input.value}&sort=stars&order=desc&per_page=5`
            let response = await fetch(this.url + myQuery, {
                headers: {
                    'accept': 'application/vnd.github+json', 
                    'Authorization': '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'
                }
            });

            if (response.ok) {
                let data = await response.json();
                this.generateResult(await data.items);
            }
        }
    }

    generateResult(data) {
        if (data) {
            this.clearResult(this.navList);
            
            for (let i = 0; i < data.length; i++) {
                this.navList.append(this.createResultElement(data[i]));
            }
        }
    }

    createResultElement(data) {
        let name = data.name;
        let owner = data.owner.login;
        let stars = data.stargazers_count;

        let result = document.createElement("li");

        result.classList.add("nav__item");

        result.dataset.name = name;
        result.dataset.owner = owner;
        result.dataset.stars = stars;

        result.insertAdjacentText("beforeend", name);

        result.addEventListener("click", this.addrepository.bind(this));

        return result;
    }

    addrepository(event) {
        this.clearResult(this.navList);
        this.input.value = "";
        
        this.repositoryList.append(this.createrepositoryElement(event.target));
    }

    createrepositoryElement(data) {
        let result = document.createElement("li");
        result.classList.add("repository__item");

        let textField = document.createElement("div");
        textField.classList.add("repository__info");

        let listText = ['Name', 'Owner', 'Stars'];
        let listTextData = [data.dataset.name, data.dataset.owner, data.dataset.stars];

        for (let i = 0; i < listText.length; i++) {
            let text = document.createElement("p");
            text.classList.add("repository__text");

            let span = document.createElement("span");
            span.classList.add("repository__name");
            span.insertAdjacentText("beforeend", listTextData[i]);
            text.append(span);

            text.insertAdjacentText("afterbegin", `${listText[i]}: `);

            textField.append(text);
        }

        result.append(textField);

        let removeBtn = document.createElement("button");
        removeBtn.classList.add('repository__remove');

        removeBtn.addEventListener("click", this.removeRepository.bind(this));

        result.append(removeBtn);

        return result;
    }

    // remove elements

    clearResult(list) {
        list.querySelectorAll("*").forEach(el => el.remove());
    }

    removeRepository(event) {
        event.target.parentElement.remove();
    }
}

let url = "https://api.github.com/search/repositories";
let input = document.getElementsByClassName("nav__input")[0];
let navList = document.getElementsByClassName("nav__list")[0];
let repositoryList = document.getElementsByClassName("repository__list")[0];

new Search(input, url, navList, repositoryList);

})();

/******/ })()
;
//# sourceMappingURL=bundle.js.map