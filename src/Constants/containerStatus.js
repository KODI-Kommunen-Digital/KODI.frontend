const status = {
    0: "Pending",
    1: "Active",
    2: "Inactive",
    3: "ChangeRequested",
};

const statusByName = {
    Pending: 0,
    Active: 1,
    Inactive: 2,
    ChangeRequested: 3,
};

module.exports = { status, statusByName };
