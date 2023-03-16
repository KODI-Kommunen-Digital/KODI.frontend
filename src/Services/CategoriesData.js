//var baseUrl = "www.someapi.com"
var categoriesObj = {

    "categories": [
        "News",
        "Road Works / Traffic",
        "Events",
        "Clubs",
        "Regional Products",
        "Offer / Search",
        "New Citizen Info",
        "Direct Report",
        "Lost And Found",
        "Company Portraits",
        "Carpooling And Public Transport",
        "Offers"
     ],
     "listings":[

        {
            "title":"tile1",
            "date": "2010-05-21"
        },
        {
            "title":"tile2",
            "date": "2017-10-20"
        },
        {
            "title":"tile3",
            "date": "2017-07-19"
        },
        {
            "title":"tile4",
            "date": "2010-02-05"
        },
        {
            "title":"tile5",
            "date": "2010-01-13"
        },
        {
            "title":"tile6",
            "date": "2013-09-30"
        },
        {
            "title":"tile7",
            "date": "2011-01-20"
        }

        ]
};

export async function getCategoriesdata() {
    return categoriesObj;
}


