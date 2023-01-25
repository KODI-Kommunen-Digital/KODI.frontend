var baseUrl = "www.someapi.com"
var profileObj = {
    id: 1,
    firstName: "Max",
    lastName: "Muller",
    userName: "Max123",
    description: "Description",
    website: "www.example.com",
    email: "abc@def.com",
    phoneNumber: "1234567890",
    image: "https://i.ibb.co/L1LQtBm/Ellipse-1.png"
};

export async function getProfile() {
    return profileObj;
}

export async function updateProfile(newProfileObj) {
    profileObj = newProfileObj;
}