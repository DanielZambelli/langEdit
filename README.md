# LangEdit
Reach further with communication in any language. Serve users with content in their own preferred language with support for multilingual. Add, translate and edit content directly in the browser editor and publish it via REST API.

* Translate and proofread content directly in the browser.
* Supports 184 languages in the standard [iso-639-1](https://en.wikipedia.org/wiki/List_of_ISO_639-1_codes)
* Pull translations as JSON via REST API.
* API and client protected behind authentication.

![LangEdit](/docs/app1.png)
![LangEdit](/docs/app2.png)

## Get started
1) Clone to local
2) Configure .env in root dir and /client. See [example](../.env.example)
3) `npm run install`
4) `npm run build`
5) `npm run start`
6) Visit http://localhost:8080


## Integrate
After creating a project and adding the language keys, use this endpoint to pull the language keys into any project.  
  
`API: GET http://localhost:8080/public/api/project/73`

``` json
{
    "id": 73,
    "body": {
        "title": "Hello World",
        "translations": {
            "da": {
                "da": "Dansk",
                "en": "Engelsk",
                "fox": "Den hurtige brune ræv hopper over den dovne hund",
                "title": "Hej Verden"
            },
            "en": {
                "da": "Danish",
                "en": "English",
                "fox": "The quick brown fox jumps over the lazy dog",
                "title": "Hello World"
            }
        },
        "defaultLanguageCode": "en",
        "selectedLanguageCodes": [
            "da",
            "en"
        ]
    },
    "createdAt": "2022-01-23T12:17:21.792Z",
    "updatedAt": "2022-01-23T12:27:46.455Z"
}
```

[For commercial use a subscription is required from here.](https://buy.stripe.com/dR64jB5vp6zB4483ce)
