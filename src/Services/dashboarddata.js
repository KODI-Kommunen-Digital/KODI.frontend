//var baseUrl = "www.someapi.com"
var dashboardObj = {

    "listings": [
        {
            id: 1,
            image: "https://i.ibb.co/L1LQtBm/Ellipse-1.png",
            name: "Neil Sims",
            email: "neil.sims@flowbite.com",
            category: "News",
            expiryDate: "2022-12-31",
            status: "Active",
            gatewayApi: "Member",
            action: "Exit",
            date:"2012-10-01"
        },
        {
            id: 5,
            image: "https://i.ibb.co/L1LQtBm/Ellipse-1.png",
            name: "Bonnie Green",
            email: "bonnie@flowbite.com",
            category: "Road Works / Traffic",
            expiryDate: "2022-12-31",
            status: "Active",
            gatewayApi: "Footballer",
            action: "Exit",
            date:"2007-11-11"
        },
        {
            id: 3,
            image: "https://i.ibb.co/L1LQtBm/Ellipse-1.png",
            name: "Thomas Lean",
            email: "thomes@flowbite.com",
            category: "Events",
            expiryDate: "2022-12-31",
            status: "Active",
            gatewayApi: "Admin",
            action: "Exit",
            date:"2020-10-18"
        },
        {
            id: 6,
            image: "https://i.ibb.co/L1LQtBm/Ellipse-1.png",
            name: "Joseph Joseph",
            email: "joseph@flowbite.com",
            category: "Clubs",
            expiryDate: "2024-05-31",
            status: "Active",
            gatewayApi: "Admin",
            action: "Exit",
            date:"2002-05-01"
        },
        {
            id: 2,
            image: "https://i.ibb.co/L1LQtBm/Ellipse-1.png",
            name: "Denio John",
            email: "denio@flowbite.com",
            category: "Regional Products",
            expiryDate: "2024-12-01",
            status: "Active",
            gatewayApi: "Manager",
            action: "Exit",
            date:"2010-10-02"
        },
        {
            id: 4,
            image: "https://i.ibb.co/L1LQtBm/Ellipse-1.png",
            name: "Sonu Sadanandhan",
            email: "sonu@flowbite.com",
            category: "Offer / Search",
            expiryDate: "2024-10-11",
            status: "Active",
            gatewayApi: "Member",
            action: "Exit",
            date:"2010-10-01"
        },
        {
            id: 7,
            image: "https://i.ibb.co/L1LQtBm/Ellipse-1.png",
            name: "Akshay Sunilkumar",
            email: "akshay@flowbite.com",
            category: "New Citizen Info",
            expiryDate: "2022-12-31",
            status: "Active",
            gatewayApi: "Creator",
            action: "Exit",
            date:"2018-10-01"
        },
        {
            id: 9,
            image: "https://i.ibb.co/L1LQtBm/Ellipse-1.png",
            name: "Frederik Perrera",
            email: "fd@flowbite.com",
            category: "Direct Report",
            expiryDate: "2023-11-29",
            status: "Active",
            gatewayApi: "Co-Founder",
            action: "Exit",
            date:"2019-10-09"
        },
        {
            id: 8,
            image: "https://i.ibb.co/L1LQtBm/Ellipse-1.png",
            name: "Leo Messi",
            email: "messi@flowbite.com",
            category: "Lost And Found",
            expiryDate: "2026-12-12",
            status: "Active",
            gatewayApi: "Footballer",
            action: "Exit",
            date:"2013-02-01"
        }

    ]
};

export async function getDashboarddata() {
    return dashboardObj;
}

export async function updateDashboardData(newDashboardObj) {
    dashboardObj = newDashboardObj;
}