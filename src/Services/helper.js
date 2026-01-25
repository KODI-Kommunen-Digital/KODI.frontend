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

const sortByDay = (arr) => {
  const grouped = arr?.reduce((acc, item) => {
    const dateKey = new Date(item.createdAt).toISOString().split("T")[0];
    if (!acc[dateKey]) {
      acc[dateKey] = [];
    }
    acc[dateKey].push(item);
    return acc;
  }, {});
  const sortedDates = Object.keys(grouped).sort((a, b) => new Date(b) - new Date(a));
  const sortedByDay = sortedDates && sortedDates.flatMap(date => grouped[date]);
  return sortedByDay;
};

module.exports = { sortByTitleAZ, sortByTitleZA, sortLatestFirst, sortOldestFirst, sortByDay };
