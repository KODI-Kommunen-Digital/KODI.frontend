
//  var arr1 = data.listings
//  console.log(arr)

//functions to sort the categories based on title
const sortByTitleAZ = (arr) => {
	arr.sort(function (a, b) {
		var titleA = a.title.toLowerCase();
		var titleB = b.title.toLowerCase();
		if (titleA < titleB) return -1;
		if (titleA > titleB) return 1;
		return 0;
	});
	return arr;
};
//sortByTitleAZ(arr1)
const sortByTitleZA = (arr) => {
	arr.sort(function (a, b) {
		var titleA = a.title.toLowerCase();
		var titleB = b.title.toLowerCase();
		if (titleA < titleB) return -1;
		if (titleA > titleB) return 1;
		return 0;
	});
	arr.reverse();
	return arr;
};

//functions to sort the categories based on date
const sortRecent = (arr) => {
	arr.sort(function (a, b) {
		var dateA = new Date(a.date);
		var dateB = new Date(b.date);
		return dateA - dateB;
	});
	arr.reverse();
	return arr;
};
const sortOldest = (arr) => {
	arr.sort(function (a, b) {
		var dateA = new Date(a.date);
		var dateB = new Date(b.date);
		return dateA - dateB;
	});
	return arr;
};

//console.log(sortByTitleAZ(arr))

module.exports = { sortByTitleAZ, sortByTitleZA, sortRecent, sortOldest };
