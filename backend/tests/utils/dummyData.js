// PRODUCT DUMMY DATA
export const validProduct1 = {
    name: "ACAMEP",
    buildId: "DST_H040",
    listOfFeatures: [
        "Wall", "Room", "Door"
    ]
};

export const validProduct2 = {
    name: "ACE",
    buildId: "ACE_L036",
    listOfFeatures: [
        "Circuit"
    ]
};

export const invalidProduct1_no_name = {
    buildId: "DST_H040",
    listOfFeatures: [
        "Wall", "Room", "Door"
    ]
};

export const invalidProduct2_no_buildId = {
    name: "ACAMEP",
    listOfFeatures: [
        "Wall", "Room", "Door"
    ]
};

export const invalidProduct3_no_listOfFeatures = {
    name: "ACAMEP",
    buildId: "DST_H040"
};

export const invalidProduct4_duplicate_features = {
    name: "ACAMEP",
    buildId: "DST_H040",
    listOfFeatures: [
        "Wall", "Wall", "Wall"
    ]
};


// FEATURE DUMMY DATA
export const validFeature1 = {
    name: "Window"
};

export const validFeature2 = {
    name: "Door"
};