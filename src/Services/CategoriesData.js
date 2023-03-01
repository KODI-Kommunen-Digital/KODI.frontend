//var baseUrl = "www.someapi.com"
var categoriesObj = {

    "categoriesListings": [
        {
            id: 1,
            category: "News"
        },
        {
            id: 2,
            ategory: "Road Works / Traffic"
        },
        {
            id: 3,
            ategory: "Events"
        },
        {
            id: 4,
            ategory: "Clubs"
        },
        {
            id: 5,
            ategory: "Regional Products"
        },
        {
            id: 6,
            ategory: "Offer / Search"
        },
        {
            id: 7,
            ategory: "New Citizen Info"
        },
        {
            id: 8,
            ategory: "Direct Report"
        },
        {
            id: 9,
            ategory: "Lost And Found"
        },
        {
            id: 10,
            ategory: "Company Portraits"
        },
        {
            id: 11,
            ategory: "Carpooling And Public Transport"
        },
        {
            id: 12,
            ategory: "Offers"
        }

    ]
};

export async function getCategoriesdata() {
    return categoriesObj;
}

export async function updateCategoriesData(newCategoriesObj) {
    categoriesObj = newCategoriesObj;
}