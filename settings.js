module.exports = {
    cms: "https://dc9dj9jdjpdd1dhbkupnfcird.staging.bigcontent.io",
    cmsAccount: "dcdemo",

    sitemap: [
        {
            route: "/",
            layout: "homepage",
            slots: {
                "hero": "35b725b4-1ba7-498e-bbe1-fbe685f48354",
                "body": "15350b10-8ecf-4678-b9f9-0f1f2e1c8e12"
            }
        },
        {
            route: "/home",
            layout: "home",
            slots: {
                "content": "d364a3f8-16b1-47a9-b513-4d53ad90b322",
                "video": "2612f9c2-370b-481d-877a-677453a1f5b9",
                "splitblock":"7b2d44dc-4b09-4543-a9a2-b70a21ddae79"
            }
        }
    ]
};
