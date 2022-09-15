import "@scss/style.scss";


class Search {
    constructor(input, apiUrl, navList) {
        this.apiUrl = apiUrl;
        this.input = input;
        this.navList = navList;
        this.repositoryList = repositoryList;

        this.event = this.debounce(this.eventKeyUp, 150);

        input.addEventListener("keyup", this.event.bind(this));
    }

    debounce(fn, debounceTime) {
        let debounceFn
        
        return function() {
            clearTimeout(debounceFn);
            debounceFn = setTimeout(() => fn.apply(this, arguments), debounceTime);
        }
    }

    async eventKeyUp() {
        if (this.input.value != "") {
            let myQuery = `?q=${this.input.value}&sort=stars&order=desc&per_page=5`
            let response = await fetch(this.apiUrl + myQuery, {
                headers: {
                    'accept': 'application/vnd.github+json', 
                    'Authorization': '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'
                }
            });

            if (response.ok) {
                let data = await response.json();
                this.generateNavList(await data.items);
            }
        }
    }

    generateNavList(data) {
        if (data) {
            this.clearNavList(this.navList);
            
            for (let i = 0; i < data.length; i++) {
                this.navList.append(this.generateElementNavList(data[i]));
            }
        }
    }

    generateElementNavList(data) {
        let name = data.name;
        let owner = data.owner.login;
        let stars = data.stargazers_count;

        let NavElementNav = document.createElement("li");

        NavElementNav.classList.add("nav__item");

        NavElementNav.dataset.name = name;
        NavElementNav.dataset.owner = owner;
        NavElementNav.dataset.stars = stars;

        NavElementNav.insertAdjacentText("beforeend", name);

        NavElementNav.addEventListener("click", this.eventAddRepositoryToList.bind(this));

        return NavElementNav;
    }

    eventAddRepositoryToList(event) {
        this.clearNavList(this.navList);
        this.input.value = "";
        
        this.repositoryList.append(this.generateRepositoryToList(event.target));
    }

    generateRepositoryToList(data) {
        let RepositoryElement = document.createElement("li");
        RepositoryElement.classList.add("repository__item");

        RepositoryElement.insertAdjacentHTML("afterbegin", `
            <div class="repository__info">
                <p class="repository__text">Name: <span>${data.dataset.name}</span></p>
                <p class="repository__text">Owner: <span>${data.dataset.owner}</span></p>
                <p class="repository__text">Stars: <span>${data.dataset.stars}</span></p>
            </div>
        `);

        let btnRemoveRepository = document.createElement("button");
        btnRemoveRepository.classList.add('repository__remove');

        btnRemoveRepository.addEventListener("click", this.eventRemoveRepository.bind(this));

        RepositoryElement.append(btnRemoveRepository);

        return RepositoryElement;
    }

    // remove elements

    clearNavList(list) {
        list.querySelectorAll("*").forEach(el => el.remove());
    }

    eventRemoveRepository(event) {
        event.target.parentElement.remove();
    }
}

let apiUrl = "https://api.github.com/search/repositories";
let input = document.getElementsByClassName("nav__input")[0];
let navList = document.getElementsByClassName("nav__list")[0];
let repositoryList = document.getElementsByClassName("repository__list")[0];

new Search(input, apiUrl, navList, repositoryList);
