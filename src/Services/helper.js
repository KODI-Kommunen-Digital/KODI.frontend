const sortByTitleAZ = (arr) => {
    arr.sort(function (a, b) {
        const titleA = a.title.toLowerCase();
        const titleB = b.title.toLowerCase();
        if (titleA < titleB) return -1;
        if (titleA > titleB) return 1;
        return 0;
    });
    return arr;
};

const sortByTitleZA = (arr) => {
    arr.sort(function (a, b) {
        const titleA = a.title.toLowerCase();
        const titleB = b.title.toLowerCase();
        if (titleA < titleB) return -1;
        if (titleA > titleB) return 1;
        return 0;
    });
    arr.reverse();
    return arr;
};

const sortLatestFirst = (arr) => {
    arr.sort(compareDateTime);
    return arr.reverse()
}

const sortOldestFirst = (arr) => {
    arr.sort(compareDateTime);
    return arr
}
const compareDateTime = (a, b) => {
    const dateA = new Date(a.createdAt);
    const dateB = new Date(b.createdAt);
  
    if (dateA < dateB) {
	  return -1;
    }
    if (dateA > dateB) {
	  return 1;
    }
    return 0;
};

module.exports = { sortByTitleAZ, sortByTitleZA, sortLatestFirst, sortOldestFirst };
