module.exports = {
    cms: "https://c1.adis.ws",
    cmsAccount: "willow",
    sitemap: [{
            route: "/",
            layout: "homepage",
            slots: {
                "hero": "d55b27e8-23b3-4a70-b78f-a5d6112452b5",
                "body": "786fdfe5-738b-436c-9af0-76a7f7696e98"
            }
        },
        {
            route: "/womens",
            layout: "homepage",
            slots: {
                "hero": "6e030093-714c-406d-85f1-b942cc93f3b4",
                "body": "a8d7445c-f94a-43a6-a914-ff462922d192"
            }
        },
        {
            route: "/mens",
            layout: "landing",
            slots: {
                "content": "04b17fa1-f492-401a-bc49-68b66ccbb6a9"
            }
        },
        {
            route: "/beauty",
            layout: "landing",
            slots: {
                "content": "7e952515-8f2a-4535-a863-7b96ccb1e626"
            }
        },
        {
            route: "/lighting",
            layout: "landing",
            slots: {
                "content": "76f6ef64-6fb2-4a65-b510-eb3e80374264"
            }
        },
        {
            route: "/furniture",
            layout: "landing",
            slots: {
                "content": "5db62a63-00dc-4fe4-8083-11f5941135be"
            }
        },
        {
            route: "/electricals",
            layout: "landing",
            slots: {
                "content": "7e6e0cc9-e103-4d85-97fa-0dcce6240a9d"
            }
        },
        {
            route: "/inspiration",
            layout: "landing",
            slots: {
                "content": "f5c8e533-f6d9-4e01-afeb-7ef9c558ff7d"
            }
        }
    ]
};
