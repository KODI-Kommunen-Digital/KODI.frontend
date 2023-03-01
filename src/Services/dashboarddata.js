//var baseUrl = "www.someapi.com"
var dashboardObj = {

    "listings": [
        {
            id: 1,
            image: "https://i.ibb.co/L1LQtBm/Ellipse-1.png",
            name: "Neil Sims",
            email: "neil.sims@flowbite.com",
            category: "Software Engineer",
            expiryDate: "2022-12-31",
            status: "Active",
            gatewayApi: "Member",
            action: "Exit"
        },
        {
            id: 2,
            image: "https://i.ibb.co/L1LQtBm/Ellipse-1.png",
            name: "Bonnie Green",
            email: "bonnie@flowbite.com",
            category: "Designer",
            expiryDate: "2022-12-31",
            status: "Active",
            gatewayApi: "Footballer",
            action: "Exit"
        },
        {
            id: 3,
            image: "https://i.ibb.co/L1LQtBm/Ellipse-1.png",
            name: "Thomas Lean",
            email: "thomes@flowbite.com",
            category: "UI/UX Developer",
            expiryDate: "2022-12-31",
            status: "Active",
            gatewayApi: "Admin",
            action: "Exit"
        },
        {
            id: 3,
            image: "https://i.ibb.co/L1LQtBm/Ellipse-1.png",
            name: "Joseph Joseph",
            email: "joseph@flowbite.com",
            category: "Game Developer",
            expiryDate: "2024-05-31",
            status: "Active",
            gatewayApi: "Admin",
            action: "Exit"
        },
        {
            id: 3,
            image: "https://i.ibb.co/L1LQtBm/Ellipse-1.png",
            name: "Denio John",
            email: "denio@flowbite.com",
            category: "Youtuber",
            expiryDate: "2024-12-01",
            status: "Active",
            gatewayApi: "Manager",
            action: "Exit"
        },
        {
            id: 3,
            image: "https://i.ibb.co/L1LQtBm/Ellipse-1.png",
            name: "Sonu Sadanandhan",
            email: "sonu@flowbite.com",
            category: "Node Developer",
            expiryDate: "2024-10-11",
            status: "Active",
            gatewayApi: "Member",
            action: "Exit"
        },
        {
            id: 3,
            image: "https://i.ibb.co/L1LQtBm/Ellipse-1.png",
            name: "Akshay Sunilkumar",
            email: "akshay@flowbite.com",
            category: "Web Developer",
            expiryDate: "2022-12-31",
            status: "Active",
            gatewayApi: "Creator",
            action: "Exit"
        },
        {
            id: 3,
            image: "https://i.ibb.co/L1LQtBm/Ellipse-1.png",
            name: "Frederik Perrera",
            email: "fd@flowbite.com",
            category: "Real Estate Developer",
            expiryDate: "2023-11-29",
            status: "Active",
            gatewayApi: "Co-Founder",
            action: "Exit"
        },
        {
            id: 3,
            image: "https://i.ibb.co/L1LQtBm/Ellipse-1.png",
            name: "Leo Messi",
            email: "messi@flowbite.com",
            category: "Footballer",
            expiryDate: "2026-12-12",
            status: "Active",
            gatewayApi: "Footballer",
            action: "Exit"
        }

    ]
};

export async function getDashboarddata() {
    return dashboardObj;
}

export async function updateDashboardData(newDashboardObj) {
    dashboardObj = newDashboardObj;
}