define({ "api": [
  {
    "type": "delete",
    "url": "/issues/:id",
    "title": "Delete an issue",
    "name": "DeleteIssue",
    "group": "Issue",
    "version": "1.0.0",
    "description": "<p>Delete a single issue.</p>",
    "examples": [
      {
        "title": "Example",
        "content": "DELETE /issues/5aaf71ca3ad2ed2160c93639 HTTP/1.1",
        "type": "json"
      }
    ],
    "success": {
      "examples": [
        {
          "title": "Success Response",
          "content": "HTTP/1.1 204 No content\nContent-Type: application/json",
          "type": "json"
        }
      ]
    },
    "parameter": {
      "fields": {
        "URL path parameters": [
          {
            "group": "URL path parameters",
            "type": "String",
            "optional": false,
            "field": "id",
            "description": "<p>Unique identifier (<a href=\"https://docs.mongodb.com/manual/reference/method/ObjectId/\">12-byte hexadecimal string</a>) of the issue, e.g. : <code>507f191e810c19729de860ea</code></p>"
          }
        ]
      }
    },
    "filename": "routes/issues.js",
    "groupTitle": "Issue",
    "error": {
      "fields": {
        "Error 4xx": [
          {
            "group": "Error 4xx",
            "type": "Object",
            "optional": false,
            "field": "404/NotFound",
            "description": "<p>The id specified is well-formed but no issue was found with this id.</p>"
          },
          {
            "group": "Error 4xx",
            "type": "Object",
            "optional": false,
            "field": "422/UnprocessableEntity",
            "description": "<p>The specified issueId is invalid</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "404 Not Found",
          "content": "HTTP/1.1 404 Not Found\nContent-Type: application/json\n\n{\n    \"message\": \"No issue found with ID 5aaf71ca3ad2ed2160c93638\"\n}",
          "type": "json"
        },
        {
          "title": "422 Unprocessable Entity",
          "content": "HTTP/1.1 422 Unprocessable Entity\nContent-Type: application/json\n\n{\n   \"message\": \"Issue validation failed: issueId: Path `issueId` is invalid.\"\n}",
          "type": "json"
        }
      ]
    }
  },
  {
    "type": "get",
    "url": "/issues/:id",
    "title": "Retrieve an issue",
    "name": "GetIssue",
    "group": "Issue",
    "version": "1.0.0",
    "description": "<p>Retrieves a single issue.</p>",
    "examples": [
      {
        "title": "Example",
        "content": "GET /issues/58b2926f5e1def0123e97281 HTTP/1.1",
        "type": "json"
      }
    ],
    "success": {
      "examples": [
        {
          "title": "200 OK",
          "content": "HTTP/1.1 200 OK\nContent-Type: application/json\n\n {\n    \"status\": \"new\",\n    \"tags\": [],\n    \"description\": \"Il y a un type bizarre avec un chien qui squatte devant la vitrine de la boucherie.\",\n    \"imageUrl\": \"https://www.example.com/image34.jpg\",\n    \"geolocation\": {\n        \"type\": \"Point\",\n        \"coordinates\": [\n            46.780345,\n            6.637863\n        ]\n    },\n    \"createdAt\": \"2018-03-19T08:21:50.938Z\",\n    \"updatedAt\": \"2018-03-19T08:21:50.938Z\",\n    \"links\": [\n        {\n            \"rel\": \"self\",\n            \"href\": \"/issues/5aaf731e3ad2ed2160c9363a\"\n        },\n        {\n            \"rel\": \"user\",\n            \"href\": \"/users/5aabe04b68f49609145bfcd3\"\n        }\n    ]\n}",
          "type": "json"
        }
      ],
      "fields": {
        "Response body": [
          {
            "group": "Response body",
            "type": "String",
            "optional": true,
            "field": "description",
            "description": "<p>A detailed description of the issue</p>"
          },
          {
            "group": "Response body",
            "type": "String",
            "optional": true,
            "field": "imageUrl",
            "description": "<p>A URL to a picture of the issue</p>"
          },
          {
            "group": "Response body",
            "type": "Point",
            "optional": false,
            "field": "geolocation",
            "description": "<p>A <a href=\"https://docs.mongodb.com/manual/reference/geojson/#point\">GeoJSON point</a> indicating where the issue is</p>"
          },
          {
            "group": "Response body",
            "type": "String[]",
            "optional": false,
            "field": "tags",
            "description": "<p>User-defined tags to describe the issue. If no tag has been specified, returns an empty array: <code>&quot;tags&quot;: []</code>.</p>"
          },
          {
            "group": "Response body",
            "type": "Object[]",
            "optional": false,
            "field": "links",
            "description": "<p>An array of two objects with two properties each:</p> <ul> <li><code>rel</code>: relationship between the issue and the linked resource, either <code>self</code> or <code>user</code>.</li> <li><code>href</code>: relative hyperlink reference to the linked resource within the API context</li> </ul>"
          },
          {
            "group": "Response body",
            "type": "Date",
            "optional": false,
            "field": "createdAt",
            "description": "<p>The date at which the issue was reported</p>"
          },
          {
            "group": "Response body",
            "type": "Date",
            "optional": false,
            "field": "updatedAt",
            "description": "<p>The date at which the issue was last modified</p>"
          },
          {
            "group": "Response body",
            "type": "String",
            "optional": false,
            "field": "status",
            "description": "<p>The status of the issue:</p> <ul> <li><code>&quot;new&quot;</code> : default value when the issue is created</li> <li><code>&quot;inProgress&quot;</code> : indicates that a city employee is working on the issue</li> <li><code>&quot;canceled&quot;</code> : indicates that a city employee has determined this is not a real issue</li> <li><code>&quot;completed&quot;</code> : indicates that the issue has been resolved</li> </ul>"
          }
        ]
      }
    },
    "parameter": {
      "fields": {
        "URL path parameters": [
          {
            "group": "URL path parameters",
            "type": "String",
            "optional": false,
            "field": "id",
            "description": "<p>Unique identifier (<a href=\"https://docs.mongodb.com/manual/reference/method/ObjectId/\">12-byte hexadecimal string</a>) of the issue</p>"
          }
        ]
      }
    },
    "filename": "routes/issues.js",
    "groupTitle": "Issue",
    "error": {
      "fields": {
        "Error 4xx": [
          {
            "group": "Error 4xx",
            "type": "Object",
            "optional": false,
            "field": "404/NotFound",
            "description": "<p>The id specified is well-formed but no issue was found with this id.</p>"
          },
          {
            "group": "Error 4xx",
            "type": "Object",
            "optional": false,
            "field": "422/UnprocessableEntity",
            "description": "<p>The specified issueId is invalid</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "404 Not Found",
          "content": "HTTP/1.1 404 Not Found\nContent-Type: application/json\n\n{\n    \"message\": \"No issue found with ID 5aaf71ca3ad2ed2160c93638\"\n}",
          "type": "json"
        },
        {
          "title": "422 Unprocessable Entity",
          "content": "HTTP/1.1 422 Unprocessable Entity\nContent-Type: application/json\n\n{\n   \"message\": \"Issue validation failed: issueId: Path `issueId` is invalid.\"\n}",
          "type": "json"
        }
      ]
    }
  },
  {
    "type": "get",
    "url": "/issues",
    "title": "Retrieve a list of issues",
    "name": "GetIssues",
    "group": "Issue",
    "version": "1.0.0",
    "description": "<p>Retrieves a paginated list of issues ordered by date of creation (in descendant order).</p>",
    "examples": [
      {
        "title": "Example",
        "content": "GET /issues HTTP/1.1",
        "type": "json"
      },
      {
        "title": "Example with query parameter (filter by user)",
        "content": "GET /issues?user=5a969cf53429176baf1ccc81 HTTP/1.1",
        "type": "json"
      },
      {
        "title": "Example with query parameters (pagination)",
        "content": "GET /issues?page=1&pageSize=10 HTTP/1.1",
        "type": "json"
      }
    ],
    "parameter": {
      "fields": {
        "URL query parameters": [
          {
            "group": "URL query parameters",
            "type": "String",
            "optional": true,
            "field": "user",
            "description": "<p>Select only the issues issued by the person with the specified ID (this parameter can be given multiple times)</p>"
          },
          {
            "group": "URL query parameters",
            "type": "String",
            "optional": true,
            "field": "status",
            "description": "<p>Select only the issues with the specified status (this parameter can be given multiple times)</p>"
          },
          {
            "group": "URL query parameters",
            "type": "number",
            "optional": true,
            "field": "page",
            "description": "<p>The page to retrieve (defaults to 1)<br />Size range: <code>1..</code></p>"
          },
          {
            "group": "URL query parameters",
            "type": "number",
            "optional": true,
            "field": "pageSize",
            "description": "<p>The number of elements to retrieve in one page (defaults to 100)<br />Size range: <code>1..100</code></p>"
          }
        ]
      }
    },
    "success": {
      "fields": {
        "Response headers": [
          {
            "group": "Response headers",
            "type": "String",
            "optional": false,
            "field": "link",
            "description": "<p>Links to the first, previous, next and last pages of the collection (if applicable), formatted as per <a href=\"https://tools.ietf.org/html/rfc5988\">RFC 5988</a>.</p>"
          }
        ],
        "Response body": [
          {
            "group": "Response body",
            "type": "String",
            "optional": true,
            "field": "description",
            "description": "<p>A detailed description of the issue</p>"
          },
          {
            "group": "Response body",
            "type": "String",
            "optional": true,
            "field": "imageUrl",
            "description": "<p>A URL to a picture of the issue</p>"
          },
          {
            "group": "Response body",
            "type": "Point",
            "optional": false,
            "field": "geolocation",
            "description": "<p>A <a href=\"https://docs.mongodb.com/manual/reference/geojson/#point\">GeoJSON point</a> indicating where the issue is</p>"
          },
          {
            "group": "Response body",
            "type": "String[]",
            "optional": false,
            "field": "tags",
            "description": "<p>User-defined tags to describe the issue. If no tag has been specified, returns an empty array: <code>&quot;tags&quot;: []</code>.</p>"
          },
          {
            "group": "Response body",
            "type": "Object[]",
            "optional": false,
            "field": "links",
            "description": "<p>An array of two objects with two properties each:</p> <ul> <li><code>rel</code>: relationship between the issue and the linked resource, either <code>self</code> or <code>user</code>.</li> <li><code>href</code>: relative hyperlink reference to the linked resource within the API context</li> </ul>"
          },
          {
            "group": "Response body",
            "type": "Date",
            "optional": false,
            "field": "createdAt",
            "description": "<p>The date at which the issue was reported</p>"
          },
          {
            "group": "Response body",
            "type": "Date",
            "optional": false,
            "field": "updatedAt",
            "description": "<p>The date at which the issue was last modified</p>"
          },
          {
            "group": "Response body",
            "type": "String",
            "optional": false,
            "field": "status",
            "description": "<p>The status of the issue:</p> <ul> <li><code>&quot;new&quot;</code> : default value when the issue is created</li> <li><code>&quot;inProgress&quot;</code> : indicates that a city employee is working on the issue</li> <li><code>&quot;canceled&quot;</code> : indicates that a city employee has determined this is not a real issue</li> <li><code>&quot;completed&quot;</code> : indicates that the issue has been resolved</li> </ul>"
          }
        ]
      },
      "examples": [
        {
          "title": "200 OK",
          "content": "HTTP/1.1 200 OK\nContent-Type: application/json\nLink <https://polamou-citizen-engagement-api.herokuapp.com/issues?page=2&pageSize=2>; rel=\"next\", <https://polamou-citizen-engagement-api.herokuapp.com/issues?page=12&pageSize=2>; rel=\"last\"\n\n[\n    {\n        \"status\": \"inProgress\",\n        \"tags\": [\n            \"tag\",\n            \"graffiti\",\n            \"château\"\n        ],\n        \"description\": \"Il y a deux tags très laids sur le mur du Château\",\n        \"imageUrl\": \"https://www.example.com/image23.jpg\",\n        \"geolocation\": {\n            \"type\": \"Point\",\n            \"coordinates\": [\n                46.780345,\n                6.637863\n            ]\n        },\n        \"createdAt\": \"2018-03-19T08:16:10.551Z\",\n        \"updatedAt\": \"2018-03-19T10:01:42.088Z\",\n        \"links\": [\n            {\n                \"rel\": \"self\",\n                \"href\": \"/issues/5aaf71ca3ad2ed2160c93639\"\n            },\n            {\n                \"rel\": \"user\",\n                \"href\": \"/users/5aabe04b68f49609145bfcd3\"\n            }\n        ]\n    },\n    {\n        \"status\": \"new\",\n        \"tags\": [],\n        \"description\": \"Il y a un type bizarre avec un chien qui squatte devant la vitrine de la boucherie.\",\n        \"imageUrl\": \"https://www.example.com/image34.jpg\",\n        \"geolocation\": {\n            \"type\": \"Point\",\n            \"coordinates\": [\n                46.780345,\n                6.637863\n            ]\n        },\n        \"createdAt\": \"2018-03-19T08:21:50.938Z\",\n        \"updatedAt\": \"2018-03-19T08:21:50.938Z\",\n        \"links\": [\n            {\n                \"rel\": \"self\",\n                \"href\": \"/issues/5aaf731e3ad2ed2160c9363a\"\n            },\n            {\n                \"rel\": \"user\",\n                \"href\": \"/users/5aabe04b68f49609145bfcd3\"\n            }\n        ]\n    }\n]",
          "type": "json"
        }
      ]
    },
    "filename": "routes/issues.js",
    "groupTitle": "Issue",
    "error": {
      "fields": {
        "Error 4xx": [
          {
            "group": "Error 4xx",
            "type": "Object",
            "optional": false,
            "field": "422/UnprocessableEntity",
            "description": "<p>The specified userId is invalid</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "422 Unprocessable Entity",
          "content": "HTTP/1.1 422 Unprocessable Entity\nContent-Type: application/json\n\n{\n   \"message\": \"User validation failed: userId: Path `userId` is invalid.\"\n}",
          "type": "json"
        }
      ]
    }
  },
  {
    "type": "patch",
    "url": "/issues/:id",
    "title": "Update an issue",
    "name": "PatchIssue",
    "group": "Issue",
    "version": "1.0.0",
    "description": "<p>Update a single issue.</p>",
    "examples": [
      {
        "title": "Example",
        "content": "PATCH /issues/5aaf71ca3ad2ed2160c93639 HTTP/1.1\n\n{\n    \"description\": \"Il y a deux tags très laids sur le mur du Château\",\n    \"imageUrl\": \"https://www.example.com/image23.jpg\"\n}",
        "type": "json"
      }
    ],
    "success": {
      "examples": [
        {
          "title": "200 OK",
          "content": "HTTP/1.1 200 OK\nContent-Type: application/json\n\n{\n    \"status\": \"new\",\n    \"tags\": [\n        \"tag\",\n        \"graffiti\",\n        \"château\"\n    ],\n    \"description\": \"Il y a deux tags très laids sur le mur du Château\",\n    \"imageUrl\": \"https://www.example.com/image23.jpg\",\n    \"geolocation\": {\n        \"type\": \"Point\",\n        \"coordinates\": [\n            46.780345,\n            6.637863\n        ]\n    },\n    \"createdAt\": \"2018-03-19T08:16:10.551Z\",\n    \"updatedAt\": \"2018-03-19T09:55:12.994Z\",\n    \"links\": [\n        {\n            \"rel\": \"self\",\n            \"href\": \"/issues/5aaf71ca3ad2ed2160c93639\"\n        },\n        {\n            \"rel\": \"user\",\n            \"href\": \"/users/5aabe03a68f49609145bfcd2\"\n        }\n    ]\n}",
          "type": "json"
        }
      ],
      "fields": {
        "Response body": [
          {
            "group": "Response body",
            "type": "String",
            "optional": true,
            "field": "description",
            "description": "<p>A detailed description of the issue</p>"
          },
          {
            "group": "Response body",
            "type": "String",
            "optional": true,
            "field": "imageUrl",
            "description": "<p>A URL to a picture of the issue</p>"
          },
          {
            "group": "Response body",
            "type": "Point",
            "optional": false,
            "field": "geolocation",
            "description": "<p>A <a href=\"https://docs.mongodb.com/manual/reference/geojson/#point\">GeoJSON point</a> indicating where the issue is</p>"
          },
          {
            "group": "Response body",
            "type": "String[]",
            "optional": false,
            "field": "tags",
            "description": "<p>User-defined tags to describe the issue. If no tag has been specified, returns an empty array: <code>&quot;tags&quot;: []</code>.</p>"
          },
          {
            "group": "Response body",
            "type": "Object[]",
            "optional": false,
            "field": "links",
            "description": "<p>An array of two objects with two properties each:</p> <ul> <li><code>rel</code>: relationship between the issue and the linked resource, either <code>self</code> or <code>user</code>.</li> <li><code>href</code>: relative hyperlink reference to the linked resource within the API context</li> </ul>"
          },
          {
            "group": "Response body",
            "type": "Date",
            "optional": false,
            "field": "createdAt",
            "description": "<p>The date at which the issue was reported</p>"
          },
          {
            "group": "Response body",
            "type": "Date",
            "optional": false,
            "field": "updatedAt",
            "description": "<p>The date at which the issue was last modified</p>"
          },
          {
            "group": "Response body",
            "type": "String",
            "optional": false,
            "field": "status",
            "description": "<p>The status of the issue:</p> <ul> <li><code>&quot;new&quot;</code> : default value when the issue is created</li> <li><code>&quot;inProgress&quot;</code> : indicates that a city employee is working on the issue</li> <li><code>&quot;canceled&quot;</code> : indicates that a city employee has determined this is not a real issue</li> <li><code>&quot;completed&quot;</code> : indicates that the issue has been resolved</li> </ul>"
          }
        ]
      }
    },
    "parameter": {
      "fields": {
        "URL path parameters": [
          {
            "group": "URL path parameters",
            "type": "String",
            "optional": false,
            "field": "id",
            "description": "<p>Unique identifier (<a href=\"https://docs.mongodb.com/manual/reference/method/ObjectId/\">12-byte hexadecimal string</a>) of the issue</p>"
          }
        ],
        "Request body": [
          {
            "group": "Request body",
            "type": "String",
            "size": "0..1000",
            "optional": true,
            "field": "description",
            "description": "<p>A detailed description of the issue</p>"
          },
          {
            "group": "Request body",
            "type": "String",
            "size": "0..500",
            "optional": true,
            "field": "imageUrl",
            "description": "<p>A URL to a picture of the issue</p>"
          },
          {
            "group": "Request body",
            "type": "Point",
            "optional": true,
            "field": "geolocation",
            "description": "<p>A <a href=\"https://docs.mongodb.com/manual/reference/geojson/#point\">GeoJSON point</a> indicating where the issue is, e.g. :</p> <p><code>{ type: &quot;Point&quot;, coordinates: [ 40, 5 ] }</code></p>"
          },
          {
            "group": "Request body",
            "type": "String[]",
            "optional": true,
            "field": "tags",
            "description": "<p>User-defined tags to describe the issue (e.g. &quot;accident&quot;, &quot;broken&quot;)</p>"
          },
          {
            "group": "Request body",
            "type": "String",
            "optional": false,
            "field": "userId",
            "description": "<p>Unique identifier (<a href=\"https://docs.mongodb.com/manual/reference/method/ObjectId/\">12-byte hexadecimal string</a>) of an existing user, e.g. : <code>507f191e810c19729de860ea</code></p>"
          },
          {
            "group": "Request body",
            "type": "String",
            "allowedValues": [
              "\"new\"",
              "\"inProgress\"",
              "\"canceled\"",
              "\"completed\""
            ],
            "optional": true,
            "field": "status",
            "description": "<p>The status of the issue:</p> <ul> <li>Defaults to <code>&quot;new&quot;</code> when the issue is created</li> <li>Change from <code>&quot;new&quot;</code> to <code>&quot;inProgress&quot;</code> to indicate that a city employee is working on the issue</li> <li>Change from <code>&quot;new&quot;</code> or <code>&quot;inProgress&quot;</code> to <code>&quot;canceled&quot;</code> to indicate that a city employee has determined this is not a real issue</li> <li>Change from <code>&quot;inProgress&quot;</code> to <code>&quot;completed&quot;</code> to indicate that the issue has been resolved</li> </ul>"
          }
        ]
      }
    },
    "filename": "routes/issues.js",
    "groupTitle": "Issue",
    "error": {
      "fields": {
        "Error 4xx": [
          {
            "group": "Error 4xx",
            "type": "Object",
            "optional": false,
            "field": "404/NotFound",
            "description": "<p>The id specified is well-formed but no issue was found with this id.</p>"
          },
          {
            "group": "Error 4xx",
            "type": "Object",
            "optional": false,
            "field": "422/UnprocessableEntity",
            "description": "<p>The specified issueId is invalid</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "404 Not Found",
          "content": "HTTP/1.1 404 Not Found\nContent-Type: application/json\n\n{\n    \"message\": \"No issue found with ID 5aaf71ca3ad2ed2160c93638\"\n}",
          "type": "json"
        },
        {
          "title": "422 Unprocessable Entity",
          "content": "HTTP/1.1 422 Unprocessable Entity\nContent-Type: application/json\n\n{\n   \"message\": \"Issue validation failed: issueId: Path `issueId` is invalid.\"\n}",
          "type": "json"
        }
      ]
    }
  },
  {
    "type": "post",
    "url": "/issues",
    "title": "Create a new issue",
    "name": "PostIssue",
    "group": "Issue",
    "version": "1.0.0",
    "description": "<p>Registers a new issue.</p>",
    "examples": [
      {
        "title": "Example",
        "content": "POST /issues HTTP/1.1\nContent-Type: application/json\n\n{\n  \"description\": \"Il y a un campement de canards sans-papiers près du canal.\",\n  \"imageUrl\": \"https://www.example.com/image98.jpg\",\n  \"geolocation\": {\n      \"type\": \"Point\",\n      \"coordinates\": [\n          46.780345,\n          6.637863\n      ]\n  },\n  \"tags\": [\n      \"canard\",\n      \"canal\",\n      \"spécisme\"\n  ],\n  \"userId\": \"5aabe03a68f49609145bfcd2\"\n}",
        "type": "json"
      }
    ],
    "success": {
      "examples": [
        {
          "title": "201 Created",
          "content": "HTTP/1.1 201 Created\nContent-Type: application/json\n\n{\n    \"description\": \"Il y a un campement de canards sans-papiers près du canal.\",\n    \"imageUrl\": \"https://www.example.com/image98.jpg\",\n    \"geolocation\": {\n        \"type\": \"Point\",\n        \"coordinates\": [\n            46.780345,\n            6.637863\n        ]\n    },\n    \"tags\": [\n        \"canard\",\n        \"canal\",\n        \"spécisme\"\n    ],\n    \"status\": \"new\",\n    \"createdAt\": \"2018-03-19T14:33:22.986Z\",\n    \"updatedAt\": \"2018-03-19T14:33:22.986Z\",\n    \"links\": [\n        {\n            \"rel\": \"self\",\n            \"href\": \"/issues/5aafca325d2af51c587c49fa\"\n        },\n        {\n            \"rel\": \"user\",\n            \"href\": \"/users/5aabe03a68f49609145bfcd2\"\n        }\n    ]\n}",
          "type": "json"
        }
      ],
      "fields": {
        "Response body": [
          {
            "group": "Response body",
            "type": "String",
            "optional": true,
            "field": "description",
            "description": "<p>A detailed description of the issue</p>"
          },
          {
            "group": "Response body",
            "type": "String",
            "optional": true,
            "field": "imageUrl",
            "description": "<p>A URL to a picture of the issue</p>"
          },
          {
            "group": "Response body",
            "type": "Point",
            "optional": false,
            "field": "geolocation",
            "description": "<p>A <a href=\"https://docs.mongodb.com/manual/reference/geojson/#point\">GeoJSON point</a> indicating where the issue is</p>"
          },
          {
            "group": "Response body",
            "type": "String[]",
            "optional": false,
            "field": "tags",
            "description": "<p>User-defined tags to describe the issue. If no tag has been specified, returns an empty array: <code>&quot;tags&quot;: []</code>.</p>"
          },
          {
            "group": "Response body",
            "type": "Object[]",
            "optional": false,
            "field": "links",
            "description": "<p>An array of two objects with two properties each:</p> <ul> <li><code>rel</code>: relationship between the issue and the linked resource, either <code>self</code> or <code>user</code>.</li> <li><code>href</code>: relative hyperlink reference to the linked resource within the API context</li> </ul>"
          },
          {
            "group": "Response body",
            "type": "Date",
            "optional": false,
            "field": "createdAt",
            "description": "<p>The date at which the issue was reported</p>"
          },
          {
            "group": "Response body",
            "type": "Date",
            "optional": false,
            "field": "updatedAt",
            "description": "<p>The date at which the issue was last modified</p>"
          },
          {
            "group": "Response body",
            "type": "String",
            "optional": false,
            "field": "status",
            "description": "<p>The status of the issue</p>"
          }
        ]
      }
    },
    "filename": "routes/issues.js",
    "groupTitle": "Issue",
    "parameter": {
      "fields": {
        "Request body": [
          {
            "group": "Request body",
            "type": "String",
            "size": "0..1000",
            "optional": true,
            "field": "description",
            "description": "<p>A detailed description of the issue</p>"
          },
          {
            "group": "Request body",
            "type": "String",
            "size": "0..500",
            "optional": true,
            "field": "imageUrl",
            "description": "<p>A URL to a picture of the issue</p>"
          },
          {
            "group": "Request body",
            "type": "Point",
            "optional": false,
            "field": "geolocation",
            "description": "<p>A <a href=\"https://docs.mongodb.com/manual/reference/geojson/#point\">GeoJSON point</a> indicating where the issue is, e.g. :</p> <p><code>{ type: &quot;Point&quot;, coordinates: [ 40, 5 ] }</code></p>"
          },
          {
            "group": "Request body",
            "type": "String[]",
            "optional": true,
            "field": "tags",
            "description": "<p>User-defined tags to describe the issue (e.g. &quot;accident&quot;, &quot;broken&quot;)</p>"
          },
          {
            "group": "Request body",
            "type": "String",
            "optional": false,
            "field": "userId",
            "description": "<p>Unique identifier (<a href=\"https://docs.mongodb.com/manual/reference/method/ObjectId/\">12-byte hexadecimal string</a>) of an existing user, e.g. : <code>507f191e810c19729de860ea</code></p>"
          },
          {
            "group": "Request body",
            "type": "String",
            "allowedValues": [
              "\"new\""
            ],
            "optional": true,
            "field": "status",
            "description": "<p>The status of the issue. If not specified, defaults to <code>&quot;new&quot;</code> when the issue is created.</p>"
          }
        ]
      }
    },
    "error": {
      "fields": {
        "Error 4xx": [
          {
            "group": "Error 4xx",
            "type": "Object",
            "optional": false,
            "field": "422/UnprocessableEntity",
            "description": "<p>Some of the issue's properties are invalid</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "422 Unprocessable Entity",
          "content": "HTTP/1.1 422 Unprocessable Entity\nContent-Type: application/json\n\n{\n   \"message\": \"Issue validation failed: userId: Path `userId` is required.\"\n}",
          "type": "json"
        }
      ]
    }
  },
  {
    "type": "delete",
    "url": "/users/:id",
    "title": "Delete a user",
    "name": "DeleteUser",
    "group": "User",
    "version": "1.0.0",
    "description": "<p>Delete a single user.</p>",
    "examples": [
      {
        "title": "Example",
        "content": "DELETE /users/5aaf71ca3ad2ed2160c93639 HTTP/1.1",
        "type": "json"
      }
    ],
    "success": {
      "examples": [
        {
          "title": "Success Response",
          "content": "HTTP/1.1 204 No content\nContent-Type: application/json",
          "type": "json"
        }
      ]
    },
    "parameter": {
      "fields": {
        "URL path parameters": [
          {
            "group": "URL path parameters",
            "type": "String",
            "optional": false,
            "field": "id",
            "description": "<p>Unique identifier (<a href=\"https://docs.mongodb.com/manual/reference/method/ObjectId/\">12-byte hexadecimal string</a>) of the user, e.g. : <code>507f191e810c19729de860ea</code></p>"
          }
        ]
      }
    },
    "filename": "routes/users.js",
    "groupTitle": "User"
  },
  {
    "type": "get",
    "url": "/users/:id",
    "title": "Retrieve a user",
    "name": "GetUser",
    "group": "User",
    "version": "1.0.0",
    "description": "<p>Retrieves a single user.</p>",
    "examples": [
      {
        "title": "Example",
        "content": "GET /users/5aabe04b68f49609145bfcd3 HTTP/1.1",
        "type": "json"
      }
    ],
    "parameter": {
      "fields": {
        "URL path parameters": [
          {
            "group": "URL path parameters",
            "type": "String",
            "optional": false,
            "field": "id",
            "description": "<p>Unique identifier (<a href=\"https://docs.mongodb.com/manual/reference/method/ObjectId/\">12-byte hexadecimal string</a>) of the user</p>"
          }
        ]
      }
    },
    "success": {
      "examples": [
        {
          "title": "200 OK",
          "content": "HTTP/1.1 200 OK\nContent-Type: application/json\n\n{\n    \"role\": \"citizen\",\n    \"firstName\": \"Bob\",\n    \"lastName\": \"Lesponge\",\n    \"createdAt\": \"2018-03-16T15:18:35.754Z\",\n    \"updatedAt\": \"2018-03-16T15:18:35.754Z\",\n    \"links\": [\n        {\n            \"rel\": \"self\",\n            \"href\": \"/users/5aabe04b68f49609145bfcd3\"\n        },\n        {\n            \"rel\": \"issues\",\n            \"href\": \"/issues/?user=5aabe04b68f49609145bfcd3\"\n        }\n    ],\n    \"issuesCount\": 2\n}",
          "type": "json"
        }
      ],
      "fields": {
        "Response body": [
          {
            "group": "Response body",
            "type": "String",
            "optional": false,
            "field": "role",
            "description": "<p>User's role (<code>&quot;manager&quot;</code> or <code>&quot;citizen&quot;</code>).</p>"
          },
          {
            "group": "Response body",
            "type": "String",
            "optional": false,
            "field": "firstName",
            "description": "<p>User's first name</p>"
          },
          {
            "group": "Response body",
            "type": "String",
            "optional": false,
            "field": "lastName",
            "description": "<p>User's last name</p>"
          },
          {
            "group": "Response body",
            "type": "Number",
            "optional": true,
            "field": "issuesCount",
            "description": "<p>Number of issues associated with this user</p>"
          },
          {
            "group": "Response body",
            "type": "Object[]",
            "optional": false,
            "field": "links",
            "description": "<p>An array of one or two objects with two properties each:</p> <ul> <li><code>rel</code>: relationship between the user and the linked resource, either <code>self</code> or <code>issues</code>.</li> <li><code>href</code>: relative hyperlink reference to the linked resource within the API context</li> </ul>"
          }
        ]
      }
    },
    "filename": "routes/users.js",
    "groupTitle": "User",
    "error": {
      "fields": {
        "Error 4xx": [
          {
            "group": "Error 4xx",
            "type": "Object",
            "optional": false,
            "field": "404/NotFound",
            "description": "<p>The id specified is well-formed but no user was found with this id.</p>"
          },
          {
            "group": "Error 4xx",
            "type": "Object",
            "optional": false,
            "field": "422/UnprocessableEntity",
            "description": "<p>The specified userId is invalid</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "404 Not Found",
          "content": "HTTP/1.1 404 Not Found\nContent-Type: application/json\n\n{\n    \"message\": \"No user found with ID 5aaf71ca3ad2ed2160c93638\"\n}",
          "type": "json"
        },
        {
          "title": "422 Unprocessable Entity",
          "content": "HTTP/1.1 422 Unprocessable Entity\nContent-Type: application/json\n\n{\n   \"message\": \"User validation failed: userId: Path `userId` is invalid.\"\n}",
          "type": "json"
        }
      ]
    }
  },
  {
    "type": "get",
    "url": "/users/",
    "title": "Retrieve the list of users",
    "name": "GetUsers",
    "group": "User",
    "version": "1.0.0",
    "description": "<p>Retrieves a list of users ordered by lastName (in ascendant order).</p>",
    "examples": [
      {
        "title": "Example",
        "content": "GET /users HTTP/1.1",
        "type": "json"
      }
    ],
    "success": {
      "examples": [
        {
          "title": "200 OK",
          "content": "HTTP/1.1 200 OK\nContent-Type: application/json\n\n[\n    {\n        \"role\": \"citizen\",\n        \"firstName\": \"Bob\",\n        \"lastName\": \"Lesponge\",\n        \"createdAt\": \"2018-03-16T15:18:35.754Z\",\n        \"updatedAt\": \"2018-03-16T15:18:35.754Z\",\n        \"links\": [\n            {\n                \"rel\": \"self\",\n                \"href\": \"/users/5aabe04b68f49609145bfcd3\"\n            },\n            {\n                \"rel\": \"issues\",\n                \"href\": \"/issues/?user=5aabe04b68f49609145bfcd3\"\n            }\n        ],\n        \"issuesCount\": 2\n    },\n    {\n        \"role\": \"citizen\",\n        \"firstName\": \"Marie-Jeanne\",\n        \"lastName\": \"Rochat\",\n        \"createdAt\": \"2018-03-19T15:30:37.133Z\",\n        \"updatedAt\": \"2018-03-19T15:30:37.133Z\",\n        \"links\": [\n            {\n                \"rel\": \"self\",\n                \"href\": \"/users/5aafd79d3c5f2f1f18e41593\"\n            }\n        ]\n    }\n]",
          "type": "json"
        }
      ],
      "fields": {
        "Response body": [
          {
            "group": "Response body",
            "type": "String",
            "optional": false,
            "field": "role",
            "description": "<p>User's role (<code>&quot;manager&quot;</code> or <code>&quot;citizen&quot;</code>).</p>"
          },
          {
            "group": "Response body",
            "type": "String",
            "optional": false,
            "field": "firstName",
            "description": "<p>User's first name</p>"
          },
          {
            "group": "Response body",
            "type": "String",
            "optional": false,
            "field": "lastName",
            "description": "<p>User's last name</p>"
          },
          {
            "group": "Response body",
            "type": "Number",
            "optional": true,
            "field": "issuesCount",
            "description": "<p>Number of issues associated with this user</p>"
          },
          {
            "group": "Response body",
            "type": "Object[]",
            "optional": false,
            "field": "links",
            "description": "<p>An array of one or two objects with two properties each:</p> <ul> <li><code>rel</code>: relationship between the user and the linked resource, either <code>self</code> or <code>issues</code>.</li> <li><code>href</code>: relative hyperlink reference to the linked resource within the API context</li> </ul>"
          }
        ]
      }
    },
    "filename": "routes/users.js",
    "groupTitle": "User"
  },
  {
    "type": "patch",
    "url": "/users/:id",
    "title": "Update a user",
    "name": "PatchUser",
    "group": "User",
    "version": "1.0.0",
    "description": "<p>Update a single user.</p>",
    "examples": [
      {
        "title": "Example",
        "content": "PATCH /users/5aabe03a68f49609145bfcd2 HTTP/1.1\n\n{\n\t\"lastName\": \"Dupont-Delamotte\"\n}",
        "type": "json"
      }
    ],
    "success": {
      "examples": [
        {
          "title": "200 OK",
          "content": "HTTP/1.1 200 OK\nContent-Type: application/json\n\n{\n    \"role\": \"manager\",\n    \"firstName\": \"Paul-Henri\",\n    \"lastName\": \"Dupont-Delamotte\",\n    \"createdAt\": \"2018-03-16T15:18:18.885Z\",\n    \"updatedAt\": \"2018-03-21T13:17:28.467Z\",\n    \"links\": [\n        {\n            \"rel\": \"self\",\n            \"href\": \"/users/5aabe03a68f49609145bfcd2\"\n        }\n    ]\n}",
          "type": "json"
        }
      ],
      "fields": {
        "Response body": [
          {
            "group": "Response body",
            "type": "String",
            "optional": false,
            "field": "role",
            "description": "<p>User's role (<code>&quot;manager&quot;</code> or <code>&quot;citizen&quot;</code>).</p>"
          },
          {
            "group": "Response body",
            "type": "String",
            "optional": false,
            "field": "firstName",
            "description": "<p>User's first name</p>"
          },
          {
            "group": "Response body",
            "type": "String",
            "optional": false,
            "field": "lastName",
            "description": "<p>User's last name</p>"
          },
          {
            "group": "Response body",
            "type": "Number",
            "optional": true,
            "field": "issuesCount",
            "description": "<p>Number of issues associated with this user</p>"
          },
          {
            "group": "Response body",
            "type": "Object[]",
            "optional": false,
            "field": "links",
            "description": "<p>An array of one or two objects with two properties each:</p> <ul> <li><code>rel</code>: relationship between the user and the linked resource, either <code>self</code> or <code>issues</code>.</li> <li><code>href</code>: relative hyperlink reference to the linked resource within the API context</li> </ul>"
          }
        ]
      }
    },
    "filename": "routes/users.js",
    "groupTitle": "User",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "String",
            "size": "2..20",
            "optional": true,
            "field": "firstName",
            "description": "<p>User's first name</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "size": "2..20",
            "optional": true,
            "field": "lastName",
            "description": "<p>User's last name</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "allowedValues": [
              "\"manager\"",
              "\"citizen\""
            ],
            "optional": true,
            "field": "role",
            "description": "<p>User's role. If not specified, defaults to <code>&quot;citizen&quot;</code> when the user is created.</p>"
          }
        ]
      }
    },
    "error": {
      "fields": {
        "Error 4xx": [
          {
            "group": "Error 4xx",
            "type": "Object",
            "optional": false,
            "field": "404/NotFound",
            "description": "<p>The id specified is well-formed but no user was found with this id.</p>"
          },
          {
            "group": "Error 4xx",
            "type": "Object",
            "optional": false,
            "field": "422/UnprocessableEntity",
            "description": "<p>The specified userId is invalid</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "404 Not Found",
          "content": "HTTP/1.1 404 Not Found\nContent-Type: application/json\n\n{\n    \"message\": \"No user found with ID 5aaf71ca3ad2ed2160c93638\"\n}",
          "type": "json"
        },
        {
          "title": "422 Unprocessable Entity",
          "content": "HTTP/1.1 422 Unprocessable Entity\nContent-Type: application/json\n\n{\n   \"message\": \"User validation failed: userId: Path `userId` is invalid.\"\n}",
          "type": "json"
        }
      ]
    }
  },
  {
    "type": "post",
    "url": "/users/",
    "title": "Create a new user",
    "name": "PostUser",
    "group": "User",
    "version": "1.0.0",
    "description": "<p>Registers a new issue.</p>",
    "examples": [
      {
        "title": "Example",
        "content": "POST /users HTTP/1.1\nContent-Type: application/json\n\n{\n\t\"firstName\": \"Marie-Jeanne\",\n\t\"lastName\": \"Rochat\",\n\t\"role\": \"citizen\"\n}",
        "type": "json"
      }
    ],
    "success": {
      "examples": [
        {
          "title": "201 Created",
          "content": "HTTP/1.1 201 Created\nContent-Type: application/json\n\n{\n    \"firstName\": \"Marie-Jeanne\",\n    \"lastName\": \"Rochat\",\n    \"role\": \"citizen\",\n    \"createdAt\": \"2018-03-19T15:30:37.133Z\",\n    \"updatedAt\": \"2018-03-19T15:30:37.133Z\",\n    \"links\": [\n        {\n            \"rel\": \"self\",\n            \"href\": \"/users/5aafd79d3c5f2f1f18e41593\"\n        }\n    ]\n}",
          "type": "json"
        }
      ],
      "fields": {
        "Response body": [
          {
            "group": "Response body",
            "type": "String",
            "optional": false,
            "field": "role",
            "description": "<p>User's role (<code>&quot;manager&quot;</code> or <code>&quot;citizen&quot;</code>).</p>"
          },
          {
            "group": "Response body",
            "type": "String",
            "optional": false,
            "field": "firstName",
            "description": "<p>User's first name</p>"
          },
          {
            "group": "Response body",
            "type": "String",
            "optional": false,
            "field": "lastName",
            "description": "<p>User's last name</p>"
          },
          {
            "group": "Response body",
            "type": "Number",
            "optional": true,
            "field": "issuesCount",
            "description": "<p>Number of issues associated with this user</p>"
          },
          {
            "group": "Response body",
            "type": "Object[]",
            "optional": false,
            "field": "links",
            "description": "<p>An array of one or two objects with two properties each:</p> <ul> <li><code>rel</code>: relationship between the user and the linked resource, either <code>self</code> or <code>issues</code>.</li> <li><code>href</code>: relative hyperlink reference to the linked resource within the API context</li> </ul>"
          }
        ]
      }
    },
    "error": {
      "fields": {
        "Error 4xx": [
          {
            "group": "Error 4xx",
            "type": "Object",
            "optional": false,
            "field": "422/UnprocessableEntity",
            "description": "<p>Some of the user's properties are invalid</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "422 Unprocessable Entity",
          "content": "HTTP/1.1 422 Unprocessable Entity\nContent-Type: application/json\n\n{\n    \"message\": \"User validation failed: lastName: Path `lastName` is required.\"\n}",
          "type": "json"
        }
      ]
    },
    "filename": "routes/users.js",
    "groupTitle": "User",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "String",
            "size": "2..20",
            "optional": false,
            "field": "firstName",
            "description": "<p>User's first name</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "size": "2..20",
            "optional": false,
            "field": "lastName",
            "description": "<p>User's last name</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "allowedValues": [
              "\"manager\"",
              "\"citizen\""
            ],
            "optional": true,
            "field": "role",
            "description": "<p>User's role. If not specified, defaults to <code>&quot;citizen&quot;</code> when the user is created.</p>"
          }
        ]
      }
    }
  }
] });
