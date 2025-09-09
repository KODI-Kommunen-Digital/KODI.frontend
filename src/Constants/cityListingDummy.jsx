const dummyCityListing = [
  {
    "id": 101,
    "title": "Tech Conference 2025",
    "description": "Annual tech conference with global speakers and networking opportunities.",
    "categoryId": 2,
    "categoryData": { "id": 2, "name": "Events", "parentCategoryId": null },
    "cityData": [
      { "id": 1, "name": "Berlin", "latitude": 52.52, "longitude": 13.40, "image": null, "message": null, "parentCity": null }
    ],
    "listingStatus": 1,
    "createdAt": "2025-08-20T09:00:00.000Z",
    "startDate": "2025-09-10T09:00:00.000Z",
    "endDate": "2025-09-12 18:00:00",
    "expiryDate": "2025-09-15 23:59:59",
    "additionalInformation": {
      "startDate": "2025-09-10 09:00:00",
      "endDate": "2025-09-12 18:00:00",
      "expiryDate": "2025-09-15 23:59:59"
    },
    "viewCount": 50,
    "media": [
      {
        "id": 201,
        "path": "users/1/listing_101/media_0.pdf",
        "mediaType": 2,
        "mediaOrder": 1,
        "signedUrl": "https://dummy-storage.com/users/1/listing_101/media_0.pdf"
      }
    ],
    "userData": {
      "id": 1,
      "name": "Alice Johnson",
      "username": "alice_j",
      "image": "https://dummy-storage.com/users/profile_picture/1.png"
    }
  },
  {
    "id": 102,
    "title": "Music Festival 2025",
    "description": "3-day outdoor music festival featuring international artists and DJs.",
    "categoryId": 3,
    "categoryData": { "id": 3, "name": "Music", "parentCategoryId": null },
    "cityData": [
      { "id": 2, "name": "Paris", "latitude": 48.8566, "longitude": 2.3522, "image": null, "message": null, "parentCity": null }
    ],
    "listingStatus": 1,
    "createdAt": "2025-08-21T12:30:00.000Z",
    "startDate": "2025-09-20T15:00:00.000Z",
    "endDate": "2025-09-22 23:00:00",
    "expiryDate": "2025-09-25 23:59:59",
    "additionalInformation": {
      "startDate": "2025-09-20 15:00:00",
      "endDate": "2025-09-22 23:00:00",
      "expiryDate": "2025-09-25 23:59:59"
    },
    "viewCount": 120,
    "media": [
      {
        "id": 202,
        "path": "users/2/listing_102/media_0.jpg",
        "mediaType": 1,
        "mediaOrder": 1,
        "signedUrl": "https://dummy-storage.com/users/2/listing_102/media_0.jpg"
      }
    ],
    "userData": {
      "id": 2,
      "name": "Bob Smith",
      "username": "bob_smith",
      "image": "https://dummy-storage.com/users/profile_picture/2.png"
    }
  },
  {
    "id": 103,
    "title": "Startup Pitch Night",
    "description": "Local startups pitch their ideas to investors and mentors.",
    "categoryId": 4,
    "categoryData": { "id": 4, "name": "Business", "parentCategoryId": null },
    "cityData": [
      { "id": 3, "name": "New York", "latitude": 40.7128, "longitude": -74.006, "image": null, "message": null, "parentCity": null }
    ],
    "listingStatus": 1,
    "createdAt": "2025-08-22T08:15:00.000Z",
    "startDate": "2025-09-25T18:00:00.000Z",
    "endDate": "2025-09-25 22:00:00",
    "expiryDate": "2025-09-30 23:59:59",
    "additionalInformation": {
      "startDate": "2025-09-25 18:00:00",
      "endDate": "2025-09-25 22:00:00",
      "expiryDate": "2025-09-30 23:59:59"
    },
    "viewCount": 75,
    "media": [
      {
        "id": 203,
        "path": "users/3/listing_103/media_0.png",
        "mediaType": 1,
        "mediaOrder": 1,
        "signedUrl": "https://dummy-storage.com/users/3/listing_103/media_0.png"
      }
    ],
    "userData": {
      "id": 3,
      "name": "Charlie Lee",
      "username": "charlie_lee",
      "image": "https://dummy-storage.com/users/profile_picture/3.png"
    }
  }
]
export default dummyCityListing;