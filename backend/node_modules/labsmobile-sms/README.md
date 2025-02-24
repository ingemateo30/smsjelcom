<p align="center">
  <img src="https://avatars.githubusercontent.com/u/152215067?s=200&v=4" height="80">
</p>

# LabsMobile-Node

![](https://img.shields.io/badge/version-1.0.1-blue.svg)

Send SMS messages through the LabsMobile platform and the node library.

## Documentation

- Labsmobile API documentation can be found [here][apidocs].

## Features

- Send SMS messages.
- Get account credits
- Get prices by country
- Manage scheduled sendings
- HLR Request (Check mobile)

## Requirements

- A user account with LabsMobile. Click on the link to create an account [here][signUp].
- This library supports node v16.19.0 and higher versions of node.

## Installation

To install the [labsmobile-sms][packages] library, it is recommended to use [npm][getnpm].

### Installation command

```
npm i labsmobile-sms
```

### Installation by modifying the composer.json file

```
"dependencies": {
	"labsmobile-sms": "1.0.1"
}
```

## Examples of use cases

**Send SMS**

Here is an example of using the library to send a SMS:

```javascript
const LabsMobileClient = require("labsmobile-sms/src/LabsMobileClient");
const LabsMobileModelTextMessage = require("labsmobile-sms/src/LabsMobileModelTextMessage");
const ParametersException = require("labsmobile-sms/src/Exception/ParametersException");
const RestException = require("labsmobile-sms/src/Exception/RestException");

async function sendSms() {
  try {
    const username = "myusername";
    const token = "mytoken";
    const message = "Test SMS";
    const phone = ["34XXXXXXXXX"];
    const clientLabsMobile = new LabsMobileClient(username, token);
    const bodySms = new LabsMobileModelTextMessage(phone, message);
    const response = await clientLabsMobile.sendSms(bodySms);
    console.log(response);
  } catch (error) {
    if (error instanceof ParametersException) {
      console.log(error.message);
    } else if (error instanceof RestException) {
      console.log(`Error: ${error.status} - ${error.message}`);
    } else {
      throw new Error("Error: " + error);
    }
  }
}
```

**Get account credits**

Here is an example to learn credits for an existing account:

```javascript
const LabsMobileClient = require("labsmobile-sms/src/LabsMobileClient");
const ParametersException = require("labsmobile-sms/src/Exception/ParametersException");
const RestException = require("labsmobile-sms/src/Exception/RestException");

async function getCreditTest() {
  try {
    const username = "myusername";
    const token = "mytoken";
    const clientLabsMobile = new LabsMobileClient(username, token);
    const response = await clientLabsMobile.getCredit();
    console.log(response);
  } catch (error) {
    if (error instanceof ParametersException) {
      console.log(error.message);
    } else if (error instanceof RestException) {
      console.log(`Error: ${error.status} - ${error.message}`);
    } else {
      throw new Error("Error: " + error);
    }
  }
}
```

**Manage scheduled sendings**

Here is an example you can cancel or execute the scheduled sendings that are pending for execution:

```javascript
const LabsMobileClient = require("labsmobile-sms/src/LabsMobileClient");
const LabsMobileModelScheduledSendings = require("labsmobile-sms/src/LabsMobileModelScheduledSendings");
const ParametersException = require("labsmobile-sms/src/Exception/ParametersException");
const RestException = require("labsmobile-sms/src/Exception/RestException");

async function scheduledSendingsTest() {
  try {
    const username = "myusername";
    const token = "mytoken";
    const subid = "mysubid";
    const cmd = "XXXXXX"; // send or cancel
    const clientLabsMobile = new LabsMobileClient(username, token);
    const scheduledSendings = new LabsMobileModelScheduledSendings(subid, cmd);
    const response = await clientLabsMobile.scheduledSendings(
      scheduledSendings
    );
    console.log(response);
  } catch (error) {
    if (error instanceof ParametersException) {
      console.log(error.message);
    } else if (error instanceof RestException) {
      console.log(`Error: ${error.status} - ${error.message}`);
    } else {
      throw new Error("Error: " + error);
    }
  }
}
```

**Get prices by country**

Here is an example to know the credits that a single sending will take depending on the country of delivery:

```javascript
const LabsMobileClient = require("labsmobile-sms/src/LabsMobileClient");
const LabsMobileModelCountryPrice = require("labsmobile-sms/src/LabsMobileModelCountryPrice");
const ParametersException = require("labsmobile-sms/src/Exception/ParametersException");
const RestException = require("labsmobile-sms/src/Exception/RestException");

async function getpricesCountryTest() {
  try {
    const username = "myusername";
    const token = "mytoken";
    const countries = ["CO", "ES"];
    const clientLabsMobile = new LabsMobileClient(username, token);
    const countriesPrice = new LabsMobileModelCountryPrice(countries);
    const response = await clientLabsMobile.getpricesCountry(countriesPrice);
    console.log(response);
  } catch (error) {
    if (error instanceof ParametersException) {
      console.log(error.message);
    } else if (error instanceof RestException) {
      console.log(`Error: ${error.status} - ${error.message}`);
    } else {
      throw new Error("Error: " + error);
    }
  }
}
```

**HLR Request**

Here is an example queries the mobile phone status with the related information like current operator, format, active, ported information, subscription country, etc:

```javascript
const LabsMobileClient = require("labsmobile-sms/src/LabsMobileClient");
const LabsMobileModelHlrRequest = require("labsmobile-sms/src/LabsMobileModelHlrRequest");
const ParametersException = require("labsmobile-sms/src/Exception/ParametersException");
const RestException = require("labsmobile-sms/src/Exception/RestException");

async function hlrRequestTest() {
  try {
    const username = "myusername";
    const token = "mytoken";
    const numbers = [];
    const clientLabsMobile = new LabsMobileClient(username, token);
    const hlr = new LabsMobileModelHlrRequest(numbers);
    const response = await clientLabsMobile.hlrRequest(hlr);
    console.log(response);
  } catch (error) {
    if (error instanceof ParametersException) {
      console.log(error.message);
    } else if (error instanceof RestException) {
      console.log(`Error: ${error.status} - ${error.message}`);
    } else {
      throw new Error("Error: " + error);
    }
  }
}
```

## Help

If you have questions, you can contact us through the support chat or through the support email support@labsmobile.com.

[apidocs]: https://apidocs.labsmobile.com/
[signUp]: https://www.labsmobile.com/en/signup
[packages]: https://www.npmjs.com/package/labsmobile-sms
[getnpm]: https://docs.npmjs.com/downloading-and-installing-node-js-and-npm
