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

// TESTCASE DUMMY DATA
export const validTestcase1 = {
    "data": [
        {
            "name": "TestcaseA",
            "feature": "Wall",
            "description": "Testing API",
            "line_coverage": 2.0
        },
        {
            "name": "TestcaseB",
            "feature": "Door",
            "description": "Testing API",
            "line_coverage": 4.0
        },
        {
            "name": "TestcaseC",
            "feature": "Room",
            "description": "Testing API",
            "line_coverage": 6.0
        }
    ]
}

export const validTestcase2 = {
    "data": [
        {
            "name": "TestcaseD",
            "feature": "Wall",
            "description": "Testing API",
            "line_coverage": 2.0
        }
    ]
}

export const invalidTestcase1_duplicate_test_name = {
    "data": [
        {
            "name": "TestcaseA",
            "feature": "Wall",
            "description": "Testing API",
            "line_coverage": 2.0
        }
    ]
}