const containerStatus = {
    1: "Active",
    2: "Inactive",
    0: "Pending",
};

const statusByName = {
    Active: 1,
    Inactive: 2,
    Pending: 0,
};
const productRequestStatus = {
    0: "Pending",
    1: "Accepted",
    2: "Rejected",
    3:"ChangeRequested",
};
const productRequestStatusByName = {
    pending: 0,
    accepted: 1,
    rejected: 2,
    changeRequested: 3,
  };

module.exports = { containerStatus, statusByName,productRequestStatus ,productRequestStatusByName};
