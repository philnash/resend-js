# 📧 ResendJS 📧

This is a module that uses native JavaScript `fetch` to make requests to the [Resend API](https://resend.com/) and no other modules that require Node.js specific features. The intention is to support platforms that support web platform features like `fetch` but do not have Node.js APIs like `http`, like [Deno](https://deno.land/) or [Cloudflare Workers](https://workers.cloudflare.com/).

It is written in Deno and will be transpiled to JavaScript. It is intended to work in a similar method to the [Resend Node module](https://github.com/resendlabs/resend-node), though there are expected to be slight differences.

---

[![Quality Gate Status](https://sonarcloud.io/api/project_badges/measure?project=philnash_resend-fetch&metric=alert_status)](https://sonarcloud.io/summary/new_code?id=philnash_resend-fetch) [![Maintainability Rating](https://sonarcloud.io/api/project_badges/measure?project=philnash_resend-fetch&metric=sqale_rating)](https://sonarcloud.io/summary/new_code?id=philnash_resend-fetch)  [![Test status](https://github.com/philnash/resend-fetch/actions/workflows/test.yml/badge.svg)](https://github.com/philnash/resend-fetch/actions/workflows/test.yml)

---

* [📧 ResendJS 📧](#-resendjs-)
  * [Usage](#usage)
    * [Installation](#installation)
      * [JavaScript](#javascript)
      * [Deno](#deno)
    * [Examples](#examples)
      * [Authenticate the client](#authenticate-the-client)
        * [JavaScript](#javascript-1)
        * [Deno](#deno-1)
      * [Send an email](#send-an-email)
  * [Contributing](#contributing)
    * [Running the project](#running-the-project)
    * [Running the tests](#running-the-tests)
  * [License](#license)

## Usage

To use this library you will need a [Resend account](https://resend.com/signup) and a Resend API key.

### Installation

#### JavaScript

Install with your favourite package manager:

```sh
npm install resend-js

yarn add resend-js

pnpm add resend-js
```

#### Deno

There's no need to install, just import it from it's URL:

```typescript
import { Resend } from "https://deno.land/x/resend-js/mod.ts";
```

### Examples

#### Authenticate the client

You will need an [API key for your Resend account](https://resend.com/api-keys). Then, import the module and create a new client.

##### JavaScript

```typescript
import { Resend } from "resend-js";

const apiKey = process.env.RESEND_API_KEY;

const resend = new Resend(apiKey);
```

##### Deno

```typescript
import { Resend } from "https://deno.land/x/resend-js/mod.ts";

const apiKey = Deno.env.get("RESEND_API_KEY");

const resend = new Resend(apiKey);
```

#### Send an email

You will need the contents of your email in text, HTML, or both.

```typescript
resend.emails.send({
  from: "from@example.com",
  to: "to@example.com",
  subject: "Hello, World!",
  html: "<h1>Hello, World!</h1><p>This is my first email sent with ResendJS</p>",
});
```

Note: resend-node supports rendering React emails using [React Email](https://react.email/), but ResendJS does not.

## Contributing

Bug reports and pull requests are welcome on GitHub at https://github.com/philnash/resend-fetch.

### Running the project

Fork and clone the project.

The project is written with [Deno](https://deno.com/), so you will need to install the Deno runtime.

### Running the tests

You can run the tests with the Deno task:

```sh
deno task test
```

## License

This code is available as open source under the terms of the [MIT License](https://opensource.org/licenses/MIT).